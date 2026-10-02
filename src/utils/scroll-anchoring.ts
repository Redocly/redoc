import { SECTION_READING_LINE_OFFSET } from '@redocly/theme/core/openapi';

import { IS_BROWSER } from './environments.js';
import { SECTION_ATTR } from '../constants/openapi.js';

let pending = false;

/** Keeps the section under the reading line in view across a content-height swap
 *  (response code, oneOf, media type, example selection). Call synchronously from
 *  the state write. */
export function keepReadingSectionAnchored(): void {
  if (!IS_BROWSER || pending) return;
  const section = findReadingSection();
  if (!section) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    if (!section.isConnected) return;
    const { top, bottom } = section.getBoundingClientRect();
    if (bottom <= 0 || top >= window.innerHeight) {
      section.scrollIntoView({ block: 'nearest' });
    }
  });
}

/** Top-level section row under the reading line. */
function findReadingSection(): Element | null {
  for (const el of document.querySelectorAll(`[${SECTION_ATTR}]`)) {
    if (el.parentElement?.closest(`[${SECTION_ATTR}]`)) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= SECTION_READING_LINE_OFFSET && rect.bottom > SECTION_READING_LINE_OFFSET)
      return el;
  }
  return null;
}
