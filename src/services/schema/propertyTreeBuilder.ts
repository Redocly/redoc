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
  toPropertyExample,
} from './propertyBuilder.js';
import { deriveVariantLabel } from './variant-label.js';

export type SchemaTreeContext = {
  prepareVariant(ref: SchemaNode): SchemaNode;
  propertyRefCache: Map<string, PropertyType>;
  variantResolutionCache: Map<string, SchemaNode>;
  isChild?: boolean;
  implicitDiscriminatorChildren?: Record<string, ImplicitDiscriminatorChild[]>;
  exampleSerializer?: (value: unknown) => string;
  sortRequiredPropsFirst?: boolean;
  /** Refs open on the current DFS path; reaching one again is a cycle. */
  activeRefs: Set<string>;
  depth: number;
  /** Refs on a reference cycle; memoized by ref alone so a cyclic component expands once. */
  recursiveRefs: ReadonlySet<string>;
};

const MAX_REF_DEPTH = 10;
const MAX_TREE_DEPTH = 200;

type ImplicitDiscriminatorChild = { ref: string; value: string };

function refCacheKey(
  refKey: string,
  schema: SchemaNode,
  jsonPointer: string,
  isRecursive: boolean,
): string {
  const base = getDiscriminatorObject(schema) ? `${refKey}:d` : refKey;
  return isRecursive ? `${base}#rec` : `${base}@${jsonPointer}`;
}

function hasCircularInSubtree(prop: PropertyType): boolean {
  if (prop.isCircular) return true;
  if (prop.properties) {
    for (const child of Object.values(prop.properties)) {
      if (hasCircularInSubtree(child)) return true;
    }
  }
  if (prop.items) {
    for (const item of prop.items) {
      if (hasCircularInSubtree(item)) return true;
    }
  }
  if (prop.switcher) {
    for (const opt of Object.values(prop.switcher.options)) {
      if (opt.isCircular) return true;
      if (opt.properties) {
        for (const child of Object.values(opt.properties)) {
          if (hasCircularInSubtree(child)) return true;
        }
      }
    }
  }
  return false;
}

const NAMED_DEFINITION_REGEX = /^#\/components\/(schemas|pathItems)\/([^/]+)$/;

function getNamedDefinitionTitle(jsonPointer: string): string | undefined {
  const match = jsonPointer.match(NAMED_DEFINITION_REGEX);
  if (!match) return undefined;
  return match[2].replace(/~1/g, '/').replace(/~0/g, '~');
}

