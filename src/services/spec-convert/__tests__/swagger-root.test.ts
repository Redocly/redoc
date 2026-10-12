import { describe, it, expect } from 'vitest';

import { convertSwaggerToOpenApi } from '../swagger.js';
import { cafe, convert, convertOp, convertSchema, ok, opAt, pathsOf } from './swagger-helpers.js';
import type { Obj } from './swagger-helpers.js';

describe('document root', () => {
  it('moves openapi first and keeps the other root keys in their original order', () => {
    const converted = convert({
      swagger: '2.0',
      'x-audience': 'baristas',
      info: { title: 'Redocly Cafe', version: '1.0.0' },
      tags: [{ name: 'menu', description: 'What we serve' }],
      externalDocs: { url: 'https://cafe.example.test/handbook' },
      paths: {},
    });

    expect(Object.keys(converted)).toEqual([
      'openapi',
      'x-audience',
      'info',
      'tags',
      'externalDocs',
      'paths',
    ]);
    expect(converted.openapi).toBe('3.2.0');
    expect(converted.tags).toEqual([{ name: 'menu', description: 'What we serve' }]);
    expect(converted.externalDocs).toEqual({ url: 'https://cafe.example.test/handbook' });
  });

  it('appends servers and components after the original keys', () => {
    const converted = convert(
      cafe({
        host: 'cafe.example.test',
        definitions: { MenuItem: { type: 'object' } },
      }),
    );

    expect(Object.keys(converted)).toEqual(['openapi', 'info', 'paths', 'servers', 'components']);
  });

  it('orders the components sections predictably', () => {
    const converted = convert(
      cafe({
        definitions: { MenuItem: { type: 'object' } },
        parameters: { limit: { name: 'limit', in: 'query', type: 'integer' } },
        responses: { Gone: { description: 'Removed.' } },
        securityDefinitions: { ApiKey: { type: 'apiKey', in: 'header', name: 'X-Key' } },
        'x-callbacks': { onReady: {} },
        'x-links': { toOrder: { operationId: 'getOrder' } },
      }),
    );

    expect(Object.keys(converted.components as Obj)).toEqual([
      'callbacks',
      'links',
      'parameters',
      'responses',
      'securitySchemes',
      'schemas',
    ]);
    expect(converted).not.toHaveProperty('definitions');
    expect(converted).not.toHaveProperty('securityDefinitions');
    expect(converted).not.toHaveProperty('x-callbacks');
    expect(converted).not.toHaveProperty('x-links');
  });

  it('adds an empty paths object when the document has none', () => {
    const converted = convert({ swagger: '2.0', info: { title: 'Redocly Cafe', version: '1' } });
    expect(converted.paths).toEqual({});
  });

  it('turns a string consumes or produces into an array before applying it', () => {
    const body = { in: 'body', name: 'order', schema: { type: 'object' } };
    const converted = convert(
      cafe({
        consumes: 'application/xml',
        produces: 'text/csv',
        paths: {
          '/orders': {
            post: {
              parameters: [body],
              responses: { '200': { description: 'Done.', schema: { type: 'string' } } },
            },
          },
        },
      }),
    );
    const post = pathsOf(converted)['/orders']?.post as Obj;

    expect(Object.keys((post.requestBody as Obj).content as Obj)).toEqual(['application/xml']);
    expect(Object.keys(((post.responses as Obj)['200'] as Obj).content as Obj)).toEqual([
      'text/csv',
    ]);
    expect(converted).not.toHaveProperty('consumes');
    expect(converted).not.toHaveProperty('produces');
  });

  it('removes root schemes once servers are derived', () => {
    expect(convert(cafe({ host: 'cafe.example.test', schemes: ['https'] }))).not.toHaveProperty(
      'schemes',
    );
  });
});

