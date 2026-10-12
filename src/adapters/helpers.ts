import type {
  SchemaEntry,
  ExampleEntry,
  SecuritySchemeEntry,
  StoreContext,
} from '../types/store.js';
import type { OpenAPIRef, Referenced } from '../types/common.js';
import type { OpenAPIMediaType, OpenAPIExample } from '../types/openapi.js';

import { getDefinitionName } from './openapi/utils/helpers.js';
import { readRbacScope, rbacProp } from './rbac.js';
import { isRecord } from '../utils/is-record.js';

export { isRecord };

const storeCounters = new WeakMap<object, number>();

/**
 * Sequential per-store id: a fresh store starts at `${prefix}_0`, and an id already present
 * in the store (a hydrated store that keeps registering at runtime) is skipped, never reused.
 */
function nextStoreId(store: Record<string, unknown>, prefix: string): string {
  let n = storeCounters.get(store) ?? 0;
  while (`${prefix}_${n}` in store) n++;
  storeCounters.set(store, n + 1);
  return `${prefix}_${n}`;
}

export function stableStringify(data: unknown, seen?: Set<unknown>): string {
  if (data === null || data === undefined) return String(data);
  if (typeof data !== 'object') return JSON.stringify(data);

  if (!seen) seen = new Set();
  if (seen.has(data)) return '"[Circular]"';
  seen.add(data);

  if (Array.isArray(data)) {
    return '[' + data.map((item) => stableStringify(item, seen)).join(',') + ']';
  }
  if (!isRecord(data)) return '{}';
  const keys = Object.keys(data).sort();
  return (
    '{' + keys.map((k) => JSON.stringify(k) + ':' + stableStringify(data[k], seen)).join(',') + '}'
  );
}

export function registerSchema(
  schemaStore: Record<string, SchemaEntry>,
  hashIndex: Record<string, string>,
  entry: Omit<SchemaEntry, 'id'> & { id?: string },
): string {
  const storedEntry = hoistSchemaRbac(entry);

  if (entry.id && schemaStore[entry.id]) {
    return entry.id;
  }

  if (!entry.id) {
    const hash = stableStringify(entry.data);
    const existing = hashIndex[hash];
    if (existing) {
      return existing;
    }

    const id = nextStoreId(schemaStore, 'schema');
    schemaStore[id] = { ...storedEntry, id };
    hashIndex[hash] = id;
    return id;
  }

  schemaStore[entry.id] = { ...storedEntry, id: entry.id };
  const hash = stableStringify(entry.data);
  if (!hashIndex[hash]) {
    hashIndex[hash] = entry.id;
  }
  return entry.id;
}

function hoistSchemaRbac<T extends { data: Record<string, unknown> }>(entry: T): T {
  const rbac = readRbacScope(entry.data);
  if (!rbac) {
    return entry;
  }
  return { ...entry, ...rbacProp(rbac) };
}

/** Accepts a raw markdown string or a host-pre-parsed AST node; drops anything else. */
export function pickRenderableDescription(value: unknown): ExampleEntry['description'] {
  return typeof value === 'string' || (typeof value === 'object' && value !== null)
    ? (value as ExampleEntry['description'])
    : undefined;
}

export function registerExample(
  exampleStore: Record<string, ExampleEntry>,
  entry: Omit<ExampleEntry, 'id'> & { id?: string },
): string {
  const id = entry.id ?? nextStoreId(exampleStore, 'example');
  if (!exampleStore[id]) {
    exampleStore[id] = { ...entry, id };
  }
  return id;
}

export function registerSecurityScheme(
  securitySchemeStore: Record<string, SecuritySchemeEntry>,
  entry: SecuritySchemeEntry,
): string {
  if (!securitySchemeStore[entry.id]) {
    securitySchemeStore[entry.id] = entry;
  }
  return entry.id;
}

export function createStoreContext(document: Record<string, unknown>): StoreContext {
  return {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
    hashIndex: {},
    document: document,
  };
}

