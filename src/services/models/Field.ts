import { action, observable } from 'mobx';

import { OpenAPIParameter, Referenced } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import { OpenAPIParser } from '../OpenAPIParser';
import { SchemaModel } from './Schema';

/**
 * Field or Parameter model ready to be used by components
 */
export class FieldModel {
  @observable expanded: boolean = false;

  schema: SchemaModel;
  name: string;
  required: boolean;
  description: string;
  example?: string;
  deprecated: boolean;
  in?: string;
  kind: string;

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

    this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;
    parser.exitRef(infoOrRef);
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
