import { useSyncExternalStore } from 'react';

import { URL_REPLACE_EVENT } from './useRouterHashBridge.js';
import { deepLinkHash } from './deepLinkHash.js';

type Options = {
  trackSilentReplaces?: boolean;
};

function makeSubscribe(events: readonly string[]) {
  return (callback: () => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    for (const event of events) window.addEventListener(event, callback);
    return () => {
      for (const event of events) window.removeEventListener(event, callback);
    };
  };
}

/** Router/browser hash changes only. Avoids `useLocation()`, which re-renders
 *  every consumer on any URL change even when the hash is unchanged. */
const subscribeHash = makeSubscribe(['hashchange', 'popstate']);

/** Same, plus scroll-spy's replaceState rewrites. */
const subscribeHashWithSilentReplaces = makeSubscribe([
  'hashchange',
  'popstate',
  URL_REPLACE_EVENT,
]);

function getHashSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return deepLinkHash(window.location.hash);
}

function getHashServerSnapshot(): string {
  return '';
}

/** Current URL hash. Under Redoc standalone's hash router (`#/route#deep-link`) only the
 *  trailing deep-link part, or `''` when the fragment holds a route alone. Ignores scroll-spy's
 *  silent hash clears (so hash-driven state survives) unless `trackSilentReplaces` is set. */
export function useUrlHash(options?: Options): string {
  return useSyncExternalStore(
    options?.trackSilentReplaces ? subscribeHashWithSilentReplaces : subscribeHash,
    getHashSnapshot,
    getHashServerSnapshot,
  );
}
