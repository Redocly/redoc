import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';
import type { CodeSamplePanelItem, DefinitionCodeSample } from '../../../../types/content.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { useCodeSampleLanguages } from '../useCodeSampleLanguages.js';

function makeWrapper() {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {} }),
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <JotaiProvider store={jotaiStore}>{children}</JotaiProvider>;
  };
}

function makeNode(definitionSamples: DefinitionCodeSample[]): CodeSamplePanelItem {
  return {
    kind: 'codeSample',
    examples: [],
    source: {},
    definitionSamples,
  } as unknown as CodeSamplePanelItem;
}

describe('useCodeSampleLanguages (community edition)', () => {
  it('offers the payload tab plus the languages the definition ships x-codeSamples for', () => {
    const node = makeNode([
      { lang: 'curl', label: 'cURL', source: 'curl https://example.test' },
      { lang: 'Python', label: 'Python', source: 'requests.post(...)' },
    ]);

    const { result } = renderHook(() => useCodeSampleLanguages(node, true), {
      wrapper: makeWrapper(),
    });

    expect(result.current.languages.map(({ title }) => title)).toEqual([
      'curl',
      'Python',
      'Payload',
    ]);
    expect(result.current.activeLanguage).toBe('curl');
  });

  it('falls back to the payload tab when the definition ships no samples', () => {
    const { result } = renderHook(() => useCodeSampleLanguages(makeNode([]), true), {
      wrapper: makeWrapper(),
    });

    expect(result.current.languages.map(({ title }) => title)).toEqual(['Payload']);
    // The preferred language (`curl`) is not offered here, so the first tab wins.
    expect(result.current.activeLanguage).toBe('payload');
  });
});
