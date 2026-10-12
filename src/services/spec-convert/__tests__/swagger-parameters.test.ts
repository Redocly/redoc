import { describe, it, expect } from 'vitest';

import { cafe, convert, convertOp, convertPath, ok, opAt, sectionOf } from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

const paramsOf = (param: Obj, extra: Obj = {}): unknown =>
  convertOp({ parameters: [param], responses: ok }, extra).parameters;

describe('non-body parameters', () => {
  it('moves the type and every validation keyword into schema', () => {
    expect(
      paramsOf({
        name: 'size',
        in: 'query',
        description: 'Cup size in ml',
        required: false,
        type: 'integer',
        format: 'int32',
        minimum: 100,
        maximum: 600,
        multipleOf: 50,
        default: 300,
        enum: [100, 300, 600],
      }),
    ).toEqual([
      {
        name: 'size',
        in: 'query',
        description: 'Cup size in ml',
        required: false,
        schema: {
          type: 'integer',
          format: 'int32',
          minimum: 100,
          maximum: 600,
          multipleOf: 50,
          default: 300,
          enum: [100, 300, 600],
        },
      },
    ]);
  });

  it('moves string, array and object keywords into schema', () => {
    expect(
      paramsOf({
        name: 'code',
        in: 'query',
        type: 'string',
        minLength: 3,
        maxLength: 8,
        pattern: '^[A-Z]+$',
      }),
    ).toEqual([
      {
        name: 'code',
        in: 'query',
        schema: { type: 'string', minLength: 3, maxLength: 8, pattern: '^[A-Z]+$' },
      },
    ]);
    expect(
      paramsOf({
        name: 'tags',
        in: 'query',
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 4,
        uniqueItems: true,
        collectionFormat: 'multi',
      }),
    ).toEqual([
      {
        name: 'tags',
        in: 'query',
        explode: true,
        schema: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 4,
          uniqueItems: true,
        },
      },
    ]);
    expect(
      paramsOf({
        name: 'filter',
        in: 'query',
        type: 'object',
        minProperties: 1,
        maxProperties: 3,
        additionalProperties: { type: 'string' },
      }),
    ).toEqual([
      {
        name: 'filter',
        in: 'query',
        schema: {
          type: 'object',
          minProperties: 1,
          maxProperties: 3,
          additionalProperties: { type: 'string' },
        },
      },
    ]);
  });

  it('turns boolean exclusive bounds on a parameter into numeric ones', () => {
    expect(
      paramsOf({
        name: 'price',
        in: 'query',
        type: 'number',
        minimum: 0,
        exclusiveMinimum: true,
      }),
    ).toEqual([{ name: 'price', in: 'query', schema: { type: 'number', exclusiveMinimum: 0 } }]);
  });

  it('converts header and cookie parameters the same way', () => {
    expect(
      convertOp({
        parameters: [
          { name: 'X-Table', in: 'header', type: 'integer' },
          { name: 'tab', in: 'cookie', type: 'string' },
        ],
        responses: ok,
      }).parameters,
    ).toEqual([
      { name: 'X-Table', in: 'header', schema: { type: 'integer' } },
      { name: 'tab', in: 'cookie', schema: { type: 'string' } },
    ]);
  });

  it('defaults a missing type to string', () => {
    expect(paramsOf({ name: 'search', in: 'query' })).toEqual([
      { name: 'search', in: 'query', schema: { type: 'string' } },
    ]);
  });

  it('forces path parameters to be required', () => {
    expect(paramsOf({ name: 'orderId', in: 'path', type: 'string' })).toEqual([
      { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
    ]);
    expect(paramsOf({ name: 'orderId', in: 'path', required: false, type: 'string' })).toEqual([
      { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
    ]);
  });

  it('turns x-example into example and x-deprecated into deprecated', () => {
    expect(
      paramsOf({
        name: 'search',
        in: 'query',
        type: 'string',
        'x-example': 'cortado',
        'x-deprecated': true,
      }),
    ).toEqual([
      {
        name: 'search',
        in: 'query',
        example: 'cortado',
        deprecated: true,
        schema: { type: 'string' },
      },
    ]);
  });

  it('removes allowEmptyValue from the parameter schema', () => {
    expect(
      paramsOf({
        name: 'search',
        in: 'query',
        type: 'string',
        schema: { type: 'string', allowEmptyValue: true },
      }),
    ).toEqual([{ name: 'search', in: 'query', schema: { type: 'string' } }]);
  });

  it('marks a query parameter that skips url encoding as allowReserved', () => {
    expect(
      paramsOf({
        name: 'redirect',
        in: 'query',
        type: 'string',
        'x-ms-skip-url-encoding': true,
      }),
    ).toEqual([{ name: 'redirect', in: 'query', allowReserved: true, schema: { type: 'string' } }]);
  });

  it('resolves a description that is a reference', () => {
    expect(
      paramsOf(
        {
          name: 'search',
          in: 'query',
          type: 'string',
          description: { $ref: '#/x-notes/search' },
        },
        { 'x-notes': { search: 'Words to look for on the menu' } },
      ),
    ).toEqual([
      {
        name: 'search',
        in: 'query',
        description: 'Words to look for on the menu',
        schema: { type: 'string' },
      },
    ]);
  });

  it('leaves a parameter with both items and schema without a generated schema', () => {
    expect(
      paramsOf({
        name: 'tags',
        in: 'query',
        type: 'array',
        items: { type: 'string' },
        schema: { type: 'array', items: { type: 'string' } },
      }),
    ).toEqual([
      {
        name: 'tags',
        in: 'query',
        style: 'form',
        explode: false,
        items: { type: 'string' },
        schema: { type: 'array', items: { type: 'string' } },
      },
    ]);
  });

  it('removes collectionFormat from nested array items', () => {
    expect(
      paramsOf({
        name: 'grid',
        in: 'query',
        type: 'array',
        items: { type: 'array', items: { type: 'string' }, collectionFormat: 'pipes' },
        collectionFormat: 'multi',
      }),
    ).toEqual([
      {
        name: 'grid',
        in: 'query',
        explode: true,
        schema: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
      },
    ]);
  });
});

describe('collectionFormat', () => {
  const arrayParam = (location: string, collectionFormat?: string): Obj => ({
    name: 'tags',
    in: location,
    type: 'array',
    items: { type: 'string' },
    ...(collectionFormat ? { collectionFormat } : {}),
  });
  const schema = { type: 'array', items: { type: 'string' } };

  it.each([
    ['query', 'csv', { style: 'form', explode: false }],
    ['cookie', 'csv', { style: 'form', explode: false }],
    ['path', 'csv', { style: 'simple', required: true }],
    ['header', 'csv', { style: 'simple' }],
    ['query', 'ssv', { style: 'spaceDelimited' }],
    ['query', 'pipes', { style: 'pipeDelimited' }],
    ['query', 'multi', { explode: true }],
    ['query', 'tsv', { 'x-collectionFormat': 'tsv' }],
    ['query', undefined, { style: 'form', explode: false }],
  ])('maps %s collectionFormat %s', (location, format, expected) => {
    expect(paramsOf(arrayParam(location, format))).toEqual([
      { name: 'tags', in: location, ...expected, schema },
    ]);
  });

  it('applies a csv collectionFormat style even when the parameter is not an array', () => {
    expect(
      paramsOf({ name: 'code', in: 'query', type: 'string', collectionFormat: 'csv' }),
    ).toEqual([
      { name: 'code', in: 'query', style: 'form', explode: false, schema: { type: 'string' } },
    ]);
  });
});

describe('parameter references', () => {
  it('keeps a reference to a component parameter and converts the component', () => {
    const op = convertOp(
      { parameters: [{ $ref: '#/parameters/Limit' }], responses: ok },
      { parameters: { Limit: { name: 'limit', in: 'query', type: 'integer' } } },
    );
    const converted = convert(
      cafe({
        parameters: { Limit: { name: 'limit', in: 'query', type: 'integer' } },
        paths: { '/orders': { get: { parameters: [{ $ref: '#/parameters/Limit' }] } } },
      }),
    );

    expect(op.parameters).toEqual([{ $ref: '#/components/parameters/Limit' }]);
    expect(sectionOf(converted, 'parameters')).toEqual({
      Limit: { name: 'limit', in: 'query', schema: { type: 'integer' } },
    });
  });

  it('decodes a percent-encoded reference so it lands on the renamed component', () => {
    const converted = convert(
      cafe({
        parameters: { 'table number': { name: 'table', in: 'query', type: 'integer' } },
        paths: {
          '/orders': {
            get: { parameters: [{ $ref: '#/parameters/table%20number' }], responses: ok },
          },
        },
      }),
    );

    expect(opAt(converted, '/orders', 'get').parameters).toEqual([
      { $ref: '#/components/parameters/table_number' },
    ]);
    expect(Object.keys(sectionOf(converted, 'parameters'))).toEqual(['table_number']);
  });

  it('leaves a reference into another document untouched', () => {
    const op = convertOp({
      parameters: [{ $ref: 'shared.yaml#/parameters/Limit' }],
      responses: ok,
    });

    expect(op.parameters).toEqual([{ $ref: 'shared.yaml#/parameters/Limit' }]);
  });

  it('folds a reference to a body component into the request body', () => {
    const converted = convert(
      cafe({
        definitions: { NewOrder: { type: 'object' } },
        parameters: {
          NewOrderBody: {
            name: 'order',
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/NewOrder' },
          },
        },
        paths: {
          '/orders': {
            post: { parameters: [{ $ref: '#/parameters/NewOrderBody' }], responses: ok },
          },
        },
      }),
    );
    const post = opAt(converted, '/orders', 'post');

    expect(post.requestBody).toEqual({
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/NewOrder' } } },
    });
    expect(post).not.toHaveProperty('parameters');
    expect(converted.components).not.toHaveProperty('parameters');
  });

  it('folds a reference to a form component into the request body', () => {
    const converted = convert(
      cafe({
        parameters: { Note: { name: 'note', in: 'formData', type: 'string' } },
        paths: {
          '/orders': { post: { parameters: [{ $ref: '#/parameters/Note' }], responses: ok } },
        },
      }),
    );
    const post = opAt(converted, '/orders', 'post');

    expect(post.requestBody).toEqual({
      content: {
        'application/x-www-form-urlencoded': {
          schema: { type: 'object', properties: { note: { type: 'string' } } },
        },
      },
    });
    expect(converted.components).toBeUndefined();
  });

  it('drops a reference to a parameter that is not defined', () => {
    expect(
      convertOp({ parameters: [{ $ref: '#/parameters/Missing' }], responses: ok }),
    ).not.toHaveProperty('parameters');
  });

  it('converts a parameter object shared through two references', () => {
    const converted = convert(
      cafe({
        parameters: { Limit: { name: 'limit', in: 'query', type: 'integer' } },
        paths: {
          '/menu': { get: { parameters: [{ $ref: '#/parameters/Limit' }], responses: ok } },
          '/orders': { get: { parameters: [{ $ref: '#/parameters/Limit' }], responses: ok } },
        },
      }),
    );
    expect(opAt(converted, '/menu', 'get').parameters).toEqual([
      { $ref: '#/components/parameters/Limit' },
    ]);
    expect(opAt(converted, '/orders', 'get').parameters).toEqual([
      { $ref: '#/components/parameters/Limit' },
    ]);
  });
});

describe('component parameter names', () => {
  it('sanitises component parameter names', () => {
    const converted = convert(
      cafe({ parameters: { 'page size': { name: 'pageSize', in: 'query', type: 'integer' } } }),
    );

    expect(Object.keys(sectionOf(converted, 'parameters'))).toEqual(['page_size']);
  });

  it('throws when two parameter names sanitise to the same name', () => {
    expect(() =>
      convert(
        cafe({
          parameters: {
            'page size': { name: 'a', in: 'query', type: 'integer' },
            page_size: { name: 'b', in: 'query', type: 'integer' },
          },
        }),
      ),
    ).toThrow(/Duplicate/);
  });
});

describe('path-level parameters', () => {
  it('keeps non-body parameters at path level, converted', () => {
    const path = convertPath({
      parameters: [{ name: 'orderId', in: 'path', type: 'string', required: true }],
      get: { responses: ok },
    });

    expect(path.parameters).toEqual([
      { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
    ]);
  });

  it('folds a path-level body only into operations that have a parameters list', () => {
    const path = convertPath({
      parameters: [{ in: 'body', name: 'order', schema: { type: 'object' } }],
      post: { parameters: [], responses: ok },
      put: { responses: ok },
    });
    const folded = { content: { 'application/json': { schema: { type: 'object' } } } };

    expect((path.post as Obj).requestBody).toEqual(folded);
    expect(path.put).not.toHaveProperty('requestBody');
    expect(path.parameters).toEqual([]);
  });

  it('folds a path-level form field only into operations that have a parameters list', () => {
    const path = convertPath({
      parameters: [{ name: 'note', in: 'formData', type: 'string' }],
      post: { parameters: [{ name: 'table', in: 'query', type: 'integer' }], responses: ok },
      put: { responses: ok },
    });

    expect((path.post as Obj).requestBody).toEqual({
      content: {
        'application/x-www-form-urlencoded': {
          schema: { type: 'object', properties: { note: { type: 'string' } } },
        },
      },
    });
    expect(path.put).not.toHaveProperty('requestBody');
  });

  it('lets an operation form field override a path-level one with the same name and location', () => {
    const path = convertPath({
      parameters: [{ name: 'note', in: 'formData', type: 'string', description: 'from the path' }],
      post: {
        parameters: [{ name: 'note', in: 'formData', type: 'string', description: 'from the op' }],
        responses: ok,
      },
    });

    expect(
      (((path.post as Obj).requestBody as Obj).content as Obj)['application/x-www-form-urlencoded'],
    ).toEqual({
      schema: {
        type: 'object',
        properties: { note: { type: 'string', description: 'from the op' } },
      },
    });
  });

  it('keeps an empty path-level parameters list', () => {
    expect(convertPath({ parameters: [], get: { responses: ok } }).parameters).toEqual([]);
  });

  it('removes an empty operation parameters list', () => {
    expect(convertPath({ get: { parameters: [], responses: ok } }).get).not.toHaveProperty(
      'parameters',
    );
  });
});
