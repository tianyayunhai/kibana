/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { estypes } from '@elastic/elasticsearch';
import { JsonObject } from '@kbn/utility-types';
import { LogColumn, LogEntry, LogEntryCursor } from '../../../../common/log_entry';
import {
  LogViewColumnConfiguration,
  logViewFieldColumnConfigurationRT,
  LogViewReference,
  ResolvedLogView,
} from '../../../../common/log_views';
import { decodeOrThrow } from '../../../../common/runtime_types';
import { getBuiltinRules } from '../../../services/log_entries/message/builtin_rules';
import {
  CompiledLogMessageFormattingRule,
  compileFormattingRules,
  Fields,
  Highlights,
} from '../../../services/log_entries/message/message';
import type { LogsSharedPluginRequestHandlerContext } from '../../../types';
import { LogsSharedBackendLibs } from '../../logs_shared_types';
import {
  CompositeDatasetKey,
  createLogEntryDatasetsQuery,
  LogEntryDatasetBucket,
  logEntryDatasetsResponseRT,
} from './queries/log_entry_datasets';

export interface LogEntriesParams {
  startTimestamp: number;
  endTimestamp: number;
  size?: number;
  query?: JsonObject;
  cursor?: { before: LogEntryCursor | 'last' } | { after: LogEntryCursor | 'first' };
  highlightTerm?: string;
}

export const LOG_ENTRIES_PAGE_SIZE = 200;

const FIELDS_FROM_CONTEXT = ['log.file.path', 'host.name', 'container.id'] as const;

const COMPOSITE_AGGREGATION_BATCH_SIZE = 1000;

export interface ILogsSharedLogEntriesDomain {
  getLogEntries(
    requestContext: LogsSharedPluginRequestHandlerContext,
    logView: LogViewReference,
    params: LogEntriesParams,
    columnOverrides?: LogViewColumnConfiguration[]
  ): Promise<{ entries: LogEntry[]; hasMoreBefore?: boolean; hasMoreAfter?: boolean }>;
  getLogEntryDatasets(
    requestContext: LogsSharedPluginRequestHandlerContext,
    timestampField: string,
    indexName: string,
    startTime: number,
    endTime: number,
    runtimeMappings: estypes.MappingRuntimeFields
  ): Promise<string[]>;
}

export class LogsSharedLogEntriesDomain implements ILogsSharedLogEntriesDomain {
  constructor(
    private readonly adapter: LogEntriesAdapter,
    private readonly libs: Pick<LogsSharedBackendLibs, 'framework' | 'getStartServices'>
  ) {}

  public async getLogEntries(
    requestContext: LogsSharedPluginRequestHandlerContext,
    logView: LogViewReference,
    params: LogEntriesParams,
    columnOverrides?: LogViewColumnConfiguration[]
  ): Promise<{ entries: LogEntry[]; hasMoreBefore?: boolean; hasMoreAfter?: boolean }> {
    const [, { logsDataAccess }, { logViews }] = await this.libs.getStartServices();
    const { savedObjects, elasticsearch } = await requestContext.core;
    const logSourcesService = logsDataAccess.services.logSourcesServiceFactory.getLogSourcesService(
      savedObjects.client
    );
    const resolvedLogView = await logViews
      .getClient(savedObjects.client, elasticsearch.client.asCurrentUser, logSourcesService)
      .getResolvedLogView(logView);
    const columnDefinitions = columnOverrides ?? resolvedLogView.columns;

    const messageFormattingRules = compileFormattingRules(
      getBuiltinRules(resolvedLogView.messageField)
    );

    const requiredFields = getRequiredFields(resolvedLogView, messageFormattingRules);

    const { documents, hasMoreBefore, hasMoreAfter } = await this.adapter.getLogEntries(
      requestContext,
      resolvedLogView,
      requiredFields,
      params
    );

    const entries = documents.map((doc) => {
      return {
        id: doc.id,
        index: doc.index,
        cursor: doc.cursor,
        columns: columnDefinitions.map((column): LogColumn => {
          if ('timestampColumn' in column) {
            return {
              columnId: column.timestampColumn.id,
              time: doc.cursor.time,
            };
          } else if ('messageColumn' in column) {
            return {
              columnId: column.messageColumn.id,
              message: messageFormattingRules.format(doc.fields, doc.highlights),
            };
          } else {
            return {
              columnId: column.fieldColumn.id,
              field: column.fieldColumn.field,
              value: doc.fields[column.fieldColumn.field] ?? [],
              highlights: doc.highlights[column.fieldColumn.field] ?? [],
            };
          }
        }),
        context: getContextFromDoc(doc),
      };
    });

    return { entries, hasMoreBefore, hasMoreAfter };
  }

