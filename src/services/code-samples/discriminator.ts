import type { OpenAPIDiscriminator } from '../../types/openapi.js';
import type { SchemaEntry } from '../../types/store.js';
import type { SchemaNode } from '../../types/schema.js';

import { buildVariantStateKey } from '../../jotai/itemStore.js';
import { appendVariantSuffix } from '../../utils/deep-link.js';
import { deriveVariantLabel } from '../schema/variant-label.js';

function getDiscriminator(data: Record<string, unknown>): OpenAPIDiscriminator | undefined {
  return data.discriminator as OpenAPIDiscriminator | undefined;
}

function stripRefPrefix(ref: string): string {
  return ref.startsWith('#/') ? ref.slice(2) : ref;
}

type EffectiveDiscriminator = {
  propertyName: string;
  mapping: Record<string, string>;
  defaultMapping?: string;
  variantsNode?: Record<string, unknown>;
};

export function findEffectiveDiscriminator(
  schemaData: Record<string, unknown> | undefined,
  schemaStore: Record<string, SchemaEntry>,
  visited: Set<string> = new Set(),
): EffectiveDiscriminator | undefined {
  if (!schemaData) return undefined;

  const direct = getDiscriminator(schemaData);
  if (direct?.propertyName && (direct.mapping || schemaData.oneOf || schemaData.anyOf)) {
    return {
      propertyName: direct.propertyName,
      mapping: direct.mapping ?? {},
      ...(direct.defaultMapping && { defaultMapping: direct.defaultMapping }),
      ...((Array.isArray(schemaData.oneOf) || Array.isArray(schemaData.anyOf)) && {
        variantsNode: schemaData,
      }),
    };
  }

  const allOf = schemaData.allOf;
  if (!Array.isArray(allOf)) return undefined;

  for (const branch of allOf) {
    if (!branch || typeof branch !== 'object') continue;
    const record = branch as Record<string, unknown>;

    if (typeof record.$ref === 'string') {
      const refId = stripRefPrefix(record.$ref);
      if (visited.has(refId)) continue;
      visited.add(refId);
      const entry = schemaStore[refId];
      if (entry) {
        const found = findEffectiveDiscriminator(entry.data, schemaStore, visited);
        if (found) return found;
      }
      continue;
    }

    const found = findEffectiveDiscriminator(record, schemaStore, visited);
    if (found) return found;
  }

  return undefined;
}


function isNonEmptyObject(value: unknown): value is Record<string, unknown> {
  return (
    !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0
  );
}


function resolveStoreIdFromRef(
  value: unknown,
  schemaStore: Record<string, SchemaEntry>,
): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if (typeof record.$ref !== 'string') return undefined;
  const id = stripRefPrefix(record.$ref);
  return schemaStore[id] ? id : undefined;
}

type SchemaVariantOption = {
  label: string;
  schemaId: string;
  mappingKey?: string;
  isDefaultMapping?: boolean;
  isDeprecated?: boolean;
};


export type SchemaVariantAxis = {
  kind: 'discriminator' | 'oneOf' | 'anyOf';
  stateKey: string;
  options: SchemaVariantOption[];
  localPart: string;
  parentPath: string[];
};

const ONE_OF_LOCAL_PART = 'One of:';
const ANY_OF_LOCAL_PART = 'Any of:';
const DEFAULT_MAPPING_LABEL = 'Default mapping';

function isDeprecated(node: Record<string, unknown> | undefined): boolean {
  return !!node?.deprecated;
}

function variantSchemaForLabelDerivation(
  variantRef: unknown,
  schemaStore: Record<string, SchemaEntry>,
): SchemaNode {
  if (!variantRef || typeof variantRef !== 'object') return {};
  const record = variantRef as Record<string, unknown>;
  if (typeof record.$ref === 'string') {
    const entry = schemaStore[stripRefPrefix(record.$ref)];
    // A ref the store cannot resolve — a missing schema, or one hidden from this
    // viewer — must not lend its name to the label.
    if (!entry) return {};
    const merged = { ...entry.data } as SchemaNode;
    merged['x-original-ref'] = record.$ref;
    return merged;
  }
  return record;
}

