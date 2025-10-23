import { render, fireEvent } from '@testing-library/react';

import { Tabs } from '../Tabs';
import { useTabsState } from '../useTabsState';

describe('Tabs', () => {
  const TestComponent = () => {
    const tabs = [
      { key: 'tab1', title: 'Tab 1' },
      { key: 'tab2', title: 'Tab 2' },
    ];

    const { activeTab, handleTabChange } = useTabsState({ tabs });

    return (
      <div>
        <Tabs tabs={tabs} activeTab={tabs[0]} onChange={handleTabChange} />
        <div>{activeTab === tabs[0].key ? 'Content 1' : 'Content 2'}</div>
      </div>
    );
  };

  test('should render tab list and content components', () => {
    const { getByText } = render(<TestComponent />);

    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
    expect(getByText(/Content 1/)).toBeInTheDocument();
  });

  test('should switch active tab when clicking on a Tab', () => {
    const { getByText } = render(<TestComponent />);

    const tab2 = getByText('Tab 2');
    fireEvent.click(tab2);

    expect(getByText(/Content 2/)).toBeInTheDocument();
  });
});
