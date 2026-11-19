import { useCallback } from 'react';
import { useAtomValue } from 'jotai';

import { routingBasePathAtom } from '../jotai/store.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../utils/url.js';

function joinToBasePath(relativePath: string, routingBasePath: string): string {
  const relative = '/' + relativePath.replace(/^\/+/, '');
  const url = routingBasePath ? joinWithSeparator(routingBasePath, relative) : relative;

  return normalizePath(url).replace(/(.)\/#/, '$1#');
}

function normalizeNavigationUrl(path: string, routingBasePath: string): string {
  const stripped = routingBasePath ? toRelativePath(path, routingBasePath) : path;
  return joinToBasePath(stripped, routingBasePath);
}

/** Resolves a route path that may already include `basePath`, such as an item's `routeSlug`. */
export function useNavigationUrlNormalizer(): (path: string) => string {
  const routingBasePath = useAtomValue(routingBasePathAtom);
  return useCallback(
    (path: string) => normalizeNavigationUrl(path, routingBasePath),
    [routingBasePath],
  );
}

/** Resolves a link from item content, which is always relative to `basePath`. */
export function useContentLinkNormalizer(): (link: string) => string {
  const routingBasePath = useAtomValue(routingBasePathAtom);
  return useCallback((link: string) => joinToBasePath(link, routingBasePath), [routingBasePath]);
}

export function useNormalizeUrl(path: string): string {
  const normalize = useNavigationUrlNormalizer();
  return normalize(path);
}
