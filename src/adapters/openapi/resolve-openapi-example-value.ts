import type { OpenAPIExample } from '../../types/openapi.js';

export function resolveOpenApiExampleValue(example: OpenAPIExample | undefined): unknown {
  if (!example) return undefined;
  if (example.dataValue !== undefined) return example.dataValue;
  if (example.serializedValue !== undefined) return example.serializedValue;
  return example.value;
}

export function hasOpenApiExampleValue(example: OpenAPIExample | undefined): boolean {
  if (!example) return false;
  return (
    example.dataValue !== undefined ||
    example.serializedValue !== undefined ||
    example.value !== undefined
  );
}
