import { describe, it, expect } from 'vitest';
import markdoc from '@redocly/markdoc';

import type { ApiItem, ApiItemContent } from '../../../types/store.js';

import { nodeTypes, contentType } from '../../../types/common.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';
import { collected } from './collected.js';

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
    },
  ],
};

const ITEM = { type: 'link', label: 'Test Item', link: '/api/test', content: CONTENT } as ApiItem;

const HEADING_SECTION = '## Details\n\nSection **text**.\n\nSecond paragraph.';

describe('formatDescription option', () => {
  it('overrides description serialization for field rows', () => {
    const indexer = collected(
      new ApiDocsSearchIndexer({
        basePath: '/api',
        store: { schemaStore: SCHEMA_STORE },
        document: {},
        formatDescription: () => 'FORMATTED',
      }),
    );
    indexer.addItem(ITEM);
    const params = indexer.getResult().flatMap((doc) => doc.parameters ?? []);
    expect(params.find((p) => p.name === 'name')?.description).toBe('FORMATTED');
  });

  it('overrides description serialization for description heading rows', () => {
    const indexer = collected(
      new ApiDocsSearchIndexer({ basePath: '/api', formatDescription: () => 'FORMATTED' }),
    );
    indexer.addItem({
      ...ITEM,
      content: {
        contentType: contentType.ITEM,
        children: [{ nodeType: nodeTypes.MARKDOC, content: markdoc.parse(HEADING_SECTION) }],
      },
    });
    const params = indexer.getResult().flatMap((doc) => doc.parameters ?? []);
    expect(params.find((p) => p.name === 'Details')?.description).toBe('FORMATTED FORMATTED');
  });

  it('defaults to plain text', () => {
    const indexer = collected(
      new ApiDocsSearchIndexer({
        basePath: '/api',
        store: { schemaStore: SCHEMA_STORE },
        document: {},
      }),
    );
    indexer.addItem(ITEM);
    const params = indexer.getResult().flatMap((doc) => doc.parameters ?? []);
    expect(params.find((p) => p.name === 'name')?.description).toBe('Pet name');
  });
});
