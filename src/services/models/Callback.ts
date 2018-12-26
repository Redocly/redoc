import { action, observable } from 'mobx';
import { OpenAPICallback, Referenced } from '../../types';
import { isOperationName } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { OperationModel } from './Operation';

export class CallbackModel {
  @observable
  expanded: boolean;
  name: string;
  paths: Referenced<OpenAPICallback>;
  operations: OperationModel[] = [];

  constructor(
    parser: OpenAPIParser,
    name: string,
    infoOrRef: Referenced<OpenAPICallback>,
    options,
  ) {
    this.name = name;
    this.paths = parser.deref(infoOrRef);
    parser.exitRef(infoOrRef);

    for (const pathName of Object.keys(this.paths)) {
      const path = this.paths[pathName];
      const operations = Object.keys(path).filter(isOperationName);
      for (const operationName of operations) {
        const operationInfo = path[operationName];

        const operation = new OperationModel(
          parser,
          {
            ...operationInfo,
            pathName,
            httpVerb: operationName,
            pathParameters: path.parameters || [],
          },
          undefined,
          options,
        );

        this.operations.push(operation);
      }
    }

    console.log(this.operations);
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
