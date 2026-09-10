import { action, observable, makeObservable } from 'mobx';

import type {
  OpenAPIParameter,
  OpenAPIParameterLocation,
  OpenAPIParameterStyle,
  Referenced,
} from '../../types';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import { extractExtensions } from '../../utils/openapi';
import type { OpenAPIParser } from '../OpenAPIParser';
import { SchemaModel } from './Schema';
import { ExampleModel } from './Example';
import { isArray, mapValues } from '../../utils/helpers';

const DEFAULT_SERIALIZATION: Record<
  OpenAPIParameterLocation,
  { explode: boolean; style: OpenAPIParameterStyle }
> = {
  path: {
    style: 'simple',
    explode: false,
  },
  query: {
    style: 'form',
    explode: true,
  },
  header: {
    style: 'simple',
    explode: false,
  },
  cookie: {
    style: 'form',
    explode: true,
  },
};

/**
 * Field or Parameter model ready to be used by components
 */
export class FieldModel {
  @observable
  expanded: boolean | undefined = undefined;

  schema: SchemaModel;
  name: string;
  required: boolean;
  description: string;
  example?: string;
  examples?: Record<string, ExampleModel> | any[];
  deprecated: boolean;
  in?: OpenAPIParameterLocation;
  kind: string;
  extensions?: Record<string, any>;
  explode: boolean;
  style?: OpenAPIParameterStyle;
  const?: any;

  serializationMime?: string;

  constructor(
    parser: OpenAPIParser,
    infoOrRef: Referenced<OpenAPIParameter> & { name?: string; kind?: string },
    pointer: string,
    options: RedocNormalizedOptions,
    refsStack?: string[],
  ) {
    makeObservable(this);

    const { resolved: info } = parser.deref<OpenAPIParameter>(infoOrRef);
    this.kind = infoOrRef.kind || 'field';
    this.name = infoOrRef.name || info.name;
    this.in = info.in;
    this.required = !!info.required;

    let fieldSchema = info.schema;
    let serializationMime = '';
    if (!fieldSchema && info.in && info.content) {
      serializationMime = Object.keys(info.content)[0];
      fieldSchema = info.content[serializationMime] && info.content[serializationMime].schema;
    }

    this.schema = new SchemaModel(parser, fieldSchema || {}, pointer, options, false, refsStack);
    this.description =
      info.description === undefined ? this.schema.description || '' : info.description;

    /*
    Merge the description on the field/property itself, with the description of the model/schema - this
    helps where a model is reused more than once, and each field gives added context to its use.

    It requires `refSiblings: "preserve"` when parsing swagger using `convertSwagger2OpenAPI`.

    There is a similar test in `src\utils\loadAndBundleSpec.ts` called
    "should override description from $ref of the referenced component, when sibling description exists"
    which tests a similar behaviour from the `src\services\__tests__\fixtures\siblingRefDescription.json` file.
    However, that test is for open-api 3.1.0, where is this applies to the process of converting swagger 2.0
    file to open-api.
    */
    if (fieldSchema?.description) {
      /*
      2 options here, either:
        a) Use the `fieldSchema.description` verbatim if it's defined, or
        b) Concatenate the field description with the schema description.
           However, option b might be considered unintended behaviour.

      Should this be an option in `RedocNormalizedOptions`?
      */

      // option a)
      this.description = fieldSchema.description;

      /*
      // option b)
      if (this.description.includes(fieldSchema.description)) {
        // already found inside the current description, so avoid a duplication of content - no change.
      } else if (!this.description || fieldSchema.description.includes(this.description)) {
        // the current description already contains the fields description, so prefer the field version only.
        this.description = fieldSchema.description;
      } else {
        // otherwise, concatenate them - either "\r\n\r\n" for a markdown paragraph, or "  \r\n" for a
        // markdown line break. Safest approach is just add a bit of whitespace, as we can't be sure of what
        // other formatting might be in place in either description.
        this.description = fieldSchema.description + '\r\n\r\n' + this.description;
      }
      */
    }

    this.example = info.example || this.schema.example;

    if (info.examples !== undefined || this.schema.examples !== undefined) {
      const exampleValue = info.examples || this.schema.examples;
      this.examples = isArray(exampleValue)
        ? exampleValue
        : mapValues(
            exampleValue!,
            (example, name) => new ExampleModel(parser, example, name, info.encoding),
          );
    }

    if (serializationMime) {
      this.serializationMime = serializationMime;
    } else if (info.style) {
      this.style = info.style;
    } else if (this.in) {
      this.style = DEFAULT_SERIALIZATION[this.in]?.style ?? 'form'; // fallback to from in case "in" is invalid
    }

    if (info.explode === undefined && this.in) {
      this.explode = DEFAULT_SERIALIZATION[this.in]?.explode ?? true;
    } else {
      this.explode = !!info.explode;
    }

    this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;

    if (options.showExtensions) {
      this.extensions = extractExtensions(info, options.showExtensions);
    }

    this.const = this.schema?.const || info?.const || '';
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }

  @action
  collapse(): void {
    this.expanded = false;
  }

  @action
  expand(): void {
    this.expanded = true;
  }
}
