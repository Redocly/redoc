/**
 * The deep-link part of a URL fragment. Redoc standalone's hash router puts the route in the
 * fragment too (`#/route#deep-link`); a fragment holding a route alone has no deep link.
 */
export function deepLinkHash(fragment: string): string {
  if (!fragment.startsWith('#/')) return fragment;
  const deepLinkStart = fragment.indexOf('#', 1);
  return deepLinkStart === -1 ? '' : fragment.slice(deepLinkStart);
}

/** macOS percent-encodes the second `#`, so Safari and Arc relay `#/route%23deep-link`. */
export function decodeDeepLinkSeparator(fragment: string): string {
  if (!fragment.startsWith('#/') || fragment.indexOf('#', 1) !== -1) return fragment;
  const separator = fragment.indexOf('%23', 1);
  if (separator === -1) return fragment;
  return `${fragment.slice(0, separator)}#${fragment.slice(separator + '%23'.length)}`;
}
