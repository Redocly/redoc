import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.doUnmock('dompurify');
  vi.doUnmock('linkedom');
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('getDOMPurify', () => {
  it('uses sanitize directly when default export already has sanitize', async () => {
    const sanitize = vi.fn((source: string) => `[direct]${source}`);
    const domPurifyDefault = vi.fn(() => {
      return { sanitize: vi.fn() };
    }) as unknown as {
      (window: Window): { sanitize(source: string): string };
      sanitize: (source: string) => string;
    };
    domPurifyDefault.sanitize = sanitize;

    vi.doMock('dompurify', () => ({
      default: domPurifyDefault,
    }));
    vi.doMock('linkedom', () => ({
      parseHTML: vi.fn(),
    }));

    const { getDOMPurify } = await import('../dompurify.js');
    const instance = getDOMPurify();

    expect(instance.sanitize('<p>x</p>')).toBe('[direct]<p>x</p>');
    expect(sanitize).toHaveBeenCalledWith('<p>x</p>');
    expect(domPurifyDefault).not.toHaveBeenCalled();
  });

  it('creates linkedom-backed instance when sanitize is missing in node runtime', async () => {
    const sanitize = vi.fn((source: string) => `[node]${source}`);
    const domPurifyFactory = vi.fn(() => ({ sanitize }));
    const jsdomWindow = {} as Window;
    const parseHTML = vi.fn(() => ({ window: jsdomWindow }));

    vi.doMock('dompurify', () => ({
      default: domPurifyFactory,
    }));
    vi.doMock('linkedom', () => ({
      parseHTML,
    }));
    vi.stubGlobal('window', undefined);

    const { getDOMPurify } = await import('../dompurify.js');
    const instance = getDOMPurify();

    expect(instance.sanitize('<img src=x onerror=1>')).toBe('[node]<img src=x onerror=1>');
    expect(parseHTML).toHaveBeenCalledWith('<!doctype html><html><body></body></html>');
    expect(domPurifyFactory).toHaveBeenCalledWith(jsdomWindow);
  });

  it('uses existing browser window when sanitize is missing and window exists', async () => {
    const sanitize = vi.fn((source: string) => `[browser]${source}`);
    const domPurifyFactory = vi.fn(() => ({ sanitize }));
    const MockJSDOM = vi.fn();
    const browserWindow = { document: {} } as unknown as Window;

    vi.doMock('dompurify', () => ({
      default: domPurifyFactory,
    }));
    vi.doMock('linkedom', () => ({
      parseHTML: MockJSDOM,
    }));
    vi.stubGlobal('window', browserWindow);

    const { getDOMPurify } = await import('../dompurify.js');
    const instance = getDOMPurify();

    expect(instance.sanitize('<a href=x>x</a>')).toBe('[browser]<a href=x>x</a>');
    expect(domPurifyFactory).toHaveBeenCalledWith(browserWindow);
    expect(MockJSDOM).not.toHaveBeenCalled();
  });

  it('caches the initialized instance', async () => {
    const sanitize = vi.fn((source: string) => `[cached]${source}`);
    const domPurifyFactory = vi.fn(() => ({ sanitize }));
    const jsdomWindow = {} as Window;
    const parseHTML = vi.fn(() => ({ window: jsdomWindow }));

    vi.doMock('dompurify', () => ({
      default: domPurifyFactory,
    }));
    vi.doMock('linkedom', () => ({
      parseHTML,
    }));
    vi.stubGlobal('window', undefined);

    const { getDOMPurify } = await import('../dompurify.js');

    const first = getDOMPurify();
    const second = getDOMPurify();

    expect(second).toBe(first);
    expect(domPurifyFactory).toHaveBeenCalledTimes(1);
    expect(parseHTML).toHaveBeenCalledTimes(1);
  });
});
