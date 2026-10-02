import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ItemContentNode } from '../../../../types/content.js';

import { CallbackScopeContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../../jotai/itemStore.js';
import { mediaTypeOverrideAtom } from '../../../../jotai/app.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';
import { ResponsesSection } from '../ResponsesSection.js';

vi.mock('../../../Schema/SchemaView.js', async () => {
  const { useSchemaFieldDeepLink } =
    await import('../../../Schema/hooks/useSchemaFieldDeepLink.js');

  return {
    SchemaView: ({
      schema,
      schemaId,
    }: {
      schema?: { properties?: Record<string, unknown> };
      schemaId?: string;
    }) => {
      const firstProperty = Object.keys(schema?.properties ?? {})[0] ?? (schemaId ? 'payload' : '');
      const propertyDeepLink = useSchemaFieldDeepLink(firstProperty ?? '');
      if (!firstProperty) return null;

      return (
        <a aria-label={`link to ${firstProperty}`} href={propertyDeepLink}>
          {firstProperty}
        </a>
      );
    },
  };
});

const ITEM_ID = 'pets/get-pet-by-id';

function renderResponsesSection(
  hash: string,
  store = createStore(),
  { callbackScope }: { callbackScope?: string } = {},
) {
  // `useKeyFromHash` subscribes to `window.location.hash` directly (not
  // `useLocation`) — set it so jsdom reports the right value.
  window.location.hash = hash;
  const node = {
    responses: [
      {
        code: '200',
      },
      {
        code: '403',
        headers: {
          type: 'object',
          properties: {
            'x-rate-limit': {
              type: 'string',
            },
          },
        },
        mediaType: 'application/json',
        schemaId: '403-response-body',
      },
    ],
  } as ItemContentNode;

  const utils = render(
    <MemoryRouter initialEntries={[{ pathname: `/openapi/${ITEM_ID}`, hash }]}>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={ITEM_ID}>
          <CallbackScopeContext.Provider value={callbackScope}>
            <ResponsesSection node={node} />
          </CallbackScopeContext.Provider>
        </ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );

  return { ...utils, store };
}

describe('ResponsesSection', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('selects active response code from c= deep-link hash', async () => {
    const { store } = renderResponsesSection(`#${ITEM_ID}/response&c=403/body`);

    await waitFor(() => {
      const activeResponseCode = store.get(
        itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }),
      );
      expect(activeResponseCode).toBe('403');
    });
  });

  it('ignores c= deep-link hash from another item and keeps local default', async () => {
    const { store } = renderResponsesSection('#other/item/response&c=403/body');

    await waitFor(() => {
      const activeResponseCode = store.get(
        itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }),
      );
      expect(activeResponseCode).toBe('');
    });
  });

  describe('inside a callback', () => {
    const CALLBACK_ID = 'jobCompleted/post';
    const CALLBACK_HASH = `#${ITEM_ID}/callbacks/jobcompleted/post/response&c=403/body`;

    it('ignores a callback-scoped c= when rendered at the operation level', async () => {
      const { store } = renderResponsesSection(CALLBACK_HASH);

      await waitFor(() => {
        expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
          '',
        );
      });
    });

    it('honours a callback-scoped c= when rendered inside that callback', async () => {
      const { store } = renderResponsesSection(CALLBACK_HASH, createStore(), {
        callbackScope: CALLBACK_ID,
      });

      await waitFor(() => {
        expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
          '403',
        );
      });
    });

    it('ignores an operation-level c= when rendered inside a callback', async () => {
      const { store } = renderResponsesSection(`#${ITEM_ID}/response&c=403/body`, createStore(), {
        callbackScope: CALLBACK_ID,
      });

      await waitFor(() => {
        expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
          '',
        );
      });
    });

    it('scopes section links to the callback and names it in field links', () => {
      renderResponsesSection(CALLBACK_HASH, createStore(), { callbackScope: CALLBACK_ID });

      const hrefs = screen
        .getAllByRole('link', { name: /^link to /i })
        .map((link) => link.getAttribute('href') ?? '');

      expect(hrefs).toEqual(
        expect.arrayContaining([
          expect.stringContaining('callbacks/jobcompleted/post/response&c=403/body'),
          expect.stringContaining('cb=jobcompleted/post'),
        ]),
      );
      // Nothing may address the operation's own namespace — that is what collided.
      expect(hrefs.filter((h) => h.includes(`#${ITEM_ID}/response`))).toEqual([]);
    });
  });

  it('renders all generated response deep-link anchors with active response code', () => {
    renderResponsesSection(`#${ITEM_ID}/response&c=403/headers`);

    const deepLinks = screen.getAllByRole('link', { name: /^link to /i }).map((link) => ({
      label: link.getAttribute('aria-label'),
      href: link.getAttribute('href'),
    }));

    expect(deepLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'link to Headers',
          href: expect.stringContaining('response&c=403/headers'),
        }),
        expect.objectContaining({
          label: 'link to Body',
          href: expect.stringContaining('response&c=403/body'),
        }),
      ]),
    );

    const schemaPropertyLink = deepLinks.find((link) => link.label === 'link to x-rate-limit');
    expect(schemaPropertyLink?.href).toContain('response&c=403');
    expect(schemaPropertyLink?.href).toContain('path=x-rate-limit');

    const bodySchemaPropertyLink = deepLinks.find((link) => link.label === 'link to payload');
    expect(bodySchemaPropertyLink?.href).toContain('response&c=403');
    expect(bodySchemaPropertyLink?.href).toContain('path=payload');

    expect(deepLinks).toHaveLength(4);
  });

  it('renders the deep-linked code in the first commit even when another code is stored (scroll anchoring)', () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '200' });
    renderResponsesSection(`#${ITEM_ID}/response&c=403/headers`, store);

    const headersLink = screen.getByRole('link', { name: 'link to Headers' });
    expect(headersLink.getAttribute('href')).toContain('response&c=403/headers');
  });

  it('syncs an already-stored code to a differing deep-link code', async () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '200' });
    renderResponsesSection(`#${ITEM_ID}/response&c=403/body`, store);

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
        '403',
      );
    });
  });

  it('falls back to the default empty response and does not persist an unknown deep-link code', async () => {
    const { store } = renderResponsesSection(`#${ITEM_ID}/response&c=418/body`);

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
        '',
      );
    });
  });

  it('applies the ct= media type only while the section is mounted', async () => {
    const { store, unmount } = renderResponsesSection(
      `#${ITEM_ID}/response&c=403&ct=application/json`,
    );
    await waitFor(() => expect(store.get(mediaTypeOverrideAtom)).toBe('application/json'));

    unmount();

    // Another operation must not inherit the deep link's media type.
    expect(store.get(mediaTypeOverrideAtom)).toBeUndefined();
  });

  it('leaves an override written by something else alone when unmounting', async () => {
    const { store, unmount } = renderResponsesSection(
      `#${ITEM_ID}/response&c=403&ct=application/json`,
    );
    await waitFor(() => expect(store.get(mediaTypeOverrideAtom)).toBe('application/json'));
    store.set(mediaTypeOverrideAtom, 'text/csv');

    unmount();

    expect(store.get(mediaTypeOverrideAtom)).toBe('text/csv');
  });

  it('keeps the stored code when the hash carries no response code', async () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '403' });
    renderResponsesSection(`#${ITEM_ID}/response`, store);

    await waitFor(() => {
      expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
        '403',
      );
    });
  });

  it('renders the response summary (x-summary) above the description', () => {
    const node = {
      responses: [
        {
          code: '200',
          summary: 'Success summary',
          description: 'Full description body.',
        },
      ],
    } as ItemContentNode;

    render(
      <MemoryRouter initialEntries={[{ pathname: `/openapi/${ITEM_ID}`, hash: '' }]}>
        <JotaiProvider store={createStore()}>
          <MarkdownAdapterProvider value={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={ITEM_ID}>
              <ResponsesSection node={node} />
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Success summary')).toBeInTheDocument();
    expect(screen.getByText('Full description body.')).toBeInTheDocument();
  });
});
