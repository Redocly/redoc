import type { Location } from 'react-router-dom';

import { tryDecodeURIComponent } from './string.js';

export function pathIncludesLink(location: Location, link?: string): boolean {
  return link
    ? tryDecodeURIComponent(location.pathname + location.hash).includes(
        tryDecodeURIComponent(link.toLowerCase()),
      )
    : false;
}

export function pathMatchedLink(location: Location, link: string = ''): boolean {
  const lowercaseLink = tryDecodeURIComponent(link.toLowerCase());
  return (
    tryDecodeURIComponent(location.pathname) === lowercaseLink ||
    tryDecodeURIComponent(location.hash) === lowercaseLink ||
    tryDecodeURIComponent(location.pathname + location.hash) === lowercaseLink
  );
}

export function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  return path;
}
