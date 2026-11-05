import { describe, it, expect, vi, afterEach } from 'vitest';

import type * as AllofMerge from '@redocly/allof-merge';
import * as allOfMerge from '@redocly/allof-merge';

import type { Document } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

vi.mock('@redocly/allof-merge', async (importOriginal) => {
  const original = await importOriginal<typeof AllofMerge>();
  return { ...original, merge: vi.fn(original.merge) };
});

const document = {
  openapi: '3.1.0',
  info: { title: '', version: '1.0' },
  paths: {},
  components: {
    schemas: {
      Base: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer', enum: [1, 2] } },
      },
    },
  },
} as Document;

function withPart(part: Record<string, unknown>) {
  return {
    allOf: [
      { $ref: '#/components/schemas/Base' },
      { type: 'object', properties: { name: { type: 'string' } }, ...part },
    ],
  };
}

describe('schemaProcessor with a malformed allOf part', () => {
  afterEach(() => {
    vi.mocked(allOfMerge.merge).mockRestore();
  });

  it.each([
    ['required: null', { required: null }],
    ['required: true', { required: true }],
  ])('merges the valid parts when the part has %s', (_name, part) => {
    const result = schemaProcessor(withPart(part), document);

    expect(Object.keys(result.properties ?? {})).toEqual(['id', 'name']);
    expect(result.properties?.id.isRequired).toBe(true);
  });

  it('keeps the other part properties when the part has properties: null', () => {
    const result = schemaProcessor(withPart({ properties: null }), document);

    expect(Object.keys(result.properties ?? {})).toEqual(['id']);
  });

  it('keeps the other part enum when the part has enum: null', () => {
    const result = schemaProcessor(
      withPart({ properties: { id: { type: 'integer', enum: null } } }),
      document,
    );

    expect(result.properties?.id.enum).toEqual([1, 2]);
  });

  it('renders the schema unmerged when the merge throws', () => {
    vi.mocked(allOfMerge.merge).mockImplementation(() => {
      throw new TypeError('n is not iterable');
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => schemaProcessor(withPart({}), document)).not.toThrow();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
