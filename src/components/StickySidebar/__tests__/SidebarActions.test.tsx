import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { SidebarActions } from '../SidebarActions.js';

vi.mock('@redocly/theme/components/SidebarActions/SidebarActions', () => ({
  SidebarActions: ({ onChangeViewClick }: { onChangeViewClick: () => void }) => (
    <button data-testid="theme-change-view" onClick={onChangeViewClick}>
      toggle layout
    </button>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('SidebarActions telemetry', () => {
  it('fires sendChangeLayoutClickedMessage when the layout-toggle is clicked', () => {
    const telemetry = { sendChangeLayoutClickedMessage: vi.fn() };

    render(
      <JotaiProvider>
        <TelemetryContext.Provider value={telemetry as never}>
          <SidebarActions />
        </TelemetryContext.Provider>
      </JotaiProvider>,
    );

    fireEvent.click(screen.getByTestId('theme-change-view'));

    expect(telemetry.sendChangeLayoutClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendChangeLayoutClickedMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'changeLayoutButton',
      object: 'button',
    });
  });
});
