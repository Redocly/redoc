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

  it('moves the selection and focus with the arrow, Home and End keys', () => {
    const { store } = renderTabs();
    const [okTab, notFoundTab, errorTab] = screen.getAllByRole('tab');
    const activeCode = () =>
      store.get(itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' }));

    expect(okTab).toHaveAttribute('aria-selected', 'true');
    expect(okTab).toHaveAttribute('tabindex', '0');
    expect(notFoundTab).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(okTab, { key: 'ArrowRight' });
    expect(activeCode()).toBe('404');
    expect(notFoundTab).toHaveFocus();

    fireEvent.keyDown(notFoundTab, { key: 'End' });
    expect(activeCode()).toBe('500');
    expect(errorTab).toHaveFocus();

    fireEvent.keyDown(errorTab, { key: 'ArrowRight' });
    expect(activeCode()).toBe('200');

    fireEvent.keyDown(okTab, { key: 'ArrowLeft' });
    expect(activeCode()).toBe('500');

    fireEvent.keyDown(errorTab, { key: 'Home' });
    expect(activeCode()).toBe('200');
  });
});
