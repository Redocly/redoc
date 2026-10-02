import type { AsyncMessageSubsection } from './context.js';

/**
 * The `place` grammar — every label the indexer stamps on a row. A place is shown in the
 * result row, keyed into the dedup id, and parsed back (`responseCodeOf`,
 * `asyncSubsectionOf`, `isDescriptionPlace`), so every literal lives here.
 */

export const REQUEST_FIELDS_PLACE = 'request fields';
export const REQUEST_BODY_PLACE = 'request body';
export const SCHEMA_FIELDS_PLACE = 'schema fields';
export const DESCRIPTION_PLACE = 'description';
export const CALLBACK_PLACE = 'callback';
export const MESSAGE_PLACE = 'message';
export const MESSAGE_PAYLOAD_PLACE = 'message payload';
export const MESSAGE_HEADERS_PLACE = 'message headers';
export const MESSAGE_BINDINGS_PLACE = 'message bindings';
export const SERVER_PLACE = 'server';
export const SERVER_VARIABLES_PLACE = 'server variables';
export const OVERVIEW_PLACE = 'overview';
export const METADATA_PLACE = 'metadata';
export const SECURITY_PLACE = 'security';
export const REQUEST_EXAMPLES_PLACE = 'request examples';
export const MESSAGE_EXAMPLES_PLACE = 'message examples';
export const GRAPHQL_ARGUMENTS_PLACE = 'arguments';
export const MCP_INPUT_SCHEMA_PLACE = 'input schema';
export const MCP_OUTPUT_SCHEMA_PLACE = 'output schema';
export const MCP_PROMPT_ARGUMENTS_PLACE = 'arguments';

/** Place of a top-level parameter, by its content-node variant. */
export function parameterPlaceOf(variant: string | undefined): string {
  switch (variant) {
    case 'query':
      return 'query parameters';
    case 'path':
      return 'path parameters';
    case 'headers':
      return 'header parameters';
    case 'cookies':
      return 'cookie parameters';
    case 'parameters':
      return 'channel parameters';
    default:
      return variant ? `${variant} parameters` : 'parameters';
  }
}

/** Place of schema/graphql field rows, by their content-node variant. */
export function fieldsPlaceOf(variant: string | undefined): string {
  switch (variant) {
    case 'body':
      return REQUEST_FIELDS_PLACE;
    case 'responses':
      return 'response fields';
    case 'graphql-fields':
      return 'fields';
    case 'graphql-args':
      return GRAPHQL_ARGUMENTS_PLACE;
    case 'return-type':
      return 'return type fields';
    case 'possible-types':
      return 'possible types';
    case 'implemented-by':
      return 'implemented by';
    default:
      return variant ?? 'fields';
  }
}

export function responseSectionPlace(code: string): string {
  return `response ${code}`;
}

export function responseFieldsPlace(code: string): string {
  return `response ${code} fields`;
}

export function responseHeadersPlace(code: string): string {
  return `response ${code} headers`;
}

export function responseExamplesPlace(code: string): string {
  return `response ${code} examples`;
}

/** Prefixes places produced inside a callback so search entries read as the callback's. */
export function scopedPlace(place: string, callbackId?: string): string {
  return callbackId ? `${CALLBACK_PLACE} ${place}` : place;
}

// Codes can be `200`, `2XX`, or `default`; the trailing space requires a
// subsection word after the code, so plain `response fields` never matches.
// Callback places are prefixed (`callback response 200 fields`), hence no `^` anchor.
export function responseCodeOf(place: string): string | undefined {
  const match = place.match(/(?:^|\s)response (\S+) /);
  return match ? match[1] : undefined;
}

export function asyncSubsectionOf(place: string): AsyncMessageSubsection | undefined {
  switch (place) {
    case MESSAGE_PAYLOAD_PLACE:
      return 'payload';
    case MESSAGE_HEADERS_PLACE:
      return 'headers';
    case MESSAGE_BINDINGS_PLACE:
      return 'bindings';
    default:
      return undefined;
  }
}

/** Markdown-heading rows: `description`, or `callback description` inside a callback. */
export function isDescriptionPlace(place: string): boolean {
  return place.endsWith(DESCRIPTION_PLACE);
}

/** Example selector labels: `request examples`, `response 201 examples`, `message examples`. */
export function isExamplesPlace(place: string): boolean {
  return place.endsWith(' examples');
}
