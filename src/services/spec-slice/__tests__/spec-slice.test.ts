import { describe, expect, it } from 'vitest';
import { load } from 'js-yaml';

import { buildSpecSlice } from '../index.js';
import { isRecord, resolveJsonPointer } from '../../../adapters/helpers.js';

import type { SpecSliceScope } from '../types.js';

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

function collectDanglingRefs(document: Record<string, unknown>): string[] {
  const dangling: string[] = [];
  const check = (ref: string, kind: string): void => {
    if (!resolveJsonPointer(document, ref)) dangling.push(`${kind}: ${ref}`);
  };

  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isRecord(node)) return;

    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string' && value.startsWith('#/')) {
        check(value, '$ref');
        continue;
      }
      if (key === 'security' && Array.isArray(value)) {
        for (const requirement of value) {
          if (!isRecord(requirement)) continue;
          for (const name of Object.keys(requirement)) {
            check(`#/components/securitySchemes/${name}`, 'security scheme');
          }
        }
      }
      visit(value);
    }

    const discriminator = node.discriminator ?? node['x-discriminator'];
    const mapping = isRecord(discriminator) ? discriminator.mapping : undefined;
    if (isRecord(mapping)) {
      for (const target of Object.values(mapping)) {
        if (typeof target !== 'string') continue;
        check(target.startsWith('#/') ? target : `#/components/schemas/${target}`, 'mapping');
      }
    }
  };
  visit(document);
  return dangling;
}

function expectNoDanglingRefs(document: Record<string, unknown>): void {
  expect(collectDanglingRefs(document)).toEqual([]);
}

function makeOpenApiFixture(): Record<string, unknown> {
  return deepFreeze({
    openapi: '3.1.0',
    info: { title: 'Pets', version: '1.0.0' },
    servers: [{ url: 'https://api.example.com' }],
    security: [{ ApiKey: [] }],
    tags: [
      { name: 'animals', description: 'All animals' },
      { name: 'pets', parent: 'animals' },
      { name: 'store' },
      { name: 'hooks' },
    ],
    'x-tagGroups': [
      {
        name: 'Main',
        tags: ['pets', 'store'],
      },
      { name: 'Eventing', tags: ['hooks'] },
    ],
    'x-shared': { Thing: { type: 'object', properties: { id: { type: 'string' } } } },
    paths: {
      '/pets': {
        summary: 'Pets collection',
        parameters: [{ $ref: '#/components/parameters/PageParam' }],
        get: {
          operationId: 'listPets',
          tags: ['pets'],
          responses: { '200': { $ref: '#/components/responses/PetList' } },
        },
        post: {
          operationId: 'createPet',
          tags: ['store'],
          security: [{ OAuth2: ['write'] }],
          requestBody: {
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Pet' } },
            },
          },
          callbacks: {
            onEvent: {
              '{$request.body#/url}': {
                post: {
                  requestBody: {
                    content: {
                      'application/json': { schema: { $ref: '#/components/schemas/Event' } },
                    },
                  },
                  responses: { '200': { description: 'ok' } },
                },
              },
            },
          },
          responses: { '201': { description: 'created' } },
        },
        'x-query': {
          operationId: 'queryPets',
          tags: ['pets'],
          responses: { '200': { description: 'ok' } },
        },
        additionalOperations: {
          purge: {
            operationId: 'purgePets',
            tags: ['pets'],
            responses: { '204': { description: 'gone' } },
          },
        },
      },
      '/other': {
        get: {
          operationId: 'getOther',
          tags: ['store'],
          responses: {
            '200': {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/x-shared/Thing' } } },
              links: { next: { $ref: '#/components/links/NextLink' } },
            },
          },
        },
      },
      '/nodes': {
        get: {
          operationId: 'getNodes',
          tags: ['store'],
          responses: {
            '200': {
              description: 'ok',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Node' } } },
            },
          },
        },
      },
      '/aliased': { $ref: '#/components/pathItems/Aliased' },
    },
    webhooks: {
      newPet: {
        post: {
          operationId: 'newPetHook',
          tags: ['hooks'],
          responses: { '200': { description: 'ok' } },
        },
      },
      unTagged: {
        post: { operationId: 'untaggedHook', responses: { '200': { description: 'ok' } } },
      },
    },
    components: {
      schemas: {
        Pet: {
          type: 'object',
          discriminator: { propertyName: 'kind', mapping: { cat: '#/components/schemas/Cat' } },
          properties: { kind: { type: 'string' } },
        },
        Cat: {
          allOf: [{ $ref: '#/components/schemas/Pet' }, { type: 'object' }],
        },
        Dog: { allOf: [{ $ref: '#/components/schemas/Pet' }, { type: 'object' }] },
        Node: {
          type: 'object',
          properties: { children: { type: 'array', items: { $ref: '#/components/schemas/Node' } } },
        },
        Event: { type: 'object', properties: { url: { type: 'string' } } },
        Orphan: { type: 'object' },
      },
      parameters: {
        PageParam: { name: 'page', in: 'query', schema: { type: 'integer' } },
      },
      responses: {
        PetList: {
          description: 'A list of pets',
          headers: { 'X-Rate': { $ref: '#/components/headers/RateHeader' } },
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/Pet' } },
            },
          },
        },
      },
      headers: { RateHeader: { schema: { type: 'integer' } } },
      links: { NextLink: { operationRef: '#/paths/~1pruned/get' } },
      securitySchemes: {
        ApiKey: { type: 'apiKey', name: 'X-Key', in: 'header' },
        OAuth2: {
          type: 'oauth2',
          flows: { clientCredentials: { tokenUrl: 'https://t', scopes: { write: 'w' } } },
        },
      },
      pathItems: {
        Aliased: {
          get: {
            operationId: 'aliasedGet',
            tags: ['pets'],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    },
  });
}

