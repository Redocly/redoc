import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';

import type { ApiStore } from '../types/store.js';
import type { RawApiDocsOptions } from '../types/options.js';

import { Redoc } from '../Redoc.js';

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

const app = (
  <MemoryRouter>
    <Redoc
      items={[]}
      store={EMPTY_STORE}
      basePath="/"
      options={{ specType: 'openapi' } as RawApiDocsOptions}
    />
  </MemoryRouter>
);

describe('Redoc color mode', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.documentElement.className = '';
    window.localStorage.clear();
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    consoleError.mockRestore();
    document.documentElement.className = '';
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it('hydrates a server-rendered root in the page color mode without a mismatch', async () => {
    const host = document.createElement('div');
    host.innerHTML = renderToString(app);
    document.body.appendChild(host);
    document.documentElement.classList.add('dark');
    host.querySelectorAll('script').forEach((script) => new Function(script.text)());

    const root = await act(async () => hydrateRoot(host, app));

    expect(host.querySelector('.redoc')?.className).toMatch(/\bredoc dark\b/);
    expect(consoleError).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    host.remove();
  });
});
