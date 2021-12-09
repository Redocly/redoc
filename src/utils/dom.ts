export const IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;

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

// Alternate scrollIntoViewIfNeeded implementation.
// Used in all cases, since it seems Chrome's implementation is buggy
// when "Experimental Web Platform Features" is enabled (at least of version 96).
// See #1714, #1742

export function scrollIntoViewIfNeeded(el: HTMLElement, centerIfNeeded = true) {
  const parent = el.parentNode as HTMLElement | null;
  if (!parent) {
    return;
  }
  const parentComputedStyle = window.getComputedStyle(parent, undefined);
  const parentBorderTopWidth = parseInt(
    parentComputedStyle.getPropertyValue('border-top-width'),
    10,
  );
  const parentBorderLeftWidth = parseInt(
    parentComputedStyle.getPropertyValue('border-left-width'),
    10,
  );
  const overTop = el.offsetTop - parent.offsetTop < parent.scrollTop;
  const overBottom =
    el.offsetTop - parent.offsetTop + el.clientHeight - parentBorderTopWidth >
    parent.scrollTop + parent.clientHeight;
  const overLeft = el.offsetLeft - parent.offsetLeft < parent.scrollLeft;
  const overRight =
    el.offsetLeft - parent.offsetLeft + el.clientWidth - parentBorderLeftWidth >
    parent.scrollLeft + parent.clientWidth;
  const alignWithTop = overTop && !overBottom;

  if ((overTop || overBottom) && centerIfNeeded) {
    parent.scrollTop =
      el.offsetTop -
      parent.offsetTop -
      parent.clientHeight / 2 -
      parentBorderTopWidth +
      el.clientHeight / 2;
  }

  if ((overLeft || overRight) && centerIfNeeded) {
    parent.scrollLeft =
      el.offsetLeft -
      parent.offsetLeft -
      parent.clientWidth / 2 -
      parentBorderLeftWidth +
      el.clientWidth / 2;
  }

  if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
    el.scrollIntoView(alignWithTop);
  }
}
