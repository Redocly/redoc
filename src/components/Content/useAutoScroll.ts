import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

import {
  addLeadingSlash,
  removeLeadingSlash,
  useActiveSectionId,
} from '@redocly/theme/core/openapi';

import { compose, encodeBackSlashes, tryDecodeURIComponent } from '../../utils/index.js';
import { IS_BROWSER } from '../../utils/dom.js';
import { useLocation } from '../../hooks/useLocation.js';
import { appStore } from '../../jotai/app.js';

let initialPageLoad = true;

export function useAutoScroll(routingBasePath: string): void {
  const location = useLocation();
  const basePath = routingBasePath || '/';
  const { router } = useAtomValue(appStore);

  useEffect(() => {
    if (location.pathname === basePath && location.hash === '') {
      window.scrollTo(0, 0);
      return;
    }
    const pathname = removeLeadingSlash(location.pathname.replace(basePath, ''));
    const legacyHash = getLegacyHash(location.hash);
    const element = legacyHash
      ? getElementById(pathname + legacyHash) ||
        document.querySelector(`[id$="${removeLeadingSlash(legacyHash)}"]`) // handle scroll to operation by legacy hash route
      : getElementById(location.hash.replace('#', '')) || getElementById(pathname);

    if (element) {
      element.scrollIntoView();
    }
  }, [location.pathname, location.hash, basePath]);

  const activeSectionId = useActiveSectionId(location, false, false, 50);

  useEffect(() => {
    if (activeSectionId !== undefined && initialPageLoad) {
      initialPageLoad = false;
      return;
    }

    if (activeSectionId === '' && IS_BROWSER) {
      // handle case with deep link
      if (window.location.href?.split('#')?.length > (router === 'hash' ? 2 : 1)) {
        return;
      }

      let url = basePath;

      if (router === 'hash') {
        url = window.location.href?.split('#')?.[0];
      }

      try {
        window.history.replaceState({}, '', url);
      } catch {
        // ignore history API errors
        return;
      }

      return;
    }

    const url = getUrlByRouter(router, activeSectionId, basePath);
    if (url === undefined) {
      return;
    }

    if (
      IS_BROWSER &&
      !window.location.pathname.includes(activeSectionId) &&
      !window.location.hash.includes(activeSectionId)
    ) {
      try {
        window.history.replaceState({}, '', url);
      } catch {
        // ignore history API errors
        return;
      }
    }
  }, [activeSectionId, basePath, router]);
}

export function getElementById(id: string) {
  return document.getElementById(tryDecodeURIComponent(id));
}

export function getLegacyHash(hash: string) {
  const patterns = ['#tag', '#operation', '#paths'];

  for (const pattern of patterns) {
    if (hash.includes(pattern)) {
      return hash.replace(pattern, '').toLowerCase();
    }
  }

  return '';
}

function getUrlByRouter(
  router: string,
  activeSectionId: string,
  basePath: string,
): string | undefined {
  if (router !== 'hash') {
    if (activeSectionId === '') {
      return basePath;
    }
    return compose(addLeadingSlash, encodeBackSlashes)(activeSectionId);
  }

  let url: string;
  const isFileProtocol = window.location.protocol === 'file:';

  if (isFileProtocol && IS_BROWSER) {
    const baseUrl = window.location.href.split('#')[0];
    url = `${baseUrl}#${activeSectionId}`;
  } else {
    url = compose(addLeadingSlash, encodeBackSlashes)(`#/${activeSectionId}`);
  }

  return url;
}
