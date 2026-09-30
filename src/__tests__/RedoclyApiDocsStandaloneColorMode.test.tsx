import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { createStore, Provider } from 'jotai';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';

import type { ApiStore } from '../types/store.js';
import type { RawApiDocsOptions } from '../types/options.js';

import RedoclyApiDocsStandalone from '../RedoclyApiDocsStandalone.js';
import { COLOR_MODE_STORAGE_KEY, colorModeAtom } from '../jotai/app.js';
import { prePaintColorModeScript } from '../components/PrePaintColorModeScript.js';
import { getCookie, removeCookie, setCookie } from '../utils/cookies.js';

const EMPTY_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

beforeEach(() => {
  document.documentElement.className = '';
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
  it('applies the mode stored in localStorage on first render', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');

    render(
      <RedoclyApiDocsStandalone
        items={[]}
        store={EMPTY_STORE}
        basePath="/"
        options={{ specType: 'openapi' } as RawApiDocsOptions}
      />,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('falls back to a mode saved in the cookie by older builds', () => {
    setCookie('redoc.appStore', JSON.stringify({ colorMode: 'dark' }));

    render(
      <RedoclyApiDocsStandalone
        items={[]}
        store={EMPTY_STORE}
        basePath="/"
        options={{ specType: 'openapi' } as RawApiDocsOptions}
      />,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
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

  it('opens the server-rendered markup with the pre-paint script', () => {
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

    expect(
      html.startsWith(`<div hidden=""><script>${prePaintColorModeScript}</script></div>`),
    ).toBe(true);
  });
});
