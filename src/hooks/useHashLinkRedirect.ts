import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import type { MouseEvent } from 'react';
import type { RouteIndex } from '../utils/routing.js';

import { resolveLegacyHashToRoute } from '../utils/deep-link.js';

/** Routes a legacy in-description hash link straight to its target route on click, so the hash never blinks in the URL on the current page. */
export function useHashLinkRedirect(
  basePath: string,
  routeIndex: RouteIndex,
): (event: MouseEvent<HTMLElement>) => void {
  const navigate = useNavigate();

  return useCallback(
    (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor || anchor.origin !== window.location.origin) return;

      const targetRoute = resolveLegacyHashToRoute(anchor.hash, basePath, routeIndex);
      if (!targetRoute || targetRoute === window.location.pathname) return;

      event.preventDefault();
      navigate(targetRoute);
    },
    [basePath, routeIndex, navigate],
  );
}
