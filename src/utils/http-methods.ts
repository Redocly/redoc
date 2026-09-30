/**
 * OpenAPI operation (HTTP method) keys recognized on a path item, including
 * the OpenAPI 3.2 `query` / vendor `x-query` operations. Shared by the
 * adapter build context and the public `isOperationName` guard.
 */
export const HTTP_METHODS: ReadonlySet<string> = new Set([
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
  'trace',
  'query',
  'x-query',
]);

/** Returns `true` when `key` names an OpenAPI operation on a path item. */
export function isOperationName(key: string): boolean {
  return HTTP_METHODS.has(key.toLowerCase());
}
