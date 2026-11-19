import { isRecord } from '../../adapters/helpers.js';
import { resolvePathItemRef } from '../../adapters/openapi/utils/resolvePathItemRef.js';
import { JsonPointer } from '../../adapters/openapi/utils/JsonPointer.js';
import { isNonNavTag } from '../../adapters/openapi/utils/helpers.js';
import { mcpEntities } from '../../adapters/openapi/utils/mcp.js';
import { SUPPORTED_MCP_TYPES } from '../../adapters/openapi/constants.js';
import { getSchemaNamesForTags } from '../../adapters/openapi/utils/schema-tags.js';
import { isOperationName } from '../../utils/http-methods.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { DEFAULT_WEBHOOKS_TAG_NAME } from '../../constants/openapi.js';
import { collectComponentClosure, buildComponentsFromClosure } from './component-closure.js';
import { cloneStrip } from './clone-strip.js';
import { describeSubsetInInfo } from './subset-description.js';

import type { SpecSliceScope } from './types.js';
import type { OpenAPIDefinition } from '../../types/openapi.js';

const SLICE_ROOT_FIELDS = [
  'openapi',
  'info',
  'jsonSchemaDialect',
  'externalDocs',
  'servers',
  'security',
] as const;

export function parsePointerTokens(pointer: string): string[] {
  const normalized = pointer.startsWith('/') || pointer.startsWith('#') ? pointer : `/${pointer}`;
  try {
    return JsonPointer.parse(normalized);
  } catch {
    return [];
  }
}

type LocatedOperation = {
  operation: Record<string, unknown>;
  verbKey: string;
  isAdditional: boolean;
};

type KeptPathItem = {
  pathItem: Record<string, unknown>;
  operations: LocatedOperation[];
};

type OpenApiDocument = Record<string, unknown> & OpenAPIDefinition;

export type OpenApiSliceOptions = {
  schemaDefinitionsTagName?: string;
  /** Leave out components more than this many `$ref` hops from the page's own part. */
  maxRefDepth?: number;
};

export function operationScopeFromPointer(
  pointer: string,
  isWebhook: boolean | undefined,
): SpecSliceScope | undefined {
  const tokens = parsePointerTokens(pointer);
  if (tokens.length < 3 || tokens[0] !== 'paths') return undefined;
  return {
    kind: 'operation',
    pathName: tokens[1],
    httpVerb: tokens[2],
    source: isWebhook ? 'webhooks' : 'paths',
  };
}

function isOpenApiDocument(document: Record<string, unknown>): document is OpenApiDocument {
  return typeof document.openapi === 'string';
}

export function extractOpenApiSlice(
  document: Record<string, unknown>,
  scope: SpecSliceScope,
  options: OpenApiSliceOptions = {},
): { document: Record<string, unknown> } | undefined {
  if (!isOpenApiDocument(document)) return undefined;

  if (scope.kind === 'document') {
    return { document: cloneStrip(document, new Map()) };
  }

  const built = buildDraft(document, scope, options);
  if (!built) return undefined;
  const { draft, extraSeeds = [] } = built;

  const closure = collectComponentClosure(
    document,
    [draft, ...extraSeeds],
    undefined,
    options.maxRefDepth,
  );
  const components = buildComponentsFromClosure(document, closure.keep);
  if (components) draft.components = components;
  describeSubsetInInfo(draft, scope, closure.truncated ? options.maxRefDepth : undefined);

  return { document: cloneStrip(draft, closure.refTargets) };
}

type BuiltDraft = {
  draft: Record<string, unknown>;
  extraSeeds?: unknown[];
};

