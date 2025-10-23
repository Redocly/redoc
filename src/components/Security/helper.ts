import type { SecurityRequirement } from '../../models/index.js';

export function getRequiredScopes(id: string, securities: SecurityRequirement[]): string[] {
  const allScopes = new Set<string>();

  securities.forEach(({ schemes }) => {
    schemes.forEach(({ id: schemeId, scopes }) => {
      if (schemeId === id) {
        scopes.forEach((scope) => allScopes.add(scope));
      }
    });
  });

  return Array.from(allScopes);
}

export function getOptionalScopes(requiredScopes: string[], allScopes: string[]): string[] {
  const requiredScopesSet = new Set(requiredScopes);
  return allScopes.filter((scope) => !requiredScopesSet.has(scope));
}
