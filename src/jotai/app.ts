import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { LayoutVariant } from '@redocly/config';
import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import type { AsyncLocalStorage } from 'node:async_hooks';

import { getCookie, removeCookie, setCookie } from '../utils/cookies.js';
import { mergeEnvData, IS_BROWSER } from '../utils/environments.js';
import { keepReadingSectionAnchored } from '../utils/scroll-anchoring.js';
import { safeJsonParse } from '../utils/string.js';
import { fromSessionStorage, toSessionStorage } from '../utils/session-storage.js';
import { DEFAULT_LAYOUT } from '../options/constants.js';
import { globalOptionsAtom } from './store.js';

declare global {
  var redoclyCookieStorage: AsyncLocalStorage<string> | undefined;
}

export type TabType<T extends object = object> = {
  title: string;
  key: string;
} & T;

export type AppSessionStore = {
  collapsedSidebar: boolean;
  unsupportedFeatureScreen: boolean;
};

export type AppStore = {
  activeMimeName: string;
  layout: LayoutVariant;
  colorMode: string;
  language: string;
  environment: string;
  environments: Record<string, Record<string, string>>;
  allowedEnvironments: string[] | null;
};

type LanguageAtom = {
  languages?: (TabType & { order?: number; lang: string })[];
  activeLanguage: string;
};

const defaultAppStoreValue: AppStore = {
  activeMimeName: '',
  layout: DEFAULT_LAYOUT,
  colorMode: '',
  language: '',
  environment: '',
  environments: {},
  allowedEnvironments: null,
};

/** Raw `light` | `dark`; localStorage so it survives on `file://`, where cookies are dropped. */
export const COLOR_MODE_STORAGE_KEY = 'redoc.colorMode';

// environments → sessionStorage, colorMode → localStorage, everything else → cookie (SSR-readable)
const customStorage = {
  getItem: (ctx: string) => {
    const cookieValue = safeJsonParse<object>(
      getCookie(ctx, globalThis.redoclyCookieStorage?.getStore?.()),
    );
    const sessionValue = safeJsonParse<object>(fromSessionStorage(ctx));
    const stored = {
      ...defaultAppStoreValue,
      ...sessionValue,
      ...cookieValue,
    } as AppStore;
    if (!IS_BROWSER) return stored;

    const colorMode = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY) || stored.colorMode;
    if (colorMode) window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
    return { ...stored, colorMode };
  },
  setItem: (ctx: string, value: AppStore) => {
    const { environments, colorMode, ...cookieValue } = value;
    const sessionValue = { environments };
    setCookie(ctx, JSON.stringify(cookieValue));
    toSessionStorage(ctx, JSON.stringify(sessionValue));
    if (IS_BROWSER && colorMode) {
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
    }
  },
  removeItem: (ctx: string) => {
    removeCookie(ctx);
    sessionStorage.removeItem(ctx);
    localStorage.removeItem(COLOR_MODE_STORAGE_KEY);
  },
};

export const appStore = atomWithStorage<AppStore>(
  'redoc.appStore',
  defaultAppStoreValue,
  customStorage,
);

export const environmentsAtom = atom((get) => {
  const state = get(appStore);
  // Merge with an empty set so consumers get a copy, never the persisted store object.
  const envs = mergeEnvData(state.environments, {});
  return envs;
});

export const environmentAtom = atom<
  [Record<string, string>, string],
  [
    {
      environment?: string;
      environments?: Record<string, Record<string, string>>;
    },
  ],
  void
>(
  (get) => {
    const state = get(appStore);
    const envs = mergeEnvData(state.environments, {});
    const selectedEnvironment = state.environment;
    // Environments are keyed by server name/description when present, but the
    // docs use server URLs — so also match the selection against env `server` urls.
    const serverKeyedName = Object.keys(envs).find(
      (name) => envs[name]?.['server'] === selectedEnvironment,
    );
    const envName = envs[selectedEnvironment]
      ? selectedEnvironment
      : (serverKeyedName ?? Object.keys(envs)[0]);
    let env = envs[envName] || {};
    // Selection by URL with a user-provided env keyed by that URL: the seeded
    // entry (keyed by server name) holds the `server` field — merge it in.
    if (!env['server'] && serverKeyedName) {
      env = { ...envs[serverKeyedName], ...env };
    }
    return [env, envName || ''];
  },
  (get, set, { environment, environments }) => {
    const state = get(appStore);
    set(appStore, {
      ...state,
      environment: environment || state.environment,
      environments: mergeEnvData(state.environments || {}, environments),
    });
  },
);

export const savedEnvironmentNameAtom = atom((get) => get(appStore).environment);

export const activeMimeNameAtom = atom<string, [string], void>(
  (get) => get(appStore).activeMimeName,
  (get, set, activeMimeName) => {
    const state = get(appStore);
    set(appStore, { ...state, activeMimeName });
  },
);

