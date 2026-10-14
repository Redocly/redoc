import { describe, it, expect } from 'vitest';

import type { Document, SchemaNode } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

function makeDocument(components: Record<string, unknown> = {}): Document {
  return {
    openapi: '3.1.0',
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const doc = makeDocument();

describe('schemaProcessor isExpandable', () => {
  it('returns false for an object whose direct children are all primitive', () => {
    const schema: SchemaNode = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns false for an empty object', () => {
    expect(schemaProcessor({ type: 'object' }, doc).isExpandable).toBe(false);
  });

  it('returns true when a direct child is itself a non-empty object', () => {
    const schema: SchemaNode = {
      type: 'object',
      properties: {
        a: { type: 'object', properties: { x: { type: 'integer' } } },
        b: { type: 'string' },
      },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns true when a direct child is an array of objects', () => {
    const schema: SchemaNode = {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'string' } } },
        },
      },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns false for an array-of-objects at the root', () => {
    const schema: SchemaNode = {
      type: 'array',
      items: { type: 'object', properties: { id: { type: 'string' } } },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns false for an array of primitives at the root', () => {
    const schema: SchemaNode = { type: 'array', items: { type: 'string' } };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns true when a oneOf variant has a nested-object field', () => {
    const schema: SchemaNode = {
      oneOf: [
        { type: 'object', properties: { kind: { type: 'string' } } },
        {
          type: 'object',
          properties: { detail: { type: 'object', properties: { x: { type: 'integer' } } } },
        },
      ],
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns false when all oneOf variants only have primitive fields', () => {
    const schema: SchemaNode = {
      oneOf: [
        { type: 'object', properties: { a: { type: 'string' } } },
        { type: 'object', properties: { b: { type: 'integer' } } },
      ],
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns false when the property is circular', () => {
    const components = {
      Node: {
        type: 'object',
        properties: {
          self: { $ref: '#/components/schemas/Node' },
        },
      },
    };
    const result = schemaProcessor(
      { $ref: '#/components/schemas/Node' } as SchemaNode,
      makeDocument(components),
    );
    expect(result.isExpandable).toBe(false);
  });

  it('returns true when at least one field is non-primitive alongside circular ones', () => {
    const components = {
      Node: {
        type: 'object',
        properties: {
          self: { $ref: '#/components/schemas/Node' },
          meta: {
            type: 'object',
            properties: { createdAt: { type: 'string', format: 'date-time' } },
          },
        },
      },
    };
    const result = schemaProcessor(
      { $ref: '#/components/schemas/Node' } as SchemaNode,
      makeDocument(components),
    );
    expect(result.isExpandable).toBe(true);
  });

  // ── Switcher-option edges (variants without `.properties` of their own) ──
  it('returns true for anyOf where a variant is an array of objects-with-nested', () => {
    const schema: SchemaNode = {
      anyOf: [
        { type: 'object', properties: { kind: { type: 'string' } } },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              detail: { type: 'object', properties: { x: { type: 'integer' } } },
            },
          },
        },
      ],
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns false when every oneOf variant is an array of object-of-primitives (flat)', () => {
    const schema: SchemaNode = {
      oneOf: [
        { type: 'array', items: { type: 'object', properties: { id: { type: 'string' } } } },
        { type: 'array', items: { type: 'object', properties: { code: { type: 'integer' } } } },
      ],
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns true when a oneOf variant itself wraps a oneOf with nested-object content', () => {
    const schema: SchemaNode = {
      oneOf: [
        {
          oneOf: [
            {
              type: 'object',
              properties: { nested: { type: 'object', properties: { x: { type: 'string' } } } },
            },
            { type: 'object', properties: { plain: { type: 'string' } } },
          ],
        },
        { type: 'object', properties: { kind: { type: 'string' } } },
      ],
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  // ── Discriminator ──
  it('returns true when a discriminator has at least one variant with nested fields', () => {
    const components = {
      Animal: {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
        discriminator: { propertyName: 'kind' },
      },
      Cat: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          favoriteToy: { type: 'object', properties: { name: { type: 'string' } } },
        },
      },
      Dog: { type: 'object', properties: { kind: { type: 'string' }, age: { type: 'integer' } } },
    };
    const result = schemaProcessor(
      { $ref: '#/components/schemas/Animal' } as SchemaNode,
      makeDocument(components),
    );
    expect(result.isExpandable).toBe(true);
  });

  // ── additionalProperties / patternProperties ──
  it('returns true when additionalProperties is an object schema with nested fields', () => {
    const schema: SchemaNode = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: { label: { type: 'string' }, value: { type: 'number' } },
      },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns false when additionalProperties is a primitive', () => {
    const schema: SchemaNode = {
      type: 'object',
      additionalProperties: { type: 'string' },
    };
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });

  it('returns true when patternProperties values are nested objects', () => {
    const schema: SchemaNode = {
      type: 'object',
      patternProperties: {
        '^x-': { type: 'object', properties: { v: { type: 'string' } } },
      },
    } as SchemaNode;
    expect(schemaProcessor(schema, doc).isExpandable).toBe(true);
  });

  it('returns false when patternProperties values are primitives', () => {
    const schema: SchemaNode = {
      type: 'object',
      patternProperties: { '^x-': { type: 'string' } },
    } as SchemaNode;
    expect(schemaProcessor(schema, doc).isExpandable).toBe(false);
  });
});
