import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useHref, useLocation } from 'react-router';

import { IS_BROWSER, useActiveSectionId } from '@redocly/theme/core/openapi';

import { activeScrollSectionAtom } from '../jotai/app.js';
import { routingBasePathAtom } from '../jotai/store.js';
import { encodeBackSlashes } from '../utils/string.js';
import { normalizePath } from '../utils/url.js';
import { useUserScrollIntent } from './useUserScrollIntent.js';
import { URL_REPLACE_EVENT } from './useRouterHashBridge.js';

/** Rewrites the URL without router/native events, then lets the router-hash
 *  bridge re-sync its guard ref (subscribers are deliberately not notified). */
function replaceUrlSilently(url: string): void {
  window.history.replaceState({}, '', url);
  window.dispatchEvent(new Event(URL_REPLACE_EVENT));
}

/** Silently rewrites the URL to the section under the viewport while scrolling.
 *  Mounted once in `RouterSubscribers` so it runs in both the portal and standalone. */
export function useScrollSpyUrlSync(): void {
  const location = useLocation();
  const setActiveScrollSection = useSetAtom(activeScrollSectionAtom);
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const activeSectionId = useActiveSectionId(location, false, false);

  // `#/section` under a hash router, `/section` under a browser router.
  const sectionHref = useHref(normalizePath(encodeBackSlashes(activeSectionId || '/')));

  // Gates the URL rewrite below so a deep-linked URL survives until the user scrolls.
  const userScrolled = useUserScrollIntent(location.key);

  // Drop any stale scroll-active value until the next scroll-spy update lands.
  useEffect(() => {
    setActiveScrollSection(null);
  }, [location.pathname, setActiveScrollSection]);

  useEffect(() => {
    if (!IS_BROWSER || !activeSectionId) return;

    // Until the user scrolls, the sidebar and the URL both stay on the freshly navigated
    // target: while the page settles the section under the reading line is a different one,
    // and a target at the end of the page never reaches that line at all.
    if (!userScrolled.current) return;

    setActiveScrollSection(activeSectionId);

    // The base path always wins; any other section only when the URL doesn't already show it.
    if (
      activeSectionId === routingBasePath ||
      (!window.location.pathname.includes(activeSectionId) &&
        !window.location.hash.includes(activeSectionId))
    ) {
      replaceUrlSilently(sectionHref);
    }
  }, [activeSectionId, sectionHref, routingBasePath, setActiveScrollSection, userScrolled]);
}
