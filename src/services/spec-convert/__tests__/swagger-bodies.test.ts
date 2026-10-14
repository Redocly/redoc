import { describe, it, expect } from 'vitest';

import {
  cafe,
  convert,
  convertOp,
  convertPath,
  ok,
  opAt,
  pathsOf,
  sectionOf,
} from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

describe('body parameters', () => {
  const body = { in: 'body', name: 'order', schema: { type: 'object' } };
  const contentOf = (op: Obj): Obj => (op.requestBody as Obj).content as Obj;

  it('defaults to application/json', () => {
    expect(contentOf(convertOp({ parameters: [body], responses: ok }))).toEqual({
      'application/json': { schema: { type: 'object' } },
    });
  });

  it('uses the operation consumes over the root consumes', () => {
    expect(
      Object.keys(
        contentOf(
          convertOp(
            { consumes: ['application/xml'], parameters: [body], responses: ok },
            { consumes: ['text/plain'] },
          ),
        ),
      ),
    ).toEqual(['application/xml']);
  });

  it('uses the root consumes when the operation has none', () => {
    expect(
      Object.keys(
        contentOf(
          convertOp(
            { parameters: [body], responses: ok },
            { consumes: ['application/xml', 'application/json'] },
          ),
        ),
      ),
    ).toEqual(['application/xml', 'application/json']);
  });

  it('gives every consumed media type its own copy of the schema', () => {
    const content = contentOf(
      convertOp({
        consumes: ['application/json', 'application/xml'],
        parameters: [{ in: 'body', name: 'order', schema: { type: 'string', 'x-nullable': true } }],
        responses: ok,
      }),
    );

    expect(content).toEqual({
      'application/json': { schema: { type: ['string', 'null'] } },
      'application/xml': { schema: { type: ['string', 'null'] } },
    });
  });

  it('marks the request body required only when the parameter is', () => {
    expect(
      convertOp({ parameters: [{ ...body, required: true }], responses: ok }).requestBody,
    ).toEqual({ required: true, content: { 'application/json': { schema: { type: 'object' } } } });
    expect(
      convertOp({ parameters: [{ ...body, required: false }], responses: ok }).requestBody,
    ).toEqual({ content: { 'application/json': { schema: { type: 'object' } } } });
  });

  it('carries the parameter description over to the request body', () => {
    expect(
      convertOp({
        parameters: [{ ...body, description: 'The order to place' }],
        responses: ok,
      }).requestBody,
    ).toEqual({
      description: 'The order to place',
      content: { 'application/json': { schema: { type: 'object' } } },
    });
  });

  it('copies every x- extension onto the request body next to content', () => {
    const requestBody = convertOp({
      parameters: [
        {
          ...body,
          'x-examples': { 'application/json': { latte: { value: { item: 'latte' } } } },
          'x-kitchen-note': 'kitchen only',
        },
      ],
      responses: ok,
    }).requestBody as Obj;

    expect(requestBody['x-examples']).toEqual({
      'application/json': { latte: { value: { item: 'latte' } } },
    });
    expect(requestBody['x-kitchen-note']).toBe('kitchen only');
    expect(requestBody.content).toEqual({ 'application/json': { schema: { type: 'object' } } });
  });

  it('loses a body x-example', () => {
    expect(
      JSON.stringify(
        convertOp({ parameters: [{ ...body, 'x-example': { item: 'latte' } }], responses: ok }),
      ),
    ).not.toContain('latte');
  });

  it('ignores a second body parameter', () => {
    expect(
      convertOp({
        parameters: [
          { in: 'body', name: 'first', schema: { type: 'string' } },
          { in: 'body', name: 'second', schema: { type: 'integer' } },
        ],
        responses: ok,
      }).requestBody,
    ).toEqual({ content: { 'application/json': { schema: { type: 'string' } } } });
  });

  it('places requestBody right after parameters and drops the body parameter', () => {
    const op = convertOp({
      operationId: 'createOrder',
      parameters: [
        { name: 'table', in: 'query', type: 'integer' },
        { in: 'body', name: 'order', schema: { type: 'object' } },
      ],
      responses: ok,
    });

    expect(Object.keys(op)).toEqual(['operationId', 'parameters', 'requestBody', 'responses']);
    expect(op.parameters).toEqual([{ name: 'table', in: 'query', schema: { type: 'integer' } }]);
  });

  it('removes an operation parameters list that only held the body', () => {
    expect(convertOp({ parameters: [body], responses: ok })).not.toHaveProperty('parameters');
  });

  it('turns a non-form file parameter into an octet-stream body without a schema', () => {
    expect(
      convertOp({
        parameters: [{ name: 'receipt', in: 'query', type: 'file', required: true }],
        responses: ok,
      }).requestBody,
    ).toEqual({ required: true, content: { 'application/octet-stream': {} } });
  });
});

