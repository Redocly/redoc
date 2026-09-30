import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';

import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { matchesHeaderSuffix, useHeaderExpandableKeys } from '../hooks.js';

const ITEM_ID = 'pets/get-pet-by-id';

function makeWrapper(store = createStore(), itemId: string = ITEM_ID) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <JotaiProvider store={store}>
      <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
    </JotaiProvider>
  );
  return { Wrapper, store };
}

function withExpandableSections(keys: string[], itemId: string = ITEM_ID) {
  const store = createStore();
  store.set(itemStoreAtom(itemId), {
    expandableSections: Object.fromEntries(keys.map((key) => [key, true])),
  });
  return store;
}

describe('matchesHeaderSuffix', () => {
  it('matches request body and request params under the "request" header', () => {
    expect(matchesHeaderSuffix('t=request', 'request')).toBe(true);
    expect(matchesHeaderSuffix('t=request&ct=application/json', 'request')).toBe(true);
    expect(matchesHeaderSuffix('t=request&in=query', 'request')).toBe(true);
  });

  it('matches response sections under the "responses" header', () => {
    expect(matchesHeaderSuffix('t=response&c=200', 'responses')).toBe(true);
    expect(matchesHeaderSuffix('t=response&c=404&ct=application/json', 'responses')).toBe(true);
  });

  it('matches channel parameters under the "parameters" header (by the in= value)', () => {
    expect(matchesHeaderSuffix('t=request&in=parameters', 'parameters')).toBe(true);
    expect(matchesHeaderSuffix('t=request&in=query', 'parameters')).toBe(false);
  });

  it('matches AsyncAPI message sections under the "messages" header', () => {
    expect(matchesHeaderSuffix('messages&m=userSignedUp&t=payload', 'messages')).toBe(true);
    expect(matchesHeaderSuffix('messages&m=userSignedUp&t=headers', 'messages')).toBe(true);
  });

  it('matches GraphQL variant keys by exact equality', () => {
    expect(matchesHeaderSuffix('return-type', 'return-type')).toBe(true);
    expect(matchesHeaderSuffix('graphql-fields', 'graphql-fields')).toBe(true);
  });

  it('does not cross-match between groups', () => {
    expect(matchesHeaderSuffix('t=response&c=200', 'request')).toBe(false);
    expect(matchesHeaderSuffix('t=request', 'responses')).toBe(false);
    expect(matchesHeaderSuffix('messages&m=foo&t=payload', 'request')).toBe(false);
  });

  it('returns false for empty inputs', () => {
    expect(matchesHeaderSuffix('', 'request')).toBe(false);
    expect(matchesHeaderSuffix('t=request', '')).toBe(false);
  });
});

describe('useHeaderExpandableKeys', () => {
  it('returns an empty array when no deepLinkSuffix is provided', () => {
    const { Wrapper } = makeWrapper(withExpandableSections(['t=response&c=200']));
    const { result } = renderHook(() => useHeaderExpandableKeys(undefined), {
      wrapper: Wrapper,
    });
    expect(result.current).toEqual([]);
  });

  it('returns the expandable key matching the suffix', () => {
    const { Wrapper } = makeWrapper(withExpandableSections(['t=request', 't=response&c=200']));
    const { result } = renderHook(() => useHeaderExpandableKeys('responses'), {
      wrapper: Wrapper,
    });
    expect(result.current).toEqual(['t=response&c=200']);
  });

  it('returns an empty array when no expandable key matches the suffix', () => {
    const { Wrapper } = makeWrapper(withExpandableSections(['t=request']));
    const { result } = renderHook(() => useHeaderExpandableKeys('responses'), {
      wrapper: Wrapper,
    });
    expect(result.current).toEqual([]);
  });

  it('returns ALL matching keys when multiple sections register under the same header', () => {
    const { Wrapper } = makeWrapper(
      withExpandableSections([
        't=request&in=query',
        't=request&ct=application/json',
        't=response&c=200',
      ]),
    );
    const { result } = renderHook(() => useHeaderExpandableKeys('request'), {
      wrapper: Wrapper,
    });
    expect(result.current).toEqual(['t=request&in=query', 't=request&ct=application/json']);
  });

  it('returns a stable array reference across re-renders when keys are unchanged', () => {
    const { Wrapper } = makeWrapper(
      withExpandableSections(['t=request&in=query', 't=request&ct=application/json']),
    );
    const { result, rerender } = renderHook(() => useHeaderExpandableKeys('request'), {
      wrapper: Wrapper,
    });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
