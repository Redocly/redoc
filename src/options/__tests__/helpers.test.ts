import { describe, it, expect, vi } from 'vitest';

import {
  argValueToBoolean,
  isTelemetryDisabled,
  argValueToNumber,
  argValueToInt,
  argValueToExpandLevel,
  normalizePath,
  normalizeShowExtensions,
  normalizeScrollYOffset,
  normalizeCodeSamples,
  normalizeDownloadUrls,
} from '../helpers.js';
import { DEFAULT_LANGUAGES } from '../../utils/languages.js';

describe('argValueToBoolean', () => {
  it('returns false when value is undefined and no default', () => {
    expect(argValueToBoolean(undefined)).toBe(false);
  });

  it('returns default when value is undefined', () => {
    expect(argValueToBoolean(undefined, true)).toBe(true);
    expect(argValueToBoolean(undefined, false)).toBe(false);
  });

  it('returns false for string "false"', () => {
    expect(argValueToBoolean('false')).toBe(false);
  });

  it('returns true for other non-empty strings', () => {
    expect(argValueToBoolean('true')).toBe(true);
    expect(argValueToBoolean('yes')).toBe(true);
    expect(argValueToBoolean('')).toBe(true);
  });

  it('returns boolean value as-is', () => {
    expect(argValueToBoolean(true)).toBe(true);
    expect(argValueToBoolean(false)).toBe(false);
  });
});

describe('isTelemetryDisabled', () => {
  it('opts out only with the literal true', () => {
    expect(isTelemetryDisabled(true)).toBe(true);
    expect(isTelemetryDisabled('true')).toBe(true);
  });

  it('keeps telemetry on for a bare attribute, false, or no value', () => {
    expect(isTelemetryDisabled('')).toBe(false);
    expect(isTelemetryDisabled('false')).toBe(false);
    expect(isTelemetryDisabled(false)).toBe(false);
    expect(isTelemetryDisabled(undefined)).toBe(false);
  });
});

describe('argValueToNumber', () => {
  it('returns default when value is undefined', () => {
    expect(argValueToNumber(undefined)).toBe(0);
    expect(argValueToNumber(undefined, 42)).toBe(42);
  });

  it('parses string to number', () => {
    expect(argValueToNumber('10')).toBe(10);
    expect(argValueToNumber('0')).toBe(0);
  });

  it('returns number as-is', () => {
    expect(argValueToNumber(5)).toBe(5);
    expect(argValueToNumber(0)).toBe(0);
  });
});

describe('argValueToInt', () => {
  it('returns default when value is undefined', () => {
    expect(argValueToInt(undefined)).toBe(0);
    expect(argValueToInt(undefined, 8)).toBe(8);
  });

  it('parses string to integer', () => {
    expect(argValueToInt('10')).toBe(10);
  });

  it('ceils number', () => {
    expect(argValueToInt(2.3)).toBe(3);
    expect(argValueToInt(2.9)).toBe(3);
  });
});

describe('argValueToExpandLevel', () => {
  it('returns default when value is undefined', () => {
    expect(argValueToExpandLevel(undefined)).toBeUndefined();
    expect(argValueToExpandLevel(undefined, 2)).toBe(2);
  });

  it('returns Infinity for string "all"', () => {
    expect(argValueToExpandLevel('all')).toBe(Infinity);
  });

  it('parses number or string to level', () => {
    expect(argValueToExpandLevel(3)).toBe(3);
    expect(argValueToExpandLevel('4', 2)).toBe(4);
  });
});

