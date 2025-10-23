import type { SchemaModel } from '../models/types.js';

export function hasNestedFields(schema?: SchemaModel) {
  if (!schema) return false;

  return [
    ...(schema.fields || []),
    ...(schema.oneOf?.flatMap((variant) => variant.fields || []) || []),
  ].some(({ schema: fieldSchema }) => !fieldSchema.isPrimitive && !fieldSchema.isCircular);
}
