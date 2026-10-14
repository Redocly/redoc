import { describe, test, expect } from 'vitest';

import type { AvroSchema } from '../../../../types/asyncapi.js';

import { avroToJsonSchema } from '../avro-to-json-schema.js';

describe('avroToJsonSchema', () => {
  test('should convert primitive types', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'SimpleTypes',
      fields: [
        { name: 'stringField', type: 'string' },
        { name: 'intField', type: 'int' },
        { name: 'longField', type: 'long' },
        { name: 'booleanField', type: 'boolean' },
        { name: 'bytesField', type: 'bytes' },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'SimpleTypes',
      properties: {
        stringField: { type: 'string' },
        intField: { type: 'integer' },
        longField: { type: 'integer' },
        booleanField: { type: 'boolean' },
        bytesField: { type: 'string', contentEncoding: 'base64' },
      },
      required: ['stringField', 'intField', 'longField', 'booleanField', 'bytesField'],
      additionalProperties: false,
    });
  });

  test('should convert fields with documentation and default values', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'WithDefaults',
      fields: [
        {
          name: 'fieldWithDoc',
          type: 'string',
          doc: 'This is a documentation',
        },
        {
          name: 'fieldWithDefault',
          type: 'string',
          default: 'default value',
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'WithDefaults',
      properties: {
        fieldWithDoc: {
          type: 'string',
          description: 'This is a documentation',
        },
        fieldWithDefault: {
          type: 'string',
          default: 'default value',
        },
      },
      required: ['fieldWithDoc'],
      additionalProperties: false,
    });
  });

  test('should convert arrays', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'ArrayTypes',
      fields: [
        {
          name: 'simpleArray',
          type: {
            type: 'array',
            items: 'string',
          },
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'ArrayTypes',
      properties: {
        simpleArray: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['simpleArray'],
      additionalProperties: false,
    });
  });

  test('should convert nested records', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'NestedRecord',
      fields: [
        {
          name: 'address',
          type: {
            type: 'record',
            name: 'Address',
            fields: [
              { name: 'street', type: 'string' },
              { name: 'city', type: 'string' },
            ],
          },
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'NestedRecord',
      properties: {
        address: {
          type: 'object',
          title: 'Address',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
          required: ['street', 'city'],
          additionalProperties: false,
        },
      },
      required: ['address'],
      additionalProperties: false,
    });
  });

  test('should convert enum types', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'EnumRecord',
      fields: [
        {
          name: 'status',
          type: {
            type: 'enum',
            name: 'Status',
            symbols: ['ACTIVE', 'INACTIVE', 'PENDING'],
            doc: 'User status',
          },
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'EnumRecord',
      properties: {
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
          title: 'Status',
          description: 'User status',
        },
      },
      required: ['status'],
      additionalProperties: false,
    });
  });

  test('should convert union types', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'UnionRecord',
      fields: [
        {
          name: 'nullableString',
          type: ['null', 'string'],
        },
        {
          name: 'multiType',
          type: ['string', 'int', 'boolean'],
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'UnionRecord',
      properties: {
        nullableString: {
          type: 'string',
          nullable: true,
        },
        multiType: {
          oneOf: [{ type: 'string' }, { type: 'integer' }, { type: 'boolean' }],
        },
      },
      required: ['multiType'],
      additionalProperties: false,
    });
  });

  test('should handle unknown types', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      fields: [
        {
          name: 'invalid',
          type: 'unknown' as string,
        },
      ],
    };

    expect(avroToJsonSchema(avroSchema)).toEqual({
      type: 'object',
      properties: {
        invalid: { type: 'null' },
      },
      required: ['invalid'],
      additionalProperties: false,
    });
  });

  test('should convert named types', () => {
    const avroSchema: AvroSchema = {
      type: 'record',
      name: 'NamedTypes',
      fields: [
        {
          name: 'before',
          type: [
            'null',
            {
              type: 'record',
              name: 'row',
              fields: [
                {
                  name: 'ID',
                  type: ['null', 'double'],
                  default: null,
                },
              ],
            },
          ],
          default: null,
        },
        {
          name: 'after',
          type: ['null', 'row'],
          default: null,
        },
      ],
    };

    const result = avroToJsonSchema(avroSchema);

    expect(result).toEqual({
      type: 'object',
      title: 'NamedTypes',
      properties: {
        before: {
          default: null,
          nullable: true,
          type: 'object',
          title: 'row',
          properties: {
            ID: { type: 'number', nullable: true, default: null },
          },
          additionalProperties: false,
        },
        after: {
          default: null,
          nullable: true,
          type: 'object',
          title: 'row',
          properties: {
            ID: { type: 'number', nullable: true, default: null },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    });
  });
});
