import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { act, type ReactElement } from 'react';

import type { ContentItemModel } from '../../../models/types.js';

import { VirtualList } from '../VirtualList.js';
import { TestMemoryRouter } from '../../../testProviders.js';

const mockItems: ContentItemModel[] = [
  { href: '/item1', title: 'Item 1' } as unknown as ContentItemModel,
  { href: '/item2', title: 'Item 2' } as unknown as ContentItemModel,
  { href: '/item3', title: 'Item 3' } as unknown as ContentItemModel,
  { href: '/item4', title: 'Item 4' } as unknown as ContentItemModel,
  { href: '/item5', title: 'Item 5' } as unknown as ContentItemModel,
];

const renderItem = (item: ContentItemModel) => (
  <div key={item.href} data-testid={item.href.replace('/', '')}>
    {typeof (item as any).title === 'string'
      ? String((item as any).title)
      : String((item as any).name)}
  </div>
);

const renderWithRouter = (
  initialPath: string,
  props: {
    items: ContentItemModel[];
    renderItem: (item: ContentItemModel) => ReactElement;
    routingBasePath: string;
  },
) => {
  return render(
    <TestMemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<VirtualList {...props} />} />
      </Routes>
    </TestMemoryRouter>,
  );
};

describe('VirtualList', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render empty list when no items provided', () => {
    renderWithRouter('/', {
      items: [],
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.queryByTestId(/item/)).not.toBeInTheDocument();
  });

  it('should initially render first three items when no active item', () => {
    renderWithRouter('/non-existing', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.getByTestId('item1')).toBeInTheDocument();
    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.getByTestId('item3')).toBeInTheDocument();
    expect(screen.queryByTestId('item4')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item5')).not.toBeInTheDocument();
  });

  it('should render items around active item', () => {
    renderWithRouter('/item3', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.getByTestId('item3')).toBeInTheDocument();
    expect(screen.getByTestId('item4')).toBeInTheDocument();
  });

  it('should handle first item selection', () => {
    renderWithRouter('/item1', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.getByTestId('item1')).toBeInTheDocument();
    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.queryByTestId('item3')).toBeInTheDocument();
  });

  it('should handle last item selection', () => {
    renderWithRouter('/item5', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.queryByTestId('item1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item3')).not.toBeInTheDocument();
    expect(screen.getByTestId('item4')).toBeInTheDocument();
    expect(screen.getByTestId('item5')).toBeInTheDocument();
  });

  it('should eventually render all items after timeout', () => {
    renderWithRouter('/item3', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.getByTestId('item3')).toBeInTheDocument();
    expect(screen.getByTestId('item4')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('item1')).toBeInTheDocument();
    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.getByTestId('item3')).toBeInTheDocument();
    expect(screen.getByTestId('item4')).toBeInTheDocument();
    expect(screen.getByTestId('item5')).toBeInTheDocument();
  });

  it('should handle custom routing base path', () => {
    renderWithRouter('/docs/item1', {
      items: mockItems,
      renderItem,
      routingBasePath: '/docs',
    });

    expect(screen.getByTestId('item1')).toBeInTheDocument();
    expect(screen.getByTestId('item2')).toBeInTheDocument();
    expect(screen.queryByTestId('item3')).toBeInTheDocument();
  });

  it('should not re-render if all items are already visible', () => {
    const { rerender } = renderWithRouter('/item1', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const initialRenderCount = screen.getAllByTestId(/item/).length;

    rerender(
      <TestMemoryRouter initialEntries={['/item3']}>
        <Routes>
          <Route
            path="*"
            element={<VirtualList items={mockItems} renderItem={renderItem} routingBasePath="/" />}
          />
        </Routes>
      </TestMemoryRouter>,
    );

    expect(screen.getAllByTestId(/item/).length).toBe(initialRenderCount);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderWithRouter('/item1', {
      items: mockItems,
      renderItem,
      routingBasePath: '/',
    });

    unmount();

    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
  });
});
