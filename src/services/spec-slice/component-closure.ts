import { isRecord, resolveJsonPointer } from '../../adapters/helpers.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';

const COMPONENTS_REF_PREFIX = '#/components/';

export type ComponentClosure = {
  keep: Map<string, Set<string>>;
  inlineTargets: Map<string, unknown>;
};

function decodePointerSegment(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~');
}

export function collectComponentClosure(
  document: Record<string, unknown>,
  seeds: unknown[],
  retainRef?: (ref: string) => boolean,
): ComponentClosure {
  const keep = new Map<string, Set<string>>();
  const inlineTargets = new Map<string, unknown>();
  const queue: unknown[] = [...seeds];
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
          const parentName = decodePointerSegment(part.$ref.slice(schemaRefPrefix.length));
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
    const name = decodePointerSegment(encodedName);
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
    bucketNames.add(name);
    queue.push(resolved);

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
      if (inlineTargets.has(ref)) return;
      const resolved = resolveJsonPointer(document, ref);
      if (!resolved) {
        return;
      }
      inlineTargets.set(ref, resolved);
      queue.push(resolved);
      return;
    }
  };

  while (queue.length) {
    const node = queue.pop();
    if (Array.isArray(node)) {
      queue.push(...node);
      continue;
    }
    if (!isRecord(node) || seen.has(node)) continue;
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
      queue.push(value);
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
  }

  return { keep, inlineTargets };
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
