import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'jotai';

import { activeMimeNameAtom, appStore, collapsedSidebarAtom, languageAtom } from '../app.js';
import { globalStoreAtom } from '../store.js';
import { writeAppState } from '../../utils/app-state-storage.js';
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
  });
  return jotaiStore;
}

beforeEach(() => {
  // A persisted `language` would leak between tests.
  writeAppState('redoc.appStore', null);
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

describe('blocked site storage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the app state in memory when the browser denies storage access', () => {
    const denied = () => {
      throw new DOMException('Access is denied for this document.', 'SecurityError');
    };
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(denied);
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(denied);

    const store = createStore();
    store.sub(appStore, () => undefined);
    store.sub(collapsedSidebarAtom, () => undefined);
    store.set(appStore, { ...store.get(appStore), colorMode: 'dark', environments: { Prod: {} } });
    store.set(activeMimeNameAtom, 'application/xml');
    store.set(collapsedSidebarAtom, true);

    expect(store.get(appStore)).toMatchObject({
      colorMode: 'dark',
      activeMimeName: 'application/xml',
      environments: { Prod: {} },
    });
    expect(store.get(collapsedSidebarAtom)).toBe(true);
  });
});
