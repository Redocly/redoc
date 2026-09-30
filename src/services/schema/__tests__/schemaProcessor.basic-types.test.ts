import { describe, it, expect } from 'vitest';

import type { Document, PropertyType } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

function requireProps(x: {
  properties?: Record<string, PropertyType>;
}): Record<string, PropertyType> {
  expect(x.properties).toBeDefined();
  const p = x.properties;
  if (!p) throw new Error('expected properties');
  return p;
}

function makeDocument(components: Record<string, unknown>, openapi = '3.1.0'): Document {
  return {
    openapi,
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const emptyDoc = makeDocument({});

describe('schemaProcessor basic types', () => {
  it('should process a simple string property', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc);
    expect(result.type).toBe('string');
    expect(result.isCircular).toBeFalsy();
    expect(result.isRequired).toBeFalsy();
    expect(result.switcher).toBeUndefined();
    expect(result.properties).toBeUndefined();
    expect(result.items).toBeUndefined();
  });

  it('should include format in type string', () => {
    const result = schemaProcessor({ type: 'string', format: 'date-time' }, emptyDoc);
    expect(result.type).toBe('string, (date-time)');
  });

  it('should expose title as a separate field for rendering', () => {
    const result = schemaProcessor({ type: 'string', title: 'UserId' }, emptyDoc);
    expect(result.type).toBe('string');
    expect(result.title).toBe('UserId');
  });

  it('should include contentEncoding in type string', () => {
    const result = schemaProcessor({ type: 'string', contentEncoding: 'base64' }, emptyDoc);
    expect(result.type).toBe('string, base64');
  });

  it('should detect type from keywords when type is absent', () => {
    const result = schemaProcessor({ properties: { name: { type: 'string' } } }, emptyDoc);
    expect(result.type).toBe('object');
    expect(result.properties).toBeDefined();
    expect(requireProps(result)['name'].type).toBe('string');
  });

  it('should display "any" when no type and no keywords', () => {
    const result = schemaProcessor({}, emptyDoc);
    expect(result.type).toBe('any');
  });

  it('should display array of item types', () => {
    const result = schemaProcessor({ type: 'array', items: { type: 'string' } }, emptyDoc);
    expect(result.type).toBe('Array of strings');
  });

  it('should display array item format', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', format: 'uri' } },
      emptyDoc,
    );
    expect(result.type).toBe('Array of strings, (uri)');
  });

  it('should append "or null" for nullable schemas', () => {
    const result = schemaProcessor({ type: 'string', nullable: true }, emptyDoc);
    expect(result.type).toBe('string or null');
  });

  it('should append "or null" for x-nullable schemas', () => {
    const result = schemaProcessor({ type: 'integer', 'x-nullable': true }, emptyDoc);
    expect(result.type).toBe('integer or null');
  });

  it('should handle union type arrays', () => {
    const result = schemaProcessor({ type: ['string', 'null'] }, emptyDoc);
    expect(result.type).toBe('string or null');
  });

  it('should not duplicate null in nullable union', () => {
    const result = schemaProcessor({ type: ['string', 'null'], nullable: true }, emptyDoc);
    expect(result.type).toBe('string or null');
  });
});
