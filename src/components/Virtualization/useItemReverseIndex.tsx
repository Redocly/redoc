import * as React from 'react';
import { IMenuItem } from '../..';

export interface MenuItemReverseIndexToVirtualIndex {
  [key: string]: number | undefined;
}

/**
 * Helps in calculating the Reverse Index of menu items. This will pre-compute
 * the location in the virtualized index of each menu item IDs.
 *
 * The purpose is to help for faster lookup (O(1)) when user clicks the sidebar to
 * "jump" to a certain API endpoint.
 *
 * @param menuItems array of IMenuItem to create the reverse index
 * @returns key/value of id/virtualized index
 */
const useItemReverseIndex = (menuItems: IMenuItem[]) => {
  const reverseIndexToVirtualIndex = React.useMemo(() => {
    return menuItems.reduce(
      (prev, curr, idx) => ({ ...prev, [curr.id]: idx }),
      {} as MenuItemReverseIndexToVirtualIndex,
    );

    // It is highly unlikely an API doc to change in runtime, so we would only
    // like to re-render if the API doc API quantity changes.
  }, [menuItems.length]);

  return { reverseIndexToVirtualIndex: reverseIndexToVirtualIndex };
};

export default useItemReverseIndex;
