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

  it('slices a parent tag with the operations of the tags nested under it in any declaration order, but not of badge or audience tags', () => {
    const response = { '200': { description: 'ok' } };
    const source = deepFreeze({
      openapi: '3.2.0',
      info: { title: 'Nested tags', version: '1.0.0' },
      tags: [
        { name: 'Collection' },
        { name: 'Paintings', parent: 'Artworks' },
        { name: 'Artworks', parent: 'Collection' },
        { name: 'Beta', parent: 'Collection', kind: 'badge' },
        { name: 'Partners', parent: 'Collection', kind: 'audience' },
        { name: 'Events' },
      ],
      paths: {
        '/artworks': {
          get: { operationId: 'listArtworks', tags: ['Artworks'], responses: response },
        },
        '/paintings': {
          get: { operationId: 'listPaintings', tags: ['Paintings'], responses: response },
        },
        '/beta': { get: { operationId: 'betaOnly', tags: ['Beta'], responses: response } },
        '/partners': {
          get: { operationId: 'partnersOnly', tags: ['Partners'], responses: response },
        },
        '/events': { get: { operationId: 'listEvents', tags: ['Events'], responses: response } },
      },
    });

    const doc = expectDefined(
      extractOpenApiSlice(source, { kind: 'tag', tagName: 'Collection' }),
    ).document;

    expect(Object.keys(doc.paths as Record<string, unknown>)).toEqual(['/artworks', '/paintings']);
    expect((doc.tags as Array<{ name: string }>).map((tag) => tag.name)).toEqual([
      'Collection',
      'Paintings',
      'Artworks',
    ]);
  });

  it('slices tags whose parent links form a loop', () => {
    const source = deepFreeze({
      openapi: '3.2.0',
      info: { title: 'Loop', version: '1.0.0' },
      tags: [
        { name: 'A', parent: 'B' },
        { name: 'B', parent: 'A' },
        { name: 'Self', parent: 'Self' },
      ],
      paths: {
        '/a': {
          get: { operationId: 'a', tags: ['A'], responses: { '200': { description: 'ok' } } },
        },
        '/b': {
          get: { operationId: 'b', tags: ['B'], responses: { '200': { description: 'ok' } } },
        },
        '/self': {
          get: { operationId: 'self', tags: ['Self'], responses: { '200': { description: 'ok' } } },
        },
      },
    });

    const paths = (tagName: string) =>
      Object.keys(
        expectDefined(extractOpenApiSlice(source, { kind: 'tag', tagName })).document
          .paths as Record<string, unknown>,
      );

    expect(paths('A')).toEqual(['/a', '/b']);
    expect(paths('Self')).toEqual(['/self']);
  });

  it('keeps a self-referencing schema of a tag page once, as a $ref', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Tree', version: '1.0.0' },
      tags: [{ name: 'Nodes' }],
      paths: {
        '/nodes': {
          get: {
            operationId: 'listNodes',
            tags: ['Nodes'],
            responses: {
              '200': {
                description: 'ok',
                content: {
                  'application/json': { schema: { $ref: '#/components/schemas/Node' } },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Node: { type: 'object', properties: { child: { $ref: '#/components/schemas/Node' } } },
        },
      },
    });

    const doc = expectDefined(
      extractOpenApiSlice(source, { kind: 'tag', tagName: 'Nodes' }),
    ).document;

    expect((doc.components as { schemas: Record<string, unknown> }).schemas).toEqual({
      Node: { type: 'object', properties: { child: { $ref: '#/components/schemas/Node' } } },
    });
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

  describe('a local $ref into a path the slice does not keep', () => {
    it('writes only the $ref target under that path, so the operation there is a skeleton', () => {
      const source = deepFreeze({
        openapi: '3.0.3',
        info: { title: 'Orders', version: '1.0.0' },
        paths: {
          '/orders': {
            post: {
              operationId: 'createOrder',
              requestBody: { $ref: '#/paths/~1pets/post/requestBody' },
              responses: { '201': { description: 'Created' } },
            },
          },
          '/pets': {
            post: {
              operationId: 'createPet',
              summary: 'Create a pet',
              requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
              responses: { '201': { description: 'Created' } },
            },
          },
        },
      });

      const doc = expectDefined(
        extractOpenApiSlice(source, {
          kind: 'operation',
          pathName: '/orders',
          httpVerb: 'post',
          source: 'paths',
        }),
      ).document;

      expect(doc.paths).toEqual({
        '/orders': {
          post: {
            operationId: 'createOrder',
            requestBody: { $ref: '#/paths/~1pets/post/requestBody' },
            responses: { '201': { description: 'Created' } },
          },
        },
        '/pets': {
          post: {
            requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
          },
        },
      });
    });

    it('writes the whole path item a $ref names, with the operations of other tags', () => {
      const source = deepFreeze({
        openapi: '3.0.3',
        info: { title: 'Events', version: '1.0.0' },
        paths: {
          '/subscribe': {
            post: {
              operationId: 'subscribe',
              tags: ['subs'],
              responses: { '201': { description: 'Created' } },
              callbacks: { onEvent: { '{$request.body#/url}': { $ref: '#/paths/~1events' } } },
            },
          },
          '/events': {
            get: {
              operationId: 'listEvents',
              tags: ['subs'],
              responses: { '200': { description: 'OK' } },
            },
            delete: {
              operationId: 'purgeEvents',
              tags: ['admin'],
              responses: { '204': { description: 'Purged' } },
            },
          },
        },
      });

      const doc = expectDefined(
        extractOpenApiSlice(source, { kind: 'tag', tagName: 'subs' }),
      ).document;

      const paths = doc.paths as Record<string, Record<string, unknown>>;
      expect(paths['/subscribe'].post).toMatchObject({
        callbacks: { onEvent: { '{$request.body#/url}': { $ref: '#/paths/~1events' } } },
      });
      expect(paths['/events']).toEqual(source.paths['/events']);
    });
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

  describe('the schemas and x-mcp entities a page lists', () => {
    const response = { '200': { description: 'ok' } };
    const source = deepFreeze({
      openapi: '3.2.0',
      info: { title: 'Museum', version: '1.0.0' },
      tags: [{ name: 'Events' }, { name: 'Tickets', parent: 'Events' }],
      paths: {
        '/events': { get: { operationId: 'listEvents', tags: ['Events'], responses: response } },
      },
      components: {
        schemas: {
          Artwork: { type: 'object' },
          Event: { type: 'object', 'x-tags': ['Events'] },
          Ticket: { type: 'object', 'x-tags': ['Tickets'] },
        },
      },
      'x-mcp': {
        protocolVersion: '2025-06-18',
        servers: [{ url: 'https://mcp.museum.test' }],
        tools: [
          { name: 'searchArtworks', inputSchema: { type: 'object' } },
          { name: 'bookEvent', tags: ['Events'], inputSchema: { type: 'object' } },
          { name: 'buyTicket', tags: ['Tickets'], inputSchema: { type: 'object' } },
        ],
        prompts: [{ name: 'eventSummary', tags: ['Events'] }],
      },
    });

    it.each([
      {
        page: 'a parent tag with an operation, and schemas and MCP entities on it and its child',
        scope: { kind: 'tag', tagName: 'Events' },
        paths: ['/events'],
        schemas: ['Event', 'Ticket'],
        mcp: { tools: ['bookEvent', 'buyTicket'], prompts: ['eventSummary'] },
        tags: ['Events', 'Tickets'],
      },
      {
        page: 'a nested tag with only a schema and an MCP tool',
        scope: { kind: 'tag', tagName: 'Tickets' },
        paths: [],
        schemas: ['Ticket'],
        mcp: { tools: ['buyTicket'] },
        tags: ['Events', 'Tickets'],
      },
      {
        page: 'the schema definitions tag',
        scope: { kind: 'tag', tagName: 'Schemas' },
        paths: [],
        schemas: ['Artwork'],
        mcp: undefined,
        tags: undefined,
      },
      {
        page: 'the default tag of untagged MCP tools',
        scope: { kind: 'tag', tagName: 'Tools' },
        paths: [],
        schemas: [],
        mcp: { tools: ['searchArtworks'] },
        tags: undefined,
      },
    ] as const)('slices $page', ({ scope, paths, schemas, mcp, tags }) => {
      const doc = expectDefined(
        extractOpenApiSlice(source, scope, { schemaDefinitionsTagName: 'Schemas' }),
      ).document;

      expect((doc.tags as Array<{ name: string }> | undefined)?.map(({ name }) => name)).toEqual(
        tags,
      );
      expect(Object.keys(doc.paths as Record<string, unknown>)).toEqual(paths);
      const components = doc.components as { schemas?: Record<string, unknown> } | undefined;
      expect(Object.keys(components?.schemas ?? {})).toEqual(schemas);
      const xMcp = doc['x-mcp'] as Record<string, unknown> | undefined;
      expect(
        xMcp &&
          Object.fromEntries(
            (['tools', 'resources', 'prompts'] as const)
              .filter((type) => Array.isArray(xMcp[type]))
              .map((type) => [type, (xMcp[type] as Array<{ name: string }>).map((e) => e.name)]),
          ),
      ).toEqual(mcp);
    });

    it('keeps the x-mcp server fields next to the sliced entities', () => {
      const doc = expectDefined(
        extractOpenApiSlice(source, { kind: 'tag', tagName: 'Tools' }),
      ).document;

      expect(doc['x-mcp']).toEqual({
        protocolVersion: '2025-06-18',
        servers: [{ url: 'https://mcp.museum.test' }],
        tools: [{ name: 'searchArtworks', inputSchema: { type: 'object' } }],
      });
    });
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

  it('matches a webhook with an empty tags list by the default webhooks tag', () => {
    const source = deepFreeze({
      openapi: '3.1.0',
      info: { title: 'Empty tags', version: '1.0.0' },
      paths: {},
      webhooks: {
        hook: {
          post: { operationId: 'hookPost', tags: [], responses: { '200': { description: 'ok' } } },
        },
      },
    });
    const slice = extractOpenApiSlice(source, {
      kind: 'tag',
      tagName: DEFAULT_WEBHOOKS_TAG_NAME,
    });
    const webhooks = expectDefined(slice).document.webhooks as Record<string, unknown>;
    expect(Object.keys(webhooks)).toEqual(['hook']);
  });
});

describe('info description', () => {
  it('says a partial slice is a subset in place of the description of the whole API', () => {
    const doc = deepFreeze({ ...makeMinimalDoc(), info: { title: 'Long', description: 'x' } });
    const scope = {
      kind: 'operation',
      pathName: '/things',
      httpVerb: 'get',
      source: 'paths',
    } as const;

    expect(expectDefined(extractOpenApiSlice(doc, scope)).document.info).toEqual({
      title: 'Long',
      description:
        'This is a subset of the full specification, limited to the `GET /things` operation.',
    });
  });
});

describe('maxRefDepth', () => {
  it('keeps components within the hop limit, each at its shortest distance, and says when it left some out', () => {
    const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
    const doc = deepFreeze({
      ...makeMinimalDoc(),
      paths: {
        '/things': {
          get: {
            responses: {
              '200': {
                description: 'ok',
                content: {
                  'application/json': { schema: { properties: { b: ref('B'), a: ref('A') } } },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          A: { properties: { c: ref('C') } },
          C: { properties: { d: ref('D') } },
          B: { properties: { d: ref('D') } },
          D: { properties: { e: ref('E') } },
          E: { properties: { f: ref('F') } },
          F: { type: 'string' },
        },
      },
    });
    const scope = {
      kind: 'operation',
      pathName: '/things',
      httpVerb: 'get',
      source: 'paths',
    } as const;

    const slice = expectDefined(extractOpenApiSlice(doc, scope, { maxRefDepth: 3 })).document;

    expect(Object.keys((slice.components as { schemas: object }).schemas).sort()).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
    ]);
    expect((slice.info as { description: string }).description).toBe(
      'This is a subset of the full specification, limited to the `GET /things` operation. Components more than 3 `$ref` hops away are not included.',
    );
  });
});
