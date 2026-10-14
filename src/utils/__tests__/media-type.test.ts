import { describe, it, expect } from 'vitest';

import {
  isCsvMediaType,
  isJsonLikeMediaType,
  isSequentialMediaType,
  langFromMime,
  normalizeLanguageForHighlight,
} from '../media-type.js';

describe('isSequentialMediaType', () => {
  it('returns true for streaming media types', () => {
    expect(isSequentialMediaType('application/jsonl')).toBe(true);
    expect(isSequentialMediaType('application/x-ndjson')).toBe(true);
    expect(isSequentialMediaType('application/json-seq')).toBe(true);
    expect(isSequentialMediaType('text/event-stream')).toBe(true);
    expect(isSequentialMediaType('multipart/mixed')).toBe(true);
  });

  it('returns false for non-streaming media types', () => {
    expect(isSequentialMediaType('application/json')).toBe(false);
    expect(isSequentialMediaType('text/plain')).toBe(false);
    expect(isSequentialMediaType('application/xml')).toBe(false);
    expect(isSequentialMediaType('application/octet-stream')).toBe(false);
  });

  it('returns false for undefined or empty input', () => {
    expect(isSequentialMediaType(undefined)).toBe(false);
    expect(isSequentialMediaType('')).toBe(false);
  });
});

describe('isJsonLikeMediaType', () => {
  it('matches case-insensitive JSON in the type', () => {
    expect(isJsonLikeMediaType('application/json')).toBe(true);
    expect(isJsonLikeMediaType('application/jsonl')).toBe(true);
    expect(isJsonLikeMediaType('application/x-ndjson')).toBe(true);
    expect(isJsonLikeMediaType('text/JSON')).toBe(true);
  });

  it('returns false for non-JSON types', () => {
    expect(isJsonLikeMediaType('text/plain')).toBe(false);
    expect(isJsonLikeMediaType('application/xml')).toBe(false);
    expect(isJsonLikeMediaType(undefined)).toBe(false);
  });
});

describe('langFromMime', () => {
  it('returns specific languages for streaming MIME types', () => {
    expect(langFromMime('application/jsonl')).toBe('jsonl');
    expect(langFromMime('application/x-ndjson')).toBe('jsonl');
    expect(langFromMime('application/json-seq')).toBe('json-seq');
    expect(langFromMime('multipart/mixed')).toBe('multipart-mixed');
    expect(langFromMime('text/event-stream')).toBe('yaml');
  });

  it('returns json/xml for canonical types', () => {
    expect(langFromMime('application/json')).toBe('json');
    expect(langFromMime('application/xml')).toBe('xml');
    expect(langFromMime('application/atom+xml')).toBe('xml');
  });

  it('returns text for CSV types', () => {
    expect(langFromMime('text/csv')).toBe('text');
    expect(langFromMime('application/csv; charset=utf-8')).toBe('text');
  });

  it('falls back to clike for unknown / undefined', () => {
    expect(langFromMime('text/plain')).toBe('clike');
    expect(langFromMime(undefined)).toBe('clike');
  });
});

describe('normalizeLanguageForHighlight', () => {
  it('lowercases a plain language name', () => {
    expect(normalizeLanguageForHighlight('JavaScript')).toBe('javascript');
    expect(normalizeLanguageForHighlight('curl')).toBe('curl');
  });

  it('treats a value containing a slash as a MIME type', () => {
    expect(normalizeLanguageForHighlight('application/json')).toBe('json');
    expect(normalizeLanguageForHighlight('application/xml')).toBe('xml');
  });

  it('falls back to clike for undefined', () => {
    expect(normalizeLanguageForHighlight(undefined)).toBe('clike');
  });
});

describe('isCsvMediaType', () => {
  it('matches CSV media types regardless of case and parameters', () => {
    expect(isCsvMediaType('text/csv')).toBe(true);
    expect(isCsvMediaType('application/csv')).toBe(true);
    expect(isCsvMediaType('TEXT/CSV')).toBe(true);
    expect(isCsvMediaType('text/csv; charset=utf-8')).toBe(true);
    expect(isCsvMediaType('text/csv;header=present')).toBe(true);
    expect(isCsvMediaType('application/vnd.example+csv')).toBe(true);
    expect(isCsvMediaType('text/x-csv')).toBe(true);
    expect(isCsvMediaType('application/x-csv')).toBe(true);
    expect(isCsvMediaType('text/comma-separated-values')).toBe(true);
  });

  it('returns false for other media types', () => {
    expect(isCsvMediaType('application/json')).toBe(false);
    expect(isCsvMediaType('text/plain')).toBe(false);
    expect(isCsvMediaType('text/csvx')).toBe(false);
    expect(isCsvMediaType('csv')).toBe(false);
    expect(isCsvMediaType(undefined)).toBe(false);
    expect(isCsvMediaType('')).toBe(false);
  });
});