describe('shared request bodies', () => {
  const putAndPost = (schema: Obj, firstId: string, secondId: string): Obj => ({
    post: {
      operationId: firstId,
      parameters: [{ in: 'body', name: 'order', schema }],
      responses: ok,
    },
    put: {
      operationId: secondId,
      parameters: [{ in: 'body', name: 'order', schema }],
      responses: ok,
    },
  });
  const convertShared = (schema: Obj, extra: Obj = {}): Obj =>
    convert(
      cafe({
        definitions: { Order: { type: 'object' } },
        paths: { '/orders': putAndPost(schema, 'createOrder', 'replaceOrder') },
        ...extra,
      }),
    );

  it('hoists a body used by two operations into components.requestBodies', () => {
    const converted = convertShared({ type: 'object', properties: { item: { type: 'string' } } });
    const path = pathsOf(converted)['/orders'];
    const shared = {
      content: {
        'application/json': {
          schema: { type: 'object', properties: { item: { type: 'string' } } },
        },
      },
    };

    expect(sectionOf(converted, 'requestBodies')).toEqual({ createOrderOrder: shared });
    expect((path.post as Obj).requestBody).toEqual({
      $ref: '#/components/requestBodies/createOrderOrder',
    });
    expect((path.put as Obj).requestBody).toEqual({
      $ref: '#/components/requestBodies/createOrderOrder',
    });
  });

  it('names a shared body after the schema it references', () => {
    const converted = convertShared({ $ref: '#/definitions/Order' });

    expect(Object.keys(sectionOf(converted, 'requestBodies'))).toEqual(['Order']);
  });

  it('names a shared body of an array of references with an Array suffix', () => {
    const converted = convertShared({ type: 'array', items: { $ref: '#/definitions/Order' } });

    expect(Object.keys(sectionOf(converted, 'requestBodies'))).toEqual(['OrderArray']);
  });

  it('keeps a body used once inline', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders': {
            post: {
              operationId: 'createOrder',
              parameters: [{ in: 'body', name: 'order', schema: { type: 'object' } }],
              responses: ok,
            },
          },
        },
      }),
    );

    expect(converted.components).toBeUndefined();
    expect(opAt(converted, '/orders', 'post').requestBody).toEqual({
      content: { 'application/json': { schema: { type: 'object' } } },
    });
  });

  it('does not share bodies that differ', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders': {
            post: {
              parameters: [{ in: 'body', name: 'order', schema: { type: 'object' } }],
              responses: ok,
            },
            put: {
              parameters: [{ in: 'body', name: 'order', schema: { type: 'array' } }],
              responses: ok,
            },
          },
        },
      }),
    );

    expect(converted.components).toBeUndefined();
  });
});

