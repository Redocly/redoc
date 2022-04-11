import { action, observable, makeObservable } from 'mobx';

import { OpenAPICallback, Referenced } from '../../types';
import { isOperationName, JsonPointer } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { OperationModel } from './Operation';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

export class CallbackModel {
  @observable
  expanded: boolean = false;

  name: string;
  operations: OperationModel[] = [];

  constructor(
    parser: OpenAPIParser,
    name: string,
    infoOrRef: Referenced<OpenAPICallback>,
    pointer: string,
    options: RedocNormalizedOptions,
  ) {
    makeObservable(this);

    this.name = name;
    const paths = parser.deref<OpenAPICallback>(infoOrRef);
    parser.exitRef(infoOrRef);

    for (const pathName of Object.keys(paths)) {
      const path = paths[pathName];
      const operations = Object.keys(path).filter(isOperationName);
      for (const operationName of operations) {
        const operationInfo = path[operationName];

        const operation = new OperationModel(
          parser,
          {
            ...operationInfo,
            pathName,
            pointer: JsonPointer.compile([pointer, name, pathName, operationName]),
            httpVerb: operationName,
            pathParameters: path.parameters || [],
            pathServers: path.servers,
          },
          undefined,
          options,
          true,
        );

        this.operations.push(operation);
      }
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
