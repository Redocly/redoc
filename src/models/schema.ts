
import type { OpenAPISchema, Referenced } from '../types/index.js';
import type { OpenAPIParser, MergedOpenAPISchema, Options } from '../services/index.js';
import type { FieldModel, Deps, SchemaModel } from './types.js';

import { isObject } from '@redocly/theme/core/openapi';

import { pushRef } from '../services/OpenAPIParser.js';
import {
  detectType,
  extractExtensions,
  getValueFromMdParsedExtension,
  humanizeConstraints,
  isNamedDefinition,
  isPrimitiveType,
  JsonPointer,
  pluralizeType,
  sortByDeprecated,
  sortByRequired,
} from '../utils/index.js';
import { getField } from './field.js';

export function getSchema({
  parser,
  schemaOrRef,
  pointer,
  options,
  isChild = false,
  isDefaultMapping = false,
  baseRefsStack = [],
  deps,
  absolutePointer,
}: {
  parser: OpenAPIParser;
  schemaOrRef: Referenced<OpenAPISchema>;
  pointer: string;
  options: Options;
  isChild?: boolean;
  isDefaultMapping?: boolean;
  baseRefsStack?: string[];
  deps: Deps;
  absolutePointer?: string;
}): SchemaModel {
  const { resolved, refsStack: newRefsStack } = parser.deref(schemaOrRef, baseRefsStack, true);
  const schemaPointer = schemaOrRef.$ref || pointer || absolutePointer || '';
  const refsStack = pushRef(newRefsStack, schemaPointer);
  const schema = parser.mergeAllOf(
    resolved,
    schemaPointer,
    refsStack,
    schemaOrRef.$ref || absolutePointer,
  );

  const type = schema.type || detectType(schema);
  const schemaModel: SchemaModel = {
    operationPointer: deps.operation?.pointer || absolutePointer || '',
    schemaOrRef,
    isChild,
    isDefaultMapping,
    typePrefix: '',
    pointer: schemaPointer,
    absolutePointer,
    refsStack,
    rawSchema: resolved,
    type,
    isCircular: !!schema['x-circular-ref'],
    isComplex: !!schema['x-complex'],
    title:
      schema.title ||
      (isNamedDefinition(schemaPointer) && JsonPointer.baseName(schemaPointer)) ||
      '',
    description: getValueFromMdParsedExtension(schema, 'description') || '',
    format: schema.format,
    enum: schema.enum || [],
    example: schema.example,
    deprecated: !!schema.deprecated,
    pattern: schema.pattern,
    externalDocs: schema.externalDocs,
    displayFormat: schema.format,
    isPrimitive: isPrimitiveType(schema, type),
    constraints: humanizeConstraints(schema),
    default: schema.default,
    readOnly: !!schema.readOnly,
    writeOnly: !!schema.writeOnly,
    const: schema.const || '',
    contentEncoding: schema.contentEncoding,
    contentMediaType: schema.contentMediaType,
    minItems: schema.minItems,
    maxItems: schema.maxItems,
    nullable: schema.nullable || schema['x-nullable'],
    schema,
    displayType: '',
    items: undefined,
    extensions: undefined,
    oneOfType: '',
    discriminatorProp: undefined,
    oneOf: undefined,
    ['x-enumDescriptions']: getValueFromMdParsedExtension(schema, 'x-enumDescriptions'),
    get fields() {
      if (
        !schemaModel.isCircular &&
        !schemaModel.isComplex &&
        (hasType(schemaModel, 'object') || (hasType(schemaModel, 'array') && hasArrayItems(schema)))
      ) {
        return buildFields(parser, schema, schemaPointer, options, refsStack, deps);
      }
      return;
    },
  };

  if (schema.nullable || schema['x-nullable']) {
    if (
      Array.isArray(schemaModel.type) &&
      !schemaModel.type.some((value: string) => value === null || value === 'null')
    ) {
      schemaModel.type = [...schemaModel.type, 'null'];
    } else if (
      !Array.isArray(schemaModel.type) &&
      (schemaModel.type !== null || schemaModel.type !== 'null')
    ) {
      schemaModel.type = [schemaModel.type, 'null'];
    }
  }

  schemaModel.displayType = Array.isArray(schemaModel.type)
    ? schemaModel.type.map((item: string) => (item === null ? 'null' : item)).join(' or ')
    : schemaModel.type;

  if (schemaModel.isCircular) {
    return schemaModel;
  }

  if ((schema.if && schema.then) || (schema.if && schema.else)) {
    const { oneOf, oneOfType } = initConditionalOperators({
      schema,
      parser,
      pointer: schemaPointer,
      options,
      deps,
      refsStack,
    });
    schemaModel.oneOf = oneOf;
    schemaModel.oneOfType = oneOfType;
    return schemaModel;
  }

  if (!isChild && getDiscriminator(schema) !== undefined) {
    const { oneOf, discriminatorProp } = initDiscriminator({
      schema,
      parser,
      deps: deps,
      mergedSchema: schema,
      options: options,
      pointer: schemaPointer,
      refsStack,
    });
    schemaModel.oneOf = oneOf;
    schemaModel.discriminatorProp = discriminatorProp;
    return schemaModel;
  } else if (
    isChild &&
    Array.isArray(schema.oneOf) &&
    schema.oneOf.find((s) => s.$ref === schemaPointer)
  ) {
    // we hit allOf of the schema with the parent discriminator
    delete schema.oneOf;
  }

  if (schema.oneOf !== undefined) {
    const { oneOf, displayType } = initOneOf({
      schemaOneOf: schema.oneOf,
      parser,
      deps,
      options,
      pointer: schemaPointer,
      refsStack,
      schema,
    });
    schemaModel.oneOfType = 'One of';
    if (oneOf) {
      schemaModel.oneOf = oneOf;
    }
    schemaModel.displayType = displayType;
    if (schema.anyOf !== undefined) {
      console.warn(
        `oneOf and anyOf are not supported on the same level. Skipping anyOf at ${schemaPointer}`,
      );
    }
    return schemaModel;
  }

  if (schema.anyOf !== undefined) {
    const { oneOf, displayType } = initOneOf({
      schemaOneOf: schema.anyOf,
      parser,
      deps,
      options,
      pointer: schemaPointer,
      refsStack,
      schema,
    });
    if (oneOf) {
      schemaModel.oneOf = oneOf;
    }
    schemaModel.displayType = displayType;
    schemaModel.oneOfType = 'Any of';
    return schemaModel;
  }
  if (hasType(schemaModel, 'array')) {
    if (schema.items && !hasArrayItems(schema)) {
      schemaModel.items = getSchema({
        parser,
        schemaOrRef: Object.assign({ type: 'object' }, schema.items) as OpenAPISchema,
        pointer: schemaPointer + '/items',
        options,
        baseRefsStack: refsStack,
        deps,
        absolutePointer: JsonPointer.join(schema.absolutePointer || '', ['items']),
      });
    }

    schemaModel.displayType =
      schema.prefixItems || Array.isArray(schema.items)
        ? 'items'
        : pluralizeType(schemaModel.items?.displayType || schemaModel.displayType);
    schemaModel.displayFormat = schemaModel.items?.format || '';
    schemaModel.typePrefix = schemaModel.items?.typePrefix || '' + 'Array of ';
    schemaModel.title = schemaModel.title || schemaModel.items?.title || '';
    schemaModel.isPrimitive =
      schemaModel.items?.isPrimitive !== undefined
        ? schemaModel.items?.isPrimitive
        : schemaModel.isPrimitive;

    if (schemaModel.example === undefined && schemaModel.items?.example !== undefined) {
      schemaModel.example = [schemaModel.items.example];
    }
    if (schemaModel.items?.isPrimitive) {
      schemaModel.enum = schemaModel.items.enum;
      schemaModel['x-enumDescriptions'] = getValueFromMdParsedExtension(
        schemaModel.items,
        'x-enumDescriptions',
      );
    }
    if (Array.isArray(schemaModel.type)) {
      const filteredType = schemaModel.type.filter((item: string) => item !== 'array');
      if (filteredType.length) {
        schemaModel.displayType += ` or ${filteredType.join(' or ')}`;
      }
    }
  }

  if (options.showExtensions) {
    schemaModel.extensions = extractExtensions(schema, options.showExtensions);
  }

  return schemaModel;
}