describe('file uploads', () => {
  it('uses multipart/form-data for a file field even when consumes does not name it', () => {
    const op = convertOp({
      consumes: ['application/json'],
      parameters: [
        { name: 'receipt', in: 'formData', type: 'file', required: true },
        { name: 'note', in: 'formData', type: 'string' },
      ],
      responses: ok,
    });

    expect(Object.keys((op.requestBody as Obj).content as Obj)).toEqual(['multipart/form-data']);
    expect(((op.requestBody as Obj).content as Obj)['multipart/form-data']).toEqual({
      schema: {
        type: 'object',
        properties: {
          receipt: { type: 'string', format: 'binary' },
          note: { type: 'string' },
        },
        required: ['receipt'],
      },
    });
  });

  it('uses multipart/form-data when the file field comes from the path level', () => {
    const path = convertPath({
      parameters: [{ name: 'photo', in: 'formData', type: 'file' }],
      post: { parameters: [{ name: 'caption', in: 'formData', type: 'string' }], responses: ok },
    });

    expect(Object.keys(((path.post as Obj).requestBody as Obj).content as Obj)).toEqual([
      'multipart/form-data',
    ]);
  });
});

describe('request bodies on paths with a plus sign', () => {
  it('writes the shared body reference into the right operations', () => {
    const body = { in: 'body', name: 'order', schema: { type: 'object' } };
    const converted = convert(
      cafe({
        paths: {
          '/orders+extras': {
            post: { operationId: 'createBundle', parameters: [body], responses: ok },
            put: { operationId: 'replaceBundle', parameters: [body], responses: ok },
          },
        },
      }),
    );
    const path = pathsOf(converted)['/orders+extras'];

    expect((path.post as Obj).requestBody).toEqual({
      $ref: '#/components/requestBodies/createBundleOrder',
    });
    expect((path.put as Obj).requestBody).toEqual({
      $ref: '#/components/requestBodies/createBundleOrder',
    });
    expect(pathsOf(converted)['/orders extras']).toBeUndefined();
  });
});

