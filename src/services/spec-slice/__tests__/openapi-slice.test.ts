import { describe, expect, it } from 'vitest';

import {
  extractOpenApiSlice,
  operationScopeFromPointer,
  parsePointerTokens,
} from '../openapi-slice.js';
import { DEFAULT_WEBHOOKS_TAG_NAME } from '../../../constants/openapi.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
}

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

function makeMinimalDoc(): Record<string, unknown> {
  return deepFreeze({
    openapi: '3.1.0',
    info: { title: 'Minimal', version: '1.0.0' },
    paths: {
      '/things': {
        get: { operationId: 'listThings', responses: { '200': { description: 'ok' } } },
      },
    },
  });
}

describe('parsePointerTokens', () => {
  it('accepts bare, slash-rooted, and hash-rooted pointers identically', () => {
    const expected = ['paths', '/pets', 'get'];
    expect(parsePointerTokens('paths/~1pets/get')).toEqual(expected);
    expect(parsePointerTokens('/paths/~1pets/get')).toEqual(expected);
    expect(parsePointerTokens('#/paths/~1pets/get')).toEqual(expected);
  });

  it('decodes ~1 and ~0 escapes inside tokens', () => {
    expect(parsePointerTokens('paths/~1v1~0beta~1pets/get')).toEqual([
      'paths',
      '/v1~beta/pets',
      'get',
    ]);
  });

  it('returns an empty array for pointers it cannot parse', () => {
    expect(parsePointerTokens('#garbage')).toEqual([]);
    expect(parsePointerTokens('#')).toEqual([]);
  });
});

describe('operationScopeFromPointer', () => {
  it('defaults source to paths and accepts rooted and deeper-than-operation pointers', () => {
    const expected = {
      kind: 'operation',
      pathName: '/pets',
      httpVerb: 'get',
      source: 'paths',
    };
    expect(operationScopeFromPointer('#/paths/~1pets/get', undefined)).toEqual(expected);
    expect(operationScopeFromPointer('/paths/~1pets/get', undefined)).toEqual(expected);
    expect(operationScopeFromPointer('paths/~1pets/get/responses/200', undefined)).toEqual(
      expected,
    );
  });

  it('re-roots webhook pointers to the webhooks source', () => {
    expect(operationScopeFromPointer('paths/newPet/post', true)).toEqual({
      kind: 'operation',
      pathName: 'newPet',
      httpVerb: 'post',
      source: 'webhooks',
    });
  });

  it('returns undefined for short, non-paths, or unparsable pointers', () => {
    expect(operationScopeFromPointer('paths/~1pets', false)).toBeUndefined();
    expect(operationScopeFromPointer('webhooks/newPet/post', false)).toBeUndefined();
    expect(operationScopeFromPointer('#garbage', true)).toBeUndefined();
  });
});