function buildPropertyForNode(
  schema: SchemaNode,
  ctx: SchemaTreeContext,
  options: PropertyShellOptions = {},
  jsonPointer: string,
): PropertyType {
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

  const isRecursive = refKey !== undefined && ctx.recursiveRefs.has(refKey);
  const cacheKey =
    refKey === undefined ? undefined : refCacheKey(refKey, schema, jsonPointer, isRecursive);
  if (cacheKey) {
    const cached = ctx.propertyRefCache.get(cacheKey);
    if (cached) return { ...cached, ...property };
  }

  if (refKey) ctx.activeRefs.add(refKey);
  try {
    attachNestedStructure(property, schema, { ...ctx, depth: ctx.depth + 1 }, jsonPointer);
  } finally {
    if (refKey) ctx.activeRefs.delete(refKey);
  }

  if (cacheKey && (isRecursive || !hasCircularInSubtree(property))) {
    ctx.propertyRefCache.set(cacheKey, property);
  }
  property.isExpandable = isExpandableSchema(property);
  return property;
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
  const type = schema.type || detectJsonSchemaType(schema);
  const primitive = isPrimitiveLikeSchema(schema, type);

  const discriminatorSwitcher = buildAppliedDiscriminatorSwitcher(schema, ctx, jsonPointer);
  if (discriminatorSwitcher) {
    property.switcher = discriminatorSwitcher;
    hoistVariantExample(property, schema.oneOf ?? schema.anyOf, ctx.exampleSerializer);
    hoistVariantAccessMode(property, schema.oneOf ?? schema.anyOf);
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
    const merged: SchemaNode = { ...raw };
    if (merged.default === undefined && defaults[name] !== undefined)
      merged.default = defaults[name];
    if (merged.example === undefined && parentExample?.[name] !== undefined) {
      merged.example = parentExample[name];
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
    const label = (additional['x-additionalPropertiesName'] || 'property name') + '*';
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
    result['property name*'] = buildPropertyForNode(
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
      !isPrimitiveLikeSchema(
        schema.items,
        schema.items.type || detectJsonSchemaType(schema.items),
      ) ||
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

function stripVariantHostMarkers(variant: SchemaNode, ref: string): SchemaNode {
  delete variant.discriminator;
  delete variant['x-discriminator'];
  delete variant['x-original-ref'];

  // a variant inherits the parent's oneOf/anyOf through allOf; when that list
  // names the variant itself, the selector would nest into itself — drop it
  for (const key of ['oneOf', 'anyOf'] as const) {
    const list = variant[key];
    if (Array.isArray(list) && list.some((v) => isSchemaNode(v) && v['x-original-ref'] === ref)) {
      delete variant[key];
    }
  }
  return variant;
}

function resolveMappedVariant(ref: string, ctx: SchemaTreeContext): SchemaNode | undefined {
  const cached = ctx.variantResolutionCache.get(ref);
  if (cached) return cached;

  const merged = resolveRefTarget(ref, ctx);
  if (!merged) return undefined;

  const variant = stripVariantHostMarkers(merged, ref);
  ctx.variantResolutionCache.set(ref, variant);
  return variant;
}

/** The option body: the copy merged for the page, unless a cycle stub cost it fields. */
function variantOptionBody(
  ref: string,
  listed: SchemaNode | undefined,
  ctx: SchemaTreeContext,
): SchemaNode | undefined {
  const lossy =
    listed === undefined ||
    listed['x-circular-ref'] !== undefined ||
    listed['x-allof-cycle'] !== undefined;
  if (lossy) return resolveMappedVariant(ref, ctx);
  return stripVariantHostMarkers({ ...listed }, ref);
}

const DEFAULT_MAPPING_KEY = 'Default mapping';

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
  if (ctx.isChild || !discriminator?.propertyName) return undefined;
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

  if (Object.keys(mapping).length > 0) {
    for (const [name, ref] of Object.entries(mapping)) {
      const idx = variants.findIndex((v) => v['x-original-ref'] === ref);
      const resolved = variantOptionBody(ref, variants[idx], ctx);
      if (!resolved) continue;
      const variantPointer = idx >= 0 ? `${parentPointer}/${compositionKey}/${idx}` : parentPointer;
      options[name] = buildSwitcherOption(resolved, optionCtx(ref), false, variantPointer, ref);
    }
  } else {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const ref = variant['x-original-ref'];
      const resolved = typeof ref === 'string' ? variantOptionBody(ref, variant, ctx) : variant;
      if (!resolved) continue;
      const title = variant.title || ref?.split('/').pop() || 'Variant';
      const variantPointer = `${parentPointer}/${compositionKey}/${i}`;
      options[title] = buildSwitcherOption(resolved, optionCtx(ref), false, variantPointer, ref);
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
        options[value] = buildSwitcherOption(resolved, optionCtx(ref), false, parentPointer, ref);
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
    options[DEFAULT_MAPPING_KEY] = buildSwitcherOption(
      defaultVariant,
      optionCtx(defaultRef),
      true,
      variantPointer,
      defaultRef,
    );
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

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const variantMergedWithParent = { type: parentSchema.type, ...variant };
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

  const type = schema.type || detectJsonSchemaType(schema);

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
  delete preparedRoot['x-original-ref'];
  return buildPropertyForNode(preparedRoot, ctx, {}, rootJsonPointer);
}
