import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import * as yaml from 'js-yaml';

import type { OpenAPIDefinition } from '../../../../types/openapi.js';
import type { ApiItem, ApiStore } from '../../../../types/store.js';
import type { RawApiDocsOptions } from '../../../../types/options.js';
import type {
  CodeSampleSource,
  SecurityRequirement,
  SecuritySchemeEntry,
} from '../../../../services/code-samples/source.js';

import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../components/markdoc/markdocParser.js';
import { processOpenApiDocument } from '../../index.js';
import { readFixture, collectAllItems, filterByItemVariant } from '../../../__tests__/utils.js';

vi.mock('@redocly/theme/ext/configure', async () => {
  return {
    configure: vi.fn(() => ({ requestValues: {} })),
  };
});

const { configure } = await import('@redocly/theme/ext/configure');
const mockConfigure = vi.mocked(configure);

type AnyRecord = Record<string, unknown>;

function findCodeSampleSource(item: ApiItem): CodeSampleSource | null {
  if (item.content?.contentType !== 'item' || item.content?.itemVariant !== 'httpItem') return null;
  const content = item.content as {
    children?: Array<{
      panels?: Array<{ children?: Array<{ kind?: string; source?: unknown }> }>;
    }>;
  };
  for (const child of content.children ?? []) {
    for (const panel of child.panels ?? []) {
      for (const c of panel.children ?? []) {
        if (c.kind === 'code-sample' && c.source) {
          return c.source as CodeSampleSource;
        }
      }
    }
  }
  return null;
}

function findSourceByPathMethod(
  items: ApiItem[],
  pathName: string,
  method: string,
): CodeSampleSource | null {
  const ops = filterByItemVariant(items, 'httpItem');
  for (const op of ops) {
    const src = findCodeSampleSource(op);
    if (src && src.path === pathName && src.method.toUpperCase() === method.toUpperCase()) {
      return src;
    }
  }
  return null;
}

const INLINE_SPEC: OpenAPIDefinition = {
  openapi: '3.0.0',
  info: { title: 'Inline', version: '1.0.0' },
  paths: {
    '/pets': {
      post: {
        operationId: 'createPet',
        summary: 'Create a pet',
        parameters: [
          { name: 'X-Trace-Id', in: 'header', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        security: [{ oauth: ['read'] }, { apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Pet' },
              example: { name: 'spec-default', status: 'available' },
              examples: {
                cat: { value: { name: 'Cat', status: 'available' } },
              },
            },
          },
        },
        responses: { '200': { description: 'ok' } },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
    },
    securitySchemes: {
      oauth: {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'https://example.com/oauth',
            scopes: { read: 'read', write: 'write' },
          },
        },
      } as never,
      apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' } as never,
    },
  },
} as OpenAPIDefinition;

const SERVER_SPEC: OpenAPIDefinition = {
  ...INLINE_SPEC,
  servers: [{ url: 'https://prod.example.com' }, { url: 'https://dev.example.com' }],
} as OpenAPIDefinition;

function cloneSpec<T>(spec: T): T {
  return JSON.parse(JSON.stringify(spec)) as T;
}

async function buildItemsWithMockedConfigure(
  document: OpenAPIDefinition,
  optionsOverride: Partial<RawApiDocsOptions> = {},
): Promise<{ items: ApiItem[]; store: ApiStore }> {
  const options = {
    ...normalizeOptions({
      metadata: {},
      downloadUrls: [],
      ...optionsOverride,
      specType: 'openapi',
    }),
    markdownParser: markdocParser,
  };
  const result = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: 'spec',
    options,
  });
  return { items: collectAllItems(result.items), store: result.store };
}

describe('configure-request-values integration: dynamicRequestValues', () => {
  let itemsWithConfigure: ApiItem[];

  beforeAll(async () => {
    const specContent = readFixture('openapi/schema.yaml');
    const document = yaml.load(specContent) as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        metadata: {},
        downloadUrls: [],
        dynamicRequestValues: {
          headers: { 'Accept-Language': 'en-GB' },
          cookie: { cookieParam: '42' },
          envVariables: { API_KEY: 'configured-key', BASE_URL: 'https://api.test.com' },
        },
      }),
      markdownParser: markdocParser,
    };

    const result = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: 'openapi/schema',
      options,
    });

    itemsWithConfigure = collectAllItems(result.items);
  });

  it('applies dynamicRequestValues to operation parameters and stores requestValues in code-sample', () => {
    const operations = filterByItemVariant(itemsWithConfigure, 'httpItem');
    expect(operations.length).toBeGreaterThan(0);

    const firstOp = operations[0];
    const sampleSource = findCodeSampleSource(firstOp);
    expect(sampleSource).not.toBeNull();
    const headerParams = sampleSource?.parameters?.header ?? [];
    expect(headerParams.some((h) => h.name === 'Accept-Language')).toBe(true);
    const cookieParams = sampleSource?.parameters?.cookie ?? [];
    expect(cookieParams.some((c) => c.name === 'cookieParam')).toBe(true);

    expect(sampleSource?.requestValues).toBeDefined();
    const rv = sampleSource?.requestValues;
    expect(rv?.envVariables).toEqual({
      API_KEY: 'configured-key',
      BASE_URL: 'https://api.test.com',
    });
  });
});

