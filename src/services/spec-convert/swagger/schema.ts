import { isRecord } from '../../../utils/is-record.js';

type Obj = Record<string, unknown>;

const COMPOSITION_KEYWORDS = ['allOf', 'oneOf', 'anyOf', 'not'];

export function fixUpSchema(root: unknown): void {
  const seen = new WeakSet<Obj>();
  const walk = (schema: unknown, parent: Obj): void => {
    if (!isRecord(schema) || seen.has(schema)) return;
    seen.add(schema);
    fixSchemaNode(schema, parent);
    if (schema.items !== undefined) walk(schema.items, schema);
    if (isRecord(schema.additionalItems)) walk(schema.additionalItems, schema);
    if (isRecord(schema.additionalProperties)) walk(schema.additionalProperties, schema);
    for (const key of ['properties', 'patternProperties', 'allOf', 'anyOf', 'oneOf']) {
      const children = schema[key];
      if (isRecord(children) || Array.isArray(children)) {
        for (const child of Object.values(children)) walk(child, schema);
      }
    }
    if (schema.not) walk(schema.not, schema);
  };
  walk(root, {});
}

/** Rewrites boolean `exclusiveMinimum`/`exclusiveMaximum` into the numeric form, in place. */
function foldExclusiveBounds(schema: Obj): void {
  for (const [flag, limit] of [
    ['exclusiveMinimum', 'minimum'],
    ['exclusiveMaximum', 'maximum'],
  ] as const) {
    if (typeof schema[flag] !== 'boolean') continue;
    if (schema[flag] && typeof schema[limit] === 'number') {
      schema[flag] = schema[limit];
      delete schema[limit];
    } else {
      delete schema[flag];
    }
  }
}

function fixSchemaNode(schema: Obj, parent: Obj): void {
  const extraRequired = schema['x-required'];
  if (Array.isArray(extraRequired)) {
    schema.required = [
      ...(Array.isArray(schema.required) ? schema.required : []),
      ...extraRequired,
    ];
    delete schema['x-required'];
  }
  for (const key of ['anyOf', 'oneOf', 'not']) {
    if (!schema[`x-${key}`]) continue;
    schema[key] = schema[`x-${key}`];
    delete schema[`x-${key}`];
  }
  const nullable = schema['x-nullable'] === true || schema.nullable === true;
  if (typeof schema['x-nullable'] === 'boolean') delete schema['x-nullable'];
  if (typeof schema.nullable === 'boolean') delete schema.nullable;
  const xDiscriminator = schema['x-discriminator'];
  if (isRecord(xDiscriminator) && typeof xDiscriminator.propertyName === 'string') {
    schema.discriminator = xDiscriminator;
    delete schema['x-discriminator'];
    const mapping = isRecord(xDiscriminator.mapping) ? xDiscriminator.mapping : {};
    for (const [key, value] of Object.entries(mapping)) {
      if (typeof value === 'string' && value.startsWith('#/definitions/')) {
        mapping[key] = value.replace('#/definitions/', '#/components/schemas/');
      }
    }
  }

  if (typeof schema.discriminator === 'string') {
    schema.discriminator = { propertyName: schema.discriminator };
  }
  if (Array.isArray(schema.items)) {
    const items = schema.items;
    schema.items = items.length === 0 ? {} : items.length === 1 ? items[0] : { anyOf: items };
  }
  if (Array.isArray(schema.type)) {
    if (schema.type.length === 0) delete schema.type;
    else if (schema.type.length === 1) schema.type = schema.type[0];
  }
  const types: unknown[] = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.includes('array') && !schema.items) schema.items = {};
  if (schema.type === 'file') {
    schema.type = 'string';
    schema.format = 'binary';
  }
  if (typeof schema.required === 'boolean') {
    if (schema.required && schema.name) {
      if (parent.required === undefined) parent.required = [];
      if (Array.isArray(parent.required)) parent.required.push(schema.name);
    }
    delete schema.required;
  }
  if (isRecord(schema.xml) && schema.xml.namespace === '') delete schema.xml.namespace;
  delete schema.allowEmptyValue;
  foldExclusiveBounds(schema);

  if (!nullable) return;
  if (typeof schema.$ref === 'string') {
    const ref = schema.$ref;
    const siblings: Obj = { ...schema };
    delete siblings.$ref;
    for (const key of Object.keys(schema)) delete schema[key];
    Object.assign(schema, { anyOf: [{ $ref: ref }, { type: 'null' }] }, siblings);
  } else if (typeof schema.type === 'string' && schema.type !== 'null') {
    schema.type = [schema.type, 'null'];
  } else if (Array.isArray(schema.type) && !schema.type.includes('null')) {
    schema.type = [...schema.type, 'null'];
  } else if (schema.type === undefined) {
    const branch: Obj = {};
    for (const key of COMPOSITION_KEYWORDS) {
      if (schema[key] !== undefined) branch[key] = schema[key];
    }
    if (Object.keys(branch).length === 0) return;
    const siblings: Obj = { ...schema };
    for (const key of COMPOSITION_KEYWORDS) delete siblings[key];
    for (const key of Object.keys(schema)) delete schema[key];
    Object.assign(schema, { anyOf: [branch, { type: 'null' }] }, siblings);
  }
}
