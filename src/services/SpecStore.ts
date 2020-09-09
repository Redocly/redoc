import { OpenAPIExternalDocumentation, OpenAPISpec } from '../types';

import { ContentItemModel, MenuBuilder } from './MenuBuilder';
import { ApiInfoModel } from './models/ApiInfo';
import { WebhookModel } from './models/Webhook';
import { SecuritySchemesModel } from './models/SecuritySchemes';
import { OpenAPIParser } from './OpenAPIParser';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
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

  constructor(
    spec: OpenAPISpec,
    specUrl: string | undefined,
    private options: RedocNormalizedOptions,
  ) {
    this.parser = new OpenAPIParser(spec, specUrl, options);
    this.info = new ApiInfoModel(this.parser);
    this.externalDocs = this.parser.spec.externalDocs;
    this.contentItems = MenuBuilder.buildStructure(this.parser, this.options);
    this.securitySchemes = new SecuritySchemesModel(this.parser);
    this.webhooks = new WebhookModel(this.parser, options, this.parser.spec['x-webhooks']);
  }
}
