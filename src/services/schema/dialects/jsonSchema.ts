import { merge, openApiJsonSchemaMergeRules } from '@redocly/allof-merge';

import type {
  SchemaProcessorDialect,
  SchemaNode,
  Document,
  PropertyType,
  SchemaProcessorOptions,
} from '../../../types/schema.js';
import type { SchemaTreeContext } from '../propertyTreeBuilder.js';

import { schemaKind } from '../../../types/common.js';
import { isSchemaNode } from '../../../types/schema.js';
import { encodeJsonPointerSegment } from '../../../utils/refPointer.js';
import { buildPropertyTree } from '../propertyTreeBuilder.js';

function decodeJsonPointerToken(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

function resolveJsonPointerInDocument(doc: Document, ref: string): SchemaNode | undefined {
  if (!ref.startsWith('#/')) return undefined;
  const parts = ref.slice(2).split('/').map(decodeJsonPointerToken);
  let current: unknown = doc;
  for (const part of parts) {
    if (!isSchemaNode(current)) return undefined;
    current = current[part];
  }
  return isSchemaNode(current) ? current : undefined;
}

function resolveAllRefsInDocument(
  node: unknown,
  doc: Document,
  resolving?: Set<string>,
  resolvedCache?: Map<string, unknown>,
  uncacheableRefs?: Set<string>,
  isAllOfPart = false,
): unknown {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) {
    const visited = resolving ?? new Set<string>();
    return node.map((item) =>
      resolveAllRefsInDocument(item, doc, visited, resolvedCache, uncacheableRefs, isAllOfPart),
    );
  }
  if (!isSchemaNode(node)) return node;

  const visited = resolving ?? new Set<string>();

  if (node.$ref !== undefined) {
    const ref = node.$ref;
    if (typeof ref !== 'string') return node;
    if (visited.has(ref)) {
      // an allOf cycle stub is lossy, so the target and the refs opened after it are
      // right only on this path; a cycle through a property stays cacheable
      if (isAllOfPart) {
        let reachedTarget = false;
        for (const open of visited) {
          if (open === ref) reachedTarget = true;
          if (reachedTarget) uncacheableRefs?.add(open);
        }
      }
      const target = resolveJsonPointerInDocument(doc, ref);
      if (!isSchemaNode(target)) return { 'x-circular-ref': true };
      // a cycle closing on an allOf part contributes nothing to the merge —
      // the still-open instance higher up already carries the content
      if (isAllOfPart && target.allOf !== undefined) return {};
      const { allOf: _allOf, oneOf: _oneOf, anyOf: _anyOf, ...rest } = target;
      return { ...rest, 'x-circular-ref': true, 'x-original-ref': ref };
    }

    const cached = resolvedCache?.get(ref);
    if (cached && isSchemaNode(cached)) {
      const siblings: SchemaNode = {};
      for (const [k, v] of Object.entries(node)) {
        if (k !== '$ref') {
          siblings[k] = resolveAllRefsInDocument(v, doc, visited, resolvedCache, uncacheableRefs);
        }
      }
      return stampParentRefs({ ...cached, ...siblings, 'x-original-ref': ref }, doc);
    }

    const resolved = resolveJsonPointerInDocument(doc, ref);
    if (!resolved) return node;

    visited.add(ref);
    const result = resolveAllRefsInDocument(
      resolved,
      doc,
      visited,
      resolvedCache,
      uncacheableRefs,
      isAllOfPart,
    );
    visited.delete(ref);

    const siblings: SchemaNode = {};
    for (const [k, v] of Object.entries(node)) {
      if (k !== '$ref') {
        siblings[k] = resolveAllRefsInDocument(v, doc, visited, resolvedCache, uncacheableRefs);
      }
    }

    if (isSchemaNode(result)) {
      const closedAllOfCycle = uncacheableRefs?.has(ref) === true;
      // a result that is itself a cycle stub (a bare alias of an open ref) is right only here
      const cacheable = !closedAllOfCycle && result['x-circular-ref'] === undefined;
      if (cacheable) resolvedCache?.set(ref, result);
      const node: SchemaNode = { ...result, ...siblings, 'x-original-ref': ref };
      if (closedAllOfCycle) node['x-allof-cycle'] = true;
      return stampParentRefs(node, doc);
    }
    return result;
  }

  return Object.fromEntries(
    Object.entries(node).map(([k, v]) => [
      k,
      resolveAllRefsInDocument(
        v,
        doc,
        visited,
        resolvedCache,
        uncacheableRefs,
        k === 'allOf' && Array.isArray(v),
      ),
    ]),
  );
}

