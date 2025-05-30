/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  ConnectorStatus,
  DisplayType,
  FieldType,
  FilteringValidationState,
  SyncStatus,
  ConnectorViewIndex,
  IngestionStatus,
  IngestionMethod,
  ApiViewIndex,
} from '@kbn/search-connectors';

export const apiIndex: ApiViewIndex = {
  count: 1,
  hidden: false,
  ingestionMethod: IngestionMethod.API,
  ingestionStatus: IngestionStatus.CONNECTED,
  lastUpdated: null,
  name: 'api',
  total: {
    docs: {
      count: 1,
      deleted: 0,
    },
    store: { size_in_bytes: '8024' },
  },
};

export const connectorIndex: ConnectorViewIndex = {
  connector: {
    api_key_id: null,
    api_key_secret_id: null,
    configuration: {
      foo: {
        default_value: '',
        depends_on: [],
        display: DisplayType.TEXTBOX,
        label: 'bar',
        options: [],
        order: 1,
        required: false,
        sensitive: false,
        tooltip: '',
        type: FieldType.STRING,
        ui_restrictions: [],
        validations: [],
        value: 'barbar',
      },
    },
    custom_scheduling: {
      foo: {
        configuration_overrides: {},
        enabled: false,
        interval: '',
        last_synced: null,
        name: '',
      },
    },
    deleted: false,
    description: null,
    error: null,
    features: null,
    filtering: [
      {
        active: {
          advanced_snippet: {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            value: {},
          },
          rules: [
            {
              created_at: expect.any(String),
              field: '_',
              id: 'DEFAULT',
              order: 0,
              policy: 'include',
              rule: 'regex',
              updated_at: expect.any(String),
              value: '.*',
            },
          ],
          validation: {
            errors: [],
            state: FilteringValidationState.VALID,
          },
        },
        domain: 'DEFAULT',
        draft: {
          advanced_snippet: {
            created_at: expect.any(String),
            updated_at: expect.any(String),
            value: {},
          },
          rules: [
            {
              created_at: expect.any(String),
              field: '_',
              id: 'DEFAULT',
              order: 0,
              policy: 'include',
              rule: 'regex',
              updated_at: expect.any(String),
              value: '.*',
            },
          ],
          validation: {
            errors: [],
            state: FilteringValidationState.VALID,
          },
        },
      },
    ],
    id: '2',
    index_name: 'connector',
    is_native: false,
    language: 'en',
    last_access_control_sync_error: null,
    last_access_control_sync_scheduled_at: null,
    last_access_control_sync_status: SyncStatus.COMPLETED,
    last_deleted_document_count: null,
    last_incremental_sync_scheduled_at: null,
    last_indexed_document_count: null,
    last_seen: null,
    last_sync_error: null,
    last_sync_scheduled_at: null,
    last_sync_status: SyncStatus.COMPLETED,
    last_synced: null,
    name: 'connector',
    scheduling: {
      access_control: {
        enabled: false,
        interval: '',
      },
      full: {
        enabled: false,
        interval: '',
      },
      incremental: {
        enabled: false,
        interval: '',
      },
    },
    service_type: null,
    status: ConnectorStatus.CONFIGURED,
    sync_now: false,
  },
  count: 1,
  hidden: false,
  ingestionMethod: IngestionMethod.CONNECTOR,
  ingestionStatus: IngestionStatus.CONFIGURED,
  lastUpdated: 'never',
  name: 'connector',
  total: {
    docs: {
      count: 1,
      deleted: 0,
    },
    store: { size_in_bytes: '8024' },
  },
};

export const elasticsearchViewIndices = [apiIndex, connectorIndex];
