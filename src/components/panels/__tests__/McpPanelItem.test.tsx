import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { McpNode } from '../../../types/content.js';

import { panelKind } from '../../../types/common.js';
import { McpPanelItem } from '../McpPanelItem.js';

vi.mock('@redocly/theme/core/openapi', () => ({
  useThemeHooks: () => ({
    useTranslate: () => ({ translate: (_key: string, fallback: string) => fallback }),
    useTranslationKeys: () => [],
  }),
}));

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ children, header }: { children: React.ReactNode; header: string }) => (
    <div data-testid="panel" data-header={header}>
      {children}
    </div>
  ),
}));

vi.mock('../ConnectMcpButton.js', () => ({
  ConnectMcpButton: ({ actions, mcpUrl }: { actions: string[]; mcpUrl: string }) => (
    <div data-testid="page-actions" data-mcp-url={mcpUrl}>
      {actions.map((a) => (
        <span key={a}>{a}</span>
      ))}
    </div>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('McpPanelItem', () => {
  it('renders all supported MCP item kinds', () => {
    const node = {
      title: 'MCP',
      children: [
        {
          kind: panelKind.ATTRIBUTE,
          label: 'Protocol',
          value: 'stdio',
        },
        {
          kind: panelKind.TAGS,
          title: 'Capabilities',
          tags: [
            { text: 'Read', color: 'green', icon: 'checkmark' },
            { text: 'Write', color: 'gray' },
          ],
        },
        {
          kind: panelKind.EXTERNAL_LINK,
          title: 'Docs',
          label: 'Read docs',
          url: 'https://example.com/docs',
        },
        {
          kind: panelKind.CONNECT_MCP_BUTTON,
          title: 'Connect',
          mcpUrl: 'http://localhost:3001/mcp',
          actions: ['mcp-cursor'],
        },
      ],
    } as McpNode;

    render(<McpPanelItem node={node} />);

    expect(screen.getByText('Protocol')).toBeInTheDocument();
    expect(screen.getByText('stdio')).toBeInTheDocument();
    expect(screen.getByText('Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('Write')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read docs' })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    );
  });

  it('renders PageActions for connect button with mcpUrl', () => {
    const node = {
      title: 'MCP',
      children: [
        {
          kind: panelKind.CONNECT_MCP_BUTTON,
          title: 'Connect',
          mcpUrl: 'http://localhost:3001/mcp',
          actions: ['mcp-cursor'],
        },
      ],
    } as McpNode;

    render(<McpPanelItem node={node} />);

    const pageActions = screen.getByTestId('page-actions');
    expect(pageActions).toHaveAttribute('data-mcp-url', 'http://localhost:3001/mcp');
    expect(screen.getByText('mcp-cursor')).toBeInTheDocument();
  });
});
