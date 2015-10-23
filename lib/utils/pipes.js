'use strict';

import {Pipe} from 'angular2/angular2';
import {JsonPointer} from './JsonPointer';
import marked from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


@Pipe({
  name: 'keys'
})
export class KeysPipe {
  transform(obj) {
    return Object.keys(obj);
  }
}

@Pipe({
  name: 'values'
})
export class ValuesPipe {
  transform(obj) {
    return Object.keys(obj).map(key => obj[key]);
  }
}

@Pipe({
  name: 'jsonPointerEscape'
})
export class JsonPointerEscapePipe {
  transform(str) {
    return JsonPointer.escape(str);
  }
}

@Pipe({
  name: 'marked'
})
export class MarkedPipe {
  transform(str) {
    if (!str) return str;
    return marked(str);
  }
}
