import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { SecurityScheme } from '../types.js';

import { SecurityFlowDetail } from '../SecurityFlowDetail.js';

vi.mock('@redocly/theme/icons/ChevronRightIcon/ChevronRightIcon', () => ({
  ChevronRightIcon: () => <span data-testid="chevron-right-icon" />,
}));

vi.mock('../../common/Markdown.js', () => ({
  Markdown: ({ source }: { source: unknown }) => (
    <div data-testid="markdown">{JSON.stringify(source)}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

describe('SecurityFlowDetail rendering', () => {
  it('passes scheme.type as the HTTP Authorization Scheme value', () => {
    render(
      <SecurityFlowDetail
        scheme={{ name: 'bearer', type: 'http', bearerFormat: 'JWT' } as SecurityScheme}
      />,
    );
    expect(screen.getByText('HTTP Authorization Scheme')).toBeInTheDocument();
    expect(screen.getByText('http')).toBeInTheDocument();
  });

  it.each([
    ['header', 'Header parameter name:'],
    ['query', 'Query parameter name:'],
    ['cookie', 'Cookie parameter name:'],
  ])('labels an apiKey scheme by its location (%s)', (location, expectedLabel) => {
    render(
      <SecurityFlowDetail
        scheme={
          {
            name: 'api_key',
            type: 'apiKey',
            in: location,
            paramName: 'X-Api-Key',
          } as SecurityScheme
        }
      />,
    );
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    expect(screen.getByText('X-Api-Key')).toBeInTheDocument();
  });

  it('renders the OAuth2 Metadata URL row when oauth2MetadataUrl is set', () => {
    render(
      <SecurityFlowDetail
        scheme={
          {
            name: 'oauth2',
            type: 'oauth2',
            oauth2MetadataUrl: 'https://auth.example.com/.well-known/oauth-authorization-server',
            flows: { clientCredentials: { tokenUrl: 'https://auth.example.com/token' } },
          } as SecurityScheme
        }
      />,
    );

    expect(screen.getByText('OAuth2 Metadata URL:')).toBeInTheDocument();
    const link = screen.getByRole('link', {
      name: 'https://auth.example.com/.well-known/oauth-authorization-server',
    });
    expect(link).toHaveAttribute(
      'href',
      'https://auth.example.com/.well-known/oauth-authorization-server',
    );
  });

  it('renders the Device Authorization URL row when set on the flow', () => {
    render(
      <SecurityFlowDetail
        scheme={
          {
            name: 'oauth2',
            type: 'oauth2',
            flows: {
              deviceAuthorization: {
                deviceAuthorizationUrl: 'https://auth.example.com/device',
                tokenUrl: 'https://auth.example.com/token',
              },
            },
          } as SecurityScheme
        }
      />,
    );
    expect(screen.getByText('Device Authorization URL:')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'https://auth.example.com/device' });
    expect(link).toHaveAttribute('href', 'https://auth.example.com/device');
  });

  it('toggles the optional-scopes section visibility on click', () => {
    render(
      <SecurityFlowDetail
        scheme={
          {
            name: 'oauth2',
            type: 'oauth2',
            flows: {
              clientCredentials: {
                tokenUrl: 'https://auth.example.com/token',
                scopes: { 'read:pets': 'Read pets' },
              },
            },
          } as SecurityScheme
        }
      />,
    );
    const toggle = screen.getByRole('button', { name: /Show optional scopes/ });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Hide optional scopes/ })).toBeInTheDocument();
  });
});
