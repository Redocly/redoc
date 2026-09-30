import { trimText } from '@redocly/theme/core/openapi';

const BREADCRUMB_MIN_LENGTH = 10;
const DROPDOWN_TRIGGER_WIDTH = 40;

type Breadcrumb = {
  name: string;
  href: string;
};

export function calculateMaxLength(
  breadcrumbs: Breadcrumb[],
  availableWidth: number,
  isCollapsed: boolean,
  measureEl: HTMLElement,
): number {
  if (!breadcrumbs.length || availableWidth <= 0) return BREADCRUMB_MIN_LENGTH;

  const fixedWidth = isCollapsed ? DROPDOWN_TRIGGER_WIDTH : 0;
  const availableForText = Math.max(0, availableWidth - fixedWidth);

  measureEl.textContent = '/';
  const separatorWidth = measureEl.scrollWidth;
  const totalSeparatorWidth = (breadcrumbs.length - 1) * separatorWidth;

  const maxNameLength = Math.max(...breadcrumbs.map((b) => b.name.length), BREADCRUMB_MIN_LENGTH);

  let low = BREADCRUMB_MIN_LENGTH;
  let high = maxNameLength;
  let maxLength = BREADCRUMB_MIN_LENGTH;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const totalWidth =
      breadcrumbs.reduce((sum, b) => {
        measureEl.textContent = trimText(b.name, mid) as string;
        return sum + measureEl.scrollWidth;
      }, 0) + totalSeparatorWidth;

    if (totalWidth <= availableForText) {
      maxLength = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return maxLength;
}
