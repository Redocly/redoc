import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../../types/content.js';

import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { itemStoreFieldAtom } from '../../../../jotai/itemStore.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';
import { nodeTypes } from '../../../../types/common.js';
import { CallbacksSection } from '../CallbacksSection.js';

const ITEM_ID = 'other/createjob';
const CALLBACK_ID = 'jobCompleted/post';
const CALLBACK_SCOPE = `${ITEM_ID}/callbacks/jobcompleted/post`;
const LEGACY_SCOPE = `${ITEM_ID}/jobcompleted/post`;

function callbackNode(): ItemContentNode {
  return {
    nodeType: nodeTypes.ITEM,
    variant: 'callback',
    callback: {
      httpVerb: 'post',
      pathName: '{$request.body#/callbackUrl}',
      summary: 'Job completed callback',
      callbackName: 'jobCompleted',
      callbackId: CALLBACK_ID,
      contentChildren: [
        {
          nodeType: nodeTypes.ITEM,
          variant: 'body',
          label: 'Body',
          mediaTypes: ['application/json'],
        },
      ],
    },
  } as unknown as ItemContentNode;
}

function renderCallbacksSection(hash: string) {
  // `useUrlHash` reads `window.location.hash` directly rather than via the router.
  window.location.hash = hash;
  const store = createStore();

  const utils = render(
    <MemoryRouter initialEntries={[{ pathname: `/${ITEM_ID}`, hash }]}>
      <JotaiProvider store={store}>
        <MarkdownAdapterProvider adapter={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <CallbacksSection node={callbackNode()} />
          </ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );

  return { ...utils, store };
}

describe('CallbacksSection', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('stays collapsed when the hash targets the parent operation', async () => {
    const { store } = renderCallbacksSection(`#${ITEM_ID}/request/body`);

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'selectedCallback' }))).toBe('');
    });
    expect(screen.queryByText('Callback Request')).not.toBeInTheDocument();
  });

  it.each([
    ['the panel anchor', `#${CALLBACK_SCOPE}`],
    ['a section inside it', `#${CALLBACK_SCOPE}/request/body`],
    ['a field inside it', `#${ITEM_ID}/t=request&cb=jobcompleted/post&path=status`],
    ['a legacy section link', `#${LEGACY_SCOPE}/request/body`],
    ['a legacy field link', `#${ITEM_ID}/t=request&cb=jobcompleted/post&path=status`],
    ['a legacy callback-response link', `#${LEGACY_SCOPE}/callback-response&c=200`],
  ])('expands when the hash targets %s', async (_case, hash) => {
    const { store } = renderCallbacksSection(hash);

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'selectedCallback' }))).toBe(
        CALLBACK_ID,
      );
    });
    expect(await screen.findByText('Callback Request')).toBeInTheDocument();
  });

  it('leaves a same-named callback on another operation alone', async () => {
    const OTHER_ITEM_ID = 'other/createsubscription';
    const store = createStore();
    window.location.hash = `#${CALLBACK_SCOPE}`;

    render(
      <MemoryRouter initialEntries={[{ pathname: `/${ITEM_ID}`, hash: `#${CALLBACK_SCOPE}` }]}>
        <JotaiProvider store={store}>
          <MarkdownAdapterProvider adapter={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={ITEM_ID}>
              <CallbacksSection node={callbackNode()} />
            </ItemIdContext.Provider>
            {/* Same callback id, different operation — both render on one page. */}
            <ItemIdContext.Provider value={OTHER_ITEM_ID}>
              <CallbacksSection node={callbackNode()} />
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'selectedCallback' }))).toBe(
        CALLBACK_ID,
      );
    });
    expect(store.get(itemStoreFieldAtom({ itemId: OTHER_ITEM_ID, key: 'selectedCallback' }))).toBe(
      '',
    );
    expect(screen.getAllByText('Callback Request')).toHaveLength(1);
  });

  it('scopes ids of its content to the callback so they cannot collide with the operation', async () => {
    const { container } = renderCallbacksSection(`#${CALLBACK_SCOPE}`);

    await screen.findByText('Callback Request');

    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
    expect(ids).toContain(`${CALLBACK_SCOPE}/request/body`);
    expect(ids).not.toContain(`${ITEM_ID}/request/body`);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
