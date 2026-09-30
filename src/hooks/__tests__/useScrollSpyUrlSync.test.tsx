import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { HashRouter, MemoryRouter } from 'react-router';

import type { ReactNode } from 'react';
import type { ApiDocsOptions } from '../../types/options.js';

import { globalStoreAtom } from '../../jotai/store.js';
import { activeScrollSectionAtom } from '../../jotai/app.js';
import { useScrollSpyUrlSync } from '../useScrollSpyUrlSync.js';

const { useActiveSectionIdMock } = vi.hoisted(() => ({
  useActiveSectionIdMock: vi.fn(),
}));

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    IS_BROWSER: true,
    useActiveSectionId: useActiveSectionIdMock,
  };
});

function renderUseScrollSpyUrlSync(opts: { routingBasePath?: string; pathname?: string } = {}) {
  const { routingBasePath = '', pathname = '/pets' } = opts;

  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: { basePath: routingBasePath } as ApiDocsOptions,
    replayDefinition: null,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <JotaiProvider store={store}>
      <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
    </JotaiProvider>
  );

  return { result: renderHook(() => useScrollSpyUrlSync(), { wrapper }), store };
}

/** Same, under a hash router — the standalone bundle's default. */
function renderUnderHashRouter(routingBasePath = '') {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: { basePath: routingBasePath } as ApiDocsOptions,
    replayDefinition: null,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <JotaiProvider store={store}>
      <HashRouter>{children}</HashRouter>
    </JotaiProvider>
  );

  return { result: renderHook(() => useScrollSpyUrlSync(), { wrapper }), store };
}

describe('useScrollSpyUrlSync', () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useActiveSectionIdMock.mockReturnValue('');
    replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    // Reset window.location.pathname between tests.
    window.history.replaceState({}, '', '/');
    replaceStateSpy.mockClear();
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    useActiveSectionIdMock.mockReset();
  });

  it('preserves a freshly-navigated pathname section until the user scrolls, then tracks it', () => {
    useActiveSectionIdMock.mockReturnValue('/section/visible');

    const { result } = renderUseScrollSpyUrlSync({ pathname: '/pets' });

    expect(replaceStateSpy).not.toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/section/other');
    act(() => {
      result.rerender();
    });

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(replaceStateSpy.mock.calls[0][2]).toContain('section/other');
  });

  it('writes the active section to the atom so the sidebar can highlight it', () => {
    useActiveSectionIdMock.mockReturnValue('/section/visible');

    const { result, store } = renderUseScrollSpyUrlSync({ pathname: '/pets' });

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/section/other');
    act(() => {
      result.rerender();
    });

    expect(store.get(activeScrollSectionAtom)).toBe('/section/other');
  });

  it('leaves the atom empty until the user scrolls, so the sidebar follows the navigated route', () => {
    useActiveSectionIdMock.mockReturnValue('/section/visible');

    const { store } = renderUseScrollSpyUrlSync({ pathname: '/pets' });

    expect(store.get(activeScrollSectionAtom)).toBeNull();
  });

  it('replaces the URL with the base path when the user scrolls to the top section', () => {
    useActiveSectionIdMock.mockReturnValue('/section/visible');

    const { result } = renderUseScrollSpyUrlSync({
      routingBasePath: '/petstore',
      pathname: '/pets',
    });

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/petstore');
    act(() => {
      result.rerender();
    });

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/petstore');
  });

  it('does nothing when there is no active section', () => {
    useActiveSectionIdMock.mockReturnValue('');

    const { store } = renderUseScrollSpyUrlSync();

    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(store.get(activeScrollSectionAtom)).toBeNull();
  });

  it('does not call replaceState when the active section is already in the URL', () => {
    window.history.replaceState({}, '', '/section/visible');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/section/visible');

    renderUseScrollSpyUrlSync({ pathname: '/section/visible' });

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('preserves a pathname deep link until the user scrolls (short page cannot reach the target)', () => {
    // Deep link to a section route with no hash: LazySection placeholders above
    // the target keep the page too short to scroll it to the activation line,
    // so scroll-spy reads a different (placeholder) section.
    window.history.replaceState({}, '', '/dummy/schemas');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/dummy/paths/~1users~1{userid}/get');

    renderUseScrollSpyUrlSync({ pathname: '/dummy/schemas' });

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('resumes rewriting a pathname deep link once the user scrolls', () => {
    window.history.replaceState({}, '', '/dummy/schemas');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/dummy/paths/~1users~1{userid}/get');

    const { result } = renderUseScrollSpyUrlSync({ pathname: '/dummy/schemas' });
    expect(replaceStateSpy).not.toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/dummy/paths/~1users');
    act(() => {
      result.rerender();
    });

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(replaceStateSpy.mock.calls[0][2]).toContain('paths/~1users');
  });

  it('preserves a deep-link hash until the user scrolls (programmatic settle must not clobber it)', () => {
    window.history.replaceState({}, '', '/pets#pets/getpets/t=request&path=name');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/other-section');

    renderUseScrollSpyUrlSync({ pathname: '/pets' });

    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('writes the section into the hash under a hash router, keeping the document path', () => {
    window.history.replaceState({}, '', '/examples/index.standalone.html#/orders/listorders');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/orders/listorders');

    const { result } = renderUnderHashRouter();

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/orders/createorder');
    act(() => {
      result.rerender();
    });

    // HashRouter normalizes the hash on mount, so assert on the scroll-spy write.
    expect(replaceStateSpy.mock.lastCall?.[2]).toBe('#/orders/createorder');
    expect(window.location.pathname).toBe('/examples/index.standalone.html');
  });

  it('resumes rewriting once the user scrolls, even with a hash present', () => {
    window.history.replaceState({}, '', '/pets#pets/getpets/t=request&path=name');
    replaceStateSpy.mockClear();
    useActiveSectionIdMock.mockReturnValue('/other-section');

    const { result } = renderUseScrollSpyUrlSync({ pathname: '/pets' });
    expect(replaceStateSpy).not.toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });
    useActiveSectionIdMock.mockReturnValue('/another-section');
    act(() => {
      result.rerender();
    });

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(replaceStateSpy.mock.calls[0][2]).toContain('another-section');
  });
});