async function extractOpenApi(scope: SpecSliceScope): Promise<Record<string, unknown> | undefined> {
  const yaml = await buildSpecSlice('openapi', makeOpenApiFixture(), scope);
  return yaml === undefined ? undefined : (load(yaml) as Record<string, unknown>);
}

describe('buildSpecSlice — OpenAPI', () => {
  it('slices a single operation with inherited path fields, security fallback, and pruned components', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'get',
        source: 'paths',
      }),
    );

    const paths = doc.paths as Record<string, Record<string, unknown>>;
    expect(Object.keys(paths)).toEqual(['/pets']);
    expect(Object.keys(paths['/pets'])).toEqual(
      expect.arrayContaining(['summary', 'parameters', 'get']),
    );
    expect(paths['/pets'].post).toBeUndefined();
    expect(paths['/pets']['x-query']).toBeUndefined();

    const schemas = (doc.components as Record<string, Record<string, unknown>>).schemas;
    expect(Object.keys(schemas)).toEqual(expect.arrayContaining(['Pet', 'Cat', 'Dog']));
    expect(schemas.Orphan).toBeUndefined();
    expect(schemas.Event).toBeUndefined();

    const securitySchemes = (doc.components as Record<string, Record<string, unknown>>)
      .securitySchemes;
    expect(securitySchemes.ApiKey).toBeDefined();
    expect(securitySchemes.OAuth2).toBeUndefined();

    const tags = doc.tags as Array<{ name: string }>;
    expect(tags.map((tag) => tag.name)).toEqual(['animals', 'pets']);
    expect(doc['x-tagGroups']).toEqual([{ name: 'Main', tags: ['pets'] }]);

    expectNoDanglingRefs(doc);
  });

  it('keeps operation-level security and walks callbacks', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'post',
        source: 'paths',
      }),
    );
    const components = doc.components as Record<string, Record<string, unknown>>;
    expect(components.securitySchemes.OAuth2).toBeDefined();
    expect(components.schemas.Event).toBeDefined();
    expectNoDanglingRefs(doc);
  });

  it('finds x-query operations by their normalized verb', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'query',
        source: 'paths',
      }),
    );
    const paths = doc.paths as Record<string, Record<string, unknown>>;
    expect(paths['/pets']['x-query']).toBeDefined();
    expect(paths['/pets'].get).toBeUndefined();
    expectNoDanglingRefs(doc);
  });

  it('finds additionalOperations and re-emits them in place', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'purge',
        source: 'paths',
      }),
    );
    const paths = doc.paths as Record<string, Record<string, unknown>>;
    const additional = paths['/pets'].additionalOperations as Record<string, unknown>;
    expect(additional.purge).toBeDefined();
    expect(paths['/pets'].get).toBeUndefined();
    expectNoDanglingRefs(doc);
  });

  it('slices an operation reached through a $ref path item', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/aliased',
        httpVerb: 'get',
        source: 'paths',
      }),
    );
    const paths = doc.paths as Record<string, Record<string, unknown>>;
    expect(Object.keys(paths)).toEqual(['/aliased']);
    expect(paths['/aliased'].$ref).toBeUndefined();
    expect(paths['/aliased'].get).toBeDefined();
    expectNoDanglingRefs(doc);
  });

  it('slices webhook operations under the webhooks root with empty paths', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: 'newPet',
        httpVerb: 'post',
        source: 'webhooks',
      }),
    );
    expect(doc.paths).toEqual({});
    const webhooks = doc.webhooks as Record<string, Record<string, unknown>>;
    expect(webhooks.newPet.post).toBeDefined();
    expect(webhooks.unTagged).toBeUndefined();
    expect(Object.keys(doc.components as object)).toEqual(['securitySchemes']);
    expectNoDanglingRefs(doc);
  });

  it('slices a tag across paths, x-query, additionalOperations, and $ref path items', async () => {
    const doc = expectDefined(await extractOpenApi({ kind: 'tag', tagName: 'pets' }));
    const paths = doc.paths as Record<string, Record<string, unknown>>;

    expect(Object.keys(paths).sort()).toEqual(['/aliased', '/pets']);
    expect(paths['/pets'].get).toBeDefined();
    expect(paths['/pets']['x-query']).toBeDefined();
    expect((paths['/pets'].additionalOperations as Record<string, unknown>).purge).toBeDefined();
    expect(paths['/pets'].post).toBeUndefined();
    expect(paths['/aliased'].$ref).toBeUndefined();
    expect(paths['/aliased'].get).toBeDefined();
    expect(doc.webhooks).toBeUndefined();
    expectNoDanglingRefs(doc);
  });

  it('includes webhooks carrying the tag and the default webhooks tag', async () => {
    const hooks = expectDefined(await extractOpenApi({ kind: 'tag', tagName: 'hooks' }));
    expect(Object.keys(hooks.webhooks as object)).toEqual(['newPet']);

    const defaultTagDoc = expectDefined(await extractOpenApi({ kind: 'tag', tagName: 'webhooks' }));
    expect(Object.keys(defaultTagDoc.webhooks as object)).toEqual(['unTagged']);
    expect(defaultTagDoc.tags).toBeUndefined();
    expect(defaultTagDoc['x-tagGroups']).toBeUndefined();
    expectNoDanglingRefs(defaultTagDoc);
  });

  it('returns undefined for unknown tags and operations', async () => {
    await expect(extractOpenApi({ kind: 'tag', tagName: 'nope' })).resolves.toBeUndefined();
    await expect(
      extractOpenApi({ kind: 'operation', pathName: '/pets', httpVerb: 'delete', source: 'paths' }),
    ).resolves.toBeUndefined();
  });

  it('handles cyclic schemas without hanging or dangling', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/nodes',
        httpVerb: 'get',
        source: 'paths',
      }),
    );
    const schemas = (doc.components as Record<string, Record<string, unknown>>).schemas;
    expect(schemas.Node).toBeDefined();
    expectNoDanglingRefs(doc);
  });

  it('inlines non-component internal refs', async () => {
    const doc = expectDefined(
      await extractOpenApi({
        kind: 'operation',
        pathName: '/other',
        httpVerb: 'get',
        source: 'paths',
      }),
    );
    const response = resolveJsonPointer(doc, '#/paths/~1other/get/responses/200') as Record<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >;
    const schema = response.content['application/json'].schema;
    expect(schema.$ref).toBeUndefined();
    expect(schema.type).toBe('object');
    expect((doc.components as Record<string, Record<string, unknown>>).links.NextLink).toEqual({
      operationRef: '#/paths/~1pruned/get',
    });
  });

  it('extracts a single schema with its variants', async () => {
    const doc = expectDefined(await extractOpenApi({ kind: 'schema', name: 'Pet' }));
    const schemas = (doc.components as Record<string, Record<string, unknown>>).schemas;
    expect(Object.keys(schemas).sort()).toEqual(['Cat', 'Dog', 'Pet']);
    expect(doc.paths).toEqual({});
    expect(doc.info).toBeDefined();
    expectNoDanglingRefs(doc);
  });

  it('document scope keeps everything but strips platform marker keys at all depths', async () => {
    const doc = expectDefined(await extractOpenApi({ kind: 'document' }));
    const schemas = (doc.components as Record<string, Record<string, unknown>>).schemas;
    expect(schemas.Orphan).toBeDefined();
    const groups = doc['x-tagGroups'] as Array<Record<string, unknown>>;
    expect(groups[0].tags).toEqual(['pets', 'store']);
    expectNoDanglingRefs(doc);
  });
});

