'use strict';

import {Pipe, InvalidPipeArgumentException} from 'angular2/core';
import {isString} from 'angular2/src/facade/lang';
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


@Pipe({ name: 'keys' })
export class KeysPipe {
  transform(obj) {
    if (typeof obj !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, obj);
    }
    return Object.keys(obj);
  }
}

@Pipe({ name: 'values' })
export class ValuesPipe {
  transform(value) {
    if (typeof value !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, value);
    }
    return Object.keys(value).map(key => value[key]);
  }
}

@Pipe({ name: 'jsonPointerEscape' })
export class JsonPointerEscapePipe {
  transform(value) {
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    return JsonPointer.escape(value);
  }
}

@Pipe({ name: 'marked' })
export class MarkedPipe {
  transform(value) {
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    return marked(value);
  }
}
