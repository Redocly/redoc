import type { OpenAPIPath, Referenced } from '../../types';
import type { OpenAPIParser } from '../OpenAPIParser';
import { OperationModel } from './Operation';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { isOperationName } from '../..';

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
      const operations = Object.keys(webhook).filter(isOperationName);
      for (const operationName of operations) {
        const operationInfo = webhook[operationName];
        if (webhook.$ref) {
          const resolvedWebhook = parser.deref<OpenAPIPath>(webhook || {});
          this.initWebhooks(parser, { [operationName]: resolvedWebhook }, options);
        }

        if (!operationInfo) continue;
        const operation = new OperationModel(
          parser,
          {
            ...operationInfo,
            httpVerb: operationName,
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
