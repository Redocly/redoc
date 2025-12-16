
export enum MediaTypes {
  OCTET_STREAM = 'application/octet-stream',
  MULTIPART = 'multipart/form-data',
  URL_ENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  XML = 'application/xml',
}

export const SECTION_ATTR = 'data-section-id';
export const GROUP_DEPTH = 0;

export const DEFAULT_TAG_SLUG = 'other';
export const DEFAULT_WEBHOOKS_TAG_NAME = 'webhooks';

export const LOADING_STATE = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
};

export const DISABLE_DEEP_LINK_IF_FIELDS_EXIST = ['title'];
export const SEARCH_LIMIT = 100;
export const HIGHLIGHTED_TEXT_MAX_LENGTH = 150;
export const SEARCH_INDEX_FIELDS = [
  'text',
  'title',
  'path',
  'httpPath',
  'parameters[]:name',
  'parameters[]:description',
  'parameters[]:place',
  'parameters[]:path',
];