function initDiscriminator({
  schema,
  parser,
  pointer,
  options,
  refsStack,
  deps,
  mergedSchema,
}: {
  schema: OpenAPISchema;
  parser: OpenAPIParser;
  pointer: string;
  options: Options;
  refsStack: string[];
  deps: Deps;
  mergedSchema: MergedOpenAPISchema;
}): { discriminatorProp: string; oneOf: SchemaModel[] } {
  const discriminator = getDiscriminator(schema);
  const discriminatorProp = discriminator?.propertyName as string;
  const implicitInvertedMapping = parser.findDerived([
    ...(mergedSchema['x-parentRefs'] || []),
    pointer,
  ]);

  if (schema.oneOf) {
    for (const variant of schema.oneOf) {
      if (variant.$ref === undefined) {
        continue;
      }
      const name = JsonPointer.baseName(variant.$ref);
      implicitInvertedMapping[variant.$ref] = name;
    }
  }

  const mapping = discriminator?.mapping || {};

  // When explicit mappings are defined, use only those mappings.
  const isLimitedToMapping =
    discriminator?.['x-explicitMappingOnly'] ?? Object.keys(mapping).length > 0;

  const explicitInvertedMapping = {};
  for (const name in mapping) {
    const $ref = mapping[name];

    if (Array.isArray(explicitInvertedMapping[$ref])) {
      explicitInvertedMapping[$ref].push(name);
    } else {
      // overrides implicit mapping here
      explicitInvertedMapping[$ref] = [name];
    }
  }

  const invertedMapping = isLimitedToMapping
    ? { ...explicitInvertedMapping }
    : { ...implicitInvertedMapping, ...explicitInvertedMapping };

  let refs: Array<{ $ref; name; isDefaultMapping?: boolean }> = [];

  for (const $ref of Object.keys(invertedMapping)) {
    const names = invertedMapping[$ref];
    if (Array.isArray(names)) {
      for (const name of names) {
        refs.push({ $ref, name });
      }
    } else {
      refs.push({ $ref, name: names });
    }
  }

  if (discriminator?.defaultMapping) {
    const defaultRefIdx = refs.findIndex(
      (ref) => ref.name === JsonPointer.baseName(discriminator.defaultMapping),
    );
    const defaultMappingKey = 'Default mapping';

    // if the default mapping added to refs from implicitInvertedMapping, update it to the default mapping key
    if (~defaultRefIdx) {
      refs[defaultRefIdx] = {
        $ref: discriminator.defaultMapping,
        name: defaultMappingKey,
        isDefaultMapping: true,
      };
    } else {
      refs.push({
        $ref: discriminator.defaultMapping,
        name: defaultMappingKey,
        isDefaultMapping: true,
      });
    }
  }

  // Make the listing respects the mapping
  // in case a mapping is defined, the user usually wants to have the order shown
  // as it was defined in the yaml. This will sort the names given the provided
  // mapping (if provided).
  // The logic is:
  // - If a name is among the mapping, promote it to first
  // - Names among the mapping are sorted by their order in the mapping
  // - Names outside the mapping are sorted alphabetically
  // - Default mapping is always last
  const names = Object.keys(mapping);
  if (names.length !== 0) {
    refs = refs.sort((left, right) => {
      if (left.isDefaultMapping && !right.isDefaultMapping) {
        return 1;
      }
      if (!left.isDefaultMapping && right.isDefaultMapping) {
        return -1;
      }

      const indexLeft = names.indexOf(left.name);
      const indexRight = names.indexOf(right.name);

      if (indexLeft < 0 && indexRight < 0) {
        // out of mapping, order by name
        return left.name.localeCompare(right.name);
      } else if (indexLeft < 0) {
        // the right is found, so mapping wins
        return 1;
      } else if (indexRight < 0) {
        // left wins as it's in mapping
        return -1;
      } else {
        return indexLeft - indexRight;
      }
    });
  }

  const oneOf = refs.map(({ $ref, name, isDefaultMapping }, index) => {
    const innerSchema = getSchema({
      parser,
      schemaOrRef: { $ref },
      pointer: $ref,
      options,
      isChild: true,
      isDefaultMapping,
      baseRefsStack: refsStack.slice(0, -1),
      deps: {
        ...deps,
        parentFieldFullPath: deps.parentFieldFullPath
          ? deps.parentFieldFullPath + '&d=' + index
          : '&d=' + index.toString(),
      },
      absolutePointer: mergedSchema.absolutePointer,
    });
    innerSchema.title = name;
    return innerSchema;
  });

  return {
    oneOf,
    discriminatorProp,
  };
}

