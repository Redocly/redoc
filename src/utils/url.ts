export function joinWithSeparator(base = '', path = '', sep = '/'): string {
  if (base.endsWith(sep) && base !== sep) {
    base = base.slice(0, -sep.length);
  }

  if (path.startsWith(sep)) {
    path = path.slice(sep.length);
  }

  if (!base || !path || base === sep) {
    return base + path;
  }

  return base + sep + path;
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

export function stripLeadingSlash(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

/**
 * The relative item slug used as the wrapper element id (e.g. `pet/getpetbyid`).
 * Legacy openapi-docs stamped this id, and e2e/consumer locators depend on it.
 */
export function toElementId(itemPath: string, basePath: string): string | undefined {
  return stripLeadingSlash(toRelativePath(itemPath, basePath)) || undefined;
}

export function toRelativePath(absolutePath: string, basePath: string): string {
  if (!basePath) {
    return absolutePath;
  }
  const normalizedAbsolute = normalizePath(absolutePath);
  const normalizedBase = normalizePath(basePath);
  if (normalizedAbsolute === normalizedBase) {
    return '';
  }
  if (normalizedAbsolute.startsWith(normalizedBase + '/')) {
    return normalizedAbsolute.slice(normalizedBase.length + 1);
  }
  return absolutePath;
}
