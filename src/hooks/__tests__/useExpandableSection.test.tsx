import { describe, expect, it, afterEach } from 'vitest';
import { act, renderHook, cleanup } from '@testing-library/react';
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
  return { ...view, entries, store };
}

const settle = () => act(async () => {});

afterEach(() => {
  cleanup();
});

describe('useRegisterCollapsibleEntry', () => {
  it('registers an entry under the section key once the commit settles', async () => {
    const { entries } = renderRegister('item-1', 'return-type');
    await settle();
    const keys = Object.keys(entries());
    expect(keys).toHaveLength(1);
    expect(collapsibleEntrySection(keys[0])).toBe('return-type');
    expect(entries()[keys[0]]).toBe(false);
  });

  it('registers nothing when the section key is undefined', async () => {
    const { entries } = renderRegister('item-1', undefined);
    await settle();
    expect(entries()).toEqual({});
  });

  it('removes the entry again when the component unmounts', async () => {
    const { entries, unmount } = renderRegister('item-1', 'return-type');
    await settle();
    expect(Object.keys(entries())).toHaveLength(1);

    unmount();
    await settle();

    expect(entries()).toEqual({});
  });

  it('keeps the entry in sync with the expansion state', async () => {
    const { entries, rerender } = renderRegister('item-1', 'return-type', false);
    await settle();
    const key = Object.keys(entries())[0];
    expect(entries()[key]).toBe(false);

    rerender({ expanded: true });
    await settle();

    expect(entries()[key]).toBe(true);
  });

  it('applies the writes of one commit as a single store update', async () => {
    const store = createStore();
    let updates = 0;
    store.sub(itemStoreAtom('item-1'), () => {
      updates += 1;
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>
        <ItemIdContext.Provider value="item-1">{children}</ItemIdContext.Provider>
      </Provider>
    );
    renderHook(
      () => {
        useRegisterCollapsibleEntry(useCollapsibleEntryKey('return-type'), false);
        useRegisterCollapsibleEntry(useCollapsibleEntryKey('return-type'), true);
        useRegisterCollapsibleEntry(useCollapsibleEntryKey('return-type'), false);
      },
      { wrapper },
    );
    await settle();

    expect(Object.keys(store.get(itemStoreAtom('item-1')).collapsibles)).toHaveLength(3);
    expect(updates).toBe(1);
  });

  it('does not write the store when the entry already holds the mirrored value', async () => {
    const { entries, rerender, store } = renderRegister('item-1', 'return-type', false);
    await settle();
    const key = Object.keys(entries())[0];
    store.set(itemStoreAtom('item-1'), { collapsibles: { [key]: true } });
    let updates = 0;
    store.sub(itemStoreAtom('item-1'), () => {
      updates += 1;
    });

    rerender({ expanded: true });
    await settle();

    expect(updates).toBe(0);
  });
});
