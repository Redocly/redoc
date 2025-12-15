import { render } from '@testing-library/react';

import { ResponseHeaders } from '../ResponseHeaders.js';
import { PropertiesTable } from '../../common/index.js';

vi.mock('../../common', () => ({
  PropertiesTable: vi.fn(() => <div data-testid="properties-table" />),
}));

vi.mock('../../PropertyDetails', () => ({
  Field: vi.fn(() => <div data-testid="property-details" />),
}));

describe('ResponseHeaders', () => {
  afterEach(() => {
    vi.clearAllMocks();
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
