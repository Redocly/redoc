import type { GraphQLNamedType, GraphQLSchema } from 'graphql';

export function isRootType(type: GraphQLNamedType, schema: GraphQLSchema): boolean {
  const rootTypes = [schema.getQueryType(), schema.getMutationType(), schema.getSubscriptionType()];

  return rootTypes.some((rootType) => rootType === type);
}