describe('configure-request-values integration: configured request values', () => {
  beforeEach(() => {
    mockConfigure.mockReset();
    mockConfigure.mockReturnValue({ requestValues: {} });
  });

  it('updates request body example with configured values', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        body: { name: 'configured-pet', status: 'available-test' },
      },
    });

    const { items, store } = await buildItemsWithMockedConfigure(cloneSpec(INLINE_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    expect(source).not.toBeNull();

    const bodyEntry = source?.requestBody?.['application/json'];
    expect(bodyEntry?.exampleIds?.length).toBeGreaterThan(0);
    const exampleValues = (bodyEntry?.exampleIds ?? []).map((id) => store.exampleStore[id]?.value);
    expect(exampleValues.length).toBeGreaterThan(0);
    for (const value of exampleValues) {
      expect(value).toEqual(
        expect.objectContaining({ name: 'configured-pet', status: 'available-test' }),
      );
    }
  });

  it('updates security with configured values (default applies to all schemes)', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        security: {
          default: {
            token: { access_token: 'test-token', token_type: 'test token type' },
          },
        },
      },
    });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(INLINE_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    expect(source).not.toBeNull();

    const security = source?.security ?? [];
    expect(security.length).toBeGreaterThan(0);
    for (const req of security) {
      for (const scheme of req.schemes as SecuritySchemeEntry[]) {
        expect(scheme['x-defaultAccessToken']).toBe('test-token');
        expect(scheme['x-defaultTokenType']).toBe('test token type');
      }
    }
  });

  it('persists configured security on requestValues for code-sample builders', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        security: { default: { token: { access_token: 'tok' } } },
      },
    });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(INLINE_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    expect((source?.requestValues?.security as Record<string, AnyRecord>)?.default).toBeDefined();
  });
});

describe('configure-request-values integration: server-specific request values', () => {
  beforeEach(() => {
    mockConfigure.mockReset();
    mockConfigure.mockReturnValue({ requestValues: {} });
  });

  it('applies server-specific security values to scheme.serverValues', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        'https://prod.example.com': {
          security: {
            default: { token: { access_token: 'prod-token', token_type: 'prod token type' } },
          },
        },
        'https://dev.example.com': {
          security: {
            default: { token: { access_token: 'dev-token', token_type: 'dev token type' } },
          },
        },
      },
    });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(SERVER_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    expect(source).not.toBeNull();

    const security = source?.security as SecurityRequirement[];
    expect(security.length).toBeGreaterThan(0);
    for (const req of security) {
      for (const scheme of req.schemes) {
        expect(scheme.serverValues?.['https://prod.example.com']?.['x-defaultAccessToken']).toBe(
          'prod-token',
        );
        expect(scheme.serverValues?.['https://dev.example.com']?.['x-defaultAccessToken']).toBe(
          'dev-token',
        );
      }
    }
  });

  it('applies server-specific request values via parameter serverValues for matching servers', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        'https://prod.example.com': { headers: { 'X-Trace-Id': 'prod-trace' } },
        'https://dev.example.com': { headers: { 'X-Trace-Id': 'dev-trace' } },
      },
    });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(SERVER_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    const traceParam = source?.parameters?.header.find((p) => p.name === 'X-Trace-Id');
    expect(traceParam).toBeDefined();
    expect(traceParam?.serverValues?.['https://prod.example.com']?.example).toBe('prod-trace');
    expect(traceParam?.serverValues?.['https://dev.example.com']?.example).toBe('dev-trace');
  });

  it('handles request values with only some servers defined', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        'https://prod.example.com': {
          security: { default: { token: { access_token: 'prod-only' } } },
        },
      },
    });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(SERVER_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    const security = source?.security as SecurityRequirement[];
    for (const req of security) {
      for (const scheme of req.schemes) {
        expect(scheme.serverValues?.['https://prod.example.com']?.['x-defaultAccessToken']).toBe(
          'prod-only',
        );
        expect(scheme.serverValues?.['https://dev.example.com']).toBeUndefined();
      }
    }
  });

  it('handles empty request values without populating serverValues', async () => {
    mockConfigure.mockReturnValue({ requestValues: {} });

    const { items } = await buildItemsWithMockedConfigure(cloneSpec(SERVER_SPEC));
    const source = findSourceByPathMethod(items, '/pets', 'POST');
    const security = source?.security as SecurityRequirement[];
    for (const req of security) {
      for (const scheme of req.schemes) {
        expect(scheme.serverValues).toBeUndefined();
      }
    }
  });
});

describe('configure-request-values integration: dynamicRequestValues priority', () => {
  beforeEach(() => {
    mockConfigure.mockReset();
    mockConfigure.mockReturnValue({ requestValues: {} });
  });

  it('prioritizes dynamicRequestValues over configured values from configure()', async () => {
    mockConfigure.mockReturnValue({
      requestValues: {
        body: { name: 'configured-pet', status: 'configured-status' },
        security: {
          default: {
            token: { access_token: 'configured-token', token_type: 'configured token type' },
          },
        },
      },
    });

    const { items, store } = await buildItemsWithMockedConfigure(cloneSpec(INLINE_SPEC), {
      dynamicRequestValues: {
        body: { name: 'dynamic-pet', status: 'dynamic-status' },
        security: {
          default: {
            token: { access_token: 'dynamic-token', token_type: 'dynamic token type' },
          },
        },
      },
    });

    const source = findSourceByPathMethod(items, '/pets', 'POST');
    expect(source).not.toBeNull();

    const exampleIds = source?.requestBody?.['application/json']?.exampleIds ?? [];
    const exampleValues = exampleIds.map((id) => store.exampleStore[id]?.value);
    for (const value of exampleValues) {
      expect(value).toEqual(
        expect.objectContaining({ name: 'dynamic-pet', status: 'dynamic-status' }),
      );
    }

    for (const req of source?.security ?? []) {
      for (const scheme of req.schemes as SecuritySchemeEntry[]) {
        expect(scheme['x-defaultAccessToken']).toBe('dynamic-token');
        expect(scheme['x-defaultTokenType']).toBe('dynamic token type');
      }
    }
  });
});
