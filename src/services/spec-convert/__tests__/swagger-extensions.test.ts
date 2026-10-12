import { describe, it, expect } from 'vitest';

import { cafe, convert, convertOp, convertPath, ok, opAt, sectionOf } from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

const schemesOf = (securityDefinitions: Obj): Obj =>
  sectionOf(convert(cafe({ securityDefinitions })), 'securitySchemes');

describe('security schemes', () => {
  it('turns basic auth into an http basic scheme', () => {
    expect(schemesOf({ Counter: { type: 'basic', description: 'Till login' } }).Counter).toEqual({
      type: 'http',
      scheme: 'basic',
      description: 'Till login',
    });
  });

  it('keeps an apiKey scheme', () => {
    expect(
      schemesOf({ ApiKey: { type: 'apiKey', in: 'header', name: 'X-Cafe-Key' } }).ApiKey,
    ).toEqual({ type: 'apiKey', in: 'header', name: 'X-Cafe-Key' });
  });

  it('turns an implicit oauth2 scheme into a flows object', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'implicit',
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          scopes: { 'orders:read': 'See orders' },
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          scopes: { 'orders:read': 'See orders' },
        },
      },
    });
  });

  it('turns a password oauth2 scheme into a flows object', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'password',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: {},
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: { password: { tokenUrl: 'https://auth.cafe.example.test/token', scopes: {} } },
    });
  });

  it('renames the application flow to clientCredentials', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'application',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: { 'orders:write': 'Place orders' },
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: {
        clientCredentials: {
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: { 'orders:write': 'Place orders' },
        },
      },
    });
  });

  it('renames the accessCode flow to authorizationCode', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'accessCode',
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: {},
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: {},
        },
      },
    });
  });

  it('strips the query from flow urls and trims them', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'accessCode',
          authorizationUrl: ' https://auth.cafe.example.test/authorize?audience=cafe ',
          tokenUrl: 'https://auth.cafe.example.test/token?v=2',
          scopes: {},
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: {},
        },
      },
    });
  });

  it('turns an empty flow url into a slash', () => {
    expect(
      schemesOf({
        OAuth2: { type: 'oauth2', flow: 'password', tokenUrl: '?v=2', scopes: {} },
      }).OAuth2,
    ).toEqual({ type: 'oauth2', flows: { password: { tokenUrl: '/', scopes: {} } } });
  });

  it('defaults scopes to an empty object and removes the name key', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'implicit',
          authorizationUrl: 'https://auth.cafe.example.test/authorize',
          name: 'cafe-oauth',
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: {
        implicit: { authorizationUrl: 'https://auth.cafe.example.test/authorize', scopes: {} },
      },
    });
  });

  it('keeps an unknown flow key as the flow name', () => {
    expect(
      schemesOf({
        OAuth2: {
          type: 'oauth2',
          flow: 'device',
          tokenUrl: 'https://auth.cafe.example.test/token',
          scopes: {},
        },
      }).OAuth2,
    ).toEqual({
      type: 'oauth2',
      flows: { device: { tokenUrl: 'https://auth.cafe.example.test/token', scopes: {} } },
    });
  });

  it('sanitises scheme names and the names used in root and operation requirements', () => {
    const converted = convert(
      cafe({
        securityDefinitions: { 'Cafe Key': { type: 'apiKey', in: 'header', name: 'X-Key' } },
        security: [{ 'Cafe Key': [] }],
        paths: {
          '/orders': { get: { security: [{ 'Cafe Key': [], Other: [] }], responses: ok } },
        },
      }),
    );

    expect(Object.keys(sectionOf(converted, 'securitySchemes'))).toEqual(['Cafe_Key']);
    expect(converted.security).toEqual([{ Cafe_Key: [] }]);
    expect(opAt(converted, '/orders', 'get').security).toEqual([{ Cafe_Key: [], Other: [] }]);
  });

  it('throws when two scheme names sanitise to the same name', () => {
    expect(() =>
      schemesOf({
        'Cafe Key': { type: 'apiKey', in: 'header', name: 'A' },
        Cafe_Key: { type: 'apiKey', in: 'header', name: 'B' },
      }),
    ).toThrow(/Duplicate/);
  });
});

