import {
  OpenAPIExternalDocumentation,
  OpenAPIPath,
  OpenAPIServer,
  OpenAPISpec,
  Referenced,
} from '../types';

import { ContentItemModel, MenuBuilder } from './MenuBuilder';
import { ApiInfoModel } from './models/ApiInfo';
import { WebhookModel } from './models/Webhook';
import { SecuritySchemesModel } from './models/SecuritySchemes';
import { OpenAPIParser } from './OpenAPIParser';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
import { action, computed, observable, makeObservable } from 'mobx';
/**
 * Store that contains all the specification related information in the form of tree
 */
export class SpecStore {
  parser: OpenAPIParser;

  info: ApiInfoModel;
  externalDocs?: OpenAPIExternalDocumentation;
  contentItems: ContentItemModel[];
  securitySchemes: SecuritySchemesModel;
  webhooks?: WebhookModel;

  @observable
  selectedServerIndex: number;

  servers: OpenAPIServer[];

  constructor(
    spec: OpenAPISpec,
    specUrl: string | undefined,
    private options: RedocNormalizedOptions,
  ) {
    makeObservable(this);

    this.parser = new OpenAPIParser(spec, specUrl, options);
    this.info = new ApiInfoModel(this.parser);
    this.externalDocs = this.parser.spec.externalDocs;
    this.contentItems = MenuBuilder.buildStructure(this.parser, this.options);
    this.securitySchemes = new SecuritySchemesModel(this.parser);
    const webhookPath: Referenced<OpenAPIPath> = {
      ...this.parser?.spec?.['x-webhooks'],
      ...this.parser?.spec.webhooks,
    };
    this.webhooks = new WebhookModel(this.parser, options, webhookPath);

    this.servers = spec.servers || [];
    this.selectedServerIndex = this.getInitialServerIndex();
  }

  @action
  setSelectedServerIndex = (index: number) => {
    this.selectedServerIndex = index;
  };

  @computed
  get selectedServerUrl() {
    return this.servers[this.selectedServerIndex].url;
  }

  getInitialServerIndex = () => {
    return this.options.tryLiveAccessToken
      ? this.options.tryLiveSandboxServerIndex === 0
        ? 1
        : 0
      : this.options.tryLiveSandboxServerIndex;
  };
}
