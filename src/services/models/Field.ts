import { observable, action } from 'mobx';

import { OpenAPIParameter, Referenced } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import { SchemaModel } from './Schema';
import { OpenAPIParser } from '../OpenAPIParser';

/**
 * Field or Parameter model ready to be used by components
 */
export class FieldModel {
  @observable public expanded: boolean = false;

  public schema: SchemaModel;
  public name: string;
  public required: boolean;
  public description: string;
  public example?: string;
  public deprecated: boolean;
  public in?: string;

  constructor(
    parser: OpenAPIParser,
    infoOrRef: Referenced<OpenAPIParameter>,
    pointer: string,
    options: RedocNormalizedOptions,
  ) {
    const info = parser.deref(infoOrRef);

    this.name = info.name;
    this.in = info.in;
    this.required = !!info.required;
    const schemaPointer = (parser.isRef(infoOrRef) ? infoOrRef.$ref : pointer) + '/schema';
    this.schema = new SchemaModel(parser, info.schema || {}, schemaPointer, options);
    this.description =
      info.description === undefined ? this.schema.description || '' : info.description;
    const example = info.example || this.schema.example;
    this.example = example && JSON.stringify(example);

    this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;
    parser.exitRef(infoOrRef);
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
