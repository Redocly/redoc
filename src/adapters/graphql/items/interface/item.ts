import { isInterfaceType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildInterfaceItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const typeMap = schema.getTypeMap();
  const interfaces = Object.values(typeMap).filter((type) => isInterfaceType(type));

  const items: ApiItem[] = [];

  for (const value of interfaces) {
    const item = createApiItem({
      name: value.name,
      variant: itemVariant.INTERFACE,
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
