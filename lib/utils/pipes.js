'use strict';

import {Pipe} from 'angular2/angular2';
import {JsonPointer} from './JsonPointer';

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