function makeAsyncApiFixture(): Record<string, unknown> {
  return deepFreeze({
    asyncapi: '3.0.0',
    info: { title: 'Lights', version: '1.0.0' },
    servers: { production: { host: 'mq.example.com', protocol: 'mqtt' } },
    channels: {
      lighting: {
        address: 'light/measured',
        tags: [{ name: 'lights' }],
        servers: [{ $ref: '#/servers/production' }],
        messages: { measured: { $ref: '#/components/messages/LightMeasured' } },
      },
      replies: {
        address: 'light/replies',
        messages: { ack: { payload: { type: 'string' } } },
      },
      unrelated: {
        address: 'other',
        tags: [{ name: 'other' }],
        messages: {},
      },
    },
    operations: {
      receiveLight: {
        action: 'receive',
        channel: { $ref: '#/channels/lighting' },
        messages: [{ $ref: '#/channels/lighting/messages/measured' }],
        reply: { channel: { $ref: '#/channels/replies' } },
      },
      sendUnrelated: {
        action: 'send',
        channel: { $ref: '#/channels/unrelated' },
      },
    },
    components: {
      messages: {
        LightMeasured: { payload: { $ref: '#/components/schemas/Light' } },
      },
      schemas: {
        Light: { type: 'object', properties: { lumens: { type: 'integer' } } },
        Unused: { type: 'object' },
      },
    },
  });
}

