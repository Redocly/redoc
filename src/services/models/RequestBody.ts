import { OpenAPIRequestBody, Referenced } from '../../types';

import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { MediaContentModel } from './MediaContent';
import { getContentWithLegacyExamples } from '../../utils';

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

  constructor({ parser, infoOrRef, options, isEvent }: RequestBodyProps) {
    const isRequest = !isEvent;
    const info = parser.deref(infoOrRef);
    this.description = info.description || '';
    this.required = !!info.required;
    parser.exitRef(infoOrRef);

    const mediaContent = getContentWithLegacyExamples(info);
    if (mediaContent !== undefined) {
      this.content = new MediaContentModel(parser, mediaContent, isRequest, options);
    }
  }
}
