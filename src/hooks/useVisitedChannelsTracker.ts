import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useLocation } from 'react-router';

import { visitedChannelsAtom } from '../jotai/app.js';

/**
 * Records visited pathnames into `visitedChannelsAtom`. Mounted once at the
 * docs root as the single `useLocation()` subscriber — per-item panels read
 * the atom instead of subscribing to the router.
 */
export function useVisitedChannelsTracker(): void {
  const location = useLocation();
  const setVisitedChannels = useSetAtom(visitedChannelsAtom);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    setVisitedChannels((prev) => (prev.includes(path) ? prev : [...prev, path]));
  }, [location.pathname, setVisitedChannels]);
}
