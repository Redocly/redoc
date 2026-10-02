import type { RawLogo, SidebarLogo } from '../types/common.js';

/**
 * Normalizes an authored `{ url }` logo (OpenAPI `info.x-logo`, the standalone `logo` prop) into
 * the `{ imageUrl }` shape the sidebar renders. `hrefFallback` covers OpenAPI's `info.contact.url`,
 * as legacy did. Without an image there is nothing to render, hence `undefined` — which is also
 * what lets callers fall through to the next logo source with `??`.
 */
export function toSidebarLogo(
  raw: RawLogo | undefined,
  hrefFallback?: string,
): SidebarLogo | undefined {
  if (!raw?.url) {
    return undefined;
  }
  return {
    imageUrl: raw.url,
    href: raw.href || hrefFallback,
    altText: raw.altText,
    backgroundColor: raw.backgroundColor,
  };
}
