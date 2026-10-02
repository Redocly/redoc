import { describe, it, expect } from 'vitest';

import { asString } from '../string.js';

describe('asString', () => {
  it('keeps non-empty strings', () => {
    expect(asString('Summary')).toBe('Summary');
    expect(asString(' ')).toBe(' ');
  });

  it('drops undefined, null and empty strings', () => {
    expect(asString(undefined)).toBeUndefined();
    expect(asString(null)).toBeUndefined();
    expect(asString('')).toBeUndefined();
  });

  it('keeps unquoted YAML scalars, which the previous `||` fallback chains rendered as-is', () => {
    expect(asString(2024)).toBe('2024');
    expect(asString(1.5)).toBe('1.5');
    expect(asString(true)).toBe('true');
  });

  it('drops falsy scalars, matching the `||` fallthrough they used to get', () => {
    expect(asString(0)).toBeUndefined();
    expect(asString(false)).toBeUndefined();
    expect(asString(Number.NaN)).toBeUndefined();
  });

  it('drops objects and arrays', () => {
    expect(asString({ en: 'Summary' })).toBeUndefined();
    expect(asString(['Summary'])).toBeUndefined();
    expect(asString(() => 'Summary')).toBeUndefined();
  });
});
