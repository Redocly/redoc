import { fireEvent, render, screen } from '@testing-library/react';
import { useAtom } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import { SidebarActions } from '../SidebarActions.js';
import * as useIsMobileModule from '../../../hooks/useIsMobile.js';
import * as useTelemetryModule from '../../../hooks/useTelemetry.js';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));

jest.mock('../../../hooks/useIsMobile.js', () => ({
  useIsMobile: jest.fn(),
}));

jest.mock('../../../hooks/useTelemetry.js', () => ({
  useTelemetry: jest.fn(),
}));

const useAtomMock = useAtom as jest.Mock;
const useIsMobileMock = useIsMobileModule.useIsMobile as jest.Mock;
const useTelemetryMock = useTelemetryModule.useTelemetry as jest.Mock;

describe('SidebarActions', () => {
  const setLayout = jest.fn();
  const setSidebarCollapsed = jest.fn();
  const setIsSidebarOpened = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clean up any dark mode class that might be left from previous tests
    document.documentElement.classList.remove('dark');

    // Set up default mocks
    useIsMobileMock.mockReturnValue(false);
    useTelemetryMock.mockReturnValue({
      sendChangeLayoutButtonClickedMessage: jest.fn(),
    });
  });

  it('should render Redocly logo and attribution', () => {
    useAtomMock
      .mockReturnValueOnce([LayoutVariant.STACKED, setLayout])
      .mockReturnValueOnce([false, setSidebarCollapsed])
      .mockReturnValueOnce([false, setIsSidebarOpened]);

    render(<SidebarActions />);

    expect(screen.getByRole('link', { name: /API docs by Redocly/i })).toBeInTheDocument();
  });

  it('should toggle dark mode when color mode switcher is clicked', () => {
    useAtomMock
      .mockReturnValueOnce([LayoutVariant.STACKED, setLayout])
      .mockReturnValueOnce([false, setSidebarCollapsed])
      .mockReturnValueOnce([false, setIsSidebarOpened]);

    render(<SidebarActions />);

    // Find the color mode switcher button
    const colorModeSwitcher = screen.getByTestId('color-mode-switcher');

    // Initially, html should not have dark class
    expect(document.documentElement).not.toHaveClass('dark');

    fireEvent.click(colorModeSwitcher);

    expect(document.documentElement).toHaveClass('dark');
  });

  it('should call setSidebarCollapsed and setIsSidebarOpened when collapse button is clicked', () => {
    useAtomMock
      .mockReturnValueOnce([LayoutVariant.STACKED, setLayout])
      .mockReturnValueOnce([false, setSidebarCollapsed])
      .mockReturnValueOnce([true, setIsSidebarOpened]);

    render(<SidebarActions />);

    // Find the collapse button: it has either SidePanelCloseIcon or SidePanelOpenIcon
    const buttons = screen.getAllByRole('button');
    const collapseButton = Array.from(buttons).find(
      (btn) =>
        btn.querySelector('[data-component-name="icons/SidePanelCloseIcon/SidePanelCloseIcon"]') ||
        btn.querySelector('[data-component-name="icons/SidePanelOpenIcon/SidePanelOpenIcon"]'),
    );

    fireEvent.click(collapseButton);

    expect(setIsSidebarOpened).toHaveBeenCalledWith(false);
    expect(setSidebarCollapsed).toHaveBeenCalledWith(true);
  });

  it('should call setLayout when view mode button is clicked', () => {
    useAtomMock
      .mockReturnValueOnce([LayoutVariant.STACKED, setLayout])
      .mockReturnValueOnce([false, setSidebarCollapsed])
      .mockReturnValueOnce([false, setIsSidebarOpened]);

    render(<SidebarActions />);

    // Find the view mode button by looking for the view icon container
    const viewModeElement =
      document.querySelector('[data-component-name*="HorizontalViewIcon"]') ||
      document.querySelector('[data-component-name*="VerticalViewIcon"]');
    fireEvent.click(viewModeElement);

    expect(setLayout).toHaveBeenCalledWith(LayoutVariant.THREE_PANEL);
  });

  it('should hide attribution text when sidebar is collapsed', () => {
    useAtomMock
      .mockReturnValueOnce([LayoutVariant.STACKED, setLayout])
      .mockReturnValueOnce([true, setSidebarCollapsed])
      .mockReturnValueOnce([false, setIsSidebarOpened]);

    render(<SidebarActions />);

    expect(screen.queryByText(/API docs by Redocly/i)).not.toBeInTheDocument();
  });
});
