import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ServerItem } from '../ServerItem.js';

vi.mock('../../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (_key: string, fallback: string) => fallback,
}));
vi.mock('@redocly/theme/components/Buttons/CopyButton', () => ({ CopyButton: () => null }));
vi.mock('../ServerDescriptionTooltip.js', () => ({
  ServerDescriptionTooltip: () => <span data-testid="description-tooltip" />,
}));
vi.mock('../../../common/ViewNested.js', () => ({
  ViewNested: ({ children, expandText }: any) => (
    <div>
      <button>{expandText}</button>
      {children}
    </div>
  ),
}));
vi.mock('../../../common/Markdown.js', () => ({
  Markdown: ({ source }: any) => <span>{String(source)}</span>,
}));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render the server URL', () => {
  render(<ServerItem server={{ url: 'https://api.example.com' }} />);
  expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
});

it('resolves a relative server URL (mock server) to an absolute URL with the page origin', () => {
  render(<ServerItem server={{ url: '/_mock/api/openapi' }} />);
  expect(screen.getByText(`${window.location.origin}/_mock/api/openapi`)).toBeInTheDocument();
});

it('should show name as primary label, description as fallback, and tooltip only when both are present', () => {
  const { rerender } = render(
    <ServerItem server={{ url: 'https://api.example.com', name: 'Production' }} />,
  );
  expect(screen.getByTestId('server-panel-item-name')).toHaveTextContent('Production');
  expect(screen.queryByTestId('description-tooltip')).toBeNull();

  rerender(
    <ServerItem
      server={{ url: 'https://api.example.com', description: 'Primary server' as never }}
    />,
  );
  expect(screen.getByTestId('server-panel-item-name')).toHaveTextContent('Primary server');

  rerender(
    <ServerItem
      server={{
        url: 'https://api.example.com',
        name: 'Production',
        description: 'Main server' as never,
      }}
    />,
  );
  expect(screen.getByTestId('description-tooltip')).toBeInTheDocument();
});

it('should hide variables section when absent, show names, values, and correct singular/plural label', () => {
  const { rerender } = render(<ServerItem server={{ url: 'https://api.example.com' }} />);
  expect(screen.queryByText(/variable/)).toBeNull();

  rerender(
    <ServerItem
      server={{
        url: 'https://{region}.api.example.com',
        variables: { region: { default: 'us-east', enum: ['us-east', 'eu-west'] } },
      }}
    />,
  );
  expect(screen.getByText('region')).toBeInTheDocument();
  expect(screen.getAllByText('us-east').length).toBeGreaterThan(0);
  expect(screen.getByText('eu-west')).toBeInTheDocument();
  expect(screen.getByText(/Show 1 variable/)).toBeInTheDocument();

  rerender(
    <ServerItem
      server={{
        url: 'https://api.example.com',
        variables: { region: { default: 'us-east' }, version: { default: 'v1' } },
      }}
    />,
  );
  expect(screen.getByText(/Show 2 variables/)).toBeInTheDocument();
});
