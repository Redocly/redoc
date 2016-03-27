'use strict';

import {Pipe} from 'angular2/core';
import {isString, stringify, isBlank} from 'angular2/src/facade/lang';
import {BaseException} from 'angular2/src/facade/exceptions';
import {JsonPointer} from './JsonPointer';

import Prism from 'prismjs';
import 'prismjs/components/prism-actionscript.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-coffeescript.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-haskell.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-lua.js';
import 'prismjs/components/prism-matlab.js';
import 'prismjs/components/prism-perl.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-r.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-scala.js';
import 'prismjs/themes/prism-dark.css!css';

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

const langMap = {
  'c++': 'cpp',
  'c#': 'csharp',
  'objective-c': 'objectivec',
  'shell': 'bash',
  'viml': 'vim'
};

@Pipe({ name: 'prism' })
export class PrismPipe {
  transform(value, args) {
    if (isBlank(args) || args.length === 0) {
      throw new BaseException('Prism pipe requires one argument');
    }
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    let lang = args[0].toString().trim().toLowerCase();
    if (langMap[lang]) lang = langMap[lang];

    let grammar = Prism.languages[lang];
    //fallback to clike
    if (!grammar) grammar = Prism.languages.clike;
    return Prism.highlight(value, grammar);
  }
}

@Pipe({ name: 'encodeURIComponent' })
export class EncodeURIComponentPipe {
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(EncodeURIComponentPipe, value);
    }
    return encodeURIComponent(value);
  }
}
