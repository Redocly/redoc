import { isInputObjectType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildInputItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const typeMap = schema.getTypeMap();
  const inputs = Object.values(typeMap).filter((type) => isInputObjectType(type));

  const items: ApiItem[] = [];

  for (const input of inputs) {
    const item = createApiItem({
      name: input.name,
      variant: itemVariant.INPUT,
      processedItems,
      filter,
      menuCommonFilter,
      source: input,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
