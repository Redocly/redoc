import type {
  SchemaNode,
  DiscriminatorObject,
  PropertyType,
  SwitcherOptionType,
  SwitcherType,
  SwitcherLabel,
} from '../../types/schema.js';
import type { PropertyShellOptions } from './propertyBuilder.js';

import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { isSchemaNode, switcherLabel } from '../../types/schema.js';
import {
  buildPropertyShell,
  detectJsonSchemaType,
  getAccessMode,
  getDiscriminatorObject,
  getDocumentedPrimitiveArrayItems,
  getEnum,
  humanizeConstraints,
  isPrimitiveLikeSchema,
  isStructuredArrayItems,
  primitiveArrayItemsHaveOwnInfo,
  promotePrimitiveArrayMetadata,
  schemaHasType,
  schemaType,
  toPropertyExample,
} from './propertyBuilder.js';
import { deriveVariantLabel } from './variant-label.js';

export type SchemaTreeContext = {
  prepareVariant(ref: SchemaNode): SchemaNode;
  prepareRefOnItsOwn(ref: string): SchemaNode | undefined;
  /** The definition a ref points to as the document declares it, unresolved. */
  definitionOf(ref: string): SchemaNode | undefined;
  propertyRefCache: Map<string, PropertyType>;
  variantResolutionCache: Map<string, SchemaNode>;
  propertyTargetCache: Map<string, SchemaNode | undefined>;
  isChild?: boolean;
  implicitDiscriminatorChildren?: Record<string, ImplicitDiscriminatorChild[]>;
  exampleSerializer?: (value: unknown) => string;
  sortRequiredPropsFirst?: boolean;
  /** Refs open on the current DFS path; reaching one again is a cycle. */
  activeRefs: Set<string>;
  /** The ref the page root was resolved from; an ancestor of every node, kept out of `activeRefs`. */
  rootRef?: string;
  depth: number;
  /** Refs on a reference cycle; memoized by ref alone so a cyclic component expands once. */
  recursiveRefs: ReadonlySet<string>;
};

const MAX_REF_DEPTH = 10;
const MAX_TREE_DEPTH = 200;

type ImplicitDiscriminatorChild = { ref: string; value: string };

/**
 * Cache key of a ref on a reference cycle. A subtree depends on the refs open above it (they
 * become circular stubs), so it is shared only between occurrences with the same open refs.
 */
function recursiveRefCacheKey(
  refKey: string,
  schema: SchemaNode,
  activeRefs: ReadonlySet<string>,
): string {
  const base = getDiscriminatorObject(schema) ? `${refKey}:d` : refKey;
  return `${base}#rec|${[...activeRefs].sort().join('|')}`;
}

const NAMED_DEFINITION_REGEX = /^#\/components\/(schemas|pathItems)\/([^/]+)$/;

function getNamedDefinitionTitle(jsonPointer: string): string | undefined {
  const match = jsonPointer.match(NAMED_DEFINITION_REGEX);
  if (!match) return undefined;
  return match[2].replace(/~1/g, '/').replace(/~0/g, '~');
}

function buildPropertyForNode(
  node: SchemaNode,
  ctx: SchemaTreeContext,
  options: PropertyShellOptions = {},
  jsonPointer: string,
): PropertyType {
  const schema = expandCycleStubsOffTheirPath(node, ctx);
  const property = buildPropertyShell(schema, {
    ...options,
    exampleSerializer: ctx.exampleSerializer,
  });
  if (!property.title) {
    const namedTitle = getNamedDefinitionTitle(jsonPointer);
    if (namedTitle) property.title = namedTitle;
  }
  if (property.isCircular || property.isComplex) return property;

  const refKey = schema['x-original-ref'];
  if (refKey && ctx.activeRefs.has(refKey)) {
    property.isCircular = true;
    return property;
  }
  if (ctx.activeRefs.size > MAX_REF_DEPTH || ctx.depth > MAX_TREE_DEPTH) {
    property.isComplex = true;
    return property;
  }

  const cacheKey =
    refKey !== undefined && ctx.recursiveRefs.has(refKey)
      ? recursiveRefCacheKey(refKey, schema, ctx.activeRefs)
      : undefined;
  const cached = cacheKey ? ctx.propertyRefCache.get(cacheKey) : undefined;
  if (cached) return reuseNestedStructure(cached, property);

  const activeRefs = new Set(ctx.activeRefs);
  if (refKey) activeRefs.add(refKey);
  const nestedCtx = { ...ctx, activeRefs, depth: ctx.depth + 1 };
  const lazy = deferNestedStructure(property, () => {
    attachNestedStructure(property, schema, nestedCtx, jsonPointer);
    property.isExpandable = isExpandableSchema(property);
  });
  if (cacheKey) ctx.propertyRefCache.set(cacheKey, lazy);
  return lazy;
}

/** Keys `attachNestedStructure` and `isExpandableSchema` write; reading one builds the level. */
const DEFERRED_KEYS: ReadonlySet<PropertyKey> = new Set([
  'properties',
  'items',
  'switcher',
  'example',
  'accessMode',
  'enum',
  'isExpandable',
]);

