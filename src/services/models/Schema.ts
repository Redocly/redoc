import { action, observable } from 'mobx';

import { OpenAPIExternalDocumentation, OpenAPISchema, Referenced } from '../../types';

import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';

import { MergedOpenAPISchema } from '../';
import {
  detectType,
  extractExtensions,
  humanizeConstraints,
  isNamedDefinition,
  isPrimitiveType,
  JsonPointer,
  sortByField,
  sortByRequired,
} from '../../utils/';

// TODO: refactor this model, maybe use getters instead of copying all the values
export class SchemaModel {
  pointer: string;

  type: string;
  displayType: string;
  typePrefix: string = '';
  title: string;
  description: string;
  externalDocs?: OpenAPIExternalDocumentation;

  isPrimitive: boolean;
  isCircular: boolean = false;

  format?: string;
  displayFormat?: string;
  nullable: boolean;
  deprecated: boolean;
  pattern?: string;
  example?: any;
  enum: any[];
  default?: any;
  readOnly: boolean;
  writeOnly: boolean;

  constraints: string[];

  fields?: FieldModel[];
  items?: SchemaModel;

  oneOf?: SchemaModel[];
  oneOfType: string;
  discriminatorProp: string;
  @observable
  activeOneOf: number = 0;

  rawSchema: OpenAPISchema;
  schema: MergedOpenAPISchema;
  extensions?: Dict<any>;

  /**
   * @param isChild if schema discriminator Child
   * When true forces dereferencing in allOfs even if circular
   */
  constructor(
    parser: OpenAPIParser,
    schemaOrRef: Referenced<OpenAPISchema>,
    pointer: string,
    private options: RedocNormalizedOptions,
    isChild: boolean = false,
  ) {
    this.pointer = schemaOrRef.$ref || pointer || '';
    this.rawSchema = parser.deref(schemaOrRef);
    this.schema = parser.mergeAllOf(this.rawSchema, this.pointer, isChild);
    this.init(parser, isChild);

    parser.exitRef(schemaOrRef);

    for (const parent$ref of this.schema.parentRefs || []) {
      // exit all the refs visited during allOf traverse
      parser.exitRef({ $ref: parent$ref });
    }

    if (options.showExtensions) {
      this.extensions = extractExtensions(this.schema, options.showExtensions);
    }
  }

  /**
   * Set specified alternative schema as active
   * @param idx oneOf index
   */
  @action
  activateOneOf(idx: number) {
    this.activeOneOf = idx;
  }

  init(parser: OpenAPIParser, isChild: boolean) {
    const schema = this.schema;
    this.isCircular = schema['x-circular-ref'];

    this.title =
      schema.title || (isNamedDefinition(this.pointer) && JsonPointer.baseName(this.pointer)) || '';
    this.description = schema.description || '';
    this.type = schema.type || detectType(schema);
    this.format = schema.format;
    this.nullable = !!schema.nullable;
    this.enum = schema.enum || [];
    this.example = schema.example;
    this.deprecated = !!schema.deprecated;
    this.pattern = schema.pattern;
    this.externalDocs = schema.externalDocs;

    this.constraints = humanizeConstraints(schema);
    this.displayType = this.type;
    this.displayFormat = this.format;
    this.isPrimitive = isPrimitiveType(schema, this.type);
    this.default = schema.default;
    this.readOnly = !!schema.readOnly;
    this.writeOnly = !!schema.writeOnly;

    if (this.isCircular) {
      return;
    }

    if (!isChild && getDiscriminator(schema) !== undefined) {
      this.initDiscriminator(schema, parser);
      return;
    }

    if (schema.oneOf !== undefined) {
      this.initOneOf(schema.oneOf, parser);
      this.oneOfType = 'One of';
      if (schema.anyOf !== undefined) {
        console.warn(
          `oneOf and anyOf are not supported on the same level. Skipping anyOf at ${this.pointer}`,
        );
      }
      return;
    }

    if (schema.anyOf !== undefined) {
      this.initOneOf(schema.anyOf, parser);
      this.oneOfType = 'Any of';
      return;
    }

    if (this.type === 'object') {
      this.fields = buildFields(parser, schema, this.pointer, this.options);
    } else if (this.type === 'array' && schema.items) {
      this.items = new SchemaModel(parser, schema.items, this.pointer + '/items', this.options);
      this.displayType = this.items.displayType;
      this.displayFormat = this.items.format;
      this.typePrefix = this.items.typePrefix + 'Array of ';
      this.title = this.title || this.items.title;
      this.isPrimitive = this.items.isPrimitive;
      if (this.example === undefined && this.items.example !== undefined) {
        this.example = [this.items.example];
      }
      if (this.items.isPrimitive) {
        this.enum = this.items.enum;
      }
    }
  }