describe('normalizePath', () => {
  it('removes trailing slash when length > 1', () => {
    expect(normalizePath('/api/')).toBe('/api');
    expect(normalizePath('api/')).toBe('/api');
  });

  it('adds leading slash when missing', () => {
    expect(normalizePath('api')).toBe('/api');
    expect(normalizePath('')).toBe('/');
  });

  it('keeps single slash as-is', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('normalizes path with both fixes', () => {
    expect(normalizePath('api/docs/')).toBe('/api/docs');
  });
});

describe('normalizeShowExtensions', () => {
  it('returns false when value is undefined', () => {
    expect(normalizeShowExtensions(undefined)).toBe(false);
  });

  it('returns true for empty string', () => {
    expect(normalizeShowExtensions('')).toBe(true);
  });

  it('returns true/false for string "true"/"false"', () => {
    expect(normalizeShowExtensions('true')).toBe(true);
    expect(normalizeShowExtensions('false')).toBe(false);
  });

  it('returns boolean as-is', () => {
    expect(normalizeShowExtensions(true)).toBe(true);
    expect(normalizeShowExtensions(false)).toBe(false);
  });

  it('splits comma-separated string and trims', () => {
    expect(normalizeShowExtensions('x-request-id, x-trace')).toEqual(['x-request-id', 'x-trace']);
    expect(normalizeShowExtensions('  a , b  ')).toEqual(['a', 'b']);
  });
});

describe('normalizeScrollYOffset', () => {
  it('returns function that returns the number when value is number', () => {
    const fn = normalizeScrollYOffset(100);
    expect(fn()).toBe(100);
  });

  it('returns function that parses numeric string', () => {
    const fn = normalizeScrollYOffset('50');
    expect(fn()).toBe(50);
  });

  it('returns function that wraps callback and returns number or 0', () => {
    const fn = normalizeScrollYOffset(() => 75);
    expect(fn()).toBe(75);
  });

  it('returns () => 0 for undefined or non-numeric string', () => {
    expect(normalizeScrollYOffset(undefined)()).toBe(0);
    expect(normalizeScrollYOffset('px')()).toBe(0);
  });
});

describe('normalizeCodeSamples', () => {
  it('returns the resolved default languages when value is undefined', () => {
    // Defaults resolve like user config: `lang` is the language name, not the grammar.
    expect(normalizeCodeSamples(undefined).languages).toEqual(
      DEFAULT_LANGUAGES.map(({ key, label }) => ({ key, label, lang: label })),
    );
  });

  it('resolves key and label for configured languages', () => {
    const result = normalizeCodeSamples({
      languages: [{ lang: 'JavaScript' }, { lang: 'curl', label: 'Shell' }],
    });
    expect(result.languages).toEqual([
      { key: 'javascript', label: 'JavaScript', lang: 'JavaScript' },
      { key: 'shell', label: 'Shell', lang: 'curl' },
    ]);
  });

  it('keeps per-language options and other codeSamples fields', () => {
    const result = normalizeCodeSamples({
      skipOptionalParameters: true,
      languages: [{ lang: 'curl', options: { binary: true } }],
    });
    expect(result.skipOptionalParameters).toBe(true);
    expect(result.languages).toEqual([
      { key: 'curl', label: 'curl', lang: 'curl', options: { binary: true } },
    ]);
  });

  it('keeps an explicitly empty languages list empty', () => {
    expect(normalizeCodeSamples({ languages: [] }).languages).toEqual([]);
  });
});

describe('normalizeDownloadUrls', () => {
  it('reads plain strings in an array as URLs', () => {
    expect(normalizeDownloadUrls('["cafe.yaml", {"url":"b.json"}]', 'openapi')).toEqual([
      { url: 'cafe.yaml', title: 'cafe.yaml' },
      { url: 'b.json', title: 'b.json' },
    ]);
  });

  it('parses a JSON array attribute value', () => {
    expect(normalizeDownloadUrls('[{"url":"cafe.yaml"}]', 'openapi')).toEqual([
      { url: 'cafe.yaml', title: 'cafe.yaml' },
    ]);
  });

  it('parses a single JSON object attribute value', () => {
    expect(normalizeDownloadUrls('{"url":"/a.json","title":"A"}', 'openapi')).toEqual([
      { url: '/a.json', title: 'A' },
    ]);
  });

  it('treats a plain string as a URL', () => {
    expect(normalizeDownloadUrls('https://example.com/cafe.yaml', 'openapi')).toEqual([
      { url: 'https://example.com/cafe.yaml', title: 'cafe.yaml' },
    ]);
  });

  it('returns an empty list for a bare attribute', () => {
    expect(normalizeDownloadUrls('', 'openapi')).toEqual([]);
  });

  it('drops malformed JSON and entries without a url with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(normalizeDownloadUrls('[{"url":', 'openapi')).toEqual([]);
    expect(normalizeDownloadUrls([{ init: 'x' }, { url: 'b.yaml' }], 'asyncapi')).toEqual([
      { url: 'b.yaml', title: 'b.yaml' },
    ]);
    expect(normalizeDownloadUrls(42, 'openapi')).toEqual([]);
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
  });
});
