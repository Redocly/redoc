import { parse as parseGraphQL } from 'graphql';
import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { ApiItem, ApiStore } from '../../../types/store.js';
import type { RawApiDocsOptions } from '../../../types/options.js';

import { processGraphqlDocument } from '../../../adapters/graphql/index.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../components/markdoc/markdocAdapter.js';
import { StoreProvider } from '../../../hoc/withStoreProvider.js';
import { ItemPage } from '../../../pages/ItemPage.js';
import { deepLinkToId } from '../../../utils/deep-link.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';

const BASE_PATH = '/docs';

const SDL = `
  """Requires a scope to read the field."""
  directive @auth(requires: String!) on FIELD_DEFINITION

  """Root queries."""
  type Query {
    """Fetch a single menu item by ID."""
    menuItem(id: ID!, includeArchived: Boolean): MenuItem
  }

  """Anything sold at the counter."""
  interface Sellable {
    """Price in cents."""
    price: Int!
  }

  """A drink prepared at the barista station."""
  type MenuItem implements Sellable {
    id: ID!
    price: Int!
    """Whether the drink contains caffeine."""
    containsCaffeine: Boolean
    """Reviews left for this item."""
    reviews(first: Int): [String!]
  }

  """What the barista needs to add an item."""
  input AddMenuItemInput {
    """Display name."""
    name: String!
  }

  """Size of the cup."""
  enum CupSize {
    """330 ml."""
    SMALL
    LARGE
  }

  """Anything the search can return."""
  union SearchResult = MenuItem
`;

const RAW_OPTIONS: RawApiDocsOptions = {
  ...normalizeOptions({
    specType: 'graphql',
    downloadUrls: [],
    metadata: {},
    basePath: BASE_PATH,
    info: { title: 'Cafe', description: '', version: '1.0.0' },
  }),
  markdownParser: markdocParser,
};

function buildDocs(): { items: ApiItem[]; store: ApiStore } {
  return processGraphqlDocument({
    type: 'graphql',
    document: parseGraphQL(SDL),
    basePath: BASE_PATH,
    options: RAW_OPTIONS,
  } as Parameters<typeof processGraphqlDocument>[0]);
}

function flatten(items: ApiItem[]): ApiItem[] {
  return items.flatMap((item) => [item, ...flatten((item.items ?? []) as ApiItem[])]);
}

type IndexedField = { name: string; place: string; deepLink: string };

function indexFields(items: ApiItem[], store: ApiStore): IndexedField[] {
  const indexer = new ApiDocsSearchIndexer(BASE_PATH, store.schemaStore);
  for (const item of flatten(items)) {
    indexer.addItem(item);
  }

  return indexer
    .getResult()
    .flatMap((doc) => doc.parameters ?? [])
    .filter((param) => param.deepLink)
    .map((param) => ({
      name: param.name as string,
      place: param.place as string,
      deepLink: param.deepLink as string,
    }));
}

function renderItemAtHash(items: ApiItem[], store: ApiStore, deepLink: string): HTMLElement {
  const [path, hash] = deepLink.split('#');
  const item = flatten(items).find((candidate) => candidate.link?.endsWith(path));
  if (!item?.content) throw new Error(`No item renders ${deepLink}`);

  window.location.hash = `#${hash}`;
  return render(
    <MemoryRouter initialEntries={[{ pathname: item.link, hash: `#${hash}` }]}>
      <StoreProvider apiStore={store} options={RAW_OPTIONS}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemPage content={item.content} itemPath={item.link as string} />
        </MarkdownAdapterProvider>
      </StoreProvider>
    </MemoryRouter>,
  ).container;
}

const { items, store } = buildDocs();
const indexed = indexFields(items, store);

describe('GraphQL search results deep-link to the field', () => {
  afterEach(() => {
    cleanup();
    window.location.hash = '';
  });

  it('gives every indexed GraphQL field a deep link', () => {
    const { items: freshItems, store: freshStore } = buildDocs();
    const indexer = new ApiDocsSearchIndexer(BASE_PATH, freshStore.schemaStore);
    for (const item of flatten(freshItems)) {
      indexer.addItem(item);
    }
    const withoutDeepLink = indexer
      .getResult()
      .flatMap((doc) => doc.parameters ?? [])
      .filter((param) => !param.deepLink)
      .map((param) => `${param.place}:${param.name}`);

    expect(withoutDeepLink).toEqual([]);
  });

  it.each(indexed)('lands on $place $name', ({ deepLink }: IndexedField) => {
    const targetId = deepLinkToId(deepLink);
    const container = renderItemAtHash(items, store, deepLink);

    const rendered = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
    expect(rendered).toContain(targetId);
  });

  it('uses the paths the GraphQL views render', () => {
    const deepLinks = indexed.map((field) => field.deepLink);

    expect(deepLinks).toContain(
      '/objects/menuitem#objects/menuitem/t=field&path=menuitem.containscaffeine',
    );
    expect(deepLinks).toContain(
      '/objects/menuitem#objects/menuitem/t=argument&path=menuitem.reviews.first&arg=first',
    );
    expect(deepLinks).toContain(
      '/queries/menuitem#queries/menuitem/t=argument&path=menuitem.id&arg=id',
    );
  });

  it('indexes return-type fields, enum values, union and interface references', () => {
    const entries = indexed.map((field) => `${field.place}:${field.name}`);

    expect(entries).toContain('return type fields:containsCaffeine');
    expect(entries).toContain('values:SMALL');
    expect(entries).toContain('possible types:MenuItem');
    expect(entries).toContain('implements:Sellable');
    expect(entries).toContain('implemented by:MenuItem');
  });
});
