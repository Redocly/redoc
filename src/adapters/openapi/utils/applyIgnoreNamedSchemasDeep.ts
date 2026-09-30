import { isRecord } from '../../helpers.js';
import { getDefinitionName } from './helpers.js';

export function applyIgnoreNamedSchemasDeep(
  value: unknown,
  ignoreNamedSchemas?: Set<string>,
): unknown {
  if (!ignoreNamedSchemas || ignoreNamedSchemas.size === 0) return value;
  if (Array.isArray(value)) {
    return value.map((v) => applyIgnoreNamedSchemasDeep(v, ignoreNamedSchemas));
  }
  if (!isRecord(value)) return value;

  if (typeof value.$ref === 'string') {
    const schemaName = getDefinitionName(value.$ref);
    if (schemaName && ignoreNamedSchemas.has(schemaName)) {
      return { type: 'object', title: schemaName };
    }
    return value;
  }

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = applyIgnoreNamedSchemasDeep(v, ignoreNamedSchemas);
  }
  return out;
}