function initOneOf({
  schemaOneOf,
  parser,
  refsStack,
  pointer,
  schema,
  options,
  deps,
}: {
  schemaOneOf: OpenAPISchema[];
  parser: OpenAPIParser;
  pointer: string;
  options: Options;
  refsStack: string[];
  deps: Deps;
  schema: MergedOpenAPISchema;
}): { oneOf?: SchemaModel[]; displayType: string } {
  const oneOf = schemaOneOf.map((variant, idx) => {
    const { resolved: derefVariant, refsStack: derefRefsStack } = parser.deref(
      variant,
      refsStack,
      true,
    );

    const merged = parser.mergeAllOf(derefVariant, pointer + '/oneOf/' + idx, derefRefsStack);

    // try to infer title
    const title =
      isNamedDefinition(variant.$ref) && !merged.title
        ? JsonPointer.baseName(variant.$ref)
        : `${merged.title || ''}${(merged.const && JSON.stringify(merged.const)) || ''}`;

    const resultSchema = getSchema({
      parser,
      // merge base schema into each of oneOf's subschemas
      schemaOrRef: {
        // variant may already have allOf so merge it to not get overwritten
        ...merged,
        title,
        allOf: [{ ...schema, oneOf: undefined, anyOf: undefined }],
        // if specific child schemas are listed in oneOf/anyOf, they are not supposed to be discriminated
        discriminator: derefVariant.allOf ? undefined : merged.discriminator,
      } as OpenAPISchema,
      pointer: variant.$ref || pointer + '/oneOf/' + idx,
      options,
      baseRefsStack: derefRefsStack,
      deps: {
        ...deps,
        parentFieldFullPath: deps.parentFieldFullPath
          ? deps.parentFieldFullPath + '&oneOf=' + idx
          : '&oneOf=' + idx.toString(),
      },
    });

    return resultSchema;
  });

  const displayType = [
    ...new Set(
      oneOf.map((schema) => {
        let name =
          schema.typePrefix +
          (schema.title && !options.hideSchemaTitles
            ? `${schema.title} (${schema.displayType})`
            : schema.displayType);
        if (name.indexOf(' or ') > -1) {
          name = `(${name})`;
        }
        return name;
      }),
    ),
  ].join(' or ');

  return { oneOf, displayType };
}

