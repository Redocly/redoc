import type {
  AsyncAPISchema,
  AvroSchema,
  MultiFormatSchemaObject,
} from '../../../types/asyncapi.js';

import { avroToJsonSchema } from './avro-to-json-schema.js';

const AVRO_SCHEMA_FORMATS = [
  'application/vnd.apache.avro',
  'application/vnd.apache.avro+json',
  'application/vnd.apache.avro+yaml',
];

function isAvroSchemaFormat(schemaFormat?: string): boolean {
  if (!schemaFormat) return false;
  return AVRO_SCHEMA_FORMATS.some((format) => schemaFormat.startsWith(format));
}

function isMultiFormatSchema(value: AsyncAPISchema): value is MultiFormatSchemaObject {
  return (
    typeof value === 'object' && value !== null && 'schema' in value && 'schemaFormat' in value
  );
}

export function resolveAsyncApiSchema(
  value: AsyncAPISchema | undefined,
): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') {
    return value as Record<string, unknown> | undefined;
  }

  if (isMultiFormatSchema(value)) {
    if (isAvroSchemaFormat(value.schemaFormat)) {
      return avroToJsonSchema(value.schema as AvroSchema);
    }
    return value.schema as Record<string, unknown>;
  }

  return value as Record<string, unknown>;
}
