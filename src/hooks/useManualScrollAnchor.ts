import { useLayoutEffect, useRef } from 'react';

import type { RefObject } from 'react';

/** Whether the browser implements the CSS scroll-anchoring spec
 *  (`overflow-anchor: auto`). Chrome, Firefox, and Edge: yes. Safari: no.
 *  Evaluated once at module load — the answer never changes within a session
 *  and `CSS.supports` is expensive to call repeatedly. */
const HAS_NATIVE_SCROLL_ANCHORING: boolean =
  typeof window !== 'undefined' &&
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('overflow-anchor', 'auto');

/**
 * Manual scroll anchoring for browsers without native `overflow-anchor`
 * support (Safari). On the placeholder→content swap, if the element is above
 * the viewport, adjust `scrollY` by the height delta in a `useLayoutEffect`
 * — before the browser paints — so the user sees no jump.
 *
 * No-op on browsers that implement native scroll anchoring (they handle this
 * automatically and our manual adjustment would compound theirs into a
 * double-shift).
 */
export function useManualScrollAnchor({
  ref,
  mounted,
  placeholderHeight,
}: {
  ref: RefObject<HTMLElement | null>;
  /** `true` once the real content is rendered (replacing the placeholder). */
  mounted: boolean;
  /** Height the placeholder reserved before the swap. The element's measured
   *  height minus this gives the delta to compensate. */
  placeholderHeight: number;
}): void {
  // Track the placeholder→content swap so we only anchor scroll once per swap.
  const prevMountedRef = useRef<boolean>(mounted);

  useLayoutEffect(() => {
    if (HAS_NATIVE_SCROLL_ANCHORING) return;
    if (!mounted) {
      prevMountedRef.current = false;
      return;
    }
    if (prevMountedRef.current) return;
    prevMountedRef.current = true;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0) return;
    const delta = rect.height - placeholderHeight;
    if (delta === 0) return;
    window.scrollBy(0, delta);
  }, [mounted, ref, placeholderHeight]);
}
