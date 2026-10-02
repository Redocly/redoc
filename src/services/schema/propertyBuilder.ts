import type {
  SchemaNode,
  DiscriminatorObject,
  ExternalDocsType,
  ExampleType,
  PropertyType,
  AccessMode,
} from '../../types/schema.js';

import { isSchemaNode, isStructuredExample } from '../../types/schema.js';

const INTERNAL_EXTENSIONS = new Set([
  'x-circular-ref',
  'x-allof-cycle',
  'x-complex',
  'x-nullable',
  'x-badges',
  'x-enumDescriptions',
  'x-additionalPropertiesName',
  'x-discriminator',
  'x-displayName',
  'x-parentRefs',
  'x-original-ref',
]);

const KEYWORD_TYPE_MAP: Record<string, string> = {
  multipleOf: 'number',
  maximum: 'number',
  exclusiveMaximum: 'number',
  minimum: 'number',
  exclusiveMinimum: 'number',
  maxLength: 'string',
  minLength: 'string',
  pattern: 'string',
  contentEncoding: 'string',
  contentMediaType: 'string',
  items: 'array',
  maxItems: 'array',
  minItems: 'array',
  uniqueItems: 'array',
  maxProperties: 'object',
  minProperties: 'object',
  required: 'object',
  properties: 'object',
  additionalProperties: 'object',
  patternProperties: 'object',
};

const KEYWORD_TYPE_ENTRIES = Object.entries(KEYWORD_TYPE_MAP);

export function detectJsonSchemaType(schema: SchemaNode): string {
  if (schema.type !== undefined && !Array.isArray(schema.type)) return schema.type;
  for (const [keyword, type] of KEYWORD_TYPE_ENTRIES) {
    if (schema[keyword] !== undefined) return type;
  }
  return 'any';
}

export function schemaHasType(type: string | string[], target: string): boolean {
  return type === target || (Array.isArray(type) && type.includes(target));
}

export function isArrayTypedSchema(schema: SchemaNode): boolean {
  return schemaHasType(schema.type || detectJsonSchemaType(schema), 'array');
}

export function isStructuredArrayItems(items: SchemaNode): boolean {
  return (
    !items['x-circular-ref'] &&
    !items['x-complex'] &&
    isArrayTypedSchema(items) &&
    (items.items !== undefined || items.prefixItems !== undefined)
  );
}

export function isPrimitiveLikeSchema(schema: SchemaNode, type: string | string[]): boolean {
  if (schema['x-circular-ref'] || schema['x-complex']) return true;
  if (schema.oneOf !== undefined || schema.anyOf !== undefined) return false;
  if ((schema.if && schema.then) || (schema.if && schema.else)) return false;
  if (Array.isArray(schema.items) || Array.isArray(schema.prefixItems)) return false;

  if (schemaHasType(type, 'object')) {
    const props = schema.properties;
    const hasNoStructure =
      props !== undefined
        ? Object.keys(props).length === 0
        : schema.additionalProperties === undefined &&
          schema.unevaluatedProperties === undefined &&
          schema.patternProperties === undefined;
    if (!hasNoStructure) return false;
  }

  if (
    schemaHasType(type, 'array') &&
    schema.items !== undefined &&
    typeof schema.items !== 'boolean'
  ) {
    if (!Array.isArray(schema.items)) {
      if (isStructuredArrayItems(schema.items)) return false;
      const itemsPrimitive = isPrimitiveLikeSchema(
        schema.items,
        schema.items.type || detectJsonSchemaType(schema.items),
      );
      // primitive items with their own documentation render as a nested items row
      if (itemsPrimitive && primitiveArrayItemsHaveOwnInfo(schema.items)) return false;
      return itemsPrimitive;
    }
  }

  return true;
}

/**
 * Primitive items that carry their own documentation are rendered as a nested
 * `[i]` row, so the array row keeps only the array-level info; trivial primitive
 * items stay flattened into the array row with their metadata promoted onto it.
 */
