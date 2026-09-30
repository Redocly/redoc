import type { FormFieldEncoding } from './form-urlencoded.js';

import { MediaTypes } from '../constants/openapi.js';
import { formUrlEncodeValue } from './form-urlencoded.js';
import { jsonToXml } from './xml.js';

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

function isXmlLikeMediaType(contentType: string): boolean {
  return /xml/i.test(contentType);
}

function isFormUrlEncodedMediaType(contentType: string): boolean {
  return contentType.toLowerCase().includes(MediaTypes.URL_ENCODED);
}

function isMultipartFormDataMediaType(contentType: string): boolean {
  return contentType.toLowerCase().includes(MediaTypes.MULTIPART);
}

export function isSampleableMediaType(contentType: string | undefined): boolean {
  if (!contentType) return false;
  return (
    isJsonLikeMediaType(contentType) ||
    isXmlLikeMediaType(contentType) ||
    isSequentialMediaType(contentType) ||
    isFormUrlEncodedMediaType(contentType) ||
    isMultipartFormDataMediaType(contentType)
  );
}

export function encodeExampleForMediaType(
  value: unknown,
  mimeType: string,
  encoding?: Record<string, FormFieldEncoding>,
): string {
  if (value === undefined) return '';

  if (isJsonLikeMediaType(mimeType) && !isSequentialMediaType(mimeType)) {
    try {
      return JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2) ?? '';
    } catch {
      return String(value);
    }
  }

  if (typeof value === 'object' && value !== null) {
    if (isFormUrlEncodedMediaType(mimeType)) {
      return formUrlEncodeValue(value, encoding);
    }
    if (isXmlLikeMediaType(mimeType)) {
      return jsonToXml(value);
    }
    // example may have been cached as JSON but used as a non-JSON media type
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}
