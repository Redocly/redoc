import { describe, it, expect } from 'vitest';

import type { ApiItem, ApiItemContent } from '../../../types/store.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { collectAllItems } from '../../__tests__/utils.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { panelKind } from '../../../types/common.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { buildServerEnvValues } from '../../../services/code-samples/server-env.js';

const options = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  markdownParser: markdocParser,
};

type CodeSampleNode = {
  kind: string;
  servers?: Array<{ url?: string }>;
  source?: { path?: string; servers?: Array<{ url?: string }> };
};

function collectCodeSampleNodes(value: unknown, acc: CodeSampleNode[] = []): CodeSampleNode[] {
  if (!value || typeof value !== 'object') return acc;
  if ((value as CodeSampleNode).kind === panelKind.CODE_SAMPLE) {
    acc.push(value as CodeSampleNode);
  }
  for (const child of Object.values(value as Record<string, unknown>)) {
    if (Array.isArray(child)) {
      child.forEach((entry) => collectCodeSampleNodes(entry, acc));
    } else if (child && typeof child === 'object') {
      collectCodeSampleNodes(child, acc);
    }
  }
  return acc;
}

function codeSampleNodeForPath(items: ApiItem[], path: string): CodeSampleNode | undefined {
  const contents = collectAllItems(items)
    .map((item) => item.content)
    .filter((content): content is ApiItemContent => content != null);
  return contents
    .flatMap((content) => collectCodeSampleNodes(content))
    .find((node) => node.source?.path === path);
}

const DOCUMENT_SERVER = 'https://api.example.com';

// An operation with an *empty* `servers: []` array must fall through to the
// document-level servers everywhere — configure resolution (item.ts), the
// operation panel (content.ts), and code samples (build-code-sample-source.ts)
// must all agree. A `??` fallback keeps the empty list, diverging from
// `pickOperationServers`, which item.ts already uses.
const document = {
  openapi: '3.1.0',
  info: { title: 'Museum', version: '1' },
  servers: [{ url: DOCUMENT_SERVER }],
  tags: [{ name: 'Operations' }],
  paths: {
    '/museum-hours': {
      get: {
        operationId: 'getMuseumHours',
        tags: ['Operations'],
        servers: [],
        responses: { '200': { description: 'ok' } },
      },
    },
  },
} as unknown as OpenAPIDefinition;

describe('operation servers: [] falls through to document servers', () => {
  it('resolves document servers for both the operation panel and code samples', async () => {
    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });
    const node = codeSampleNodeForPath(items, '/museum-hours');
    expect(node).toBeDefined();

    // content.ts — operation panel servers
    expect(node?.servers?.map((s) => s.url)).toEqual([DOCUMENT_SERVER]);

  });
});

type ServersPanelNode = { kind: string; servers: Array<{ url?: unknown }> };

function collectServersPanels(value: unknown, acc: ServersPanelNode[] = []): ServersPanelNode[] {
  if (!value || typeof value !== 'object') return acc;
  if ((value as ServersPanelNode).kind === panelKind.SERVERS) {
    acc.push(value as ServersPanelNode);
  }
  for (const child of Object.values(value as Record<string, unknown>)) {
    collectServersPanels(child, acc);
  }
  return acc;
}

const PATH_SERVER = 'https://path.example.com';
const INVALID_SERVERS = [{ description: 'Production' }, { url: null }, { url: 42 }];

function operation(operationId: string, servers?: unknown[]): Record<string, unknown> {
  return {
    operationId,
    tags: ['Operations'],
    ...(servers && { servers }),
    responses: { '200': { description: 'ok' } },
  };
}

// The OpenAPI Server Object requires `url`; a server without one is skipped wherever servers are
// read, and a level left with none falls through to the next one up.
const documentWithInvalidServers = {
  openapi: '3.1.0',
  info: { title: 'Museum', version: '1' },
  servers: [...INVALID_SERVERS, { url: DOCUMENT_SERVER }],
  tags: [{ name: 'Operations' }],
  paths: {
    '/operation-level': { get: operation('operationLevel', INVALID_SERVERS) },
    '/path-level': {
      servers: [{ url: PATH_SERVER }],
      get: operation('pathLevel', INVALID_SERVERS),
    },
    '/path-level-invalid': {
      servers: INVALID_SERVERS,
      get: operation('pathLevelInvalid'),
    },
    '/path-level-empty-operation': {
      servers: [{ url: PATH_SERVER }],
      get: operation('pathLevelEmptyOperation', []),
    },
  },
} as unknown as OpenAPIDefinition;

describe('servers without a url', () => {
  it('skips them in the servers panel, the environment store and code samples', async () => {
    const { items, store } = await processOpenApiDocument({
      type: 'openapi',
      document: documentWithInvalidServers,
      basePath: '/api',
      options,
    });

    const panels = collectServersPanels(items);
    expect(panels.map((panel) => panel.servers.map((s) => s.url))).toEqual([[DOCUMENT_SERVER]]);
    expect(store.servers?.map((s) => s.url)).toEqual([DOCUMENT_SERVER]);

    const urlsFor = (path: string) => {
      const node = codeSampleNodeForPath(items, path);
      expect(node).toBeDefined();
      return node?.servers?.map((s) => s.url);
    };
    expect(urlsFor('/operation-level')).toEqual([DOCUMENT_SERVER]);
    expect(urlsFor('/path-level')).toEqual([PATH_SERVER]);
    expect(urlsFor('/path-level-invalid')).toEqual([DOCUMENT_SERVER]);
    expect(urlsFor('/path-level-empty-operation')).toEqual([PATH_SERVER]);

  });

  it('renders like a document without servers when no server has a url', async () => {
    const { items, store } = await processOpenApiDocument({
      type: 'openapi',
      document: {
        ...documentWithInvalidServers,
        servers: INVALID_SERVERS,
        paths: { '/operation-level': { get: operation('operationLevel', INVALID_SERVERS) } },
      } as unknown as OpenAPIDefinition,
      basePath: '/api',
      options,
    });

    expect(collectServersPanels(items)).toEqual([]);
    expect(store.servers).toBeUndefined();
    const node = codeSampleNodeForPath(items, '/operation-level');
    expect(node).toBeDefined();
    expect(node?.servers).toBeUndefined();
  });
});

describe('server variables that are not objects', () => {
  it('are dropped from the environment store, so seeding the environments does not throw', async () => {
    const { store } = await processOpenApiDocument({
      type: 'openapi',
      document: {
        openapi: '3.1.0',
        info: { title: 'Museum', version: '1' },
        servers: [
          { url: 'https://{host}:{port}', variables: { host: null, port: { default: '443' } } },
        ],
        paths: {},
      } as unknown as OpenAPIDefinition,
      basePath: '/api',
      options,
    });

    expect(store.servers?.[0]?.variables).toEqual({ port: { default: '443' } });
    expect(buildServerEnvValues(store.servers ?? [])).toEqual({
      'https://{host}:{port}': { server: 'https://{host}:{port}', port: '443' },
    });
  });
});
