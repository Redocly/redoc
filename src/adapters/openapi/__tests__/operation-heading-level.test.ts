import { describe, it, expect } from 'vitest';

import type { ApiItem } from '../../../types/store.js';
import type { OpenAPIDefinition, OpenAPITag } from '../../../types/openapi.js';

import { addTagItems } from '../group/item.js';
import { openApiContext } from '../buildContext.js';
import { createBuildContext } from '../build/context.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { createStoreContext, toRecord } from '../../helpers.js';

/** Returns the level of the first HEADER node found in an item's content tree. */
function findHeaderLevel(node: unknown): number | undefined {
  if (!node || typeof node !== 'object') return undefined;
  const record = node as { nodeType?: string; level?: number; children?: unknown[] };
  if (record.nodeType === 'header' && typeof record.level === 'number') return record.level;
  for (const child of record.children ?? []) {
    const found = findHeaderLevel(child);
    if (found !== undefined) return found;
  }
  return undefined;
}

describe('operation title heading level', () => {
  const document: OpenAPIDefinition = {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0' },
    tags: [{ name: 'Pets' }] as OpenAPITag[],
    paths: {
      '/pets': {
        get: { operationId: 'listPets', tags: ['Pets'], responses: {} },
      },
      '/health': {
        get: { operationId: 'health', responses: {} },
      },
    },
  };

  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    basePath: '/api',
  });

  function buildItems(): ApiItem[] {
    const context = createBuildContext({
      document,
      options,
      basePath: '/api',
      storeCtx: createStoreContext(toRecord(document)),
    });
    const items: ApiItem[] = [];
    openApiContext.run(context, () => addTagItems(document, items));
    return items;
  }

  it('renders operations nested under a tag with an h3 title (level 3), not h2', () => {
    const items = buildItems();
    const tagGroup = items.find((i) => i.type === 'group' && i.label === 'Pets');
    const operation = (tagGroup?.items as ApiItem[]).find((i) => i.type === 'link');

    expect(findHeaderLevel(operation?.content)).toBe(3);
  });

  it('keeps the operation title at level 2 when it is not under a tag', () => {
    const items = buildItems();
    const untagged = items.find((i) => i.type === 'link' && i.label === 'health');

    expect(findHeaderLevel(untagged?.content)).toBe(2);
  });
});