function initConditionalOperators({
  schema,
  parser,
  pointer,
  options,
  refsStack,
  deps,
}: {
  schema: OpenAPISchema;
  parser: OpenAPIParser;
  pointer: string;
  options: Options;
  refsStack: string[];
  deps: Deps;
}): { oneOf: SchemaModel[]; oneOfType: string } {
  const {
    if: ifOperator,
    else: elseOperator = {},
    then: thenOperator = {},
    ...restSchema
  } = schema;
  const groupedOperators = [
    {
      allOf: [restSchema, thenOperator, ifOperator],
      title: (ifOperator && ifOperator['x-displayName']) || ifOperator?.title || 'case 1',
    },
    {
      allOf: [restSchema, elseOperator],
      title: (elseOperator && elseOperator['x-displayName']) || elseOperator?.title || 'case 2',
    },
  ];

  const oneOf = groupedOperators.map((variant, idx) =>
    getSchema({
      parser,
      schemaOrRef: {
        ...variant,
      } as OpenAPISchema,
      pointer: pointer + '/oneOf/' + idx,
      options,
      baseRefsStack: refsStack,
      deps: {
        ...deps,
        parentFieldFullPath: deps.parentFieldFullPath
          ? deps.parentFieldFullPath + '&oneOf=' + idx
          : '&oneOf=' + idx.toString(),
      },
    }),
  );
  const oneOfType = 'One of';
  return { oneOf, oneOfType };
}

function normalizeField(
  field: OpenAPISchema | null,
  fieldName: string,
  $ref: string,
): OpenAPISchema {
  if (field) {
    return field;
  }

  console.warn(
    `Field "${fieldName}" is invalid, skipping.\n Field must be an object but got ${typeof field} at "${$ref}"`,
  );
  return {};
}

