'use strict';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { isString, stringify, isBlank } from '@angular/core/src/facade/lang';
import { BaseException } from '@angular/core/src/facade/exceptions';
import JsonPointer from './JsonPointer';

declare var Prism: any;

import Remarkable from 'remarkable';

const md = new Remarkable({
  html: true,
  linkify: true,
  breaks: false,
  typographer: false,
  highlight: (str, lang) => {
    if (lang === 'json') lang = 'js';
    let grammar = Prism.languages[lang];
    //fallback to clike
    if (!grammar) return str;
    return Prism.highlight(str, grammar);
  }
});

class InvalidPipeArgumentException extends BaseException {
  constructor(type, value) {
    super(`Invalid argument '${value}' for pipe '${stringify(type)}'`);
  }
}

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value) {
    if (isBlank(value)) return value;
    if (typeof value !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, value);
    }
    return Object.keys(value);
  }
}

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {
  transform(value) {
    if (isBlank(value)) return value;
    if (typeof value !== 'object') {
      throw new InvalidPipeArgumentException(ValuesPipe, value);
    }
    return Object.keys(value).map(key => value[key]);
  }
}

@Pipe({ name: 'jsonPointerEscape' })
export class JsonPointerEscapePipe implements PipeTransform {
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }
    return JsonPointer.escape(value);
  }
}

@Pipe({ name: 'marked' })
export class MarkedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizationService) {}
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(JsonPointerEscapePipe, value);
    }

    return this.sanitizer.bypassSecurityTrustHtml(
      `<span class="redoc-markdown-block">${md.render(value)}</span>`
    );
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
export class PrismPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizationService) {}
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
    return this.sanitizer.bypassSecurityTrustHtml(Prism.highlight(value, grammar));
  }
}

@Pipe({ name: 'encodeURIComponent' })
export class EncodeURIComponentPipe implements PipeTransform {
  transform(value) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(EncodeURIComponentPipe, value);
    }
    return encodeURIComponent(value);
  }
}
