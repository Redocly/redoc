import type { TypeGroupFilter } from '../../../types/graphql.js';

export type GraphqlMenuGroupItemsBuildParams = {
  filter?: TypeGroupFilter;
  processedItems?: Set<string>;
  menuCommonFilter?: TypeGroupFilter;
  parentPath?: string;
};