/**
 * Mirrors the schema panel: a mapping target that is not in the store — a missing schema,
 * or one hidden from this viewer — must not become an option.
 */
function storedTarget(
  ref: string,
  schemaStore: Record<string, SchemaEntry>,
): { schemaId: string; entry: SchemaEntry } | undefined {
  const schemaId = stripRefPrefix(ref);
  const entry = schemaStore[schemaId];
  return entry ? { schemaId, entry } : undefined;
}

function buildDiscriminatorAxis(
  discriminator: EffectiveDiscriminator,
  schemaStore: Record<string, SchemaEntry>,
  parentPath: string[],
): SchemaVariantAxis | undefined {
  const mappingEntries = Object.entries(discriminator.mapping);
  if (mappingEntries.length === 0) return undefined;

  const defaultRef = discriminator.defaultMapping;
  const options: SchemaVariantOption[] = [];

  for (const [mappingKey, ref] of mappingEntries) {
    const target = storedTarget(ref, schemaStore);
    if (!target) continue;
    options.push({
      label: mappingKey,
      schemaId: target.schemaId,
      mappingKey,
      isDeprecated: isDeprecated(target.entry.data),
    });
  }

  const defaultTarget = defaultRef ? storedTarget(defaultRef, schemaStore) : undefined;
  if (defaultRef && defaultTarget) {
    // Fold by name, mirroring the schema panel: only the entry named like the
    // schema collapses into 'Default mapping'; explicit names stay listed.
    const implicitName = defaultRef.split('/').pop();
    const foldIdx = options.findIndex((option) => option.label === implicitName);
    if (foldIdx !== -1) options.splice(foldIdx, 1);
    options.push({
      label: DEFAULT_MAPPING_LABEL,
      schemaId: defaultTarget.schemaId,
      isDefaultMapping: true,
      isDeprecated: isDeprecated(defaultTarget.entry.data),
    });
  }

  return {
    kind: 'discriminator',
    stateKey: buildVariantStateKey(parentPath, discriminator.propertyName),
    options,
    localPart: discriminator.propertyName,
    parentPath,
  };
}

function buildOneOfAxis(
  variants: unknown[],
  parentSchema: Record<string, unknown>,
  schemaStore: Record<string, SchemaEntry>,
  parentPath: string[],
  kind: 'oneOf' | 'anyOf',
): SchemaVariantAxis | undefined {
  if (!variants.length) return undefined;

  const localPart = kind === 'anyOf' ? ANY_OF_LOCAL_PART : ONE_OF_LOCAL_PART;
  const options: SchemaVariantOption[] = [];
  const seen = new Map<string, number>();

  for (let i = 0; i < variants.length; i++) {
    const raw = variants[i];
    const variantNode = variantSchemaForLabelDerivation(raw, schemaStore);
    const { label: baseLabel } = deriveVariantLabel(variantNode, parentSchema);
    const dedupCount = (seen.get(baseLabel) ?? 0) + 1;
    seen.set(baseLabel, dedupCount);
    const label = dedupCount === 1 ? baseLabel : `${baseLabel} (${dedupCount})`;

    const schemaId = resolveStoreIdFromRef(raw, schemaStore) ?? '';
    options.push({
      label,
      schemaId,
      isDeprecated: isDeprecated(schemaStore[schemaId]?.data ?? (raw as Record<string, unknown>)),
    });
  }

  return {
    kind,
    stateKey: buildVariantStateKey(parentPath, localPart),
    options,
    localPart,
    parentPath,
  };
}

