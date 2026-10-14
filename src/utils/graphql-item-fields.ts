import type { ItemContentNode } from '../types/content.js';
import type {
  GraphqlDescription,
  GraphqlDirectiveData,
  GraphqlStoreFieldData,
  GraphqlStoreMeta,
  GraphqlTypeData,
} from '../types/graphql-store.js';
import type { SchemaEntry } from '../types/store.js';

import { graphqlDirectiveEntryId, graphqlTypeEntryId } from '../types/graphql-store.js';
import { getOperationFromStore } from './graphql-samples.js';

export type GraphqlItemFields = {
  /** The return type as the operation declares it (`[Pet!]!`); set for `return-type` nodes only. */
  type?: { display: string; description?: GraphqlDescription };
  fields: GraphqlStoreFieldData[];
};

export type GraphqlFieldsStore = {
  schemaStore?: Record<string, SchemaEntry>;
  graphqlMeta?: GraphqlStoreMeta;
};

const FIELD_VARIANTS = new Set<ItemContentNode['variant']>([
  'graphql-fields',
  'graphql-args',
  'return-type',
]);

/** True for the node variants whose rows live in the store. */
export function isGraphqlFieldsNode(node: ItemContentNode): boolean {
  return FIELD_VARIANTS.has(node.variant) && !!node.graphqlTypeName;
}

/**
 * The store rows a `graphql-fields`, `graphql-args` or `return-type` node lists:
 * the type's fields, the operation's or directive's arguments, or the return type's
 * fields. `undefined` for any other node or when the store lacks the type.
 */
export function resolveGraphqlItemFields(
  node: ItemContentNode,
  store: GraphqlFieldsStore,
): GraphqlItemFields | undefined {
  const { schemaStore } = store;
  if (!schemaStore || !node.graphqlTypeName) return undefined;
  const typeData = (name: string): GraphqlTypeData | undefined =>
    schemaStore[graphqlTypeEntryId(name)]?.data as GraphqlTypeData | undefined;

  switch (node.variant) {
    case 'graphql-fields': {
      const fields = typeData(node.graphqlTypeName)?.fields;
      return fields ? { fields } : undefined;
    }
    case 'graphql-args': {
      // An operation node names the operation, not its root type; the root types are in the meta.
      if (node.graphqlOperationType && node.graphqlFieldName) {
        const operation = getOperationFromStore(
          { schemaStore, graphqlMeta: store.graphqlMeta },
          node.graphqlOperationType,
          node.graphqlFieldName,
        );
        return operation?.args ? { fields: operation.args } : undefined;
      }
      const directive = schemaStore[graphqlDirectiveEntryId(node.graphqlTypeName)]?.data as
        | GraphqlDirectiveData
        | undefined;
      return directive?.args ? { fields: directive.args } : undefined;
    }
    case 'return-type': {
      const returnType = typeData(node.graphqlTypeName);
      if (!returnType) return undefined;
      const operation =
        node.graphqlOperationType && node.graphqlFieldName
          ? getOperationFromStore(
              { schemaStore, graphqlMeta: store.graphqlMeta },
              node.graphqlOperationType,
              node.graphqlFieldName,
            )
          : undefined;
      return {
        type: {
          display: operation?.type.display ?? returnType.name,
          description: returnType.description,
        },
        fields: returnType.fields ?? [],
      };
    }
    default:
      return undefined;
  }
}