  public async getLogEntryDatasets(
    requestContext: LogsSharedPluginRequestHandlerContext,
    timestampField: string,
    indexName: string,
    startTime: number,
    endTime: number,
    runtimeMappings: estypes.MappingRuntimeFields
  ) {
    let datasetBuckets: LogEntryDatasetBucket[] = [];
    let afterLatestBatchKey: CompositeDatasetKey | undefined;

    while (true) {
      const datasetsReponse = await this.libs.framework.callWithRequest(
        requestContext,
        'search',
        createLogEntryDatasetsQuery(
          indexName,
          timestampField,
          startTime,
          endTime,
          runtimeMappings,
          COMPOSITE_AGGREGATION_BATCH_SIZE,
          afterLatestBatchKey
        )
      );

      const { after_key: afterKey, buckets: latestBatchBuckets } = decodeOrThrow(
        logEntryDatasetsResponseRT
      )(datasetsReponse).aggregations.dataset_buckets;

      datasetBuckets = [...datasetBuckets, ...latestBatchBuckets];
      afterLatestBatchKey = afterKey;

      if (latestBatchBuckets.length < COMPOSITE_AGGREGATION_BATCH_SIZE) {
        break;
      }
    }

    return datasetBuckets.map(({ key: { dataset } }) => dataset);
  }
}

export interface LogEntriesAdapter {
  getLogEntries(
    requestContext: LogsSharedPluginRequestHandlerContext,
    resolvedLogView: ResolvedLogView,
    fields: string[],
    params: LogEntriesParams
  ): Promise<{ documents: LogEntryDocument[]; hasMoreBefore?: boolean; hasMoreAfter?: boolean }>;
}

export type LogEntryQuery = JsonObject;

export interface LogEntryDocument {
  id: string;
  index: string;
  fields: Fields;
  highlights: Highlights;
  cursor: LogEntryCursor;
}

const getRequiredFields = (
  configuration: ResolvedLogView,
  messageFormattingRules: CompiledLogMessageFormattingRule
): string[] => {
  const fieldsFromCustomColumns = configuration.columns.reduce<string[]>(
    (accumulatedFields, logColumn) => {
      if (logViewFieldColumnConfigurationRT.is(logColumn)) {
        return [...accumulatedFields, logColumn.fieldColumn.field];
      }
      return accumulatedFields;
    },
    []
  );
  const fieldsFromFormattingRules = messageFormattingRules.requiredFields;

  return Array.from(
    new Set([...fieldsFromCustomColumns, ...fieldsFromFormattingRules, ...FIELDS_FROM_CONTEXT])
  );
};

const getContextFromDoc = (doc: LogEntryDocument): LogEntry['context'] => {
  // Get all context fields, then test for the presence and type of the ones that go together
  const containerId = doc.fields['container.id']?.[0];
  const hostName = doc.fields['host.name']?.[0];
  const logFilePath = doc.fields['log.file.path']?.[0];

  if (typeof containerId === 'string') {
    return { 'container.id': containerId };
  }

  if (typeof hostName === 'string' && typeof logFilePath === 'string') {
    return { 'host.name': hostName, 'log.file.path': logFilePath };
  }

  return {};
};
