import type { GraphqlRequiresScopes } from '../types/graphql-store.js';

export interface RequiresScopesDirective {
  scopes: string[][];
  parentScopes?: string[][];
}

export function mergeRequiresScopes(
  fieldScopes: GraphqlRequiresScopes | null | undefined,
  parentScopes: GraphqlRequiresScopes | null | undefined,
): RequiresScopesDirective | null {
  if (!fieldScopes && !parentScopes) {
    return null;
  }

  if (fieldScopes && !parentScopes) {
    return { scopes: fieldScopes.scopes };
  }

  if (!fieldScopes && parentScopes) {
    return {
      scopes: [],
      parentScopes: parentScopes.scopes,
    };
  }

  return {
    scopes: fieldScopes?.scopes ?? [],
    parentScopes: parentScopes?.scopes ?? [],
  };
}
