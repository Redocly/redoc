import { render, screen } from '@testing-library/react';

import { McpPrompt } from '../McpPrompt.js';
import { withTestProviders, TestMemoryRouter } from '../../../testProviders.js';

const spec = {
  openapi: '3.0.0',
  'x-mcp': {
    prompts: [
      {
        name: 'test-prompt',
        description: 'A test prompt',
        arguments: [
          {
            name: 'arg1',
            description: 'First argument',
            required: true,
            example: 'value1',
          },
        ],
        security: [
          {
            apiKey: [],
          },
        ],
      },
    ],
  },
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

describe('McpPrompt', () => {
  it('should render mcp prompt with arguments', () => {
    render(
      withTestProviders(
        <TestMemoryRouter>
          <McpPrompt name="test-prompt" id="test-prompt" />
        </TestMemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Arguments')).toBeInTheDocument();
    expect(screen.getByText('arg1')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('apiKey')).toBeInTheDocument();
  });

  it('should return null if prompt not found', () => {
    const { container } = render(
      withTestProviders(
        <TestMemoryRouter>
          <McpPrompt name="not-found" id="not-found" />
        </TestMemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(container.firstChild).toBeNull();
  });
});
