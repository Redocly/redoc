import { observable, action } from 'mobx';

import { OpenAPISchema, Referenced } from '../../types';

import { FieldModel } from './Field';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import {
  detectType,
  humanizeConstraints,
  isNamedDefinition,
  isPrimitiveType,
  JsonPointer,
} from '../../utils/';
import { MergedOpenAPISchema } from '../';

// TODO: refactor this model, maybe use getters instead of copying all the values
export class SchemaModel {
  _$ref: string;

  type: string;
  displayType: string;
  typePrefix: string = '';
  title: string;
  description: string;

  isPrimitive: boolean;
  isCircular: boolean = false;

  format?: string;
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
  @observable activeOneOf: number = 0;

  rawSchema: OpenAPISchema;
  schema: MergedOpenAPISchema;

  /**
   * @param isChild if schema discriminator Child
   * When true forces dereferencing in allOfs even if circular
   */
  constructor(
    parser: OpenAPIParser,
    schemaOrRef: Referenced<OpenAPISchema>,
    $ref: string,
    private options: RedocNormalizedOptions,
    isChild: boolean = false,
  ) {
    this._$ref = schemaOrRef.$ref || $ref || '';
    this.rawSchema = parser.deref(schemaOrRef);
    this.schema = parser.mergeAllOf(this.rawSchema, this._$ref, isChild);
    this.init(parser, isChild);

    parser.exitRef(schemaOrRef);

    for (let $ref of this.schema.parentRefs || []) {
      // exit all the refs visited during allOf traverse
      parser.exitRef({ $ref });
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
      schema.title || (isNamedDefinition(this._$ref) && JsonPointer.baseName(this._$ref)) || '';
    this.description = schema.description || '';
    this.type = schema.type || detectType(schema);
    this.format = schema.format;
    this.nullable = !!schema.nullable;
    this.enum = schema.enum || [];
    this.example = schema.example;
    this.deprecated = !!schema.deprecated;
    this.pattern = schema.pattern;

    this.constraints = humanizeConstraints(schema);
    this.displayType = this.type;
    this.isPrimitive = isPrimitiveType(schema);
    this.default = schema.default;
    this.readOnly = !!schema.readOnly;
    this.writeOnly = !!schema.writeOnly;

    if (this.isCircular) {
      return;
    }

    if (!isChild && schema.discriminator !== undefined) {
      this.initDiscriminator(schema, parser);
      return;
    }

    if (schema.oneOf !== undefined) {
      this.initOneOf(schema.oneOf, parser);
      this.oneOfType = 'One of';
      if (schema.anyOf !== undefined) {
        console.warn(
          `oneOf and anyOf are not supported on the same level. Skipping anyOf at ${this._$ref}`,
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
      this.fields = buildFields(parser, schema, this._$ref, this.options);
    } else if (this.type === 'array' && schema.items) {
      this.items = new SchemaModel(parser, schema.items, this._$ref + '/items', this.options);
      this.displayType = this.items.displayType;
      this.typePrefix = this.items.typePrefix + 'Array of ';
      this.isPrimitive = this.items.isPrimitive;
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
          {
            // merge base schema into each of oneOf's subschemas
            allOf: [variant, { ...this.schema, oneOf: undefined, anyOf: undefined }],
          } as OpenAPISchema,
          this._$ref + '/oneOf/' + idx,
          this.options,
        ),
    );
    this.displayType = this.oneOf.map(schema => schema.displayType).join(' or ');
  }

  private initDiscriminator(
    schema: OpenAPISchema & {
      namedParents?: string[];
    },
    parser: OpenAPIParser,
  ) {
    this.discriminatorProp = schema.discriminator!.propertyName;
    const derived = parser.findDerived([...(schema.namedParents || []), this._$ref]);

    if (schema.oneOf) {
      for (let variant of schema.oneOf) {
        if (variant.$ref === undefined) continue;
        const name = JsonPointer.dirName(variant.$ref);
        derived[variant.$ref] = name;
      }
    }

    const mapping = schema.discriminator!.mapping || {};
    for (let name in mapping) {
      derived[mapping[name]] = name;
    }

    const refs = Object.keys(derived);
    this.oneOf = refs.map(ref => {
      const schema = new SchemaModel(parser, parser.byRef(ref)!, ref, this.options, true);
      schema.title = derived[ref];
      return schema;
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
    const required =
      schema.required === undefined ? false : schema.required.indexOf(fieldName) > -1;

    return new FieldModel(
      parser,
      {
        name: fieldName,
        required,
        schema: {
          ...props[fieldName],
          default: props[fieldName].default || defaults[fieldName],
        },
      },
      $ref + '/properties/' + fieldName,
      options,
    );
  });

  if (options.requiredPropsFirst) {
    sortFields(fields, schema.required);
  }

  if (typeof additionalProps === 'object') {
    fields.push(
      new FieldModel(
        parser,
        {
          name: '[property name] *',
          required: false,
          schema: additionalProps,
        },
        $ref + '/additionalProperties',
        options,
      ),
    );
  }

  return fields;
}

function sortFields(fields: FieldModel[], order: string[] = []) {
  fields.sort((a, b) => {
    if (!a.required && b.required) {
      return 1;
    } else if (a.required && !b.required) {
      return -1;
    } else if (a.required && b.required) {
      return order.indexOf(a.name) > order.indexOf(b.name) ? 1 : -1;
    } else {
      return 0;
    }
  });
}
