import { describe, it, expect } from 'vitest';

import type {
  OpenAPICallback,
  OpenAPIDefinition,
  OpenAPIPaths,
  OpenAPITag,
} from '../../../../types/openapi.js';
import type { Referenced } from '../../../../types/common.js';

import { createBuildContext, normalizeCallbacks } from '../context.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { createStoreContext, toRecord } from '../../../helpers.js';

const baseDoc: OpenAPIDefinition = {
  openapi: '3.2.0',
  info: { title: 'Test', version: '1.0' },
  paths: {},
};

function makeDoc(overrides: Partial<OpenAPIDefinition> = {}): OpenAPIDefinition {
  return { ...baseDoc, ...overrides };
}

const defaultOptions = normalizeOptions({
  specType: 'openapi',
  downloadUrls: [],
  metadata: {},
  basePath: '/api',
});

function buildContext(doc: OpenAPIDefinition) {
  return createBuildContext({
    document: doc,
    options: defaultOptions,
    basePath: '/api',
    storeCtx: createStoreContext(toRecord(doc)),
  });
}

describe('createBuildContext - OpenAPI 3.2 tags', () => {
  it('excludes badge kind tags from children of parent tags', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'Premium', kind: 'badge', parent: 'Animals' },
      ] as OpenAPITag[],
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');

    expect(animalsTag?.children).not.toContain('Premium');
  });

  it('excludes audience kind tags from children of parent tags', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'External', kind: 'audience', parent: 'Animals' },
      ] as OpenAPITag[],
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');

    expect(animalsTag?.children).not.toContain('External');
  });

  it('includes nav kind tags in children of parent tags', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'Dogs', kind: 'nav', parent: 'Animals' },
      ] as OpenAPITag[],
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');

    expect(animalsTag?.children).toContain('Dogs');
  });

  it('includes tags without kind in children of parent tags', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'Dogs', parent: 'Animals' },
      ] as OpenAPITag[],
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');

    expect(animalsTag?.children).toContain('Dogs');
  });

  it('generates badges from badge kind tags on operations', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'Premium', kind: 'badge', summary: 'Premium Feature' },
      ] as OpenAPITag[],
      paths: {
        '/pets': {
          get: {
            operationId: 'listPets',
            tags: ['Animals', 'Premium'],
            responses: {},
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');
    const op = animalsTag?.operations[0];

    expect(op?.['x-badges']).toBeDefined();
    expect(op?.['x-badges']).toContainEqual(
      expect.objectContaining({ name: 'Premium Feature', color: 'blue', position: 'after' }),
    );
  });

  it('generates badges from audience kind tags with icon', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'External', kind: 'audience', summary: 'External Users' },
      ] as OpenAPITag[],
      paths: {
        '/pets': {
          get: {
            operationId: 'listPets',
            tags: ['Animals', 'External'],
            responses: {},
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const animalsTag = ctx.tagsMap.get('Animals');
    const op = animalsTag?.operations[0];

    expect(op?.['x-badges']).toBeDefined();
    expect(op?.['x-badges']).toContainEqual(
      expect.objectContaining({
        name: 'External Users',
        color: 'grey',
        icon: 'user-group',
        position: 'after',
      }),
    );
  });

  it('does not add operations to badge/audience tags', () => {
    const doc = makeDoc({
      tags: [
        { name: 'Animals' },
        { name: 'Premium', kind: 'badge' },
      ] as OpenAPITag[],
      paths: {
        '/pets': {
          get: {
            operationId: 'listPets',
            tags: ['Animals', 'Premium'],
            responses: {},
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const premiumTag = ctx.tagsMap.get('Premium');

    expect(premiumTag?.operations).toHaveLength(0);
  });

  it('auto-creates tags referenced by operations but not declared in top-level tags (openapi-docs parity)', () => {
    const doc = makeDoc({
      tags: [{ name: 'Accommodations' }] as OpenAPITag[],
      paths: {
        '/accommodations': {
          get: { operationId: 'listAccommodations', tags: ['Accommodations'], responses: {} },
        },
        '/attractions': {
          // 'Attractions' is used here but NOT declared in the top-level tags array
          get: { operationId: 'listAttractions', tags: ['Attractions'], responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);
    const attractionsTag = ctx.tagsMap.get('Attractions');

    expect(attractionsTag).toBeDefined();
    expect(attractionsTag?.operations).toHaveLength(1);
    expect(ctx.collectedTagOrder).toContain('Attractions');
  });

  it('merges path-item parameter $refs with operation parameter $refs', () => {
    const doc = makeDoc({
      paths: {
        '/custom-fields/{resource}': {
          parameters: [{ $ref: '#/components/parameters/resourcePath' }],
          get: {
            operationId: 'GetCustomFieldCollection',
            parameters: [
              { $ref: '#/components/parameters/collectionLimit' },
              { $ref: '#/components/parameters/collectionOffset' },
            ],
            responses: {},
          },
        },
      },
      components: {
        parameters: {
          resourcePath: {
            name: 'resource',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          collectionLimit: {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer' },
          },
          collectionOffset: {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer' },
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const untagged = ctx.tagsMap.get('');
    expect(untagged?.operations).toHaveLength(1);
    expect(untagged?.operations[0]?.parameters).toHaveLength(3);
  });

  it('inherits PathItem.servers when the operation declares none, but operation servers win', () => {
    const pathServers = [{ url: 'https://path.example.com' }];
    const opServers = [{ url: 'https://op.example.com' }];
    const doc = makeDoc({
      paths: {
        '/inherits': {
          servers: pathServers,
          get: { operationId: 'inherits', responses: {} },
        },
        '/overrides': {
          servers: pathServers,
          get: { operationId: 'overrides', servers: opServers, responses: {} },
        },
      },
    });

    const ops = buildContext(doc).tagsMap.get('')?.operations ?? [];
    const inherits = ops.find((o) => o.operationId === 'inherits');
    const overrides = ops.find((o) => o.operationId === 'overrides');

    expect(inherits?.servers).toEqual(pathServers);
    expect(overrides?.servers).toEqual(opServers);
  });

  it('normalizes legacy x-query operation method to query', () => {
    const doc = makeDoc({
      tags: [{ name: 'Operations' }] as OpenAPITag[],
      paths: {
        '/museum-hours': {
          'x-query': {
            operationId: 'getMuseumHoursLegacy',
            tags: ['Operations'],
            responses: {},
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const operationsTag = ctx.tagsMap.get('Operations');

    expect(operationsTag?.operations).toHaveLength(1);
    expect(operationsTag?.operations[0].httpVerb).toBe('query');
    expect(operationsTag?.operations[0].pointer).toBe('/paths/~1museum-hours/x-query');
  });

  it('keeps httpVerb as query for OpenAPI 3.2 native query operations', () => {
    const doc = makeDoc({
      tags: [{ name: 'Operations' }] as OpenAPITag[],
      paths: {
        '/museum-hours': {
          query: {
            operationId: 'getMuseumHoursQuery',
            tags: ['Operations'],
            responses: {},
          },
        },
      },
    });

    const ctx = buildContext(doc);
    const operationsTag = ctx.tagsMap.get('Operations');

    expect(operationsTag?.operations).toHaveLength(1);
    expect(operationsTag?.operations[0].httpVerb).toBe('query');
    expect(operationsTag?.operations[0].pointer).toBe('/paths/~1museum-hours/query');
  });

  it('lazily creates the default "webhooks" tag when a tagless webhook falls back to it', () => {
    const doc = makeDoc({
      tags: [{ name: 'tasks' }] as OpenAPITag[],
      paths: {
        '/tasks': {
          post: { operationId: 'createTask', tags: ['tasks'], responses: {} },
        },
      },
      webhooks: {
        notification: {
          post: { operationId: 'notification', responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);
    const webhooksTag = ctx.tagsMap.get('webhooks');

    expect(webhooksTag?.operations).toHaveLength(1);
    expect(webhooksTag?.operations[0].isWebhook).toBe(true);
    expect(ctx.collectedTagOrder).toContain('webhooks');
  });

  it('does not create the default "webhooks" tag when the document has no webhooks at all', () => {
    const doc = makeDoc({
      tags: [{ name: 'tasks' }] as OpenAPITag[],
      paths: {
        '/tasks': {
          post: { operationId: 'createTask', tags: ['tasks'], responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);

    expect(ctx.tagsMap.has('webhooks')).toBe(false);
    expect(ctx.collectedTagOrder).not.toContain('webhooks');
  });

  it('does not create the default "webhooks" tag when every webhook has explicit tags', () => {
    const doc = makeDoc({
      tags: [{ name: 'tasks' }] as OpenAPITag[],
      webhooks: {
        notification: {
          post: { operationId: 'notification', tags: ['tasks'], responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);

    expect(ctx.tagsMap.has('webhooks')).toBe(false);
    expect(ctx.collectedTagOrder).not.toContain('webhooks');
  });

  it('reuses the top-level "webhooks" tag when declared at the document level', () => {
    const doc = makeDoc({
      tags: [{ name: 'webhooks' }] as OpenAPITag[],
      webhooks: {
        notification: {
          post: { operationId: 'notification', responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);
    const webhooksTag = ctx.tagsMap.get('webhooks');

    expect(webhooksTag?.operations).toHaveLength(1);
    expect(ctx.collectedTagOrder.filter((t) => t === 'webhooks')).toHaveLength(0);
  });

  it('lazily creates the default "webhooks" tag when a tagless x-webhook falls back to it', () => {
    const doc = makeDoc({
      tags: [{ name: 'tasks' }] as OpenAPITag[],
      paths: {
        '/tasks': {
          post: { operationId: 'createTask', tags: ['tasks'], responses: {} },
        },
      },
      'x-webhooks': {
        notification: {
          post: { operationId: 'notification', responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);
    const webhooksTag = ctx.tagsMap.get('webhooks');

    expect(webhooksTag?.operations).toHaveLength(1);
    expect(webhooksTag?.operations[0].isWebhook).toBe(true);
    expect(ctx.collectedTagOrder).toContain('webhooks');
  });

  it('does not create the default "webhooks" tag when every x-webhook has explicit tags', () => {
    const doc = makeDoc({
      tags: [{ name: 'tasks' }] as OpenAPITag[],
      'x-webhooks': {
        notification: {
          post: { operationId: 'notification', tags: ['tasks'], responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);

    expect(ctx.tagsMap.has('webhooks')).toBe(false);
    expect(ctx.collectedTagOrder).not.toContain('webhooks');
  });

  it('reuses the top-level "webhooks" tag when declared at the document level and x-webhooks is used', () => {
    const doc = makeDoc({
      tags: [{ name: 'webhooks' }] as OpenAPITag[],
      'x-webhooks': {
        notification: {
          post: { operationId: 'notification', responses: {} },
        },
      },
    });

    const ctx = buildContext(doc);
    const webhooksTag = ctx.tagsMap.get('webhooks');

    expect(webhooksTag?.operations).toHaveLength(1);
    expect(ctx.collectedTagOrder.filter((t) => t === 'webhooks')).toHaveLength(0);
  });
});

describe('createBuildContext - path item keys', () => {
  it('ignores object-valued path item extensions while collecting sibling operations', () => {
    const doc = makeDoc({
      paths: {
        '/users': {
          'x-okta-lifecycle': {
            deprecated: { since: '2024.01.0' },
            eol: { since: '2025.01.0' },
          },
          get: { operationId: 'listUsers', responses: {} },
        },
      } as unknown as OpenAPIPaths,
    });

    const operations = buildContext(doc).tagsMap.get('')?.operations ?? [];

    expect(operations).toHaveLength(1);
    expect(operations[0].httpVerb).toBe('get');
    expect(operations[0].operationId).toBe('listUsers');
  });

  it('ignores non-operation path item fields', () => {
    const doc = makeDoc({
      paths: {
        '/users': {
          summary: 'Users',
          description: 'User collection',
          servers: [{ url: 'https://example.com' }],
          parameters: [{ name: 'id', in: 'query' }],
          get: { operationId: 'listUsers', responses: {} },
        },
      },
    });

    const operations = buildContext(doc).tagsMap.get('')?.operations ?? [];

    expect(operations).toHaveLength(1);
    expect(operations[0].operationId).toBe('listUsers');
  });

  it('collects operations declared with uppercase HTTP methods', () => {
    const doc = makeDoc({
      paths: {
        '/users': {
          GET: { operationId: 'listUsers', responses: {} },
        },
      } as unknown as OpenAPIPaths,
    });

    const operations = buildContext(doc).tagsMap.get('')?.operations ?? [];

    expect(operations).toHaveLength(1);
    expect(operations[0].operationId).toBe('listUsers');
  });

  it('collects additionalOperations alongside standard operations', () => {
    const doc = makeDoc({
      paths: {
        '/users': {
          'x-okta-lifecycle': { deprecated: { since: '2024.01.0' } },
          get: { operationId: 'listUsers', responses: {} },
          additionalOperations: {
            PURGE: { operationId: 'purgeUsers', responses: {} },
          },
        },
      } as unknown as OpenAPIPaths,
    });

    const operations = buildContext(doc).tagsMap.get('')?.operations ?? [];

    expect(operations).toHaveLength(2);
    expect(operations.map((o) => o.operationId).sort()).toEqual(['listUsers', 'purgeUsers']);

    const standard = operations.find((o) => o.operationId === 'listUsers');
    const additional = operations.find((o) => o.operationId === 'purgeUsers');

    expect(standard?.isAdditionalOperation).toBe(false);
    expect(additional?.isAdditionalOperation).toBe(true);
    expect(additional?.httpVerb).toBe('PURGE');
  });
});

describe('normalizeCallbacks', () => {
  it('returns undefined for falsy, non-object, and empty inputs', () => {
    expect(normalizeCallbacks(undefined, {})).toBeUndefined();
    expect(normalizeCallbacks(null as unknown as undefined, {})).toBeUndefined();
    expect(normalizeCallbacks({}, {})).toBeUndefined();
  });

  it('normalizes a simple callback with one operation', () => {
    const callbacks = {
      onEvent: {
        '{$request.body#/callbackUrl}': {
          post: {
            summary: 'Event callback',
            operationId: 'onEventCallback',
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    };

    const result = normalizeCallbacks(callbacks, {});

    expect(result).toEqual([
      {
        name: 'onEvent',
        url: '{$request.body#/callbackUrl}',
        operations: [
          expect.objectContaining({
            httpVerb: 'post',
            pathName: '{$request.body#/callbackUrl}',
            summary: 'Event callback',
            operationId: 'onEventCallback',
            responses: { '200': { description: 'OK' } },
          }),
        ],
      },
    ]);
  });

  it('handles multiple operations, URL expressions, and named callbacks', () => {
    const callbacks = {
      onEventA: {
        '/path-1': {
          get: { summary: 'Get', responses: {} },
          post: { summary: 'Post', responses: {} },
        },
        '/path-2': {
          put: { summary: 'Put', responses: {} },
        },
      },
      onEventB: {
        '/path-3': { delete: { summary: 'Delete', responses: {} } },
      },
    };

    const result = normalizeCallbacks(callbacks, {});

    expect(result).toHaveLength(3);
    expect(result?.[0].name).toBe('onEventA');
    expect(result?.[0].url).toBe('/path-1');
    expect(result?.[0].operations).toHaveLength(2);
    expect(result?.[1].url).toBe('/path-2');
    expect(result?.[2].name).toBe('onEventB');
  });

  it('lowercases HTTP verbs and recognizes all standard methods while ignoring non-method keys', () => {
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
    const pathItem: Record<string, unknown> = {
      summary: 'ignored',
      description: 'ignored',
      servers: [{ url: 'https://example.com' }],
      parameters: [{ name: 'x', in: 'query' }],
    };
    for (const method of methods) {
      pathItem[method.toUpperCase()] = { summary: method, responses: {} };
    }

    const callbacks = { onEvent: { '/callback': pathItem } };
    const result = normalizeCallbacks(
      callbacks as unknown as { [name: string]: Referenced<OpenAPICallback> },
      {},
    );

    expect(result?.[0].operations).toHaveLength(methods.length);
    const verbs = result?.[0].operations?.map((op) => op.httpVerb).sort();
    expect(verbs).toEqual(methods.sort());
  });

  it('creates callback entry without operations when path has no HTTP methods', () => {
    const callbacks = {
      onEvent: {
        '/callback': { summary: 'Just metadata' },
      },
    };

    const result = normalizeCallbacks(
      callbacks as Record<string, Record<string, Record<string, unknown>>>,
      {},
    );

    expect(result).toEqual([{ name: 'onEvent', url: '/callback' }]);
    expect(result?.[0].operations).toBeUndefined();
  });

  it('falls back to path-level servers/parameters and prefers operation-level when present', () => {
    const pathServers = [{ url: 'https://path.example.com' }];
    const opServers = [{ url: 'https://op.example.com' }];
    const pathParams = [{ name: 'id', in: 'path' }];
    const opParams = [{ name: 'page', in: 'query' }];

    const callbacks = {
      fallback: {
        '/fb': {
          servers: pathServers,
          parameters: pathParams,
          post: { summary: 'Fallback', responses: {} },
        },
      },
      override: {
        '/ov': {
          servers: pathServers,
          parameters: pathParams,
          post: {
            summary: 'Override',
            servers: opServers,
            parameters: opParams,
            responses: {},
          },
        },
      },
    } as { [name: string]: Referenced<OpenAPICallback> };

    const result = normalizeCallbacks(callbacks, {});
    const fallbackOp = result?.find((cb) => cb.name === 'fallback')?.operations?.[0];
    const overrideOp = result?.find((cb) => cb.name === 'override')?.operations?.[0];

    expect(fallbackOp?.servers).toEqual(pathServers);
    expect(fallbackOp?.parameters).toEqual(pathParams);
    expect(overrideOp?.servers).toEqual(opServers);
    expect(overrideOp?.parameters).toEqual(opParams);
  });

  it('copies x- extensions without overriding known fields', () => {
    const callbacks = {
      onEvent: {
        '/callback': {
          post: {
            summary: 'Real summary',
            'x-summary': 'Extension summary',
            'x-custom': 'value',
            'x-another': 42,
            responses: {},
          },
        },
      },
    } as { [name: string]: Referenced<OpenAPICallback> };

    const result = normalizeCallbacks(callbacks, {});
    const op = result?.[0].operations?.[0];

    expect(op?.summary).toBe('Real summary');
    expect(op?.['x-summary']).toBe('Extension summary');
    expect(op?.['x-custom']).toBe('value');
    expect(op?.['x-another']).toBe(42);
  });

  it('preserves all standard operation fields', () => {
    const callbacks = {
      onEvent: {
        '/callback': {
          post: {
            summary: 'Sum',
            operationId: 'cbOp',
            description: 'Desc',
            deprecated: true,
            requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
            responses: { '201': { description: 'Created' } },
            security: [{ apiKey: [] }],
            servers: [{ url: 'https://cb.example.com' }],
            parameters: [{ name: 'q', in: 'query' }],
            externalDocs: { url: 'https://docs.example.com', description: 'Docs' },
          },
        },
      },
    } as { [name: string]: Referenced<OpenAPICallback> };

    const result = normalizeCallbacks(callbacks, {});
    const op = result?.[0].operations?.[0];

    expect(op).toEqual(
      expect.objectContaining({
        summary: 'Sum',
        operationId: 'cbOp',
        description: 'Desc',
        deprecated: true,
        requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Created' } },
        security: [{ apiKey: [] }],
        servers: [{ url: 'https://cb.example.com' }],
        parameters: [{ name: 'q', in: 'query' }],
        externalDocs: { url: 'https://docs.example.com', description: 'Docs' },
      }),
    );
  });

  it('resolves $ref callbacks from the document', () => {
    const document = {
      components: {
        callbacks: {
          onEvent: {
            '/resolved-callback': {
              post: { summary: 'Resolved', responses: {} },
            },
          },
        },
      },
    };

    const callbacks = {
      onEvent: { $ref: '#/components/callbacks/onEvent' },
    };

    const result = normalizeCallbacks(callbacks, document);

    expect(result).toEqual([
      {
        name: 'onEvent',
        url: '/resolved-callback',
        operations: [expect.objectContaining({ httpVerb: 'post', summary: 'Resolved' })],
      },
    ]);
  });

  it('skips invalid entries: non-object refs, null/non-object path items, and null/non-object operations', () => {
    const document = {
      components: { callbacks: { broken: 'not an object' } },
    };

    const refResult = normalizeCallbacks({ broken: { $ref: '#/components/callbacks/broken' } }, document);
    expect(refResult).toBeUndefined();

    const mixedCallbacks = {
      onEvent: {
        '/valid': { post: { summary: 'Valid', responses: {} } },
        '/null-path': null,
        '/string-path': 'not an object',
      },
    } as unknown as { [name: string]: Referenced<OpenAPICallback> };

    const pathResult = normalizeCallbacks(mixedCallbacks, {});
    expect(pathResult).toHaveLength(1);
    expect(pathResult?.[0].url).toBe('/valid');

    const opCallbacks = {
      onEvent: {
        '/callback': { post: { summary: 'Valid', responses: {} }, get: null, put: 'invalid' },
      },
    } as unknown as { [name: string]: Referenced<OpenAPICallback> };

    const opResult = normalizeCallbacks(opCallbacks, {});
    expect(opResult?.[0].operations).toHaveLength(1);
    expect(opResult?.[0].operations?.[0].httpVerb).toBe('post');
  });

});
