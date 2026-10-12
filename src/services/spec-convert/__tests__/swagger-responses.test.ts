import { describe, it, expect } from 'vitest';

import { cafe, convert, convertOp, convertPath, opAt, sectionOf } from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

const responsesOf = (responses: Obj, op: Obj = {}, extra: Obj = {}): Obj =>
  convertOp({ ...op, responses }, extra).responses as Obj;

const stringSchema = { type: 'string' };

describe('response bodies', () => {
  it('defaults the media type to */*', () => {
    expect(responsesOf({ '200': { description: 'Menu.', schema: stringSchema } })).toEqual({
      '200': { description: 'Menu.', content: { '*/*': { schema: stringSchema } } },
    });
  });

  it('uses the root produces when the operation has none', () => {
    expect(
      responsesOf(
        { '200': { description: 'Menu.', schema: stringSchema } },
        {},
        { produces: ['application/json', 'application/xml'] },
      ),
    ).toEqual({
      '200': {
        description: 'Menu.',
        content: {
          'application/json': { schema: stringSchema },
          'application/xml': { schema: stringSchema },
        },
      },
    });
  });

  it('prefers the operation produces over the root one', () => {
    expect(
      responsesOf(
        { '200': { description: 'Menu.', schema: stringSchema } },
        { produces: ['text/csv'] },
        { produces: ['application/json'] },
      ),
    ).toEqual({
      '200': { description: 'Menu.', content: { 'text/csv': { schema: stringSchema } } },
    });
  });

  it('accepts a single produces string on the operation', () => {
    expect(
      responsesOf(
        { '200': { description: 'Menu.', schema: stringSchema } },
        { produces: 'text/csv' },
      ),
    ).toEqual({
      '200': { description: 'Menu.', content: { 'text/csv': { schema: stringSchema } } },
    });
  });

  it('gives every media type its own converted copy of the schema', () => {
    expect(
      responsesOf(
        { '200': { description: 'Menu.', schema: { type: 'string', 'x-nullable': true } } },
        { produces: ['application/json', 'application/xml'] },
      ),
    ).toEqual({
      '200': {
        description: 'Menu.',
        content: {
          'application/json': { schema: { type: ['string', 'null'] } },
          'application/xml': { schema: { type: ['string', 'null'] } },
        },
      },
    });
  });

  it('rewrites definition refs in the response schema', () => {
    expect(
      responsesOf({ '200': { description: 'Order.', schema: { $ref: '#/definitions/Order' } } }),
    ).toEqual({
      '200': {
        description: 'Order.',
        content: { '*/*': { schema: { $ref: '#/components/schemas/Order' } } },
      },
    });
  });

  it('turns a file schema into a binary string', () => {
    expect(responsesOf({ '200': { description: 'Receipt.', schema: { type: 'file' } } })).toEqual({
      '200': {
        description: 'Receipt.',
        content: { '*/*': { schema: { type: 'string', format: 'binary' } } },
      },
    });
  });

  it('keeps a null schema example as it is', () => {
    expect(
      responsesOf({ '200': { description: 'Menu.', schema: { type: 'string', example: null } } }),
    ).toEqual({
      '200': {
        description: 'Menu.',
        content: { '*/*': { schema: { type: 'string', example: null } } },
      },
    });
  });
});

describe('response examples', () => {
  it('attaches an example to the matching media type as the response example', () => {
    expect(
      responsesOf(
        {
          '200': {
            description: 'Item.',
            schema: { type: 'object' },
            examples: { 'application/json': { name: 'flat white' } },
          },
        },
        { produces: ['application/json', 'application/xml'] },
      ),
    ).toEqual({
      '200': {
        description: 'Item.',
        content: {
          'application/json': {
            schema: { type: 'object' },
            examples: { response: { value: { name: 'flat white' } } },
          },
          'application/xml': { schema: { type: 'object' } },
        },
      },
    });
  });

  it('creates a schemaless media type for an example whose type is not produced', () => {
    expect(
      responsesOf(
        {
          '200': {
            description: 'Item.',
            schema: { type: 'object' },
            examples: { 'text/plain': 'flat white' },
          },
        },
        { produces: ['application/json'] },
      ),
    ).toEqual({
      '200': {
        description: 'Item.',
        content: {
          'application/json': { schema: { type: 'object' } },
          'text/plain': { examples: { response: { value: 'flat white' } } },
        },
      },
    });
  });

  it('turns examples on a response without a schema into media types', () => {
    expect(
      responsesOf({
        '200': { description: 'Item.', examples: { 'application/json': { name: 'mocha' } } },
      }),
    ).toEqual({
      '200': {
        description: 'Item.',
        content: {
          'application/json': { examples: { response: { value: { name: 'mocha' } } } },
        },
      },
    });
  });
});

