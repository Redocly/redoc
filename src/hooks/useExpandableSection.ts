import { atom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { useCallback, useContext, useEffect, useId, useMemo, useState } from 'react';

import { buildCollapsibleEntryKey, itemStoreAtom } from '../jotai/itemStore.js';
import { globalOptionsAtom } from '../jotai/store.js';
import { ItemIdContext } from './useDeepLinkSection.js';
import { useUrlHashReassert } from './useUrlHashReassert.js';

export function useExpandableSection(key: string | undefined, enabled = true): void {
  const itemId = useContext(ItemIdContext);
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);
  const initialExpanded = schemasExpansionLevel === Infinity ? true : undefined;
  useEffect(() => {
    if (!key || !itemId || !enabled) return;
    setItemState((curr) =>
      key in curr.expandableSections
        ? {}
        : {
            expandableSections: { ...curr.expandableSections, [key]: initialExpanded },
          },
    );
    return () =>
      setItemState((curr) => {
        if (!(key in curr.expandableSections)) return {};
        const next = { ...curr.expandableSections };
        delete next[key];
        return { expandableSections: next };
      });
  }, [key, itemId, enabled, setItemState, initialExpanded]);
}

export function useCollapsibleEntryKey(sectionKey: string | undefined): string | undefined {
  const itemId = useContext(ItemIdContext);
  const instanceId = useId();
  return sectionKey && itemId ? buildCollapsibleEntryKey(sectionKey, instanceId) : undefined;
}

type JotaiStore = ReturnType<typeof useStore>;
type ItemAtom = ReturnType<typeof itemStoreAtom>;
type EntryWrites = Map<string, boolean | null>;

// One store write per item per commit (null removes the entry): each write re-runs every collapsible's selector.
const pendingCollapsibleWrites = new Map<JotaiStore, Map<ItemAtom, EntryWrites>>();

function flushCollapsibleWrites(): void {
  const stores = [...pendingCollapsibleWrites];
  pendingCollapsibleWrites.clear();
  for (const [store, items] of stores) {
    for (const [itemAtom, writes] of items) {
      const next = { ...store.get(itemAtom).collapsibles };
      let changed = false;
      for (const [key, value] of writes) {
        if (value === null) {
          if (key in next) {
            delete next[key];
            changed = true;
          }
        } else if (next[key] !== value) {
          next[key] = value;
          changed = true;
        }
      }
      if (changed) store.set(itemAtom, { collapsibles: next });
    }
  }
}

function queueCollapsibleWrite(
  store: JotaiStore,
  itemAtom: ItemAtom,
  entryKey: string,
  value: boolean | null,
): void {
  if (pendingCollapsibleWrites.size === 0) queueMicrotask(flushCollapsibleWrites);
  const items = pendingCollapsibleWrites.get(store) ?? new Map<ItemAtom, EntryWrites>();
  const writes: EntryWrites = items.get(itemAtom) ?? new Map();
  writes.set(entryKey, value);
  items.set(itemAtom, writes);
  pendingCollapsibleWrites.set(store, items);
}

/** Mirror this collapsible's expansion state into the store so the expand/collapse-all button sees real state. Store writes land in a microtask after the commit. */
export function useRegisterCollapsibleEntry(
  entryKey: string | undefined,
  isExpanded: boolean,
): void {
  const itemId = useContext(ItemIdContext);
  const store = useStore();
  const itemAtom = itemStoreAtom(itemId ?? '');

  useEffect(() => {
    if (!entryKey || !itemId) return;
    return () => queueCollapsibleWrite(store, itemAtom, entryKey, null);
  }, [entryKey, itemId, store, itemAtom]);

  useEffect(() => {
    if (!entryKey || !itemId) return;
    queueCollapsibleWrite(store, itemAtom, entryKey, isExpanded);
  }, [entryKey, itemId, isExpanded, store, itemAtom]);
}

const NO_ENTRY_ATOM = atom<boolean | undefined>(undefined);

/** One collapsible's expansion state, stored under its section so the expand/collapse-all button reads and overwrites it. */
export function useCollapsibleState(
  sectionKey: string | undefined,
  defaultExpanded: boolean,
  isDeepLinkTarget: boolean,
): [boolean, (expanded: boolean) => void] {
  const itemId = useContext(ItemIdContext) ?? '';
  const entryKey = useCollapsibleEntryKey(sectionKey);
  const store = useStore();
  const itemAtom = itemStoreAtom(itemId);
  const fallback = isDeepLinkTarget || defaultExpanded;
  const stored = useAtomValue(
    useMemo(
      () =>
        entryKey && sectionKey
          ? selectAtom(
              itemAtom,
              (s) => s.collapsibles[entryKey] ?? s.expandableSections[sectionKey] ?? fallback,
            )
          : NO_ENTRY_ATOM,
      [itemAtom, entryKey, sectionKey, fallback],
    ),
  );
  const [local, setLocal] = useState<boolean | undefined>(undefined);
  const expanded = (entryKey ? stored : local) ?? fallback;

  useRegisterCollapsibleEntry(entryKey, expanded);

  const setExpanded = useCallback(
    (next: boolean) => {
      if (entryKey) {
        queueCollapsibleWrite(store, itemAtom, entryKey, next);
        flushCollapsibleWrites();
      } else {
        setLocal(next);
      }
    },
    [entryKey, store, itemAtom],
  );

  const reassert = useUrlHashReassert();
  useEffect(() => {
    if (isDeepLinkTarget) setExpanded(true);
  }, [isDeepLinkTarget, setExpanded, reassert]);

  return [expanded, setExpanded];
}
