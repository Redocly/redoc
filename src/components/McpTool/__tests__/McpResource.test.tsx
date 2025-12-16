import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { McpResource } from '../McpResource.js';
import { withTestProviders, TestMemoryRouter } from '../../../testProviders.js';

const spec = {
  openapi: '3.0.0',
  'x-mcp': {
    resources: [
      {
        name: 'test-resource',
        uri: 'mcp://test-resource',
        mimeType: 'application/json',
        text: '{"key": "value"}',
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

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
};
Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('McpResource', () => {
  beforeAll(() => {
    mockClipboard.writeText.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render mcp resource with content', () => {
    render(
      withTestProviders(
        <TestMemoryRouter>
          <McpResource name="test-resource" id="test-resource" />
        </TestMemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Resource URI:')).toBeInTheDocument();
    expect(screen.getByText('mcp://test-resource')).toBeInTheDocument();
    expect(screen.getByText('Resource MIME type:')).toBeInTheDocument();
    expect(screen.getAllByText('application/json').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Resource content')).toBeInTheDocument();
    expect(screen.getByText(/"key": "value"/)).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('apiKey')).toBeInTheDocument();
  });

  it('should render a message if resource not found', () => {
    render(
      withTestProviders(
        <TestMemoryRouter>
          <McpResource name="not-found" id="not-found" />
        </TestMemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    expect(screen.getByText('Resource not found: not-found')).toBeInTheDocument();
  });

  it('should copy URI to clipboard when clicked', async () => {
    render(
      withTestProviders(
        <TestMemoryRouter>
          <McpResource name="test-resource" id="test-resource" />
        </TestMemoryRouter>,
        {
          definition: spec as any,
          options: {} as any,
        },
      ),
    );

    const uriElement = screen.getByText('mcp://test-resource');
    fireEvent.click(uriElement);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('mcp://test-resource');
    await waitFor(() => {
      expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
    });
  });
});
