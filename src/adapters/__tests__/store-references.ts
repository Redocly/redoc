import type { ApiItem, ApiStore } from '../../types/store.js';

import { nodeTypes } from '../../types/common.js';
import { refPointerToStoreId } from '../../utils/refPointer.js';

type StoreReferences = {
  schemaIds: Set<string>;
  exampleIds: Set<string>;
  securitySchemeIds: Set<string>;
};

type Reference = { store: keyof StoreReferences; id: string; where: string };

/**
 * Every store reference an item tree makes, by store: `schemaId` / `*SchemaId` keys, the
 * `schemaRef` pointer of schema definition tags, `exampleIds` arrays and `exampleId` keys, the scheme names of `security` nodes and the
 * `security[].schemes[].id` of code-sample sources. Nested `items` are walked too.
 */
export function collectStoreReferences(items: ApiItem[]): StoreReferences {
  const references: StoreReferences = {
    schemaIds: new Set(),
    exampleIds: new Set(),
    securitySchemeIds: new Set(),
  };
  for (const { store, id } of walkReferences(items)) references[store].add(id);
  return references;
}

/** Throws, listing the item trail, for every reference with no entry in `store`. */
export function expectStoreReferencesResolve(items: ApiItem[], store: ApiStore): void {
  const entries: Record<keyof StoreReferences, Record<string, unknown>> = {
    schemaIds: store.schemaStore,
    exampleIds: store.exampleStore,
    securitySchemeIds: store.securitySchemeStore,
  };
  const dangling = walkReferences(items).filter(({ store: kind, id }) => !(id in entries[kind]));
  if (dangling.length > 0) {
    throw new Error(
      `${dangling.length} store reference(s) have no entry:\n` +
        dangling.map(({ store: kind, id, where }) => `  ${kind} "${id}" at ${where}`).join('\n'),
    );
  }
}

function walkReferences(items: ApiItem[]): Reference[] {
  const found: Reference[] = [];

  const walk = (node: unknown, where: string): void => {
    if (Array.isArray(node)) {
      node.forEach((element, index) => walk(element, `${where}[${index}]`));
      return;
    }
    if (!isObject(node)) return;

    const here = typeof node.label === 'string' ? `${where} "${node.label}"` : where;
    if (node.nodeType === nodeTypes.SECURITY && Array.isArray(node.requirements)) {
      for (const requirement of node.requirements) {
        for (const scheme of isObject(requirement) && Array.isArray(requirement.schemes)
          ? requirement.schemes
          : []) {
          if (isObject(scheme) && typeof scheme.name === 'string') {
            found.push({ store: 'securitySchemeIds', id: scheme.name, where: here });
          }
        }
      }
    }

    for (const [key, value] of Object.entries(node)) {
      const at = `${here}.${key}`;
      if (typeof value === 'string' && (key === 'schemaId' || key.endsWith('SchemaId'))) {
        found.push({ store: 'schemaIds', id: value, where: at });
      } else if (key === 'schemaRef' && typeof value === 'string') {
        found.push({ store: 'schemaIds', id: refPointerToStoreId(value) ?? value, where: at });
      } else if (key === 'exampleId' && typeof value === 'string') {
        found.push({ store: 'exampleIds', id: value, where: at });
      } else if (key === 'exampleIds' && Array.isArray(value)) {
        for (const id of value) {
          if (typeof id === 'string') found.push({ store: 'exampleIds', id, where: at });
        }
      } else if (key === 'security' && Array.isArray(value)) {
        for (const requirement of value) {
          for (const scheme of isObject(requirement) && Array.isArray(requirement.schemes)
            ? requirement.schemes
            : []) {
            if (isObject(scheme) && typeof scheme.id === 'string') {
              found.push({ store: 'securitySchemeIds', id: scheme.id, where: at });
            }
          }
        }
      } else {
        walk(value, at);
      }
    }
  };

  walk(items, 'items');
  return found;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
