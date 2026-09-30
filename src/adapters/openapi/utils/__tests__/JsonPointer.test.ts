import { describe, expect, it } from 'vitest';

import { JsonPointer } from '../JsonPointer.js';

describe('JsonPointer', () => {
  describe('parse', () => {
    it('strips leading # before parsing', () => {
      expect(JsonPointer.parse('#/paths/~1pets/get')).toEqual(['paths', '/pets', 'get']);
    });

    it('parses pointers without # prefix', () => {
      expect(JsonPointer.parse('/components/schemas/Pet')).toEqual([
        'components',
        'schemas',
        'Pet',
      ]);
    });
  });

  describe('baseName', () => {
    it('returns the last token by default', () => {
      expect(JsonPointer.baseName('/path/0/subpath')).toBe('subpath');
    });

    it('returns the nth token from the end when level > 1', () => {
      expect(JsonPointer.baseName('/path/foo/subpath', 2)).toBe('foo');
    });
  });

  describe('dirName', () => {
    it('returns parent pointer by default', () => {
      expect(JsonPointer.dirName('/path/0/subpath')).toBe('/path/0');
    });

    it('returns ancestor pointer when level > 1', () => {
      expect(JsonPointer.dirName('/path/foo/subpath', 2)).toBe('/path');
    });
  });

  describe('relative', () => {
    it('returns tokens after the base pointer', () => {
      expect(JsonPointer.relative('/path/0', '/path/0/subpath')).toEqual(['subpath']);
      expect(JsonPointer.relative('/path', '/path/foo/subpath')).toEqual(['foo', 'subpath']);
    });
  });

  describe('join', () => {
    it('appends a single token to the base path', () => {
      expect(JsonPointer.join('/components/schemas', 'Pet')).toBe('/components/schemas/Pet');
    });

    it('appends multiple tokens', () => {
      expect(JsonPointer.join('/components', ['schemas', 'Pet'])).toBe('/components/schemas/Pet');
    });
  });

  describe('get', () => {
    it('reads a value from an object by pointer', () => {
      const doc = { paths: { '/pets': { get: { summary: 'List pets' } } } };
      expect(JsonPointer.get(doc, '/paths/~1pets/get/summary')).toBe('List pets');
    });
  });

  describe('compile and escape', () => {
    it('compiles tokens into a pointer string', () => {
      expect(JsonPointer.compile(['components', 'schemas', 'Pet'])).toBe('/components/schemas/Pet');
    });

    it('escapes special characters in pointer segments', () => {
      expect(JsonPointer.escape('a/b')).toBe('a~1b');
    });
  });
});