// Authored embed selection (`mimeType`/`exampleKey` on a pluggable tag). Kept
// out of the cookie-backed store so an embed never overwrites the visitor's
// persisted media-type preference for the rest of the site.
export const mediaTypeOverrideAtom = atom<string | undefined>(undefined);

export const activeMediaTypeAtom = atom<string | undefined, [string | undefined], void>(
  (get) => get(mediaTypeOverrideAtom) ?? (get(activeMimeNameAtom) || undefined),
  (get, set, value) => {
    // A genuine user pick replaces any authored embed default.
    set(mediaTypeOverrideAtom, undefined);
    // Global switch can reshape every mounted section; keep the visible one anchored.
    if ((value ?? '') !== get(activeMimeNameAtom)) {
      keepReadingSectionAnchored();
    }
    set(activeMimeNameAtom, value ?? '');
  },
);

export const layoutAtom = atom<LayoutVariant, LayoutVariant[], void>(
  (get) => get(appStore).layout,
  (get, set, layout = LayoutVariant.STACKED) => {
    const state = get(appStore);
    set(appStore, { ...state, layout });
  },
);


export const allowedEnvironmentsAtom = atom<string[] | null, [string[] | null], void>(
  (get) => get(appStore).allowedEnvironments,
  (get, set, allowedEnvironments) => {
    const state = get(appStore);
    set(appStore, { ...state, allowedEnvironments });
  },
);

/**
 * appSessionStore saved to session storage
 */
export const appSessionStore = atomWithStorage<AppSessionStore>(
  'redoc.appSessionStore',
  {
    collapsedSidebar: false,
    unsupportedFeatureScreen: false,
  },
  IS_BROWSER ? createJSONStorage<AppSessionStore>(() => sessionStorage) : undefined,
);

/** Mobile sidebar drawer — open state is per-view, never persisted. */
export const isSidebarOpenedAtom = atom<boolean>(false);

const COLOR_MODES = [DEFAULT_COLOR_MODES.LIGHT, DEFAULT_COLOR_MODES.DARK] as string[];

function applyColorModeClass(mode: string): void {
  const root = document.documentElement;
  COLOR_MODES.forEach((m) => root.classList.remove(m));
  root.classList.add(mode, 'notransition');
  window.requestAnimationFrame(() => {
    root.classList.remove('notransition');
  });
}

export const colorModeAtom = atom<string, string[], void>(
  (get) => {
    const mode =
      get(appStore).colorMode ||
      (IS_BROWSER && window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? DEFAULT_COLOR_MODES.DARK
        : DEFAULT_COLOR_MODES.LIGHT);
    if (IS_BROWSER) {
      applyColorModeClass(mode);
    }
    return mode;
  },
  (get, set, colorMode) => {
    const state = get(appStore);
    set(appStore, { ...state, colorMode });
  },
);

export const collapsedSidebarAtom = atom<boolean, boolean[], void>(
  (get) => get(appSessionStore).collapsedSidebar,
  (get, set, collapsedSidebar) => {
    const state = get(appSessionStore);
    set(appSessionStore, { ...state, collapsedSidebar });
  },
);

export const languageAtom = atom<LanguageAtom, [string], void>(
  (get) => {
    const options = get(globalOptionsAtom);
    const { codeSamples } = options;
    if (!codeSamples?.languages) {
      return { languages: [], activeLanguage: get(appStore).language || '' };
    }
    // `lang` stays the configured language. Both consumers need it that way: the grammar is
    // resolved where the highlighter is fed, and the icon can only be resolved from a language.
    const languages = codeSamples.languages.map(({ key, label, lang }, order) => ({
      key,
      lang,
      title: label,
      order,
    }));
    const activeLanguage = get(appStore).language || languages[0]?.key;
    return {
      languages,
      activeLanguage:
        languages.find(({ key }: { key: string }) => key === activeLanguage)?.key ||
        languages[0]?.key,
    };
  },
  (get, set, activeLanguage) => {
    const state = get(appStore);
    set(appStore, { ...state, language: activeLanguage });
  },
);

export const requestValuesAtom = atom<Record<string, Record<string, unknown>>>({});

/**
 * The `data-section-id` of whatever section is currently nearest the top of
 * the viewport (computed by `useScrollSpyUrlSync` via `useActiveSectionId`).
 * Used only for the standalone API docs with sidebar.
 */
export const activeScrollSectionAtom = atom<string | null>(null);

/**
 * Lowercased pathnames visited this session. Written only by the root-mounted
 * `useVisitedChannelsTracker` so per-item panels don't subscribe to the router.
 */
export const visitedChannelsAtom = atom<string[]>([]);