function rootAxisForSchemaData(
  schemaData: Record<string, unknown>,
  schemaStore: Record<string, SchemaEntry>,
  parentPath: string[],
): SchemaVariantAxis | undefined {
  const discriminator = findEffectiveDiscriminator(schemaData, schemaStore);
  if (discriminator) {
    const axis = buildDiscriminatorAxis(discriminator, schemaStore, parentPath);
    if (axis && axis.options.length > 0) return axis;

    // Mapping-less: options come from the declaring node's variant list, keyed like the switcher.
    const variantsNode = discriminator.variantsNode ?? schemaData;
    for (const kind of ['oneOf', 'anyOf'] as const) {
      const list = variantsNode[kind];
      if (!Array.isArray(list) || list.length === 0) continue;
      const listAxis = buildOneOfAxis(list, variantsNode, schemaStore, parentPath, kind);
      if (listAxis && listAxis.options.length > 0) {
        return {
          ...listAxis,
          kind: 'discriminator',
          localPart: discriminator.propertyName,
          stateKey: buildVariantStateKey(parentPath, discriminator.propertyName),
        };
      }
    }
  }

  if (Array.isArray(schemaData.oneOf) && schemaData.oneOf.length > 0) {
    const axis = buildOneOfAxis(schemaData.oneOf, schemaData, schemaStore, parentPath, 'oneOf');
    if (axis && axis.options.length > 0) return axis;
  }

  if (Array.isArray(schemaData.anyOf) && schemaData.anyOf.length > 0) {
    const axis = buildOneOfAxis(schemaData.anyOf, schemaData, schemaStore, parentPath, 'anyOf');
    if (axis && axis.options.length > 0) return axis;
  }

  return undefined;
}

export function collectNestedVariantAxes(
  schemaData: Record<string, unknown> | undefined,
  schemaStore: Record<string, SchemaEntry>,
  out: Map<string, SchemaVariantAxis> = new Map(),
  visitedRefs: Set<string> = new Set(),
  path: string[] = [],
): Map<string, SchemaVariantAxis> {
  // The sampler returns a schema's own example as is, so no variant below it changes the sample.
  if (
    !schemaData ||
    schemaData.example !== undefined ||
    (Array.isArray(schemaData.examples) && schemaData.examples.length > 0)
  ) {
    return out;
  }

  const walkChild = (value: unknown, childPath: string[] = path): void => {
    if (!value || typeof value !== 'object') return;
    const record = value as Record<string, unknown>;

    if (typeof record.$ref === 'string') {
      const refId = stripRefPrefix(record.$ref);
      if (visitedRefs.has(refId)) return;
      visitedRefs.add(refId);
      const refData = schemaStore[refId]?.data;
      if (!refData) return;
      const axis = rootAxisForSchemaData(refData, schemaStore, childPath);
      if (axis && axis.options.length > 1) {
        out.set(axis.stateKey, axis);
      }
      collectNestedVariantAxes(refData, schemaStore, out, visitedRefs, childPath);
      return;
    }

    const axis = rootAxisForSchemaData(record, schemaStore, childPath);
    if (axis && axis.options.length > 1) {
      out.set(axis.stateKey, axis);
    }
    collectNestedVariantAxes(record, schemaStore, out, visitedRefs, childPath);
  };

  const properties = schemaData.properties;
  if (properties && typeof properties === 'object') {
    for (const [propName, candidate] of Object.entries(properties as Record<string, unknown>)) {
      walkChild(candidate, [...path, propName]);
    }
  }

  const itemPath = path.length > 0 ? [...path.slice(0, -1), `${path[path.length - 1]}[]`] : path;
  walkChild(schemaData.items, itemPath);

  for (const compositionKey of ['oneOf', 'anyOf', 'allOf'] as const) {
    const composition = schemaData[compositionKey];
    if (Array.isArray(composition)) {
      for (const candidate of composition) {
        walkChild(candidate, path);
      }
    }
  }

  return out;
}

export function findSchemaVariantAxis(
  schemaId: string,
  schemaStore: Record<string, SchemaEntry>,
  { includeNested = false }: { includeNested?: boolean } = {},
): SchemaVariantAxis | undefined {
  const entry = schemaStore[schemaId];
  if (!entry) return undefined;

  const rootAxis = rootAxisForSchemaData(entry.data, schemaStore, []);
  if (rootAxis && rootAxis.options.length > 0) return rootAxis;

  if (!includeNested) return undefined;

  const nested = collectNestedVariantAxes(entry.data, schemaStore);
  if (nested.size === 1) {
    return nested.values().next().value;
  }

  return undefined;
}

