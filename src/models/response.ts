import type { OpenAPIResponse, Referenced } from '../types/index.js';
import type { OpenAPIParser, Options } from '../services/index.js';
import type { ResponseModel, OperationModel } from './types.js';

import {
  getStatusCodeType,
  getContentWithLegacyExamples,
  JsonPointer,
  getValueFromMdParsedExtension,
} from '../utils/index.js';
import { getField } from './field.js';
import { getMediaContent } from './mediaContent.js';

type ResponseProps = {
  parser: OpenAPIParser;
  code: string;
  defaultAsError: boolean;
  infoOrRef: Referenced<OpenAPIResponse>;
  options: Options;
  operation: OperationModel;
  isEvent?: boolean;
};

export function getResponse({
  parser,
  code,
  defaultAsError,
  infoOrRef,
  options,
  isEvent,
  operation,
}: ResponseProps): ResponseModel {
  const isRequestType = !!isEvent;
  const { resolved: info } = parser.deref(infoOrRef);
  const response = { code } as ResponseModel;

  if (info['x-summary'] !== undefined) {
    response.summary = getValueFromMdParsedExtension(info, 'x-summary');
    response.description = getValueFromMdParsedExtension(info, 'description') || '';
  } else {
    response.summary = getValueFromMdParsedExtension(info, 'description') || '';
    response.description = '';
  }

  response.type = getStatusCodeType(code, defaultAsError);

  const infoHeaders = info.headers;
  const absolutePointer =
    infoOrRef['$ref'] || JsonPointer.join(operation?.pointer || '', ['responses', code]);

  if (infoHeaders !== undefined) {
    response.headers = Object.keys(infoHeaders).map((name) => {
      const header = infoHeaders[name];
      return getField(
        parser,
        { ...header, name },
        JsonPointer.join(absolutePointer, ['headers', name]),
        options,
        {
          operation,
          type: 'response',
          response,
        },
      );
    });
  }
  const mediaContent = getContentWithLegacyExamples(info);
  if (mediaContent !== undefined) {
    response.content = getMediaContent({
      parser,
      info: mediaContent,
      isRequestType,
      options,
      data: {
        operation,
        type: 'response',
        response,
        absolutePointer,
      },
    });
  }

  return response;
}
