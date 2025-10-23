import { render } from '@testing-library/react';

import { ResponseHeaders } from '../ResponseHeaders';
import { PropertiesTable } from '../../common';

jest.mock('../../common', () => ({
  PropertiesTable: jest.fn(() => <div data-testid="properties-table" />),
}));

jest.mock('../../PropertyDetails', () => ({
  Field: jest.fn(() => <div data-testid="property-details" />),
}));

describe('ResponseHeaders', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing if headers are not defined', () => {
    const { container } = render(<ResponseHeaders headers={undefined} />);
    expect(container.firstChild).toBeNull();
    expect(PropertiesTable).not.toHaveBeenCalled();
  });

  test('renders nothing if headers array is empty', () => {
    const { container } = render(<ResponseHeaders headers={[]} />);
    expect(container.firstChild).toBeNull();
    expect(PropertiesTable).not.toHaveBeenCalled();
  });
});
