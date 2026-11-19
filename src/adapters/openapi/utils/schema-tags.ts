import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { isRbacKey } from '../../rbac.js';
import { isRecord } from '../../../utils/is-record.js';

export function getSchemaNamesForTags(
  tagNames: ReadonlySet<string>,
  document: OpenAPIDefinition,
  schemaDefinitionsTagName: string | undefined,
): string[] {
  const schemas = document.components?.schemas;
  if (!schemas) return [];

  const defaultTags = schemaDefinitionsTagName ? [schemaDefinitionsTagName] : [];
  const names: string[] = [];

  for (const [schemaName, schema] of Object.entries<unknown>(schemas)) {
    if (isRbacKey(schemaName) || !isRecord(schema)) continue;
    const xTags: unknown = schema['x-tags'];
    const schemaTags: unknown[] = Array.isArray(xTags) && xTags.length ? xTags : defaultTags;
    if (schemaTags.some((tag) => typeof tag === 'string' && tagNames.has(tag))) {
      names.push(schemaName);
    }
  }

  return names;
}
