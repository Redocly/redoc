import { describe, it, expect } from 'vitest';

import {
  encodeExampleForMediaType,
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

describe('encodeExampleForMediaType', () => {
  it('returns an empty string for undefined', () => {
    expect(encodeExampleForMediaType(undefined, 'application/json')).toBe('');
  });

  it('pretty-prints JSON objects for JSON media types', () => {
    expect(encodeExampleForMediaType({ a: 1, b: 'x' }, 'application/json')).toBe(
      '{\n  "a": 1,\n  "b": "x"\n}',
    );
  });

  it('re-formats a JSON string for JSON media types', () => {
    expect(encodeExampleForMediaType('{"a":1}', 'application/json')).toBe('{\n  "a": 1\n}');
  });

  it('returns the raw string when a JSON media type carries non-JSON text', () => {
    expect(encodeExampleForMediaType('not json', 'application/json')).toBe('not json');
  });

  it('does not pretty-print sequential JSON media types', () => {
    expect(encodeExampleForMediaType({ a: 1 }, 'application/jsonl')).toBe('{\n  "a": 1\n}');
  });

  it('form-encodes objects for x-www-form-urlencoded', () => {
    expect(
      encodeExampleForMediaType(
        { name: 'Museum Visitor', tier: 'premium' },
        'application/x-www-form-urlencoded',
      ),
    ).toBe('name=Museum%20Visitor&tier=premium');
  });

  it('renders XML for XML media types', () => {
    const xml = encodeExampleForMediaType({ id: '1' }, 'application/xml');
    expect(xml).toContain('<root>');
    expect(xml).toContain('<id>1</id>');
  });

  it('falls back to JSON for an object on a non-JSON/XML/form media type', () => {
    expect(encodeExampleForMediaType({ a: 1 }, 'text/plain')).toBe('{\n  "a": 1\n}');
  });

  it('stringifies primitive values', () => {
    expect(encodeExampleForMediaType(42, 'text/plain')).toBe('42');
    expect(encodeExampleForMediaType('hello', 'text/plain')).toBe('hello');
  });
});
