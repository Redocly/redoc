import { describe, expect, it } from 'vitest';

import type { Document } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

function makeDocument(components: Record<string, unknown>): Document {
  return {
    openapi: '3.1.0',
    info: { title: 'test', version: '1.0.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const emptyDoc = makeDocument({});

// Parity with openapi-docs (fix/improve-displaying-exmaples): structured
// example values stay raw so the UI can render them as pretty-printed JSON,
// while scalar examples remain serialized strings.
describe('schemaProcessor structured example values', () => {
  it('preserves object examples as structured values', () => {
    const result = schemaProcessor(
      { type: 'object', example: { key: 'val', nested: { a: 1 } } },
      emptyDoc,
    );
    expect(result.example).toEqual({ key: 'val', nested: { a: 1 } });
  });

  it('preserves array examples as structured values', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string' }, example: ['first', 'second'] },
      emptyDoc,
    );
    expect(result.example).toEqual(['first', 'second']);
  });

  it('keeps scalar examples JSON-stringified', () => {
    const result = schemaProcessor({ type: 'string', example: 'hello' }, emptyDoc);
    expect(result.example).toBe('"hello"');
  });

  it('keeps serializer output for parameter-style examples even for objects', () => {
    const result = schemaProcessor({ type: 'object', example: { size: '700x700' } }, emptyDoc, {
      exampleSerializer: () => 'size=700x700',
    });
    expect(result.example).toBe('size=700x700');
  });

  it('derives a structured array example from primitive items examples', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'integer', example: 42 } },
      emptyDoc,
    );
    expect(result.example).toEqual([42]);
  });

  it('derives a structured array example from complex items examples', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: {
          type: 'object',
          properties: { id: { type: 'string' } },
          example: { id: '123' },
        },
      },
      emptyDoc,
    );
    expect(result.example).toEqual([{ id: '123' }]);
  });

  it('applies the exampleSerializer to array examples derived from primitive items', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', example: 'foo' } },
      emptyDoc,
      { exampleSerializer: (v) => `ids=${(v as string[]).join(',')}` },
    );
    expect(result.example).toBe('ids=foo');
  });

  it('applies the exampleSerializer to array examples derived from complex items', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: {
          type: 'object',
          properties: { id: { type: 'string' } },
          example: { id: '123' },
        },
      },
      emptyDoc,
      { exampleSerializer: (v) => JSON.stringify(v) },
    );
    expect(result.example).toBe('[{"id":"123"}]');
  });

  it('applies the exampleSerializer to hoisted shared variant examples', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          payload: {
            oneOf: [
              { type: 'object', example: { id: 'x' } },
              { type: 'object', example: { id: 'x' } },
            ],
          },
        },
      },
      emptyDoc,
      { exampleSerializer: (v) => `serialized:${JSON.stringify(v)}` },
    );
    expect((result.properties ?? {})['payload']?.example).toBe('serialized:{"id":"x"}');
  });

  it('hoists a shared structured variant example as a structured value', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          payload: {
            oneOf: [
              { type: 'object', example: { id: 'x' } },
              { type: 'object', example: { id: 'x' } },
            ],
          },
        },
      },
      emptyDoc,
    );
    expect((result.properties ?? {})['payload']?.example).toEqual({ id: 'x' });
  });
});
