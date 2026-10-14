import { isScalarType } from 'graphql';

import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { BUILT_IN_SCALARS } from '../../utils/constants.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildScalarItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema, options } = graphqlContext.get();
  const showBuiltInScalars = options.showBuiltInScalars === true;
  const typeMap = schema.getTypeMap();
  const scalars = Object.values(typeMap).filter((type) => isScalarType(type));

  const items: ApiItem[] = [];

  for (const scalar of scalars) {
    if (!showBuiltInScalars && BUILT_IN_SCALARS.has(scalar.name)) {
      continue;
    }

    const item = createApiItem({
      name: scalar.name,
      variant: itemVariant.SCALAR,
      processedItems,
      filter,
      menuCommonFilter,
      source: scalar,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
