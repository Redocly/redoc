import { render, fireEvent } from '@testing-library/react';

import { Select, SimpleSelect } from '../../common/Select/index.js';

describe('Select component', () => {
  const onChange = vi.fn();
  const options = [
    { idx: 0, title: 'First option', value: 'option1' },
    { idx: 1, title: 'Second option', value: 'option2' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render Select component correctly', () => {
    const { container, getByRole } = render(
      <Select variant="dark" options={options} value={options[0].value} onChange={onChange} />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.change(getByRole('combobox'), { target: { value: 'option2' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('render clearable Select component correctly', () => {
    const { getByRole } = render(
      <Select
        variant="dark"
        options={options}
        value={options[0].value}
        onChange={onChange}
        clearable
      />,
    );

    expect(getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('renders clearable Select without value correctly', () => {
    const { queryByRole } = render(
      <Select variant="dark" options={options} value="" onChange={onChange} clearable />,
    );

    expect(queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('render SimpleSelect dark variant correctly', () => {
    const { container, getByRole } = render(
      <SimpleSelect
        variant="dark"
        options={options}
        value={options[0].value}
        onChange={onChange}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.change(getByRole('combobox'), { target: { value: 'option2' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('render Select with empty init value', () => {
    const { getByRole } = render(
      <Select variant="dark" options={options} value="" onChange={onChange} />,
    );

    expect(getByRole('option', { name: 'First option' })).toBeInTheDocument();

    fireEvent.change(getByRole('combobox'), { target: { value: 'option2' } });
    expect(onChange).toHaveBeenCalled();
  });
});
