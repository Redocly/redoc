import { describe, expect, it } from 'vitest';
import { createStore } from 'jotai';

import type { ApiDocsOptions } from '../../types/options.js';

import { globalStoreAtom, specTypeAtom } from '../store.js';

const EMPTY = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

describe('specTypeAtom', () => {
  it('reads the type stamped on the store by buildItems, even when options omit it', () => {
    const store = createStore();
    store.set(globalStoreAtom, {
      items: [],
      store: { ...EMPTY, specType: 'asyncapi' },
      options: {} as ApiDocsOptions,
    });

    expect(store.get(specTypeAtom)).toBe('asyncapi');
  });

  it('falls back to options.specType for stores built without buildItems', () => {
    const store = createStore();
    store.set(globalStoreAtom, {
      items: [],
      store: EMPTY,
      options: { specType: 'graphql' } as ApiDocsOptions,
    });

    expect(store.get(specTypeAtom)).toBe('graphql');
  });
});
