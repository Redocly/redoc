type XLogo = {
  url?: string;
  href?: string;
  altText?: string;
  backgroundColor?: string;
};

export type LogoConfig = XLogo;

/**
 * Derives the sidebar logo config from the spec's `info['x-logo']`
 * extension, falling back to `info.contact.url` for the link.
 */
export function logoFromSpec(
  spec: Record<string, unknown> | string | undefined,
): LogoConfig | undefined {
  if (typeof spec === 'string') {
    return undefined;
  }
  const info = spec?.info as Record<string, unknown> | undefined;
  const xLogo = info?.['x-logo'] as XLogo | undefined;
  if (!xLogo?.url) {
    return undefined;
  }
  const contact = info?.contact as { url?: string } | undefined;
  return {
    url: xLogo.url,
    href: xLogo.href || contact?.url,
    altText: xLogo.altText,
    backgroundColor: xLogo.backgroundColor,
  };
}
