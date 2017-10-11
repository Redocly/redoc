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

  constructor() {
    this.parser = new OpenAPIParser();
  }

  load(specOrUrl: string | object) {
    return this.parser.load(specOrUrl);
  }

  @computed
  get loaded() {
    return this.parser.loaded;
  }

  @computed
  get info() {
    if (!this.parser.loaded) return;
    return new ApiInfoModel(this.parser);
  }

  @computed
  get externalDocs() {
    if (this.parser.loaded) return;
    return this.parser.spec!.externalDocs;
  }

  @computed
  get operationGroups() {
    if (!this.parser.loaded) return [];
    return MenuBuilder.buildStructure(this.parser);
  }

  @computed
  get security() {
    // TODO: implement security
    throw new Error('Not implemented');
  }
}
