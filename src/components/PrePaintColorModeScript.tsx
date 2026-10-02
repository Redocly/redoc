import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import { COLOR_MODE_STORAGE_KEY } from '../jotai/app.js';

/**
 * Self-contained copy of the `colorModeAtom` decision: stored mode if valid,
 * otherwise `prefers-color-scheme`. Errors are swallowed because storage may be blocked.
 */
export const prePaintColorModeScript =
  `try{var m=localStorage.getItem("${COLOR_MODE_STORAGE_KEY}");` +
  `if(m!=="${DEFAULT_COLOR_MODES.LIGHT}"&&m!=="${DEFAULT_COLOR_MODES.DARK}")` +
  `m=matchMedia("(prefers-color-scheme: dark)").matches?"${DEFAULT_COLOR_MODES.DARK}":"${DEFAULT_COLOR_MODES.LIGHT}";` +
  `document.documentElement.classList.add(m)}catch(e){}`;

/**
 * Blocking script that puts the light/dark class on `<html>` before the first paint.
 * The script is emitted as the innerHTML of a hidden wrapper: in server-rendered HTML the
 * parser executes it as usual, while on the client React only creates the wrapper, so it
 * never creates a `<script>` element (which React 19.3 reports) and hydration matches.
 */
export function PrePaintColorModeScript() {
  return (
    <div
      hidden
      dangerouslySetInnerHTML={{ __html: `<script>${prePaintColorModeScript}</script>` }}
    />
  );
}