// A densely linked spec reaches most of its schemas from every root, so building the tree
// eagerly costs the whole spec per schema view. Each level is built on first read instead,
// with the `activeRefs` snapshot it would have had, so the result matches an eager build.
// Enumerating keys (spread, equality, serialization) builds the level first.
function deferNestedStructure(property: PropertyType, build: () => void): PropertyType {
  let pending = true;
  const ensureBuilt = (key?: PropertyKey): void => {
    if (!pending || (key !== undefined && !DEFERRED_KEYS.has(key))) return;
    pending = false;
    build();
  };
  const proxy = new Proxy(property, {
    get(target, key, receiver) {
      ensureBuilt(key);
      return Reflect.get(target, key, receiver);
    },
    has(target, key) {
      ensureBuilt(key);
      return Reflect.has(target, key);
    },
    set(target, key, value, receiver) {
      ensureBuilt(key);
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
      ensureBuilt(key);
      return Reflect.deleteProperty(target, key);
    },
    getOwnPropertyDescriptor(target, key) {
      ensureBuilt(key);
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
    ownKeys(target) {
      ensureBuilt();
      return Reflect.ownKeys(target);
    },
  });
  deferredTargets.set(proxy, { target: property, ensureBuilt: () => ensureBuilt() });
  return proxy;
}

const deferredTargets = new WeakMap<
  PropertyType,
  { target: PropertyType; ensureBuilt: () => void }
>();

/**
 * Another occurrence of a cached ref: the cached fields with this occurrence's shell on top,
 * without building the cached level until this one is read. Flags that belong to the
 * position (`isRequired`, …) come from this occurrence only.
 */
function reuseNestedStructure(cached: PropertyType, shell: PropertyType): PropertyType {
  const source = deferredTargets.get(cached);
  if (!source) return { ...cached, ...shell };
  const {
    isRequired: _isRequired,
    isAdditionalProperty: _isAdditionalProperty,
    isPatternProperty: _isPatternProperty,
    ...shared
  } = source.target;
  const occurrence: PropertyType = { ...shared, ...shell };
  return deferNestedStructure(occurrence, () => {
    source.ensureBuilt();
    for (const key of DEFERRED_KEYS) {
      if (Object.hasOwn(shell, key)) continue;
      if (Object.hasOwn(source.target, key))
        Reflect.set(occurrence, key, Reflect.get(source.target, key));
      else Reflect.deleteProperty(occurrence, key);
    }
  });
}

function isExpandableSchema(property: PropertyType): boolean {
  if (property.isCircular) return false;

  const isContainer = (node: PropertyType | SwitcherOptionType): boolean =>
    !(node as PropertyType).isCircular &&
    (!!node.switcher ||
      !!node.items?.length ||
      !!(node.properties && Object.keys(node.properties).length));

  const hasNestedContainer = (node: PropertyType | SwitcherOptionType): boolean => {
    if ((node as PropertyType).isCircular) return false;
    if (node.properties && Object.values(node.properties).some(isContainer)) return true;
    if (node.items?.some(hasNestedContainer)) return true;
    if (node.switcher && Object.values(node.switcher.options).some(hasNestedContainer)) return true;
    return false;
  };

  if (property.properties && Object.values(property.properties).some(isContainer)) return true;
  if (property.switcher && Object.values(property.switcher.options).some(hasNestedContainer))
    return true;
  if (property.items?.some(hasNestedContainer)) return true;
  return false;
}

/**
 * The value all variants agree on, or undefined — a unanimous value is the
 * signature of a sibling keyword `mergeCombinarySibling` distributed into
 * every branch.
 */
function sharedVariantValue<T>(
  variants: unknown,
  getValue: (variant: SchemaNode) => T | undefined,
): T | undefined {
  if (!Array.isArray(variants) || variants.length === 0) return undefined;
  let shared: T | undefined;
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    if (!isSchemaNode(variant)) return undefined;
    const value = getValue(variant);
    if (value === undefined) return undefined;
    if (i === 0) shared = value;
    else if (value !== shared) return undefined;
  }
  return shared;
}

/**
 * Restores a distributed sibling `example` onto the property. Per-branch
 * examples (differing or partial) are left alone, so a single variant's
 * example is never collapsed onto the whole field.
 */
function hoistVariantExample(
  property: PropertyType,
  variants: unknown,
  exampleSerializer?: (value: unknown) => string,
): void {
  if (property.example !== undefined) return;
  const shared = sharedVariantValue(variants, (variant) =>
    variant.example === undefined ? undefined : JSON.stringify(variant.example),
  );
  if (shared === undefined) return;
  // All variants agree, so the first variant's raw value is the shared one.
  const firstVariant = Array.isArray(variants) ? variants[0] : undefined;
  if (!isSchemaNode(firstVariant)) return;
  property.example = toPropertyExample(firstVariant.example, exampleSerializer);
}

/**
 * Restores a distributed sibling `readOnly`/`writeOnly` flag — without it,
 * `skipReadOnly`/`skipWriteOnly` filtering breaks (e.g. a writeOnly oneOf
 * property would render in response schemas).
 */
function hoistVariantAccessMode(property: PropertyType, variants: unknown): void {
  if (property.accessMode !== undefined) return;
  const shared = sharedVariantValue(variants, getAccessMode);
  if (shared) property.accessMode = shared;
}

