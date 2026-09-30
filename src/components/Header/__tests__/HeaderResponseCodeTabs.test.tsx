import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { HeaderResponseCodeTabs } from '../HeaderResponseCodeTabs.js';

const ITEM_ID = 'pets/get-pet-by-id';
const CODES = ['200', '404', '500'];

function renderTabs(store = createStore()) {
  const utils = render(
    <JotaiProvider store={store}>
      <HeaderResponseCodeTabs codes={CODES} itemId={ITEM_ID} firstCode="200" />
    </JotaiProvider>,
  );
  return { ...utils, store };
}

describe('HeaderResponseCodeTabs', () => {
  it('renders one tab per code inside a labelled tablist', () => {
    renderTabs();

    const tablist = screen.getByRole('tablist', { name: 'Response status' });
    expect(tablist).toHaveAttribute('data-response-codes-tablist');

    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(CODES);
  });

  it('writes the clicked code to the item store', () => {
    const { store } = renderTabs();

    fireEvent.click(screen.getByRole('tab', { name: '500' }));

    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
      '500',
    );
  });

  it('keeps the stored code as the source of truth across clicks', () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '404' });
    renderTabs(store);

    fireEvent.click(screen.getByRole('tab', { name: '200' }));

    expect(store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }))).toBe(
      '200',
    );
  });
});