export function resolveActiveVariantIndex(
  axis: SchemaVariantAxis,
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
): number {
  const stateRecord = axis.kind === 'discriminator' ? activeDiscriminator : activeOneOf;
  if (!stateRecord) return 0;

  const direct = stateRecord[axis.stateKey];
  if (direct !== undefined && direct >= 0 && direct < axis.options.length) {
    return direct;
  }

  // Switcher keys are not absolute paths: shallow rows drop leading ancestors
  // (`type/One of:` for `rating/type/One of:`); $ref'd roots gain them.
  const matches = Object.entries(stateRecord).filter(
    ([key]) =>
      key.endsWith(`/${axis.stateKey}`) ||
      // `&d=0/style` is stored as `drink&d=0/style` when the host sits below a property
      (axis.stateKey.startsWith('&') && key.endsWith(axis.stateKey)) ||
      // A bare `One of:` is a root switcher's key — never a suffix of nested axes.
      (key.includes('/') && axis.stateKey.endsWith(`/${key}`)),
  );
  if (matches.length === 1) {
    const [, idx] = matches[0];
    if (idx >= 0 && idx < axis.options.length) return idx;
  }

  return 0;
}

export type SchemaVariantPick = { axis: SchemaVariantAxis; idx: number };

export type SchemaVariantLeaf = SchemaVariantOption & {
  key: string;
  /** The option to select on each axis, outermost first. */
  picks: SchemaVariantPick[];
};

type VariantState = {
  activeDiscriminator?: Record<string, number>;
  activeOneOf?: Record<string, number>;
};

const LEAF_LABEL_SEPARATOR = ' / ';

function declaresOwnVariants(data: Record<string, unknown>): boolean {
  return Array.isArray(data.oneOf) || Array.isArray(data.anyOf);
}

/**
 * Whether the store rewrite samples `hostData` as the selected variant merged with the
 * host's own keywords: the host declares the axis itself (not through an inherited
 * discriminator), and the variant is not a discriminator host whose own variant would be lost.
 */
export function samplesVariantThroughHost(
  hostData: Record<string, unknown> | undefined,
  variantData: Record<string, unknown> | undefined,
): boolean {
  if (!hostData || !variantData || getDiscriminator(variantData)) return false;
  return declaresVariantAxis(hostData);
}

/** Whether the sampler store rewrites this host: it declares the axis rather than inheriting it. */
export function declaresVariantAxis(hostData: Record<string, unknown> | undefined): boolean {
  return (
    !!hostData && (declaresOwnVariants(hostData) || Boolean(getDiscriminator(hostData)?.mapping))
  );
}

function hasStoredOptions(axis: SchemaVariantAxis): boolean {
  return axis.options.length > 1 && axis.options.every((option) => option.schemaId);
}

function optionLeaf(
  axis: SchemaVariantAxis,
  option: SchemaVariantOption,
  idx: number,
): SchemaVariantLeaf {
  return { ...option, key: option.schemaId || option.label, picks: [{ axis, idx }] };
}

function nestLeaf(parent: SchemaVariantLeaf, child: SchemaVariantLeaf): SchemaVariantLeaf {
  return {
    ...child,
    label: `${parent.label}${LEAF_LABEL_SEPARATOR}${child.label}`,
    key: `${parent.key}${LEAF_LABEL_SEPARATOR}${child.key}`,
    isDeprecated: parent.isDeprecated || child.isDeprecated,
    picks: [...parent.picks, ...child.picks],
  };
}

function nestedAxisOf(
  axis: SchemaVariantAxis,
  option: SchemaVariantOption,
  idx: number,
  schemaStore: Record<string, SchemaEntry>,
  visited: ReadonlySet<string>,
): SchemaVariantAxis | undefined {
  const data = schemaStore[option.schemaId]?.data;
  if (!data || visited.has(option.schemaId) || !declaresOwnVariants(data)) return undefined;

  const marker = axis.kind === 'discriminator' ? `&d=${idx}` : `&oneof=${idx}`;
  const nested = rootAxisForSchemaData(
    data,
    schemaStore,
    appendVariantSuffix(axis.parentPath, marker),
  );
  return nested && hasStoredOptions(nested) ? nested : undefined;
}