export function primitiveArrayItemsHaveOwnInfo(items: SchemaNode): boolean {
  return !!(
    items.description ||
    items.pattern ||
    items.externalDocs ||
    items.default !== undefined ||
    items.const !== undefined ||
    items.deprecated ||
    items.contentEncoding ||
    humanizeConstraints(items).length
  );
}

function formatRange(label: string, min?: number, max?: number): string | undefined {
  if (min !== undefined && max !== undefined) {
    return min === max ? `= ${min} ${label}` : `[ ${min} .. ${max} ] ${label}`;
  }
  if (max !== undefined) return `<= ${max} ${label}`;
  if (min !== undefined) {
    if (min === 1) return 'non-empty';
    return `>= ${min} ${label}`;
  }
  return undefined;
}

function formatNumberRange(schema: SchemaNode): string | undefined {
  const min =
    typeof schema.exclusiveMinimum === 'number'
      ? Math.min(schema.exclusiveMinimum, schema.minimum ?? Infinity)
      : schema.minimum;
  const max =
    typeof schema.exclusiveMaximum === 'number'
      ? Math.max(schema.exclusiveMaximum, schema.maximum ?? -Infinity)
      : schema.maximum;
  const exMin = typeof schema.exclusiveMinimum === 'number' || !!schema.exclusiveMinimum;
  const exMax = typeof schema.exclusiveMaximum === 'number' || !!schema.exclusiveMaximum;

  if (min !== undefined && max !== undefined) {
    return `${exMin ? '( ' : '[ '}${min} .. ${max}${exMax ? ' )' : ' ]'}`;
  }
  if (max !== undefined) return `${exMax ? '< ' : '<= '}${max}`;
  if (min !== undefined) return `${exMin ? '> ' : '>= '}${min}`;
  return undefined;
}

export function humanizeConstraints(schema: SchemaNode): string[] {
  const result: string[] = [];
  const push = (v: string | undefined) => {
    if (v) result.push(v);
  };
  push(formatRange('characters', schema.minLength, schema.maxLength));
  push(formatRange('items', schema.minItems, schema.maxItems));

  const minP = schema.minProperties;
  const maxP = schema.maxProperties;
  push(formatRange(minP === 1 && maxP === 1 ? 'property' : 'properties', minP, maxP));

  const multipleOf = schema.multipleOf;
  if (multipleOf !== undefined) {
    const s = multipleOf.toString(10);
    result.push(
      /^0\.0*1$/.test(s) ? `decimal places <= ${s.split('.')[1].length}` : `multiple of ${s}`,
    );
  }

  push(formatNumberRange(schema));
  if (schema.uniqueItems) result.push('unique');
  return result;
}

function pluralizeType(displayType: string): string {
  return displayType
    .split(' or ')
    .map((t) => t.replace(/^(string|object|number|integer|array|boolean)s?( ?.*)/, '$1s$2'))
    .join(' or ');
}

function getCompositionVariants(schema: SchemaNode): SchemaNode[] | undefined {
  if (getDiscriminatorObject(schema)?.propertyName) return undefined;
  return schema.oneOf ?? schema.anyOf;
}

function composeVariantsDisplayType(variants: SchemaNode[]): string {
  return [
    ...new Set(
      variants.map((variant) => {
        const variantType = variant.type || detectJsonSchemaType(variant);
        const { typePrefix, displayType } = buildDisplayType(variant, variantType);
        const refBasename = variant['x-original-ref']?.split('/').pop();
        const variantName = variant.title || refBasename;
        let name = typePrefix + (variantName ? `${variantName} (${displayType})` : displayType);
        if (name.indexOf(' or ') > -1) {
          name = `(${name})`;
        }
        return name;
      }),
    ),
  ].join(' or ');
}

