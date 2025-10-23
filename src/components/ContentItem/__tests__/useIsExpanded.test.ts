import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import type { ContentItemModel } from '../../../models';

import { useIsExpanded } from '../useIsExpanded';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

describe('useIsExpanded', () => {
  const mockRoutingBasePath = '/docs';

  beforeEach(() => {
    mockUseLocation.mockReset();
  });

  it('should return false for non-tag items', () => {
    mockUseLocation.mockReturnValue({ pathname: '/docs/pets', hash: '' });

    const item: ContentItemModel = {
      type: 'operation',
      href: '/pets',
      items: [],
    };

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(false);
  });

  it('should return true when current path matches item href', () => {
    mockUseLocation.mockReturnValue({ pathname: '/docs/pets', hash: '' });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [{ type: 'operation', href: '/pets/get', items: [] } as unknown as ContentItemModel],
    };

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should return true when legacy hash matches item href', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs',
      hash: '#tag/pets',
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
    mockUseLocation.mockReturnValue({ pathname: '/docs/pets/create', hash: '' });

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
    };

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(true);
  });

  it('should handle encoded URLs', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/docs/user%20profile',
      hash: '',
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
    });

    const item: ContentItemModel = {
      type: 'tag',
      href: '/pets',
      items: [{ type: 'operation', href: '/pets/list', items: [] } as unknown as ContentItemModel],
    };

    const { result } = renderHook(() =>
      useIsExpanded({ item, routingBasePath: mockRoutingBasePath }),
    );

    expect(result.current).toBe(false);
  });
});
