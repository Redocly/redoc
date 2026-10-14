import { describe, it, expect } from 'vitest';

import type { Document, PropertyType } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

const EMPTY_DOC: Document = {
  openapi: '3.1.0',
  info: { title: '', version: '1.0' },
  paths: {},
  components: { schemas: {} },
} as Document;

function requireProps(x: {
  properties?: Record<string, PropertyType>;
}): Record<string, PropertyType> {
  if (!x.properties) throw new Error('expected properties on the processed schema');
  return x.properties;
}

describe('buildObjectProperties — deprecated fields sort to the bottom', () => {
  it('groups deprecated properties below all active properties regardless of spec order', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          activeOne: { type: 'string' },
          deprecatedAlpha: { type: 'string', deprecated: true },
          activeTwo: { type: 'number' },
          deprecatedBeta: { type: 'boolean', deprecated: true },
          activeThree: { type: 'string' },
        },
      },
      EMPTY_DOC,
    );

    expect(Object.keys(requireProps(result))).toEqual([
      'activeOne',
      'activeTwo',
      'activeThree',
      'deprecatedAlpha',
      'deprecatedBeta',
    ]);

    const props = requireProps(result);
    expect(props.deprecatedAlpha.isDeprecated).toBe(true);
    expect(props.deprecatedBeta.isDeprecated).toBe(true);
    expect(props.activeOne.isDeprecated).toBeFalsy();
    expect(props.activeTwo.isDeprecated).toBeFalsy();
    expect(props.activeThree.isDeprecated).toBeFalsy();
  });

  it('preserves spec order within each group (stable sort, not arbitrary)', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          deprecatedD: { type: 'string', deprecated: true },
          activeA: { type: 'string' },
          deprecatedE: { type: 'number', deprecated: true },
          activeB: { type: 'string' },
          deprecatedF: { type: 'boolean', deprecated: true },
          activeC: { type: 'string' },
        },
      },
      EMPTY_DOC,
    );

    expect(Object.keys(requireProps(result))).toEqual([
      'activeA',
      'activeB',
      'activeC',
      'deprecatedD',
      'deprecatedE',
      'deprecatedF',
    ]);
  });
});
