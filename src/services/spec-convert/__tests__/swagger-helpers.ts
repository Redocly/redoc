import { convertSwaggerToOpenApi } from '../swagger.js';

export type Obj = Record<string, unknown>;

export const cafe = (extra: Obj = {}): Obj => ({
  swagger: '2.0',
  info: { title: 'Redocly Cafe', version: '1.0.0' },
  paths: {},
  ...extra,
});

export const convert = (doc: Obj): Obj => JSON.parse(JSON.stringify(convertSwaggerToOpenApi(doc)));

export const pathsOf = (converted: Obj): Record<string, Obj> =>
  converted.paths as Record<string, Obj>;

export const opAt = (converted: Obj, path: string, method: string): Obj =>
  (pathsOf(converted)[path] ?? {})[method] as Obj;

export const componentsOf = (converted: Obj): Obj => converted.components as Obj;

export const sectionOf = (converted: Obj, section: string): Obj =>
  componentsOf(converted)[section] as Obj;

/** Converts a document holding one path item at `/orders` and returns that converted item. */
export const convertPath = (pathItem: Obj, extra: Obj = {}): Obj =>
  pathsOf(convert(cafe({ paths: { '/orders': pathItem }, ...extra })))['/orders'] as Obj;

/** Converts a document holding one `post /orders` operation and returns that converted operation. */
export const convertOp = (operation: Obj, extra: Obj = {}, pathItem: Obj = {}): Obj =>
  convertPath({ ...pathItem, post: operation }, extra).post as Obj;

/** Converts one definition named `MenuItem` and returns its schema. */
export const convertSchema = (schema: Obj, extra: Obj = {}): unknown =>
  sectionOf(convert(cafe({ definitions: { MenuItem: schema, ...extra } })), 'schemas').MenuItem;

export const ok = { '200': { description: 'Done.' } };
