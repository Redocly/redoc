import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';

import { McpOverview } from '../McpOverview';
import { withTestProviders } from '../../../testProviders';
import mcpInfo from './fixtures/mcp-info.json';

describe('McpOverview', () => {
  it('should render mcp overview', () => {
    render(
      withTestProviders(
        <MemoryRouter>
          <McpOverview
            mcpInfo={mcpInfo as any}
            mcpServers={[{ url: 'https://api.example.com/mcp' }]}
          />
        </MemoryRouter>,
      ),
    );

    expect(screen.getByText('Protocol version')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();

    expect(screen.getByText('Capabilities')).toBeInTheDocument();
    expect(screen.queryByText('tool_code_interpreter')).not.toBeInTheDocument();
    expect(screen.queryByText('tool_image_generation')).not.toBeInTheDocument();

    expect(screen.getByText('Endpoint')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com/mcp')).toBeInTheDocument();
  });

  it('should render experimental capabilities', () => {
    render(
      withTestProviders(
        <MemoryRouter>
          <McpOverview
            mcpInfo={mcpInfo as any}
            mcpServers={[{ url: 'https://api.example.com/mcp' }]}
          />
        </MemoryRouter>,
      ),
    );

    expect(screen.getByText('Experimental capabilities')).toBeInTheDocument();
    expect(screen.getByText('a:')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('should render capabilities with listChanged and subscribe', () => {
    const mcpInfoWithExtras = {
      ...mcpInfo,
      capabilities: {
        ...mcpInfo.capabilities,
        tools: {
          listChanged: true,
          subscribe: true,
        },
      },
    };
    render(
      withTestProviders(
        <MemoryRouter>
          <McpOverview
            mcpInfo={mcpInfoWithExtras as any}
            mcpServers={[{ url: 'https://api.example.com/mcp' }]}
          />
        </MemoryRouter>,
      ),
    );

    expect(screen.getByText(/tools \(list changed\) \(subscribe\)/)).toBeInTheDocument();
  });
});
