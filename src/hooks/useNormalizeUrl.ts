import { useCallback } from 'react';
import { useAtomValue } from 'jotai';

import { routingBasePathAtom } from '../jotai/store.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../utils/url.js';

function normalizeNavigationUrl(path: string, routingBasePath: string): string {
  const stripped = routingBasePath ? toRelativePath(path, routingBasePath) : path;
  const relative = '/' + stripped.replace(/^\/+/, '');
  const url = routingBasePath ? joinWithSeparator(routingBasePath, relative) : relative;

  return normalizePath(url).replace(/(.)\/#/, '$1#');
}

export function useNavigationUrlNormalizer(): (path: string) => string {
  const routingBasePath = useAtomValue(routingBasePathAtom);
  return useCallback(
    (path: string) => normalizeNavigationUrl(path, routingBasePath),
    [routingBasePath],
  );
}

export function useNormalizeUrl(path: string): string {
  const normalize = useNavigationUrlNormalizer();
  return normalize(path);
}
