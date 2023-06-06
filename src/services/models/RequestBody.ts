import type { OpenAPIRequestBody, Referenced } from '../../types';

import type { OpenAPIParser } from '../OpenAPIParser';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
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
  required?: boolean;
  content?: MediaContentModel;

  constructor({ parser, infoOrRef, options, isEvent }: RequestBodyProps) {
    const isRequest = !isEvent;
    const { resolved: info } = parser.deref(infoOrRef);
    this.description = info.description || '';
    this.required = info.required;

    const mediaContent = getContentWithLegacyExamples(info);
    if (mediaContent !== undefined) {
      this.content = new MediaContentModel(parser, mediaContent, isRequest, options);
    }
  }
}
