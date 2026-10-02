import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactNode } from 'react';

import type { DeepLinkSectionValue } from '../../../../hooks/useDeepLinkSection.js';

import {
  buildSchemaFieldSuffix,
  useSchemaFieldDeepLink,
  useSectionExpandBaseline,
} from '../useSchemaFieldDeepLink.js';
import { globalStoreAtom } from '../../../../jotai/store.js';
import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';

describe('buildSchemaFieldSuffix', () => {
  it('returns empty string when sectionCtx is null', () => {
    expect(buildSchemaFieldSuffix(null, 'data/id')).toBe('');
  });

  it('returns path-only suffix when pathOnly is set', () => {
    expect(buildSchemaFieldSuffix({ pathOnly: true }, 'data/id')).toBe('path=data/id');
  });

  it('returns empty string when pathOnly is set and fieldPath is empty', () => {
    expect(buildSchemaFieldSuffix({ pathOnly: true }, '')).toBe('');
  });

  it('pathOnly takes precedence over OpenAPI section fields', () => {
    expect(buildSchemaFieldSuffix({ pathOnly: true, t: 'request', in: 'header' }, 'data/id')).toBe(
      'path=data/id',
    );
  });

  it('falls back to AsyncAPI suffix when asyncSection is present', () => {
    expect(
      buildSchemaFieldSuffix(
        { asyncSection: 'messages', messageKey: 'msgA', t: 'payload' },
        'data/id',
      ),
    ).toBe('messages&m=msgA&t=payload&path=data/id');
  });

  it('falls back to the OpenAPI field suffix for request/response sections', () => {
    expect(buildSchemaFieldSuffix({ t: 'request', in: 'header' }, 'accept-language')).toBe(
      't=request&in=header&path=accept-language',
    );
  });

  it('builds the section-level expand key from an empty path', () => {
    expect(buildSchemaFieldSuffix({ t: 'request' }, '')).toBe('t=request&path=');
    expect(buildSchemaFieldSuffix({ t: 'request', in: 'query' }, '')).toBe(
      't=request&in=query&path=',
    );
    expect(buildSchemaFieldSuffix({ t: 'response', c: '200' }, '')).toBe('t=response&c=200&path=');
    expect(
      buildSchemaFieldSuffix({ asyncSection: 'messages', messageKey: 'msgA', t: 'payload' }, ''),
    ).toBe('messages&m=msgA&t=payload');
  });

  it('keeps the section key a prefix of the field keys in the same section', () => {
    const section: DeepLinkSectionValue = { t: 'response', c: '200' };
    const sectionKey = buildSchemaFieldSuffix(section, '');
    const fieldKey = buildSchemaFieldSuffix(section, 'user/address');
    expect(fieldKey.startsWith(sectionKey)).toBe(true);
  });
});

function makeWrapper({
  itemId,
  section = null,
  expandableSections,
}: {
  itemId: string | undefined;
  section?: DeepLinkSectionValue | null;
  expandableSections?: Record<string, boolean | undefined>;
}) {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
    replayDefinition: null,
  });
  if (itemId && expandableSections) {
    store.set(itemStoreAtom(itemId), { expandableSections });
  }

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      JotaiProvider,
      { store },
      createElement(
        MemoryRouter,
        undefined,
        createElement(
          ItemIdContext.Provider,
          { value: itemId },
          createElement(DeepLinkSectionContext.Provider, { value: section }, children),
        ),
      ),
    );
  };
}

describe('useSchemaFieldDeepLink', () => {
  it('builds the deep link from the surrounding DeepLinkSectionContext', () => {
    const wrapper = makeWrapper({ itemId: '/test-op', section: { t: 'request', in: 'query' } });

    const { result } = renderHook(() => useSchemaFieldDeepLink('limit'), { wrapper });

    expect(result.current).toBe('/test-op#test-op/t=request&in=query&path=limit');
  });

  it('builds a path-only deep link when the section is pathOnly', () => {
    const wrapper = makeWrapper({ itemId: '/test-op', section: { pathOnly: true } });

    const { result } = renderHook(() => useSchemaFieldDeepLink('data/id'), { wrapper });

    expect(result.current).toBe('/test-op#test-op/path=data/id');
  });

  it('links to the bare item when no section context is provided', () => {
    const wrapper = makeWrapper({ itemId: '/test-op', section: null });

    const { result } = renderHook(() => useSchemaFieldDeepLink('limit'), { wrapper });

    expect(result.current).toBe('/test-op#test-op');
  });

  it('returns an empty string when no item id is in scope', () => {
    const wrapper = makeWrapper({ itemId: undefined, section: { t: 'request' } });

    const { result } = renderHook(() => useSchemaFieldDeepLink('limit'), { wrapper });

    expect(result.current).toBe('');
  });
});

describe('useSectionExpandBaseline', () => {
  it('returns the stored baseline for the surrounding section (expanded)', () => {
    const wrapper = makeWrapper({
      itemId: '/test-op',
      section: { t: 'request', in: 'query' },
      expandableSections: { 't=request&in=query&path=': true },
    });

    const { result } = renderHook(() => useSectionExpandBaseline(), { wrapper });

    expect(result.current).toBe(true);
  });

  it('reflects a collapsed baseline', () => {
    const wrapper = makeWrapper({
      itemId: '/test-op',
      section: { t: 'response', c: '200' },
      expandableSections: { 't=response&c=200&path=': false },
    });

    const { result } = renderHook(() => useSectionExpandBaseline(), { wrapper });

    expect(result.current).toBe(false);
  });

  it('returns undefined when the section has no baseline registered', () => {
    const wrapper = makeWrapper({
      itemId: '/test-op',
      section: { t: 'request' },
      expandableSections: {},
    });

    const { result } = renderHook(() => useSectionExpandBaseline(), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('reads only its own section key, not another section in the same item', () => {
    const wrapper = makeWrapper({
      itemId: '/test-op',
      section: { t: 'response', c: '200' },
      expandableSections: { 't=request&path=': true },
    });

    const { result } = renderHook(() => useSectionExpandBaseline(), { wrapper });

    expect(result.current).toBeUndefined();
  });

  it('returns undefined when there is no section context', () => {
    const wrapper = makeWrapper({
      itemId: '/test-op',
      section: null,
      expandableSections: { 't=request': true },
    });

    const { result } = renderHook(() => useSectionExpandBaseline(), { wrapper });

    expect(result.current).toBeUndefined();
  });
});