export function buildDisplayType(
  schema: SchemaNode,
  type: string | string[],
): { typePrefix: string; displayType: string; displayFormat: string } {
  const variants = getCompositionVariants(schema);
  if (variants) {
    return {
      typePrefix: '',
      displayType: composeVariantsDisplayType(variants),
      displayFormat: schema.format || '',
    };
  }

  let typePrefix = '';
  let displayType = Array.isArray(type)
    ? type.map((t) => (t === null ? 'null' : t)).join(' or ')
    : type;
  let displayFormat = schema.format || '';

  if (schemaHasType(type, 'array')) {
    const items = schema.items;
    if (
      items &&
      !Array.isArray(items) &&
      typeof items !== 'boolean' &&
      !Array.isArray(schema.prefixItems)
    ) {
      if (isStructuredArrayItems(items)) {
        displayType = 'items';
      } else {
        const itemType = items.type || detectJsonSchemaType(items);
        displayType = pluralizeType(Array.isArray(itemType) ? itemType.join(' or ') : itemType);
        // documented primitive items show their format on the nested items row
        displayFormat = getDocumentedPrimitiveArrayItems(schema, type) ? '' : items.format || '';
      }
      typePrefix = 'Array of ';
    } else if (
      Array.isArray(schema.prefixItems) ||
      Array.isArray(schema.items) ||
      // items: false permits no items, so no item type is advertised
      schema.items === false
    ) {
      displayType = 'Array of items';
    } else {
      // no items schema means any items are accepted
      displayType = 'any';
      typePrefix = 'Array of ';
    }
    if (Array.isArray(type)) {
      const rest = type.filter((t) => t !== 'array');
      if (rest.length) displayType += ` or ${rest.join(' or ')}`;
    }
  }

  if (schema.nullable || schema['x-nullable']) {
    const types = Array.isArray(type) ? type : [type];
    if (!types.includes('null') && !types.some((t) => t === null)) {
      displayType += ' or null';
    }
  }

  return { typePrefix, displayType, displayFormat };
}

function getPrimitiveArrayItemsSchema(
  schema: SchemaNode,
  type: string | string[],
): SchemaNode | undefined {
  if (!schemaHasType(type, 'array') || Array.isArray(schema.prefixItems)) return undefined;
  const items = schema.items;
  if (!isSchemaNode(items)) return undefined;
  if (items['x-circular-ref'] || items['x-complex']) return undefined;
  if (isStructuredArrayItems(items)) return undefined;
  return isPrimitiveLikeSchema(items, items.type || detectJsonSchemaType(items))
    ? items
    : undefined;
}

export function getDocumentedPrimitiveArrayItems(
  schema: SchemaNode,
  type: string | string[],
): SchemaNode | undefined {
  const items = getPrimitiveArrayItemsSchema(schema, type);
  return items && primitiveArrayItemsHaveOwnInfo(items) ? items : undefined;
}

function buildTypeString(schema: SchemaNode, type: string | string[]): string {
  const { typePrefix, displayType, displayFormat } = buildDisplayType(schema, type);
  const contentEncoding = schema.contentEncoding || '';
  // items constraints are not merged in: trivial primitive items have none, and
  // documented ones show theirs on the nested items row
  const constraints = humanizeConstraints(schema);

  const parts = [typePrefix + displayType];
  if (displayFormat) parts.push(`(${displayFormat})`);
  if (contentEncoding) parts.push(contentEncoding);
  parts.push(...constraints);
  return parts.join(', ');
}

export function stringifyValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function toPropertyExample(
  value: unknown,
  exampleSerializer?: (value: unknown) => string,
): PropertyType['example'] {
  if (exampleSerializer) return exampleSerializer(value);
  return isStructuredExample(value) ? value : JSON.stringify(value);
}