function collectVariantLeaves(
  axis: SchemaVariantAxis,
  schemaStore: Record<string, SchemaEntry>,
  visited: ReadonlySet<string> = new Set(),
): SchemaVariantLeaf[] {
  return axis.options.flatMap((option, idx) => {
    const leaf = optionLeaf(axis, option, idx);
    const nested = nestedAxisOf(axis, option, idx, schemaStore, visited);
    if (!nested) return [leaf];

    const childVisited = new Set([...visited, option.schemaId]);
    return collectVariantLeaves(nested, schemaStore, childVisited).map((child) =>
      nestLeaf(leaf, child),
    );
  });
}

export function findSchemaVariantLeaves(
  schemaId: string,
  schemaStore: Record<string, SchemaEntry>,
  options?: { includeNested?: boolean },
): SchemaVariantLeaf[] | undefined {
  const axis = findSchemaVariantAxis(schemaId, schemaStore, options);
  return axis && collectVariantLeaves(axis, schemaStore, new Set([schemaId]));
}

/**
 * A variant picked inside another variant, merged with each host on its path, innermost first,
 * each discriminator value stamped. For `Beverage → Coffee → Espresso`: `Espresso` + `Coffee`
 * keywords + `style: espresso` + `Beverage` keywords + `kind: coffee`.
 */
function mergeNestedVariantWithHosts(
  hostId: string,
  nested: SchemaVariantLeaf,
  schemaStore: Record<string, SchemaEntry>,
): Record<string, unknown> | undefined {
  let schema = schemaStore[nested.schemaId]?.data;
  for (let level = nested.picks.length - 1; schema && level >= 0; level--) {
    const { axis, idx } = nested.picks[level];
    const outer = nested.picks[level - 1];
    const levelHostId = outer ? outer.axis.options[outer.idx].schemaId : hostId;
    const levelHost = schemaStore[levelHostId]?.data;
    if (!levelHost) return undefined;
    const merged = mergeHostSiblings(schema, levelHostId, levelHost);
    schema =
      axis.kind === 'discriminator'
        ? injectDiscriminatorEnum(merged, axis.localPart, axis.options[idx].mappingKey)
        : merged;
  }
  return schema;
}

/** The state fields selecting `picks` changes: each axis writes to the record its kind owns. */
export function withVariantPicks(
  state: VariantState,
  picks: readonly SchemaVariantPick[],
): VariantState {
  const next: VariantState = {};
  for (const { axis, idx } of picks) {
    const field = axis.kind === 'discriminator' ? 'activeDiscriminator' : 'activeOneOf';
    next[field] = { ...(next[field] ?? state[field]), [axis.stateKey]: idx };
  }
  return next;
}

function withoutVariantScopedKeys(
  record: Record<string, number> | undefined,
): Record<string, number> | undefined {
  return record && Object.fromEntries(Object.entries(record).filter(([key]) => key[0] !== '&'));
}

function isPickActive({ axis, idx }: SchemaVariantPick, state: VariantState): boolean {
  return resolveActiveVariantIndex(axis, state.activeDiscriminator, state.activeOneOf) === idx;
}

export function resolveActiveVariantLeafIndex(
  leaves: SchemaVariantLeaf[],
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
): number {
  const state: VariantState = { activeDiscriminator, activeOneOf };
  const rootState: VariantState = {
    activeDiscriminator: withoutVariantScopedKeys(activeDiscriminator),
    activeOneOf: withoutVariantScopedKeys(activeOneOf),
  };
  const idx = leaves.findIndex((leaf) =>
    leaf.picks.every((pick) => isPickActive(pick, pick.axis.parentPath.length ? state : rootState)),
  );
  return Math.max(idx, 0);
}

