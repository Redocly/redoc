import { useAtomValue, useSetAtom } from 'jotai';
import { useContext, useEffect, useId } from 'react';

import {
  buildCollapsibleEntryKey,
  expandableSectionAtom,
  itemStoreAtom,
} from '../jotai/itemStore.js';
import { globalOptionsAtom } from '../jotai/store.js';
import { ItemIdContext } from './useDeepLinkSection.js';

export function useExpandableSection(key: string | undefined, enabled = true): boolean | undefined {
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

  return useAtomValue(expandableSectionAtom(itemId ?? '', key ?? ''));
}

export function useCollapsibleEntryKey(sectionKey: string | undefined): string | undefined {
  const itemId = useContext(ItemIdContext);
  const instanceId = useId();
  return sectionKey && itemId ? buildCollapsibleEntryKey(sectionKey, instanceId) : undefined;
}

/** Mirror this collapsible's expansion state into the store so the expand/collapse-all button sees real state. */
export function useRegisterCollapsibleEntry(
  entryKey: string | undefined,
  isExpanded: boolean,
): void {
  const itemId = useContext(ItemIdContext);
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));

  useEffect(() => {
    if (!entryKey || !itemId) return;
    return () =>
      setItemState((curr) => {
        const next = { ...curr.collapsibles };
        delete next[entryKey];
        return { collapsibles: next };
      });
  }, [entryKey, itemId, setItemState]);

  useEffect(() => {
    if (!entryKey || !itemId) return;
    setItemState((curr) =>
      curr.collapsibles[entryKey] === isExpanded
        ? {}
        : { collapsibles: { ...curr.collapsibles, [entryKey]: isExpanded } },
    );
  }, [entryKey, itemId, isExpanded, setItemState]);
}
