export function toSamplerSpec(
  resolvedSchemas: Record<string, unknown>,
  openapiVersion = '3.0.0',
): Record<string, unknown> {
  const schemas: Record<string, unknown> = {};
  for (const [key, data] of Object.entries(resolvedSchemas)) {
    const name = key.startsWith('components/schemas/')
      ? key.replace('components/schemas/', '')
      : key;
    schemas[name] = data;
  }
  return {
    openapi: openapiVersion,
    info: { title: '', version: '' },
    paths: {},
    components: { schemas },
  };
}
