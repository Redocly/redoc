import type { OpenAPIServer } from '../../types/openapi.js';

import {
  isAbsoluteUrl,
  removeQueryStringAndHash,
  resolveUrl,
} from '../../adapters/openapi/utils/helpers.js';
import { getUrlDirname } from '../../adapters/openapi/utils/url.js';
import { IS_BROWSER } from '../../utils/environments.js';

function dirnameFromPath(pathLike: string): string {
  const withoutQuery = removeQueryStringAndHash(pathLike);
  if (!withoutQuery || withoutQuery.endsWith('/')) {
    return withoutQuery;
  }

  const lastSlashIndex = withoutQuery.lastIndexOf('/');
  return lastSlashIndex === -1 ? '' : withoutQuery.slice(0, lastSlashIndex);
}

function getBaseUrl(specUrl: string | undefined): string | undefined {
  const getHref = (): string => {
    if (!IS_BROWSER) {
      return (globalThis as { SSR_HOSTNAME?: string }).SSR_HOSTNAME || '';
    }
    const href = window.location.href;
    return href.endsWith('.html') ? getUrlDirname(href) || href : href;
  };

  return specUrl === undefined
    ? removeQueryStringAndHash(getHref())
    : isAbsoluteUrl(specUrl)
      ? getUrlDirname(specUrl)
      : dirnameFromPath(specUrl);
}

export function resolveServerUrl(url: string, specUrl?: string): string {
  const baseUrl = getBaseUrl(specUrl);
  return baseUrl ? resolveUrl(baseUrl, url) : url;
}

export function normalizeServers(
  specUrl: string | undefined,
  servers: OpenAPIServer[],
): OpenAPIServer[] {
  let nextServers = servers;
  if (nextServers.length === 0) {
    nextServers = [{ url: '/' }];
  }

  return nextServers.map((server) => ({
    ...server,
    url: resolveServerUrl(server.url, specUrl),
    description: server.description || '',
  }));
}
