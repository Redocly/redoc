import slugify from 'slugify';

/** Spec values are untrusted: keep truthy scalars, drop objects, arrays and nullish. */
export function asString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
}

export function strikethroughText(text: string): string {
  return text
    .split('')
    .map((char) => char + '\u0335')
    .join('');
}

export function encodeBackSlashes(str: string): string {
  return str.replace(/\\/g, '%5C');
}

export function tryDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.error('Decoding failed: %s', str, e);
    return str;
  }
}

/**
 * slugify() returns empty string when failed to slugify.
 * so try to return minimum slugified-string with failed one which keeps original value
 * the regex codes are referenced with https://gist.github.com/mathewbyrne/1280286
 */
export function safeSlugify(value: string): string {
  return (
    slugify(value) ||
    value
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/(?<!-)-+$/, '')
  ); // Trim - from end of text
}

export function safeJsonParse<T = unknown>(str: string, fallback: T = {} as T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Generates href from item id
 */
export function getHref(id: string): string {
  return encodeBackSlashes(`/${id}`.toLowerCase());
}

export function getFileExtension(value: string): string {
  const parts = value.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'file';
}

export function transformStringToTelemetryId(...args: string[]): string {
  return args.join('_').replaceAll(' ', '_').replaceAll('.', '_').toLowerCase();
}
