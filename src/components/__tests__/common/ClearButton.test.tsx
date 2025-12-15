import { vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClearButton } from '../../common/ClearButton/index.js';

describe('ClearButton component', () => {
  const handleClear = vi.fn();

  it('render component correctly', () => {
    const { container } = render(<ClearButton handleClear={handleClear} />);

    expect(container).toMatchSnapshot();
  });

  it('trigger `handleClear` func on click', async () => {
    const { getByRole } = render(<ClearButton handleClear={handleClear} />);

    await userEvent.click(getByRole('button'));

    expect(handleClear).toHaveBeenCalled();
  });
});
