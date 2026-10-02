import { describe, test, expect, vi, beforeEach } from 'vitest';

import { resolveAsyncApiSchema } from '../resolve-schema.js';
import { avroToJsonSchema } from '../avro-to-json-schema.js';

vi.mock('../avro-to-json-schema', () => ({
  avroToJsonSchema: vi.fn((schema) => ({ convertedSchema: schema })),
}));

describe('resolveAsyncApiSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Avro schema format', () => {
    test('should convert Avro schema when schemaFormat is application/vnd.apache.avro', () => {
      const input = {
        schemaFormat: 'application/vnd.apache.avro',
        schema: {
          type: 'record',
          name: 'TestSchema',
          fields: [{ name: 'testField', type: 'string' }],
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).toHaveBeenCalledWith(input.schema);
      expect(result).toEqual({ convertedSchema: input.schema });
    });

    test('should convert Avro schema when schemaFormat is application/vnd.apache.avro+json', () => {
      const input = {
        schemaFormat: 'application/vnd.apache.avro+json;version=1.9.0',
        schema: {
          type: 'record',
          name: 'TestSchema',
          fields: [{ name: 'testField', type: 'string' }],
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).toHaveBeenCalledWith(input.schema);
      expect(result).toEqual({ convertedSchema: input.schema });
    });

    test('should convert Avro schema when schemaFormat is application/vnd.apache.avro+yaml', () => {
      const input = {
        schemaFormat: 'application/vnd.apache.avro+yaml;version=1.9.0',
        schema: {
          type: 'record',
          name: 'TestSchema',
          fields: [{ name: 'testField', type: 'string' }],
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).toHaveBeenCalledWith(input.schema);
      expect(result).toEqual({ convertedSchema: input.schema });
    });
  });

  describe('AsyncAPI JSON Schema format', () => {
    test('should return schema as-is when schemaFormat is application/vnd.aai.asyncapi+json', () => {
      const input = {
        schemaFormat: 'application/vnd.aai.asyncapi+json;version=3.0.0',
        schema: {
          $ref: '#/components/schemas/UserSignedUpPayload',
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).not.toHaveBeenCalled();
      expect(result).toEqual(input.schema);
    });

    test('should return schema as-is for inline JSON Schema with schemaFormat', () => {
      const input = {
        schemaFormat: 'application/vnd.aai.asyncapi+json;version=3.0.0',
        schema: {
          type: 'string',
          examples: ['string'],
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).not.toHaveBeenCalled();
      expect(result).toEqual(input.schema);
    });
  });

  describe('Direct schema (no MultiFormatSchemaObject)', () => {
    test('should return input value as-is when no schema/schemaFormat properties exist', () => {
      const input = {
        type: 'object' as const,
        properties: {
          testProperty: { type: 'string' as const },
        },
      };

      const result = resolveAsyncApiSchema(input);

      expect(avroToJsonSchema).not.toHaveBeenCalled();
      expect(result).toBe(input);
    });

    test('should handle undefined', () => {
      expect(resolveAsyncApiSchema(undefined)).toBeUndefined();
      expect(avroToJsonSchema).not.toHaveBeenCalled();
    });
  });
});