function attachNestedStructure(
  property: PropertyType,
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  jsonPointer: string,
): void {
  const type = schemaType(schema);
  const primitive = isPrimitiveLikeSchema(schema, type);

  const discriminatorSwitcher = buildAppliedDiscriminatorSwitcher(schema, ctx, jsonPointer);
  if (discriminatorSwitcher) {
    property.switcher = discriminatorSwitcher;
    hoistVariantExample(property, schema.oneOf ?? schema.anyOf, ctx.exampleSerializer);
    hoistVariantAccessMode(property, schema.oneOf ?? schema.anyOf);
    if (inheritsDiscriminator(schema, discriminatorSwitcher.propertyName, ctx)) {
      discriminatorSwitcher.sharesOnlyDiscriminator = true;
    }
    if (schema.properties) property.properties = buildObjectProperties(schema, ctx, jsonPointer);
    return;
  }

  if (schema.oneOf !== undefined) {
    property.switcher = buildOneOfSwitcher(
      schema.oneOf,
      switcherLabel.ONE_OF,
      ctx,
      jsonPointer,
      'oneOf',
      schema,
    );
    hoistVariantExample(property, schema.oneOf, ctx.exampleSerializer);
    hoistVariantAccessMode(property, schema.oneOf);
    if (schema.properties) {
      const siblingProps = buildObjectProperties(schema, ctx, jsonPointer);
      property.properties = siblingProps;
      for (const option of Object.values(property.switcher.options)) {
        option.properties = { ...siblingProps, ...(option.properties || {}) };
      }
    }
    return;
  }

  if (schema.anyOf !== undefined) {
    property.switcher = buildOneOfSwitcher(
      schema.anyOf,
      switcherLabel.ANY_OF,
      ctx,
      jsonPointer,
      'anyOf',
      schema,
    );
    hoistVariantExample(property, schema.anyOf, ctx.exampleSerializer);
    hoistVariantAccessMode(property, schema.anyOf);
    if (schema.properties) {
      const siblingProps = buildObjectProperties(schema, ctx, jsonPointer);
      property.properties = siblingProps;
      for (const option of Object.values(property.switcher.options)) {
        option.properties = { ...siblingProps, ...(option.properties || {}) };
      }
    }
    return;
  }

  if ((schema.if && schema.then) || (schema.if && schema.else)) {
    property.switcher = buildConditionalSwitcher(schema, ctx, jsonPointer);
    return;
  }

  if (!primitive && schemaHasType(type, 'object')) {
    property.properties = buildObjectProperties(schema, ctx, jsonPointer);
  }

  if (!primitive && schemaHasType(type, 'array')) {
    property.items = buildArrayItems(schema, ctx, jsonPointer);

    if (getDistributedTupleExample(schema) !== undefined) {
      // the tuple example is shown on the item rows instead of the array row
      delete property.example;
    }

    if (
      property.example === undefined &&
      isSchemaNode(schema.items) &&
      schema.items.example !== undefined &&
      // documented primitive items show their example on the nested items row
      !getDocumentedPrimitiveArrayItems(schema, type)
    ) {
      property.example = toPropertyExample([schema.items.example], ctx.exampleSerializer);
    }
  }

  promotePrimitiveArrayMetadata(property, schema, type, ctx.exampleSerializer);
}

function sortPropertiesByRequired(
  properties: Record<string, PropertyType>,
  requiredOrder: string[],
): Record<string, PropertyType> {
  const requiredInOrder: Array<[string, PropertyType]> = [];
  const requiredRest: Array<[string, PropertyType]> = [];
  const optional: Array<[string, PropertyType]> = [];

  for (const [name, property] of Object.entries(properties)) {
    if (!property.isRequired) optional.push([name, property]);
    else if (requiredOrder.includes(name)) requiredInOrder.push([name, property]);
    else requiredRest.push([name, property]);
  }

  requiredInOrder.sort(([a], [b]) => requiredOrder.indexOf(a) - requiredOrder.indexOf(b));

  return Object.fromEntries([...requiredInOrder, ...requiredRest, ...optional]);
}

function buildObjectProperties(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  parentPointer: string,
): Record<string, PropertyType> {
  const result: Record<string, PropertyType> = {};
  const propertyCtx: SchemaTreeContext = { ...ctx, isChild: false };
  const requiredList = schema.required || [];
  const defaults = isSchemaNode(schema.default) ? schema.default : {};
  const parentExample = isSchemaNode(schema.example) ? schema.example : undefined;

  const props = schema.properties || {};
  for (const [name, raw] of Object.entries(props)) {
    const merged: SchemaNode = (raw as unknown) === false ? raw : { ...raw };
    if ((merged as unknown) !== false) {
      if (merged.default === undefined && defaults[name] !== undefined)
        merged.default = defaults[name];
      if (merged.example === undefined && parentExample?.[name] !== undefined) {
        merged.example = parentExample[name];
      }
    }
    const childPointer = `${parentPointer}/properties/${encodeJsonPointerSegment(name)}`;
    result[name] = buildPropertyForNode(
      merged,
      propertyCtx,
      {
        isRequired: requiredList.includes(name),
      },
      childPointer,
    );
  }

  for (const [name, raw] of Object.entries(schema.patternProperties || {})) {
    const childPointer = `${parentPointer}/patternProperties/${encodeJsonPointerSegment(name)}`;
    result[name] = buildPropertyForNode(
      raw,
      propertyCtx,
      {
        isPatternProperty: true,
      },
      childPointer,
    );
  }

  const additional = schema.additionalProperties ?? schema.unevaluatedProperties;
  if (isSchemaNode(additional)) {
    const label = `<${additional['x-additionalPropertiesName'] || 'property name'}>`;
    const childPointer = `${parentPointer}/additionalProperties`;
    result[label] = buildPropertyForNode(
      additional,
      propertyCtx,
      {
        isAdditionalProperty: true,
      },
      childPointer,
    );
  } else if (additional === true) {
    result['<property name>'] = buildPropertyForNode(
      {},
      propertyCtx,
      {
        isAdditionalProperty: true,
      },
      `${parentPointer}/additionalProperties`,
    );
  }

  if (ctx.sortRequiredPropsFirst) {
    return sortPropertiesByDeprecated(sortPropertiesByRequired(result, requiredList));
  }

  return sortPropertiesByDeprecated(result);
}

function sortPropertiesByDeprecated(
  properties: Record<string, PropertyType>,
): Record<string, PropertyType> {
  const sorted: Record<string, PropertyType> = {};
  for (const [name, prop] of Object.entries(properties).sort(
    ([, a], [, b]) => Number(Boolean(a.isDeprecated)) - Number(Boolean(b.isDeprecated)),
  )) {
    sorted[name] = prop;
  }
  return sorted;
}

/**
 * A tuple example is displayed on the item rows when every entry fits within
 * the tuple; a longer example stays on the array row so no entries are lost.
 */