function extractNamedExamples(
  schema: SchemaNode,
  exampleSerializer?: (value: unknown) => string,
): Record<string, ExampleType> | undefined {
  const raw = schema.examples;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;

  const serialize = exampleSerializer ?? stringifyValue;

  const result: Record<string, ExampleType> = {};
  for (const [name, rawExample] of Object.entries(raw as Record<string, unknown>)) {
    if (!rawExample || typeof rawExample !== 'object' || Array.isArray(rawExample)) continue;
    const example = rawExample as Record<string, unknown>;
    const value = example.value;

    const normalized: ExampleType = {
      ...(typeof example.summary === 'string' && { summary: example.summary }),
      ...(typeof example.description === 'string' && { description: example.description }),
      ...(value !== undefined && { value: serialize(value) }),
    };

    if (Object.keys(normalized).length > 0) {
      result[name] = normalized;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function extractExtensions(schema: SchemaNode): Record<string, string> | undefined {
  const exts: Record<string, string> = {};
  let found = false;
  for (const key of Object.keys(schema)) {
    if (key.startsWith('x-') && !key.startsWith('x-redocly') && !INTERNAL_EXTENSIONS.has(key)) {
      exts[key] = stringifyValue(schema[key]);
      found = true;
    }
  }
  return found ? exts : undefined;
}

export function getAccessMode(schema: SchemaNode): AccessMode {
  if (schema.readOnly) return 'read-only';
  if (schema.writeOnly) return 'write-only';
  return undefined;
}

export function getEnum(schema: SchemaNode): PropertyType['enum'] {
  return schema['x-enumDescriptions'] ?? (schema.enum?.length ? schema.enum : undefined);
}

export function getDiscriminatorObject(schema: SchemaNode): DiscriminatorObject | undefined {
  return schema.discriminator ?? schema['x-discriminator'];
}

export type PropertyShellOptions = {
  isRequired?: boolean;
  isAdditionalProperty?: boolean;
  isPatternProperty?: boolean;
  exampleSerializer?: (value: unknown) => string;
};

export function buildPropertyShell(
  schema: SchemaNode,
  options: PropertyShellOptions = {},
): PropertyType {
  const {
    isRequired = false,
    isAdditionalProperty = false,
    isPatternProperty = false,
    exampleSerializer,
  } = options;
  const type = schema.type || detectJsonSchemaType(schema);

  const property: PropertyType = {
    type: buildTypeString(schema, type),
  };
  let schemaName = schema['x-original-ref']?.split('/').pop();
  let title = schema.title || schemaName;
  if (!title && schemaHasType(type, 'array') && !getDocumentedPrimitiveArrayItems(schema, type)) {
    // documented primitive items show their title on the nested items row
    const items = schema.items;
    if (items && !Array.isArray(items) && typeof items !== 'boolean') {
      schemaName = items['x-original-ref']?.split('/').pop();
      title = items.title || schemaName;
    }
  }
  if (title) property.title = title;
  if (schemaName) property.schemaName = schemaName;
  if (isAdditionalProperty) property.isAdditionalProperty = true;
  if (isPatternProperty) property.isPatternProperty = true;
  if (schema['x-circular-ref']) property.isCircular = true;
  if (schema['x-complex']) property.isComplex = true;
  if (isRequired) property.isRequired = true;
  if (schema.deprecated) property.isDeprecated = true;

  if (schema.description) property.description = schema.description;
  if (schema.pattern) property.pattern = schema.pattern;
  if (schema.example !== undefined) {
    property.example = toPropertyExample(schema.example, exampleSerializer);
  }
  if (schema.default !== undefined) property.default = JSON.stringify(schema.default);

  const namedExamples = extractNamedExamples(schema, exampleSerializer);
  if (namedExamples) property.examples = namedExamples;

  const badges = schema['x-badges'];
  if (badges?.length) property.badges = badges;

  const accessMode = getAccessMode(schema);
  if (accessMode) property.accessMode = accessMode;
  const enumVal = getEnum(schema);
  if (enumVal) property.enum = enumVal;

  const extensions = extractExtensions(schema);
  if (extensions) property.extensions = extensions;

  if (schema.externalDocs) {
    property.externalDocs = {
      description: schema.externalDocs.description || '',
      url: schema.externalDocs.url || '',
    } satisfies ExternalDocsType;
  }

  if (schema.const !== undefined) property.const = JSON.stringify(schema.const);

  return property;
}

export function promotePrimitiveArrayMetadata(
  property: PropertyType,
  schema: SchemaNode,
  type: string | string[],
  exampleSerializer?: (value: unknown) => string,
): void {
  const items = getPrimitiveArrayItemsSchema(schema, type);
  // documented primitive items render as a nested items row instead of being promoted
  if (!items || primitiveArrayItemsHaveOwnInfo(items)) return;

  if (!property.enum) property.enum = getEnum(items);
  if (property.example === undefined && items.example !== undefined) {
    property.example = toPropertyExample([items.example], exampleSerializer);
  }
}
