import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { createStore, Provider as JotaiProvider } from 'jotai';

import { globalStoreAtom } from '../../../jotai/store.js';
import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { buildGraphqlStoreFromSdl } from '../../../adapters/graphql/buildStoreFromSdl.js';
import { GraphQLTypeViewByName } from '../GraphQLTypeView.js';

const FIELD_COUNT = 150;
const ITEM_ID = 'item';

// Each field has arguments and an object return type, so it renders two toggles.
const SDL = `
  type Child { id: ID }
  type Big {
${Array.from({ length: FIELD_COUNT }, (_, i) => `    f${i}(first: Int): Child`).join('\n')}
  }
`;

function renderBigType() {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: buildGraphqlStoreFromSdl(SDL),
    options: normalizeOptions({
      specType: 'graphql',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  });
  let itemWrites = 0;
  store.sub(itemStoreAtom(ITEM_ID), () => {
    itemWrites += 1;
  });
  const view = render(
    <MemoryRouter>
      <JotaiProvider store={store}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <GraphQLTypeViewByName
              typeName="Big"
              fieldExpandLevel={0}
              sectionKey="graphql-fields"
            />
          </ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return {
    view,
    entries: () => Object.keys(store.get(itemStoreAtom(ITEM_ID)).collapsibles),
    itemWrites: () => itemWrites,
    resetWrites: () => {
      itemWrites = 0;
    },
  };
}

const settle = () => act(async () => {});

afterEach(() => {
  cleanup();
});

// One write per field would re-run every field's store selector on each write: quadratic in field count.
describe('GraphQLFieldView store writes', () => {
  it('registers every field toggle with one store write', async () => {
    const { entries, itemWrites } = renderBigType();
    await settle();

    expect(entries()).toHaveLength(FIELD_COUNT * 2);
    expect(itemWrites()).toBe(1);
  });

  it('removes every field toggle with one store write on unmount', async () => {
    const { view, entries, itemWrites, resetWrites } = renderBigType();
    await settle();
    resetWrites();

    view.unmount();
    await settle();

    expect(entries()).toEqual([]);
    expect(itemWrites()).toBe(1);
  });
});
