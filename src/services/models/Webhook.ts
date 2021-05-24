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
      const operations = Object.keys(webhook);
      for (let operationName of operations) {
        let operationInfo = isOperationName(operationName) && webhook[operationName];

        if (!isOperationName(operationName) && webhook[operationName].$ref) {
          const resolvedOperationInfo = parser.deref<OpenAPIPath>(webhook[operationName] || {})
          operationInfo = resolvedOperationInfo
          operationName = resolvedOperationInfo[Object.keys(resolvedOperationInfo)[0]]
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
