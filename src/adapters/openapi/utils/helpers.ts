import { urlParse } from './url.js';

export function stripTrailingSlash(path: string): string {
  if (path.endsWith('/')) {
    return path.substring(0, path.length - 1);
  }
  return path;
}

export function isNumeric(value: unknown): value is number {
  return !isNaN(parseFloat(value as string)) && isFinite(value as number);
}

export function isAbsoluteUrl(url: string): boolean {
  return /(?:^[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}

/**
 * simple resolve URL which doesn't break on strings with url fragments
 * e.g. resolveUrl('http://test.com:{port}', 'path') results in http://test.com:{port}/path
 */
export function resolveUrl(url: string, to: string): string {
  let res;
  if (to.startsWith('//')) {
    res = `${urlParse(url, true)?.protocol || 'https:'}${to}`;
  } else if (isAbsoluteUrl(to)) {
    res = to;
  } else if (!to.startsWith('/')) {
    res = stripTrailingSlash(url) + '/' + to;
  } else {
    const parsedUrl = urlParse(url);
    if (parsedUrl) {
      parsedUrl.pathname = to;
      res = parsedUrl.toString();
    } else {
      res = to;
    }
  }
  return stripTrailingSlash(res);
}

export function titleize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function removeQueryStringAndHash(serverUrl: string): string {
  try {
    if (!serverUrl) {
      return '';
    }
    const url = new URL(serverUrl);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    // when using with redoc-cli serverUrl can be empty resulting in crash
    return serverUrl;
  }
}

export function escapeHTMLAttrChars(str: string): string {
  return str.replace(/["\\]/g, '\\$&');
}

export function sanitizeItemId(id: string): string {
  // we probably need to replace other symbols too
  return id && id.replace(/#/g, '_').toLowerCase();
}

export function get<T = unknown>(
  object: GenericObject = {},
  path: string | Array<string>,
  defval?: T,
): T | unknown {
  if (typeof path === 'string') path = path.split('.');
  return path.reduce<unknown>(
    (xs: unknown, x: string) =>
      xs && typeof xs === 'object' && x in xs ? (xs as GenericObject)[x] : defval,
    object,
  );
}

const DEFINITION_NAME_REGEX = /^#\/components\/(schemas|pathItems)\/([^/]+)$/;

export function getDefinitionName(pointer?: string): string | undefined {
  return pointer?.match(DEFINITION_NAME_REGEX)?.pop();
}
