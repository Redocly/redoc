import { describe, it, expect } from 'vitest';

import {
  hasOpenApiExampleValue,
  resolveOpenApiExampleValue,
} from '../resolve-openapi-example-value.js';

describe('resolveOpenApiExampleValue', () => {
  it('returns dataValue first, then serializedValue, then value', () => {
    expect(
      resolveOpenApiExampleValue({
        dataValue: { id: 1 },
        serializedValue: 'id=1',
        value: { id: 999 },
      }),
    ).toEqual({ id: 1 });

    expect(
      resolveOpenApiExampleValue({ serializedValue: 'name=Alice', value: { name: 'ignored' } }),
    ).toBe('name=Alice');

    expect(resolveOpenApiExampleValue({ value: { ok: true } })).toEqual({ ok: true });
  });

  it('preserves falsy precedence values (0, false, "")', () => {
    expect(resolveOpenApiExampleValue({ dataValue: 0, value: 1 })).toBe(0);
    expect(resolveOpenApiExampleValue({ serializedValue: '', value: 'fallback' })).toBe('');
  });

  it('returns undefined for an undefined example', () => {
    expect(resolveOpenApiExampleValue(undefined)).toBeUndefined();
  });
});

describe('hasOpenApiExampleValue', () => {
  it('is true when any value-bearing field is set, false otherwise', () => {
    expect(hasOpenApiExampleValue({ dataValue: 0 })).toBe(true);
    expect(hasOpenApiExampleValue({ serializedValue: '' })).toBe(true);
    expect(hasOpenApiExampleValue({ value: 1 })).toBe(true);

    expect(hasOpenApiExampleValue(undefined)).toBe(false);
    expect(hasOpenApiExampleValue({})).toBe(false);
    expect(hasOpenApiExampleValue({ summary: 'hi' })).toBe(false);
  });
});