describe('info patching', () => {
  it('supplies empty info when missing', () => {
    expect(convert({ swagger: '2.0' }).info).toEqual({ version: '', title: '' });
  });

  it('supplies an empty title or version when absent', () => {
    expect(convert(cafe({ info: { version: '2' } })).info).toEqual({ title: '', version: '2' });
    expect(convert(cafe({ info: { title: 'Redocly Cafe' } })).info).toEqual({
      title: 'Redocly Cafe',
      version: '',
    });
  });

  it('stringifies a numeric version', () => {
    expect(convert(cafe({ info: { title: 'Redocly Cafe', version: 1 } })).info).toEqual({
      title: 'Redocly Cafe',
      version: '1',
    });
  });

  it('renames info.logo to x-logo', () => {
    const logo = { url: 'https://cafe.example.test/logo.svg' };
    expect(convert(cafe({ info: { title: 'Redocly Cafe', version: '1', logo } })).info).toEqual({
      title: 'Redocly Cafe',
      version: '1',
      'x-logo': logo,
    });
  });

  it('keeps an absolute termsOfService and deletes one that is not a URL', () => {
    const withTerms = (termsOfService: string): unknown =>
      convert(cafe({ info: { title: 'Redocly Cafe', version: '1', termsOfService } })).info;

    expect(withTerms('https://cafe.example.test/terms')).toEqual({
      title: 'Redocly Cafe',
      version: '1',
      termsOfService: 'https://cafe.example.test/terms',
    });
    expect(withTerms('see the counter')).toEqual({ title: 'Redocly Cafe', version: '1' });
  });

  it('drops a null termsOfService', () => {
    expect(
      convert(cafe({ info: { title: 'Redocly Cafe', version: '1', termsOfService: null } })).info,
    ).toEqual({ title: 'Redocly Cafe', version: '1' });
  });
});

describe('OpenAPI 3.x input', () => {
  it('returns the document with its own version and only info and paths patched', () => {
    const converted = convert({
      openapi: '3.0.3',
      info: { version: 2 },
      'x-audience': 'baristas',
      components: { schemas: { MenuItem: { type: 'string', nullable: true } } },
    });

    expect(converted).toEqual({
      openapi: '3.0.3',
      info: { title: '', version: '2' },
      'x-audience': 'baristas',
      paths: {},
      components: { schemas: { MenuItem: { type: 'string', nullable: true } } },
    });
  });
});

