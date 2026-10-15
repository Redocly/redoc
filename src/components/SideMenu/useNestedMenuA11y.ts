import { useEffect } from 'react';

import type { RefObject } from 'react';

import { syncNestedMenuA11y } from './nestedMenuMotion.js';

/** Keep `aria-hidden` in sync as the theme writes inline height styles. */
export function useNestedMenuA11y(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sync = (): void => {
      syncNestedMenuA11y(root);
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [rootRef]);
}