describe('response descriptions and shape', () => {
  it('fills a missing, null or empty description with an empty string', () => {
    expect(
      responsesOf({ '200': {}, '201': { description: null }, '202': { description: '' } }),
    ).toEqual({
      '200': { description: '' },
      '201': { description: '' },
      '202': { description: '' },
    });
  });

  it('adds a default response when the operation has none', () => {
    expect(convertOp({}).responses).toEqual({ default: { description: 'Default response' } });
  });

  it('keeps an empty responses object', () => {
    expect(responsesOf({})).toEqual({});
  });

  it('keeps a reference to a component response', () => {
    expect(responsesOf({ '404': { $ref: '#/responses/Missing' } })).toEqual({
      '404': { $ref: '#/components/responses/Missing' },
    });
  });

  it('leaves a header reference into another document untouched', () => {
    const responses = responsesOf({
      '200': {
        description: 'Brewed',
        headers: { 'X-Queue': { $ref: 'shared.yaml#/responses/Queue' } },
      },
    });

    expect((responses['200'] as Obj).headers).toEqual({
      'X-Queue': { $ref: 'shared.yaml#/responses/Queue' },
    });
  });

  it('decodes a percent-encoded response reference so it lands on the renamed component', () => {
    const converted = convert(
      cafe({
        responses: { 'sold out': { description: 'The item is sold out' } },
        paths: {
          '/orders': { post: { responses: { '409': { $ref: '#/responses/sold%20out' } } } },
        },
      }),
    );

    expect(opAt(converted, '/orders', 'post').responses).toEqual({
      '409': { $ref: '#/components/responses/sold_out' },
    });
    expect(Object.keys(sectionOf(converted, 'responses'))).toEqual(['sold_out']);
  });
});

