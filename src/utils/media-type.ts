
import { MediaTypes } from '../constants/openapi.js';

const SEQUENTIAL_MEDIA_TYPES: ReadonlySet<string> = new Set([
  MediaTypes.JSONL,
  MediaTypes.NDJSON,
  MediaTypes.JSON_SEQ,
  MediaTypes.EVENT_STREAM,
  MediaTypes.MULTIPART_MIXED,
]);

export function isSequentialMediaType(contentType: string | undefined): boolean {
  if (!contentType) return false;
  return SEQUENTIAL_MEDIA_TYPES.has(contentType.toLowerCase());
}

export function isJsonLikeMediaType(contentType: string | undefined): boolean {
  if (!contentType) return false;
  return contentType.search(/json/i) !== -1;
}

export function langFromMime(contentType: string | undefined): string {
  if (!contentType) return 'clike';

  const normalized = contentType.toLowerCase();

  if (normalized.includes('xml')) return 'xml';
  if (normalized.includes('application/json-seq')) return 'json-seq';
  if (normalized.includes('application/jsonl') || normalized.includes('application/x-ndjson')) {
    return 'jsonl';
  }
  if (normalized.includes('multipart/mixed')) return 'multipart-mixed';
  if (normalized.includes('text/event-stream')) return 'yaml';
  if (isCsvMediaType(normalized)) return 'text';
  if (normalized.includes('json')) return 'json';

  return 'clike';
}

export function normalizeLanguageForHighlight(language: string | undefined): string {
  if (!language) return 'clike';

  const normalized = language.toLowerCase();
  if (normalized.includes('/')) {
    return langFromMime(normalized);
  }

  return normalized;
}

export function isFormUrlEncodedMediaType(contentType: string | undefined): boolean {
  return !!contentType && contentType.toLowerCase().includes(MediaTypes.URL_ENCODED);
}

const CSV_SUBTYPES: ReadonlySet<string> = new Set(['csv', 'x-csv', 'comma-separated-values']);

export function isCsvMediaType(contentType: string | undefined): boolean {
  if (!contentType) return false;
  const subtype = contentType.toLowerCase().split(';')[0].trim().split('/')[1] ?? '';
  return CSV_SUBTYPES.has(subtype) || subtype.endsWith('+csv');
}