describe('servers', () => {
  it('adds one server per new operation scheme even when the root lists several schemes', () => {
    const converted = convert(
      cafe({
        host: 'cafe.example.test',
        schemes: ['https', 'http'],
        paths: { '/orders': { get: { schemes: ['https', 'wss'], responses: ok } } },
      }),
    );

    expect(opAt(converted, '/orders', 'get').servers).toEqual([
      { url: 'wss://cafe.example.test/' },
    ]);
  });

  it('accepts a single scheme given as a string, at the root and on an operation', () => {
    const converted = convert(
      cafe({
        host: 'cafe.example.test',
        schemes: 'https' as unknown as string[],
        paths: { '/orders': { get: { schemes: 'http' as unknown as string[], responses: ok } } },
      }),
    );

    expect(converted.servers).toEqual([{ url: 'https://cafe.example.test' }]);
    expect(opAt(converted, '/orders', 'get').servers).toEqual([
      { url: 'http://cafe.example.test/' },
    ]);
  });

  const serversOf = (extra: Obj): unknown => convert(cafe(extra)).servers;

  it('folds host, basePath and schemes into one server per scheme', () => {
    expect(
      serversOf({
        host: 'cafe.example.test',
        basePath: '/v2',
        schemes: ['http', 'https'],
      }),
    ).toEqual([{ url: 'http://cafe.example.test/v2' }, { url: 'https://cafe.example.test/v2' }]);
  });

  it('drops a trailing slash from basePath', () => {
    expect(serversOf({ host: 'cafe.example.test', basePath: '/v2/', schemes: ['https'] })).toEqual([
      { url: 'https://cafe.example.test/v2' },
    ]);
  });

  it('produces a protocol-relative url when no schemes are given', () => {
    expect(serversOf({ host: 'cafe.example.test', basePath: '/v2' })).toEqual([
      { url: '//cafe.example.test/v2' },
    ]);
  });

  it('produces no server for host with an empty schemes list', () => {
    expect(convert(cafe({ host: 'cafe.example.test', schemes: [] }))).not.toHaveProperty('servers');
  });

  it('uses basePath alone as a relative server url', () => {
    expect(serversOf({ basePath: '/v2' })).toEqual([{ url: '/v2' }]);
  });

  it('declares a server variable for each placeholder in the url', () => {
    expect(
      serversOf({ host: 'cafe.example.test', basePath: '/{region}/v1', schemes: ['https'] }),
    ).toEqual([
      {
        url: 'https://cafe.example.test/{region}/v1',
        variables: { region: { default: 'unknown' } },
      },
    ]);
  });

  it('lets root x-servers replace the derived servers', () => {
    expect(
      serversOf({
        host: 'cafe.example.test',
        schemes: ['https'],
        'x-servers': [{ url: 'https://staging.cafe.example.test' }],
      }),
    ).toEqual([{ url: 'https://staging.cafe.example.test' }]);
  });

  it('expands a parameterized host template per scheme', () => {
    const converted = convert(
      cafe({
        schemes: ['https'],
        'x-ms-parameterized-host': {
          hostTemplate: '{branch}.cafe.example.test',
          parameters: [
            {
              name: 'branch',
              in: 'path',
              required: true,
              type: 'string',
              description: 'Which cafe branch',
            },
          ],
        },
      }),
    );

    expect(converted.servers).toEqual([
      {
        url: 'https://{branch}.cafe.example.test',
        variables: { branch: { description: 'Which cafe branch', default: 'none' } },
      },
    ]);
    expect(converted).not.toHaveProperty('x-ms-parameterized-host');
  });

  it('keeps the template as is when scheme prefixing is disabled', () => {
    expect(
      serversOf({
        'x-ms-parameterized-host': {
          hostTemplate: 'https://{branch}.cafe.example.test',
          useSchemePrefix: false,
          parameters: [{ name: 'branch', in: 'path', type: 'string', enum: ['north', 'south'] }],
        },
      }),
    ).toEqual([
      {
        url: 'https://{branch}.cafe.example.test',
        variables: { branch: { enum: ['north', 'south'], default: 'north' } },
      },
    ]);
  });

  it('gives an operation with an extra scheme a copy of the servers on that scheme', () => {
    const op = convertOp(
      { schemes: ['http'], responses: ok },
      { host: 'cafe.example.test', schemes: ['https'] },
    );

    expect(op.servers).toEqual([{ url: 'http://cafe.example.test/' }]);
    expect(op).not.toHaveProperty('schemes');
  });

  it('leaves a relative root server url unchanged when an operation adds a scheme', () => {
    const op = convertOp({ schemes: ['https'], responses: ok }, { basePath: '/v1' });

    expect(op.servers).toEqual([{ url: '/v1' }]);
  });

  it('keeps the base path when swapping the scheme for an operation', () => {
    const op = convertOp(
      { schemes: ['http'], responses: ok },
      { host: 'cafe.example.test', basePath: '/v2', schemes: ['https'] },
    );

    expect(op.servers).toEqual([{ url: 'http://cafe.example.test/v2' }]);
  });

  it('leaves an operation alone when its schemes are all declared at the root', () => {
    const op = convertOp(
      { schemes: ['https'], responses: ok },
      { host: 'cafe.example.test', schemes: ['http', 'https'] },
    );

    expect(op).not.toHaveProperty('servers');
    expect(op).not.toHaveProperty('schemes');
  });

  it('gives an empty servers list to a scheme override when the root has no servers', () => {
    expect(convertOp({ schemes: ['https'], responses: ok }).servers).toEqual([]);
  });

  it('turns operation x-servers into servers', () => {
    const op = convertOp({
      'x-servers': [{ url: 'https://kitchen.cafe.example.test' }],
      schemes: ['https'],
      responses: ok,
    });

    expect(op.servers).toEqual([{ url: 'https://kitchen.cafe.example.test' }]);
    expect(op).not.toHaveProperty('x-servers');
  });
});

