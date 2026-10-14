import type { ApiItem } from '../../../types/store.js';

import { GRAPHQL_VARIANTS } from '../utils/constants.js';
import { GRAPHQL_MENU_GROUP_ITEM_BUILDERS } from './itemBuilders.js';
import { createGroup } from './utils.js';

export function groupByDefault(): ApiItem[] {
  const groups: ApiItem[] = [];

  for (const typeGroup of GRAPHQL_VARIANTS) {
    const items = GRAPHQL_MENU_GROUP_ITEM_BUILDERS[typeGroup]();
    if (items.length > 0) {
      groups.push(createGroup({ typeGroup, items }));
    }
  }

  return groups;
}
