import { OpenAPIRequestBody, Referenced } from '../../types';

import { MediaContentModel } from './MediaContent';
import { OpenAPIParser } from '../OpenAPIParser';

export class RequestBodyModel {
  description: string;
  required: boolean;
  content?: MediaContentModel;

  constructor(parser: OpenAPIParser, infoOrRef: Referenced<OpenAPIRequestBody>) {
    const info = parser.deref(infoOrRef);
    this.description = info.description || '';
    this.required = !!info.required;
    parser.exitRef(infoOrRef);
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, true);
    }
  }
}