function buildFields(
  parser: OpenAPIParser,
  schema: MergedOpenAPISchema,
  $ref: string,
  options: Options,
  refsStack: string[],
  deps: Deps,
): FieldModel[] {
  let props =
    schema.properties ||
    (hasType(schema as any, 'array') ? schema.prefixItems || schema.items : undefined) ||
    {};

  const patternProps = schema.patternProperties || {};
  // TODO: if schema has $ref and allOf,anyOf,oneOf,if,then,else, ignore schema.additionalProperties
  const additionalProps = schema.additionalProperties || schema.unevaluatedProperties;
  const itemsProps = schema.prefixItems ? schema.items : schema.additionalItems;
  const defaults = schema.default || {};
  let fields = Object.keys(props).map((fieldName) => {
    const field = normalizeField(props[fieldName], fieldName, $ref);

    const required =
      schema.required === undefined ? false : schema.required.indexOf(fieldName) > -1;

    return getField(
      parser,
      {
        name: schema.properties ? fieldName : `[${fieldName}]`,
        required,
        schema: {
          ...field,
          example: schema.example?.[fieldName] || field.example,
          default: field.default === undefined && defaults ? defaults[fieldName] : field.default,
        },
      },
      $ref + '/properties/' + fieldName,
      options,
      deps,
      refsStack,
      JsonPointer.join(schema.absolutePointer || '', ['properties', fieldName]),
    );
  });

  if (options.sortRequiredPropsFirst) {
    fields = sortByRequired(fields, schema.required);
  }

  fields.push(
    ...Object.keys(patternProps).map((fieldName) => {
      const field = normalizeField(patternProps[fieldName], fieldName, $ref);

      return getField(
        parser,
        {
          name: fieldName,
          required: false,
          schema: field,
          kind: 'patternProperties',
        },
        `${$ref}/patternProperties/${fieldName}`,
        options,
        deps,
        refsStack,
      );
    }),
  );

  if (isObject(additionalProps) || additionalProps === true) {
    fields.push(
      getField(
        parser,
        {
          name: (isObject(additionalProps)
            ? additionalProps['x-additionalPropertiesName'] || 'property name'
            : 'property name'
          ).concat('*'),
          required: false,
          schema: additionalProps === true ? {} : additionalProps,
          kind: 'additionalProperties',
        },
        $ref + '/additionalProperties',
        options,
        deps,
        refsStack,
        JsonPointer.join(schema.absolutePointer || '', ['additionalProperties']),
      ),
    );
  }

  fields.push(
    ...buildAdditionalItems({
      parser,
      schema: itemsProps,
      fieldsCount: fields.length,
      $ref,
      options,
      refsStack,
      deps,
    }),
  );

  return sortByDeprecated(fields);
}

function buildAdditionalItems({
  parser,
  schema = false,
  fieldsCount,
  $ref,
  options,
  refsStack,
  deps,
}: {
  parser: OpenAPIParser;
  schema?: OpenAPISchema | OpenAPISchema[] | boolean;
  fieldsCount: number;
  $ref: string;
  options: Options;
  refsStack?: string[];
  deps: Deps;
}) {
  if (typeof schema === 'boolean') {
    return schema
      ? [
          getField(
            parser,
            {
              name: `[${fieldsCount}...]`,
              schema: {},
              kind: 'additionalItems',
            },
            `${$ref}/additionalItems`,
            options,
            deps,
            refsStack,
          ),
        ]
      : [];
  }

  if (Array.isArray(schema)) {
    return [
      ...schema.map((field, idx) =>
        getField(
          parser,
          {
            name: `[${fieldsCount + idx}]`,
            schema: field,
            kind: 'additionalItems',
          },
          `${$ref}/additionalItems/${idx}`,
          options,
          deps,
          refsStack,
        ),
      ),
    ];
  }

  if (isObject(schema)) {
    return [
      getField(
        parser,
        {
          name: `[${fieldsCount}...]`,
          schema: schema,
          kind: 'additionalItems',
        },
        `${$ref}/additionalItems`,
        options,
        deps,
        refsStack,
      ),
    ];
  }

  return [];
}

function getDiscriminator(schema: OpenAPISchema): OpenAPISchema['discriminator'] {
  return schema.discriminator || schema['x-discriminator'];
}

function hasType(schema: SchemaModel, type: string): boolean {
  return schema.type === type || (Array.isArray(schema.type) && schema.type.includes(type));
}

function hasArrayItems(schema: OpenAPISchema): boolean {
  return Boolean(Array.isArray(schema.items) || Array.isArray(schema.prefixItems));
}
