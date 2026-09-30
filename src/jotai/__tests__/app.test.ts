import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from 'jotai';

import { languageAtom } from '../app.js';
import { globalStoreAtom } from '../store.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';

import type { RawApiDocsOptions } from '../../types/options.js';

function setupStore(codeSamples: RawApiDocsOptions['codeSamples']) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      codeSamples,
    }),
    replayDefinition: null,
  });
  return jotaiStore;
}

beforeEach(() => {
  // appStore is cookie-backed, so a persisted `language` would leak between tests.
  document.cookie = 'redoc.appStore=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  sessionStorage.clear();
});

describe('languageAtom', () => {
  it('titles each tab with the configured label and keeps lang as the configured language', () => {
    const store = setupStore({
      languages: [{ lang: 'curl', label: 'Shell' }, { lang: 'C#+Newtonsoft' }],
    });

    expect(store.get(languageAtom)).toEqual({
      languages: [
        { key: 'shell', lang: 'curl', title: 'Shell', order: 0 },
        { key: 'csharpnewtonsoft', lang: 'C#+Newtonsoft', title: 'C#+Newtonsoft', order: 1 },
      ],
      activeLanguage: 'shell',
    });
  });

  it('keeps a renamed tab distinguishable from the language it shares a grammar with', () => {
    const store = setupStore({
      languages: [{ lang: 'Node.js', label: 'kuku' }, { lang: 'JavaScript' }],
    });

    expect(store.get(languageAtom).languages).toEqual([
      { key: 'kuku', lang: 'Node.js', title: 'kuku', order: 0 },
      { key: 'javascript', lang: 'JavaScript', title: 'JavaScript', order: 1 },
    ]);
  });
});
