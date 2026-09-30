import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'graphql';
import { describe, expect, it } from 'vitest';

import type { RawApiDocsOptions } from '../../../types/options.js';

import { buildItems } from '../../../adapters/build.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { initializeSearch } from '../init.js';

describe('initializeSearch (graphql)', () => {
  it('indexes a GraphQL schema and finds results', { timeout: 60_000 }, async () => {
    const sdl = readFileSync(join(__dirname, '../../../../playground/specs/cafe.graphql'), 'utf8');
    const document = parse(sdl);

    const { items, store } = await buildItems({
      type: 'graphql',
      document,
      options: { specType: 'graphql', metadata: { type: 'graphql' } } as RawApiDocsOptions,
      basePath: '/docs',
      markdownParser: markdocParser,
    } as Parameters<typeof buildItems>[0]);

    expect(items.length).toBeGreaterThan(0);

    const api = await initializeSearch(items, store, '/docs');

    const results = await api.search('order');
    expect(results.length).toBeGreaterThan(0);
  });
});
