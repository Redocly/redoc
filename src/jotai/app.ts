import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { LayoutVariant } from '@redocly/config';

import type { AsyncLocalStorage } from 'node:async_hooks';
import type { TabType } from '../models/tab.js';

import { getCookie, removeCookie, setCookie } from '../utils/cookies.js';
import { globalOptionsAtom } from './store.js';
import { fromSessionStorage, safeJsonParse } from '../utils/index.js';
import { IS_BROWSER } from '../utils/dom.js';

declare global {
  var redoclyCookieStorage: AsyncLocalStorage<string> | undefined;
}

export type AppSessionStore = {
  collapsedSidebar: boolean;
  unsupportedFeatureScreen: boolean;
};

export type AppStore = {
  isSidebarOpened: boolean;
  activeMimeName: string;
  layout: LayoutVariant;
  language: string;
  router: 'hash' | 'history' | 'memory';
  disableTelemetry: boolean;
};

type LanguageAtom = {
  languages?: (TabType & { order?: number; lang: string })[];
  activeLanguage: string;
};

const defaultAppStoreValue: AppStore = {
  isSidebarOpened: true,
  activeMimeName: '',
  layout: LayoutVariant.THREE_PANEL,
  language: '',
  router: 'hash',
  disableTelemetry: false,
};

// get environment from sessionStorage and other values from cookies (so it works during SSR)
const customStorage = {
  getItem: (ctx: string) => {
    const cookieValue = safeJsonParse<object>(
      getCookie(ctx, globalThis.redoclyCookieStorage?.getStore?.()),
    );
    const sessionValue = safeJsonParse<object>(fromSessionStorage(ctx));
    const merged = {
      ...defaultAppStoreValue,
      ...sessionValue,
      ...cookieValue,
    } as AppStore;

    return merged;
  },
  setItem: (ctx: string, value: AppStore) => {
    setCookie(ctx, JSON.stringify(value));
  },
  removeItem: (ctx) => {
    removeCookie(ctx);
    sessionStorage.removeItem(ctx);
  },
};

export const appStore = atomWithStorage<AppStore>(
  'redoc.appStore',
  defaultAppStoreValue,
  customStorage,
);

// allow some parts of appStore to be overridden
export const appStoreOverrideAtom = atom<Partial<AppStore> | undefined>({});

export const isSidebarOpenedAtom = atom<boolean, boolean[], void>(
  (get) => get(appStore).isSidebarOpened,
  (get, set, isSidebarOpened) => {
    const state = get(appStore);
    set(appStore, { ...state, isSidebarOpened });
  },
);

export const activeMimeNameAtom = atom<string, [string], void>(
  (get) => get(appStore).activeMimeName,
  (get, set, activeMimeName) => {
    const state = get(appStore);
    set(appStore, { ...state, activeMimeName });
  },
);

export const layoutAtom = atom<LayoutVariant, LayoutVariant[], void>(
  (get) => get(appStore).layout,
  (get, set, layout = LayoutVariant.STACKED) => {
    const state = get(appStore);
    set(appStore, { ...state, layout });
  },
);
export const routerAtom = atom<
  'hash' | 'history' | 'memory',
  ['hash' | 'history' | 'memory'],
  void
>(
  (get) => get(appStore).router,
  (get, set, router = 'hash') => {
    const state = get(appStore);
    set(appStore, { ...state, router });
  },
);

/**
 * appSessionStore saved to session storage
 */
export const appSessionStore = atomWithStorage<AppSessionStore>( // FIXME: get rid of it, need to remove versions code
  'redoc.appSessionStore',
  {
    collapsedSidebar: false,
    unsupportedFeatureScreen: false,
  },
  IS_BROWSER ? createJSONStorage<AppSessionStore>(() => sessionStorage) : undefined,
);

export const collapsedSidebarAtom = atom<boolean, boolean[], void>(
  (get) => get(appSessionStore).collapsedSidebar,
  (get, set, collapsedSidebar) => {
    const state = get(appSessionStore);
    set(appSessionStore, { ...state, collapsedSidebar });
  },
);

export function getLangKey({ lang, label }: { lang: string; label?: string }) {
  return (label || lang).toLowerCase();
}

export const languageAtom = atom<LanguageAtom, [string], void>(
  (get) => {
    const { codeSamples } = get(globalOptionsAtom);
    const languages = codeSamples.languages.map(({ lang, label }, index) => ({
      key: getLangKey({ lang, label }),
      lang,
      title: label || lang,
      order: index,
    }));
    const activeLanguage = get(appStore).language || languages[0]?.key;
    return {
      languages,
      activeLanguage: languages.find(({ key }) => key === activeLanguage)?.key || languages[0]?.key,
    };
  },
  (get, set, activeLanguage) => {
    const state = get(appStore);
    set(appStore, { ...state, language: activeLanguage });
  },
);

export const disableTelemetryAtom = atom<boolean, boolean[], void>(
  (get) => get(appStore).disableTelemetry,
  (get, set, disableTelemetry) => {
    const state = get(appStore);
    set(appStore, { ...state, disableTelemetry });
  },
);