function buildDraft(
  document: OpenApiDocument,
  scope: Exclude<SpecSliceScope, { kind: 'document' }>,
  options: OpenApiSliceOptions,
): BuiltDraft | undefined {
  const draft: Record<string, unknown> = {};
  for (const field of SLICE_ROOT_FIELDS) {
    if (document[field] !== undefined) draft[field] = document[field];
  }
  if (scope.kind === 'schema') {
    const schemas = isRecord(document.components) ? document.components.schemas : undefined;
    if (!isRecord(schemas) || !(scope.name in schemas)) return undefined;
    draft.paths = {};
    return { draft, extraSeeds: [schemaRef(scope.name)] };
  }

  const webhooksKey = document['x-webhooks'] ? 'x-webhooks' : 'webhooks';
  const webhooksMap = document['x-webhooks'] ?? document.webhooks;

  let keptPaths: Map<string, KeptPathItem>;
  let keptWebhooks: Map<string, KeptPathItem>;
  let schemaSeeds: unknown[] = [];
  let mcp: Record<string, unknown> | undefined;
  const keptTagNames = new Set<string>();

  if (scope.kind === 'operation') {
    keptPaths = new Map();
    keptWebhooks = new Map();
    const rootMap = scope.source === 'webhooks' ? webhooksMap : document.paths;
    const kept = locateOperationInMap(document, rootMap, scope.pathName, scope.httpVerb);
    if (!kept) return undefined;
    (scope.source === 'webhooks' ? keptWebhooks : keptPaths).set(scope.pathName, kept);
  } else if (scope.kind === 'tag') {
    const tagNames = tagWithDescendants(document, scope.tagName);
    for (const tagName of tagNames) keptTagNames.add(tagName);
    keptPaths = collectTaggedOperations(document, document.paths, tagNames, false);
    keptWebhooks = collectTaggedOperations(document, webhooksMap, tagNames, true);
    schemaSeeds = getSchemaNamesForTags(tagNames, document, options.schemaDefinitionsTagName).map(
      schemaRef,
    );
    mcp = mcpEntitiesOfTags(document, tagNames);
    if (!keptPaths.size && !keptWebhooks.size && !schemaSeeds.length && !mcp) return undefined;
  } else {
    return undefined;
  }

  for (const kept of [...keptPaths.values(), ...keptWebhooks.values()]) {
    for (const { operation } of kept.operations) {
      const tags = operation.tags;
      if (!Array.isArray(tags)) continue;
      for (const tag of tags) {
        if (typeof tag === 'string') keptTagNames.add(tag);
      }
    }
  }

  const tags = buildTagsWithAncestors(document, keptTagNames);
  if (tags.length) draft.tags = tags;

  const tagGroups = buildFilteredTagGroups(document, keptTagNames);
  if (tagGroups.length) draft['x-tagGroups'] = tagGroups;

  draft.paths = materializePathMap(keptPaths);
  if (keptWebhooks.size) draft[webhooksKey] = materializePathMap(keptWebhooks);
  if (mcp) draft['x-mcp'] = mcp;

  return { draft, extraSeeds: schemaSeeds };
}

function schemaRef(name: string): { $ref: string } {
  return { $ref: `#/components/schemas/${encodeJsonPointerSegment(name)}` };
}

const MCP_COLLECTION_TYPES: ReadonlySet<string> = new Set<string>(SUPPORTED_MCP_TYPES);

/**
 * `x-mcp` with its server fields and, of its collections, only the entities listed under
 * `tagNames`; `undefined` when none are listed.
 */
function mcpEntitiesOfTags(
  document: OpenApiDocument,
  tagNames: ReadonlySet<string>,
): Record<string, unknown> | undefined {
  const kept = mcpEntities(document).filter((entity) =>
    entity.tags.some((tag) => tagNames.has(tag)),
  );
  const mcp = document['x-mcp'];
  if (!kept.length || !isRecord(mcp)) return undefined;

  const slice: Record<string, unknown> = Object.fromEntries(
    Object.entries(mcp).filter(([key]) => !MCP_COLLECTION_TYPES.has(key)),
  );
  for (const collectionType of SUPPORTED_MCP_TYPES) {
    const entities: unknown = mcp[collectionType];
    if (!Array.isArray(entities)) continue;
    const names = new Set(
      kept.filter((entity) => entity.collectionType === collectionType).map(({ name }) => name),
    );
    const keptEntities = entities.filter(
      (entity) => isRecord(entity) && typeof entity.name === 'string' && names.has(entity.name),
    );
    if (keptEntities.length) slice[collectionType] = keptEntities;
  }
  return slice;
}

function resolvePathItem(
  document: Record<string, unknown>,
  rawItem: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(rawItem)) return undefined;
  try {
    const resolved = resolvePathItemRef(document, rawItem, document.openapi as string);
    return isRecord(resolved) ? resolved : undefined;
  } catch {
    return undefined;
  }
}

function locateOperationInMap(
  document: Record<string, unknown>,
  rootMap: unknown,
  pathName: string,
  httpVerb: string,
): KeptPathItem | undefined {
  if (!isRecord(rootMap)) return undefined;
  const pathItem = resolvePathItem(document, rootMap[pathName]);
  if (!pathItem) return undefined;

  const direct = pathItem[httpVerb];
  if (isRecord(direct)) {
    return {
      pathItem,
      operations: [{ operation: direct, verbKey: httpVerb, isAdditional: false }],
    };
  }
  if (httpVerb === 'query' && isRecord(pathItem['x-query'])) {
    return {
      pathItem,
      operations: [{ operation: pathItem['x-query'], verbKey: 'x-query', isAdditional: false }],
    };
  }
  const additional = isRecord(pathItem.additionalOperations)
    ? pathItem.additionalOperations[httpVerb]
    : undefined;
  if (isRecord(additional)) {
    return {
      pathItem,
      operations: [{ operation: additional, verbKey: httpVerb, isAdditional: true }],
    };
  }
  return undefined;
}

