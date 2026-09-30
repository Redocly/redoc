import type { GraphQLSchema } from 'graphql';
import type { ApiStore, SchemaEntry } from '../../types/store.js';

import { schemaKind } from '../../types/common.js';
import { registerSchema } from '../helpers.js';
import { graphqlDirectiveEntryId, graphqlTypeEntryId } from '../../types/graphql-store.js';
import { serializeDirective, serializeNamedType } from './serializeType.js';

export function populateGraphqlStore(schema: GraphQLSchema): ApiStore {
  const schemaStore: Record<string, SchemaEntry> = {};
  const hashIndex: Record<string, string> = {};

  for (const type of Object.values(schema.getTypeMap())) {
    if (type.name.startsWith('__')) continue;

    registerSchema(schemaStore, hashIndex, {
      id: graphqlTypeEntryId(type.name),
      kind: schemaKind.GRAPHQL_TYPE,
      title: type.name,
      data: serializeNamedType(type),
    });
  }

  for (const directive of schema.getDirectives()) {
    registerSchema(schemaStore, hashIndex, {
      id: graphqlDirectiveEntryId(directive.name),
      kind: schemaKind.GRAPHQL_TYPE,
      title: directive.name,
      data: serializeDirective(directive),
    });
  }

  return {
    schemaStore,
    exampleStore: {},
    securitySchemeStore: {},
    graphqlMeta: {
      rootTypes: {
        query: schema.getQueryType()?.name,
        mutation: schema.getMutationType()?.name,
        subscription: schema.getSubscriptionType()?.name,
      },
    },
  };
}
