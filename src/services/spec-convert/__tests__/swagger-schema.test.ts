import { describe, it, expect } from 'vitest';

import { cafe, convert, convertOp, convertSchema, ok, opAt, sectionOf } from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

describe('definitions and names', () => {
  it('moves definitions into components.schemas', () => {
    const converted = convert(
      cafe({ definitions: { MenuItem: { type: 'object' }, Order: { type: 'object' } } }),
    );

    expect(sectionOf(converted, 'schemas')).toEqual({
      MenuItem: { type: 'object' },
      Order: { type: 'object' },
    });
    expect(converted).not.toHaveProperty('definitions');
  });

  it('sanitises schema names and rewrites refs to the new name', () => {
    const converted = convert(
      cafe({
        definitions: {
          'Menu Item': { type: 'object' },
          'Order[]': { type: 'array', items: { $ref: '#/definitions/Menu%20Item' } },
          'cafe/Order Line': { type: 'object' },
        },
      }),
    );

    expect(sectionOf(converted, 'schemas')).toEqual({
      Menu_Item: { type: 'object' },
      OrderArray: { type: 'array', items: { $ref: '#/components/schemas/Menu_Item' } },
      cafe_Order_Line: { type: 'object' },
    });
  });

  it('suffixes a sanitised schema name that collides and moves it to the end', () => {
    const converted = convert(
      cafe({
        definitions: {
          'Menu Item': { description: 'spaced' },
          Menu_Item: { description: 'underscored' },
          Order: { properties: { item: { $ref: '#/definitions/Menu Item' } } },
        },
      }),
    );
    const schemas = sectionOf(converted, 'schemas');

    expect(Object.keys(schemas)).toEqual(['Menu_Item', 'Order', 'Menu_Item2']);
    expect(schemas.Menu_Item2).toEqual({ description: 'spaced' });
    expect(schemas.Order).toEqual({
      properties: { item: { $ref: '#/components/schemas/Menu_Item2' } },
    });
  });

  it('omits components entirely when nothing needs to live there', () => {
    expect(convert(cafe())).not.toHaveProperty('components');
  });
});

