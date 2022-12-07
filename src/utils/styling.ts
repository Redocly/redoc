import type { HTTPBadgeColors } from '../theme';

/**
 * Uses theming options to return appropriate styling for badges. Some badges may not
 * currently have custom styling.
 *
 * @param badgeColors
 * @param colorTheme
 * @returns string
 */
export function getBadgeStyles(badgeColors: HTTPBadgeColors | string, colorTheme: string): string {
  const defaultBackgroundColor = '#999999';

  // Guard for dev mode; some types temporarily appear as undefined
  if (badgeColors === undefined) return `background-color: ${defaultBackgroundColor};`;

  if (typeof badgeColors === 'string') {
    return `
      background-color: ${badgeColors || defaultBackgroundColor};
    `;
  } else {
    return `
      background-color: ${badgeColors[colorTheme].backgroundColor};
      border-color: ${badgeColors[colorTheme].borderColor};
      color: ${badgeColors[colorTheme].color};
    `;
  }
}
