import type { AvroSchema } from '../../../types/asyncapi.js';

type JsonSchemaObject = Record<string, unknown>;

function convertPrimitiveType(
  type: string,
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  switch (type) {
    case 'null':
      return { type: 'null' };
    case 'boolean':
      return { type: 'boolean' };
    case 'int':
    case 'long':
      return { type: 'integer' };
    case 'float':
    case 'double':
      return { type: 'number' };
    case 'bytes':
      return { type: 'string', contentEncoding: 'base64' };
    case 'string':
      return { type: 'string' };
    default: {
      const resolved = namedTypes[type];
      if (resolved) {
        return { ...resolved };
      }
      return { type: 'null' };
    }
  }
}

function convertEnum(schema: AvroSchema): JsonSchemaObject {
  return {
    type: 'string',
    enum: schema.symbols,
    title: schema.name,
    description: schema.doc,
  };
}

function convertRecord(
  schema: AvroSchema,
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  const properties: Record<string, JsonSchemaObject> = {};
  const required: string[] = [];

  schema.fields?.forEach((field) => {
    properties[field.name] = convertType(field.type, namedTypes);
    if (field.doc) {
      properties[field.name].description = field.doc;
    }
    if (field.default !== undefined) {
      properties[field.name].default = field.default;
    }
    if (field.default === undefined && !isNullableType(field.type)) {
      required.push(field.name);
    }
  });

  return {
    type: 'object',
    title: schema.name,
    description: schema.doc,
    properties,
    required: required.length > 0 ? required : undefined,
    additionalProperties: false,
  };
}

function isNullableType(type: AvroSchema | string | (string | AvroSchema)[]): boolean {
  if (Array.isArray(type)) {
    return type.some(
      (t) => t === 'null' || (typeof t === 'object' && !Array.isArray(t) && t.type === 'null'),
    );
  }
  return false;
}

function convertArray(
  schema: AvroSchema,
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  return {
    type: 'array',
    items: convertType(schema.items, namedTypes),
    description: schema.doc,
  };
}

function convertMap(
  schema: AvroSchema,
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  return {
    type: 'object',
    additionalProperties: convertType(schema.values, namedTypes),
    description: schema.doc,
  };
}

function convertUnion(
  types: (string | AvroSchema)[],
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  const nullIndex = types.findIndex(
    (t) => t === 'null' || (typeof t === 'object' && !Array.isArray(t) && t.type === 'null'),
  );
  if (nullIndex !== -1) {
    const nonNullTypes = [...types];
    nonNullTypes.splice(nullIndex, 1);
    if (nonNullTypes.length === 1) {
      return { ...convertType(nonNullTypes[0], namedTypes), nullable: true };
    } else {
      return { oneOf: nonNullTypes.map((t) => convertType(t, namedTypes)), nullable: true };
    }
  }
  return { oneOf: types.map((t) => convertType(t, namedTypes)) };
}

function convertType(
  avroType: AvroSchema | string | (string | AvroSchema)[] | undefined,
  namedTypes: Record<string, JsonSchemaObject>,
): JsonSchemaObject {
  if (typeof avroType === 'string') {
    return convertPrimitiveType(avroType, namedTypes);
  }

  if (!avroType) {
    return { type: 'null' };
  }

  let type: JsonSchemaObject = {};

  if (Array.isArray(avroType)) {
    type = convertUnion(avroType, namedTypes);
  } else if (typeof avroType.type === 'string') {
    switch (avroType.type) {
      case 'record':
        type = convertRecord(avroType, namedTypes);
        break;
      case 'enum':
        type = convertEnum(avroType);
        break;
      case 'array':
        type = convertArray(avroType, namedTypes);
        break;
      case 'map':
        type = convertMap(avroType, namedTypes);
        break;
      default:
        type = convertPrimitiveType(avroType.type, namedTypes);
    }
  } else if (avroType.items) {
    type = convertArray(avroType, namedTypes);
  } else if (avroType.values) {
    type = convertMap(avroType, namedTypes);
  }

  if (!Array.isArray(avroType) && avroType.name) {
    namedTypes[avroType.name] = type;
  }
  return type;
}

export function avroToJsonSchema(avroSchema: AvroSchema): JsonSchemaObject {
  const namedTypes: Record<string, JsonSchemaObject> = {};
  const jsonSchema = convertType(avroSchema, namedTypes);
  return {
    ...jsonSchema,
  };
}
