import { isRecord } from '../../adapters/helpers.js';
import { resolvePathItemRef } from '../../adapters/openapi/utils/resolvePathItemRef.js';
import { JsonPointer } from '../../adapters/openapi/utils/JsonPointer.js';
import { isOperationName } from '../../utils/http-methods.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { DEFAULT_WEBHOOKS_TAG_NAME } from '../../constants/openapi.js';
import { collectComponentClosure, buildComponentsFromClosure } from './component-closure.js';
import { cloneStrip } from './clone-strip.js';

import type { OpenAPIPath } from '../../types/openapi.js';
import type { SpecSliceScope } from './types.js';

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

export function extractOpenApiSlice(
  document: Record<string, unknown>,
  scope: SpecSliceScope,
): { document: Record<string, unknown> } | undefined {
  if (typeof document.openapi !== 'string') return undefined;

  if (scope.kind === 'document') {
    return {
      document: cloneStrip(document, new Map()) as Record<string, unknown>,
    };
  }

  const built = buildDraft(document, scope);
  if (!built) return undefined;
  const { draft, extraSeeds = [] } = built;

  const closure = collectComponentClosure(document, [draft, ...extraSeeds]);
  const components = buildComponentsFromClosure(document, closure.keep);
  if (components) draft.components = components;

  return {
    document: cloneStrip(draft, closure.inlineTargets) as Record<string, unknown>,
  };
}

type BuiltDraft = {
  draft: Record<string, unknown>;
  extraSeeds?: unknown[];
};

function buildDraft(
  document: Record<string, unknown>,
  scope: Exclude<SpecSliceScope, { kind: 'document' }>,
): BuiltDraft | undefined {
  const draft: Record<string, unknown> = {};
  for (const field of SLICE_ROOT_FIELDS) {
    if (document[field] !== undefined) draft[field] = document[field];
  }

  if (scope.kind === 'schema') {
    const schemas = isRecord(document.components) ? document.components.schemas : undefined;
    if (!isRecord(schemas) || !(scope.name in schemas)) return undefined;
    draft.paths = {};
    const seedRef = {
      $ref: `#/components/schemas/${encodeJsonPointerSegment(scope.name)}`,
    };
    return { draft, extraSeeds: [seedRef] };
  }

  const webhooksKey = document['x-webhooks'] ? 'x-webhooks' : 'webhooks';
  const webhooksMap = document['x-webhooks'] ?? document.webhooks;

  let keptPaths: Map<string, KeptPathItem>;
  let keptWebhooks: Map<string, KeptPathItem>;

  if (scope.kind === 'operation') {
    keptPaths = new Map();
    keptWebhooks = new Map();
    const rootMap = scope.source === 'webhooks' ? webhooksMap : document.paths;
    const kept = locateOperationInMap(document, rootMap, scope.pathName, scope.httpVerb);
    if (!kept) return undefined;
    (scope.source === 'webhooks' ? keptWebhooks : keptPaths).set(scope.pathName, kept);
  } else if (scope.kind === 'tag') {
    keptPaths = collectTaggedOperations(document, document.paths, scope.tagName, false);
    keptWebhooks = collectTaggedOperations(document, webhooksMap, scope.tagName, true);
    if (keptPaths.size === 0 && keptWebhooks.size === 0) return undefined;
  } else {
    return undefined;
  }

  const keptTagNames = new Set<string>();
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

  return { draft };
}

function resolvePathItem(
  document: Record<string, unknown>,
  rawItem: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(rawItem)) return undefined;
  try {
    const resolved = resolvePathItemRef(
      document,
      rawItem as OpenAPIPath,
      document.openapi as string,
    );
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
  tagName: string,
  isWebhook: boolean,
): boolean {
  const tags = Array.isArray(operation.tags)
    ? operation.tags
    : [isWebhook ? DEFAULT_WEBHOOKS_TAG_NAME : ''];
  return tags.includes(tagName);
}

function collectTaggedOperations(
  document: Record<string, unknown>,
  rootMap: unknown,
  tagName: string,
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
      if (operationMatchesTag(value, tagName, isWebhook)) {
        operations.push({ operation: value, verbKey: key, isAdditional: false });
      }
    }
    if (isRecord(pathItem.additionalOperations)) {
      for (const [verb, value] of Object.entries(pathItem.additionalOperations)) {
        if (!isRecord(value)) continue;
        if (operationMatchesTag(value, tagName, isWebhook)) {
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