  private initOneOf(oneOf: OpenAPISchema[], parser: OpenAPIParser) {
    this.oneOf = oneOf!.map(
      (variant, idx) =>
        new SchemaModel(
          parser,
          // merge base schema into each of oneOf's subschemas
          {
            // variant may already have allOf so merge it to not get overwritten
            ...parser.mergeAllOf(variant, this.pointer + '/oneOf/' + idx),
            allOf: [{ ...this.schema, oneOf: undefined, anyOf: undefined }],
          } as OpenAPISchema,
          this.pointer + '/oneOf/' + idx,
          this.options,
        ),
    );
    this.displayType = this.oneOf
      .map(schema => {
        let name =
          schema.typePrefix +
          (schema.title ? `${schema.title} (${schema.displayType})` : schema.displayType);
        if (name.indexOf(' or ') > -1) {
          name = `(${name})`;
        }
        return name;
      })
      .join(' or ');
  }

  private initDiscriminator(
    schema: OpenAPISchema & {
      parentRefs?: string[];
    },
    parser: OpenAPIParser,
  ) {
    const discriminator = getDiscriminator(schema)!;
    this.discriminatorProp = discriminator.propertyName;
    const derived = parser.findDerived([...(schema.parentRefs || []), this.pointer]);

    if (schema.oneOf) {
      for (const variant of schema.oneOf) {
        if (variant.$ref === undefined) {
          continue;
        }
        const name = JsonPointer.dirName(variant.$ref);
        derived[variant.$ref] = name;
      }
    }

    const mapping = discriminator.mapping || {};
    for (const name in mapping) {
      derived[mapping[name]] = name;
    }

    const refs = Object.keys(derived);
    this.oneOf = refs.map(ref => {
      const innerSchema = new SchemaModel(parser, parser.byRef(ref)!, ref, this.options, true);
      innerSchema.title = derived[ref];
      return innerSchema;
    });
  }
}

function buildFields(
  parser: OpenAPIParser,
  schema: OpenAPISchema,
  $ref: string,
  options: RedocNormalizedOptions,
): FieldModel[] {
  const props = schema.properties || {};
  const additionalProps = schema.additionalProperties;
  const defaults = schema.default || {};
  const fields = Object.keys(props || []).map(fieldName => {
    let field = props[fieldName];

    if (!field) {
      console.warn(
        `Field "${fieldName}" is invalid, skipping.\n Field must be an object but got ${typeof field} at "${$ref}"`,
      );
      field = {};
    }

    const required =
      schema.required === undefined ? false : schema.required.indexOf(fieldName) > -1;

    return new FieldModel(
      parser,
      {
        name: fieldName,
        required,
        schema: {
          ...field,
          default: field.default === undefined ? defaults[fieldName] : field.default,
        },
      },
      $ref + '/properties/' + fieldName,
      options,
    );
  });

  if (options.sortPropsAlphabetically) {
    sortByField(fields, 'name');
  }
  if (options.requiredPropsFirst) {
    // if not sort alphabetically sort in the order from required keyword
    sortByRequired(fields, !options.sortPropsAlphabetically ? schema.required : undefined);
  }

  if (typeof additionalProps === 'object' || additionalProps === true) {
    fields.push(
      new FieldModel(
        parser,
        {
          name: 'property name *',
          required: false,
          schema: additionalProps === true ? {} : additionalProps,
          kind: 'additionalProperties',
        },
        $ref + '/additionalProperties',
        options,
      ),
    );
  }

  return fields;
}

function getDiscriminator(schema: OpenAPISchema): OpenAPISchema['discriminator'] {
  return schema.discriminator || schema['x-discriminator'];
}