describe('reference rewriting', () => {
  it('rewrites definition refs at the root and inside nested items', () => {
    const converted = convert(
      cafe({
        definitions: {
          OrderItem: { type: 'object' },
          Order: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/definitions/OrderItem' } },
              latest: { $ref: '#/definitions/OrderItem' },
            },
          },
        },
      }),
    );

    expect(sectionOf(converted, 'schemas').Order).toEqual({
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
        latest: { $ref: '#/components/schemas/OrderItem' },
      },
    });
  });

  it('keeps a ref to a definition that does not exist under its own name', () => {
    expect(convertSchema({ $ref: '#/definitions/Voucher' })).toEqual({
      $ref: '#/components/schemas/Voucher',
    });
  });

  it('rewrites parameter and response refs, sanitising their names', () => {
    const op = convertOp(
      {
        parameters: [{ $ref: '#/parameters/page size' }],
        responses: { '410': { $ref: '#/responses/Gone Away' } },
      },
      {
        parameters: { 'page size': { name: 'pageSize', in: 'query', type: 'integer' } },
        responses: { 'Gone Away': { description: 'The item is no longer served.' } },
      },
    );

    expect(op.parameters).toEqual([{ $ref: '#/components/parameters/page_size' }]);
    expect(op.responses).toEqual({ '410': { $ref: '#/components/responses/Gone_Away' } });
  });

  it('hoists a ref into another part of the document into components.schemas', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders': {
            get: {
              responses: {
                '200': {
                  description: 'Orders.',
                  schema: { type: 'object', properties: { id: { type: 'string' } } },
                },
              },
            },
          },
          '/order-items': {
            get: {
              responses: {
                '200': {
                  description: 'Items.',
                  schema: { $ref: '#/paths/~1orders/get/responses/200/schema' },
                },
              },
            },
          },
        },
      }),
    );
    expect(sectionOf(converted, 'schemas')).toEqual({
      schema1: { type: 'object', properties: { id: { type: 'string' } } },
    });
    expect(((opAt(converted, '/orders', 'get').responses as Obj)['200'] as Obj).content).toEqual({
      '*/*': { schema: { $ref: '#/components/schemas/schema1' } },
    });
    expect(
      ((opAt(converted, '/order-items', 'get').responses as Obj)['200'] as Obj).content,
    ).toEqual({
      '*/*': { schema: { $ref: '#/components/schemas/schema1' } },
    });
  });

  it('leaves a ref to a whole path item pointing at the path', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders': { get: { responses: ok } },
          '/orders-alias': { $ref: '#/paths/~1orders' },
        },
      }),
    );

    expect(converted.components).toBeUndefined();
    expect((converted.paths as Obj)['/orders-alias']).toEqual({ $ref: '#/paths/~1orders' });
    expect(opAt(converted, '/orders', 'get')).toBeDefined();
  });

  it('keeps sibling keys next to a $ref', () => {
    expect(
      convertSchema({
        type: 'object',
        properties: {
          item: { $ref: '#/definitions/OrderItem', description: 'What was ordered' },
        },
      }),
    ).toEqual({
      type: 'object',
      properties: {
        item: { $ref: '#/components/schemas/OrderItem', description: 'What was ordered' },
      },
    });
  });

  it('removes x-miro from a ref', () => {
    expect(
      convertSchema({ properties: { item: { $ref: '#/definitions/OrderItem', 'x-miro': 'y' } } }),
    ).toEqual({ properties: { item: { $ref: '#/components/schemas/OrderItem' } } });
  });

  it('replaces a ref to the root consumes list with the list itself', () => {
    const op = convertOp(
      {
        consumes: { $ref: '#/consumes' },
        parameters: [{ in: 'body', name: 'order', schema: { type: 'object' } }],
        responses: ok,
      },
      { consumes: ['application/xml', 'text/xml'] },
    );

    expect(Object.keys((op.requestBody as Obj).content as Obj)).toEqual([
      'application/xml',
      'text/xml',
    ]);
  });

  it('leaves refs to other documents untouched', () => {
    expect(
      convertSchema({
        properties: { item: { $ref: 'https://cafe.example.test/schemas/item.json' } },
      }),
    ).toEqual({ properties: { item: { $ref: 'https://cafe.example.test/schemas/item.json' } } });
  });

  it('points x-ms-odata at the component schema', () => {
    expect(
      convertSchema({ type: 'object', 'x-ms-odata': '#/definitions/OrderItem' }, { OrderItem: {} }),
    ).toEqual({ type: 'object', 'x-ms-odata': '#/components/schemas/OrderItem' });
  });
});

