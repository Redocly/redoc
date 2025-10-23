
export enum MediaTypes {
  OCTET_STREAM = 'application/octet-stream',
  MULTIPART = 'multipart/form-data',
  URL_ENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  XML = 'application/xml',
}

export const SECTION_ATTR = 'data-section-id';
export const FIELD_ATTR = 'data-field-id';
export const GROUP_DEPTH = 0;

export const LEGACY_REGEXP = '^ {0,3}<!-- ReDoc-Inject:\\s+?<({component}).*?/?>\\s+?-->\\s*$';

// prettier-ignore
export const MDX_COMPONENT_REGEXP = '(?:^ {0,3}<({component})([\\s\\S]*?)>([\\s\\S]*?)</\\2>' // with children
    + '|^ {0,3}<({component})([\\s\\S]*?)(?:/>|\\n{2,}))'; // self-closing

export const COMPONENT_REGEXP = '(?:' + LEGACY_REGEXP + '|' + MDX_COMPONENT_REGEXP + ')';

export const DEFAULT_TAG_SLUG = 'other';
export const DEFAULT_WEBHOOKS_TAG_NAME = 'webhooks';

export const LOADING_STATE = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
};

export const REDOCLY_CONFIG_FILE = 'redocly.yaml';

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