describe('extractOpenApiSlice', () => {
  it('returns undefined when document.openapi is not a string', () => {
    const noVersion = deepFreeze({ info: { title: 'x' }, paths: {} });
    expect(extractOpenApiSlice(noVersion, { kind: 'document' })).toBeUndefined();

    const numericVersion = deepFreeze({
      openapi: 3.1,
      info: { title: 'x' },
      paths: { '/t': { get: { responses: { '200': { description: 'ok' } } } } },
    });
    expect(
      extractOpenApiSlice(numericVersion, {
        kind: 'operation',
        pathName: '/t',
        httpVerb: 'get',
        source: 'paths',
      }),
    ).toBeUndefined();
  });

  it('returns undefined for AsyncAPI scope kinds', () => {
    expect(
      extractOpenApiSlice(makeMinimalDoc(), { kind: 'channel', channelId: 'lighting' }),
    ).toBeUndefined();
    expect(
      extractOpenApiSlice(makeMinimalDoc(), { kind: 'async-operation', operationId: 'receive' }),
    ).toBeUndefined();
  });

  it('emits only the root fields present in the source document', () => {
    const slice = extractOpenApiSlice(makeMinimalDoc(), {
      kind: 'operation',
      pathName: '/things',
      httpVerb: 'get',
      source: 'paths',
    });
    const doc = expectDefined(slice).document;
    expect(Object.keys(doc).sort()).toEqual(['info', 'openapi', 'paths']);
  });

  it('copies jsonSchemaDialect, externalDocs, servers, and security when present', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Full', version: '1.0.0' },
      jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema',
      externalDocs: { url: 'https://docs.example.com' },
      servers: [{ url: 'https://api.example.com' }],
      security: [{ ApiKey: [] }],
      paths: {
        '/things': {
          get: { operationId: 'listThings', responses: { '200': { description: 'ok' } } },
        },
      },
      components: {
        securitySchemes: { ApiKey: { type: 'apiKey', name: 'X-Key', in: 'header' } },
      },
    });
    const slice = extractOpenApiSlice(source, {
      kind: 'operation',
      pathName: '/things',
      httpVerb: 'get',
      source: 'paths',
    });
    const doc = expectDefined(slice).document;
    expect(doc.jsonSchemaDialect).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(doc.externalDocs).toEqual({ url: 'https://docs.example.com' });
    expect(doc.servers).toEqual([{ url: 'https://api.example.com' }]);
    expect(doc.security).toEqual([{ ApiKey: [] }]);
  });

  it('emits x-webhooks and resolves webhook operations from it when the source uses x-webhooks', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Hooks', version: '1.0.0' },
      paths: {},
      'x-webhooks': {
        ping: { post: { operationId: 'ping', responses: { '200': { description: 'ok' } } } },
      },
      webhooks: {
        legacy: { post: { operationId: 'legacy', responses: { '200': { description: 'ok' } } } },
      },
    });

    const slice = extractOpenApiSlice(source, {
      kind: 'operation',
      pathName: 'ping',
      httpVerb: 'post',
      source: 'webhooks',
    });
    const doc = expectDefined(slice).document;
    const hooks = doc['x-webhooks'] as Record<string, Record<string, unknown>>;
    expect(Object.keys(hooks)).toEqual(['ping']);
    expect(hooks.ping.post).toBeDefined();
    expect(doc.webhooks).toBeUndefined();

    expect(
      extractOpenApiSlice(source, {
        kind: 'operation',
        pathName: 'legacy',
        httpVerb: 'post',
        source: 'webhooks',
      }),
    ).toBeUndefined();
  });

  it('includes tag ancestors transitively in source order and drops x-tagGroups when every group prunes empty', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Tags', version: '1.0.0' },
      tags: [
        { name: 'leaf', parent: 'mid' },
        { name: 'unrelated' },
        { name: 'root', parent: 'ghost' },
        { name: 'mid', parent: 'root' },
      ],
      'x-tagGroups': [
        { name: 'Empty', tags: ['unrelated'] },
        { name: 'AlsoEmpty', tags: ['unrelated', 'ghost'] },
      ],
      paths: {
        '/leaves': {
          get: {
            operationId: 'listLeaves',
            tags: ['leaf'],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    });
    const slice = extractOpenApiSlice(source, { kind: 'tag', tagName: 'leaf' });
    const doc = expectDefined(slice).document;
    const tags = doc.tags as Array<{ name: string }>;
    expect(tags.map((tag) => tag.name)).toEqual(['leaf', 'root', 'mid']);
    expect(doc['x-tagGroups']).toBeUndefined();
  });

  it('skips path items whose $ref cannot be resolved', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Broken', version: '1.0.0' },
      paths: {
        '/broken': { $ref: '#/components/pathItems/Missing' },
        '/ok': {
          get: {
            operationId: 'ok',
            tags: ['t'],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    });

    const byTag = extractOpenApiSlice(source, { kind: 'tag', tagName: 't' });
    const paths = expectDefined(byTag).document.paths as Record<string, unknown>;
    expect(Object.keys(paths)).toEqual(['/ok']);

    expect(
      extractOpenApiSlice(source, {
        kind: 'operation',
        pathName: '/broken',
        httpVerb: 'get',
        source: 'paths',
      }),
    ).toBeUndefined();
  });

  it('slices a schema whose name contains / and ~ via an encoded seed ref', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Schemas', version: '1.0.0' },
      paths: {},
      components: {
        schemas: {
          'billing/invoice~draft': { type: 'object', properties: { id: { type: 'string' } } },
          Unrelated: { type: 'object' },
        },
      },
    });
    const slice = extractOpenApiSlice(source, { kind: 'schema', name: 'billing/invoice~draft' });
    const doc = expectDefined(slice).document;
    const schemas = (doc.components as Record<string, Record<string, unknown>>).schemas;
    expect(Object.keys(schemas)).toEqual(['billing/invoice~draft']);
    expect(schemas['billing/invoice~draft']).toEqual({
      type: 'object',
      properties: { id: { type: 'string' } },
    });
    expect(doc.paths).toEqual({});
  });

  it('returns undefined for a schema scope naming a missing schema', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Schemas', version: '1.0.0' },
      paths: {},
      components: { schemas: { Known: { type: 'object' } } },
    });
    expect(extractOpenApiSlice(source, { kind: 'schema', name: 'Unknown' })).toBeUndefined();
    expect(
      extractOpenApiSlice(makeMinimalDoc(), { kind: 'schema', name: 'Known' }),
    ).toBeUndefined();
  });

  it('matches untagged webhooks by the default webhooks tag while untagged path operations match nothing', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Untagged', version: '1.0.0' },
      paths: {
        '/plain': {
          get: { operationId: 'plainGet', responses: { '200': { description: 'ok' } } },
        },
      },
      webhooks: {
        hook: {
          post: { operationId: 'hookPost', responses: { '200': { description: 'ok' } } },
        },
      },
    });
    const slice = extractOpenApiSlice(source, {
      kind: 'tag',
      tagName: DEFAULT_WEBHOOKS_TAG_NAME,
    });
    const doc = expectDefined(slice).document;
    expect(doc.paths).toEqual({});
    const webhooks = doc.webhooks as Record<string, Record<string, unknown>>;
    expect(Object.keys(webhooks)).toEqual(['hook']);
    expect(webhooks.hook.post).toBeDefined();
  });
});