function getDistributedTupleExample(schema: SchemaNode): unknown[] | undefined {
  const members = Array.isArray(schema.prefixItems)
    ? schema.prefixItems
    : Array.isArray(schema.items)
      ? schema.items
      : undefined;
  if (!members?.length || !Array.isArray(schema.example) || !schema.example.length) {
    return undefined;
  }
  if (schema.example.length > members.length) return undefined;
  // an item's own example is more specific; when distribution would override one,
  // the example stays on the array row instead so no entries are lost
  const collides = schema.example.some(
    (value, i) =>
      value !== undefined && isSchemaNode(members[i]) && members[i].example !== undefined,
  );
  return collides ? undefined : schema.example;
}

function buildArrayItems(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  parentPointer: string,
): PropertyType[] {
  const itemCtx: SchemaTreeContext = { ...ctx };
  const distributedExample = getDistributedTupleExample(schema);
  const withDistributedExample = (item: SchemaNode, i: number): SchemaNode =>
    distributedExample?.[i] !== undefined ? { ...item, example: distributedExample[i] } : item;

  if (Array.isArray(schema.prefixItems)) {
    const items = schema.prefixItems.map((item, i) =>
      asTupleItem(
        buildPropertyForNode(
          withDistributedExample(item, i),
          itemCtx,
          {},
          `${parentPointer}/prefixItems/${i}`,
        ),
      ),
    );
    items.push(...buildAdditionalItems(schema.items, itemCtx, `${parentPointer}/items`));
    return items;
  }
  if (Array.isArray(schema.items)) {
    const items = schema.items.map((item, i) =>
      asTupleItem(
        buildPropertyForNode(
          withDistributedExample(item, i),
          itemCtx,
          {},
          `${parentPointer}/items/${i}`,
        ),
      ),
    );
    items.push(
      ...buildAdditionalItems(schema.additionalItems, itemCtx, `${parentPointer}/additionalItems`),
    );
    return items;
  }
  if (isSchemaNode(schema.items)) {
    if (
      isStructuredArrayItems(schema.items) ||
      !isPrimitiveLikeSchema(schema.items, schemaType(schema.items)) ||
      primitiveArrayItemsHaveOwnInfo(schema.items)
    ) {
      return [buildPropertyForNode(schema.items, itemCtx, {}, `${parentPointer}/items`)];
    }
  }
  return [];
}

function buildAdditionalItems(
  schema: SchemaNode | SchemaNode[] | boolean | undefined,
  ctx: SchemaTreeContext,
  pointer: string,
): PropertyType[] {
  if (schema !== true && !isSchemaNode(schema)) return [];
  const itemSchema = schema === true ? {} : schema;
  return [asAdditionalItems(buildPropertyForNode(itemSchema, ctx, {}, pointer))];
}

function asAdditionalItems(property: PropertyType): PropertyType {
  return { ...property, isAdditionalItems: true };
}

function asTupleItem(property: PropertyType): PropertyType {
  return { ...property, isTupleItem: true };
}

/**
 * Resolves a `$ref` against the page document. Returns undefined when the target is not
 * there — the ref names a missing schema, or it is hidden from this viewer — because a
 * target nobody can read must not become a switcher option.
 */
function resolveRefTarget(ref: string, ctx: SchemaTreeContext): SchemaNode | undefined {
  const resolved = ctx.prepareVariant({ $ref: ref });
  if (!isSchemaNode(resolved)) return undefined;
  // an unresolved pointer comes back as the bare `{ $ref }` node it went in as
  return typeof resolved.$ref === 'string' ? undefined : resolved;
}

function hostsDiscriminator(
  ref: string,
  propertyName: string | undefined,
  ctx: SchemaTreeContext,
): boolean {
  if (!propertyName) return false;
  const resolved = resolveRefTarget(ref, ctx);
  return resolved !== undefined && getDiscriminatorObject(resolved)?.propertyName === propertyName;
}

/** A child schema rendered through a discriminator declared by one of its allOf parents. */
function inheritsDiscriminator(
  schema: SchemaNode,
  propertyName: string | undefined,
  ctx: SchemaTreeContext,
): boolean {
  return (schema['x-parentRefs'] ?? []).some((ref) => hostsDiscriminator(ref, propertyName, ctx));
}

function inheritsAnyDiscriminator(schema: SchemaNode, ctx: SchemaTreeContext): boolean {
  return (schema['x-parentRefs'] ?? []).some((ref) => {
    const parent = resolveRefTarget(ref, ctx);
    return !!parent && !!getDiscriminatorObject(parent)?.propertyName;
  });
}

function stripVariantHostMarkers(variant: SchemaNode, ref: string): SchemaNode {
  delete variant['x-original-ref'];

  // a variant inherits the parent's oneOf/anyOf through allOf; when that list
  // names the variant itself, the selector would nest into itself — drop it
  for (const key of ['oneOf', 'anyOf'] as const) {
    const list = variant[key];
    if (Array.isArray(list) && list.some((v) => isSchemaNode(v) && v['x-original-ref'] === ref)) {
      delete variant[key];
    }
  }
  if (!declaresVariants(variant)) {
    delete variant.discriminator;
    delete variant['x-discriminator'];
  }
  return variant;
}

function declaresVariants(schema: SchemaNode): boolean {
  return Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf);
}

function resolveMappedVariant(ref: string, ctx: SchemaTreeContext): SchemaNode | undefined {
  const cached = ctx.variantResolutionCache.get(ref);
  if (cached) return cached;

  // a cached result of the variant can hold the stubs of the refs that were open where it was built
  const merged = ctx.prepareRefOnItsOwn(ref);
  if (!merged) return undefined;

  const variant = stripVariantHostMarkers(merged, ref);
  ctx.variantResolutionCache.set(ref, variant);
  return variant;
}