/**
 * Safely coerce a value to Record<string, unknown>.
 * Returns an empty object if the value is not a valid record.
 */
export function toRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

export function resolveRef<T>(
  spec: Record<string, unknown>,
  value: Referenced<T>,
  ignoreNamedSchemas?: Set<string>,
): T | undefined {
  if (!isRecord(value)) return undefined;
  if (typeof value['$ref'] === 'string') {
    const ref = value['$ref'];
    const schemaName = getDefinitionName(ref);
    if (schemaName && ignoreNamedSchemas?.has(schemaName)) {
      return { type: 'object', title: schemaName } as T;
    }
    return resolveJsonPointer(spec, ref) as T | undefined;
  }
  return value as T;
}

export type MediaTypesMap = { [mime: string]: OpenAPIMediaType };

export function isOpenAPIRef(value: unknown): value is OpenAPIRef {
  return isRecord(value) && typeof (value as { $ref?: unknown }).$ref === 'string';
}

type LegacyExampleHost = {
  content?: { [mime: string]: Referenced<OpenAPIMediaType> };
  'x-examples'?: { [mime: string]: { [name: string]: Referenced<OpenAPIExample> } };
  'x-example'?: { [mime: string]: unknown };
};

/** Follows a `components.mediaTypes` reference chain; `undefined` when it is broken or cyclic. */
export function resolveMediaType(
  spec: Record<string, unknown>,
  entry: Referenced<OpenAPIMediaType>,
): OpenAPIMediaType | undefined {
  const seen = new Set<string>();
  let mediaType: Referenced<OpenAPIMediaType> | undefined = entry;
  while (isOpenAPIRef(mediaType)) {
    if (seen.has(mediaType.$ref)) return undefined;
    seen.add(mediaType.$ref);
    mediaType = resolveRef<Referenced<OpenAPIMediaType>>(spec, mediaType);
  }
  return isRecord(mediaType) ? mediaType : undefined;
}

/** `undefined` when there is no media type left to render. */
export function resolveContent(
  spec: Record<string, unknown>,
  info: LegacyExampleHost | null | undefined,
): MediaTypesMap | undefined {
  if (!info?.content) return undefined;
  const content = isOpenAPIRef(info.content)
    ? resolveRef<MediaTypesMap>(spec, info.content)
    : info.content;
  if (!content) return undefined;
  const resolved: MediaTypesMap = {};
  for (const [mime, entry] of Object.entries(content)) {
    const mediaType = resolveMediaType(spec, entry);
    if (mediaType) resolved[mime] = mediaType;
  }
  const merged = mergeLegacyExamples(resolved, info);
  return merged && Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * Swagger 2.0 body parameters carry their examples as `x-examples` / `x-example`
 * extensions; the Swagger 2.0 converter copies them onto the generated requestBody/response
 * as siblings of `content` (not inside the media type). Merge them into the media map so
 * they render. `x-examples` (plural) wins over `x-example` (singular).
 */
function mergeLegacyExamples(
  media: MediaTypesMap | undefined,
  info: LegacyExampleHost,
): MediaTypesMap | undefined {
  if (!media) return media;

  const xExamples = info['x-examples'];
  if (xExamples) {
    const merged: MediaTypesMap = { ...media };
    for (const mime of Object.keys(xExamples)) {
      merged[mime] = { ...merged[mime], examples: xExamples[mime] };
    }
    return merged;
  }

  const xExample = info['x-example'];
  if (xExample) {
    const merged: MediaTypesMap = { ...media };
    for (const mime of Object.keys(xExample)) {
      merged[mime] = { ...merged[mime], example: xExample[mime] };
    }
    return merged;
  }

  return media;
}

export function resolveJsonPointer(
  spec: Record<string, unknown>,
  ref: string,
): Record<string, unknown> | undefined {
  if (!ref.startsWith('#/')) return undefined;
  const parts = ref
    .slice(2)
    .split('/')
    .map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'));

  let current: unknown = spec;
  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }
  return isRecord(current) ? current : undefined;
}
