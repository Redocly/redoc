import type { Node } from '@markdoc/markdoc';

/** Raw when the store was built without a markdown parser (`buildGraphqlStoreFromSdl`). */
export type GraphqlDescription = string | Node | Node[];

export type GraphqlTypeRef = {
  display: string;
  name: string;
  isList: boolean;
  isNonNull: boolean;
  isListNonNull: boolean;
};

export type GraphqlRequiresScopes = {
  scopes: string[][];
};

export type GraphqlStoreFieldData = {
  name: string;
  type: GraphqlTypeRef;
  description?: GraphqlDescription;
  deprecationReason?: string;
  defaultValue?: unknown;
  required?: boolean;
  args?: GraphqlStoreFieldData[];
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlEnumValueData = {
  name: string;
  description?: GraphqlDescription;
  deprecationReason?: string;
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlTypeDataVariant = 'object' | 'interface' | 'input' | 'union' | 'enum' | 'scalar';

export type GraphqlTypeData = {
  variant: GraphqlTypeDataVariant;
  name: string;
  description?: GraphqlDescription;
  fields?: GraphqlStoreFieldData[];
  enumValues?: GraphqlEnumValueData[];
  possibleTypes?: string[];
  interfaces?: string[];
  isOneOf?: true;
  specifiedByUrl?: string;
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlDirectiveData = {
  name: string;
  description?: GraphqlDescription;
  locations: string[];
  args?: GraphqlStoreFieldData[];
  isRepeatable?: boolean;
};

export type GraphqlTypeReference = {
  name: string;
  field?: string;
};

export type GraphqlStoreMeta = {
  rootTypes: {
    query?: string;
    mutation?: string;
    subscription?: string;
  };
};

export const GRAPHQL_TYPE_ENTRY_PREFIX = 'types/';
const GRAPHQL_DIRECTIVE_ENTRY_PREFIX = 'directives/';

export function graphqlTypeEntryId(typeName: string): string {
  return `${GRAPHQL_TYPE_ENTRY_PREFIX}${typeName}`;
}

export function graphqlDirectiveEntryId(directiveName: string): string {
  return `${GRAPHQL_DIRECTIVE_ENTRY_PREFIX}${directiveName}`;
}
