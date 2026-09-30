import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

import { reassertUrlHash } from './useUrlHashReassert.js';
import { deepLinkHash } from './deepLinkHash.js';

/**
 * Bridges router-driven hash changes to `useUrlHash` subscribers. React-router
 * navigations (`<Link>`, `navigate()`) go through `history.pushState`, which
 * fires no `hashchange`, so hash consumers would go stale. Mounted once at the
 * docs root as a single `useLocation()` subscriber (same pattern as
 * `VisitedChannelsTracker`), it re-dispatches one synthetic `hashchange` when
 * the hash actually changes via router navigation.
 *
 * Real `hashchange`/`popstate` events only sync the guard ref, so
 * browser-initiated hash changes are never dispatched twice. Scroll-spy URL
 * writes (`useScrollSpyUrlSync`) use raw `history.replaceState` and bypass the
 * router entirely, so scrolling never reaches this bridge — which preserves
 * the perf rationale documented in `useUrlHash`. Those silent writes do move
 * `window.location` away from the router's remembered hash, though, so
 * scroll-spy announces them via `URL_REPLACE_EVENT` and the bridge re-syncs
 * its guard ref (without notifying subscribers) — otherwise a later router
 * navigation back to the remembered hash would be treated as a no-op.
 *
 * A `hashchange` that arrives with the hash unchanged can only be synthetic: a host
 * re-landing on the current URL without routing (the portal's `loadAndNavigate` skips
 * the router when nothing in the URL changed). It is announced as a reassert.
 */

/** Fired after a raw `history.replaceState` URL write that bypasses the router. */
export const URL_REPLACE_EVENT = 'redocly:urlreplace';

export function useRouterHashBridge(): void {
  const location = useLocation();
  const prevHashRef = useRef(location.hash);
  const prevKeyRef = useRef(location.key);
  const dispatchingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncRef = (): void => {
      prevHashRef.current = deepLinkHash(window.location.hash);
    };
    const onHashChange = (): void => {
      const hash = deepLinkHash(window.location.hash);
      if (!dispatchingRef.current && hash && hash === prevHashRef.current) reassertUrlHash();
      prevHashRef.current = hash;
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', syncRef);
    window.addEventListener(URL_REPLACE_EVENT, syncRef);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', syncRef);
      window.removeEventListener(URL_REPLACE_EVENT, syncRef);
    };
  }, []);

  // Keyed on the whole location (not just its hash): after a silent
  // `URL_REPLACE_EVENT` re-sync, a navigation back to the router's remembered
  // hash changes `window.location.hash` while `location.hash` stays the same.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSameEntry = location.key === prevKeyRef.current;
    prevKeyRef.current = location.key;

    if (location.hash !== prevHashRef.current) {
      prevHashRef.current = location.hash;
      dispatchingRef.current = true;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      dispatchingRef.current = false;
      return;
    }

    if (!isSameEntry && location.hash) reassertUrlHash();
  }, [location]);
}
