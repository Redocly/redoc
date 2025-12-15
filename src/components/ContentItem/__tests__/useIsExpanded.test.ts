import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import type { ContentItemModel } from '../../../models/index.js';
import type { MockedFunction } from 'vitest';

import { useIsExpanded } from '../useIsExpanded.js';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

const mockUseLocation = useLocation as MockedFunction<typeof useLocation>;

describe('useIsExpanded', () => {
  const mockRoutingBasePath = '/docs';

  beforeEach(() => {
    mockUseLocation.mockReset();
  });

  it('should return false for non-tag items', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/pets',
      hash: '',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'operation',
      href: '/pets',
      items: [],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true when current path matches item href', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/pets',
      hash: '',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [{ type: 'operation', href: '/pets/get', items: [] } as unknown as ContentItemModel],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true when legacy hash matches item href', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs',
      hash: '#tag/pets',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should handle nested items', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/pets/create',
      hash: '',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [
        {
          type: 'section',
          href: '/pets',
          items: [
            {
              type: 'section',
              href: '/pets/create',
              items: [],
            } as unknown as ContentItemModel,
          ],
        } as unknown as ContentItemModel,
      ],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should handle encoded URLs', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/user%20profile',
      hash: '',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/user profile',
      items: [],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should return false when no matches found', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/users',
      hash: '',
      state: undefined,
      key: '',
      search: '',
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [{ type: 'operation', href: '/pets/list', items: [] } as unknown as ContentItemModel],
    } as unknown as ContentItemModel;

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(false);
  });
});
