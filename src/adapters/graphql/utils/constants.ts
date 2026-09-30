import type { GraphqlItemVariant } from '../../../types/graphql.js';

import { itemVariant } from '../../../types/common.js';

/**
 * Built-in GraphQL scalar types.
 * These are the standard scalars defined in the GraphQL specification.
 */
export const BUILT_IN_SCALARS: ReadonlySet<string> = new Set([
  'String',
  'Int',
  'Float',
  'Boolean',
  'ID',
]);

/**
 * Built-in GraphQL directives.
 * These are the standard directives defined in the GraphQL specification.
 */
export const BUILT_IN_DIRECTIVES: ReadonlySet<string> = new Set([
  'skip',
  'include',
  'deprecated',
  'specifiedBy',
  'oneOf',
]);

export const GRAPHQL_VARIANTS = [
  itemVariant.QUERY,
  itemVariant.MUTATION,
  itemVariant.SUBSCRIPTION,
  itemVariant.DIRECTIVE,
  itemVariant.OBJECT,
  itemVariant.INTERFACE,
  itemVariant.UNION,
  itemVariant.ENUM,
  itemVariant.INPUT,
  itemVariant.SCALAR,
] as const;

export const menuGroupFilterKey = {
  ITEMS: 'items',
  QUERIES: 'queries',
  MUTATIONS: 'mutations',
  SUBSCRIPTIONS: 'subscriptions',
  TYPES: 'types',
  DIRECTIVES: 'directives',
} as const;

export type MenuGroupFilterKey = (typeof menuGroupFilterKey)[keyof typeof menuGroupFilterKey];

export const MENU_GROUP_FILTER_KEYS: MenuGroupFilterKey[] = [
  menuGroupFilterKey.ITEMS,
  menuGroupFilterKey.QUERIES,
  menuGroupFilterKey.MUTATIONS,
  menuGroupFilterKey.SUBSCRIPTIONS,
  menuGroupFilterKey.TYPES,
  menuGroupFilterKey.DIRECTIVES,
];

export const DEFAULT_GROUP_LABELS: Record<GraphqlItemVariant, string> = {
  [itemVariant.QUERY]: 'Queries',
  [itemVariant.MUTATION]: 'Mutations',
  [itemVariant.SUBSCRIPTION]: 'Subscriptions',
  [itemVariant.DIRECTIVE]: 'Directives',
  [itemVariant.OBJECT]: 'Objects',
  [itemVariant.INTERFACE]: 'Interfaces',
  [itemVariant.INPUT]: 'Inputs',
  [itemVariant.UNION]: 'Unions',
  [itemVariant.ENUM]: 'Enums',
  [itemVariant.SCALAR]: 'Scalars',
} as const;
