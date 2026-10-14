import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { tryDecodeURIComponent } from '../utils/string.js';
import { normalizePath } from '../utils/url.js';

function computeIsExpandedFromPathname(id: string, pathname: string): boolean {
  const decodedPathname = tryDecodeURIComponent(normalizePath(pathname));
  const normalizedId = normalizePath(id);
  const idsToCheck = [normalizedId, tryDecodeURIComponent(normalizedId)];

  return idsToCheck.some((idToCheck) => {
    return (
      decodedPathname === idToCheck ||
      decodedPathname.endsWith(idToCheck) ||
      decodedPathname.includes(idToCheck + '/')
    );
  });
}

export function useIsExpanded(id: string): boolean {
  const location = useLocation();
  return useMemo(
    () => computeIsExpandedFromPathname(id, location.pathname),
    [id, location.pathname],
  );
}
