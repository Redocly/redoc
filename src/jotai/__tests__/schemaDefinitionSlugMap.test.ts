import { describe, expect, it } from 'vitest';
import { createStore } from 'jotai';

import type { ApiItem } from '../../types/store.js';
import type { ApiDocsOptions } from '../../types/options.js';

import { globalStoreAtom, schemaDefinitionSlugMapAtom } from '../store.js';

const EMPTY = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

const ITEMS = [
  { httpVerb: 'schema', routeSlug: 'schemas/pet', content: { meta: { name: 'Pet' } } },
] as unknown as ApiItem[];

describe('schemaDefinitionSlugMapAtom', () => {
  it('keeps the same map when the store changes but its items do not', () => {
    const store = createStore();
    const state = {
      items: ITEMS,
      store: EMPTY,
      options: { specType: 'openapi' } as ApiDocsOptions,
    };
    store.set(globalStoreAtom, state);
    const map = store.get(schemaDefinitionSlugMapAtom);

    store.set(globalStoreAtom, { ...state, options: { specType: 'openapi' } as ApiDocsOptions });

    expect(map).toEqual({ Pet: 'schemas/pet' });
    expect(store.get(schemaDefinitionSlugMapAtom)).toBe(map);
  });
});
