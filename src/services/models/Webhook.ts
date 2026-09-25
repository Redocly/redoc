import type { OpenAPIPath, Referenced } from '../../types';
import type { OpenAPIParser } from '../OpenAPIParser';
import { OperationModel } from './Operation';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { getPathOperations, JsonPointer } from '../..';

export class WebhookModel {
  operations: OperationModel[] = [];

  constructor(
    parser: OpenAPIParser,
    options: RedocNormalizedOptions,
    infoOrRef?: Referenced<OpenAPIPath>,
  ) {
    const { resolved: webhooks } = parser.deref<OpenAPIPath>(infoOrRef || {});
    this.initWebhooks(parser, webhooks, options);
  }

  initWebhooks(parser: OpenAPIParser, webhooks: OpenAPIPath, options: RedocNormalizedOptions) {
    for (const webhookName of Object.keys(webhooks)) {
      const webhook = webhooks[webhookName];
      if (webhook.$ref) {
        const resolvedWebhook = parser.deref<OpenAPIPath>(webhook || {});
        this.initWebhooks(parser, { [webhookName]: resolvedWebhook }, options);
        continue;
      }

      for (const { operationName, operation: operationInfo, pointerPath } of getPathOperations(
        webhook,
      )) {
        const operation = new OperationModel(
          parser,
          {
            ...operationInfo,
            pathName: webhookName,
            pointer: JsonPointer.compile(['webhooks', webhookName, ...pointerPath]),
            httpVerb: operationName,
            pathParameters: webhook.parameters || [],
            pathServers: webhook.servers,
            isWebhook: true,
          },
          undefined,
          options,
          false,
        );

        this.operations.push(operation);
      }
    }
  }
}
