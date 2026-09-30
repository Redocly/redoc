import { describe, it, expect } from 'vitest';

import type { Document } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

const emptyDoc = {
  openapi: '3.1.0',
  info: { title: '', version: '1.0' },
  paths: {},
  components: { schemas: {} },
} as Document;

// The merge distributes readOnly/writeOnly into oneOf/anyOf branches; the tree
// builder must hoist the shared flag back so skipReadOnly/skipWriteOnly works.
describe('schemaProcessor accessMode on combinary properties', () => {
  const oneOfVariants = [
    {
      type: 'object',
      title: 'AccessTokenCredential',
      properties: { token: { type: 'string' } },
    },
    {
      type: 'object',
      title: 'OAuth2CodeCredential',
      properties: { code: { type: 'string' } },
    },
  ];

  it('keeps write-only accessMode on a writeOnly property with oneOf (secretData case)', () => {
    const result = schemaProcessor(
      {
        allOf: [
          { type: 'object', properties: { id: { type: 'string' } } },
          {
            type: 'object',
            properties: {
              secretData: {
                type: 'object',
                description: 'Credential secret data.',
                writeOnly: true,
                oneOf: oneOfVariants,
              },
            },
          },
        ],
      },
      emptyDoc,
    );

    expect(result.properties?.secretData?.accessMode).toBe('write-only');
  });

  it('keeps read-only accessMode on a readOnly property with anyOf', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          audit: { readOnly: true, anyOf: oneOfVariants },
        },
      },
      emptyDoc,
    );

    expect(result.properties?.audit?.accessMode).toBe('read-only');
  });

  it('does not hoist when only some variants carry an access flag', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          mixed: {
            oneOf: [{ type: 'string', writeOnly: true }, { type: 'number' }],
          },
        },
      },
      emptyDoc,
    );

    expect(result.properties?.mixed?.accessMode).toBeUndefined();
  });

  it('does not hoist when variants disagree on the access flag', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          conflicting: {
            oneOf: [
              { type: 'string', writeOnly: true },
              { type: 'number', readOnly: true },
            ],
          },
        },
      },
      emptyDoc,
    );

    expect(result.properties?.conflicting?.accessMode).toBeUndefined();
  });

  it('carries the distributed access flag onto each switcher option', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          options: {
            readOnly: true,
            oneOf: [
              {
                type: 'object',
                title: 'ScaffoldOptions',
                properties: { seed: { type: 'string' } },
              },
              { type: 'null' },
            ],
          },
        },
      },
      emptyDoc,
    );

    const switcherOptions = Object.values(result.properties?.options?.switcher?.options ?? {});
    expect(switcherOptions).toHaveLength(2);
    for (const option of switcherOptions) {
      expect(option.accessMode).toBe('read-only');
    }
  });

  it('keeps plain (non-combinary) writeOnly accessMode intact', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          secret: { type: 'string', writeOnly: true },
        },
      },
      emptyDoc,
    );

    expect(result.properties?.secret?.accessMode).toBe('write-only');
  });
});
