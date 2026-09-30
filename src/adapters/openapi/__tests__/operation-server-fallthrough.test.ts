import { describe, it, expect } from 'vitest';

import type { ApiItem, ApiItemContent } from '../../../types/store.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { collectAllItems } from '../../__tests__/utils.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { panelKind } from '../../../types/common.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

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

    // build-code-sample-source.ts — code sample source servers
    expect(node?.source?.servers?.map((s) => s.url)).toEqual([DOCUMENT_SERVER]);
  });
});
