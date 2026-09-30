import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';

import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { ExpandAllButton } from '../ExpandAllButton.js';

const ITEM_ID = 'pets/list-pets';
const KEY = `${ITEM_ID}:response:200`;
const KEY_QUERY = `${ITEM_ID}:request:query`;
const KEY_BODY = `${ITEM_ID}:request:application/json`;
const UNRELATED_KEY = `${ITEM_ID}:response:404`;

function renderButton(
  collapsibles: Record<string, boolean>,
  deepLinkKeys: string[] = [KEY],
  expandableSections: Record<string, boolean | undefined> = {},
) {
  const store = createStore();
  store.set(itemStoreAtom(ITEM_ID), { collapsibles, expandableSections });

  const utils = render(
    <Wrapper store={store}>
      <ExpandAllButton itemId={ITEM_ID} deepLinkKeys={deepLinkKeys} />
    </Wrapper>,
  );
  return { ...utils, store };
}

function readSections(store: ReturnType<typeof createStore>) {
  return store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'expandableSections' }));
}

function readCollapsibles(store: ReturnType<typeof createStore>) {
  return store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'collapsibles' }));
}

function Wrapper({
  store,
  children,
}: {
  store: ReturnType<typeof createStore>;
  children: ReactNode;
}) {
  return <JotaiProvider store={store}>{children}</JotaiProvider>;
}

describe('ExpandAllButton — single key', () => {
  it('renders "Expand all" when no collapsible is expanded', () => {
    renderButton({ [`${KEY}#a`]: false, [`${KEY}#b`]: false });
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /collapse all/i })).not.toBeInTheDocument();
  });

  it('renders "Expand all" when only some collapsibles are expanded', () => {
    renderButton({ [`${KEY}#a`]: true, [`${KEY}#b`]: false });
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
  });

  it('renders "Collapse all" when every rendered collapsible is expanded', () => {
    renderButton({ [`${KEY}#a`]: true, [`${KEY}#b`]: true });
    expect(screen.getByRole('button', { name: /collapse all/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /expand all/i })).not.toBeInTheDocument();
  });

  it('renders "Expand all" when no collapsibles are registered', () => {
    renderButton({});
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
  });

  it('sets the section and every registered collapsible to true on "Expand all"', () => {
    const { store } = renderButton({ [`${KEY}#a`]: false, [`${KEY}#b`]: true });

    fireEvent.click(screen.getByRole('button', { name: /expand all/i }));

    expect(readSections(store)[KEY]).toBe(true);
    expect(readCollapsibles(store)).toEqual({ [`${KEY}#a`]: true, [`${KEY}#b`]: true });
    expect(screen.getByRole('button', { name: /collapse all/i })).toBeInTheDocument();
  });

  it('sets the section and every registered collapsible to false on "Collapse all"', () => {
    const { store } = renderButton({ [`${KEY}#a`]: true, [`${KEY}#b`]: true });

    fireEvent.click(screen.getByRole('button', { name: /collapse all/i }));

    expect(readSections(store)[KEY]).toBe(false);
    expect(readCollapsibles(store)).toEqual({ [`${KEY}#a`]: false, [`${KEY}#b`]: false });
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
  });

  it('re-expands a manually collapsed field even when the section value is already true', () => {
    // Expand-all happened before (section true), then one field was manually collapsed.
    const { store } = renderButton({ [`${KEY}#a`]: false, [`${KEY}#b`]: true }, [KEY], {
      [KEY]: true,
    });

    fireEvent.click(screen.getByRole('button', { name: /expand all/i }));

    expect(readCollapsibles(store)[`${KEY}#a`]).toBe(true);
  });
});

describe('ExpandAllButton — multiple keys', () => {
  it('shows "Expand all" when only some sections are fully expanded', () => {
    renderButton({ [`${KEY_QUERY}#a`]: true, [`${KEY_BODY}#a`]: false }, [KEY_QUERY, KEY_BODY]);
    expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
  });

  it('shows "Collapse all" only when all targeted sections are fully expanded', () => {
    renderButton({ [`${KEY_QUERY}#a`]: true, [`${KEY_BODY}#a`]: true }, [KEY_QUERY, KEY_BODY]);
    expect(screen.getByRole('button', { name: /collapse all/i })).toBeInTheDocument();
  });

  it('flips every targeted section at once and leaves unrelated entries untouched', () => {
    const { store } = renderButton(
      { [`${KEY_QUERY}#a`]: false, [`${KEY_BODY}#a`]: false, [`${UNRELATED_KEY}#a`]: false },
      [KEY_QUERY, KEY_BODY],
    );

    fireEvent.click(screen.getByRole('button', { name: /expand all/i }));

    const sections = readSections(store);
    expect(sections[KEY_QUERY]).toBe(true);
    expect(sections[KEY_BODY]).toBe(true);
    const collapsibles = readCollapsibles(store);
    expect(collapsibles[`${KEY_QUERY}#a`]).toBe(true);
    expect(collapsibles[`${KEY_BODY}#a`]).toBe(true);
    expect(collapsibles[`${UNRELATED_KEY}#a`]).toBe(false);
  });

  it('flips every targeted section to false on multi-key "Collapse all"', () => {
    const { store } = renderButton({ [`${KEY_QUERY}#a`]: true, [`${KEY_BODY}#a`]: true }, [
      KEY_QUERY,
      KEY_BODY,
    ]);
    fireEvent.click(screen.getByRole('button', { name: /collapse all/i }));
    const c = readCollapsibles(store);
    expect(c[`${KEY_QUERY}#a`]).toBe(false);
    expect(c[`${KEY_BODY}#a`]).toBe(false);
  });
});