/** A listed entry that lost fields to a cycle stub on this page. */
function lostFieldsToCycle(listed: SchemaNode): boolean {
  return listed['x-circular-ref'] !== undefined || listed['x-allof-cycle'] !== undefined;
}

/** The option body: the copy merged for the page, unless a cycle stub cost it fields. */
function variantOptionBody(
  ref: string,
  listed: SchemaNode | undefined,
  ctx: SchemaTreeContext,
): SchemaNode | undefined {
  if (listed === undefined || lostFieldsToCycle(listed)) return resolveMappedVariant(ref, ctx);
  return stripVariantHostMarkers({ ...listed }, ref);
}

function withoutStubOffItsPath(
  schema: SchemaNode,
  pathRefs: ReadonlySet<string>,
  ctx: SchemaTreeContext,
): SchemaNode {
  const ancestor = schema['x-circular-ref'];
  if (typeof ancestor !== 'string' || pathRefs.has(ancestor)) return schema;
  // a stub of the page root renders as the cycle, unless it has no fields: the stub of a
  // schema built only from allOf
  if (ancestor === ctx.rootRef && detectJsonSchemaType(schema) !== 'any') return schema;
  if (!ctx.propertyTargetCache.has(ancestor)) {
    ctx.propertyTargetCache.set(ancestor, resolveRefTarget(ancestor, ctx));
  }
  const target = ctx.propertyTargetCache.get(ancestor);
  if (!target) return schema;
  const ownKeywords = ownKeywordsOfStub(schema, ancestor, ctx);
  return Object.keys(ownKeywords).length > 0 ? { ...target, ...ownKeywords } : target;
}

/** The row keywords a stub adds to the definition it copies: `$ref` siblings, a wrapper's keywords. */
function ownKeywordsOfStub(stub: SchemaNode, ref: string, ctx: SchemaTreeContext): SchemaNode {
  const definition = ctx.definitionOf(ref);
  if (!definition) return {};
  const [row] = splitRowAndSubschemas(stub);
  const [keywords] = splitResolverMarkers(row);
  // the stub copies the row of the definition, so only a value that differs from it is its own
  return Object.fromEntries(
    Object.entries(keywords).filter(([key, value]) => !equalKeywordValues(definition[key], value)),
  );
}

/**
 * A cycle stub stands for an ancestor on the tree path. A cached result reused elsewhere on the
 * page carries the stubs of the refs that were open where it was built; there, render the schema.
 */
function expandCycleStubsOffTheirPath(node: SchemaNode, ctx: SchemaTreeContext): SchemaNode {
  const schema = withoutStubOffItsPath(node, ctx.activeRefs, ctx);
  if (!isSchemaNode(schema.items)) return schema;
  // the array row reads the stub marker of its items before the items are built
  const ownRef = schema['x-original-ref'];
  const itemPathRefs =
    typeof ownRef === 'string' ? new Set([...ctx.activeRefs, ownRef]) : ctx.activeRefs;
  const items = withoutStubOffItsPath(schema.items, itemPathRefs, ctx);
  return items === schema.items ? schema : { ...schema, items };
}

/** A property a variant redeclares keeps the host's definition and `required` too. */
function withHostPropertyDefinitions(
  variant: SchemaNode,
  variantRef: string | undefined,
  host: SchemaNode,
  hostRef: string | undefined,
  ctx: SchemaTreeContext,
): SchemaNode {
  const hostProps = host.properties ?? {};
  const variantProps = variant.properties;
  if (!variantProps) return variant;
  const hostLineage = new Set([
    hostRef,
    ...(host['x-parentRefs'] ?? []).filter((ref) => {
      const parent = resolveRefTarget(ref, ctx);
      return !!parent && (declaresVariants(parent) || !!getDiscriminatorObject(parent));
    }),
  ]);
  const variantLineage = [variantRef, ...(variant['x-parentRefs'] ?? [])];
  if (variantLineage.some((ref) => ref !== undefined && hostLineage.has(ref))) return variant;

  const shared = Object.keys(variantProps).filter((name) => Object.hasOwn(hostProps, name));
  const required = variant.required ?? [];
  const hostRequired = (Array.isArray(host.required) ? host.required : []).filter(
    (name) => Object.hasOwn(variantProps, name) && !required.includes(name),
  );
  if (shared.length === 0 && hostRequired.length === 0) return variant;
  const properties = { ...variantProps };
  for (const name of shared) {
    properties[name] = mergeRedeclaredProperty(variantProps[name], hostProps[name], ctx);
  }
  return {
    ...variant,
    properties,
    ...(hostRequired.length > 0 && { required: [...required, ...hostRequired] }),
  };
}

const DEFAULT_MAPPING_KEY = 'Default mapping';

// Keywords merged apart from the row: those that hold subschemas, plus `required` and `discriminator`.
const SUBSCHEMA_KEYWORDS = new Set([
  'properties',
  'patternProperties',
  'additionalProperties',
  'unevaluatedProperties',
  'propertyNames',
  'dependentSchemas',
  'required',
  'items',
  'prefixItems',
  'additionalItems',
  'unevaluatedItems',
  'contains',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
  'if',
  'then',
  'else',
  'discriminator',
  'dependencies',
  'contentSchema',
  '$defs',
  'definitions',
]);

function splitRowAndSubschemas(node: SchemaNode): [row: SchemaNode, subschemas: SchemaNode] {
  const row: SchemaNode = {};
  const subschemas: SchemaNode = {};
  for (const [key, value] of Object.entries(node)) {
    (SUBSCHEMA_KEYWORDS.has(key) ? subschemas : row)[key] = value;
  }
  return [row, subschemas];
}

