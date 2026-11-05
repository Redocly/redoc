import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import { IS_BROWSER } from '../utils/environments.js';
import { appStore } from './app.js';

export const REDOC_ROOT_CLASS = 'redoc';

export const COLOR_MODE_ATTRIBUTES = ['data-bs-theme', 'data-theme'];

const COLOR_MODES = [DEFAULT_COLOR_MODES.LIGHT, DEFAULT_COLOR_MODES.DARK] as string[];

const isColorMode = (value: string | null): value is string => COLOR_MODES.includes(value ?? '');

function readPageColorMode(pageSetsMode: boolean): string | null {
  const html = document.documentElement;
  const modes = [
    ...COLOR_MODE_ATTRIBUTES.map((name) => html.getAttribute(name)),
    ...html.classList,
  ].filter(isColorMode);
  if (modes.includes(DEFAULT_COLOR_MODES.DARK)) return DEFAULT_COLOR_MODES.DARK;
  return modes.length || pageSetsMode ? DEFAULT_COLOR_MODES.LIGHT : null;
}

function writePageColorMode(mode: string): void {
  const html = document.documentElement;
  const attributes = COLOR_MODE_ATTRIBUTES.filter((name) => isColorMode(html.getAttribute(name)));
  attributes.forEach((name) => html.setAttribute(name, mode));
  if (!attributes.length || [...html.classList].some(isColorMode)) {
    html.classList.remove(...COLOR_MODES);
    html.classList.add(mode);
  }
}

const pageColorModeAtom = atomWithDefault<string | null>(() =>
  IS_BROWSER ? readPageColorMode(false) : null,
);
pageColorModeAtom.onMount = (setMode) => {
  const sync = (): void => setMode((previous) => readPageColorMode(Boolean(previous)));
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', ...COLOR_MODE_ATTRIBUTES],
  });
  return () => observer.disconnect();
};

export const colorModeAtom = atom<string, string[], void>(
  (get) =>
    get(pageColorModeAtom) ||
    get(appStore).colorMode ||
    (IS_BROWSER && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? DEFAULT_COLOR_MODES.DARK
      : DEFAULT_COLOR_MODES.LIGHT),
  (get, set, colorMode) => {
    if (get(pageColorModeAtom)) writePageColorMode(colorMode);
    set(appStore, { ...get(appStore), colorMode });
  },
);
