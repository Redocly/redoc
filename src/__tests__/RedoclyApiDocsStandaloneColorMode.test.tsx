import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { createStore, Provider } from 'jotai';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';

import type { ApiStore } from '../types/store.js';
import type { RawApiDocsOptions } from '../types/options.js';

import RedoclyApiDocsStandalone from '../RedoclyApiDocsStandalone.js';
import { COLOR_MODE_STORAGE_KEY } from '../jotai/app.js';
import { colorModeAtom } from '../jotai/color-mode.js';
import { prePaintColorModeScript } from '../components/PrePaintColorModeScript.js';
import { getCookie, removeCookie, setCookie } from '../utils/cookies.js';

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

function renderStandalone() {
  return render(
    <RedoclyApiDocsStandalone
      items={[]}
      store={EMPTY_STORE}
      basePath="/"
      options={{ specType: 'openapi' } as RawApiDocsOptions}
    />,
  );
}

function redocRoot(): Element | null {
  return document.querySelector('.redoc');
}

beforeEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-bs-theme');
  document.documentElement.removeAttribute('data-theme');
  removeCookie('redoc.appStore');
  window.sessionStorage.clear();
  window.localStorage.clear();
});

afterEach(async () => {
  cleanup();
  // The published theme's useActiveSectionId leaves a 10ms initial-scan timer
  // running; let it fire while jsdom still exists or it crashes the run.
  await new Promise((resolve) => setTimeout(resolve, 50));
});

describe('standalone color mode application', () => {
  it('applies the mode stored in localStorage to the Redoc root on first render', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');

    renderStandalone();

    expect(redocRoot()).toHaveClass('redoc', 'dark');
    expect(document.documentElement.className).toBe('');
  });

  it('falls back to a mode saved in the cookie by older builds', () => {
    setCookie('redoc.appStore', JSON.stringify({ colorMode: 'dark' }));

    renderStandalone();

    expect(redocRoot()).toHaveClass('dark');
    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
  });

  it('follows the light or dark class the page sets on <html>', async () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
    document.documentElement.classList.add('dark');

    renderStandalone();
    expect(redocRoot()).toHaveClass('dark');

    await act(async () => {
      document.documentElement.classList.replace('dark', 'light');
    });
    expect(redocRoot()).toHaveClass('light');
    expect(redocRoot()).not.toHaveClass('dark');

    await act(async () => {
      document.documentElement.classList.add('dark');
    });
    expect(redocRoot()).toHaveClass('dark');
  });

  it('writes a switcher pick to the page class while the page sets the mode', async () => {
    document.documentElement.classList.add('dark');

    renderStandalone();
    await act(async () => {
      fireEvent.click(screen.getByTestId('color-mode-switcher'));
    });

    expect(redocRoot()).toHaveClass('light');
    expect(document.documentElement.className).toBe('light');
  });

  it.each(['data-bs-theme', 'data-theme'])('follows the %s attribute on <html>', async (name) => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light');
    document.documentElement.setAttribute(name, 'dark');

    renderStandalone();
    expect(redocRoot()).toHaveClass('dark');

    await act(async () => {
      document.documentElement.setAttribute(name, 'light');
    });
    expect(redocRoot()).toHaveClass('light');
  });

  it.each(['data-bs-theme', 'data-theme'])(
    'writes a switcher pick to the %s attribute without adding a class',
    async (name) => {
      document.documentElement.setAttribute(name, 'dark');

      renderStandalone();
      await act(async () => {
        fireEvent.click(screen.getByTestId('color-mode-switcher'));
      });

      expect(document.documentElement.getAttribute(name)).toBe('light');
      expect(document.documentElement.className).toBe('');
      expect(redocRoot()).toHaveClass('light');
    },
  );

  it('ignores a theme attribute that names another theme', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
    document.documentElement.setAttribute('data-theme', 'cupcake');

    renderStandalone();

    expect(redocRoot()).toHaveClass('dark');
  });

  it('leaves <html> alone when the page sets no mode', async () => {
    renderStandalone();
    await act(async () => {
      fireEvent.click(screen.getByTestId('color-mode-switcher'));
    });

    expect(redocRoot()).toHaveClass('dark');
    expect(document.documentElement.className).toBe('');
  });

  it('treats a removed page class as light once the page has set one', async () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
    document.documentElement.classList.add('dark');

    renderStandalone();
    await act(async () => {
      document.documentElement.classList.remove('dark');
    });

    expect(redocRoot()).toHaveClass('light');
    expect(document.documentElement.className).toBe('');
  });

  it('persists a toggled mode to localStorage, not the cookie', () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <RedoclyApiDocsStandalone
          items={[]}
          store={EMPTY_STORE}
          basePath="/"
          options={{ specType: 'openapi' } as RawApiDocsOptions}
        />
      </Provider>,
    );

    act(() => store.set(colorModeAtom, 'dark'));

    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
    expect(getCookie('redoc.appStore')).not.toContain('colorMode');
  });

  it('opens the server-rendered Redoc root with the pre-paint script', () => {
    const html = renderToString(
      <MemoryRouter>
        <RedoclyApiDocsStandalone
          items={[]}
          store={EMPTY_STORE}
          basePath="/"
          options={{ specType: 'openapi' } as RawApiDocsOptions}
        />
      </MemoryRouter>,
    );

    const script = `<div hidden=""><script>${prePaintColorModeScript}</script></div>`;
    const rootOpeningTag = html.slice(0, html.indexOf(script));

    expect(rootOpeningTag).toMatch(/^<div class="[^"]*\bredoc light"[^>]*>$/);
  });
});