function prepareSchemaNode(
  node: SchemaNode,
  document: Document,
  resolvedCache: Map<string, unknown>,
  initialVisited?: Set<string>,
): SchemaNode {
  const v = 'openapi' in document ? document.openapi : undefined;
  const mergeRulesVersion = typeof v === 'string' && v.startsWith('3.0') ? '3.0.x' : '3.1.x';
  const uncacheableRefs = new Set<string>();
  const rawResolved = resolveAllRefsInDocument(
    node,
    document,
    initialVisited,
    resolvedCache,
    uncacheableRefs,
  );
  const resolved = isSchemaNode(rawResolved) ? stampParentRefs(rawResolved, document) : node;
  const merged = merge(resolved, {
    mergeCombinarySibling: true,
    applyAdditionalPropertiesToSiblings: false,
    rules: openApiJsonSchemaMergeRules(mergeRulesVersion),
  });

  return isSchemaNode(merged) ? merged : resolved;
}

// True when the raw allOf $ref chain from `startRef` leads back to `startRef` (mutual cycle).
function rawAllOfCyclesBack(doc: Document, startRef: string): boolean {
  const stack: string[] = [];
  const seen = new Set<string>();
  const pushParts = (ref: string): void => {
    const target = resolveJsonPointerInDocument(doc, ref);
    if (!isSchemaNode(target) || !Array.isArray(target.allOf)) return;
    for (const part of target.allOf) {
      if (isSchemaNode(part) && typeof part.$ref === 'string') stack.push(part.$ref);
    }
  };
  pushParts(startRef);
  while (stack.length > 0) {
    const ref = stack.pop() as string;
    if (ref === startRef) return true;
    if (seen.has(ref)) continue;
    seen.add(ref);
    pushParts(ref);
  }
  return false;
}

function collectAllOfParentRefs(node: SchemaNode, doc: Document): string[] {
  if (!Array.isArray(node.allOf)) return [];
  const acc: string[] = [];
  const push = (ref: string): void => {
    if (!acc.includes(ref)) acc.push(ref);
  };
  for (const part of node.allOf) {
    if (!isSchemaNode(part)) continue;
    if (Array.isArray(part.allOf)) {
      // a composed part with its own declared discriminator is a host, not an intermediate
      const ref = part['x-original-ref'];
      if (part.discriminator && typeof ref === 'string' && !rawAllOfCyclesBack(doc, ref)) {
        push(ref);
      }
      for (const ancestor of collectAllOfParentRefs(part, doc)) push(ancestor);
      continue;
    }
    const ref = part['x-original-ref'];
    if (typeof ref === 'string') push(ref);
  }
  return acc;
}

/** Records inheritance on every resolved ref, so nested schemas keep it after merge erases `allOf`. */
function stampParentRefs(node: SchemaNode, doc: Document): SchemaNode {
  const parentRefs = collectAllOfParentRefs(node, doc);
  if (parentRefs.length > 0) node['x-parentRefs'] = parentRefs;
  return node;
}

const implicitDiscriminatorChildrenCache = new WeakMap<
  object,
  Record<string, Array<{ ref: string; value: string }>>
>();

export function getImplicitDiscriminatorChildren(
  document: Document,
): Record<string, Array<{ ref: string; value: string }>> {
  const cached = implicitDiscriminatorChildrenCache.get(document);
  if (cached) return cached;

  const schemas = document.components?.schemas;
  const map: Record<string, Array<{ ref: string; value: string }>> = {};
  if (schemas && typeof schemas === 'object') {
    for (const [name, raw] of Object.entries(schemas)) {
      if (!isSchemaNode(raw) || !Array.isArray(raw.allOf)) continue;
      const value =
        typeof raw['x-discriminator-value'] === 'string' ? raw['x-discriminator-value'] : name;
      const childRef = `#/components/schemas/${encodeJsonPointerSegment(name)}`;
      for (const part of raw.allOf) {
        if (isSchemaNode(part) && typeof part.$ref === 'string') {
          (map[part.$ref] ??= []).push({ ref: childRef, value });
        }
      }
    }
  }

  implicitDiscriminatorChildrenCache.set(document, map);
  return map;
}

const recursiveRefsCache = new WeakMap<object, ReadonlySet<string>>();

function collectRefs(node: unknown, acc: Set<string>): void {
  if (!isSchemaNode(node)) {
    if (Array.isArray(node)) for (const item of node) collectRefs(item, acc);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === '$ref' && typeof value === 'string') acc.add(value);
    else collectRefs(value, acc);
  }
  // `discriminator.mapping` values are refs, but they are not `$ref` keys.
  const discriminator = node.discriminator ?? node['x-discriminator'];
  const mapping = isSchemaNode(discriminator) ? discriminator.mapping : undefined;
  if (isSchemaNode(mapping)) {
    for (const target of Object.values(mapping)) {
      if (typeof target === 'string') acc.add(target);
    }
  }
}

