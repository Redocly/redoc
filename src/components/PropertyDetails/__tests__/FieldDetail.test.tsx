import { render } from '@testing-library/react';

import { FieldDetail } from '../FieldDetail';

describe('FieldDetail', () => {
  const wrapper = (label: string, value?: string) =>
    render(<FieldDetail label={label} value={value} />);

  it('should render with DefaultValue component', () => {
    const { getByText } = wrapper('Default', 'value');
    expect(getByText('"value"')).toBeInTheDocument();
    expect(getByText('Default')).toBeInTheDocument();
  });

  it('should render with ExampleValue component', () => {
    const { getByText } = wrapper('Example:', 'value');
    expect(getByText('"value"')).toBeInTheDocument();
    expect(getByText('Example:')).toBeInTheDocument();
  });

  it('should render FieldValueLabel in all other cases', () => {
    const { getByText } = wrapper('Deprecated', 'value');
    expect(getByText('"value"')).toBeInTheDocument();
    expect(getByText('Deprecated')).toBeInTheDocument();
  });
});
