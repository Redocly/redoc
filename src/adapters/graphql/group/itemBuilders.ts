import type { GraphqlItemVariant } from '../../../types/graphql.js';
import type { ApiItem } from '../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../items/types.js';

import { itemVariant } from '../../../types/common.js';
import { buildDirectiveItems } from '../items/directive/item.js';
import { buildEnumItems } from '../items/enum/item.js';
import { buildInputItems } from '../items/input/item.js';
import { buildInterfaceItems } from '../items/interface/item.js';
import { buildMutationItems } from '../items/mutation/item.js';
import { buildObjectItems } from '../items/object/item.js';
import { buildQueryItems } from '../items/query/item.js';
import { buildScalarItems } from '../items/scalar/item.js';
import { buildSubscriptionItems } from '../items/subscription/item.js';
import { buildUnionItems } from '../items/union/item.js';

export type GraphqlMenuGroupItemsBuilder = (args?: GraphqlMenuGroupItemsBuildParams) => ApiItem[];

export const GRAPHQL_MENU_GROUP_ITEM_BUILDERS: Record<
  GraphqlItemVariant,
  GraphqlMenuGroupItemsBuilder
> = {
  [itemVariant.QUERY]: buildQueryItems,
  [itemVariant.MUTATION]: buildMutationItems,
  [itemVariant.SUBSCRIPTION]: buildSubscriptionItems,
  [itemVariant.DIRECTIVE]: buildDirectiveItems,
  [itemVariant.OBJECT]: buildObjectItems,
  [itemVariant.INTERFACE]: buildInterfaceItems,
  [itemVariant.INPUT]: buildInputItems,
  [itemVariant.UNION]: buildUnionItems,
  [itemVariant.ENUM]: buildEnumItems,
  [itemVariant.SCALAR]: buildScalarItems,
};
