import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../jotai/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { ResponsesDeepLinkAnchor } from '../ResponseDeepLinkAnchor.js';

const ITEM_ID = 'pets/list-pets';

function createGlobalStore() {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  } as GlobalStoreAtom);
  return store;
}

function renderAnchor(store = createGlobalStore()) {
  render(
    <MemoryRouter>
      <JotaiProvider store={store}>
        <ResponsesDeepLinkAnchor
          routingBasePath=""
          relativePath="pets/list-pets"
          itemId={ITEM_ID}
          label="link to Responses"
        />
      </JotaiProvider>
    </MemoryRouter>,
  );
  return { store };
}

describe('ResponsesDeepLinkAnchor', () => {
  it('links to the plain responses section when no response code is active', () => {
    renderAnchor();

    const href = screen.getByRole('link', { name: 'link to Responses' }).getAttribute('href');
    expect(href).toContain('responses');
    expect(href).not.toContain('c=');
  });

  it('appends the active response code to the responses deep link', () => {
    const store = createGlobalStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '404' });
    renderAnchor(store);

    const href = screen.getByRole('link', { name: 'link to Responses' }).getAttribute('href');
    expect(href).toContain('responses&c=404');
  });
});