describe('vendor extensions', () => {
  it('moves root x-callbacks and x-links into components', () => {
    const converted = convert(
      cafe({
        'x-callbacks': { orderReady: { '{$request.body#/url}': { post: {} } } },
        'x-links': { toOrder: { operationId: 'getOrder' } },
      }),
    );

    expect(converted.components).toEqual({
      callbacks: { orderReady: { '{$request.body#/url}': { post: {} } } },
      links: { toOrder: { operationId: 'getOrder' } },
    });
  });

  it('turns path-level x-trace, x-summary, x-description and x-servers into their standard keys', () => {
    const path = convertPath({
      'x-trace': { responses: { '200': { description: 'Echo.' } } },
      'x-summary': 'Orders at the counter',
      'x-description': 'Everything about a single order',
      'x-servers': [{ url: 'https://orders.cafe.example.test' }],
      get: { responses: ok },
    });

    expect(path).toEqual({
      trace: { responses: { '200': { description: 'Echo.' } } },
      summary: 'Orders at the counter',
      description: 'Everything about a single order',
      servers: [{ url: 'https://orders.cafe.example.test' }],
      get: { responses: ok },
    });
  });

  it('processes x-amazon-apigateway-any-method like an operation', () => {
    const path = convertPath({
      'x-amazon-apigateway-any-method': {
        parameters: [{ name: 'table', in: 'query', type: 'integer' }],
        responses: ok,
      },
    });

    expect(path['x-amazon-apigateway-any-method']).toEqual({
      parameters: [{ name: 'table', in: 'query', schema: { type: 'integer' } }],
      responses: ok,
    });
  });

  it('converts x-ms-paths like paths', () => {
    const converted = convert(
      cafe({
        'x-ms-paths': {
          '/menu?format=full': {
            get: {
              parameters: [{ name: 'category', in: 'query', type: 'string' }],
              responses: { '200': { description: 'Menu.', schema: { type: 'string' } } },
            },
          },
        },
      }),
    );

    expect(converted['x-ms-paths']).toEqual({
      '/menu?format=full': {
        get: {
          parameters: [{ name: 'category', in: 'query', schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Menu.', content: { '*/*': { schema: { type: 'string' } } } },
          },
        },
      },
    });
  });

  it('turns x-ms-examples into parameter examples, header examples and component examples', () => {
    const converted = convert(
      cafe({
        paths: {
          '/orders/{orderId}': {
            get: {
              parameters: [{ name: 'orderId', in: 'path', type: 'string', required: true }],
              responses: {
                '200': {
                  description: 'Order.',
                  schema: { type: 'object' },
                  headers: { 'X-Remaining': { type: 'integer' } },
                },
              },
              'x-ms-examples': {
                'Look up a flat white order': {
                  parameters: { orderId: 'o-17' },
                  responses: {
                    '200': { headers: { 'X-Remaining': 12 }, body: { id: 'o-17' } },
                  },
                },
              },
            },
          },
        },
      }),
    );
    const op = opAt(converted, '/orders/{orderId}', 'get');

    expect(op).not.toHaveProperty('x-ms-examples');
    expect(op.parameters).toEqual([
      {
        name: 'orderId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        examples: { 'Look up a flat white order': { value: 'o-17' } },
      },
    ]);
    expect(op.responses).toEqual({
      '200': {
        description: 'Order.',
        headers: { 'X-Remaining': { schema: { type: 'integer' }, example: 12 } },
        content: {
          '*/*': {
            schema: { type: 'object' },
            examples: {
              'Look up a flat white order': {
                $ref: '#/components/examples/Look_up_a_flat_white_order',
              },
            },
          },
        },
      },
    });
    expect(sectionOf(converted, 'examples')).toEqual({
      Look_up_a_flat_white_order: { value: { id: 'o-17' } },
    });
  });

  it('keeps an extension on the operation that it does not handle', () => {
    expect(convertOp({ 'x-barista-only': true, responses: ok })).toEqual({
      'x-barista-only': true,
      responses: ok,
    });
  });
});