describe('buildSpecSlice — AsyncAPI 3.x', () => {
  it('slices a channel with its operations, reply channels, and message closure', async () => {
    const yaml = await buildSpecSlice('asyncapi', makeAsyncApiFixture(), {
      kind: 'channel',
      channelId: 'lighting',
    });
    const doc = load(expectDefined(yaml)) as Record<string, unknown>;

    expect(Object.keys(doc.channels as object).sort()).toEqual(['lighting', 'replies']);
    expect(Object.keys(doc.operations as object)).toEqual(['receiveLight']);
    expect(doc.servers).toBeDefined();

    const components = doc.components as Record<string, Record<string, unknown>>;
    expect(components.messages.LightMeasured).toBeDefined();
    expect(components.schemas.Light).toBeDefined();
    expect(components.schemas.Unused).toBeUndefined();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const operation = (doc.operations as Record<string, any>).receiveLight;
    expect(operation.channel).toEqual({ $ref: '#/channels/lighting' });
    expect(operation.reply.channel).toEqual({ $ref: '#/channels/replies' });

    expectNoDanglingRefs(doc);
  });
});

describe('buildSpecSlice — YAML output', () => {
  it('serializes the slice as a YAML document', async () => {
    const yaml = await buildSpecSlice('openapi', makeOpenApiFixture(), {
      kind: 'operation',
      pathName: '/pets',
      httpVerb: 'get',
      source: 'paths',
    });

    expect(yaml).toMatch(/^openapi: 3\.1\.0\n/);
    const doc = load(expectDefined(yaml)) as Record<string, unknown>;
    expect(Object.keys(doc.paths as object)).toEqual(['/pets']);
  });

  it('returns undefined for unresolvable scopes', async () => {
    const badScope = { kind: 'tag', tagName: 'nope' } as const;
    await expect(
      buildSpecSlice('openapi', makeOpenApiFixture(), badScope),
    ).resolves.toBeUndefined();
  });
});

describe('buildSpecSlice — unsupported inputs', () => {
  it('returns undefined for object GraphQL documents and non-record documents', async () => {
    await expect(buildSpecSlice('graphql', {}, { kind: 'document' })).resolves.toBeUndefined();
    await expect(
      buildSpecSlice('openapi', undefined, { kind: 'document' }),
    ).resolves.toBeUndefined();
  });

  it('returns undefined when the scope kind belongs to the other spec type', async () => {
    await expect(
      buildSpecSlice('openapi', makeOpenApiFixture(), { kind: 'channel', channelId: 'lighting' }),
    ).resolves.toBeUndefined();
    await expect(
      buildSpecSlice('asyncapi', makeAsyncApiFixture(), {
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'get',
        source: 'paths',
      }),
    ).resolves.toBeUndefined();
    await expect(
      buildSpecSlice('asyncapi', makeAsyncApiFixture(), { kind: 'schema', name: 'Light' }),
    ).resolves.toBeUndefined();
  });
});
