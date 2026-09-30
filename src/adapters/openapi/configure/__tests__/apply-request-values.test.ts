import { describe, it, expect } from 'vitest';

import { applyRequestValuesToOperationInfo } from '../apply-request-values.js';
import type {
  OpenApiBuildContext as BuildContext,
  OperationInfo,
  OpenAPIDefinition,
} from '../../../../types/openapi.js';
import type { StoreContext } from '../../../../types/store.js';
import { createStoreContext } from '../../../helpers.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import type { ApiDocsOptions } from '../../../../types/options.js';
import { openApiContext } from '../../buildContext.js';

function makeTestContext(storeCtx: StoreContext, options: ApiDocsOptions): BuildContext {
  return {
    storeCtx,
    document: {} as OpenAPIDefinition,
    options,
    basePath: '/',
    downloadUrls: [],
    languages: [],
    tagsMap: new Map(),
    collectedTagOrder: [],
    badgeTags: [],
  };
}

function getOptions(): ApiDocsOptions {
  return normalizeOptions({
    specType: 'openapi',
  });
}

describe('applyRequestValuesToOperationInfo', () => {
  it('applies parameter examples from request values', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: [
        { name: 'limit', in: 'query', schema: { type: 'integer' } },
        { name: 'X-Request-Id', in: 'header', schema: { type: 'string' } },
      ],
    };
    const storeCtx = createStoreContext({});

    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        query: { limit: '20' },
        headers: { 'X-Request-Id': 'req-123' },
      }),
    );

    const params = operationInfo.parameters as Array<Record<string, unknown>>;
    expect(params.find((p) => p.name === 'limit')?.example).toBe('20');
    expect(params.find((p) => p.name === 'X-Request-Id')?.example).toBe('req-123');
  });

  it('applies parameter examples to $ref parameters', () => {
    const document = {
      components: {
        parameters: {
          PaginationLimit: {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10, example: 15 },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const operationInfo: OperationInfo = {
      pointer: '/paths/~1events/get',
      pathName: '/events',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: [{ $ref: '#/components/parameters/PaginationLimit' }],
    };
    const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);

    openApiContext.run({ ...makeTestContext(storeCtx, getOptions()), document }, () =>
      applyRequestValuesToOperationInfo(operationInfo, { query: { limit: '7' } }),
    );

    const params = operationInfo.parameters as Array<Record<string, unknown>>;
    expect(params[0]).not.toHaveProperty('$ref');
    expect(params[0]).toMatchObject({
      name: 'limit',
      in: 'query',
      example: '7',
    });
    expect(
      (document.components?.parameters?.PaginationLimit as Record<string, unknown> | undefined)
        ?.example,
    ).toBeUndefined();
  });

  it('merges request body with existing example (only existing keys, recursive)', () => {
    const requestBody = {
      content: {
        'application/json': {
          example: {
            name: 'Alice Smith',
            email: 'alice@example.com',
            settings: { notifications: true, theme: 'light' },
          },
        },
      },
    };
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1users/post',
      pathName: '/users',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      requestBody,
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        body: {
          name: 'Bob Wilson',
          settings: { notifications: false },
        },
      }),
    );

    const content = (
      operationInfo.requestBody as { content: Record<string, Record<string, unknown>> }
    ).content['application/json'];
    expect(content.example).toEqual({
      name: 'Bob Wilson',
      email: 'alice@example.com',
      settings: { notifications: false, theme: 'light' },
    });
  });

  it('replaces array/primitive example when body is provided', () => {
    const requestBody = {
      content: {
        'application/json': { example: 'original' },
      },
    };
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1data/post',
      pathName: '/data',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      requestBody,
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, { body: { id: 1 } }),
    );

    const content = (
      operationInfo.requestBody as { content: Record<string, Record<string, unknown>> }
    ).content['application/json'];
    expect(content.example).toEqual({ id: 1 });
  });

  it('stores security and envVariables on operationInfo.requestValues', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        security: {
          default: { username: 'user', password: 'secret' },
        },
        envVariables: { API_KEY: 'key-123', BASE_URL: 'https://api.example.com' },
      }),
    );

    expect(operationInfo.requestValues).toEqual({
      security: { default: { username: 'user', password: 'secret' } },
      envVariables: { API_KEY: 'key-123', BASE_URL: 'https://api.example.com' },
    });
  });

  it('applies server variables to all servers when no serverUrl', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [
        {
          url: 'https://api.example.com/{version}/{env}',
          variables: { version: { default: 'v1' }, env: { default: 'prod' } },
        },
        { url: 'https://dev.api.example.com/{version}', variables: { version: { default: 'v1' } } },
      ],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        serverVariables: { version: 'v2', env: 'staging' },
      }),
    );

    const servers = operationInfo.servers as Array<{
      url: string;
      variables?: Record<string, { default?: string }>;
    }>;
    expect(servers[0].variables?.version?.default).toBe('v2');
    expect(servers[0].variables?.env?.default).toBe('staging');
    expect(servers[1].variables?.version?.default).toBe('v2');
    expect(servers[1].variables?.env).toBeUndefined();
  });

  it('does not add non-existent server variables', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [
        { url: 'https://api.example.com/{version}', variables: { version: { default: 'v1' } } },
      ],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        serverVariables: { nonExistent: 'x', version: 'v2' },
      }),
    );

    const servers = operationInfo.servers as Array<{
      url: string;
      variables?: Record<string, { default?: string }>;
    }>;
    expect(servers[0].variables?.version?.default).toBe('v2');
    expect(servers[0].variables?.nonExistent).toBeUndefined();
  });

  it('handles empty serverVariables without changing server variable defaults', () => {
    const servers = [{ url: 'https://api.example.com/{v}', variables: { v: { default: 'v1' } } }];
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers,
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, { serverVariables: {} }),
    );
    expect(
      (operationInfo.servers as Array<{ variables?: Record<string, { default?: string }> }>)[0]
        .variables?.v?.default,
    ).toBe('v1');
  });

  it('preserves other variable properties (enum, description) when updating default', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [
        {
          url: 'https://api.example.com/{version}',
          variables: {
            version: {
              default: 'v1',
              enum: ['v1', 'v2', 'v3'],
              description: 'API version',
            },
          },
        },
      ],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, { serverVariables: { version: 'v2' } }),
    );

    const servers = operationInfo.servers as Array<{
      variables?: Record<string, { default?: string; enum?: string[]; description?: string }>;
    }>;
    expect(servers[0].variables?.version?.default).toBe('v2');
    expect(servers[0].variables?.version?.enum).toEqual(['v1', 'v2', 'v3']);
    expect(servers[0].variables?.version?.description).toBe('API version');
  });

  it('applies server-specific request values using first matching server', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: [{ name: 'limit', in: 'query' }],
      servers: [
        { url: 'https://dev.api.example.com', variables: {} },
        { url: 'https://api.example.com', variables: { v: { default: 'v1' } } },
      ],
    };
    const storeCtx = createStoreContext({});
    const serverRequestValues = {
      'https://dev.api.example.com': { query: { limit: '5' } },
      'https://api.example.com': { query: { limit: '10' }, serverVariables: { v: 'v2' } },
    };
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, serverRequestValues),
    );

    const params = operationInfo.parameters as Array<Record<string, unknown>>;
    expect(params[0].example).toBe('5');
    const s = operationInfo.servers as Array<{
      url: string;
      variables?: Record<string, { default?: string }>;
    }>;
    expect(s[1].variables?.v?.default).toBe('v2');
  });

  it('captures server-scoped envVariables in serverRequestValues', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [
        { url: 'https://prod.api.example.com', variables: {} },
        { url: 'https://dev.api.example.com', variables: {} },
      ],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        'https://prod.api.example.com': {
          envVariables: { API_KEY: 'prod-key', BASE_URL: 'https://prod.api.example.com' },
        },
        'https://dev.api.example.com': {
          envVariables: { API_KEY: 'dev-key' },
        },
      }),
    );

    expect(operationInfo.requestValues?.serverRequestValues).toEqual({
      'https://prod.api.example.com': {
        envVariables: { API_KEY: 'prod-key', BASE_URL: 'https://prod.api.example.com' },
      },
      'https://dev.api.example.com': {
        envVariables: { API_KEY: 'dev-key' },
      },
    });
  });

  it('captures server-scoped body, security, headers, and envVariables together', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/post',
      pathName: '/pets',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [{ url: 'https://prod.api.example.com', variables: {} }],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        'https://prod.api.example.com': {
          headers: { 'X-Region': 'us-east' },
          security: { default: { token: { access_token: 'prod-tok' } } },
          envVariables: { ENV: 'prod' },
          body: { name: 'prod-pet' },
        },
      }),
    );

    expect(operationInfo.requestValues?.serverRequestValues).toEqual({
      'https://prod.api.example.com': {
        headers: { 'X-Region': 'us-east' },
        queryString: undefined,
        cookies: undefined,
        security: { default: { token: { access_token: 'prod-tok' } } },
        envVariables: { ENV: 'prod' },
        body: { name: 'prod-pet' },
      },
    });
  });

  it('merges request body into named example dataValue (OpenAPI 3.2 precedence)', () => {
    const requestBody = {
      content: {
        'application/json': {
          examples: {
            primary: {
              dataValue: {
                name: 'Alice',
                email: 'alice@example.com',
                settings: { notifications: true, theme: 'light' },
              },
            },
          },
        },
      },
    };
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1users/post',
      pathName: '/users',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      requestBody,
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        body: { name: 'Bob', settings: { notifications: false } },
      }),
    );

    const example = (
      (operationInfo.requestBody as { content: Record<string, unknown> }).content[
        'application/json'
      ] as {
        examples: Record<string, { dataValue?: unknown; value?: unknown }>;
      }
    ).examples.primary;
    expect(example.dataValue).toEqual({
      name: 'Bob',
      email: 'alice@example.com',
      settings: { notifications: false, theme: 'light' },
    });
    expect(example.value).toBeUndefined();
  });

  it('replaces named example serializedValue when no dataValue is present', () => {
    const requestBody = {
      content: {
        'application/x-www-form-urlencoded': {
          examples: {
            primary: { serializedValue: 'name=Alice' },
          },
        },
      },
    };
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1form/post',
      pathName: '/form',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      requestBody,
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {
        body: 'name=Bob' as unknown as Record<string, unknown>,
      }),
    );

    const example = (
      (operationInfo.requestBody as { content: Record<string, unknown> }).content[
        'application/x-www-form-urlencoded'
      ] as {
        examples: Record<string, { serializedValue?: unknown }>;
      }
    ).examples.primary;
    expect(example.serializedValue).toBe('name=Bob');
  });

  it('keeps the mock bucket in the per-server fan-out but never bakes it as the effective default', () => {
    // The operation declares only spec servers; the mock server is injected at
    // position "first" by the caller (items/operation/item.ts) and must not be
    // dropped from the per-server fan-out. However, the baked (server-independent)
    // defaults are shared with embedded code samples that strip mock servers for
    // display, so the effective bucket must come from the first non-mock server.
    const mockUrl = 'http://localhost:4000/_mock/configure/museum';
    const prodUrl = 'https://api.museum.example.com/v1';
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1special-events/post',
      pathName: '/special-events',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [{ url: prodUrl }],
      parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }],
    };
    const storeCtx = createStoreContext({});
    const mergedServers = [
      { url: mockUrl, description: 'Mock server', isMockServer: true },
      { url: prodUrl },
    ];

    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(
        operationInfo,
        {
          [prodUrl]: {
            query: { limit: '99' },
            security: { default: { username: 'prod_api_user', password: 'Pr0d@P!S3cur3' } },
          },
          [mockUrl]: {
            query: { limit: '1' },
            security: { default: { username: 'api_user', password: 'secureP@ssword123' } },
          },
        },
        mergedServers,
      ),
    );

    // Effective bucket = first non-mock server in the merged list.
    expect((operationInfo.parameters as Array<Record<string, unknown>>)[0].example).toBe('99');
    expect(operationInfo.requestValues?.security).toEqual({
      default: { username: 'prod_api_user', password: 'Pr0d@P!S3cur3' },
    });
    // Both buckets survive in the per-server fan-out (mock-selected display
    // resolves through serverRequestValues, not the baked defaults).
    expect(Object.keys(operationInfo.requestValues?.serverRequestValues ?? {})).toEqual(
      expect.arrayContaining([mockUrl, prodUrl]),
    );
  });

  it('does not fall back to a mock-only bucket for the baked defaults', () => {
    // When configure keys only the mock server URL, nothing should be baked
    // globally — the mock values must stay scoped to serverRequestValues so a
    // production server never displays them.
    const mockUrl = 'http://localhost:4000/_mock/configure/museum';
    const prodUrl = 'https://api.museum.example.com/v1';
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1special-events/post',
      pathName: '/special-events',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      servers: [{ url: prodUrl }],
      parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }],
    };
    const storeCtx = createStoreContext({});
    const mergedServers = [
      { url: mockUrl, description: 'Mock server', isMockServer: true },
      { url: prodUrl },
    ];

    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(
        operationInfo,
        {
          [mockUrl]: {
            query: { limit: '1' },
            security: { default: { username: 'api_user', password: 'secureP@ssword123' } },
          },
        },
        mergedServers,
      ),
    );

    expect((operationInfo.parameters as Array<Record<string, unknown>>)[0].example).toBeUndefined();
    expect(operationInfo.requestValues?.security).toBeUndefined();
    expect(operationInfo.requestValues?.serverRequestValues?.[mockUrl]).toMatchObject({
      security: { default: { username: 'api_user', password: 'secureP@ssword123' } },
    });
  });

  it('still uses the mock bucket as default when the mock server replaces all servers', () => {
    // mockServer.position "replace" leaves the mock as the only server — with no
    // non-mock server to prefer, the mock bucket may serve as the default.
    const mockUrl = 'http://localhost:4000/_mock/configure/museum';
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1special-events/post',
      pathName: '/special-events',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }],
    };
    const storeCtx = createStoreContext({});
    const mergedServers = [{ url: mockUrl, description: 'Mock server', isMockServer: true }];

    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(
        operationInfo,
        { [mockUrl]: { query: { limit: '1' } } },
        mergedServers,
      ),
    );

    expect((operationInfo.parameters as Array<Record<string, unknown>>)[0].example).toBe('1');
  });

  it('does nothing when requestValues is empty', () => {
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: [{ name: 'limit', in: 'query' }],
    };
    const storeCtx = createStoreContext({});
    openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
      applyRequestValuesToOperationInfo(operationInfo, {}),
    );

    expect((operationInfo.parameters as Array<Record<string, unknown>>)[0].example).toBeUndefined();
    expect(operationInfo.requestValues).toBeUndefined();
  });
});