describe('response headers', () => {
  const headersOf = (headers: Obj): Obj =>
    (responsesOf({ '200': { description: 'Done.', headers } })['200'] as Obj).headers as Obj;

  it('moves type and its keywords into the header schema', () => {
    expect(
      headersOf({
        'X-Remaining': {
          description: 'Orders left today',
          type: 'integer',
          format: 'int32',
          minimum: 0,
          maximum: 500,
          default: 100,
        },
      }),
    ).toEqual({
      'X-Remaining': {
        description: 'Orders left today',
        schema: { type: 'integer', format: 'int32', minimum: 0, maximum: 500, default: 100 },
      },
    });
  });

  it('folds boolean exclusive bounds into numeric ones in the header schema', () => {
    expect(
      headersOf({
        'X-Remaining': { type: 'integer', minimum: 0, exclusiveMinimum: true },
      }),
    ).toEqual({
      'X-Remaining': { schema: { type: 'integer', exclusiveMinimum: 0 } },
    });
  });

  it('converts nested array items in the header schema', () => {
    expect(
      headersOf({
        'X-Limits': {
          type: 'array',
          items: { type: 'integer', maximum: 9, exclusiveMaximum: true },
        },
      }),
    ).toEqual({
      'X-Limits': {
        style: 'simple',
        schema: { type: 'array', items: { type: 'integer', exclusiveMaximum: 9 } },
      },
    });
  });

  it('moves array items and bounds into the header schema and adds a simple style', () => {
    expect(
      headersOf({
        'X-Allergens': {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 5,
          uniqueItems: true,
          collectionFormat: 'csv',
        },
      }),
    ).toEqual({
      'X-Allergens': {
        style: 'simple',
        schema: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 5,
          uniqueItems: true,
        },
      },
    });
  });

  it('adds a simple style to an array header that names no collectionFormat', () => {
    expect(headersOf({ 'X-Allergens': { type: 'array', items: { type: 'string' } } })).toEqual({
      'X-Allergens': { style: 'simple', schema: { type: 'array', items: { type: 'string' } } },
    });
  });

  it('turns a multi collectionFormat into explode', () => {
    expect(
      headersOf({
        'X-Allergens': { type: 'array', items: { type: 'string' }, collectionFormat: 'multi' },
      }),
    ).toEqual({
      'X-Allergens': { explode: true, schema: { type: 'array', items: { type: 'string' } } },
    });
  });

  it('keeps a tsv collectionFormat as an extension', () => {
    expect(
      headersOf({
        'X-Allergens': { type: 'array', items: { type: 'string' }, collectionFormat: 'tsv' },
      }),
    ).toEqual({
      'X-Allergens': {
        'x-collectionFormat': 'tsv',
        schema: { type: 'array', items: { type: 'string' } },
      },
    });
  });

  it('drops collectionFormat from a header that is not an array', () => {
    expect(headersOf({ 'X-Table': { type: 'string', collectionFormat: 'csv' } })).toEqual({
      'X-Table': { schema: { type: 'string' } },
    });
  });

  it('gives a header without a type an empty schema instead of failing', () => {
    expect(headersOf({ 'X-Table': { description: 'Table number' } })).toEqual({
      'X-Table': { description: 'Table number', schema: {} },
    });
  });

  it('removes a header named Status Code', () => {
    expect(
      headersOf({ 'Status Code': { type: 'integer' }, 'X-Table': { type: 'integer' } }),
    ).toEqual({ 'X-Table': { schema: { type: 'integer' } } });
  });

  it('does not rewrite an x-example on a header', () => {
    expect(headersOf({ 'X-Table': { type: 'integer', 'x-example': 7 } })).toEqual({
      'X-Table': { schema: { type: 'integer' }, 'x-example': 7 },
    });
  });
});

describe('component responses', () => {
  it('converts a response under the root produces', () => {
    const converted = convert(
      cafe({
        produces: ['application/json'],
        responses: {
          Gone: {
            description: 'No longer served.',
            schema: { $ref: '#/definitions/Problem' },
            headers: { 'X-Retry': { type: 'integer' } },
          },
        },
      }),
    );

    expect(sectionOf(converted, 'responses')).toEqual({
      Gone: {
        description: 'No longer served.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Problem' } } },
        headers: { 'X-Retry': { schema: { type: 'integer' } } },
      },
    });
  });

  it('falls back to */* without a root produces', () => {
    const converted = convert(
      cafe({ responses: { Gone: { description: 'Gone.', schema: stringSchema } } }),
    );

    expect(sectionOf(converted, 'responses')).toEqual({
      Gone: { description: 'Gone.', content: { '*/*': { schema: stringSchema } } },
    });
  });

  it('sanitises component response names', () => {
    const converted = convert(cafe({ responses: { 'Not Found': { description: 'Missing.' } } }));

    expect(Object.keys(sectionOf(converted, 'responses'))).toEqual(['Not_Found']);
  });

  it('throws when two response names sanitise to the same name', () => {
    expect(() =>
      convert(
        cafe({
          responses: { 'Not Found': { description: 'A' }, Not_Found: { description: 'B' } },
        }),
      ),
    ).toThrow(/Duplicate/);
  });
});

describe('response processing across path items', () => {
  it('converts the responses of every operation on a path', () => {
    const path = convertPath({
      get: { responses: { '200': { description: 'Order.', schema: stringSchema } } },
      delete: { responses: { '204': { description: 'Removed.' } } },
    });

    expect(path.get).toEqual({
      responses: {
        '200': { description: 'Order.', content: { '*/*': { schema: stringSchema } } },
      },
    });
    expect(path.delete).toEqual({ responses: { '204': { description: 'Removed.' } } });
  });
});
