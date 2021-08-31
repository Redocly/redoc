import { action, observable, makeObservable } from 'mobx';

import { OpenAPIResponse, Referenced } from '../../types';

import { getStatusCodeType } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';

type ResponseProps = {
  parser: OpenAPIParser,
  code: string,
  defaultAsError: boolean,
  infoOrRef: Referenced<OpenAPIResponse>,
  options: RedocNormalizedOptions,
  isEvent: boolean,
}

export class ResponseModel {
  @observable
  expanded: boolean = false;

  content?: MediaContentModel;
  code: string;
  summary: string;
  description: string;
  type: string;
  headers: FieldModel[] = [];

  constructor(props: ResponseProps) {
    const { parser, code, defaultAsError, infoOrRef, options, isEvent } = props;
    const isRequest = isEvent ? true : false;
    makeObservable(this);

    this.expanded = options.expandResponses === 'all' || options.expandResponses[code];

    const info = parser.deref(infoOrRef);
    parser.exitRef(infoOrRef);
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
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
