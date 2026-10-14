import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { Location } from 'react-router';
import type * as ReactRouterDom from 'react-router';
import type { ReactNode } from 'react';
import type { ApiItem } from '../../../types/store.js';

import { useLocation } from 'react-router';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { routeIndexAtom } from '../../../jotai/routes.js';
import { buildRouteIndex } from '../../../utils/routing.js';
import { useMenuItems } from '../useMenuItems.js';
import {
  makeGroupItem,
  makeLinkItem,
  makeRouteItem,
} from '../../../utils/__tests__/routing.utils.js';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>();
  return { ...actual, useLocation: vi.fn() };
});

vi.mock('../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: vi.fn(),
}));

const mockedUseLocation = vi.mocked(useLocation);
const mockedUseSpecTranslate = vi.mocked(useSpecTranslate);

function setLocation(pathname: string): void {
  mockedUseLocation.mockReturnValue({
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'default',
  } as Location);
}

beforeEach(() => {
  mockedUseLocation.mockReset();
  mockedUseSpecTranslate.mockReset();
  mockedUseSpecTranslate.mockReturnValue(((_key, fallback) =>
    typeof fallback === 'string' ? fallback : (fallback?.defaultValue ?? '')) as ReturnType<
    typeof useSpecTranslate
  >);
  setLocation('/');
});

describe('useMenuItems', () => {
  describe('link normalization', () => {
    it('passes adapter-produced links through unchanged', () => {
      const items: ApiItem[] = [makeLinkItem('/graphql-custom-group', 'GraphQL custom group')];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].link).toBe('/graphql-custom-group');
    });

    it('keeps nested basePath in the link (data layer already produced full paths)', () => {
      const items: ApiItem[] = [makeLinkItem('/docs/openapi/menu/list', 'List')];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].link).toBe('/docs/openapi/menu/list');
    });

    it('collapses pre-existing duplicate slashes in the source link', () => {
      const items: ApiItem[] = [makeLinkItem('//graphql-custom-group', 'GraphQL custom group')];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].link).toBe('/graphql-custom-group');
    });

    it('keeps nested group children unchanged', () => {
      const items: ApiItem[] = [
        makeGroupItem('/docs/openapi/menu', 'Menu', [
          makeLinkItem('/docs/openapi/menu/list', 'List'),
        ]),
      ];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].link).toBe('/docs/openapi/menu');
      expect(result.current[0].items[0].link).toBe('/docs/openapi/menu/list');
    });
  });

  describe('active state', () => {
    it('marks an item active when the current pathname matches its full link', () => {
      setLocation('/docs/openapi/menu/list');
      const items: ApiItem[] = [makeLinkItem('/docs/openapi/menu/list', 'List')];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].active).toBe(true);
    });

    it('marks an item active under a root basePath', () => {
      setLocation('/graphql-custom-group');
      const items: ApiItem[] = [makeLinkItem('/graphql-custom-group', 'GraphQL custom group')];
      const { result } = renderHook(() => useMenuItems({ items }));

      expect(result.current[0].active).toBe(true);
    });

    it('marks the overview active on a directory-index URL', () => {
      setLocation('/docs/index.html');
      const store = createStore();
      store.set(routeIndexAtom, buildRouteIndex([makeRouteItem('/docs')], [], '/docs'));
      const items: ApiItem[] = [makeLinkItem('/docs', 'Overview')];
      const { result } = renderHook(() => useMenuItems({ items }), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current[0].active).toBe(true);
    });

    it('marks an item active under a mixed-case basePath', () => {
      setLocation('/API/pets');
      const store = createStore();
      store.set(routeIndexAtom, buildRouteIndex([makeRouteItem('/api/pets')], [], '/API'));
      const items: ApiItem[] = [makeLinkItem('/API/pets', 'Pets')];
      const { result } = renderHook(() => useMenuItems({ items }), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      expect(result.current[0].active).toBe(true);
    });
  });

  describe('stray percent signs', () => {
    const items = (): ApiItem[] => [
      makeGroupItem('/deals', 'Deals', [makeLinkItem('/deals/50%off', 'Half-price items')]),
    ];

    it('renders for a URL with a malformed escape and marks nothing active', () => {
      setLocation('/menu%zz');
      const { result } = renderHook(() => useMenuItems({ items: items() }));

      expect(result.current[0].items[0].active).toBe(false);
    });

    it('marks an item whose link contains a raw percent sign active', () => {
      setLocation('/deals/50%off');
      const { result } = renderHook(() => useMenuItems({ items: items() }));

      expect(result.current[0].items[0].active).toBe(true);
      expect(result.current[0].hasActiveSubItem).toBe(true);
    });
  });
});
