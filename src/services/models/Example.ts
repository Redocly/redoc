import { Referenced, OpenAPIExample } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';

export class ExampleModel {
  value: any;
  summary?: string;
  description?: string;
  externalValue?: string;

  constructor(parser: OpenAPIParser, infoOrRef: Referenced<OpenAPIExample>) {
    Object.assign(this, parser.deref(infoOrRef));
    parser.exitRef(infoOrRef);
  }
}
