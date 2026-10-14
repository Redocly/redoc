import { describe, expect, it } from 'vitest';

import type { PropertyType } from '../../../types/schema.js';

import { getDiscriminatorEnumRender, getSchemaEnumRowLabel } from '../utils.js';

describe('getSchemaEnumRowLabel', () => {
  it('uses Value for a single value', () => {
    expect(getSchemaEnumRowLabel('string', 1)).toBe('Value:');
  });

  it('uses Enum for multiple values', () => {
    expect(getSchemaEnumRowLabel('string', 3)).toBe('Enum:');
  });

  it('prefixes Items for array-typed properties', () => {
    expect(getSchemaEnumRowLabel('Array<string>', 1)).toBe('Items Value:');
    expect(getSchemaEnumRowLabel('Array<string>', 2)).toBe('Items Enum:');
  });
});

describe('getDiscriminatorEnumRender', () => {
  it('prefers schema enum array over mapping keys', () => {
    const prop = { type: 'string', enum: ['x', 'y'] } as PropertyType;
    const r = getDiscriminatorEnumRender(prop, ['a', 'b']);
    expect(r.isDescriptionEnum).toBe(false);
    expect(r.enumValues).toEqual(['x', 'y']);
  });

  it('falls back to mapping keys when enum is absent', () => {
    const prop = { type: 'string' } as PropertyType;
    const r = getDiscriminatorEnumRender(prop, ['list', 'one-column']);
    expect(r.enumValues).toEqual(['list', 'one-column']);
  });
});
