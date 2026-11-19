import { isRecord, resolveJsonPointer } from '../../adapters/helpers.js';
import { decodeJsonPointerSegment, encodeJsonPointerSegment } from '../../utils/refPointer.js';

const COMPONENTS_REF_PREFIX = '#/components/';

export type ComponentClosure = {
  keep: Map<string, Set<string>>;
  refTargets: Map<string, Record<string, unknown>>;
  /** Whether a target more than `maxRefDepth` `$ref` hops from the seeds was left out. */
  truncated: boolean;
};

/**
 * The components and local `$ref` targets the seeds reach, at most `maxRefDepth` `$ref` hops
 * away; each target counts at its shortest distance.
 */
export function collectComponentClosure(
  document: Record<string, unknown>,
  seeds: unknown[],
  retainRef?: (ref: string) => boolean,
  maxRefDepth = Infinity,
): ComponentClosure {
  const keep = new Map<string, Set<string>>();
  const refTargets = new Map<string, Record<string, unknown>>();
  let layer: unknown[] = [...seeds];
  let nextLayer: unknown[] = [];
  let depth = 0;
  let truncated = false;
  const seen = new WeakSet<object>();

  let implicitVariants: Map<string, string[]> | undefined;
  const getImplicitVariants = (): Map<string, string[]> => {
    if (implicitVariants) return implicitVariants;
    implicitVariants = new Map();
    const schemas = isRecord(document.components) ? document.components.schemas : undefined;
    if (isRecord(schemas)) {
      const schemaRefPrefix = `${COMPONENTS_REF_PREFIX}schemas/`;
      for (const [childName, def] of Object.entries(schemas)) {
        if (!isRecord(def) || !Array.isArray(def.allOf)) continue;
        for (const part of def.allOf) {
          if (!isRecord(part) || typeof part.$ref !== 'string') continue;
          if (!part.$ref.startsWith(schemaRefPrefix)) continue;
          const parentName = decodeJsonPointerSegment(part.$ref.slice(schemaRefPrefix.length));
          const parentDef = schemas[parentName];
          if (!isRecord(parentDef) || !(parentDef.discriminator || parentDef['x-discriminator'])) {
            continue;
          }
          const children = implicitVariants.get(parentName) ?? [];
          children.push(childName);
          implicitVariants.set(parentName, children);
        }
      }
    }
    return implicitVariants;
  };

  const keepComponent = (bucket: string, encodedName: string): void => {
    const name = decodeJsonPointerSegment(encodedName);
    let bucketNames = keep.get(bucket);
    if (!bucketNames) {
      bucketNames = new Set();
      keep.set(bucket, bucketNames);
    }
    if (bucketNames.has(name)) return;

    const componentRef = `${COMPONENTS_REF_PREFIX}${bucket}/${encodedName}`;
    const resolved = resolveJsonPointer(document, componentRef);
    if (!resolved) {
      return;
    }
    if (depth >= maxRefDepth) {
      truncated = true;
      return;
    }
    bucketNames.add(name);
    nextLayer.push(resolved);

    if (bucket === 'schemas' && (resolved.discriminator || resolved['x-discriminator'])) {
      for (const childName of getImplicitVariants().get(name) ?? []) {
        keepComponent('schemas', encodeJsonPointerSegment(childName));
      }
    }
  };

  const handleRef = (ref: string): void => {
    if (ref.startsWith(COMPONENTS_REF_PREFIX)) {
      const [bucket, encodedName] = ref.slice(COMPONENTS_REF_PREFIX.length).split('/');
      if (bucket && encodedName) {
        keepComponent(bucket, encodedName);
        return;
      }
    }
    if (retainRef?.(ref)) return;
    if (ref.startsWith('#/')) {
      if (refTargets.has(ref)) return;
      const resolved = resolveJsonPointer(document, ref);
      if (!resolved) {
        return;
      }
      if (depth >= maxRefDepth) {
        truncated = true;
        return;
      }
      refTargets.set(ref, resolved);
      nextLayer.push(resolved);
      return;
    }
  };

  const visitNode = (node: unknown, stack: unknown[]): void => {
    if (Array.isArray(node)) {
      for (const entry of node) stack.push(entry);
      return;
    }
    if (!isRecord(node) || seen.has(node)) return;
    seen.add(node);

    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string') {
        handleRef(value);
        continue;
      }
      if (key === 'security' && Array.isArray(value)) {
        for (const requirement of value) {
          if (!isRecord(requirement)) continue;
          for (const schemeName of Object.keys(requirement)) {
            keepComponent('securitySchemes', encodeJsonPointerSegment(schemeName));
          }
        }
      }
      stack.push(value);
    }

    const discriminator = node.discriminator ?? node['x-discriminator'];
    const mapping = isRecord(discriminator) ? discriminator.mapping : undefined;
    if (isRecord(mapping)) {
      for (const target of Object.values(mapping)) {
        if (typeof target !== 'string') continue;
        if (target.startsWith('#/')) {
          handleRef(target);
        } else {
          keepComponent('schemas', encodeJsonPointerSegment(target));
        }
      }
    }
  };

  while (layer.length) {
    nextLayer = [];
    const stack = layer;
    while (stack.length) visitNode(stack.pop(), stack);
    layer = nextLayer;
    depth += 1;
  }

  return { keep, refTargets, truncated };
}

export function buildComponentsFromClosure(
  document: Record<string, unknown>,
  keep: Map<string, Set<string>>,
): Record<string, unknown> | undefined {
  const sourceComponents = document.components;
  if (!isRecord(sourceComponents) || keep.size === 0) return undefined;

  const components: Record<string, unknown> = {};
  for (const [bucket, entries] of Object.entries(sourceComponents)) {
    const keptNames = keep.get(bucket);
    if (!keptNames?.size || !isRecord(entries)) continue;
    const prunedBucket: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(entries)) {
      if (keptNames.has(name)) prunedBucket[name] = value;
    }
    if (Object.keys(prunedBucket).length) components[bucket] = prunedBucket;
  }

  return Object.keys(components).length ? components : undefined;
}
