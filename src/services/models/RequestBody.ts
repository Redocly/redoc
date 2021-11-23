import { OpenAPIRequestBody, Referenced } from '../../types';

import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { MediaContentModel } from './MediaContent';

type RequestBodyProps = {
  parser: OpenAPIParser;
  infoOrRef: Referenced<OpenAPIRequestBody>;
  options: RedocNormalizedOptions;
  isEvent: boolean;
};

export class RequestBodyModel {
  description: string;
  required: boolean;
  content?: MediaContentModel;

  constructor(props: RequestBodyProps) {
    const { parser, infoOrRef, options, isEvent } = props;
    const isRequest = isEvent ? false : true;
    const info = parser.deref(infoOrRef);
    this.description = info.description || '';
    this.required = !!info.required;
    parser.exitRef(infoOrRef);
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, isRequest, options);
    }
  }
}
