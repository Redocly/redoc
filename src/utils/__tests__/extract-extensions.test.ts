import { describe, it, expect } from 'vitest';

import {
  extractExtensions,
  getExtensionsForDisplay,
  isRedocExtension,
} from '../extract-extensions.js';

describe('isRedocExtension', () => {
  it('treats known Redoc keys as internal', () => {
    expect(isRedocExtension('x-logo')).toBe(true);
    expect(isRedocExtension('x-badges')).toBe(true);
  });

  it('returns false for arbitrary vendor keys', () => {
    expect(isRedocExtension('x-museum-demo')).toBe(false);
  });
});

describe('extractExtensions', () => {
  it('when true, keeps x- keys except Redoc-internal', () => {
    const obj = {
      summary: 'x',
      'x-museum-demo': 'hello',
      'x-logo': 'hidden',
    };
    expect(extractExtensions(obj, true)).toEqual({ 'x-museum-demo': 'hello' });
  });

  it('when array, keeps only listed x- keys', () => {
    const obj = { 'x-a': 1, 'x-b': 2, other: 3 };
    expect(extractExtensions(obj, ['x-b'])).toEqual({ 'x-b': 2 });
  });

  it('includes listed keys even if they would be Redoc-internal when mode is array', () => {
    const obj = { 'x-logo': 'shown' };
    expect(extractExtensions(obj, ['x-logo'])).toEqual({ 'x-logo': 'shown' });
  });
});

describe('getExtensionsForDisplay', () => {
  it('returns empty object when showExtensions is false', () => {
    expect(getExtensionsForDisplay({ 'x-a': 1 }, false)).toEqual({});
  });

  it('delegates to extractExtensions when true or array', () => {
    expect(getExtensionsForDisplay({ 'x-a': 1 }, true)).toEqual({ 'x-a': 1 });
    expect(getExtensionsForDisplay({ 'x-a': 1, 'x-b': 2 }, ['x-b'])).toEqual({ 'x-b': 2 });
  });
});
