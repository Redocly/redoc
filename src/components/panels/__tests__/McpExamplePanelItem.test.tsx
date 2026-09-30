import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { McpExampleNode } from '../../../types/content.js';

import { panelKind } from '../../../types/common.js';
import { McpExamplePanelItem } from '../McpExamplePanelItem.js';

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ children, header }: { children: React.ReactNode; header: string }) => (
    <div data-testid="panel" data-header={header}>
      <div data-testid="panel-header">{header}</div>
      {children}
    </div>
  ),
}));

vi.mock('@redocly/theme/components/Panel/PanelBody', () => ({
  PanelBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@redocly/theme/components/JsonViewer/JsonViewer', () => ({
  JsonViewer: ({ data }: { data: unknown }) => (
    <pre data-testid="json-viewer">{JSON.stringify(data, null, 2)}</pre>
  ),
}));

vi.mock('@redocly/theme/components/CodeBlock/CodeBlock', () => ({
  CodeBlock: ({ source, header }: { source: string; header?: { title?: string } }) => (
    <pre data-testid="code-block">
      {header?.title && <span data-testid="code-block-title">{header.title}</span>}
      {source}
    </pre>
  ),
}));

describe('McpExamplePanelItem', () => {
  it('renders a single example panel with header and data', () => {
    const node: McpExampleNode = {
      children: [
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.inputExample',
          data: { message: 'hello' },
        },
      ],
    };

    render(<McpExamplePanelItem node={node} />);

    expect(screen.getByText('Input example')).toBeInTheDocument();
    expect(screen.getByTestId('json-viewer')).toHaveTextContent('"message": "hello"');
  });

  it('renders multiple example panels', () => {
    const node: McpExampleNode = {
      children: [
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.inputExample',
          data: { a: 1 },
        },
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.outputExample',
          data: { b: 2 },
        },
      ],
    };

    render(<McpExamplePanelItem node={node} />);

    expect(screen.getByText('Input example')).toBeInTheDocument();
    expect(screen.getByText('Output example')).toBeInTheDocument();

    const viewers = screen.getAllByTestId('json-viewer');
    expect(viewers).toHaveLength(2);
  });

  it('renders a code block when language is set', () => {
    const node: McpExampleNode = {
      children: [
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.exampleTitle',
          data: 'Hello, world!',
          language: 'text/plain',
        },
      ],
    };

    render(<McpExamplePanelItem node={node} />);

    expect(screen.getByText('Resource content')).toBeInTheDocument();
    const codeBlock = screen.getByTestId('code-block');
    expect(codeBlock).toHaveTextContent('Hello, world!');
    expect(screen.getByTestId('code-block-title')).toHaveTextContent('text/plain');
    expect(screen.queryByTestId('json-viewer')).not.toBeInTheDocument();
  });
});
