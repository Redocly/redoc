import { OpenAPISpec } from '../types';
import { observable, computed } from 'mobx';

// import { OpenAPIExternalDocumentation, OpenAPIInfo } from '../types';

import { MenuBuilder } from './MenuBuilder';
import { OpenAPIParser } from './OpenAPIParser';
import { ApiInfoModel } from './models/ApiInfo';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
import { SecuritySchemesModel } from './models/SecuritySchemes';
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
    return new ApiInfoModel(this.parser);
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
  get security() {
    const schemes = this.parser.spec.components && this.parser.spec.components.securitySchemes;
    return schemes && new SecuritySchemesModel(this.parser);
  }
}
