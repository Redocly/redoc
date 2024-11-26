import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { IMenuItem } from '../..';
import useItemReverseIndex, {
  MenuItemReverseIndexToVirtualIndex,
} from '../Virtualization/useItemReverseIndex';

(global as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useItemReverseIndex', () => {
  let container: HTMLDivElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    React.act(() => root.unmount());
    document.body.removeChild(container);
    container = null as any;
  });

  it('it should maps item based on the id for quick lookup', () => {
    const menuItems: any[] = [
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
      { id: 'item3', name: 'Item 3' },
    ];

    let result: MenuItemReverseIndexToVirtualIndex | undefined;

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = ({ items }: { items: IMenuItem[] }) => {
      const { reverseIndexToVirtualIndex } = useItemReverseIndex(items);
      result = reverseIndexToVirtualIndex; // this is to capture the hook's output for later's assertions
      return null;
    };

    // Render component within act to handle React state updates
    React.act(() => {
      root.render(<TestComponent items={menuItems} />);
    });

    const expectedMapping: MenuItemReverseIndexToVirtualIndex = {
      item1: 0,
      item2: 1,
      item3: 2,
    };

    expect(result).toEqual(expectedMapping);
  });

  // Note: the test below only tests when the items change in quantity.
  // This is because it is very unlikely for an API docs to change in the first-place,
  // so just-in-case, I only allow it to re-render when the items change in quantity.
  it('should update the mapping when menu items change in quantity', () => {
    let result: MenuItemReverseIndexToVirtualIndex | undefined;

    const initialItems: any[] = [
      { id: 'item1', description: 'Item 1' },
      { id: 'item2', description: 'Item 2' },
    ];

    const newItems: any[] = [
      { id: 'newItem1', description: 'New Item 1' },
      { id: 'newItem2', description: 'New Item 2' },
      { id: 'newItem3', description: 'New Item 3' },
    ];

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = ({ items }: { items: IMenuItem[] }) => {
      const { reverseIndexToVirtualIndex } = useItemReverseIndex(items);
      result = reverseIndexToVirtualIndex;
      return null;
    };

    // Initial render
    React.act(() => {
      root.render(<TestComponent items={initialItems} />);
    });

    // Update render with new items
    React.act(() => {
      root.render(<TestComponent items={newItems} />);
    });

    const expectedNewMapping: MenuItemReverseIndexToVirtualIndex = {
      newItem1: 0,
      newItem2: 1,
      newItem3: 2,
    };

    expect(result).toEqual(expectedNewMapping);
  });
});
