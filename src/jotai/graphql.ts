import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import type { ApiItem } from '../types/store.js';
import type {
  GraphqlDirectiveData,
  GraphqlStoreFieldData,
  GraphqlTypeData,
  GraphqlTypeReference,
} from '../types/graphql-store.js';
import type { GraphqlTypeLookup } from '../utils/graphql-samples.js';

import { graphqlDirectiveEntryId, graphqlTypeEntryId } from '../types/graphql-store.js';
import { createGraphqlTypeLookup, getOperationFromStore } from '../utils/graphql-samples.js';
import { buildGraphqlReferenceMap } from '../utils/graphql-reference-map.js';
import { schemaStoreAtom } from './schema.js';
import { storeAtom, globalItemsAtom } from './store.js';

export const graphqlTypeLookupAtom = atom<GraphqlTypeLookup>((get) =>
  createGraphqlTypeLookup(get(schemaStoreAtom)),
);

export const graphqlTypeDataAtom = atomFamily((typeName: string) =>
  atom<GraphqlTypeData | undefined>(
    (get) =>
      get(schemaStoreAtom)[graphqlTypeEntryId(typeName)]?.data as GraphqlTypeData | undefined,
  ),
);

export const graphqlDirectiveDataAtom = atomFamily((directiveName: string) =>
  atom<GraphqlDirectiveData | undefined>(
    (get) =>
      get(schemaStoreAtom)[graphqlDirectiveEntryId(directiveName)]?.data as
        | GraphqlDirectiveData
        | undefined,
  ),
);

export type GraphqlOperationType = 'query' | 'mutation' | 'subscription';

export function graphqlOperationKey(
  operationType: GraphqlOperationType | undefined,
  operationName: string | undefined,
): string {
  return operationType && operationName ? `${operationType}:${operationName}` : '';
}

export const graphqlOperationAtom = atomFamily((key: string) =>
  atom<GraphqlStoreFieldData | undefined>((get) => {
    const separatorIndex = key.indexOf(':');
    if (separatorIndex < 1) return undefined;
    const operationType = key.slice(0, separatorIndex) as GraphqlOperationType;
    const operationName = key.slice(separatorIndex + 1);
    return getOperationFromStore(get(storeAtom), operationType, operationName);
  }),
);

export const graphqlTypeSlugMapAtom = atom<Record<string, string>>((get) => {
  const items = get(globalItemsAtom);
  const map: Record<string, string> = {};

  function walk(list: ApiItem[]) {
    for (const item of list) {
      if (item.content?.meta?.name && 'routeSlug' in item && item.routeSlug) {
        map[item.content.meta.name] = item.routeSlug;
      }
      if ('items' in item && Array.isArray(item.items)) {
        walk(item.items as ApiItem[]);
      }
    }
  }

  walk(items);
  return map;
});

export const graphqlReferenceMapAtom = atom<Record<string, GraphqlTypeReference[]>>((get) =>
  buildGraphqlReferenceMap(get(schemaStoreAtom), get(storeAtom).graphqlMeta?.rootTypes),
);
