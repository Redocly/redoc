import { atom } from 'jotai';

import type { ApiItem, ApiStore } from '../types/store.js';
import type { ApiSpecType } from '../types/common.js';
import type { ApiDocsOptions } from '../types/options.js';

export type GlobalStoreAtom = {
  items: ApiItem[];
  store: ApiStore;
  options: ApiDocsOptions;
  definition?: Record<string, unknown> | string;
  definitionUrl?: string;
};

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

export const globalStoreAtom = atom<GlobalStoreAtom>({
  items: [],
  store: EMPTY_STORE,
  options: {} as ApiDocsOptions,
});

export const globalItemsAtom = atom<ApiItem[]>((get) => get(globalStoreAtom).items);

/** Maps a component-schema name to the route slug of its schema-definition page (if it has one). */
export const schemaDefinitionSlugMapAtom = atom<Record<string, string>>((get) => {
  const map: Record<string, string> = {};

  function walk(items: ApiItem[]) {
    for (const item of items) {
      const name = item.content?.meta?.name;
      if (item.httpVerb === 'schema' && name && item.routeSlug) {
        map[name] = item.routeSlug;
      }
      if ('items' in item && Array.isArray(item.items)) {
        walk(item.items as ApiItem[]);
      }
    }
  }

  walk(get(globalStoreAtom).items);
  return map;
});
export const globalOptionsAtom = atom<ApiDocsOptions>((get) => get(globalStoreAtom).options);
export const specTypeAtom = atom<ApiSpecType>(
  (get) => get(globalStoreAtom).store?.specType ?? get(globalStoreAtom).options.specType,
);
export const routingBasePathAtom = atom<string>((get) => get(globalStoreAtom).options.basePath);

export const storeAtom = atom<ApiStore>((get) => get(globalStoreAtom).store ?? EMPTY_STORE);

export const definitionAtom = atom<Record<string, unknown> | string | undefined>(
  (get) => get(globalStoreAtom).definition,
);

export const definitionUrlAtom = atom<string | undefined>(
  (get) => get(globalStoreAtom).definitionUrl,
);

