import { render, fireEvent, screen } from '@testing-library/react';

import type { DropdownProps } from '../Dropdown/index.js';

import { Dropdown } from '../Dropdown/index.js';

describe('DropdownComponent', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const value = 'option1';

  const onChange = vi.fn();

  const defaultProps: DropdownProps<string> = {
    options,
    value,
    onChange,
    className: 'custom-dropdown',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropdown options correctly', () => {
    const { getByText, getByRole } = render(<Dropdown {...defaultProps} />);

    fireEvent.click(getByRole('button'));

    options.forEach((option) => {
      expect(getByText(option.label, { ignore: 'button' })).toBeInTheDocument();
    });
  });

  it('calls onChange callback when an option is clicked', () => {
    const { getByText, getByRole } = render(<Dropdown {...defaultProps} />);

    fireEvent.click(getByRole('button'));

    fireEvent.click(getByText('Option 2'));

    expect(onChange).toHaveBeenCalledWith(options[1]);
  });

  it('calls onChange callback when Enter key is pressed on an option', () => {
    const { getByText, getByRole } = render(<Dropdown {...defaultProps} />);

    fireEvent.click(getByRole('button'));

    fireEvent.keyDown(getByText('Option 3'), { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(options[2]);
  });

  it('renders title correctly', () => {
    const { getAllByText } = render(<Dropdown {...defaultProps} />);

    expect(getAllByText('Option 1')[0]).toBeInTheDocument();
  });

  it('renders title when there is only one option', () => {
    const singleOption = [{ value: 'option1', label: 'Option 1' }];
    const singleOptionProps: DropdownProps<string> = {
      options: singleOption,
      value: 'option1',
      onChange,
      className: 'custom-dropdown',
    };

    const { getByText } = render(<Dropdown {...singleOptionProps} />);

    expect(getByText('Option 1')).toBeInTheDocument();
  });

  describe('withSearch functionality', () => {
    const searchOptions = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ];

    const searchProps: DropdownProps<string> = {
      options: searchOptions,
      value: 'apple',
      onChange,
      withSearch: true,
    };

    it('renders search input when withSearch is true', () => {
      render(<Dropdown {...searchProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search items');
      expect(searchInput).toBeInTheDocument();
    });

    it('does not render search input when withSearch is false', () => {
      render(<Dropdown {...defaultProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.queryByPlaceholderText('Search items');
      expect(searchInput).not.toBeInTheDocument();
    });

    it('filters options based on search input', () => {
      render(<Dropdown {...searchProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search items');
      fireEvent.change(searchInput, { target: { value: 'an' } });

      expect(screen.getByText('Banana', { ignore: 'button' })).toBeInTheDocument();
      expect(screen.queryByText('Apple', { ignore: 'button' })).not.toBeInTheDocument();
      expect(screen.queryByText('Cherry', { ignore: 'button' })).not.toBeInTheDocument();
    });

    it('filters options case-insensitively', () => {
      render(<Dropdown {...searchProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search items');
      fireEvent.change(searchInput, { target: { value: 'banana' } });

      expect(screen.getByText('Banana', { ignore: 'button' })).toBeInTheDocument();
      expect(screen.queryByText('Apple', { ignore: 'button' })).not.toBeInTheDocument();
    });

    it('shows "No items found" when no options match search', () => {
      render(<Dropdown {...searchProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search items');
      fireEvent.change(searchInput, { target: { value: 'xyz' } });

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.queryByText('Apple', { ignore: 'button' })).not.toBeInTheDocument();
      expect(screen.queryByText('Banana', { ignore: 'button' })).not.toBeInTheDocument();
    });

    it('handles empty search input correctly', () => {
      render(<Dropdown {...searchProps} />);

      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search items');
      fireEvent.change(searchInput, { target: { value: '' } });

      searchOptions.forEach((option) => {
        expect(screen.getByText(option.label, { ignore: 'button' })).toBeInTheDocument();
      });
    });
  });
});
