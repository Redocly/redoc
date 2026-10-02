import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import type { Location } from 'react-router';
import type * as ReactRouterDom from 'react-router';
import type { ApiItem } from '../../../types/store.js';

import { useLocation } from 'react-router';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { useMenuItems } from '../useMenuItems.js';
import { makeGroupItem, makeLinkItem } from '../../../utils/__tests__/routing.utils.js';

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
  });
});
