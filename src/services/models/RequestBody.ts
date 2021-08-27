import { OpenAPIRequestBody, Referenced } from '../../types';

import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { MediaContentModel } from './MediaContent';

export class RequestBodyModel {
  description: string;
  required: boolean;
  content?: MediaContentModel;

  constructor(
    parser: OpenAPIParser,
    infoOrRef: Referenced<OpenAPIRequestBody>,
    options: RedocNormalizedOptions,
  ) {
    const info = parser.deref(infoOrRef);
    this.description = info.description || '';
    this.required = !!info.required;
    parser.exitRef(infoOrRef);
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, true, options);
    }
  }
}
