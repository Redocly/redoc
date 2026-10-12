import { isRecord } from '../../../utils/is-record.js';
import { fixUpSchema } from './schema.js';

export type Obj = Record<string, unknown>;

export interface RequestBodyEntry {
  name: string;
  body: Obj;
  refs: string[];
}

export interface Context {
  doc: Obj;
  parameters: Obj;
  examples: Obj;
  /** Original definition name → component schema name. */
  schemaNames: Map<string, string>;
  /** Local pointer that was hoisted into components → the component ref that replaces it. */
  refMap: Map<string, string>;
  /** Parameters folded into a request body; they are dropped from their lists. */
  folded: WeakSet<object>;
  /** Preferred component name for each request body. */
  bodyNames: WeakMap<object, string>;
}

export function sanitise(name: string): string {
  const [head = '', ...rest] = name.replace('[]', 'Array').split('/');
  return [head.replace(/[^A-Za-z0-9_.-]+/g, '_'), ...rest].join('/');
}

export function sanitiseAll(name: string): string {
  return sanitise(name.split('/').join('_'));
}

export function toCamelCase(text: string): string {
  return text.toLowerCase().replace(/[-_ /.](.)/g, (_match, next: string) => next.toUpperCase());
}

export function renameStrict(section: Obj, kind: string, visit: (value: unknown) => void): void {
  for (const name of Object.keys(section)) {
    const clean = sanitise(name);
    if (clean !== name) {
      if (section[clean]) throw new Error(`Duplicate sanitised ${kind} name ${clean}`);
      section[clean] = section[name];
      delete section[name];
    }
    visit(section[clean]);
  }
}

export function sanitiseRequirements(security: unknown): void {
  if (!Array.isArray(security)) return;
  for (const requirement of security) {
    if (!isRecord(requirement)) continue;
    for (const key of Object.keys(requirement)) {
      const clean = sanitise(key);
      if (clean === key) continue;
      requirement[clean] = requirement[key];
      delete requirement[key];
    }
  }
}

export function fixRefs(
  ctx: Context,
  node: unknown,
  parent: Obj | unknown[],
  parentKey: string,
): void {
  if (Array.isArray(node)) {
    node.forEach((item, index) => fixRefs(ctx, item, node, String(index)));
    return;
  }
  if (!isRecord(node)) return;
  for (const key of Object.keys(node)) {
    if (!Object.hasOwn(node, key)) continue;
    const value = node[key];
    if (key === '$ref' && typeof value === 'string') {
      fixRef(ctx, node, value, parent, parentKey);
    } else if (key === 'x-ms-odata' && typeof value === 'string' && value.startsWith('#/')) {
      node[key] = mapSchemaRef(ctx, value);
    } else if (key === 'discriminator' || key === 'x-discriminator') {
      fixDiscriminatorMapping(ctx, value);
    }
    const child = node[key];
    if (typeof child === 'object' && child !== null) fixRefs(ctx, child, node, key);
  }
}

function mapSchemaPath(ctx: Context, path: string): string {
  const [head = '', ...rest] = path.split('/');
  return [ctx.schemaNames.get(safeDecode(head)) ?? head, ...rest].join('/');
}

function mapSchemaRef(ctx: Context, ref: string): string {
  const path = ref.replace('#/definitions/', '').replace('#/components/schemas/', '');
  return `#/components/schemas/${mapSchemaPath(ctx, path)}`;
}

/** Mapping values are local schema refs or bare definition names; both follow the renamed schema. */
function fixDiscriminatorMapping(ctx: Context, discriminator: unknown): void {
  const mapping = rec(rec(discriminator)?.mapping);
  if (!mapping) return;
  for (const [key, value] of Object.entries(mapping)) {
    if (typeof value !== 'string') continue;
    if (value.startsWith('#/definitions/') || value.startsWith('#/components/schemas/')) {
      mapping[key] = mapSchemaRef(ctx, value);
    } else if (!value.startsWith('#')) {
      mapping[key] = ctx.schemaNames.get(value) ?? value;
    }
  }
}

function fixRef(
  ctx: Context,
  node: Obj,
  ref: string,
  parent: Obj | unknown[],
  parentKey: string,
): void {
  delete node['x-miro'];
  if (ref.startsWith('#/components/')) return;
  if (ref === '#/consumes' || ref === '#/produces') {
    delete node.$ref;
    setChild(parent, parentKey, cloneJson(ctx.doc[ref.slice(2)]));
  } else if (ref.startsWith('#/definitions/')) {
    const [head = '', ...rest] = ref.slice('#/definitions/'.length).split('/');
    const name = ctx.schemaNames.get(safeDecode(unescapePointer(head))) ?? head;
    node.$ref = `#/components/schemas/${[name, ...rest].join('/')}`;
  } else if (ref.startsWith('#/parameters/')) {
    node.$ref = `#/components/parameters/${sanitise(safeDecode(ref.slice('#/parameters/'.length)))}`;
  } else if (ref.startsWith('#/responses/')) {
    node.$ref = `#/components/responses/${sanitise(safeDecode(ref.slice('#/responses/'.length)))}`;
  } else if (ref.startsWith('#')) {
    node.$ref = hoist(ctx, ref) ?? ref;
  }
}

