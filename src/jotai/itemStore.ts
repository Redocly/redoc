import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { atomFamily } from 'jotai-family';

import type { Atom } from 'jotai';

import { keepReadingSectionAnchored } from '../utils/scroll-anchoring.js';

export type ItemStore = {
  activeDiscriminator: Record<string, number>;
  activeOneOf: Record<string, number>;
  activeResponseCode: string;
  activeExampleKey: string;
  activeMessageKey: string;
  selectedCallback: string;
  expandableSections: Record<string, boolean | undefined>;
  collapsibles: Record<string, boolean>;
};

export type ItemStoreKey = keyof ItemStore;

export type ItemStoreFieldParams<K extends ItemStoreKey = ItemStoreKey> = {
  itemId: string;
  key: K;
};

const DEFAULT_ITEM_STORE: ItemStore = Object.freeze({
  activeDiscriminator: Object.freeze({}),
  activeOneOf: Object.freeze({}),
  activeResponseCode: '',
  activeExampleKey: '',
  activeMessageKey: '',
  selectedCallback: '',
  expandableSections: Object.freeze({}),
  collapsibles: Object.freeze({}),
});

function getDefaultItemStore(): ItemStore {
  return DEFAULT_ITEM_STORE;
}

const allItemsAtom = atom<Record<string, ItemStore>>({});

type ItemStoreUpdate = Partial<ItemStore> | ((current: ItemStore) => Partial<ItemStore>);

const LAYOUT_SWAP_KEYS: readonly ItemStoreKey[] = [
  'activeResponseCode',
  'activeMessageKey',
  'activeExampleKey',
  'activeOneOf',
  'activeDiscriminator',
];

export const itemStoreAtom = atomFamily((itemId: string) =>
  atom(
    (get): ItemStore => get(allItemsAtom)[itemId] ?? getDefaultItemStore(),
    (get, set, update: ItemStoreUpdate) => {
      const prev = get(allItemsAtom);
      const current = prev[itemId] ?? getDefaultItemStore();
      const nextPartial = typeof update === 'function' ? update(current) : update;
      if (LAYOUT_SWAP_KEYS.some((key) => key in nextPartial && nextPartial[key] !== current[key])) {
        keepReadingSectionAnchored();
      }
      set(allItemsAtom, {
        ...prev,
        [itemId]: { ...current, ...nextPartial },
      });
    },
  ),
);

const itemStoreKeyAtomFamilyInternal = atomFamily(
  (params: ItemStoreFieldParams): Atom<ItemStore[ItemStoreKey]> =>
    selectAtom(itemStoreAtom(params.itemId), (state) => state[params.key]),
  (a, b) => a.itemId === b.itemId && a.key === b.key,
);

export function itemStoreFieldAtom<K extends ItemStoreKey>(
  params: ItemStoreFieldParams<K>,
): Atom<ItemStore[K]> {
  return itemStoreKeyAtomFamilyInternal(params) as Atom<ItemStore[K]>;
}

export function buildVariantStateKey(
  parentPath: ReadonlyArray<string> | undefined,
  localPart: string,
): string {
  const basePath = parentPath?.length ? parentPath.join('/') : '';
  return basePath ? `${basePath}/${localPart}` : localPart;
}

export type DeepLinkSectionData = {
  /** Route-level item id (slug) */
  id: string;
  /** "request" | "response" for OpenAPI body/param sections */
  t?: string;
  /** "query" | "header" | "path" | "cookie" for OpenAPI parameter location */
  in?: string;
  /** Response status code */
  c?: string;
  /** Callback id */
  cb?: string;
  /** Content-type name (when multiple media types) */
  ct?: string;
  /** When true, nested field deep-links use `path=<field>` only */
  pathOnly?: boolean;
  /** AsyncAPI message key */
  messageKey?: string;
  /** AsyncAPI sub-section: "headers" | "payload" | "send" | "receive" | "parameters" | "messages" */
  asyncSection?: string;
  /** GraphQL type section: "field" | "argument" | "return-type" | "possible-types" | "implements" | "enum-value" */
  graphqlType?: string;
  /** GraphQL parent type name (e.g. "Query", "User") */
  graphqlTypeName?: string;
};

export function activeDiscriminatorSelectAtom(
  itemId: string,
): Atom<ItemStore['activeDiscriminator']> {
  return itemStoreFieldAtom({ itemId, key: 'activeDiscriminator' });
}

export function activeOneOfSelectAtom(itemId: string): Atom<ItemStore['activeOneOf']> {
  return itemStoreFieldAtom({ itemId, key: 'activeOneOf' });
}

const expandableSectionAtomFamily = atomFamily(
  (params: { itemId: string; key: string }) =>
    selectAtom(itemStoreAtom(params.itemId), (s) => s.expandableSections[params.key]),
  (a, b) => a.itemId === b.itemId && a.key === b.key,
);

export function expandableSectionAtom(itemId: string, key: string): Atom<boolean | undefined> {
  return expandableSectionAtomFamily({ itemId, key });
}

// Collapsible entry keys are `<sectionKey>#<instanceId>`, one entry per mounted collapsible.
const COLLAPSIBLE_ENTRY_SEPARATOR = '#';

export function buildCollapsibleEntryKey(sectionKey: string, instanceId: string): string {
  return `${sectionKey}${COLLAPSIBLE_ENTRY_SEPARATOR}${instanceId}`;
}

export function collapsibleEntrySection(entryKey: string): string {
  const index = entryKey.indexOf(COLLAPSIBLE_ENTRY_SEPARATOR);
  return index === -1 ? entryKey : entryKey.slice(0, index);
}

const expandableKeysAtomFamily = atomFamily((itemId: string) =>
  selectAtom(
    itemStoreAtom(itemId),
    (s) => Object.keys(s.expandableSections),
    (a, b) => a.length === b.length && a.every((k, i) => k === b[i]),
  ),
);

export function expandableSectionKeysAtom(itemId: string): Atom<string[]> {
  return expandableKeysAtomFamily(itemId);
}
