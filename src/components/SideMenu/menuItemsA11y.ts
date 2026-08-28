import * as React from 'react';

export function getMenuItemsA11yProps(
  isRoot: boolean,
  expanded: boolean,
): React.HTMLAttributes<HTMLUListElement> {
  return isRoot ? { role: 'menu' } : { 'aria-hidden': !expanded };
}