describe('schema keyword fixes', () => {
  it('appends null to a type array that is made nullable', () => {
    expect(convertSchema({ type: ['string', 'integer'], 'x-nullable': true })).toEqual({
      type: ['string', 'integer', 'null'],
    });
  });

  it('keeps an existing null in the type list when x-nullable is set', () => {
    expect(convertSchema({ type: ['string', 'null'], 'x-nullable': true })).toEqual({
      type: ['string', 'null'],
    });
  });

  it('ignores x-nullable: false', () => {
    expect(convertSchema({ type: 'string', 'x-nullable': false })).toEqual({ type: 'string' });
  });

  it('makes nested properties nullable', () => {
    expect(
      convertSchema({
        type: 'object',
        properties: { note: { type: 'string', 'x-nullable': true } },
      }),
    ).toEqual({
      type: 'object',
      properties: { note: { type: ['string', 'null'] } },
    });
  });

  it('applies fixes inside allOf, additionalProperties, patternProperties and not', () => {
    expect(
      convertSchema({
        allOf: [{ type: 'integer', 'x-nullable': true }],
        additionalProperties: { type: 'string', 'x-nullable': true },
        patternProperties: { '^x-': { type: 'number', 'x-nullable': true } },
        not: { type: 'boolean', 'x-nullable': true },
      }),
    ).toEqual({
      allOf: [{ type: ['integer', 'null'] }],
      additionalProperties: { type: ['string', 'null'] },
      patternProperties: { '^x-': { type: ['number', 'null'] } },
      not: { type: ['boolean', 'null'] },
    });
  });

  it('wraps a nullable ref found in a property', () => {
    expect(
      convertSchema({
        properties: { latest: { $ref: '#/definitions/Order', 'x-nullable': true } },
      }),
    ).toEqual({
      properties: {
        latest: { anyOf: [{ $ref: '#/components/schemas/Order' }, { type: 'null' }] },
      },
    });
  });

  it('wraps a nullable schema made only of allOf in anyOf with null', () => {
    expect(
      convertSchema({
        allOf: [{ $ref: '#/definitions/Order' }],
        'x-nullable': true,
        description: 'Last order',
      }),
    ).toEqual({
      anyOf: [{ allOf: [{ $ref: '#/components/schemas/Order' }] }, { type: 'null' }],
      description: 'Last order',
    });
  });

  it('wraps a nullable oneOf, anyOf or not schema in anyOf with null', () => {
    expect(convertSchema({ oneOf: [{ type: 'string' }], 'x-nullable': true })).toEqual({
      anyOf: [{ oneOf: [{ type: 'string' }] }, { type: 'null' }],
    });
    expect(convertSchema({ anyOf: [{ type: 'string' }], 'x-nullable': true })).toEqual({
      anyOf: [{ anyOf: [{ type: 'string' }] }, { type: 'null' }],
    });
    expect(convertSchema({ not: { type: 'string' }, 'x-nullable': true })).toEqual({
      anyOf: [{ not: { type: 'string' } }, { type: 'null' }],
    });
  });

  it('removes nullable: false', () => {
    expect(convertSchema({ type: 'string', nullable: false })).toEqual({ type: 'string' });
  });

  it('turns exclusiveMaximum: true into a numeric bound and drops exclusiveMinimum: false', () => {
    expect(
      convertSchema({
        type: 'number',
        minimum: 1,
        exclusiveMinimum: false,
        maximum: 20,
        exclusiveMaximum: true,
      }),
    ).toEqual({ type: 'number', minimum: 1, exclusiveMaximum: 20 });
  });

  it('turns exclusiveMinimum: true into a numeric bound and removes minimum', () => {
    expect(convertSchema({ type: 'number', minimum: 3, exclusiveMinimum: true })).toEqual({
      type: 'number',
      exclusiveMinimum: 3,
    });
  });

  it('turns a string discriminator into a discriminator object', () => {
    expect(
      convertSchema({
        type: 'object',
        discriminator: 'kind',
        properties: { kind: { type: 'string' } },
      }),
    ).toEqual({
      type: 'object',
      discriminator: { propertyName: 'kind' },
      properties: { kind: { type: 'string' } },
    });
  });

  it('turns x-discriminator into discriminator and rewrites its mapping', () => {
    expect(
      convertSchema({
        type: 'object',
        'x-discriminator': {
          propertyName: 'kind',
          mapping: { drink: '#/definitions/Drink', other: 'https://cafe.example.test/x.json' },
        },
      }),
    ).toEqual({
      type: 'object',
      discriminator: {
        propertyName: 'kind',
        mapping: {
          drink: '#/components/schemas/Drink',
          other: 'https://cafe.example.test/x.json',
        },
      },
    });
  });

  it('points discriminator mapping entries at renamed schemas', () => {
    const converted = convert(
      cafe({
        definitions: {
          MenuItem: {
            type: 'object',
            'x-discriminator': {
              propertyName: 'kind',
              mapping: { hot: '#/definitions/Hot Drink', cold: 'Cold/Drink', other: 'Other' },
            },
          },
          'Hot Drink': { type: 'object' },
          'Cold/Drink': { type: 'object' },
          Other: { type: 'object' },
        },
        responses: {
          Item: {
            description: 'An item.',
            schema: {
              type: 'object',
              'x-discriminator': {
                propertyName: 'kind',
                mapping: { hot: '#/definitions/Hot Drink' },
              },
            },
          },
        },
      }),
    );
    expect(sectionOf(converted, 'schemas').MenuItem).toMatchObject({
      discriminator: {
        mapping: {
          hot: '#/components/schemas/Hot_Drink',
          cold: 'Cold_Drink',
          other: 'Other',
        },
      },
    });
    expect(sectionOf(converted, 'responses').Item).toMatchObject({
      content: {
        '*/*': {
          schema: { discriminator: { mapping: { hot: '#/components/schemas/Hot_Drink' } } },
        },
      },
    });
  });

  it('reduces an empty items array to an empty schema', () => {
    expect(convertSchema({ type: 'array', items: [] })).toEqual({ type: 'array', items: {} });
  });

  it('unwraps a single-entry items array', () => {
    expect(convertSchema({ type: 'array', items: [{ type: 'string' }] })).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('turns a multi-entry items array into anyOf', () => {
    expect(
      convertSchema({ type: 'array', items: [{ type: 'string' }, { type: 'integer' }] }),
    ).toEqual({
      type: 'array',
      items: { anyOf: [{ type: 'string' }, { type: 'integer' }] },
    });
  });

  it('gives an array without items an empty items schema', () => {
    expect(convertSchema({ type: 'array' })).toEqual({ type: 'array', items: {} });
  });

  it('turns type file into a binary string', () => {
    expect(convertSchema({ type: 'file' })).toEqual({ type: 'string', format: 'binary' });
  });

  it('moves a property-level required: true onto the parent when it is named', () => {
    expect(
      convertSchema({
        type: 'object',
        properties: {
          size: { type: 'string', required: true, name: 'size' },
          note: { type: 'string', required: false, name: 'note' },
          extra: { type: 'string', required: true },
        },
      }),
    ).toEqual({
      type: 'object',
      required: ['size'],
      properties: {
        size: { type: 'string', name: 'size' },
        note: { type: 'string', name: 'note' },
        extra: { type: 'string' },
      },
    });
  });

  it('merges x-required into required', () => {
    expect(convertSchema({ type: 'object', required: ['name'], 'x-required': ['size'] })).toEqual({
      type: 'object',
      required: ['name', 'size'],
    });
  });

  it('turns x-anyOf, x-oneOf and x-not into their standard keywords', () => {
    expect(
      convertSchema({
        'x-anyOf': [{ type: 'string' }],
        'x-oneOf': [{ type: 'integer' }],
        'x-not': { type: 'boolean' },
      }),
    ).toEqual({
      anyOf: [{ type: 'string' }],
      oneOf: [{ type: 'integer' }],
      not: { type: 'boolean' },
    });
  });

  it('removes allowEmptyValue and an empty xml namespace', () => {
    expect(
      convertSchema({
        type: 'string',
        allowEmptyValue: true,
        xml: { name: 'item', namespace: '' },
      }),
    ).toEqual({ type: 'string', xml: { name: 'item' } });
  });

  it('keeps a non-empty xml namespace', () => {
    expect(
      convertSchema({ type: 'string', xml: { namespace: 'https://cafe.example.test/ns' } }),
    ).toEqual({ type: 'string', xml: { namespace: 'https://cafe.example.test/ns' } });
  });

  it('converts a schema that refers back to itself', () => {
    expect(
      convertSchema({
        type: 'object',
        properties: {
          parent: { $ref: '#/definitions/MenuItem', 'x-nullable': true },
          children: { type: 'array', items: { $ref: '#/definitions/MenuItem' } },
        },
      }),
    ).toEqual({
      type: 'object',
      properties: {
        parent: { anyOf: [{ $ref: '#/components/schemas/MenuItem' }, { type: 'null' }] },
        children: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } },
      },
    });
  });
});
