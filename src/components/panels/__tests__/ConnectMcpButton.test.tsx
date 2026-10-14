import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import type { ReactElement, ReactNode } from 'react';
import type { RedocTelemetry } from '../../../telemetry/RedocTelemetry.js';

import { TelemetryContext } from '../../../telemetry/index.js';
import { ConnectMcpButton } from '../ConnectMcpButton.js';

vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));
vi.mock('@redocly/theme/components/SplitButton/SplitButton', () => ({
  SplitButton: ({ button, children }: { button: ReactElement; children: ReactNode }) => (
    <div data-testid="split-button">
      {button}
      {children}
    </div>
  ),
}));
vi.mock('@redocly/theme/components/Dropdown/DropdownMenu', () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <ul>{children}</ul>,
}));
vi.mock('@redocly/theme/components/Dropdown/DropdownMenuItem', () => ({
  DropdownMenuItem: ({ children, onAction }: { children: ReactNode; onAction: () => void }) => (
    <li onClick={onAction}>{children}</li>
  ),
}));
vi.mock('@redocly/theme/components/PageActions/PageActionsMenuItem', () => ({
  PageActionsMenuItem: ({ pageAction }: { pageAction: { title: string } }) => (
    <span>{pageAction.title}</span>
  ),
}));

afterEach(() => cleanup());

function setup(actions: string[]) {
  const telemetry = { sendConnectMcpClickedMessage: vi.fn() };
  const open = vi.spyOn(window, 'open').mockImplementation(() => null);
  render(
    <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
      <ConnectMcpButton actions={actions} mcpUrl="https://example.com/mcp" />
    </TelemetryContext.Provider>,
  );
  return { telemetry, open };
}

describe('ConnectMcpButton (CE)', () => {
  it('renders the first client as the button and the rest in the dropdown', () => {
    const { telemetry, open } = setup(['mcp-cursor', 'mcp-vscode', 'unknown']);

    expect(screen.getByRole('button')).toHaveTextContent('Connect to Cursor');
    fireEvent.click(screen.getByText('Connect to VS Code'));

    expect(telemetry.sendConnectMcpClickedMessage).toHaveBeenCalledWith([
      {
        id: 'connectMcp',
        object: 'button',
        uri: 'urn:redocly:redoc:ui:button:connectMcp',
        option: 'vscode',
      },
    ]);
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/^vscode:mcp\/install\?/), '_blank');
  });

  it('reports the main button click with its client', () => {
    const { telemetry, open } = setup(['mcp-cursor']);

    fireEvent.click(screen.getByRole('button'));

    expect(telemetry.sendConnectMcpClickedMessage.mock.calls[0][0][0]).toMatchObject({
      option: 'cursor',
    });
    expect(open).toHaveBeenCalledWith(
      expect.stringMatching(
        /^cursor:\/\/anysphere\.cursor-deeplink\/mcp\/install\?name=mcp-server/,
      ),
      '_blank',
    );
    expect(screen.queryByRole('list')).toBeNull();
  });
});
