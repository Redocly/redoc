// OpenAPI Responses Object keys we treat as real responses: a numeric status code,
// `default`, or an `Nxx` range wildcard. Everything else (vendor `x-*` extensions, the
// platform marker, stray keys) is excluded from response lists, tabs, and samples.
export function isStatusCode(code: string): boolean {
  return code === 'default' || /^\d+$/.test(code) || /^[1-5]xx$/i.test(code);
}