function resolveActiveVariantOption(
  schemaId: string,
  schemaStore: Record<string, SchemaEntry>,
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
): SchemaVariantOption | undefined {
  const axis = findSchemaVariantAxis(schemaId, schemaStore);
  if (!axis) return undefined;

  const activeIdx = resolveActiveVariantIndex(axis, activeDiscriminator, activeOneOf);
  const active = axis.options[activeIdx] ?? axis.options[0];
  if (!active?.schemaId || !schemaStore[active.schemaId]) return undefined;
  return active;
}


// Array items are keyed with a `[]` suffix on the parent segment, same as ArrayRenderer.
function itemsPath(path: string[]): string[] {
  if (path.length === 0) return path;
  return [...path.slice(0, -1), `${path[path.length - 1]}[]`];
}

function collapseDiscriminatorHost(
  node: Record<string, unknown>,
  schemaStore: Record<string, SchemaEntry>,
  path: string[],
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
): Record<string, unknown> | undefined {
  const discriminator = getDiscriminator(node);
  if (!discriminator?.propertyName) return undefined;

  const axis = rootAxisForSchemaData(node, schemaStore, path);
  if (!axis) return undefined;
  const activeIdx = resolveActiveVariantIndex(axis, activeDiscriminator, activeOneOf);
  const active = axis.options[activeIdx] ?? axis.options[0];
  if (!active?.schemaId || !schemaStore[active.schemaId]) return undefined;

  const { oneOf: _o, anyOf: _a, discriminator: _d, ...siblings } = node;
  const variant = { allOf: [{ $ref: `${REF_PREFIX}${active.schemaId}` }] };
  return {
    ...siblings,
    ...injectDiscriminatorEnum(variant, discriminator.propertyName, active.mappingKey),
  };
}

/**
 * Deep-collapse inline nested variant axes to the active option so generated
 * samples follow the switcher: oneOf/anyOf collapse to the active branch
 * (default 0) — so null branches sample as `null`: the sampler turns any
 * surviving `oneOf: [{type: 'null'}]` wrapper into `{}` — and inline
 * discriminator hosts collapse to the active variant with its mapping key
 * stamped. Returns a structural clone.
 */
export function applyActiveVariantsToSchema(
  data: Record<string, unknown>,
  schemaStore: Record<string, SchemaEntry>,
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
  parentPath: string[] = [],
): Record<string, unknown> {
  const collapse = (value: unknown, path: string[], isEntryRoot = false): unknown => {
    if (!value || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map((item) => collapse(item, path));

    const node = value as Record<string, unknown>;
    // Ref targets collapse as their own store entries.
    if (typeof node.$ref === 'string') return node;

    if (!isEntryRoot) {
      const host = collapseDiscriminatorHost(
        node,
        schemaStore,
        path,
        activeDiscriminator,
        activeOneOf,
      );
      if (host) return collapse(host, path);
    }

    if (!getDiscriminator(node)) {
      for (const kind of ['oneOf', 'anyOf'] as const) {
        const list = node[kind];
        if (!Array.isArray(list) || list.length === 0) continue;

        const axis = buildOneOfAxis(list, node, schemaStore, path, kind);
        const activeIdx = axis ? resolveActiveVariantIndex(axis, undefined, activeOneOf) : 0;
        const variant = list[activeIdx] ?? list[0];
        if (!isNonEmptyObject(variant)) continue;

        // Spread, not allOf-wrap: allOf-merging a null variant brings the `{}` bug back.
        const { oneOf: _o, anyOf: _a, ...siblings } = node;
        return collapse({ ...siblings, ...variant }, path);
      }
    }

    // Same path rules as collectNestedVariantAxes, so axis keys match switcher state.
    const next: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(node)) {
      if (key === 'properties' && isNonEmptyObject(child)) {
        const props: Record<string, unknown> = {};
        for (const [propName, propSchema] of Object.entries(child)) {
          props[propName] = collapse(propSchema, [...path, propName]);
        }
        next[key] = props;
      } else if (key === 'items') {
        next[key] = collapse(child, itemsPath(path));
      } else if (key === 'allOf' || key === 'oneOf' || key === 'anyOf') {
        next[key] = collapse(child, path);
      } else {
        next[key] = child;
      }
    }
    return next;
  };

  return collapse(data, parentPath, true) as Record<string, unknown>;
}

