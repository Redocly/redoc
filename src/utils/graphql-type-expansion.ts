import type { GraphqlStoreFieldData, GraphqlTypeData } from '../types/graphql-store.js';
import type { GraphqlTypeLookup } from './graphql-samples.js';

function isLeafLikeType(data: GraphqlTypeData | undefined): boolean {
  return !data || data.variant === 'scalar';
}

function hasFields(data: GraphqlTypeData | undefined): data is GraphqlTypeData {
  return data?.variant === 'object' || data?.variant === 'interface' || data?.variant === 'input';
}

export function isGraphqlFieldExpandable(
  field: GraphqlStoreFieldData,
  fieldExpandLevel: number,
  maxFieldExpandLevel: number,
  lookup: GraphqlTypeLookup,
): boolean {
  if (fieldExpandLevel >= maxFieldExpandLevel) return false;
  const hasArgs = (field.args?.length ?? 0) > 0;
  return hasArgs || !isLeafLikeType(lookup(field.type.name));
}

export function graphqlTypeHasExpandableFields(
  data: GraphqlTypeData | undefined,
  fieldExpandLevel: number,
  maxFieldExpandLevel: number,
  lookup: GraphqlTypeLookup,
): boolean {
  if (!hasFields(data)) return false;
  return (data.fields ?? []).some((field) =>
    isGraphqlFieldExpandable(field, fieldExpandLevel, maxFieldExpandLevel, lookup),
  );
}

export function countNamedTypeFields(typeName: string, lookup: GraphqlTypeLookup): number {
  const data = lookup(typeName);
  return hasFields(data) ? (data.fields?.length ?? 0) : 0;
}
