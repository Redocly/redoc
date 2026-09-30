import type { GraphQLConfig, LayoutVariant } from '@redocly/config';
import type { GraphQLSchema } from 'graphql';
import type { ApiDocsOptions } from './options.js';

export type GraphQLInfo = {
  title?: string;
  version?: string;
  description?: string;
  termsOfService?: string;
  contact?: GraphQLContact;
  license?: GraphQLLicense;
};

export type GraphQLContact = {
  name?: string;
  url?: string;
  email?: string;
};

export type GraphQLLicense = {
  name?: string;
  url?: string;
  identifier?: string;
};

export type PaginationType = 'none' | 'section' | 'item';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type BaseRequired = WithRequired<
  GraphQLConfig,
  'jsonSamplesDepth' | 'samplesMaxInlineArgs' | 'fieldExpandLevel'
>;

export type GraphQLOptions = Omit<BaseRequired, 'layout'> & {
  layout: LayoutVariant;
  info?: GraphQLInfo;
  menu?: GraphQLConfig['menu'];
};

export type GraphqlItemVariant =
  | 'query'
  | 'mutation'
  | 'subscription'
  | 'directive'
  | 'object'
  | 'interface'
  | 'input'
  | 'union'
  | 'enum'
  | 'scalar';

export type ItemNameSpec = string | RegExp;

export type TypeGroupFilter = {
  includeByName?: ItemNameSpec[];
  excludeByName?: ItemNameSpec[];
};

export type MenuGroupFilterKey =
  | 'items'
  | 'queries'
  | 'mutations'
  | 'subscriptions'
  | 'types'
  | 'directives';

export type MenuGroupConfig = {
  name: string;
} & Partial<Record<MenuGroupFilterKey, TypeGroupFilter>>;

export type MenuConfig = {
  requireExactGroups?: boolean;
  otherItemsGroupName?: string;
  groups?: MenuGroupConfig[];
};

export type GraphqlBuildContext = {
  basePath: string;
  schema: GraphQLSchema;
  menuConfig?: MenuConfig;
  options: ApiDocsOptions;
  processContent: boolean;
};
