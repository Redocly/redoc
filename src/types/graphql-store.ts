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
  description?: string;
  deprecationReason?: string;
  defaultValue?: unknown;
  required?: boolean;
  args?: GraphqlStoreFieldData[];
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlEnumValueData = {
  name: string;
  description?: string;
  deprecationReason?: string;
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlTypeDataVariant = 'object' | 'interface' | 'input' | 'union' | 'enum' | 'scalar';

export type GraphqlTypeData = {
  variant: GraphqlTypeDataVariant;
  name: string;
  description?: string;
  fields?: GraphqlStoreFieldData[];
  enumValues?: GraphqlEnumValueData[];
  possibleTypes?: string[];
  interfaces?: string[];
  specifiedByUrl?: string;
  requiresScopes?: GraphqlRequiresScopes;
};

export type GraphqlDirectiveData = {
  name: string;
  description?: string;
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
export const GRAPHQL_DIRECTIVE_ENTRY_PREFIX = 'directives/';

export function graphqlTypeEntryId(typeName: string): string {
  return `${GRAPHQL_TYPE_ENTRY_PREFIX}${typeName}`;
}

export function graphqlDirectiveEntryId(directiveName: string): string {
  return `${GRAPHQL_DIRECTIVE_ENTRY_PREFIX}${directiveName}`;
}
