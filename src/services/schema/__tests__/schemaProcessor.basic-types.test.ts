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
  it('treats a malformed type as absent and a YAML null type as null', () => {
    const result = schemaProcessor({ type: {} } as never, emptyDoc);
    expect(result.type).toBe('any');
    expect(schemaProcessor({ type: null } as never, emptyDoc).type).toBe('null');
    const object = schemaProcessor(
      { type: null, properties: { id: { type: 'string' } } } as never,
      emptyDoc,
    );
    expect(object.type).toBe('object');
    expect(requireProps(object).id.type).toBe('string');
    const array = schemaProcessor({ type: {}, items: { type: {} } } as never, emptyDoc);
    expect(array.type).toBe('Array of any');
  });

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

  describe('boolean schemas', () => {
    const NO_VALUE = 'no value allowed';

    it('shows true as any and false as no value allowed', () => {
      const result = schemaProcessor(
        {
          type: 'object',
          default: { never: 1 },
          properties: {
            anything: true,
            never: false,
            tuple: { type: 'array', prefixItems: [true, false] },
            choice: { oneOf: [true, false] },
            mixed: { oneOf: [true, false, { type: 'string' }] },
          },
          patternProperties: { '^x-': false },
        } as never,
        emptyDoc,
      );
      const props = requireProps(result);
      expect(props.anything.type).toBe('any');
      expect(props.never.type).toBe(NO_VALUE);
      expect(props['^x-'].type).toBe(NO_VALUE);
      const tuple = props.tuple.items;
      expect(Array.isArray(tuple) ? tuple.map((item) => item.type) : tuple).toEqual([
        'any',
        NO_VALUE,
      ]);
      const options = props.choice.switcher?.options ?? {};
      expect(Object.values(options).map((option) => option.typeLabel)).toEqual(['any', NO_VALUE]);
      expect(props.mixed.type).toBe('any or string');
    });

    it('keeps items and additionalProperties false as closed arrays and objects', () => {
      const result = schemaProcessor(
        {
          type: 'object',
          properties: {
            none: { type: 'array', items: false },
            closed: { type: 'object', additionalProperties: false },
          },
        },
        emptyDoc,
      );
      const props = requireProps(result);
      expect(props.none.type).toBe('Array of items');
      expect(props.closed.type).toBe('object');
      expect(props.closed.properties).toEqual({});
    });

    it('renders a $ref to a boolean schema like the boolean schema itself', () => {
      const doc = makeDocument({ NoValue: false, AnyValue: true });
      const noValue = { $ref: '#/components/schemas/NoValue' };
      const anyValue = { $ref: '#/components/schemas/AnyValue' };

      expect(schemaProcessor(noValue, doc).type).toBe(NO_VALUE);
      expect(schemaProcessor({ ...noValue, description: 'ignored' }, doc).type).toBe(NO_VALUE);
      const withSiblings = schemaProcessor(
        { ...anyValue, type: 'string', description: 'kept' },
        doc,
      );
      expect(withSiblings.type).toBe('string');
      expect(withSiblings.description).toBe('kept');

      const props = requireProps(
        schemaProcessor(
          {
            type: 'object',
            properties: {
              never: noValue,
              anything: anyValue,
              list: { type: 'array', items: noValue },
              choice: { oneOf: [noValue, { type: 'string' }] },
            },
          },
          doc,
        ),
      );
      expect(props.never.type).toBe(NO_VALUE);
      expect(props.anything.type).toBe('any');
      expect(props.list.type).toBe('Array of items');
      expect(props.choice.type).toBe('string');
    });

    it('renders an allOf with a false part, inline or through a $ref, as no value allowed', () => {
      const doc = makeDocument({ NoValue: false });
      const object = { type: 'object', properties: { x: { type: 'string' } } };
      const viaRef = { allOf: [{ $ref: '#/components/schemas/NoValue' }, object] };

      expect(schemaProcessor(viaRef, doc).type).toBe(NO_VALUE);
      expect(schemaProcessor({ allOf: [false, object] } as never, doc).type).toBe(NO_VALUE);
      const props = requireProps(
        schemaProcessor({ type: 'object', properties: { p: viaRef } }, doc),
      );
      expect(props.p.type).toBe(NO_VALUE);
    });
  });
});
