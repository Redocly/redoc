import { observable, action } from 'mobx';

import { OpenAPIResponse, Referenced } from '../../types';

import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';
import { OpenAPIParser } from '../OpenAPIParser';
import { getStatusCodeType } from '../../utils';

export class ResponseModel {
  @observable public expanded: boolean = false;

  public content?: MediaContentModel;
  public code: string;
  public description: string;
  public type: string;
  public headers: FieldModel[] = [];

  constructor(parser: OpenAPIParser, code: string, infoOrRef: Referenced<OpenAPIResponse>) {
    const info = parser.deref(infoOrRef);
    parser.exitRef(infoOrRef);
    this.code = code;
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, false);
    }
    this.description = info.description || '';
    this.type = getStatusCodeType(code);

    const headers = info.headers;
    if (headers !== undefined) {
      this.headers = Object.keys(headers).map(name => {
        const header = headers[name];
        return new FieldModel(parser, { ...header, name }, '');
      });
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
