import type { SchemaEntry } from '../types/store.js';
import type {
  GraphqlStoreMeta,
  GraphqlTypeData,
  GraphqlTypeReference,
} from '../types/graphql-store.js';

import { GRAPHQL_TYPE_ENTRY_PREFIX } from '../types/graphql-store.js';

export function buildGraphqlReferenceMap(
  schemaStore: Record<string, SchemaEntry>,
  rootTypes: GraphqlStoreMeta['rootTypes'] = {},
): Record<string, GraphqlTypeReference[]> {
  const refs: Record<string, GraphqlTypeReference[]> = {};
  const rootTypeNames = new Set(Object.values(rootTypes));

  function addRef(key: string, ref: GraphqlTypeReference) {
    if (!refs[key]) refs[key] = [];
    refs[key].push(ref);
  }

  for (const entry of Object.values(schemaStore)) {
    if (!entry.id.startsWith(GRAPHQL_TYPE_ENTRY_PREFIX)) continue;

    const data = entry.data as GraphqlTypeData;
    if (rootTypeNames.has(data.name)) continue;

    for (const field of data.fields ?? []) {
      addRef(field.type.name, { name: data.name, field: field.name });
    }
    for (const member of data.possibleTypes ?? []) {
      addRef(member, { name: data.name });
    }
  }

  return refs;
}
