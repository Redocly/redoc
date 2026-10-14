import { describe, it, expect } from 'vitest';

import { convertSwaggerToOpenApi } from '../swagger.js';

type Obj = Record<string, unknown>;

const cafe = (extra: Obj): Obj => ({
  swagger: '2.0',
  info: { title: 'Redocly Cafe', version: '1.0.0' },
  paths: {},
  ...extra,
});

const convert = (doc: Obj): Obj => JSON.parse(JSON.stringify(convertSwaggerToOpenApi(doc)));

/** Converts one definition and returns its schema. */
const convertSchema = (schema: Obj, extra: Obj = {}): unknown => {
  const result = convert(cafe({ definitions: { MenuItem: schema, ...extra } }));
  return (result.components as { schemas: Obj }).schemas.MenuItem;
};

describe('convertSwaggerToOpenApi', () => {
  it('keeps body x-examples on the generated requestBody', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders': {
            post: {
              operationId: 'createOrder',
              consumes: ['application/json'],
              parameters: [
                {
                  in: 'body',
                  name: 'order',
                  schema: { type: 'object', properties: { menuItemId: { type: 'string' } } },
                  'x-examples': {
                    'application/json': { flatWhite: { value: { menuItemId: 'flat-white' } } },
                  },
                },
              ],
              responses: { '201': { description: 'Order placed.' } },
            },
          },
        },
      }),
    );
    const requestBody = (converted.paths as Record<string, Record<string, Obj>>)['/orders']?.post
      ?.requestBody as Obj | undefined;

    expect(requestBody?.content).toBeDefined();
    expect(requestBody?.['x-examples']).toEqual({
      'application/json': { flatWhite: { value: { menuItemId: 'flat-white' } } },
    });
  });

  it('folds host, basePath and schemes into a single server', () => {
    const converted = convert(
      cafe({
        host: 'cafe.example.test',
        basePath: '/v2',
        schemes: ['https'],
        paths: {
          '/menu': {
            get: { operationId: 'listMenuItems', responses: { '200': { description: 'Menu.' } } },
          },
        },
      }),
    );

    expect(converted.openapi).toBe('3.2.0');
    expect(converted).not.toHaveProperty('swagger');
    expect(converted.servers).toEqual([{ url: 'https://cafe.example.test/v2' }]);
  });

  it('does not mutate its input', () => {
    const input = cafe({
      definitions: { MenuItem: { type: 'string', 'x-nullable': true } },
      paths: { '/menu': { get: { responses: {} } } },
    });
    const before = JSON.stringify(input);
    convertSwaggerToOpenApi(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  describe('3.2 differences', () => {
    it('turns x-nullable on a typed schema into a null type and drops it on an untyped one', () => {
      expect(convertSchema({ type: 'string', 'x-nullable': true })).toEqual({
        type: ['string', 'null'],
      });
      expect(convertSchema({ description: 'Any value', 'x-nullable': true })).toEqual({
        description: 'Any value',
      });
    });

    it('wraps a nullable $ref in anyOf and keeps its other siblings', () => {
      expect(
        convertSchema(
          { $ref: '#/definitions/Order', 'x-nullable': true, description: 'Last order' },
          { Order: { type: 'object' } },
        ),
      ).toEqual({
        anyOf: [{ $ref: '#/components/schemas/Order' }, { type: 'null' }],
        description: 'Last order',
      });
    });

    it('keeps type arrays and unwraps a single-entry one', () => {
      expect(convertSchema({ type: ['string', 'integer', 'null'] })).toEqual({
        type: ['string', 'integer', 'null'],
      });
      expect(convertSchema({ type: ['string'] })).toEqual({ type: 'string' });
    });

    it("keeps type: 'null'", () => {
      expect(convertSchema({ type: 'null' })).toEqual({ type: 'null' });
    });

    it('keeps $ref siblings', () => {
      expect(
        convertSchema(
          { $ref: '#/definitions/Order', description: 'Order on the tab' },
          { Order: { type: 'object' } },
        ),
      ).toEqual({ $ref: '#/components/schemas/Order', description: 'Order on the tab' });
    });

    it('turns boolean exclusive bounds into numeric ones', () => {
      expect(
        convertSchema({
          type: 'number',
          minimum: 0,
          exclusiveMinimum: true,
          maximum: 10,
          exclusiveMaximum: false,
        }),
      ).toEqual({ type: 'number', exclusiveMinimum: 0, maximum: 10 });
    });

    it('converts file form fields to binary strings and raw file bodies to a schemaless media type', () => {
      const converted = convert(
        cafe({
          paths: {
            '/menu/photos': {
              post: {
                consumes: ['multipart/form-data'],
                parameters: [{ name: 'photo', in: 'formData', type: 'file' }],
                responses: { '204': { description: 'Stored.' } },
              },
              put: {
                parameters: [{ name: 'photo', in: 'header', type: 'file', required: true }],
                responses: { '204': { description: 'Replaced.' } },
              },
            },
          },
        }),
      );
      const path = (converted.paths as Record<string, Record<string, Obj>>)['/menu/photos'];

      expect(path?.post?.requestBody).toEqual({
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: { photo: { type: 'string', format: 'binary' } },
            },
          },
        },
      });
      expect(path?.put?.requestBody).toEqual({
        required: true,
        content: { 'application/octet-stream': {} },
      });
    });

    it('keeps schema example and moves parameter x-example to example', () => {
      const converted = convert(
        cafe({
          definitions: { MenuItem: { type: 'string', example: 'Flat white' } },
          paths: {
            '/menu': {
              get: {
                parameters: [{ name: 'search', in: 'query', type: 'string', 'x-example': 'latte' }],
                responses: { '200': { description: 'Menu.' } },
              },
            },
          },
        }),
      );

      expect((converted.components as { schemas: Obj }).schemas.MenuItem).toEqual({
        type: 'string',
        example: 'Flat white',
      });
      expect(
        (converted.paths as Record<string, Record<string, Obj>>)['/menu']?.get?.parameters,
      ).toEqual([{ name: 'search', in: 'query', example: 'latte', schema: { type: 'string' } }]);
    });

    it('turns an existing nullable keyword into a null type', () => {
      expect(convertSchema({ type: 'integer', nullable: true })).toEqual({
        type: ['integer', 'null'],
      });
    });
  });
});
