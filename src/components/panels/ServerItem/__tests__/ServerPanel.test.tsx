import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ServerPanelItem } from '../ServerPanelItem.js';
import { panelKind } from '../../../../types/common.js';

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ header, children }: any) => (
    <div>
      <span data-testid="panel-header">{header}</span>
      {children}
    </div>
  ),
}));
vi.mock('../ServerItem.js', () => ({
  ServerItem: ({ server }: any) => <div data-testid="server-item">{server.url}</div>,
}));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render a ServerItem for each server', () => {
  const { rerender } = render(
    <ServerPanelItem node={{ children: [{ kind: panelKind.SERVERS, servers: [] }] }} />,
  );

  rerender(
    <ServerPanelItem
      node={{
        children: [{ kind: panelKind.SERVERS, servers: [] }],
      }}
    />,
  );

  rerender(
    <ServerPanelItem
      node={{
        children: [
          {
            kind: panelKind.SERVERS,
            servers: [{ url: 'https://api.example.com' }, { url: 'https://staging.example.com' }],
          },
        ],
      }}
    />,
  );
  expect(screen.getAllByTestId('server-item')).toHaveLength(2);
  expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
  expect(screen.getByText('https://staging.example.com')).toBeInTheDocument();
});
