import { describe, expect, it } from 'vitest';

import { nodeTypes } from '../../types/common.js';
import { buildItems } from '../build.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';
import { collectAllItems, filterByContentType } from './utils.js';

const DOCUMENT = {
  openapi: '3.1.0',
  info: {
    title: 'Metadata fixture',
    version: '1.0.0',
    description: 'Overview copy that must survive.',
    'x-metadata': { owner: 'platform-team', slack: '#redoc-ce' },
  },
  paths: {},
};

describe('info x-metadata (community edition)', () => {
  it('is not built into the overview content', async () => {
    const result = await buildItems({
      type: 'openapi',
      document: DOCUMENT,
      basePath: 'docs/openapi',
      options: { specType: 'openapi', downloadUrls: [], metadata: {} },
      markdownParser: markdocParser,
    } as Parameters<typeof buildItems>[0]);

    const [overview] = filterByContentType(collectAllItems(result.items), 'overview');
    const serialized = JSON.stringify(overview);

    expect(serialized).toContain('Overview copy that must survive.');
    expect(serialized).not.toContain(nodeTypes.INFO_METADATA);
    expect(serialized).not.toContain('platform-team');
    expect(serialized).not.toContain('#redoc-ce');
  });
});
