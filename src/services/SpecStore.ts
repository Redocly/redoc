import { OpenAPISpec } from '../types';
import { observable, computed } from 'mobx';

// import { OpenAPIExternalDocumentation, OpenAPIInfo } from '../types';

import { MenuBuilder } from './MenuBuilder';
import { OpenAPIParser } from './OpenAPIParser';
import { ApiInfoModel } from './models/ApiInfo';

/**
 * Store that containts all the specification related information in the form of tree
 */
export class SpecStore {
  @observable.ref parser: OpenAPIParser;

  constructor(spec: OpenAPISpec, specUrl?: string) {
    this.parser = new OpenAPIParser(spec, specUrl);
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
    return MenuBuilder.buildStructure(this.parser);
  }

  @computed
  get security() {
    // TODO: implement security
    throw new Error('Not implemented');
  }
}
