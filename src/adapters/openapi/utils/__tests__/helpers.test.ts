import { describe, expect, it } from 'vitest';

import {
  escapeHTMLAttrChars,
  get,
  getDefinitionName,
  isAbsoluteUrl,
  isNumeric,
  removeQueryStringAndHash,
  resolveUrl,
  sanitizeItemId,
  stripTrailingSlash,
  titleize,
} from '../helpers.js';

describe('stripTrailingSlash', () => {
  it('removes a single trailing slash', () => {
    expect(stripTrailingSlash('/pets/')).toBe('/pets');
  });

  it('returns path unchanged when there is no trailing slash', () => {
    expect(stripTrailingSlash('/pets')).toBe('/pets');
  });
});

describe('isNumeric', () => {
  it('returns true for finite numeric values', () => {
    expect(isNumeric(42)).toBe(true);
    expect(isNumeric('3.14')).toBe(true);
  });

  it('returns false for non-numeric values', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric(Infinity)).toBe(false);
    expect(isNumeric(null)).toBe(false);
  });
});

describe('isAbsoluteUrl', () => {
  it('detects scheme-based and protocol-relative URLs', () => {
    expect(isAbsoluteUrl('https://api.example.com')).toBe(true);
    expect(isAbsoluteUrl('//api.example.com')).toBe(true);
    expect(isAbsoluteUrl('/relative')).toBe(false);
  });
});

describe('resolveUrl', () => {
  it('resolves protocol-relative paths', () => {
    expect(resolveUrl('http://test.com', '//cdn.example.com/assets')).toBe(
      'http://cdn.example.com/assets',
    );
  });

  it('returns absolute target URLs unchanged', () => {
    expect(resolveUrl('http://test.com', 'https://other.example.com/path')).toBe(
      'https://other.example.com/path',
    );
  });

  it('joins relative paths without breaking URL templates', () => {
    expect(resolveUrl('http://test.com:{port}', 'path')).toBe('http://test.com:{port}/path');
  });

  it('replaces pathname for root-relative paths', () => {
    expect(resolveUrl('https://api.example.com/v1', '/v2/pets')).toBe(
      'https://api.example.com/v2/pets',
    );
  });
});

describe('titleize', () => {
  it('capitalizes the first character', () => {
    expect(titleize('pets')).toBe('Pets');
  });
});

describe('removeQueryStringAndHash', () => {
  it('strips search and hash from valid URLs', () => {
    expect(removeQueryStringAndHash('https://api.example.com/v1?x=1#frag')).toBe(
      'https://api.example.com/v1',
    );
  });

  it('returns empty string for empty input', () => {
    expect(removeQueryStringAndHash('')).toBe('');
  });

  it('returns original value when URL parsing fails', () => {
    expect(removeQueryStringAndHash('not-a-url')).toBe('not-a-url');
  });
});

describe('escapeHTMLAttrChars', () => {
  it('escapes quotes and backslashes', () => {
    expect(escapeHTMLAttrChars('say "hi"\\')).toBe('say \\"hi\\"\\\\');
  });
});

describe('sanitizeItemId', () => {
  it('replaces hash symbols and lowercases', () => {
    expect(sanitizeItemId('Schema#Pet')).toBe('schema_pet');
  });
});

describe('get', () => {
  it('reads nested values by dot path', () => {
    expect(get({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1);
  });

  it('returns default when path is missing', () => {
    expect(get({ a: 1 }, 'b.c', 'default')).toBe('default');
  });

  it('supports array path segments', () => {
    expect(get({ a: { b: 2 } }, ['a', 'b'])).toBe(2);
  });
});

describe('getDefinitionName', () => {
  it('extracts definition name from pointer', () => {
    expect(getDefinitionName('#/components/schemas/Pet')).toBe('Pet');
    expect(getDefinitionName('#/components/pathItems/Base')).toBe('Base');
    expect(getDefinitionName('/other')).toBeUndefined();
  });
});
