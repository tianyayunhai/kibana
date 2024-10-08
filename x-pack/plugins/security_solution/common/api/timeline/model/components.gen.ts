/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Shared Timeline Components
 *   version: not applicable
 */

import { z } from '@kbn/zod';

/**
 * The type of timeline to create. Valid values are `default` and `template`.
 */
export type TimelineType = z.infer<typeof TimelineType>;
export const TimelineType = z.enum(['default', 'template']);
export type TimelineTypeEnum = typeof TimelineType.enum;
export const TimelineTypeEnum = TimelineType.enum;

/**
 * The type of data provider to create. Valid values are `default` and `template`.
 */
export type DataProviderType = z.infer<typeof DataProviderType>;
export const DataProviderType = z.enum(['default', 'template']);
export type DataProviderTypeEnum = typeof DataProviderType.enum;
export const DataProviderTypeEnum = DataProviderType.enum;

/**
 * The type of the timeline template.
 */
export type TemplateTimelineType = z.infer<typeof TemplateTimelineType>;
export const TemplateTimelineType = z.enum(['elastic', 'custom']);
export type TemplateTimelineTypeEnum = typeof TemplateTimelineType.enum;
export const TemplateTimelineTypeEnum = TemplateTimelineType.enum;

export type ColumnHeaderResult = z.infer<typeof ColumnHeaderResult>;
export const ColumnHeaderResult = z.object({
  aggregatable: z.boolean().optional(),
  category: z.string().optional(),
  columnHeaderType: z.string().optional(),
  description: z.string().optional(),
  example: z.union([z.string(), z.number()]).optional(),
  indexes: z.array(z.string()).optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  placeholder: z.string().optional(),
  searchable: z.boolean().optional(),
  type: z.string().optional(),
});

export type QueryMatchResult = z.infer<typeof QueryMatchResult>;
export const QueryMatchResult = z.object({
  field: z.string().nullable().optional(),
  displayField: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  displayValue: z.string().nullable().optional(),
  operator: z.string().nullable().optional(),
});

export type DataProviderQueryMatch = z.infer<typeof DataProviderQueryMatch>;
export const DataProviderQueryMatch = z.object({
  enabled: z.boolean().nullable().optional(),
  excluded: z.boolean().nullable().optional(),
  id: z.string().nullable().optional(),
  kqlQuery: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  queryMatch: QueryMatchResult.optional(),
});

export type DataProviderResult = z.infer<typeof DataProviderResult>;
export const DataProviderResult = z.object({
  and: z.array(DataProviderQueryMatch).nullable().optional(),
  enabled: z.boolean().nullable().optional(),
  excluded: z.boolean().nullable().optional(),
  id: z.string().nullable().optional(),
  kqlQuery: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  queryMatch: QueryMatchResult.nullable().optional(),
  type: DataProviderType.nullable().optional(),
});

export type RowRendererId = z.infer<typeof RowRendererId>;
export const RowRendererId = z.enum([
  'alert',
  'alerts',
  'auditd',
  'auditd_file',
  'library',
  'netflow',
  'plain',
  'registry',
  'suricata',
  'system',
  'system_dns',
  'system_endgame_process',
  'system_file',
  'system_fim',
  'system_security_event',
  'system_socket',
  'threat_match',
  'zeek',
]);
export type RowRendererIdEnum = typeof RowRendererId.enum;
export const RowRendererIdEnum = RowRendererId.enum;

export type FavoriteTimelineResult = z.infer<typeof FavoriteTimelineResult>;
export const FavoriteTimelineResult = z.object({
  fullName: z.string().nullable().optional(),
  userName: z.string().nullable().optional(),
  favoriteDate: z.number().nullable().optional(),
});

export type FilterTimelineResult = z.infer<typeof FilterTimelineResult>;
export const FilterTimelineResult = z.object({
  exists: z.boolean().optional(),
  meta: z
    .object({
      alias: z.string().optional(),
      controlledBy: z.string().optional(),
      disabled: z.boolean().optional(),
      field: z.string().optional(),
      formattedValue: z.string().optional(),
      index: z.string().optional(),
      key: z.string().optional(),
      negate: z.boolean().optional(),
      params: z.string().optional(),
      type: z.string().optional(),
      value: z.string().optional(),
    })
    .optional(),
  match_all: z.string().optional(),
  missing: z.string().optional(),
  query: z.string().optional(),
  range: z.string().optional(),
  script: z.string().optional(),
});

