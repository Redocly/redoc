import { OpenAPIPath, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
import { OperationModel } from './Operation';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { isOperationName } from '../..';

export class WebhookModel {
  operations: OperationModel[] = [];

  constructor(
    parser: OpenAPIParser,
    options: RedocNormalizedOptions,
    infoOrRef?: Referenced<OpenAPIPath>,
  ) {
    const webhooks = parser.deref<OpenAPIPath>(infoOrRef || {});
    parser.exitRef(infoOrRef);

    for (const webhookName of Object.keys(webhooks)) {
      const webhook = webhooks[webhookName];
      const operations = Object.keys(webhook).filter(isOperationName);
      for (let operationName of operations) {
        let operationInfo = webhook[operationName];
        if (webhook.$ref) {
          const resolvedWebhook = parser.deref<OpenAPIPath>(webhook || {});
          operationName = Object.keys(resolvedWebhook)[0];
          operationInfo = resolvedWebhook[operationName];
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
