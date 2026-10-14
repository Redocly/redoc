import { isObjectType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';
import { ignoreInternalItems } from '../../utils/ignoreInternalItems.js';
import { isRootType } from '../../utils/isRootType.js';

export function buildObjectItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const typeMap = schema.getTypeMap();
  const objects = ignoreInternalItems(
    Object.values(typeMap).filter((type) => isObjectType(type) && !isRootType(type, schema)),
  );

  const items: ApiItem[] = [];

  for (const object of objects) {
    const item = createApiItem({
      name: object.name,
      variant: itemVariant.OBJECT,
      processedItems,
      filter,
      menuCommonFilter,
      source: object,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
