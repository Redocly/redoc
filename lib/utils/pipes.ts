'use strict';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isString, stringify, isBlank } from './helpers';
import JsonPointer from './JsonPointer';
import { MdRenderer } from './';
import { JsonFormatter } from './JsonFormatterPipe';
import { OptionsService } from '../services/options.service';

declare var Prism: any;


class BaseException {
  message: string;
  constructor(message) {
    this.message = message;
  }
}

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
      throw new InvalidPipeArgumentException(KeysPipe, value);
    }
    return Object.keys(value);
  }
}

@Pipe({ name: 'marked' })
export class MarkedPipe implements PipeTransform {
  renderer: MdRenderer;
  unstrustedSpec: boolean;

  constructor(private sanitizer: DomSanitizer, optionsService: OptionsService) {
    this.renderer = new MdRenderer(true);
    this.unstrustedSpec = !!optionsService.options.untrustedSpec;
  }
  transform(value:string) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(MarkedPipe, value);
    }
    let res = `<span class="redoc-markdown-block">${this.renderer.renderMd(value)}</span>`;
    return this.unstrustedSpec ? res : this.sanitizer.bypassSecurityTrustHtml(res);
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value:string|SafeHtml):SafeHtml {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      return value;
    }

    return this.sanitizer.bypassSecurityTrustHtml(value as string);
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
  constructor(private sanitizer: DomSanitizer) {}
  transform(value, args) {
    if (isBlank(args) || args.length === 0) {
      throw new BaseException('Prism pipe requires one argument');
    }
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(PrismPipe, value);
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
  transform(value:string) {
    if (isBlank(value)) return value;
    if (!isString(value)) {
      throw new InvalidPipeArgumentException(EncodeURIComponentPipe, value);
    }
    return encodeURIComponent(value);
  }
}

const COLLECTION_FORMATS = {
  csv: 'Comma Separated',
  ssv: 'Space Separated',
  tsv: 'Tab Separated',
  pipes: 'Pipe Separated'
};

@Pipe({ name: 'collectionFormat' })
export class CollectionFormatPipe implements PipeTransform {
  transform(param:any) {
    let format = param.collectionFormat;
    if (!format) format = 'csv';
    if (format === 'multi') {
      return 'Multiple ' + param.in + ' params of';
    }
    return COLLECTION_FORMATS[format];
  }
}

export const REDOC_PIPES = [
  MarkedPipe, SafePipe, PrismPipe, EncodeURIComponentPipe, JsonFormatter, KeysPipe, CollectionFormatPipe
];