function equalKeywordValues(a: unknown, b: unknown): boolean {
  // resolved values share nodes: a pair already under comparison counts as equal, so each pair
  // is compared once, and any difference still makes the whole comparison false
  const comparing = new Map<object, Set<object>>();
  function equal(x: unknown, y: unknown): boolean {
    if (x === y) return true;
    if (typeof x !== 'object' || typeof y !== 'object' || x === null || y === null) return false;
    if (Array.isArray(x) !== Array.isArray(y)) return false;
    const comparedWithX = comparing.get(x) ?? new Set<object>();
    if (comparedWithX.has(y)) return true;
    comparing.set(x, comparedWithX.add(y));
    const keys = Object.keys(x);
    return (
      keys.length === Object.keys(y).length &&
      keys.every((key) => Object.hasOwn(y, key) && equal(Reflect.get(x, key), Reflect.get(y, key)))
    );
  }
  return equal(a, b);
}

// A cycle stub stands for an open ancestor and holds its raw, unresolved definition.
function isCycleStub(node: SchemaNode): boolean {
  return node['x-circular-ref'] !== undefined;
}

// Markers the resolver stamps on a node: they say where it was resolved, not what it means.
const RESOLVER_MARKERS = new Set([
  'x-original-ref',
  'x-parentRefs',
  'x-allof-cycle',
  'x-circular-ref',
]);

function splitResolverMarkers(row: SchemaNode): [keywords: SchemaNode, markers: SchemaNode] {
  const keywords: SchemaNode = {};
  const markers: SchemaNode = {};
  for (const [key, value] of Object.entries(row)) {
    (RESOLVER_MARKERS.has(key) ? markers : keywords)[key] = value;
  }
  return [keywords, markers];
}

type MergeRows = (
  variantRow: SchemaNode,
  hostRow: SchemaNode,
  ctx: SchemaTreeContext,
) => SchemaNode;

function mergePropertyRows(
  variantRow: SchemaNode,
  hostRow: SchemaNode,
  ctx: SchemaTreeContext,
): SchemaNode {
  return ctx.prepareVariant({ allOf: [variantRow, hostRow] });
}

function mergeNestedFieldRows(
  variantRow: SchemaNode,
  hostRow: SchemaNode,
  ctx: SchemaTreeContext,
): SchemaNode {
  // in the allOf, the field's own ref would become its own parent; merging equal rows re-sorts them
  const [variantKeywords, variantMarkers] = splitResolverMarkers(variantRow);
  const [hostKeywords, hostMarkers] = splitResolverMarkers(hostRow);
  const markers = variantMarkers['x-original-ref'] === undefined ? hostMarkers : variantMarkers;
  const hostChangesRow = Object.entries(hostKeywords).some(
    ([key, value]) => !equalKeywordValues(variantKeywords[key], value),
  );
  if (!hostChangesRow) return { ...variantKeywords, ...markers };
  return { ...ctx.prepareVariant({ allOf: [variantKeywords, hostKeywords] }), ...markers };
}

function mergeRedeclaredProperty(
  variantProp: SchemaNode,
  hostProp: SchemaNode,
  ctx: SchemaTreeContext,
): SchemaNode {
  // variant node -> host node -> merged node: a pair that many paths reach merges once
  const mergedPairs = new Map<SchemaNode, Map<SchemaNode, SchemaNode>>();

  function mergeNestedField(variantField: SchemaNode, hostField: SchemaNode): SchemaNode {
    if (variantField === hostField || isCycleStub(variantField) || isCycleStub(hostField)) {
      return variantField;
    }
    return mergeWithHost(variantField, hostField, mergeNestedFieldRows);
  }

  function mergeWithHost(
    variantNode: SchemaNode,
    hostNode: SchemaNode,
    mergeRows: MergeRows,
  ): SchemaNode {
    const alreadyMerged = mergedPairs.get(variantNode)?.get(hostNode);
    if (alreadyMerged) return alreadyMerged;

    const [variantRow, variantSubschemas] = splitRowAndSubschemas(variantNode);
    const [hostRow, hostSubschemas] = splitRowAndSubschemas(hostNode);
    const mergedNode: SchemaNode = {
      ...hostSubschemas,
      ...variantSubschemas,
      ...mergeRows(variantRow, hostRow, ctx),
    };
    const mergedWithHosts = mergedPairs.get(variantNode) ?? new Map<SchemaNode, SchemaNode>();
    mergedWithHosts.set(hostNode, mergedNode);
    mergedPairs.set(variantNode, mergedWithHosts);

    for (const key of ['properties', 'patternProperties'] as const) {
      const variantFields = variantSubschemas[key];
      const hostFields = hostSubschemas[key];
      if (!variantFields || !hostFields) continue;
      const fields = { ...variantFields };
      for (const [name, hostField] of Object.entries(hostFields)) {
        const variantField = fields[name];
        if (!Object.hasOwn(fields, name)) {
          fields[name] = hostField;
        } else if (isSchemaNode(variantField) && isSchemaNode(hostField)) {
          fields[name] = mergeNestedField(variantField, hostField);
        }
      }
      mergedNode[key] = fields;
    }
    const { required: variantRequired } = variantSubschemas;
    const { required: hostRequired } = hostSubschemas;
    if (Array.isArray(variantRequired) && Array.isArray(hostRequired)) {
      mergedNode.required = [...new Set([...variantRequired, ...hostRequired])];
    }
    for (const key of ['items', 'additionalProperties'] as const) {
      const variantField = variantSubschemas[key];
      const hostField = hostSubschemas[key];
      if (isSchemaNode(variantField) && isSchemaNode(hostField)) {
        mergedNode[key] = mergeNestedField(variantField, hostField);
      }
    }
    const { prefixItems: variantTuple } = variantSubschemas;
    const { prefixItems: hostTuple } = hostSubschemas;
    if (Array.isArray(variantTuple) && Array.isArray(hostTuple)) {
      mergedNode.prefixItems = Array.from(
        { length: Math.max(variantTuple.length, hostTuple.length) },
        (_, index) => {
          const variantItem = variantTuple[index];
          const hostItem = hostTuple[index];
          return isSchemaNode(variantItem) && isSchemaNode(hostItem)
            ? mergeNestedField(variantItem, hostItem)
            : (variantItem ?? hostItem);
        },
      );
    }
    return mergedNode;
  }

  return mergeWithHost(variantProp, hostProp, mergePropertyRows);
}

