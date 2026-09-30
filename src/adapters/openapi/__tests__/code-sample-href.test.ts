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

async function buildItems(document: OpenAPIDefinition): Promise<ApiItem[]> {
  const { items } = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: '/api',
    options,
  });
  return items;
}

type CodeSampleNode = { kind: string; source?: { path?: string; href?: string } };

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

const document = {
  openapi: '3.1.0',
  info: { title: 'Museum', version: '1' },
  tags: [{ name: 'Operations' }],
  paths: {
    '/museum-hours': {
      get: {
        operationId: 'getMuseumHours',
        tags: ['Operations'],
        responses: { '200': { description: 'ok' } },
      },
    },
    '/untagged': {
      get: {
        operationId: 'getUntagged',
        responses: { '200': { description: 'ok' } },
      },
    },
  },
} as unknown as OpenAPIDefinition;

describe('code-sample source href', () => {
  it('carries the operation route slug (relative to base path), not the HTTP path', async () => {
    const items = await buildItems(document);
    const node = codeSampleNodeForPath(items, '/museum-hours');

    const operationItem = collectAllItems(items).find((item) =>
      item.link?.endsWith('getmuseumhours'),
    );
    expect(operationItem?.link).toBe('/api/operations/getmuseumhours');
    expect(node?.source?.href).toBe('operations/getmuseumhours');
  });

  it('carries the route slug for untagged operations too', async () => {
    const items = await buildItems(document);
    const node = codeSampleNodeForPath(items, '/untagged');

    const operationItem = collectAllItems(items).find((item) => item.link?.endsWith('getuntagged'));
    expect(operationItem?.link).toBeDefined();
    expect(node?.source?.href).toBe(operationItem?.link?.replace(/^\/api\//, ''));
  });
});
