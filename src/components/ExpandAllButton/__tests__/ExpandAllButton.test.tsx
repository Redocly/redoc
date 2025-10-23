import { useAtom } from 'jotai/index';
import { render, screen, fireEvent } from '@testing-library/react';

import { ExpandAllButton } from '../ExpandAllButton';
import { useTranslate, useTelemetry } from '../../../hooks';

// Mock the dependencies
jest.mock('jotai/index', () => ({
  useAtom: jest.fn(),
  atom: jest.fn(),
}));

jest.mock('../../../hooks', () => ({
  useTranslate: jest.fn(),
  useTelemetry: jest.fn(), // Add mock for useTelemetry
}));

jest.mock('@redocly/theme', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  MaximizeIcon: () => <span data-testid="maximize-icon" />,
}));

describe('ExpandAllButton', () => {
  const mockSetOperationState = jest.fn();
  const mockTranslate = jest.fn((key, defaultValue) => defaultValue);
  const mockTelemetrySend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAtom as jest.Mock).mockReturnValue([
      { request: { expandedAll: false }, response: { expandedAll: false } },
      mockSetOperationState,
    ]);
    (useTranslate as jest.Mock).mockReturnValue(mockTranslate);
    (useTelemetry as jest.Mock).mockReturnValue({
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
    (useAtom as jest.Mock).mockReturnValue([
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