describe('applyRequestValuesToOperationInfo — shared document safety', () => {
  function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.freeze(value);
      for (const entry of Object.values(value)) deepFreeze(entry);
    }
    return value;
  }

  it('does not mutate a fully frozen document (body examples, form examples, servers)', () => {
    const document = deepFreeze({
      servers: [
        { url: 'https://api.example.com/{tenant}', variables: { tenant: { default: 'acme' } } },
      ],
      components: {},
    }) as unknown as OpenAPIDefinition;

    const requestBody = deepFreeze({
      content: {
        'application/json': {
          example: { name: 'original' },
          examples: { first: { value: { name: 'original' } } },
          formExamples: { alt: { value: { name: 'original' } } },
        },
      },
    });

    const operationInfo: OperationInfo = {
      pointer: '/paths/~1tickets/post',
      pathName: '/tickets',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: deepFreeze([{ name: 'limit', in: 'query', schema: { type: 'integer' } }]),
      requestBody: requestBody as never,
      servers: document.servers as never,
    };
    const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);

    expect(() =>
      openApiContext.run({ ...makeTestContext(storeCtx, getOptions()), document }, () =>
        applyRequestValuesToOperationInfo(operationInfo, {
          query: { limit: '20' },
          body: { name: 'configured' },
          serverVariables: { tenant: 'globex' },
        }),
      ),
    ).not.toThrow();

    // The frozen originals are untouched...
    expect(requestBody.content['application/json'].example).toEqual({ name: 'original' });
    expect(requestBody.content['application/json'].examples.first.value).toEqual({
      name: 'original',
    });
    expect(document.servers[0].variables.tenant.default).toBe('acme');

    // ...and the configured values landed on the operation's own copies.
    const params = operationInfo.parameters as Array<Record<string, unknown>>;
    expect(params[0].example).toBe('20');
    const content = (
      operationInfo.requestBody as never as Record<string, Record<string, Record<string, unknown>>>
    ).content['application/json'];
    expect(content.example).toEqual({ name: 'configured' });
  });

  it('does not mutate inline parameters belonging to the document', () => {
    const inlineParam = { name: 'limit', in: 'query', schema: { type: 'integer' } };
    const operationInfo: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: [],
      parameters: deepFreeze([inlineParam]),
    };
    const storeCtx = createStoreContext({});

    expect(() =>
      openApiContext.run(makeTestContext(storeCtx, getOptions()), () =>
        applyRequestValuesToOperationInfo(operationInfo, { query: { limit: '20' } }),
      ),
    ).not.toThrow();

    const params = operationInfo.parameters as Array<Record<string, unknown>>;
    expect(params[0].example).toBe('20');
    expect(inlineParam).not.toHaveProperty('example');
  });
});