/**
 * openapi-sampler cuts circular $refs with `getResultForCircular(inferType(referenced))`,
 * which samples `{}` only when the referenced schema's top level infers as an object.
 * Variant rewrites replace an object host (`type: 'object'`) with an allOf-rooted
 * variant that carries no top-level `type`, so a back-reference into the host would
 * sample as `null` where sampling the raw spec gives `{}`. Keep the host's
 * declared type on the rewritten entry: discriminator variants allOf-inherit the
 * host, and a `type` sibling of oneOf/anyOf constrains every variant, so the
 * effective type is unchanged either way.
 */
function preserveHostType(
  rewritten: Record<string, unknown>,
  hostData: Record<string, unknown>,
): Record<string, unknown> {
  if (rewritten.type !== undefined || hostData.type === undefined) return rewritten;
  return { ...rewritten, type: hostData.type };
}

export function applyActiveVariantsToStore(
  schemaStore: Record<string, SchemaEntry>,
  activeDiscriminator?: Record<string, number>,
  activeOneOf?: Record<string, number>,
): Record<string, Record<string, unknown>> {
  const resolved: Record<string, Record<string, unknown>> = {};

  for (const [id, entry] of Object.entries(schemaStore)) {
    if (!entry.data) {
      continue;
    }
    const leaves = declaresVariantAxis(entry.data)
      ? findSchemaVariantLeaves(id, schemaStore)
      : undefined;
    const leaf = leaves?.[resolveActiveVariantLeafIndex(leaves, activeDiscriminator, activeOneOf)];
    const nestedLeaf =
      leaf && leaf.picks.length > 1 && mergeNestedVariantWithHosts(id, leaf, schemaStore);
    if (nestedLeaf) {
      resolved[id] = preserveHostType(nestedLeaf, entry.data);
      continue;
    }
    const discriminator = getDiscriminator(entry.data);
    if (
      discriminator?.propertyName &&
      (discriminator.mapping || Array.isArray(entry.data.oneOf) || Array.isArray(entry.data.anyOf))
    ) {
      const active = resolveActiveVariantOption(id, schemaStore, activeDiscriminator, activeOneOf);
      const variantData =
        active && active.schemaId !== id ? schemaStore[active.schemaId]?.data : undefined;
      if (variantData) {
        const merged = mergeHostSiblings(variantData, id, entry.data);
        resolved[id] = preserveHostType(
          injectDiscriminatorEnum(merged, discriminator.propertyName, active?.mappingKey),
          entry.data,
        );
      } else {
        resolved[id] = entry.data;
      }
      continue;
    }

    let rewritten = false;
    for (const compositionKey of ['oneOf', 'anyOf'] as const) {
      const list = entry.data[compositionKey];
      if (!Array.isArray(list)) continue;
      const axis = buildOneOfAxis(list, entry.data, schemaStore, [], compositionKey);
      // Skip single-variant oneOf/anyOf: rewriting `{oneOf: [V]}` to `V` adds no
      // information for the sampler and would just churn the spec stub.
      // Single-mapping discriminators are different (they inherit from the host
      // via allOf), so the discriminator branch above does rewrite them.
      if (!axis || axis.options.length <= 1) continue;

      const activeIdx = resolveActiveVariantIndex(axis, undefined, activeOneOf);
      const activeOption = axis.options[activeIdx] ?? axis.options[0];
      if (!activeOption?.schemaId || !schemaStore[activeOption.schemaId]) continue;

      const variantData = schemaStore[activeOption.schemaId].data;
      resolved[id] = preserveHostType(mergeHostSiblings(variantData, id, entry.data), entry.data);
      rewritten = true;
      break;
    }
    if (rewritten) continue;

    resolved[id] = entry.data;
  }

  // The loop above only rewrites entry roots; nested inline oneOf/anyOf and
  // discriminator hosts must collapse too, or samples are stuck on branch 0.
  for (const [id, data] of Object.entries(resolved)) {
    resolved[id] = applyActiveVariantsToSchema(data, schemaStore, activeDiscriminator, activeOneOf);
  }

  return resolved;
}

