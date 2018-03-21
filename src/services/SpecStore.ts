import { computed, observable } from 'mobx';
import { OpenAPISpec } from '../types';

// import { OpenAPIExternalDocumentation, OpenAPIInfo } from '../types';

import { MenuBuilder } from './MenuBuilder';
import { ApiInfoModel } from './models/ApiInfo';
import { SecuritySchemesModel } from './models/SecuritySchemes';
import { OpenAPIParser } from './OpenAPIParser';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
/**
 * Store that containts all the specification related information in the form of tree
 */
export class SpecStore {
  @observable.ref parser: OpenAPIParser;

  constructor(
    spec: OpenAPISpec,
    specUrl: string | undefined,
    private options: RedocNormalizedOptions,
  ) {
    this.parser = new OpenAPIParser(spec, specUrl, options);
  }

  @computed
  get info(): ApiInfoModel {
    return new ApiInfoModel(this.parser, this.options);
  }

  @computed
  get externalDocs() {
    return this.parser.spec.externalDocs;
  }

  @computed
  get operationGroups() {
    return MenuBuilder.buildStructure(this.parser, this.options);
  }

  @computed
  get securitySchemes() {
    const schemes = this.parser.spec.components && this.parser.spec.components.securitySchemes;
    return schemes && new SecuritySchemesModel(this.parser);
  }
}