describe('form parameters', () => {
  const formOp = (parameters: Obj[], extra: Obj = {}): Obj =>
    convertOp({ parameters, responses: ok, ...extra });
  const contentOf = (op: Obj): Obj => (op.requestBody as Obj).content as Obj;

  it('runs form properties through the schema conversion', () => {
    const params = [
      { name: 'tip', in: 'formData', type: 'number', 'x-nullable': true },
      {
        name: 'amounts',
        in: 'formData',
        type: 'array',
        items: { type: 'number', minimum: 0, exclusiveMinimum: true },
      },
    ];

    expect(contentOf(formOp(params))['application/x-www-form-urlencoded']).toEqual({
      schema: {
        type: 'object',
        properties: {
          tip: { type: ['number', 'null'] },
          amounts: { type: 'array', items: { type: 'number', exclusiveMinimum: 0 } },
        },
      },
    });
  });

  it('builds a urlencoded body by default', () => {
    expect(
      formOp([{ name: 'note', in: 'formData', type: 'string', description: 'Barista note' }])
        .requestBody,
    ).toEqual({
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
            properties: { note: { type: 'string', description: 'Barista note' } },
          },
        },
      },
    });
  });

  it('builds a multipart body when multipart/form-data is consumed', () => {
    const op = formOp([{ name: 'note', in: 'formData', type: 'string' }], {
      consumes: ['multipart/form-data'],
    });

    expect(Object.keys(contentOf(op))).toEqual(['multipart/form-data']);
  });

  it('takes the consumed type from the root when the operation has none', () => {
    const op = convertOp(
      { parameters: [{ name: 'note', in: 'formData', type: 'string' }], responses: ok },
      { consumes: ['multipart/form-data'] },
    );

    expect(Object.keys(contentOf(op))).toEqual(['multipart/form-data']);
  });

  it('turns a file field into a binary string', () => {
    expect(
      contentOf(
        formOp([{ name: 'photo', in: 'formData', type: 'file', required: true }], {
          consumes: ['multipart/form-data'],
        }),
      ),
    ).toEqual({
      'multipart/form-data': {
        schema: {
          type: 'object',
          required: ['photo'],
          properties: { photo: { type: 'string', format: 'binary' } },
        },
      },
    });
  });

  it('copies field keywords into the property', () => {
    expect(
      contentOf(
        formOp([
          {
            name: 'quantity',
            in: 'formData',
            type: 'integer',
            format: 'int32',
            minimum: 1,
            maximum: 12,
            default: 1,
          },
        ]),
      ),
    ).toEqual({
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            quantity: { type: 'integer', format: 'int32', minimum: 1, maximum: 12, default: 1 },
          },
        },
      },
    });
  });

  it('folds boolean exclusive bounds of a field into numeric ones', () => {
    const op = formOp([
      { name: 'quantity', in: 'formData', type: 'integer', minimum: 0, exclusiveMinimum: true },
    ]);
    const schema = (contentOf(op)['application/x-www-form-urlencoded'] as Obj).schema as Obj;

    expect((schema.properties as Obj).quantity).toEqual({
      type: 'integer',
      exclusiveMinimum: 0,
    });
  });

  it('merges several fields into one schema and collects required names', () => {
    const op = formOp([
      { name: 'item', in: 'formData', type: 'string', required: true },
      { name: 'note', in: 'formData', type: 'string' },
      { name: 'table', in: 'formData', type: 'integer', required: true },
    ]);

    expect(contentOf(op)).toEqual({
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          required: ['item', 'table'],
          properties: {
            item: { type: 'string' },
            note: { type: 'string' },
            table: { type: 'integer' },
          },
        },
      },
    });
    expect(op.requestBody).toHaveProperty('required', true);
  });

  it('takes requestBody.required only from the first field', () => {
    const optionalFirst = formOp([
      { name: 'note', in: 'formData', type: 'string' },
      { name: 'item', in: 'formData', type: 'string', required: true },
    ]);

    expect(optionalFirst.requestBody).not.toHaveProperty('required');
    expect(
      (contentOf(optionalFirst)['application/x-www-form-urlencoded'] as Obj).schema,
    ).toHaveProperty('required', ['item']);
  });

  it('omits an empty required list', () => {
    expect(
      (
        contentOf(formOp([{ name: 'note', in: 'formData', type: 'string' }]))[
          'application/x-www-form-urlencoded'
        ] as Obj
      ).schema,
    ).not.toHaveProperty('required');
  });

  it('keeps a truthy example and drops a falsy one', () => {
    const properties = (
      (
        contentOf(
          formOp([
            { name: 'item', in: 'formData', type: 'string', example: 'mocha' },
            { name: 'size', in: 'formData', type: 'integer', example: 0 },
          ]),
        )['application/x-www-form-urlencoded'] as Obj
      ).schema as Obj
    ).properties;

    expect(properties).toEqual({
      item: { type: 'string', example: 'mocha' },
      size: { type: 'integer' },
    });
  });

  it('keeps allOf on the property', () => {
    const properties = (
      (
        contentOf(
          formOp([
            {
              name: 'item',
              in: 'formData',
              allOf: [{ $ref: '#/definitions/MenuItem' }],
            },
          ]),
        )['application/x-www-form-urlencoded'] as Obj
      ).schema as Obj
    ).properties;

    expect(properties).toEqual({
      item: { type: 'string', allOf: [{ $ref: '#/components/schemas/MenuItem' }] },
    });
  });

  it('keeps array items and removes their collectionFormat', () => {
    const properties = (
      (
        contentOf(
          formOp([
            {
              name: 'toppings',
              in: 'formData',
              type: 'array',
              items: { type: 'string', collectionFormat: 'csv' },
            },
          ]),
        )['application/x-www-form-urlencoded'] as Obj
      ).schema as Obj
    ).properties;

    expect(properties).toEqual({ toppings: { type: 'array', items: { type: 'string' } } });
  });

  it('uses a formData parameter that carries its own schema as the media schema', () => {
    expect(
      contentOf(
        formOp([{ name: 'order', in: 'formData', schema: { $ref: '#/definitions/NewOrder' } }]),
      ),
    ).toEqual({
      'application/x-www-form-urlencoded': {
        schema: { $ref: '#/components/schemas/NewOrder' },
      },
    });
  });

  it('drops the form fields from the operation parameters', () => {
    const op = formOp([
      { name: 'table', in: 'query', type: 'integer' },
      { name: 'note', in: 'formData', type: 'string' },
    ]);

    expect(op.parameters).toEqual([{ name: 'table', in: 'query', schema: { type: 'integer' } }]);
  });
});
