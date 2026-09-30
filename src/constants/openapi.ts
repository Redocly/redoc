import type { ObjectValues } from '../types/common';

export const WindowReferenceOptions = {
  ON_DEEP_LINK_CLICK: 'onDeepLinkClick',
  HOOKS: 'hooks',
} as const;

export type WindowReferenceOptions =
  (typeof WindowReferenceOptions)[keyof typeof WindowReferenceOptions];

export const SECTION_ATTR = 'data-section-id';
export const GROUP_DEPTH = 0;
export const DEFAULT_TAG_SLUG = 'other';
export const DEFAULT_WEBHOOKS_TAG_NAME = 'webhooks';
export const MAX_NESTING_TAGS_LEVEL = 5;
export const WEBHOOKS_GROUP_TITLE = 'Webhooks';

export const LOADING_STATE = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
} as const;

export const MediaTypes = {
  OCTET_STREAM: 'application/octet-stream',
  MULTIPART: 'multipart/form-data',
  MULTIPART_MIXED: 'multipart/mixed',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  JSON: 'application/json',
  XML: 'application/xml',
  JSONL: 'application/jsonl',
  NDJSON: 'application/x-ndjson',
  JSON_SEQ: 'application/json-seq',
  EVENT_STREAM: 'text/event-stream',
} as const;

export type MediaTypes = ObjectValues<typeof MediaTypes>;
