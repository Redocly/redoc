import { describe, it, expect } from 'vitest';

import type { ApiItem, ApiItemContent } from '../../../types/store.js';
import type { ItemContentNode } from '../../../types/content.js';

import { nodeTypes, contentType } from '../../../types/common.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';

const SCHEMA_STORE = {
  'components/schemas/Pet': {
    id: 'components/schemas/Pet',
    kind: 'json-schema' as const,
    data: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Pet name' } },
    },
  },
};

const CONTENT: ApiItemContent = {
  contentType: contentType.ITEM,
  children: [
    {
      nodeType: nodeTypes.ITEM,
      variant: 'body',
      schemaId: 'components/schemas/Pet',
    } as ItemContentNode,
  ],
};

const ITEM = { type: 'link', label: 'Test Item', link: '/api/test', content: CONTENT } as ApiItem;

describe('formatDescription option', () => {
  it('overrides description serialization for field rows', () => {
    const indexer = new ApiDocsSearchIndexer(
      '/api',
      SCHEMA_STORE,
      {},
      {
        formatDescription: () => 'FORMATTED',
      },
    );
    indexer.addItem(ITEM);
    const params = indexer.getResult().flatMap((doc) => doc.parameters ?? []);
    expect(params.find((p) => p.name === 'name')?.description).toBe('FORMATTED');
  });

  it('defaults to plain text', () => {
    const indexer = new ApiDocsSearchIndexer('/api', SCHEMA_STORE, {});
    indexer.addItem(ITEM);
    const params = indexer.getResult().flatMap((doc) => doc.parameters ?? []);
    expect(params.find((p) => p.name === 'name')?.description).toBe('Pet name');
  });
});
