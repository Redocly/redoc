import { useLocation as useLocationReactRouter } from 'react-router-dom';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { tryDecodeURIComponent } from '../utils/string.js';
import { normalizePath } from '../utils/path.js';
import { appStore } from '../jotai/app.js';

// Hash router incorrect handle useLocation hook when url contains more than one hash
export function useLocation() {
  const { router } = useAtomValue(appStore);
  const location = useLocationReactRouter();
  const [pathname, hash] = useMemo(() => {
    const decodedPathname = tryDecodeURIComponent(normalizePath(location.pathname));
    return decodedPathname.includes('#')
      ? decodedPathname.split('#', 2)
      : [decodedPathname, location.hash];
  }, [location.hash, location.pathname]);

  if (router !== 'hash') {
    return location;
  }

  return {
    ...location,
    pathname,
    hash: hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '',
  };
}
