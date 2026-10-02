import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { ContainerNode, HeaderNode } from '../../../types/content.js';

import { nodeTypes } from '../../../types/common.js';
import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { HeaderItem } from '../HeaderItem.js';

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

function renderHeader(
  node: Partial<HeaderNode>,
  {
    path = ITEM_ID,
    store = createGlobalStore(),
    responseCodes,
  }: { path?: string; store?: ReturnType<typeof createStore>; responseCodes?: string[] } = {},
) {
  const parentNode = responseCodes
    ? ({
        nodeType: nodeTypes.CONTAINER,
        children: [
          {
            nodeType: nodeTypes.ITEM,
            variant: 'responses',
            responses: responseCodes.map((code) => ({ code })),
          },
        ],
      } as ContainerNode)
    : undefined;
  const utils = render(
    <MemoryRouter initialEntries={[{ pathname: `/openapi/${ITEM_ID}` }]}>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={ITEM_ID}>
          <HeaderItem node={node as HeaderNode} path={path} parentNode={parentNode} />
        </ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return { ...utils, store };
}

describe('HeaderItem', () => {
  it('renders badges without a position after the title (treated as non-"before")', () => {
    const { container } = renderHeader({
      level: 2,
      label: 'My Operation',
      badges: [{ name: 'BEFORE', position: 'before' }, { name: 'NoPosition' }],
    });

    const text = container.textContent ?? '';
    expect(screen.getByText('BEFORE')).toBeInTheDocument();
    expect(screen.getByText('NoPosition')).toBeInTheDocument();
    expect(text.indexOf('BEFORE')).toBeLessThan(text.indexOf('My Operation'));
    expect(text.indexOf('My Operation')).toBeLessThan(text.indexOf('NoPosition'));
  });

  it('renders a Webhook badge on a level-2 webhook header', () => {
    renderHeader({ level: 2, label: 'My Webhook', isWebhook: true });
    expect(screen.getByText('Webhook')).toBeInTheDocument();
  });

  it('does not render a Webhook badge for a non-webhook header', () => {
    renderHeader({ level: 2, label: 'My Operation', isWebhook: false });
    expect(screen.queryByText('Webhook')).not.toBeInTheDocument();
  });

  it('omits the deep-link anchor for level 1 headers', () => {
    const { container } = renderHeader({
      level: 1,
      label: 'Title',
      deepLinkSuffix: 'request',
    });
    expect(container.querySelector('a[aria-label^="link to "]')).toBeNull();
  });

  it('renders a deep-link anchor for level > 1 headers', () => {
    const { container } = renderHeader({
      level: 2,
      label: 'Request',
      deepLinkSuffix: 'request',
    });
    expect(container.querySelector('a[aria-label="link to Request"]')).not.toBeNull();
  });

  it('uses the responses anchor (carrying the active code) for a responses header', () => {
    const store = createGlobalStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '404' });

    const { container } = renderHeader(
      {
        level: 2,
        label: 'Responses',
        deepLinkSuffix: 'responses',
      },
      { store, responseCodes: ['200', '404'] },
    );

    const href = container.querySelector('a[aria-label="link to Responses"]')?.getAttribute('href');
    expect(href).toContain('responses&c=404');
  });

  it('renders an Expand all button when a matching expandable section has a rendered collapsible', () => {
    const store = createGlobalStore();
    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: { ['t=response&c=200']: undefined },
      collapsibles: { ['t=response&c=200#:r1:']: false },
    });

    const { container } = renderHeader(
      {
        level: 4,
        label: 'Responses',
        deepLinkSuffix: 'responses',
      },
      { store, responseCodes: ['200'] },
    );

    const buttonLabels = Array.from(container.querySelectorAll('button')).map((b) =>
      b.textContent?.trim(),
    );
    expect(buttonLabels).toContain('Expand all');
  });

  it('does not render an Expand all button when no expandable key matches the suffix', () => {
    const store = createGlobalStore();
    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: {
        ['t=request&ct=application/json']: undefined,
      },
    });

    const { container } = renderHeader(
      {
        level: 4,
        label: 'Responses',
        deepLinkSuffix: 'responses',
      },
      { store, responseCodes: ['200'] },
    );

    const buttonLabels = Array.from(container.querySelectorAll('button')).map((b) =>
      b.textContent?.trim(),
    );
    expect(buttonLabels).not.toContain('Expand all');
    expect(buttonLabels).not.toContain('Collapse all');
  });

  it('renders the protocol tag as a sibling before the header wrapper when protocolTag is set', () => {
    const { container } = renderHeader(
      { level: 5, label: 'Publish Ride Request', protocolTag: { label: 'Pub', color: 'send' } },
      { path: '' },
    );

    const tag = screen.getByText('Pub');
    const heading = screen.getByText('Publish Ride Request');
    const tagBlock = container.firstElementChild as HTMLElement;
    const wrapper = container.children[1] as HTMLElement;

    // The protocol tag sits outside the heading wrapper (no shared column).
    expect(tagBlock.contains(tag)).toBe(true);
    expect(tagBlock.contains(heading)).toBe(false);
    expect(wrapper.contains(heading)).toBe(true);
    expect(wrapper.contains(tag)).toBe(false);

    // The tag still precedes the heading in document order.
    expect(tag.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('does not add a protocol-tag group for headers without a protocolTag', () => {
    renderHeader({ level: 2, label: 'Pets' }, { path: '' });

    expect(screen.queryByText('Pub')).toBeNull();
    expect(screen.getByText('Pets')).toBeInTheDocument();
  });
});
