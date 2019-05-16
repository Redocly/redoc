import { action, observable } from 'mobx';

import {
  OpenAPIParameter,
  OpenAPIParameterLocation,
  OpenAPIParameterStyle,
  Referenced,
} from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import { extractExtensions } from '../../utils/openapi';
import { OpenAPIParser } from '../OpenAPIParser';
import { SchemaModel } from './Schema';

function getDefaultStyleValue(parameterLocation: OpenAPIParameterLocation): OpenAPIParameterStyle {
  switch (parameterLocation) {
    case 'header':
      return 'simple';
    case 'query':
      return 'form';
    case 'path':
      return 'simple';
    default:
      return 'form';
  }
}

/**
 * Field or Parameter model ready to be used by components
 */
export class FieldModel {
  @observable
  expanded: boolean = false;

  schema: SchemaModel;
  name: string;
  required: boolean;
  description: string;
  example?: string;
  deprecated: boolean;
  in?: OpenAPIParameterLocation;
  kind: string;
  extensions?: Dict<any>;
  explode: boolean;
  style?: OpenAPIParameterStyle;

  constructor(
    parser: OpenAPIParser,
    infoOrRef: Referenced<OpenAPIParameter> & { name?: string; kind?: string },
    pointer: string,
    options: RedocNormalizedOptions,
  ) {
    const info = parser.deref<OpenAPIParameter>(infoOrRef);
    this.kind = infoOrRef.kind || 'field';
    this.name = infoOrRef.name || info.name;
    this.in = info.in;
    this.required = !!info.required;
    this.schema = new SchemaModel(parser, info.schema || {}, pointer, options);
    this.description =
      info.description === undefined ? this.schema.description || '' : info.description;
    this.example = info.example || this.schema.example;

    if (info.style) {
      this.style = info.style;
    } else if (this.in) {
      this.style = getDefaultStyleValue(this.in);
    }

    this.explode = !!info.explode;

    this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;
    parser.exitRef(infoOrRef);

    if (options.showExtensions) {
      this.extensions = extractExtensions(info, options.showExtensions);
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
