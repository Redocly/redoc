import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import { SECTION_ATTR } from '../../constants/openapi.js';
import { NotFoundPage } from '../NotFoundPage.js';

vi.mock('../../hooks/useNormalizeUrl.js', () => ({
  useNormalizeUrl: (url: string) => `/normalized${url}`,
}));

describe('NotFoundPage', () => {
  it('shows pathname details, normalized backlink and no section attrs', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/missing-route']}>
        <NotFoundPage routingBasePath="/docs" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'No page at this address' }),
    ).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('/missing-route')).toBeInTheDocument();
    expect(
      screen.getByText('It may have been moved or deleted.', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to docs' })).toHaveAttribute(
      'href',
      '/normalized/docs',
    );
    expect(container.querySelector(`[${SECTION_ATTR}]`)).toBeNull();
  });

  it('strips the path prefix from the back link so the portal Link does not apply it twice', () => {
    vi.stubEnv('REDOCLY_PREFIX_PATHS', '/normalized');
    try {
      render(
        <MemoryRouter initialEntries={['/missing-route']}>
          <NotFoundPage routingBasePath="/docs" />
        </MemoryRouter>,
      );

      expect(screen.getByRole('link', { name: 'Back to docs' })).toHaveAttribute('href', '/docs');
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('falls back to root path when routingBasePath is empty', () => {
    render(
      <MemoryRouter initialEntries={['/missing-route']}>
        <NotFoundPage routingBasePath="" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Back to docs' })).toHaveAttribute(
      'href',
      '/normalized/',
    );
  });
});
