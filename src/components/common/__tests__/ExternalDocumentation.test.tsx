import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ExternalDocumentation } from '../ExternalDocumentation.js';

vi.mock('@redocly/theme/components/Markdown/styles/links', () => ({
  markdownLinksCss: '',
}));

it('should return null when url is absent', () => {
  const { container } = render(<ExternalDocumentation externalDocs={{ url: '' }} />);
  expect(container.firstChild).toBeNull();
});

it('should render a link using the url as both href and label when no description is provided', () => {
  render(<ExternalDocumentation externalDocs={{ url: 'https://docs.example.com' }} />);
  const link = screen.getByRole('link', { name: 'https://docs.example.com' });
  expect(link).toHaveAttribute('href', 'https://docs.example.com');
  expect(link).toHaveAttribute('target', '_blank');
});

it('should use description as link text and aria-label when provided as string or object with raw', () => {
  const { rerender } = render(
    <ExternalDocumentation
      externalDocs={{ url: 'https://docs.example.com', description: 'Learn more' }}
    />,
  );
  expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute(
    'href',
    'https://docs.example.com',
  );

  rerender(
    <ExternalDocumentation
      externalDocs={{ url: 'https://docs.example.com', description: { raw: 'Raw description' } }}
    />,
  );
  expect(screen.getByRole('link', { name: 'Raw description' })).toBeInTheDocument();
});
