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

beforeEach(() => {
  document.documentElement.className = '';
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('prePaintColorModeScript', () => {
  it('applies the stored mode', () => {
    window.localStorage.setItem('redoc.colorMode', 'dark');
    mockPrefersDark(false);
    runScript();
    expect(document.documentElement.className).toBe('dark');
  });

  it('falls back to prefers-color-scheme when nothing valid is stored', () => {
    window.localStorage.setItem('redoc.colorMode', 'sepia');
    mockPrefersDark(true);
    runScript();
    expect(document.documentElement.className).toBe('dark');

    document.documentElement.className = '';
    window.localStorage.clear();
    mockPrefersDark(false);
    runScript();
    expect(document.documentElement.className).toBe('light');
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

    const root = await act(async () => hydrateRoot(host, <PrePaintColorModeScript />));
    expect(consoleError).not.toHaveBeenCalled();
    expect(host.innerHTML).toBe(serverHtml);

    await act(async () => root.unmount());
    host.remove();
  });
});
