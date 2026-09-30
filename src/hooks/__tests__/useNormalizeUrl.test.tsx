import type { ReactNode } from 'react';

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider } from 'jotai';

import type { GlobalStoreAtom } from '../../jotai/store.js';

import { globalStoreAtom } from '../../jotai/store.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { useNavigationUrlNormalizer, useNormalizeUrl } from '../useNormalizeUrl.js';

function createWrapper(basePath: string) {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath,
    }),
  } as GlobalStoreAtom);

  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

function renderNormalizer(basePath: string) {
  return renderHook(() => useNavigationUrlNormalizer(), {
    wrapper: createWrapper(basePath),
  });
}

describe('useNavigationUrlNormalizer', () => {
  describe('with a non-trivial basePath', () => {
    const basePath = '/docs/openapi';

    it('prepends basePath to a relative input', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('/menu/list')).toBe('/docs/openapi/menu/list');
    });

    it('is idempotent on an input that already includes basePath', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('/docs/openapi/menu/list')).toBe('/docs/openapi/menu/list');
    });

    it('produces the same output for relative and absolute inputs targeting the same route', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('/menu/list')).toBe(result.current('/docs/openapi/menu/list'));
    });

    it('collapses an exact-match basePath input to basePath itself', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('/docs/openapi')).toBe('/docs/openapi');
      expect(result.current('/docs/openapi/')).toBe('/docs/openapi');
    });

    it('strips a trailing slash from the result', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('/menu/list/')).toBe('/docs/openapi/menu/list');
    });

    it('collapses leading repeated slashes', () => {
      const { result } = renderNormalizer(basePath);
      expect(result.current('//menu/list')).toBe('/docs/openapi/menu/list');
    });
  });

  describe('with an empty / root basePath', () => {
    it('returns relative inputs untouched when basePath is empty', () => {
      const { result } = renderNormalizer('');
      expect(result.current('/menu/list')).toBe('/menu/list');
    });

    it('returns relative inputs untouched when basePath is the root', () => {
      const { result } = renderNormalizer('/');
      expect(result.current('/menu/list')).toBe('/menu/list');
    });
  });
});

describe('useNormalizeUrl', () => {
  it('is a thin wrapper that returns the normalized value for the given path', () => {
    const wrapper = createWrapper('/docs/openapi');
    const { result } = renderHook(() => useNormalizeUrl('/menu/list'), { wrapper });
    expect(result.current).toBe('/docs/openapi/menu/list');
  });
});