describe('null pruning', () => {
  it('removes null values except for x- keys, defaults and anything under an example', () => {
    expect(
      convertSchema({
        type: 'string',
        description: null,
        'x-hint': null,
        default: null,
        example: { size: null, notes: [null] },
      }),
    ).toEqual({
      type: 'string',
      'x-hint': null,
      default: null,
      example: { size: null, notes: [null] },
    });
  });

  it('keeps null entries inside arrays', () => {
    expect(convertSchema({ enum: ['small', null, 'large'] })).toEqual({
      enum: ['small', null, 'large'],
    });
  });
});

describe('input handling', () => {
  it('rejects a document that is not Swagger 2.0', () => {
    expect(() => convertSwaggerToOpenApi({ swagger: '1.2', info: {}, paths: {} })).toThrow(
      /Unsupported/,
    );
    expect(() => convertSwaggerToOpenApi({ info: {}, paths: {} })).toThrow(/Unsupported/);
  });

  it('accepts a numeric swagger version of 2', () => {
    expect(convert({ swagger: 2, info: { title: 'Redocly Cafe', version: '1' } }).openapi).toBe(
      '3.2.0',
    );
  });

  it('rejects an info that is not an object', () => {
    expect(() => convertSwaggerToOpenApi({ swagger: '2.0', info: 'Redocly Cafe' })).toThrow(/info/);
  });

  it('converts an object that appears in two places without touching the input', () => {
    const shared = { name: 'limit', in: 'query', type: 'integer', maximum: 50 };
    const input = cafe({
      paths: {
        '/menu': { get: { parameters: [shared], responses: ok } },
        '/orders': { get: { parameters: [shared], responses: ok } },
      },
    });
    const before = JSON.stringify(input);
    const converted = convert(input);
    const expected = [{ name: 'limit', in: 'query', schema: { type: 'integer', maximum: 50 } }];

    expect(opAt(converted, '/menu', 'get').parameters).toEqual(expected);
    expect(opAt(converted, '/orders', 'get').parameters).toEqual(expected);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('does not mutate a document that also uses refs, bodies and headers', () => {
    const input = cafe({
      definitions: { 'Menu Item': { type: 'string', 'x-nullable': true } },
      parameters: { Limit: { name: 'limit', in: 'query', type: 'integer' } },
      paths: {
        '/orders': {
          parameters: [{ $ref: '#/parameters/Limit' }],
          post: {
            parameters: [
              { in: 'body', name: 'order', schema: { $ref: '#/definitions/Menu Item' } },
            ],
            responses: {
              '200': {
                description: 'Done.',
                headers: { 'X-Rate': { type: 'integer' } },
                schema: { type: 'file' },
              },
            },
          },
        },
      },
    });
    const before = JSON.stringify(input);
    convertSwaggerToOpenApi(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});

describe('existing document conversions', () => {
  it('keeps body x-examples on the generated requestBody', () => {
    const op = convertOp({
      consumes: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'order',
          schema: { type: 'object' },
          'x-examples': { 'application/json': { espresso: { value: { item: 'espresso' } } } },
        },
      ],
      responses: ok,
    });

    expect((op.requestBody as Obj)['x-examples']).toEqual({
      'application/json': { espresso: { value: { item: 'espresso' } } },
    });
  });

  it('folds host, basePath and schemes into a single server on a full conversion', () => {
    const converted = convert(
      cafe({
        host: 'cafe.example.test',
        basePath: '/v2',
        schemes: ['https'],
        paths: { '/health': { get: { operationId: 'getHealth', responses: ok } } },
      }),
    );

    expect(converted.openapi).toMatch(/^3\./);
    expect(converted).not.toHaveProperty('swagger');
    expect(converted.servers).toEqual([{ url: 'https://cafe.example.test/v2' }]);
  });
});