function resolveDiscriminatorParentRef(
  schema: SchemaNode,
  parentPointer: string,
): string | undefined {
  if (typeof schema['x-original-ref'] === 'string') return schema['x-original-ref'];
  if (NAMED_DEFINITION_REGEX.test(parentPointer)) return parentPointer;
  return undefined;
}

/** The discriminator switcher for a node, or undefined when it does not apply or is empty. */
function buildAppliedDiscriminatorSwitcher(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  pointer: string,
): SwitcherType | undefined {
  const discriminator = getDiscriminatorObject(schema);
  if (!discriminator?.propertyName) return undefined;
  if (ctx.isChild && (!declaresVariants(schema) || inheritsAnyDiscriminator(schema, ctx))) {
    return undefined;
  }
  const switcher = buildDiscriminatorSwitcher(schema, discriminator, ctx, pointer);
  return Object.keys(switcher.options).length > 0 ? switcher : undefined;
}

function buildDiscriminatorSwitcher(
  schema: SchemaNode,
  discriminator: DiscriminatorObject,
  ctx: SchemaTreeContext,
  parentPointer: string,
): SwitcherType {
  const mapping = discriminator.mapping || {};
  const isLimitedToMapping =
    discriminator['x-explicitMappingOnly'] ?? Object.keys(mapping).length > 0;
  const variants = schema.oneOf || schema.anyOf || [];
  // a schema listed as its own variant is not a cycle, so its ref is not "open" for options
  const ownRef = resolveDiscriminatorParentRef(schema, parentPointer);
  const childCtx: SchemaTreeContext = { ...ctx, isChild: true };
  // only the option that is the host schema itself is not a cycle; every other
  // option keeps the host's ref open so real recursion is still detected
  const optionCtx = (optionRef?: string): SchemaTreeContext =>
    optionRef && optionRef === ownRef
      ? { ...childCtx, activeRefs: new Set([...ctx.activeRefs].filter((r) => r !== ownRef)) }
      : childCtx;
  const compositionKey = schema.oneOf !== undefined ? 'oneOf' : 'anyOf';
  const options: Record<string, SwitcherOptionType> = {};
  const buildOption = (
    variant: SchemaNode,
    ref: string | undefined,
    isDefaultMapping: boolean,
    pointer: string,
  ): SwitcherOptionType => {
    const body = withHostPropertyDefinitions(variant, ref, schema, ownRef, ctx);
    const {
      discriminator: _discriminator,
      'x-discriminator': _xDiscriminator,
      ...withoutOwn
    } = body;
    return buildSwitcherOption(
      ref !== undefined && ref === ownRef ? withoutOwn : body,
      optionCtx(ref),
      isDefaultMapping,
      pointer,
      ref,
    );
  };

  if (Object.keys(mapping).length > 0) {
    for (const [name, ref] of Object.entries(mapping)) {
      const idx = variants.findIndex((v) => v['x-original-ref'] === ref);
      const resolved = variantOptionBody(ref, variants[idx], ctx);
      if (!resolved) continue;
      const variantPointer = idx >= 0 ? `${parentPointer}/${compositionKey}/${idx}` : parentPointer;
      options[name] = buildOption(resolved, ref, false, variantPointer);
    }
  } else {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const ref = variant['x-original-ref'];
      const resolved = typeof ref === 'string' ? variantOptionBody(ref, variant, ctx) : variant;
      if (!resolved) continue;
      const title = variant.title || ref?.split('/').pop() || 'Variant';
      const variantPointer = `${parentPointer}/${compositionKey}/${i}`;
      options[title] = buildOption(resolved, ref, false, variantPointer);
    }
  }

  if (variants.length === 0 && !isLimitedToMapping) {
    const explicitRefs = new Set(Object.values(mapping));
    // an inherited ancestor only contributes variants when it is the host of *this*
    // discriminator; an unrelated allOf mixin has its own inheritors, not our variants
    const inheritedRefs = (schema['x-parentRefs'] ?? []).filter((ref) =>
      hostsDiscriminator(ref, discriminator.propertyName, ctx),
    );
    const lookupRefs = [...inheritedRefs, ...(ownRef ? [ownRef] : [])];
    for (const parentRef of lookupRefs) {
      const derived = ctx.implicitDiscriminatorChildren?.[parentRef];
      if (!derived) continue;
      for (const { ref, value } of derived) {
        if (explicitRefs.has(ref) || Object.hasOwn(options, value)) continue;
        const resolved = resolveMappedVariant(ref, ctx);
        if (!resolved) continue;
        options[value] = buildOption(resolved, ref, false, parentPointer);
      }
    }
  }

  const defaultRef = discriminator.defaultMapping;
  const defaultVariant = defaultRef ? resolveMappedVariant(defaultRef, ctx) : undefined;
  if (defaultRef && defaultVariant) {
    // only an entry carrying the schema's own name folds into "Default mapping";
    // explicit mapping names for the same ref stay listed
    const implicitName = defaultRef.split('/').pop();
    if (implicitName) delete options[implicitName];
    const idx = variants.findIndex((v) => v['x-original-ref'] === defaultRef);
    const variantPointer = idx >= 0 ? `${parentPointer}/${compositionKey}/${idx}` : parentPointer;
    options[DEFAULT_MAPPING_KEY] = buildOption(defaultVariant, defaultRef, true, variantPointer);
  }

  return {
    type: 'discriminator',
    label: switcherLabel.DISCRIMINATOR,
    propertyName: discriminator.propertyName,
    jsonPointer: parentPointer,
    options,
  };
}

