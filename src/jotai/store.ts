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

export const globalOptionsAtom = atom<ApiDocsOptions>({} as ApiDocsOptions);

const contentAtom = atom<Omit<GlobalStoreAtom, 'options'>>({
  items: [],
  store: EMPTY_STORE,
});

export const globalStoreAtom = atom(
  (get): GlobalStoreAtom => ({ ...get(contentAtom), options: get(globalOptionsAtom) }),
  (_get, set, { options, ...content }: GlobalStoreAtom) => {
    set(globalOptionsAtom, options);
    set(contentAtom, content);
  },
);

export const globalItemsAtom = atom<ApiItem[]>((get) => get(contentAtom).items);

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

  walk(get(globalItemsAtom));
  return map;
});
export const specTypeAtom = atom<ApiSpecType>(
  (get) => get(contentAtom).store?.specType ?? get(globalOptionsAtom).specType,
);
/** `undefined` for AsyncAPI and converted Swagger 2.0, so the sampler ignores `$ref` siblings. */
export const samplerOpenapiVersionAtom = atom<string | undefined>((get) => {
  const store = get(contentAtom).store;
  return get(specTypeAtom) === 'openapi' && !store?.convertedFrom ? store?.specVersion : undefined;
});
export const routingBasePathAtom = atom<string>((get) => get(globalOptionsAtom).basePath);

export const storeAtom = atom<ApiStore>((get) => get(contentAtom).store ?? EMPTY_STORE);

export const definitionAtom = atom<Record<string, unknown> | string | undefined>(
  (get) => get(contentAtom).definition,
);

export const definitionUrlAtom = atom<string | undefined>((get) => get(contentAtom).definitionUrl);
