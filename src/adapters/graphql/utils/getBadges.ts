import type { GraphQLSchema } from 'graphql';
import type { Badge } from '../../../types/common.js';
import type { GraphqlItemVariant } from '../../../types/graphql.js';

import { itemVariant } from '../../../types/common.js';

export function getBadges(
  schema: GraphQLSchema,
  item: string,
  typeGroup?: GraphqlItemVariant,
): Badge[] | undefined {
  if (!typeGroup) {
    return;
  }

  if (typeGroup === itemVariant.MUTATION) {
    const mutationType = schema.getMutationType();
    const args = mutationType?.getFields()[item]?.args ?? [];

    return args && args.length > 0
      ? [{ name: args.length === 1 ? args[0].name : '(...args)' }]
      : undefined;
  }

  if (typeGroup === itemVariant.QUERY) {
    const queryType = schema.getQueryType();
    const args = queryType?.getFields()[item]?.args ?? [];
    return args && args.length > 0
      ? [{ name: args.length === 1 ? args[0].name : '(...args)' }]
      : undefined;
  }

  return;
}
