import type { OpenAPIRequestBody, Referenced } from '../types/index.js';
import type { OpenAPIParser, Options } from '../services/index.js';
import type { MediaContentModel, RequestBodyModel, OperationModel } from './types.js';

import {
  getContentWithLegacyExamples,
  getValueFromMdParsedExtension,
  JsonPointer,
} from '../utils/index.js';
import { getMediaContent } from './mediaContent.js';

type GetRequestBodyInput = {
  parser: OpenAPIParser;
  infoOrRef: Referenced<OpenAPIRequestBody>;
  options: Options;
  isEvent?: boolean;
  operation: OperationModel;
};

export function getRequestBody({
  parser,
  infoOrRef,
  options,
  isEvent,
  operation,
}: GetRequestBodyInput): RequestBodyModel {
  const { resolved: info } = parser.deref(infoOrRef);

  const description = getValueFromMdParsedExtension(info, 'description') || '';
  const required = info.required;
  let content: MediaContentModel | undefined;

  const isRequestType = !isEvent;

  const mediaContent = getContentWithLegacyExamples(info);
  if (mediaContent !== undefined) {
    content = getMediaContent({
      parser,
      info: mediaContent,
      isRequestType,
      options,
      data: {
        operation,
        type: 'request',
        absolutePointer: infoOrRef['$ref'] || JsonPointer.join(operation.pointer, ['requestBody']),
      },
    });
  }

  return { description, required, content };
}
