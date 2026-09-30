import { useEffect, useRef } from 'react';

import type { RefObject } from 'react';

import { IS_BROWSER } from '@redocly/theme/core/openapi';

/** Gestures that mean the user is scrolling (not a programmatic scroll). */
export const USER_SCROLL_INTENT_EVENTS = ['wheel', 'touchmove', 'keydown', 'mousedown'] as const;

/** Keys that scroll the page — anything else is typing or focus navigation. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** Cumulative wheel distance below this is trackpad noise (resting fingers
 *  emit 1-10px ticks), not intent. One physical mouse-wheel notch (~100px, or
 *  3 lines in line-mode) crosses it immediately. Shared with the anchor-drift
 *  tolerance in useApiDocsScroll so the two intent signals agree. */
export const WHEEL_INTENT_THRESHOLD_PX = 48;

function isScrollIntentEvent(event: Event): boolean {
  if (event.type === 'mousedown') return event.target === document.documentElement;
  if (event.type === 'keydown') return SCROLL_KEYS.has((event as KeyboardEvent).key);
  return true;
}

/** A real gesture's wheel ticks arrive in a rapid burst; ticks separated by
 *  more than this are resting-finger noise and must not accumulate into intent. */
const WHEEL_IDLE_RESET_MS = 200;

/** Stateful intent classifier for one settle window / navigation: wheel
 *  deltas accumulate up to {@link WHEEL_INTENT_THRESHOLD_PX} before counting
 *  as intent; touchmove, scroll keys, and scrollbar drags count immediately.
 *  Without the accumulation, a single 2px trackpad tick during the lazy-mount
 *  layout pump opens the scroll-spy gate and cancels deep-link anchoring, so
 *  landing on a section route rewrites the URL to a neighboring section. */
export function createScrollIntentTracker(): (event: Event) => boolean {
  let wheelDistance = 0;
  let lastWheelAt = 0;
  return (event: Event): boolean => {
    if (event.type === 'wheel') {
      const { deltaY, deltaMode } = event as WheelEvent;
      // Real browsers always set deltaY; a synthetic event without one is a
      // deliberate "user scrolled" signal, not noise.
      if (!Number.isFinite(deltaY)) return true;
      // Only a contiguous gesture accumulates — drop the tally after an idle
      // gap so sporadic noise never sums up to the threshold over a long window.
      if (lastWheelAt && event.timeStamp - lastWheelAt > WHEEL_IDLE_RESET_MS) {
        wheelDistance = 0;
      }
      lastWheelAt = event.timeStamp;
      // deltaMode: 0 = pixels, 1 = lines (~16px), 2 = pages (always intent).
      const scale = deltaMode === 1 ? 16 : deltaMode === 2 ? WHEEL_INTENT_THRESHOLD_PX : 1;
      wheelDistance += Math.abs(deltaY) * scale;
      return wheelDistance >= WHEEL_INTENT_THRESHOLD_PX;
    }
    return isScrollIntentEvent(event);
  };
}

/** Ref (`.current`) that flips true once the user scrolls; re-arms whenever
 *  `resetKey` changes (pass `location.key` to re-arm per navigation). */
export function useUserScrollIntent(resetKey: string): RefObject<boolean> {
  const scrolledRef = useRef(false);

  useEffect(() => {
    if (!IS_BROWSER) return;
    scrolledRef.current = false;
    const isIntent = createScrollIntentTracker();
    const onIntent = (event: Event): void => {
      if (isIntent(event)) scrolledRef.current = true;
    };
    for (const event of USER_SCROLL_INTENT_EVENTS) {
      window.addEventListener(event, onIntent, { passive: true });
    }
    return () => {
      for (const event of USER_SCROLL_INTENT_EVENTS) {
        window.removeEventListener(event, onIntent);
      }
    };
  }, [resetKey]);

  return scrolledRef;
}
