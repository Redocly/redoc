import { isRecord } from '../../../utils/is-record.js';
import type { Context, Obj } from './refs.js';
import {
  cloneJson,
  rec,
  resolvePointer,
  safeDecode,
  sanitise,
  sanitiseAll,
  toCamelCase,
} from './refs.js';
import { fixUpSchema } from './schema.js';

export const TYPE_PROPERTIES = [
  'format',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'minLength',
  'maxLength',
  'multipleOf',
  'minItems',
  'maxItems',
  'uniqueItems',
  'minProperties',
  'maxProperties',
  'additionalProperties',
  'pattern',
  'enum',
  'default',
] as const;

export function fixParamRef(param: Obj): void {
  const ref = param.$ref;
  if (typeof ref !== 'string' || !ref.startsWith('#/parameters/')) return;
  param.$ref = `#/components/parameters/${sanitise(safeDecode(ref.slice('#/parameters/'.length)))}`;
}

/** Converts one parameter in place and returns the operation, which is replaced when a body is attached. */
export function processParameter(
  ctx: Context,
  input: unknown,
  operation?: Obj,
  path?: Obj,
  method?: string,
): Obj | undefined {
  const { doc } = ctx;
  let op = operation;
  if (op && typeof op.consumes === 'string') op.consumes = [op.consumes];
  if (!Array.isArray(doc.consumes)) delete doc.consumes;
  const consumes = mediaTypes(op?.consumes, doc.consumes);

  let param = input;
  if (isRecord(param) && typeof param.$ref === 'string') {
    fixParamRef(param);
    const ref = String(param.$ref);
    const target = ctx.parameters[safeDecode(ref.replace('#/components/parameters/', ''))];
    if ((!target || (isRecord(target) && ctx.folded.has(target))) && ref.startsWith('#/')) {
      ctx.folded.add(param);
      const resolved = resolvePointer(doc, ref);
      if (resolved) param = resolved;
    }
  }
  if (!isRecord(param)) return op;

  let isFile = false;
  if (param.name || param.in) {
    if (typeof param['x-deprecated'] === 'boolean') {
      param.deprecated = param['x-deprecated'];
      delete param['x-deprecated'];
    }
    if (param['x-example'] !== undefined) {
      param.example = param['x-example'];
      delete param['x-example'];
    }
    if (param.in !== 'body' && !param.type) param.type = 'string';
    if (isRecord(param.type) && typeof param.type.$ref === 'string') {
      param.type = resolvePointer(doc, param.type.$ref);
    }
    isFile = param.type === 'file';
    if (isRecord(param.description) && typeof param.description.$ref === 'string') {
      param.description = resolvePointer(doc, param.description.$ref);
    }
    convertCollectionFormat(param);

    if (
      param.type &&
      param.type !== 'body' &&
      param.in !== 'formData' &&
      !(param.items && param.schema)
    ) {
      const schema = rec(param.schema) ?? {};
      param.schema = schema;
      schema.type = param.type;
      if (param.items) {
        schema.items = param.items;
        delete param.items;
        stripCollectionFormats(schema.items);
      }
      for (const prop of TYPE_PROPERTIES) {
        if (param[prop] !== undefined) schema[prop] = param[prop];
        delete param[prop];
      }
    }
    if (param.schema) fixUpSchema(param.schema);
    if (param['x-ms-skip-url-encoding'] && param.in === 'query') {
      param.allowReserved = true;
      delete param['x-ms-skip-url-encoding'];
    }
  }

  const result: Obj = {};
  let singular = true;
  if (param.in === 'formData') {
    singular = false;
    const content: Obj = {};
    result.content = content;
    const multipart =
      consumes.includes('multipart/form-data') ||
      hasFileField(ctx, op?.parameters) ||
      hasFileField(ctx, path?.parameters);
    content[formContentType(multipart)] = formMedia(ctx, param, result, isFile);
  } else if (param.type === 'file') {
    if (param.required) result.required = param.required;
    result.content = { 'application/octet-stream': {} };
    copyExtensions(param, result);
  }
  if (param.in === 'body') buildBody(ctx, param, op, consumes, result);

  if (Object.keys(result).length > 0) {
    ctx.folded.add(param);
    if (op) op = attachBody(ctx, op, path, method, result, singular);
  }

  if (!ctx.folded.has(param)) {
    delete param.type;
    for (const prop of TYPE_PROPERTIES) delete param[prop];
    if (param.in === 'path' && param.required !== true) param.required = true;
  }
  return op;
}

function convertCollectionFormat(param: Obj): void {
  let format = param.collectionFormat;
  if (param.type === 'array' && !format) format = 'csv';
  if (!format) return;
  const location = param.in;
  if (format === 'csv' && (location === 'query' || location === 'cookie')) {
    param.style = 'form';
    param.explode = false;
  }
  if (format === 'csv' && (location === 'path' || location === 'header')) param.style = 'simple';
  if (format === 'ssv' && location === 'query') param.style = 'spaceDelimited';
  if (format === 'pipes' && location === 'query') param.style = 'pipeDelimited';
  if (format === 'multi') param.explode = true;
  if (format === 'tsv') param['x-collectionFormat'] = 'tsv';
  delete param.collectionFormat;
}

function stripCollectionFormats(node: unknown): void {
  if (Array.isArray(node)) {
    for (const item of node) stripCollectionFormats(item);
  } else if (isRecord(node)) {
    if (typeof node.collectionFormat === 'string') delete node.collectionFormat;
    for (const child of Object.values(node)) stripCollectionFormats(child);
  }
}

