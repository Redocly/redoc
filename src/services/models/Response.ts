import { action, observable, makeObservable } from 'mobx';

import type { OpenAPIResponse, Referenced } from '../../types';

import { getStatusCodeType, extractExtensions } from '../../utils';
import type { OpenAPIParser } from '../OpenAPIParser';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';

type ResponseProps = {
  parser: OpenAPIParser;
  code: string;
  defaultAsError: boolean;
  infoOrRef: Referenced<OpenAPIResponse>;
  options: RedocNormalizedOptions;
  isEvent: boolean;
};

export class ResponseModel {
  @observable
  expanded: boolean = false;

  content?: MediaContentModel;
  code: string;
  summary: string;
  description: string;
  type: string;
  headers: FieldModel[] = [];
  extensions: Record<string, any>;

  constructor({
    parser,
    code,
    defaultAsError,
    infoOrRef,
    options,
    isEvent: isRequest,
  }: ResponseProps) {
    makeObservable(this);

    this.expanded = options.expandResponses === 'all' || options.expandResponses[code];

    const { resolved: info } = parser.deref(infoOrRef);
    this.code = code;
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, isRequest, options);
    }

    if (info['x-summary'] !== undefined) {
      this.summary = info['x-summary'];
      this.description = info.description || '';
    } else {
      this.summary = info.description || '';
      this.description = '';
    }

    this.type = getStatusCodeType(code, defaultAsError);

    const headers = info.headers;
    if (headers !== undefined) {
      this.headers = Object.keys(headers).map(name => {
        const header = headers[name];
        return new FieldModel(parser, { ...header, name }, '', options);
      });
    }

    if (options.showExtensions) {
      this.extensions = extractExtensions(info, options.showExtensions);
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
