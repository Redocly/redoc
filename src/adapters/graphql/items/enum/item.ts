import { isEnumType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';
import { ignoreInternalItems } from '../../utils/ignoreInternalItems.js';

export function buildEnumItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const typeMap = schema.getTypeMap();
  const enums = ignoreInternalItems(Object.values(typeMap).filter((type) => isEnumType(type)));

  const items: ApiItem[] = [];

  for (const value of enums) {
    const item = createApiItem({
      name: value.name,
      variant: itemVariant.ENUM,
      processedItems,
      filter,
      menuCommonFilter,
      source: value,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
