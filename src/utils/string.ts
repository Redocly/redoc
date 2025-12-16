import slugify from 'slugify';

export function strikethroughText(text: string): string {
  return text
    .split('')
    .map((char) => char + '\u0335')
    .join('');
}

export function escapeFormId(id: string): string {
  return id.replace(/[.[\]]/g, (m) => {
    return (
      {
        '.': '%2e',
        '[': '%5b',
        ']': '%5d',
      }[m] || ''
    );
  });
}

export function unescapeFormId(id: string): string {
  return id.replace(/%2e|%5b|%5d/g, (m) => {
    return (
      {
        '%2e': '.',
        '%5b': '[',
        '%5d': ']',
      }[m] || ''
    );
  });
}

export function encodeBackSlashes(str: string): string {
  return str.replace(/\\/g, '%5C');
}

export function removePercentChart(str: string): string {
  return str.replace(/%/g, '');
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
      .replace(/-+$/, '')
  ); // Trim - from end of text
}

export function safeJsonParse<T = unknown>(str: string, fallback: any = {}): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
