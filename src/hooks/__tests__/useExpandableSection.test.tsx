import { describe, expect, it, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { Provider, createStore } from 'jotai';

import type { ReactNode } from 'react';

import { useCollapsibleEntryKey, useRegisterCollapsibleEntry } from '../useExpandableSection.js';
import { ItemIdContext } from '../useDeepLinkSection.js';
import { itemStoreAtom, collapsibleEntrySection } from '../../jotai/itemStore.js';

function renderRegister(itemId: string, sectionKey: string | undefined, isExpanded = false) {
  const store = createStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
    </Provider>
  );
  const view = renderHook(
    ({ expanded }: { expanded: boolean }) =>
      useRegisterCollapsibleEntry(useCollapsibleEntryKey(sectionKey), expanded),
    { wrapper, initialProps: { expanded: isExpanded } },
  );
  const entries = () => store.get(itemStoreAtom(itemId)).collapsibles;
  return { ...view, entries };
}

afterEach(() => {
  cleanup();
});

describe('useRegisterCollapsibleEntry', () => {
  it('registers an entry under the section key on mount', () => {
    const { entries } = renderRegister('item-1', 'return-type');
    const keys = Object.keys(entries());
    expect(keys).toHaveLength(1);
    expect(collapsibleEntrySection(keys[0])).toBe('return-type');
    expect(entries()[keys[0]]).toBe(false);
  });

  it('registers nothing when the section key is undefined', () => {
    const { entries } = renderRegister('item-1', undefined);
    expect(entries()).toEqual({});
  });

  it('removes the entry again when the component unmounts', () => {
    const { entries, unmount } = renderRegister('item-1', 'return-type');
    expect(Object.keys(entries())).toHaveLength(1);

    unmount();

    expect(entries()).toEqual({});
  });

  it('keeps the entry in sync with the expansion state', () => {
    const { entries, rerender } = renderRegister('item-1', 'return-type', false);
    const key = Object.keys(entries())[0];
    expect(entries()[key]).toBe(false);

    rerender({ expanded: true });

    expect(entries()[key]).toBe(true);
  });
});
