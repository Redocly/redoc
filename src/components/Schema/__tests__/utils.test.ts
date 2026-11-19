import { describe, expect, it } from 'vitest';

import type { PropertyType } from '../../../types/schema.js';

import { buildPropertyShell } from '../../../services/schema/propertyBuilder.js';
import { cycleColorsByLevel, getDiscriminatorEnumRender, getSchemaEnumRowLabel } from '../utils.js';

describe('getSchemaEnumRowLabel', () => {
  it('uses Value for a single value', () => {
    expect(getSchemaEnumRowLabel('string', 1)).toBe('Value:');
  });

  it('uses Enum for multiple values', () => {
    expect(getSchemaEnumRowLabel('string', 3)).toBe('Enum:');
  });

  it('prefixes Items for the type label built for an array', () => {
    const { type } = buildPropertyShell({ type: 'array', items: { type: 'string' } });
    expect(getSchemaEnumRowLabel(type, 1)).toBe('Items Value:');
    expect(getSchemaEnumRowLabel(type, 2)).toBe('Items Enum:');
  });
});

describe('getDiscriminatorEnumRender', () => {
  it('prefers schema enum array over mapping keys', () => {
    const prop = { type: 'string', enum: ['x', 'y'] } as PropertyType;
    const r = getDiscriminatorEnumRender(prop);
    expect(r.isDescriptionEnum).toBe(false);
    expect(r.enumValues).toEqual(['x', 'y']);
  });

  it('lists no values when the property has no enum', () => {
    const prop = { type: 'string' } as PropertyType;
    const r = getDiscriminatorEnumRender(prop);
    expect(r.enumValues).toEqual([]);
  });
});

describe('cycleColorsByLevel', () => {
  it('reads the level custom property with a theme palette color as fallback', () => {
    expect(cycleColorsByLevel(0)).toBe('var(--schema-nested-level-0-color, var(--color-purple-7))');
    expect(cycleColorsByLevel(1)).toBe(
      'var(--schema-nested-level-1-color, var(--color-blueberry-7))',
    );
    expect(cycleColorsByLevel(8)).toBe(
      'var(--schema-nested-level-8-color, var(--color-magenta-7))',
    );
  });

  it('cycles through nine custom properties for deeper levels', () => {
    expect(cycleColorsByLevel(9)).toBe(cycleColorsByLevel(0));
    expect(cycleColorsByLevel(10)).toBe(cycleColorsByLevel(1));
  });

  it('returns undefined without a level', () => {
    expect(cycleColorsByLevel(undefined)).toBeUndefined();
  });
});
