export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function querySelector(selector: string): Element | null {
  if (typeof document !== 'undefined') {
    return document.querySelector(selector);
  }
  return null;
}

/**
 * Drop everything inside <...> (i.e., tags/elements), and keep the text.
 * Unlike browser innerText, this removes newlines; it also doesn't handle
 * un-encoded `<` or `>` characters very well, so don't feed it malformed HTML
 */
export function html2Str(html: string): string {
  return html
    .split(/<[^>]+>/)
    .map(chunk => {
      return chunk.trim();
    })
    .filter(trimmedChunk => {
      return trimmedChunk.length > 0;
    })
    .join(' ');
}
