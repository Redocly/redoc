import type {
  PropertyType,
  SchemaNode,
  Document,
  SchemaProcessorDialect,
  SchemaProcessorOptions,
} from '../../types/schema.js';

import { JsonSchemaDialectId, jsonSchemaDialect } from './dialects/jsonSchema.js';
import { GraphqlSchemaDialectId } from './dialects/graphqlSchema.js';

const processedRootCache = new WeakMap<SchemaNode, Map<string, PropertyType>>();

/** The property tree of `schema`; trees without an `exampleSerializer` are cached per schema, dialect, root pointer and sort order. */
export function schemaProcessor(
  schema: SchemaNode,
  document: Document,
  options?: SchemaProcessorOptions,
): PropertyType {
  const dialectId = options?.dialectId ?? JsonSchemaDialectId;
  let dialect: SchemaProcessorDialect;

  switch (dialectId) {
    case JsonSchemaDialectId:
      dialect = jsonSchemaDialect;
      break;
    // graphql-schema dialect is not implemented
    case GraphqlSchemaDialectId:
    default:
      dialect = jsonSchemaDialect;
  }

  if (options?.exampleSerializer) {
    return dialect.process(schema, document, options);
  }

  const key = `${dialect.id}|${options?.rootJsonPointer ?? '#'}|${options?.sortRequiredPropsFirst ?? false}`;
  let trees = processedRootCache.get(schema);
  const cached = trees?.get(key);
  if (cached) return cached;

  const result = dialect.process(schema, document, options);
  if (!trees) {
    trees = new Map();
    processedRootCache.set(schema, trees);
  }
  trees.set(key, result);
  return result;
}