function formContentType(multipart: boolean): string {
  return multipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded';
}

/** Whether any formData parameter of the list is a file upload; `$ref` entries are looked up. */
function hasFileField(ctx: Context, params: unknown): boolean {
  if (!Array.isArray(params)) return false;
  return params.some((entry) => {
    const param =
      isRecord(entry) && typeof entry.$ref === 'string'
        ? ctx.parameters[
            sanitise(safeDecode(entry.$ref.replace(/^#\/(?:components\/)?parameters\//, '')))
          ]
        : entry;
    return isRecord(param) && param.in === 'formData' && param.type === 'file';
  });
}

function formMedia(ctx: Context, param: Obj, result: Obj, isFile: boolean): Obj {
  if (param.schema) {
    if (isRecord(param.schema) && typeof param.schema.$ref === 'string') {
      ctx.bodyNames.set(result, schemaRefName(param.schema.$ref));
    }
    return { schema: param.schema };
  }
  const property: Obj = {};
  const schema: Obj = { type: 'object', properties: { [String(param.name)]: property } };
  if (param.description) property.description = param.description;
  if (param.example) property.example = param.example;
  if (param.type) property.type = param.type;
  for (const prop of TYPE_PROPERTIES) {
    if (param[prop] !== undefined) property[prop] = param[prop];
  }
  if (param.required === true) {
    schema.required = [param.name];
    result.required = true;
  }
  if (param.allOf) property.allOf = param.allOf;
  if (param.type === 'array' && param.items) {
    property.items = param.items;
    if (isRecord(property.items) && property.items.collectionFormat) {
      delete property.items.collectionFormat;
    }
  }
  if (isFile) {
    property.type = 'string';
    property.format = 'binary';
  }
  copyExtensions(param, property);
  fixUpSchema(property);
  return { schema };
}

function buildBody(
  ctx: Context,
  param: Obj,
  op: Obj | undefined,
  consumes: unknown[],
  result: Obj,
): void {
  const content: Obj = {};
  result.content = content;
  if (param.name) {
    const prefix = op?.operationId ? sanitiseAll(String(op.operationId)) : '';
    ctx.bodyNames.set(result, prefix + toCamelCase(`_${String(param.name)}`));
  }
  if (param.description) result.description = param.description;
  if (param.required) result.required = param.required;
  const schema = rec(param.schema);
  const items = rec(schema?.items);
  if (typeof schema?.$ref === 'string') {
    ctx.bodyNames.set(result, schemaRefName(schema.$ref));
  } else if (schema?.type === 'array' && typeof items?.$ref === 'string') {
    ctx.bodyNames.set(result, `${schemaRefName(items.$ref)}Array`);
  }
  for (const type of consumes.length ? consumes : ['application/json']) {
    const copy = cloneJson(param.schema || {});
    fixUpSchema(copy);
    content[String(type)] = { schema: copy };
  }
  copyExtensions(param, result);
}

function attachBody(
  ctx: Context,
  operation: Obj,
  path: Obj | undefined,
  method: string | undefined,
  result: Obj,
  singular: boolean,
): Obj {
  let op = operation;
  // A second body parameter on one operation is ignored: the first one wins.
  if (op.requestBody && singular) return op;
  if (!op.requestBody) {
    const next: Obj = {};
    for (const [key, value] of Object.entries(op)) {
      next[key] = value;
      if (key === 'parameters') next.requestBody = {};
    }
    next.requestBody = {};
    op = next;
    if (path && method) path[method] = op;
  }
  const body = rec(op.requestBody);
  if (!body) return op;
  if (mergeForm(body, result, 'multipart/form-data')) return op;
  if (mergeForm(body, result, 'application/x-www-form-urlencoded')) return op;
  Object.assign(body, result);
  const name = ctx.bodyNames.get(result);
  if (name !== undefined) ctx.bodyNames.set(body, name);
  if (!ctx.bodyNames.get(body)) {
    const schema = rec(body.schema);
    if (typeof schema?.$ref === 'string') {
      ctx.bodyNames.set(body, schemaRefName(schema.$ref).split('/').join(''));
    } else if (op.operationId) {
      ctx.bodyNames.set(body, sanitiseAll(String(op.operationId)));
    }
  }
  return op;
}

/** Merges form properties into an existing form body; `required` on the body stays from the first. */
function mergeForm(body: Obj, result: Obj, type: string): boolean {
  const target = rec(rec(rec(body.content)?.[type])?.schema);
  const incoming = rec(rec(rec(result.content)?.[type])?.schema);
  if (!target || !incoming || !isRecord(target.properties) || !isRecord(incoming.properties)) {
    return false;
  }
  Object.assign(target.properties, incoming.properties);
  const required = [
    ...(Array.isArray(target.required) ? target.required : []),
    ...(Array.isArray(incoming.required) ? incoming.required : []),
  ];
  if (required.length) target.required = required;
  else delete target.required;
  return true;
}

function copyExtensions(source: Obj, target: Obj): void {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('x-')) target[key] = value;
  }
}

function schemaRefName(ref: string): string {
  return safeDecode(ref.replace('#/components/schemas/', ''));
}

export function mediaTypes(own: unknown, root: unknown): unknown[] {
  const list: unknown = own || root || [];
  return Array.isArray(list) ? list.filter((value, index) => list.indexOf(value) === index) : [];
}
