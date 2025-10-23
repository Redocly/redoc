import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';

import { McpTool } from '../McpTool';
import { withTestProviders } from '../../../testProviders';
import mcpData from './fixtures/mcp-tools.json';

const spec = {
  openapi: '3.0.0',
  'x-mcp': mcpData,
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
  },
};

describe('McpTool', () => {
  it('should render mcp tool with input and output schema', () => {
    render(
      withTestProviders(
        <MemoryRouter>
          <McpTool toolName="test-tool" id="test-tool" />
        </MemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Input schema')).toBeInTheDocument();
    expect(screen.getByText('inputProperty')).toBeInTheDocument();
    expect(screen.getByText('Output schema')).toBeInTheDocument();
    expect(screen.getByText('outputProperty')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('apiKey')).toBeInTheDocument();
  });

  it('should render a message if tool not found', () => {
    render(
      withTestProviders(
        <MemoryRouter>
          <McpTool toolName="not-found" id="not-found" />
        </MemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Tool not found: not-found')).toBeInTheDocument();
  });

  it('should render without output schema', () => {
    const specWithoutOutput = {
      ...spec,
      'x-mcp': {
        ...spec['x-mcp'],
        tools: [
          {
            name: 'test-tool-no-output',
            description: 'A test tool without output schema',
            inputSchema: {
              type: 'object',
              properties: {
                inputProperty: {
                  type: 'string',
                },
              },
            },
          },
        ],
      },
    };
    render(
      withTestProviders(
        <MemoryRouter>
          <McpTool toolName="test-tool-no-output" id="test-tool-no-output" />
        </MemoryRouter>,
        {
          definition: specWithoutOutput as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Input schema')).toBeInTheDocument();
    expect(screen.queryByText('Output schema')).not.toBeInTheDocument();
  });
});
