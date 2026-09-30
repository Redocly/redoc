import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';
import type { GlobalStoreAtom } from '../../jotai/store.js';

import { globalStoreAtom } from '../../jotai/store.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { ItemIdContext, useHashItemId } from '../useDeepLinkSection.js';

function makeWrapper(itemId: string, basePath: string) {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {}, basePath }),
  } as GlobalStoreAtom);
  return ({ children }: { children: ReactNode }) => (
    <JotaiProvider store={store}>
      <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
    </JotaiProvider>
  );
}

describe('useHashItemId', () => {
  it('drops the leading slash when the docs are served at the root (basePath "/")', () => {
    const { result } = renderHook(() => useHashItemId(), {
      wrapper: makeWrapper('/pets/get-pet-by-id', '/'),
    });
    expect(result.current).toBe('pets/get-pet-by-id');
  });

  it('strips a configured basePath and lowercases the slug', () => {
    const { result } = renderHook(() => useHashItemId(), {
      wrapper: makeWrapper('/docs/Pets/GetPetById', '/docs'),
    });
    expect(result.current).toBe('pets/getpetbyid');
  });

  it('is empty when no item is in scope', () => {
    const { result } = renderHook(() => useHashItemId(), {
      wrapper: makeWrapper('', '/docs'),
    });
    expect(result.current).toBe('');
  });
});