const REF_PREFIX = '#/';

/**
 * Bake the selected option's mapping key as an enum on the discriminator
 * property so the sampler emits it directly. This propagates through nested
 * discriminator references too (sampler resolves them via the rewritten spec
 * stub), so callers don't need a recursive post-walk to stamp nested values.
 *
 * Options without a mapping key — the 'Default mapping' selection, oneOf
 * variants without mapping — have no canonical outgoing value and stay unstamped.
 */
function injectDiscriminatorEnum(
  schema: Record<string, unknown>,
  propertyName: string,
  mappingKey: string | undefined,
): Record<string, unknown> {
  if (!mappingKey) return schema;
  const enumChunk = {
    properties: { [propertyName]: { enum: [mappingKey] } },
  };
  if (Array.isArray(schema.allOf)) {
    return { ...schema, allOf: [...schema.allOf, enumChunk] };
  }
  return withRootXml({ allOf: [schema, enumChunk] }, schema);
}

function hostRefCandidates(hostId: string): string[] {
  const refs = new Set<string>([`${REF_PREFIX}${hostId}`]);
  if (!hostId.startsWith('components/schemas/')) {
    refs.add(`${REF_PREFIX}components/schemas/${hostId}`);
  } else {
    refs.add(`${REF_PREFIX}${hostId.replace('components/schemas/', '')}`);
  }
  return Array.from(refs);
}

/** Host keywords shared by every variant; a host sample value describes one variant only. */
function hostKeywordsForVariants(hostData: Record<string, unknown>): Record<string, unknown> {
  const {
    discriminator: _d,
    oneOf: _o,
    anyOf: _a,
    example: _e,
    examples: _es,
    default: _df,
    ...rest
  } = hostData;
  return rest;
}

const ANNOTATION_ONLY_HOST_KEYS = new Set(['type', 'title', 'description']);

/** The sampler names the XML root element from the top-level `xml`, which an allOf wrapper hides. */
function withRootXml(
  wrapper: Record<string, unknown>,
  wrapped: Record<string, unknown>,
): Record<string, unknown> {
  return wrapped.xml === undefined ? wrapper : { ...wrapper, xml: wrapped.xml };
}

/** The variant with the host keywords applied; host refs inside it are inlined, not followed. */
function mergeHostSiblings(
  variantData: Record<string, unknown>,
  hostId: string,
  hostData: Record<string, unknown>,
): Record<string, unknown> {
  const refs = hostRefCandidates(hostId);
  const host = hostKeywordsForVariants(hostData);
  const variant = containsRef(variantData, refs)
    ? (replaceRefsDeep(variantData, refs, host) as Record<string, unknown>)
    : variantData;
  const hasSiblings = Object.keys(host).some((key) => !ANNOTATION_ONLY_HOST_KEYS.has(key));
  return inheritsHost(variantData, hostId) || !hasSiblings
    ? variant
    : withRootXml({ allOf: [host, variant] }, variant);
}

function inheritsHost(variantData: Record<string, unknown>, hostId: string): boolean {
  const refs = hostRefCandidates(hostId);
  return (
    Array.isArray(variantData.allOf) &&
    variantData.allOf.some((part) => isNonEmptyObject(part) && refs.includes(part.$ref as string))
  );
}

function containsRef(node: unknown, refs: string[]): boolean {
  if (!node || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some((item) => containsRef(item, refs));

  const record = node as Record<string, unknown>;
  if (typeof record.$ref === 'string' && refs.includes(record.$ref)) return true;

  for (const value of Object.values(record)) {
    if (containsRef(value, refs)) return true;
  }
  return false;
}

function replaceRefsDeep(
  node: unknown,
  refs: string[],
  replacement: Record<string, unknown>,
): unknown {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map((item) => replaceRefsDeep(item, refs, replacement));

  const record = node as Record<string, unknown>;
  if (typeof record.$ref === 'string' && refs.includes(record.$ref)) {
    return { ...replacement };
  }

  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    next[key] = replaceRefsDeep(value, refs, replacement);
  }
  return next;
}
