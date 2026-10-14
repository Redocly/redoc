import { mediaTypes, TYPE_PROPERTIES } from './parameters.js';
import type { Context, Obj } from './refs.js';
import { cloneJson, rec, safeDecode, sanitise } from './refs.js';
import { fixUpSchema } from './schema.js';

const ARRAY_PROPERTIES = ['items', 'minItems', 'maxItems', 'uniqueItems'] as const;

export function processResponse(ctx: Context, input: unknown, op?: Obj): void {
  const response = rec(input);
  if (!response) return;
  if (typeof response.$ref === 'string') {
    if (response.$ref.startsWith('#/responses/')) {
      const name = safeDecode(response.$ref.slice('#/responses/'.length));
      response.$ref = `#/components/responses/${sanitise(name)}`;
    }
    return;
  }
  if (response.description === undefined || response.description === null)
    response.description = '';
  if (response.schema !== undefined) {
    fixUpSchema(response.schema);
    if (op && typeof op.produces === 'string') op.produces = [op.produces];
    if (ctx.doc.produces && !Array.isArray(ctx.doc.produces)) delete ctx.doc.produces;
    const produces = mediaTypes(op?.produces, ctx.doc.produces);
    const content: Obj = {};
    response.content = content;
    const examples = rec(response.examples);
    for (const type of produces.length ? produces : ['*/*']) {
      const key = String(type);
      const media: Obj = { schema: cloneJson(response.schema) };
      content[key] = media;
      if (examples?.[key]) {
        media.examples = { response: { value: examples[key] } };
        delete examples[key];
      }
    }
    delete response.schema;
  }
  for (const [type, value] of Object.entries(rec(response.examples) ?? {})) {
    const content = rec(response.content) ?? {};
    response.content = content;
    const media = rec(content[type]) ?? {};
    content[type] = media;
    media.examples = { response: { value } };
  }
  delete response.examples;
  processHeaders(response);
}

function processHeaders(response: Obj): void {
  const headers = rec(response.headers);
  if (!headers) return;
  for (const name of Object.keys(headers)) {
    if (name.toLowerCase() === 'status code') delete headers[name];
    else processHeader(headers[name]);
  }
}

function processHeader(input: unknown): void {
  const header = rec(input);
  if (!header) return;
  if (header.$ref) {
    if (typeof header.$ref === 'string' && header.$ref.startsWith('#/responses/')) {
      header.$ref = `#/components/responses/${header.$ref.slice('#/responses/'.length)}`;
    }
    return;
  }
  const schema = rec(header.schema) ?? {};
  header.schema = schema;
  if (header.type) schema.type = header.type;
  const items = rec(header.items);
  if (items && items.type !== 'array') delete items.collectionFormat;
  if (header.type === 'array') {
    const format = header.collectionFormat;
    if (format === 'multi') header.explode = true;
    else if (format === 'tsv') header['x-collectionFormat'] = 'tsv';
    else if (format !== 'ssv' && format !== 'pipes') header.style = 'simple';
    delete header.collectionFormat;
  } else if (header.collectionFormat) {
    delete header.collectionFormat;
  }
  delete header.type;
  for (const prop of [...TYPE_PROPERTIES, ...ARRAY_PROPERTIES]) {
    if (header[prop] === undefined) continue;
    schema[prop] = header[prop];
    delete header[prop];
  }
  fixUpSchema(schema);
}
