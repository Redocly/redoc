'use strict';

import {Pipe} from 'angular2/core';
import {isString, stringify, isBlank} from 'angular2/src/facade/lang';
import {BaseException} from 'angular2/src/facade/exceptions';
import {JsonPointer} from './JsonPointer';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false
});

class InvalidPipeArgumentException extends BaseException {
  constructor(type, value) {
    super(`Invalid argument '${value}' for pipe '${stringify(type)}'`);
  }
}

@Pipe({ name: 'keys' })
export class KeysPipe {
  transform(value) {
    if (isBlank(value)) return value;
    if (typeof value !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, value);
    }
    return Object.keys(value);
  }
}

@Pipe({ name: 'values' })
export class ValuesPipe {
  transform(value) {
    if (isBlank(value)) return value;
    if (typeof value !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, value);
    }
    return Object.keys(value).map(key => value[key]);
  }
}

@Pipe({ name: 'jsonPointerEscape' })
export class JsonPointerEscapePipe {
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    return JsonPointer.escape(value);
  }
}

@Pipe({ name: 'marked' })
export class MarkedPipe {
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    return `<span class="redoc-markdown-block">${marked(value)}</span>`;
  }
}