function buildOneOfSwitcher(
  variants: SchemaNode[],
  label: SwitcherLabel,
  ctx: SchemaTreeContext,
  parentPointer: string,
  compositionKey: 'oneOf' | 'anyOf',
  parentSchema: SchemaNode,
): SwitcherType {
  const options: Record<string, SwitcherOptionType> = {};
  const variantCtx: SchemaTreeContext = { ...ctx, isChild: false };
  const parentRef = resolveDiscriminatorParentRef(parentSchema, parentPointer);

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const ref = variant['x-original-ref'];
    const body =
      typeof ref === 'string' && lostFieldsToCycle(variant)
        ? (resolveMappedVariant(ref, ctx) ?? variant)
        : variant;
    const variantMergedWithParent = {
      type: parentSchema.type,
      ...withHostPropertyDefinitions(body, ref, parentSchema, parentRef, ctx),
    };
    const { label: title, typeLabel } = deriveVariantLabel(variant, parentSchema);
    const variantPointer = `${parentPointer}/${compositionKey}/${i}`;
    const optionKey = options[title] ? `${title} (${i + 1})` : title;
    const option = buildSwitcherOption(
      variantMergedWithParent,
      variantCtx,
      false,
      variantPointer,
      variant['x-original-ref'],
    );
    option.typeLabel = typeLabel;
    if (variant.title) option.title = variant.title;
    options[optionKey] = option;
  }

  return { type: 'oneOf', label, jsonPointer: parentPointer, options };
}

function buildConditionalSwitcher(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  parentPointer: string,
): SwitcherType {
  const {
    if: ifSchema,
    then: thenSchema = {},
    else: elseSchema = {},
    description: _,
    ...base
  } = schema;
  const variantCtx: SchemaTreeContext = { ...ctx, isChild: false };

  const mergeBranch = (...layers: (SchemaNode | undefined)[]): SchemaNode =>
    ctx.prepareVariant({ allOf: layers.filter((layer): layer is SchemaNode => layer != null) });

  return {
    type: 'oneOf',
    label: switcherLabel.ONE_OF,
    jsonPointer: parentPointer,
    options: {
      [ifSchema?.['x-displayName'] || ifSchema?.title || 'case 1']: buildSwitcherOption(
        mergeBranch(base, thenSchema, ifSchema),
        variantCtx,
        false,
        parentPointer,
      ),
      [elseSchema?.['x-displayName'] || elseSchema?.title || 'case 2']: buildSwitcherOption(
        mergeBranch(base, elseSchema),
        variantCtx,
        false,
        parentPointer,
      ),
    },
  };
}

function buildSwitcherOption(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  isDefaultMapping: boolean,
  optionPointer: string,
  optionRef?: string,
): SwitcherOptionType {
  const option: SwitcherOptionType = {
    isDeprecated: !!schema.deprecated,
    isDefaultMapping,
  };
  if (schema.description) option.description = schema.description;

  const schemaName = (schema['x-original-ref'] ?? optionRef)?.split('/').pop();
  if (schemaName) option.schemaName = schemaName;

  const accessMode = getAccessMode(schema);
  if (accessMode) option.accessMode = accessMode;

  const constraints = humanizeConstraints(schema);
  if (constraints.length) option.constraints = constraints;

  const enumVal = getEnum(schema);
  if (enumVal) option.enum = enumVal;

  if (optionRef && ctx.activeRefs.has(optionRef)) {
    option.isCircular = true;
    return option;
  }

  const type = schemaType(schema);

  if (optionRef) ctx.activeRefs.add(optionRef);
  try {
    const discriminatorSwitcher = buildAppliedDiscriminatorSwitcher(schema, ctx, optionPointer);
    if (discriminatorSwitcher) {
      option.switcher = discriminatorSwitcher;
      if (schema.properties) option.properties = buildObjectProperties(schema, ctx, optionPointer);
    } else if (schema.oneOf !== undefined) {
      option.switcher = buildOneOfSwitcher(
        schema.oneOf,
        switcherLabel.ONE_OF,
        ctx,
        optionPointer,
        'oneOf',
        schema,
      );
      if (schema.properties) option.properties = buildObjectProperties(schema, ctx, optionPointer);
    } else if (schema.anyOf !== undefined) {
      option.switcher = buildOneOfSwitcher(
        schema.anyOf,
        switcherLabel.ANY_OF,
        ctx,
        optionPointer,
        'anyOf',
        schema,
      );
      if (schema.properties) option.properties = buildObjectProperties(schema, ctx, optionPointer);
    } else if (
      !isPrimitiveLikeSchema(schema, type) &&
      (schemaHasType(type, 'object') || schema.properties)
    ) {
      option.properties = buildObjectProperties(schema, ctx, optionPointer);
    }

    if (!isPrimitiveLikeSchema(schema, type) && schemaHasType(type, 'array')) {
      const items = buildArrayItems(schema, ctx, optionPointer);
      if (items.length) option.items = items;
    }
  } finally {
    if (optionRef) ctx.activeRefs.delete(optionRef);
  }

  return option;
}

export function buildPropertyTree(
  preparedRoot: SchemaNode,
  ctx: SchemaTreeContext,
  rootJsonPointer: string,
): PropertyType {
  const rootRef = preparedRoot['x-original-ref'];
  delete preparedRoot['x-original-ref'];
  const rootCtx = typeof rootRef === 'string' ? { ...ctx, rootRef } : ctx;
  return buildPropertyForNode(preparedRoot, rootCtx, {}, rootJsonPointer);
}
