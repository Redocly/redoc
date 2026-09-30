import { describe, it, expect } from 'vitest';
import * as Sampler from 'openapi-sampler';

import { convertSampleToString } from '../convertSampleToString.js';
import { isSequentialMediaType } from '../../../utils/media-type.js';

describe('JSONL array schema pipeline (inline array schema)', () => {
  const arraySchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        operationId: { type: 'string', example: 'op_001' },
        status: { type: 'string', enum: ['success', 'failed'], example: 'success' },
        resourceId: { type: 'string', example: 'user_789' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T11:00:00Z' },
      },
      required: ['operationId', 'status'],
    },
  };

  function generatedSampleAtomBehavior(
    schemaData: Record<string, unknown>,
    mediaType: string,
    {
      context = 'response',
      generatedSamplesMaxDepth,
    }: { context?: 'request' | 'response'; generatedSamplesMaxDepth?: number } = {},
  ): unknown {
    const normalizedMediaType = mediaType.toLowerCase();
    const isSequential = isSequentialMediaType(normalizedMediaType);
    const maxSampleDepth = generatedSamplesMaxDepth;

    const samplerOptions = {
      skipReadOnly: context === 'request',
      skipWriteOnly: context === 'response',
      quiet: true,
      skipNonRequired: false,
      ...(maxSampleDepth !== undefined && { maxSampleDepth }),
    } as Record<string, unknown>;
    const spec = {
      openapi: '3.0.0',
      info: { title: '', version: '' },
      paths: {},
      components: { schemas: {} },
    };

    const sample = Sampler.sample(schemaData, samplerOptions, spec);

    if (isSequential && sample !== null && sample !== undefined) {
      const variants = Array.isArray((schemaData as { oneOf?: unknown }).oneOf)
        ? ((schemaData as { oneOf: unknown[] }).oneOf.filter(
            (variant): variant is Record<string, unknown> =>
              typeof variant === 'object' && variant !== null,
          ) as Record<string, unknown>[])
        : [];
      if (variants.length > 0) {
        const streamItems = variants
          .map((variant) => Sampler.sample(variant, samplerOptions, spec))
          .filter((variantSample) => variantSample !== null && variantSample !== undefined);
        if (streamItems.length > 0) {
          return convertSampleToString(streamItems, normalizedMediaType, schemaData, false);
        }
      }
      return convertSampleToString(sample, normalizedMediaType, schemaData, true);
    }

    return sample;
  }

  it('keeps array-item properties populated when generatedSamplesMaxDepth=8', () => {
    const result = generatedSampleAtomBehavior(arraySchema, 'application/jsonl', {
      generatedSamplesMaxDepth: 8,
    });

    expect(String(result)).toBe(
      '[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]\n[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]\n[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]',
    );
  });

  it('converts sequential examples even with mixed-case media type', () => {
    const result = generatedSampleAtomBehavior(arraySchema, 'Application/Jsonl', {
      generatedSamplesMaxDepth: 8,
    });

    expect(String(result)).toBe(
      '[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]\n[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]\n[{"operationId":"op_001","status":"success","resourceId":"user_789","createdAt":"2024-01-15T11:00:00Z"}]',
    );
  });

  it('keeps nested itemSchema object properties populated when generatedSamplesMaxDepth=8', () => {
    const complexItemSchema = {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user_123' },
        profile: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            preferences: {
              type: 'object',
              properties: {
                theme: { type: 'string', enum: ['light', 'dark'], example: 'dark' },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean', example: true },
                    push: { type: 'boolean', example: false },
                  },
                },
              },
            },
          },
        },
        metadata: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['premium', 'verified'],
            },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00Z' },
          },
        },
      },
      required: ['id', 'profile'],
    };

    const result = generatedSampleAtomBehavior(complexItemSchema, 'application/jsonl', {
      generatedSamplesMaxDepth: 8,
    });
    const expectedLine =
      '{"id":"user_123","profile":{"name":"John Doe","email":"john.doe@example.com","preferences":{"theme":"dark","notifications":{"email":true,"push":false}}},"metadata":{"tags":["premium","verified"],"createdAt":"2024-01-15T10:00:00Z"}}';
    expect(String(result)).toBe(`${expectedLine}\n${expectedLine}\n${expectedLine}`);
  });

  it('streams oneOf variants as distinct lines (not repeated first variant)', () => {
    const oneOfItemSchema = {
      oneOf: [
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'user_created' },
            userId: { type: 'string', example: 'user_123' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00Z' },
            data: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
              },
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'user_updated' },
            userId: { type: 'string', example: 'user_123' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T11:00:00Z' },
            changes: {
              type: 'array',
              items: { type: 'string' },
              example: ['email', 'name'],
            },
          },
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'user_deleted' },
            userId: { type: 'string', example: 'user_123' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T12:00:00Z' },
          },
        },
      ],
    };

    const result = generatedSampleAtomBehavior(oneOfItemSchema, 'application/jsonl', {
      generatedSamplesMaxDepth: 8,
    });
    expect(String(result)).toBe(
      '{"type":"user_created","userId":"user_123","timestamp":"2024-01-15T10:00:00Z","data":{"name":"John Doe","email":"john@example.com"}}\n{"type":"user_updated","userId":"user_123","timestamp":"2024-01-15T11:00:00Z","changes":["email","name"]}\n{"type":"user_deleted","userId":"user_123","timestamp":"2024-01-15T12:00:00Z"}',
    );
  });

  it('keeps deep nested multipart attachments populated for schema-only examples', () => {
    const multipartSchema = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        metadata: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            author: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
        content: {
          type: 'object',
          properties: {
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  text: { type: 'string' },
                  attachments: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        filename: { type: 'string' },
                        size: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'metadata'],
    };

    const result = generatedSampleAtomBehavior(multipartSchema, 'multipart/mixed', {
      generatedSamplesMaxDepth: 8,
    });

    expect(String(result)).toContain('"attachments": [');
    expect(String(result)).toContain('"filename": "string"');
    expect(String(result)).toContain('"size": 0');
    expect(String(result)).not.toContain('"attachments": [\n          {}');
  });
});
