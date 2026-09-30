import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ApiStore } from '../types/store.js';
import type { RawApiDocsOptions } from '../types/options.js';
import type { RawLogo } from '../types/common.js';

import RedoclyApiDocsStandalone from '../RedoclyApiDocsStandalone.js';

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

const API_LOGO = {
  imageUrl: 'https://cdn.test/api-logo.svg',
  href: 'https://api.test',
  altText: 'API logo',
};

const STORE_LOGO = {
  imageUrl: 'https://cdn.test/x-logo.png',
  href: 'https://spec.test',
  altText: 'Spec logo',
};

function renderStandalone(
  options: Partial<RawApiDocsOptions> = {},
  logo?: RawLogo,
  store: ApiStore = EMPTY_STORE,
): HTMLElement {
  const { container } = render(
    <RedoclyApiDocsStandalone
      items={[]}
      store={store}
      basePath="/"
      logo={logo}
      options={{ specType: 'graphql', ...options } as RawApiDocsOptions}
    />,
  );
  return container;
}

afterEach(() => {
  cleanup();
});

describe('standalone sidebar logo', () => {
  it('renders the graphql `apiLogo` option', () => {
    const container = renderStandalone({ apiLogo: API_LOGO });

    const logo = screen.getByTestId('logo');
    expect(logo.querySelector('img')).toHaveAttribute('src', API_LOGO.imageUrl);
    expect(logo.querySelector('img')).toHaveAttribute('alt', API_LOGO.altText);
    expect(container.querySelector('[data-testid="logo"] > a')).toHaveAttribute(
      'href',
      API_LOGO.href,
    );
  });

  it('applies `apiLogo.backgroundColor` to the logo wrapper', () => {
    renderStandalone({ apiLogo: { ...API_LOGO, backgroundColor: 'rgb(255, 0, 0)' } });

    expect(screen.getByTestId('logo')).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });

  it('prefers the host `logo` prop over the `apiLogo` option', () => {
    renderStandalone({ apiLogo: API_LOGO }, { url: 'https://cdn.test/host.svg' });

    expect(screen.getByTestId('logo').querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.test/host.svg',
    );
  });

  it('falls back to `apiLogo` when the host prop has no image url', () => {
    renderStandalone({ apiLogo: API_LOGO }, { href: 'https://host.test' });

    expect(screen.getByTestId('logo').querySelector('img')).toHaveAttribute(
      'src',
      API_LOGO.imageUrl,
    );
  });

  it('renders no logo element when neither source is configured', () => {
    renderStandalone();

    expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
  });

  it('renders an unlinked image when `apiLogo` has no href', () => {
    const container = renderStandalone({ apiLogo: { imageUrl: API_LOGO.imageUrl } });

    expect(screen.getByTestId('logo').querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="logo"] > a')).toBeNull();
  });

  it('renders the OpenAPI logo carried on the store', () => {
    const container = renderStandalone({ specType: 'openapi' }, undefined, {
      ...EMPTY_STORE,
      logo: STORE_LOGO,
    });

    expect(screen.getByTestId('logo').querySelector('img')).toHaveAttribute(
      'src',
      STORE_LOGO.imageUrl,
    );
    expect(container.querySelector('[data-testid="logo"] > a')).toHaveAttribute(
      'href',
      STORE_LOGO.href,
    );
  });

  it('prefers the host `logo` prop over the store logo', () => {
    renderStandalone(
      { specType: 'openapi' },
      { url: 'https://cdn.test/host.svg' },
      {
        ...EMPTY_STORE,
        logo: STORE_LOGO,
      },
    );

    expect(screen.getByTestId('logo').querySelector('img')).toHaveAttribute(
      'src',
      'https://cdn.test/host.svg',
    );
  });
});

describe('standalone layout offset', () => {
  function layoutRoot(container: HTMLElement): HTMLElement | null | undefined {
    return container.querySelector('.menu-content')?.parentElement;
  }

  it('sets a zero navbar offset by default, so the theme navbar default does not apply', () => {
    const container = renderStandalone();

    expect(layoutRoot(container)?.style.getPropertyValue('--navbar-height')).toBe('0px');
  });

  it('sets the configured scrollYOffset as the navbar offset', () => {
    const container = renderStandalone({ scrollYOffset: 40 });

    expect(layoutRoot(container)?.style.getPropertyValue('--navbar-height')).toBe('40px');
  });
});
