import type { Mock } from 'vitest';
import { useAtom } from 'jotai/index';
import { render, screen, fireEvent } from '@testing-library/react';

import { ExpandAllButton } from '../ExpandAllButton.js';
import { useTranslate, useTelemetry } from '../../../hooks/index.js';

// Mock the dependencies
vi.mock('jotai/index', () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

vi.mock('../../../hooks', () => ({
  useTranslate: vi.fn(),
  useTelemetry: vi.fn(), // Add mock for useTelemetry
}));

vi.mock('@redocly/theme', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  MaximizeIcon: () => <span data-testid="maximize-icon" />,
}));

describe('ExpandAllButton', () => {
  const mockSetOperationState = vi.fn();
  const mockTranslate = vi.fn((_key, defaultValue) => defaultValue);
  const mockTelemetrySend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAtom as Mock).mockReturnValue([
      { request: { expandedAll: false }, response: { expandedAll: false } },
      mockSetOperationState,
    ]);
    (useTranslate as Mock).mockReturnValue(mockTranslate);
    (useTelemetry as Mock).mockReturnValue({
      sendExpandCollapseAllClickedMessage: mockTelemetrySend,
    });
  });

  it('renders correctly with initial state', () => {
    render(<ExpandAllButton operationPointer="test" type="request" />);

    expect(screen.getByRole('button')).toHaveTextContent('Expand all');
  });

  it('toggles state when clicked', () => {
    render(<ExpandAllButton operationPointer="test" type="request" />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSetOperationState).toHaveBeenCalledTimes(1);
    expect(mockSetOperationState).toHaveBeenCalledWith(expect.any(Object));

    const updateObject = mockSetOperationState.mock.calls[0][0];
    expect(updateObject).toEqual({ request: { expandedAll: true } });
  });

  it('displays correct text based on expanded state', () => {
    (useAtom as Mock).mockReturnValue([
      { request: { expandedAll: true }, response: { expandedAll: false } },
      mockSetOperationState,
    ]);

    render(<ExpandAllButton operationPointer="test" type="request" />);

    expect(screen.getByRole('button')).toHaveTextContent('Collapse all');
  });

  it('uses translate function for button text', () => {
    render(<ExpandAllButton operationPointer="test" type="request" />);

    expect(mockTranslate).toHaveBeenCalledWith('openapi.expandAll', 'Expand all');
  });
});
