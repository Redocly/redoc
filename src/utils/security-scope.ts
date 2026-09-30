// Scope helpers shared by the inline security panel and the security flow detail.
// Parity with legacy openapi-docs `utils/security-scope.ts`.

export function isScopeTruncated(scope: string, maxVisibleScopeChars: number): boolean {
  return scope.length > maxVisibleScopeChars;
}

export function getVisibleScopeLabel(scope: string, maxVisibleScopeChars: number): string {
  if (isScopeTruncated(scope, maxVisibleScopeChars)) {
    return `${scope.slice(0, maxVisibleScopeChars)}...`;
  }
  return scope;
}

export function normalizeScopes(scopes?: string[]): string[] {
  if (!scopes || scopes.length === 0) {
    return [];
  }

  return Array.from(new Set(scopes.map((scope) => scope.trim()).filter(Boolean)));
}