export type SerializedFilterQueryResult = z.infer<typeof SerializedFilterQueryResult>;
export const SerializedFilterQueryResult = z.object({
  filterQuery: z
    .object({
      kuery: z
        .object({
          kind: z.string().nullable().optional(),
          expression: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      serializedQuery: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type SortObject = z.infer<typeof SortObject>;
export const SortObject = z.object({
  columnId: z.string().nullable().optional(),
  columnType: z.string().nullable().optional(),
  sortDirection: z.string().nullable().optional(),
});

export type Sort = z.infer<typeof Sort>;
export const Sort = z.union([SortObject, z.array(SortObject)]);

export type SavedTimeline = z.infer<typeof SavedTimeline>;
export const SavedTimeline = z.object({
  columns: z.array(ColumnHeaderResult).nullable().optional(),
  created: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  dataProviders: z.array(DataProviderResult).nullable().optional(),
  dataViewId: z.string().nullable().optional(),
  dateRange: z
    .object({
      end: z.union([z.string(), z.number()]).optional(),
      start: z.union([z.string(), z.number()]).optional(),
    })
    .nullable()
    .optional(),
  description: z.string().nullable().optional(),
  eqlOptions: z
    .object({
      eventCategoryField: z.string().nullable().optional(),
      query: z.string().nullable().optional(),
      size: z.union([z.string().nullable(), z.number().nullable()]).optional(),
      tiebreakerField: z.string().nullable().optional(),
      timestampField: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  eventType: z.string().nullable().optional(),
  excludedRowRendererIds: z.array(RowRendererId).nullable().optional(),
  favorite: z.array(FavoriteTimelineResult).nullable().optional(),
  filters: z.array(FilterTimelineResult).nullable().optional(),
  kqlMode: z.string().nullable().optional(),
  kqlQuery: SerializedFilterQueryResult.nullable().optional(),
  indexNames: z.array(z.string()).nullable().optional(),
  savedSearchId: z.string().nullable().optional(),
  savedQueryId: z.string().nullable().optional(),
  sort: Sort.nullable().optional(),
  status: z.enum(['active', 'draft', 'immutable']).nullable().optional(),
  title: z.string().nullable().optional(),
  templateTimelineId: z.string().nullable().optional(),
  templateTimelineVersion: z.number().nullable().optional(),
  timelineType: TimelineType.nullable().optional(),
  updated: z.number().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type BareNote = z.infer<typeof BareNote>;
export const BareNote = z.object({
  eventId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  timelineId: z.string().nullable(),
  created: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  updated: z.number().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Note = z.infer<typeof Note>;
export const Note = BareNote.merge(
  z.object({
    noteId: z.string().optional(),
    version: z.string().optional(),
  })
);

export type PinnedEvent = z.infer<typeof PinnedEvent>;
export const PinnedEvent = z.object({
  pinnedEventId: z.string(),
  eventId: z.string(),
  timelineId: z.string(),
  created: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  updated: z.number().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  version: z.string(),
});

export type TimelineResponse = z.infer<typeof TimelineResponse>;
export const TimelineResponse = SavedTimeline.merge(
  z.object({
    eventIdToNoteIds: z.array(Note).optional(),
    notes: z.array(Note).optional(),
    noteIds: z.array(z.string()).optional(),
    pinnedEventIds: z.array(z.string()).optional(),
    pinnedEventsSaveObject: z.array(PinnedEvent).optional(),
    savedObjectId: z.string(),
    version: z.string(),
  })
);

export type FavoriteTimelineResponse = z.infer<typeof FavoriteTimelineResponse>;
export const FavoriteTimelineResponse = z.object({
  savedObjectId: z.string(),
  version: z.string(),
  code: z.number().nullable().optional(),
  message: z.string().nullable().optional(),
  templateTimelineId: z.string().nullable().optional(),
  templateTimelineVersion: z.number().nullable().optional(),
  timelineType: TimelineType.optional(),
  favorite: z.array(FavoriteTimelineResult).optional(),
});

export type GlobalNote = z.infer<typeof GlobalNote>;
export const GlobalNote = z.object({
  noteId: z.string().optional(),
  version: z.string().optional(),
  note: z.string().optional(),
  timelineId: z.string().optional(),
  created: z.number().optional(),
  createdBy: z.string().optional(),
  updated: z.number().optional(),
  updatedBy: z.string().optional(),
});

/**
 * The field to sort the timelines by.
 */
export type SortFieldTimeline = z.infer<typeof SortFieldTimeline>;
export const SortFieldTimeline = z.enum(['title', 'description', 'updated', 'created']);
export type SortFieldTimelineEnum = typeof SortFieldTimeline.enum;
export const SortFieldTimelineEnum = SortFieldTimeline.enum;

/**
 * The status of the timeline. Valid values are `active`, `draft`, and `immutable`.
 */
export type TimelineStatus = z.infer<typeof TimelineStatus>;
export const TimelineStatus = z.enum(['active', 'draft', 'immutable']);
export type TimelineStatusEnum = typeof TimelineStatus.enum;
export const TimelineStatusEnum = TimelineStatus.enum;

export type ImportTimelines = z.infer<typeof ImportTimelines>;
export const ImportTimelines = SavedTimeline.merge(
  z.object({
    savedObjectId: z.string().nullable().optional(),
    version: z.string().nullable().optional(),
    globalNotes: z.array(BareNote).nullable().optional(),
    eventNotes: z.array(BareNote).nullable().optional(),
    pinnedEventIds: z.array(z.string()).nullable().optional(),
  })
);

export type ImportTimelineResult = z.infer<typeof ImportTimelineResult>;
export const ImportTimelineResult = z.object({
  success: z.boolean().optional(),
  success_count: z.number().optional(),
  timelines_installed: z.number().optional(),
  timelines_updated: z.number().optional(),
  errors: z
    .array(
      z.object({
        id: z.string().optional(),
        error: z
          .object({
            message: z.string().optional(),
            status_code: z.number().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

export type ExportedTimelines = z.infer<typeof ExportedTimelines>;
export const ExportedTimelines = SavedTimeline.merge(
  z.object({
    globalNotes: z.array(Note).optional(),
    eventNotes: z.array(Note).optional(),
    pinnedEventIds: z.array(z.string()).optional(),
  })
);

export type Readable = z.infer<typeof Readable>;
export const Readable = z.object({
  _maxListeners: z.object({}).catchall(z.unknown()).optional(),
  _readableState: z.object({}).catchall(z.unknown()).optional(),
  _read: z.object({}).catchall(z.unknown()).optional(),
  readable: z.boolean().optional(),
  _events: z.object({}).catchall(z.unknown()).optional(),
  _eventsCount: z.number().optional(),
  _data: z.object({}).catchall(z.unknown()).optional(),
  _position: z.number().optional(),
  _encoding: z.string().optional(),
});
