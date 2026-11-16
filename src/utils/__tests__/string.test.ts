import { describe, it, expect, vi } from 'vitest';

import { asString, safeSlugify, tryDecodeURIComponent } from '../string.js';

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

describe('tryDecodeURIComponent', () => {
  it('decodes valid escapes', () => {
    expect(tryDecodeURIComponent('/caf%C3%A9')).toBe('/café');
    expect(tryDecodeURIComponent('/a%5Cb')).toBe('/a\\b');
  });

  it('returns input with a malformed escape unchanged, without logging', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    for (const input of ['/menu%zz', '/menu%', '/%E0%A4%A', '/deals/50%off']) {
      expect(tryDecodeURIComponent(input)).toBe(input);
    }
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('decodes the rest of a string around a lone percent sign', () => {
    expect(tryDecodeURIComponent('/other/50%%20off')).toBe('/other/50% off');
    expect(tryDecodeURIComponent('/other/50%off')).toBe('/other/50%off');
  });
});

describe('safeSlugify', () => {
  it('slugifies latin text', () => {
    expect(safeSlugify('Hello World')).toBe('Hello-World');
    expect(safeSlugify('Café & Bar')).toBe('Cafe-and-Bar');
    expect(safeSlugify('Привет мир')).toBe('Privet-mir');
  });

  it('keeps text that slugify() cannot transliterate', () => {
    expect(safeSlugify('数据')).toBe('数据');
  });

  it('keeps the CJK part of a name that also has an ASCII part', () => {
    expect(safeSlugify('demo数据')).toBe('demo数据');
    expect(safeSlugify('demo数据备份')).toBe('demo数据备份');
    expect(safeSlugify('demo数据')).not.toBe(safeSlugify('demo数据备份'));
  });

  it('ignores dropped symbols that are not letters or digits', () => {
    expect(safeSlugify('ok 👍')).toBe('ok');
  });
});
