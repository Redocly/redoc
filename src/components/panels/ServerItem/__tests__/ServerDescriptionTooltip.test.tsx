import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ServerDescriptionTooltip } from '../ServerDescriptionTooltip.js';

vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    'data-testid': testId,
  }: any) => (
    <button
      data-testid={testId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  ),
}));
vi.mock('@redocly/theme/components/Tooltip/Tooltip', () => ({
  Tooltip: ({ children, isOpen }: any) => (
    <div data-testid="tooltip" data-open={isOpen}>
      {children}
    </div>
  ),
}));
vi.mock('@redocly/theme/icons/InformationIcon/InformationIcon', () => ({
  InformationIcon: () => null,
}));

afterEach(() => {
  cleanup();
});

it('should render the info button and open the tooltip on mouse enter or focus', () => {
  const { rerender } = render(<ServerDescriptionTooltip description="Some description" />);
  expect(screen.getByTestId('server-item-description-tooltip')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('server-item-description-tooltip'));
  expect(screen.getByTestId('tooltip')).toHaveAttribute('data-open', 'true');

  rerender(<ServerDescriptionTooltip description="Some description" />);
  fireEvent.focus(screen.getByTestId('server-item-description-tooltip'));
  expect(screen.getByTestId('tooltip')).toHaveAttribute('data-open', 'true');
});

it('should close the tooltip on mouse leave or blur', () => {
  const { rerender } = render(<ServerDescriptionTooltip description="Some description" />);

  fireEvent.mouseEnter(screen.getByTestId('server-item-description-tooltip'));
  fireEvent.mouseLeave(screen.getByTestId('server-item-description-tooltip'));
  expect(screen.getByTestId('tooltip')).toHaveAttribute('data-open', 'false');

  rerender(<ServerDescriptionTooltip description="Some description" />);
  fireEvent.focus(screen.getByTestId('server-item-description-tooltip'));
  fireEvent.blur(screen.getByTestId('server-item-description-tooltip'));
  expect(screen.getByTestId('tooltip')).toHaveAttribute('data-open', 'false');
});