function operationMatchesTag(
  operation: Record<string, unknown>,
  tagNames: ReadonlySet<string>,
  isWebhook: boolean,
): boolean {
  const tags: unknown[] =
    Array.isArray(operation.tags) && operation.tags.length > 0
      ? operation.tags
      : [isWebhook ? DEFAULT_WEBHOOKS_TAG_NAME : ''];
  return tags.some((tag) => typeof tag === 'string' && tagNames.has(tag));
}

function collectTaggedOperations(
  document: Record<string, unknown>,
  rootMap: unknown,
  tagNames: ReadonlySet<string>,
  isWebhook: boolean,
): Map<string, KeptPathItem> {
  const kept = new Map<string, KeptPathItem>();
  if (!isRecord(rootMap)) return kept;

  for (const pathName of Object.keys(rootMap)) {
    const pathItem = resolvePathItem(document, rootMap[pathName]);
    if (!pathItem) continue;

    const operations: LocatedOperation[] = [];
    for (const [key, value] of Object.entries(pathItem)) {
      if (!isOperationName(key) || !isRecord(value)) continue;
      if (operationMatchesTag(value, tagNames, isWebhook)) {
        operations.push({ operation: value, verbKey: key, isAdditional: false });
      }
    }
    if (isRecord(pathItem.additionalOperations)) {
      for (const [verb, value] of Object.entries(pathItem.additionalOperations)) {
        if (!isRecord(value)) continue;
        if (operationMatchesTag(value, tagNames, isWebhook)) {
          operations.push({ operation: value, verbKey: verb, isAdditional: true });
        }
      }
    }

    if (operations.length) kept.set(pathName, { pathItem, operations });
  }
  return kept;
}

const PATH_ITEM_SHARED_FIELDS = ['summary', 'description', 'parameters', 'servers'] as const;

function materializePathMap(kept: Map<string, KeptPathItem>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [pathName, { pathItem, operations }] of kept) {
    const materialized: Record<string, unknown> = {};
    for (const field of PATH_ITEM_SHARED_FIELDS) {
      if (pathItem[field] !== undefined) materialized[field] = pathItem[field];
    }
    const additional: Record<string, unknown> = {};
    for (const { operation, verbKey, isAdditional } of operations) {
      if (isAdditional) additional[verbKey] = operation;
      else materialized[verbKey] = operation;
    }
    if (Object.keys(additional).length) materialized.additionalOperations = additional;
    result[pathName] = materialized;
  }
  return result;
}

/** The tag and every tag nested under it through `parent`, as the navigation nests them. */
function tagWithDescendants(document: Record<string, unknown>, tagName: string): Set<string> {
  const childrenOf = new Map<string, string[]>();
  for (const tag of Array.isArray(document.tags) ? document.tags : []) {
    if (!isRecord(tag) || typeof tag.name !== 'string' || typeof tag.parent !== 'string') continue;
    if (isNonNavTag(tag)) continue;
    const children = childrenOf.get(tag.parent);
    if (children) children.push(tag.name);
    else childrenOf.set(tag.parent, [tag.name]);
  }

  const names = new Set([tagName]);
  // A Set iterator also visits the names added during the loop, so this walks the whole subtree.
  for (const name of names) {
    for (const child of childrenOf.get(name) ?? []) names.add(child);
  }
  return names;
}

function buildTagsWithAncestors(
  document: Record<string, unknown>,
  keptTagNames: ReadonlySet<string>,
): unknown[] {
  const docTags = Array.isArray(document.tags) ? document.tags : [];
  const byName = new Map<string, Record<string, unknown>>();
  for (const tag of docTags) {
    if (isRecord(tag) && typeof tag.name === 'string') byName.set(tag.name, tag);
  }

  const included = new Set<string>();
  const include = (name: string): void => {
    if (included.has(name)) return;
    const tag = byName.get(name);
    if (!tag) return;
    included.add(name);
    if (typeof tag.parent === 'string') include(tag.parent);
  };
  for (const name of keptTagNames) include(name);

  return docTags.filter((tag) => isRecord(tag) && included.has(tag.name as string));
}

function buildFilteredTagGroups(
  document: Record<string, unknown>,
  keptTagNames: ReadonlySet<string>,
): unknown[] {
  const groups = document['x-tagGroups'];
  if (!Array.isArray(groups)) return [];

  const filtered: unknown[] = [];
  for (const group of groups) {
    if (!isRecord(group) || !Array.isArray(group.tags)) continue;
    const keptTags = group.tags.filter(
      (name) => typeof name === 'string' && keptTagNames.has(name),
    );
    if (keptTags.length) filtered.push({ ...group, tags: keptTags });
  }
  return filtered;
}
