import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { cleanup, render } from '@testing-library/react';

import {
  PrePaintColorModeScript,
  prePaintColorModeScript,
} from '../components/PrePaintColorModeScript.js';

const runScript = new Function(prePaintColorModeScript) as () => void;

function mockPrefersDark(matches: boolean): void {
  vi.stubGlobal('matchMedia', () => ({ matches }));
}

let root: HTMLElement;

beforeEach(() => {
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-bs-theme');
  document.documentElement.removeAttribute('data-theme');
  window.localStorage.clear();
  root = document.createElement('div');
  root.className = 'redoc light';
  document.body.appendChild(root);
});

afterEach(() => {
  root.remove();
  vi.unstubAllGlobals();
});

describe('prePaintColorModeScript', () => {
  it('applies the stored mode to the Redoc root, not to <html>', () => {
    window.localStorage.setItem('redoc.colorMode', 'dark');
    mockPrefersDark(false);
    runScript();
    expect(root.className).toBe('redoc dark');
    expect(document.documentElement.className).toBe('');
  });

  it('falls back to prefers-color-scheme when nothing valid is stored', () => {
    window.localStorage.setItem('redoc.colorMode', 'sepia');
    mockPrefersDark(true);
    runScript();
    expect(root.className).toBe('redoc dark');

    window.localStorage.clear();
    mockPrefersDark(false);
    runScript();
    expect(root.className).toBe('redoc light');
  });

  it('follows a light or dark class the page sets on <html>', () => {
    window.localStorage.setItem('redoc.colorMode', 'light');
    document.documentElement.className = 'dark';
    runScript();
    expect(root.className).toBe('redoc dark');

    window.localStorage.setItem('redoc.colorMode', 'dark');
    document.documentElement.className = 'light';
    runScript();
    expect(root.className).toBe('redoc light');
  });

  it.each(['data-bs-theme', 'data-theme'])('follows the %s attribute on <html>', (name) => {
    window.localStorage.setItem('redoc.colorMode', 'light');
    document.documentElement.setAttribute(name, 'dark');
    runScript();
    expect(root.className).toBe('redoc dark');
  });

  it('never throws when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    expect(runScript).not.toThrow();
  });
});

describe('PrePaintColorModeScript', () => {
  const serverHtml = `<div hidden=""><script>${prePaintColorModeScript}</script></div>`;
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleError.mockRestore();
  });

  it('emits the script inside a hidden wrapper when server rendered', () => {
    expect(renderToString(<PrePaintColorModeScript />)).toBe(serverHtml);
  });

  it('renders the wrapper on the client without React creating a script element', () => {
    const { container } = render(<PrePaintColorModeScript />);

    expect(container.querySelector('div[hidden] > script')).not.toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('hydrates the server markup without errors', async () => {
    const host = document.createElement('div');
    host.innerHTML = serverHtml;
    document.body.appendChild(host);

    const hydrated = await act(async () => hydrateRoot(host, <PrePaintColorModeScript />));
    expect(consoleError).not.toHaveBeenCalled();
    expect(host.innerHTML).toBe(serverHtml);

    await act(async () => hydrated.unmount());
    host.remove();
  });
});
