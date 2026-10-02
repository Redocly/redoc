import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import markdoc from '@markdoc/markdoc';

import type { ApiItem, ApiItemContent } from '../../types/store.js';
import type { ApiDocsOptions } from '../../types/options.js';

import { routeIndexAtom } from '../../jotai/routes.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';
import { extractMarkdownSections } from '../../adapters/utils/markdoc.js';
import { collectRoutesRecursively } from '../../utils/routing.js';
import { makeLinkItem, makeRouteItem } from '../../utils/__tests__/routing.utils.js';
import { useApiDocsRoutes } from '../useApiDocsRoutes.js';

vi.mock('../../utils/routing.js', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const original = await importOriginal<typeof import('../../utils/routing.js')>();
  return { ...original, collectRoutesRecursively: vi.fn() };
});

vi.mock('../useDeferredEffect.js', () => ({
  useDeferredEffect: (effect: () => void, deps: unknown[]) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, deps);
  },
}));

function createWrapper(store: ReturnType<typeof createStore>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe('useApiDocsRoutes', () => {
  beforeEach(() => {
    vi.mocked(collectRoutesRecursively).mockImplementation(({ allRoutes }) => {
      allRoutes.push(makeRouteItem('/'));
      allRoutes.push(makeRouteItem('/pets'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call collectRoutesRecursively with the provided apiItems', () => {
    const apiItems: ApiItem[] = [makeLinkItem('/test', '/test', null)];
    const store = createStore();

    renderHook(() => useApiDocsRoutes(apiItems), { wrapper: createWrapper(store) });

    expect(collectRoutesRecursively).toHaveBeenCalledWith({
      apiItems,
      allRoutes: expect.any(Array),
      tagsWithItems: expect.any(Array),
      allTagsWithItems: expect.any(Array),
      parentTag: null,
    });
  });

  it('keeps adapter-built full paths intact regardless of basePath', () => {
    vi.mocked(collectRoutesRecursively).mockImplementation(({ allRoutes }) => {
      allRoutes.push(makeRouteItem('/docs/pets'));
    });

    const store = createStore();
    const { result } = renderHook(() => useApiDocsRoutes([], '/docs'), {
      wrapper: createWrapper(store),
    });

    expect(result.current.routes[0].path).toBe('/docs/pets');
  });

  it('returns routeIndex synchronously alongside routes (not just via the atom)', () => {
    // Used by EntryPage to group ops under their parent tag — the atom is
    // populated in a useEffect (one tick later), so consumers that need
    // the index immediately read it off the return value instead.
    const store = createStore();
    const { result } = renderHook(() => useApiDocsRoutes([], '/'), {
      wrapper: createWrapper(store),
    });

    expect(result.current.routeIndex).toBeDefined();
    expect(result.current.routeIndex.allRoutes.length).toBeGreaterThan(0);
  });

  it('indexes the section ids of headings the overview renders from partials', () => {
    const overview = markdocParser('{% partial file="notes.md" /%}\n');
    extractMarkdownSections(overview, undefined, '');
    vi.mocked(collectRoutesRecursively).mockImplementation(({ allRoutes }) => {
      allRoutes.push({ ...makeRouteItem('/'), content: overview as unknown as ApiItemContent });
    });
    const store = createStore();
    store.set(globalStoreAtom, {
      ...store.get(globalStoreAtom),
      options: {
        markdocOptions: { partials: { 'notes.md': markdoc.parse('## Locale\n') } },
      } as unknown as ApiDocsOptions,
    });

    const { result } = renderHook(() => useApiDocsRoutes([]), { wrapper: createWrapper(store) });

    expect(result.current.routeIndex.overviewPartialSectionIds).toEqual(
      new Set(['section/locale']),
    );
  });

  it('should populate routeIndex atom after route collection', () => {
    const store = createStore();

    renderHook(() => useApiDocsRoutes([], '/'), { wrapper: createWrapper(store) });

    expect(store.get(routeIndexAtom)?.rootPage?.path).toBe('/');
  });

  it('should update routeIndex when apiItems change', () => {
    const store = createStore();

    const firstItems: ApiItem[] = [makeLinkItem('/first', '/first', null)];
    const secondItems: ApiItem[] = [makeLinkItem('/second', '/second', null)];

    vi.mocked(collectRoutesRecursively).mockImplementation(({ allRoutes, apiItems: items }) => {
      if (items === firstItems) allRoutes.push(makeRouteItem('/first'));
      if (items === secondItems) allRoutes.push(makeRouteItem('/second'));
    });

    const { rerender } = renderHook(({ items }) => useApiDocsRoutes(items), {
      wrapper: createWrapper(store),
      initialProps: { items: firstItems },
    });

    expect(store.get(routeIndexAtom)?.rootPage?.path).toBe('/first');

    rerender({ items: secondItems });

    expect(store.get(routeIndexAtom)?.rootPage?.path).toBe('/second');
  });

  it('should re-collect routes only when apiItems reference changes', () => {
    const items: ApiItem[] = [makeLinkItem('/test', '/test', null)];
    const store = createStore();

    const { rerender } = renderHook(({ i }) => useApiDocsRoutes(i), {
      wrapper: createWrapper(store),
      initialProps: { i: items },
    });

    rerender({ i: items });

    expect(collectRoutesRecursively).toHaveBeenCalledTimes(1);
  });
});