/** A whole path item (`#/paths/~1pets`) stays where it is; OpenAPI allows `$ref` on path items. */
const PATH_ITEM_REF = /^#\/paths\/[^/]+$/;

/** Copies the target of a local ref into components and returns the ref that replaces it. */
function hoist(ctx: Context, ref: string): string | undefined {
  if (PATH_ITEM_REF.test(ref)) return undefined;
  const known = ctx.refMap.get(ref);
  if (known !== undefined) return known;
  const found = resolvePointer(ctx.doc, ref);
  if (found === undefined || found === false) return undefined;

  const path = ref
    .replace('/properties/headers/', '')
    .replace('/properties/responses/', '')
    .replace('/properties/parameters/', '')
    .replace('/properties/schemas/', '');
  const schemaIndex = path.lastIndexOf('/schema');
  const after = (needle: string): boolean => path.indexOf(needle) > schemaIndex;
  const type = after('/headers/')
    ? 'headers'
    : after('/responses/')
      ? 'responses'
      : after('/example')
        ? 'examples'
        : after('/x-')
          ? 'extensions'
          : after('/parameters/')
            ? 'parameters'
            : 'schemas';
  if (type === 'responses' || type === 'extensions') return undefined;

  let target: unknown = cloneJson(found);
  if (type === 'schemas') fixUpSchema(target);
  let prefix = type.slice(0, -1);
  if (
    type === 'parameters' &&
    isRecord(target) &&
    typeof target.name === 'string' &&
    target.name &&
    target.name === sanitise(target.name)
  ) {
    prefix = encodeURIComponent(target.name);
  }
  let suffix = 1;
  while (resolvePointer(ctx.doc, `#/components/${type}/${prefix}${suffix}`)) suffix++;
  const location = `#/components/${type}/${prefix}${suffix}`;
  let replacement = location;
  if (type === 'examples') {
    target = { value: target };
    replacement = `${location}/value`;
  }
  setPointer(ctx.doc, location, target);
  ctx.refMap.set(ref, replacement);
  return replacement;
}

export function rec(value: unknown): Obj | undefined {
  return isRecord(value) ? value : undefined;
}

export function cloneJson<T>(value: T): T {
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}

export function moveKey(node: Obj, from: string, to: string): void {
  node[to] = node[from];
  delete node[from];
}

function setChild(parent: Obj | unknown[], key: string, value: unknown): void {
  if (Array.isArray(parent)) parent[Number(key)] = value;
  else parent[key] = value;
}

export function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

export function escapePointer(token: string): string {
  return token.replaceAll('~', '~0').replaceAll('/', '~1');
}

function unescapePointer(token: string): string {
  return token.replaceAll('~1', '/').replaceAll('~0', '~');
}

/** Java-style 32-bit string hash. */
export function hashString(text: string): number {
  let hash = 0;
  for (let index = 0; index < text.length; index++) {
    hash = (hash * 31 + text.charCodeAt(index)) | 0;
  }
  return hash;
}

/** Tokens of a local JSON pointer or `#…` reference; `undefined` for a reference to another document. */
function pointerTokens(ref: string): string[] | undefined {
  if (!ref || ref === '#') return [];
  let pointer = ref;
  if (pointer.includes('#')) {
    const [uri = '', fragment = ''] = pointer.split('#');
    if (uri) return undefined;
    pointer = safeDecode(fragment.slice(1));
  }
  if (pointer.startsWith('/')) pointer = pointer.slice(1);
  return pointer.split('/').map(unescapePointer);
}

function isIndex(token: string): boolean {
  return String(Number.parseInt(token, 10)) === token;
}

export function resolvePointer(root: unknown, ref: string): unknown {
  const tokens = pointerTokens(ref);
  if (!tokens) return undefined;
  let current = root;
  for (const token of tokens) {
    if (Array.isArray(current) && isIndex(token)) current = current[Number(token)];
    else if (isRecord(current) && Object.hasOwn(current, token)) current = current[token];
    else return undefined;
  }
  return current;
}

export function setPointer(root: Obj, ref: string, value: unknown): void {
  const tokens = pointerTokens(ref);
  if (!tokens?.length) return;
  let current: unknown = root;
  for (const [index, token] of tokens.entries()) {
    const last = index === tokens.length - 1;
    if (Array.isArray(current) && isIndex(token)) {
      if (last) current[Number(token)] = value;
      current = current[Number(token)];
    } else if (isRecord(current)) {
      if (last) current[token] = value;
      else if (!Object.hasOwn(current, token)) {
        const next = tokens[index + 1];
        current[token] = next === '0' || next === '-' ? [] : {};
      }
      current = current[token];
    } else {
      return;
    }
  }
}