function findCyclicNodes(adjacency: Map<string, string[]>): Set<string> {
  const cyclic = new Set<string>();
  let counter = 0;
  const index = new Map<string, number>();
  const lowlink = new Map<string, number>();
  const onStack = new Set<string>();
  const sccStack: string[] = [];

  for (const start of adjacency.keys()) {
    if (index.has(start)) continue;
    const work: Array<{ node: string; edge: number }> = [{ node: start, edge: 0 }];
    while (work.length > 0) {
      const frame = work[work.length - 1];
      const { node } = frame;
      if (frame.edge === 0) {
        index.set(node, counter);
        lowlink.set(node, counter);
        counter++;
        sccStack.push(node);
        onStack.add(node);
      }
      const neighbors = adjacency.get(node) ?? [];
      if (frame.edge < neighbors.length) {
        const next = neighbors[frame.edge];
        frame.edge++;
        if (!adjacency.has(next)) continue;
        if (!index.has(next)) work.push({ node: next, edge: 0 });
        else if (onStack.has(next))
          lowlink.set(node, Math.min(lowlink.get(node) ?? 0, index.get(next) ?? 0));
        continue;
      }
      if ((lowlink.get(node) ?? 0) === (index.get(node) ?? 0)) {
        const component: string[] = [];
        let popped = '';
        do {
          popped = sccStack.pop() ?? node;
          onStack.delete(popped);
          component.push(popped);
        } while (popped !== node);
        const selfLoop = (adjacency.get(component[0]) ?? []).includes(component[0]);
        if (component.length > 1 || selfLoop) for (const member of component) cyclic.add(member);
      }
      work.pop();
      const parent = work[work.length - 1];
      if (parent) {
        lowlink.set(parent.node, Math.min(lowlink.get(parent.node) ?? 0, lowlink.get(node) ?? 0));
      }
    }
  }
  return cyclic;
}

function getRecursiveRefs(document: Document): ReadonlySet<string> {
  const cached = recursiveRefsCache.get(document);
  if (cached) return cached;

  const schemas = document.components?.schemas;
  const adjacency = new Map<string, string[]>();
  if (schemas && typeof schemas === 'object') {
    const refOf = (name: string) => `#/components/schemas/${encodeJsonPointerSegment(name)}`;
    const decode = (ref: string) =>
      ref
        .replace(/^#\/components\/schemas\//, '')
        .replace(/~1/g, '/')
        .replace(/~0/g, '~');
    const isDiscriminatorParent = (ref: string): boolean => {
      const def = schemas[decode(ref)];
      return isSchemaNode(def) && !!(def.discriminator || def['x-discriminator']);
    };

    for (const [name, def] of Object.entries(schemas)) {
      const refs = new Set<string>();
      collectRefs(def, refs);
      adjacency.set(refOf(name), [...refs]);
    }
    // A schema whose `allOf` references a discriminator parent is an implicit
    // variant of that parent — a reverse edge a forward `$ref` scan cannot see.
    for (const [name, def] of Object.entries(schemas)) {
      if (!isSchemaNode(def) || !Array.isArray(def.allOf)) continue;
      for (const part of def.allOf) {
        if (
          isSchemaNode(part) &&
          typeof part.$ref === 'string' &&
          isDiscriminatorParent(part.$ref)
        ) {
          adjacency.get(part.$ref)?.push(refOf(name));
        }
      }
    }
  }

  const result = findCyclicNodes(adjacency);
  recursiveRefsCache.set(document, result);
  return result;
}

export const JsonSchemaDialectId = schemaKind.JSON_SCHEMA;

export const jsonSchemaDialect: SchemaProcessorDialect = {
  id: JsonSchemaDialectId,
  process(schema, document, options?: SchemaProcessorOptions): PropertyType {
    const resolvedCache = new Map<string, unknown>();
    const rootJsonPointer = options?.rootJsonPointer ?? '#';
    const initialVisited =
      rootJsonPointer.startsWith('#/') && schema.$ref !== rootJsonPointer
        ? new Set([rootJsonPointer])
        : undefined;
    const merged = prepareSchemaNode(schema, document, resolvedCache, initialVisited);
    const ctx: SchemaTreeContext = {
      prepareVariant: (node) => prepareSchemaNode(node, document, resolvedCache),
      propertyRefCache: new Map(),
      variantResolutionCache: new Map(),
      implicitDiscriminatorChildren: getImplicitDiscriminatorChildren(document),
      exampleSerializer: options?.exampleSerializer,
      sortRequiredPropsFirst: options?.sortRequiredPropsFirst,
      activeRefs: rootJsonPointer.startsWith('#/') ? new Set([rootJsonPointer]) : new Set(),
      depth: 0,
      recursiveRefs: getRecursiveRefs(document),
    };
    return buildPropertyTree(merged, ctx, rootJsonPointer);
  },
};
