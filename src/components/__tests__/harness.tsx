import { render } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import { parse as parseGraphQL } from 'graphql';

import type { ReactElement } from 'react';
import type { createStore as CreateStore } from 'jotai';
import type { OpenAPIDefinition } from '../../types/openapi.js';
import type { ApiItem, ApiStore } from '../../types/store.js';

import { globalStoreAtom } from '../../jotai/store.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../contexts/markdownAdapter.js';
import { ItemIdContext } from '../../hooks/useDeepLinkSection.js';
import { markdocParser } from '../markdoc/markdocParser.js';
import { createMarkdocAdapter } from '../markdoc/markdocAdapter.js';
import { processOpenApiDocument } from '../../adapters/openapi/index.js';
import { processGraphqlDocument } from '../../adapters/graphql/index.js';
import { collectAllItems } from '../../adapters/__tests__/utils.js';

export type Fixture = { items: ApiItem[]; store: ApiStore; options: ReturnType<typeof options> };

export function options(specType: 'openapi' | 'graphql', overrides: Record<string, unknown> = {}) {
  return normalizeOptions({
    specType,
    downloadUrls: [],
    metadata: {},
    basePath: '',
    markdownParser: markdocParser,
    ...overrides,
  });
}

export async function openApiFixture(document: OpenAPIDefinition): Promise<Fixture> {
  const opts = options('openapi');
  const result = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: '/',
    options: opts,
  });
  return { items: collectAllItems(result.items), store: result.store, options: opts };
}

export function graphqlFixture(sdl: string, overrides: Record<string, unknown> = {}): Fixture {
  const opts = options('graphql', overrides);
  const result = processGraphqlDocument({
    type: 'graphql',
    document: parseGraphQL(sdl),
    basePath: '/',
    options: opts,
  });
  return { items: collectAllItems(result.items), store: result.store, options: opts };
}

/** Every object under `root` for which `match` is true, in document order. */
export function findNodes<T>(
  root: unknown,
  match: (node: Record<string, unknown>) => boolean,
): T[] {
  const found: T[] = [];
  const seen = new Set<unknown>();
  const walk = (value: unknown): void => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const record = value as Record<string, unknown>;
    if (match(record)) found.push(record as T);
    Object.values(record).forEach(walk);
  };
  walk(root);
  return found;
}

export function renderWithFixture(
  ui: ReactElement,
  fixture: Pick<Fixture, 'items' | 'store' | 'options'>,
  extra: { itemId?: string; store?: ReturnType<typeof CreateStore> } = {},
): ReturnType<typeof render> & { jotaiStore: ReturnType<typeof CreateStore> } {
  const jotaiStore = extra.store ?? createStore();
  jotaiStore.set(globalStoreAtom, {
    items: fixture.items,
    store: fixture.store,
    options: fixture.options,
  });
  const result = render(
    <MemoryRouter>
      <JotaiProvider store={jotaiStore}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={extra.itemId ?? 'test/item'}>{ui}</ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return { ...result, jotaiStore };
}
