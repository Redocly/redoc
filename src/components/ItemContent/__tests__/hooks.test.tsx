import { describe, expect, it, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { HashRouter, MemoryRouter } from 'react-router';

import type { ReactNode } from 'react';
import type { GlobalStoreAtom } from '../../../jotai/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { useKeyFromHash, useResponseSectionDeepLink } from '../hooks.js';

const ITEM_ID = 'pets/get-pet-by-id';

function createGlobalStore(basePath: string = '') {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath,
    }),
  } as GlobalStoreAtom);
  return store;
}

// `useKeyFromHash` reads `window.location.hash` directly (via
// `useSyncExternalStore`) instead of `useLocation()` so that the hook only
// re-renders on hash changes — see `useUrlHash` in `hooks.ts`. That means
// tests must update jsdom's `window.location.hash`, not just the
// MemoryRouter entry.
function makeWrapper(hash: string, itemId: string = ITEM_ID) {
  window.location.hash = hash;
  const store = createGlobalStore();
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[{ pathname: `/openapi/${itemId}`, hash }]}>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>
  );
}

function makeHashRouterWrapper(deepLinkHash: string) {
  window.location.hash = `#/openapi/${ITEM_ID}${deepLinkHash}`;
  const store = createGlobalStore();
  return ({ children }: { children: ReactNode }) => (
    <HashRouter>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={ITEM_ID}>{children}</ItemIdContext.Provider>
      </JotaiProvider>
    </HashRouter>
  );
}

/** With `basePath: '/'` the item id is the absolute route path. */
const ROOT_ITEM_ID = `/${ITEM_ID}`;

function makeRootBasePathWrapper(hash: string) {
  window.location.hash = hash;
  const store = createGlobalStore('/');
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[{ pathname: ROOT_ITEM_ID, hash }]}>
      <JotaiProvider store={store}>
        <ItemIdContext.Provider value={ROOT_ITEM_ID}>{children}</ItemIdContext.Provider>
      </JotaiProvider>
    </MemoryRouter>
  );
}

afterEach(() => {
  window.location.hash = '';
});

const CODES = ['200', '2XX', '404'];

describe('useKeyFromHash', () => {
  it('extracts the response code when the docs are served at the root (basePath "/")', () => {
    const { result } = renderHook(() => useKeyFromHash(ROOT_ITEM_ID, CODES, 'c'), {
      wrapper: makeRootBasePathWrapper(`#${ITEM_ID}/response&c=404/body`),
    });
    expect(result.current).toBe('404');
  });

  it('extracts the response code under a hash router, whose fragment also holds the route', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeHashRouterWrapper(`#${ITEM_ID}/response&c=404/body`),
    });
    expect(result.current).toBe('404');
  });

  it('extracts the response code from a c= deep-link hash for the current item', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeWrapper(`#${ITEM_ID}/response&c=404/body`),
    });
    expect(result.current).toBe('404');
  });

  it('resolves a lowercased hash value back to the canonical response code (e.g. 2XX)', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeWrapper(`#${ITEM_ID}/response&c=2xx/body`),
    });
    expect(result.current).toBe('2XX');
  });

  it('matches the item id case-insensitively', () => {
    const upperItemId = 'Pets/Get-Pet-By-Id';
    const { result } = renderHook(() => useKeyFromHash(upperItemId, CODES, 'c'), {
      wrapper: makeWrapper(`#${upperItemId.toLowerCase()}/response&c=404/body`, upperItemId),
    });
    expect(result.current).toBe('404');
  });

  it('ignores an unknown response code so the section can fall back to its first response', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeWrapper(`#${ITEM_ID}/response&c=418/body`),
    });
    expect(result.current).toBeUndefined();
  });

  it('ignores a hash that targets a different item', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeWrapper('#other/item/response&c=404/body'),
    });
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the hash has no c= param', () => {
    const { result } = renderHook(() => useKeyFromHash(ITEM_ID, CODES, 'c'), {
      wrapper: makeWrapper(`#${ITEM_ID}/response`),
    });
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when itemId is missing', () => {
    const { result } = renderHook(() => useKeyFromHash(undefined, CODES, 'c'), {
      wrapper: makeWrapper(`#${ITEM_ID}/response&c=404/body`),
    });
    expect(result.current).toBeUndefined();
  });
});

describe('useResponseSectionDeepLink', () => {
  it('builds a body deep-link for the active response code', () => {
    const { result } = renderHook(() => useResponseSectionDeepLink('404', 'body'), {
      wrapper: makeWrapper(''),
    });
    expect(result.current).toContain('response&c=404/body');
  });

  it('builds a headers deep-link for the active response code', () => {
    const { result } = renderHook(() => useResponseSectionDeepLink('404', 'headers'), {
      wrapper: makeWrapper(''),
    });
    expect(result.current).toContain('response&c=404/headers');
  });

  it('omits the response suffix when there is no active code', () => {
    const { result } = renderHook(() => useResponseSectionDeepLink('', 'body'), {
      wrapper: makeWrapper(''),
    });
    expect(result.current).not.toContain('c=');
  });
});
