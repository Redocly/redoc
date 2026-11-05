/** Keywords next to a `$ref` apply from OpenAPI 3.1 on; Swagger 2.0 and OpenAPI 3.0 ignore them. */
export function openapiAppliesRefSiblings(openapi: string | undefined): boolean {
  const [major, minor] = String(openapi ?? '')
    .split('.')
    .map((part) => Number.parseInt(part, 10));
  return major > 3 || (major === 3 && minor >= 1);
}
