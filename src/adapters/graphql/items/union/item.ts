import { isUnionType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildUnionItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const typeMap = schema.getTypeMap();
  const unions = Object.values(typeMap).filter((type) => isUnionType(type));

  const items: ApiItem[] = [];

  for (const union of unions) {
    const item = createApiItem({
      name: union.name,
      variant: itemVariant.UNION,
      processedItems,
      filter,
      menuCommonFilter,
      source: union,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
