import type { Options, OpenAPIParser } from '../services/index.js';
import type { OpenAPICallback, Referenced } from '../types/index.js';
import type { CallbackModel, OperationModel, GroupModel } from './types.js';

import { isOperationName, JsonPointer } from '../utils/index.js';
import { getOperation } from './operation.js';
import { joinWithSeparator } from '../services/index.js';

export function getCallback(
  parser: OpenAPIParser,
  name: string,
  infoOrRef: Referenced<OpenAPICallback>,
  parentPointer: string,
  options: Options,
  href: string,
  parent?: GroupModel,
): CallbackModel {
  const { resolved: paths } = parser.deref<OpenAPICallback>(infoOrRef);

  const operations: OperationModel[] = [];
  for (const pathName of Object.keys(paths)) {
    const path = paths[pathName];
    const operationNames = Object.keys(path).filter(isOperationName);
    for (const operationName of operationNames) {
      const operationInfo = path[operationName];

      const operation = getOperation(
        parser,
        {
          ...operationInfo,
          pathName,
          pointer: JsonPointer.join(parentPointer, ['callbacks', name, operationName]),
          httpVerb: operationName,
          pathParameters: path.parameters || [],
          pathServers: path.servers,
        },
        parent,
        options,
        href,
        {
          isCallback: true,
          id: joinWithSeparator(name, operationName),
        },
      );

      operations.push(operation);
    }
  }
  return { name, operations };
}
