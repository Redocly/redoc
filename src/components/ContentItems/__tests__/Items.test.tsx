import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Items } from '../Items';

jest.mock('../../ContentItem', () => ({
  ContentItem: ({ children, item }: any) => (
    <div data-testid={`content-item-${item.id}`}>
      {item.title}
      {children}
    </div>
  ),
}));

jest.mock('../VirtualList', () => ({
  VirtualList: ({ items }: any) => (
    <div data-testid="virtual-list">
      {items.map((item: any) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  ),
}));

const mockItems = [
  { id: '1', title: 'Item 1', type: 'group', items: [] },
  { id: '2', title: 'Item 2', type: 'group', items: [] },
];

const mockMixedTypeItems = Array.from({ length: 16 }, (_, i) => ({
  id: `mixed-${i}`,
  title: `Item ${i}`,
  type: i % 2 === 0 ? 'operation' : 'schema',
  items: [],
}));

const mockOperationItems = Array.from({ length: 16 }, (_, i) => ({
  id: `op-${i}`,
  title: `Operation ${i}`,
  type: 'operation',
  items: [],
}));

describe('Items', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('renders null when items array is empty', () => {
    const { container } = renderWithRouter(<Items items={[]} routingBasePath="/docs" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders regular list for less than 10 items', () => {
    renderWithRouter(<Items items={mockItems} routingBasePath="/docs" />);

    expect(screen.getByTestId('content-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-item-2')).toBeInTheDocument();
    expect(screen.queryByTestId('virtual-list')).not.toBeInTheDocument();
  });

  it('renders VirtualList for more than 15 operation items', () => {
    renderWithRouter(<Items items={mockOperationItems} routingBasePath="/docs" />);

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.queryByTestId('content-item-1')).not.toBeInTheDocument();
  });

  it('renders VirtualList for more than 15 mixed operation and schema items', () => {
    renderWithRouter(<Items items={mockMixedTypeItems} routingBasePath="/docs" />);

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.queryByTestId('content-item-mixed-0')).not.toBeInTheDocument();
  });

  it('renders nested items correctly', () => {
    const nestedItems = [
      {
        id: '1',
        title: 'Parent',
        type: 'group',
        items: [{ id: '1-1', title: 'Child', type: 'group', items: [] }],
      },
    ];

    renderWithRouter(<Items items={nestedItems} routingBasePath="/docs" />);

    expect(screen.getByTestId('content-item-1')).toBeInTheDocument();
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
