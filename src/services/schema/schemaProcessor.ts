import type {
  PropertyType,
  SchemaNode,
  Document,
  SchemaProcessorDialect,
  SchemaProcessorOptions,
} from '../../types/schema.js';

import { JsonSchemaDialectId, jsonSchemaDialect } from './dialects/jsonSchema.js';
import { GraphqlSchemaDialectId } from './dialects/graphqlSchema.js';

const processedRootCache = new WeakMap<
  SchemaNode,
  {
    dialectId: string;
    rootJsonPointer: string;
    sortRequiredPropsFirst?: boolean;
    result: PropertyType;
  }
>();

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

  const effectiveRootJsonPointer = options?.rootJsonPointer ?? '#';

  if (options?.exampleSerializer) {
    return dialect.process(schema, document, options);
  }

  const cached = processedRootCache.get(schema);

  if (
    cached?.dialectId === dialect.id &&
    cached?.rootJsonPointer === effectiveRootJsonPointer &&
    cached?.sortRequiredPropsFirst === options?.sortRequiredPropsFirst
  ) {
    return cached.result;
  }

  const result = dialect.process(schema, document, options);

  processedRootCache.set(schema, {
    dialectId: dialect.id,
    rootJsonPointer: effectiveRootJsonPointer,
    sortRequiredPropsFirst: options?.sortRequiredPropsFirst,
    result,
  });

  return result;
}
