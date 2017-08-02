'use strict';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

function isBlank(obj) {
  return obj === undefined || obj === null;
}

var level = 1;
const COLLAPSE_LEVEL = 2;

@Pipe({ name: 'jsonFormatter' })
export class JsonFormatter implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value) {
    if (isBlank(value)) return value;
    return this.sanitizer.bypassSecurityTrustHtml(jsonToHTML(value));
  }
}

function htmlEncode(t) {
  return t != undefined ?
    t.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}

function decorateWithSpan(value, className) {
  return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}

function valueToHTML(value) {
  var valueType = typeof value, output = '';
  if (value == undefined) {
    output += decorateWithSpan('null', 'type-null');
  } else if (value && value.constructor === Array) {
    level++;
    output += arrayToHTML(value);
    level--;
  } else if (value && value.constructor === Date) {
    output += decorateWithSpan('"' + value.toISOString() + '"', 'type-string');
  } else if (valueType === 'object') {
    level++;
    output += objectToHTML(value);
    level--;
  } else if (valueType === 'number') {
    output += decorateWithSpan(value, 'type-number');
  } else if (valueType === 'string') {
    if (/^(http|https):\/\/[^\s]+$/.test(value)) {
      output += decorateWithSpan('"', 'type-string') + '<a href="' + value + '">' + htmlEncode(value) + '</a>' +
        decorateWithSpan('"', 'type-string');
    } else {
      output += decorateWithSpan('"' + value + '"', 'type-string');
    }
  } else if (valueType === 'boolean') {
    output += decorateWithSpan(value, 'type-boolean');
  }

  return output;
}

function arrayToHTML(json) {
  var collapsed = level > COLLAPSE_LEVEL ? 'collapsed' : '';
  var i, length;
  var output = '<div class="collapser"></div>[<span class="ellipsis"></span><ul class="array collapsible">';
  var hasContents = false;
  for (i = 0, length = json.length; i < length; i++) {
    hasContents = true;
    output += '<li><div class="hoverable ' + collapsed + '">';
    output += valueToHTML(json[i]);
    if (i < length - 1) {
      output += ',';
    }
    output += '</div></li>';
  }
  output += '</ul>]';
  if (!hasContents) {
    output = '[ ]';
  }
  return output;
}

function objectToHTML(json) {
  var collapsed = level > COLLAPSE_LEVEL ? 'collapsed' : '';
  var i, key, length, keys = Object.keys(json);
  var output = '<div class="collapser"></div>{<span class="ellipsis"></span><ul class="obj collapsible">';
  var hasContents = false;
  for (i = 0, length = keys.length; i < length; i++) {
    key = keys[i];
    hasContents = true;
    output += '<li><div class="hoverable ' + collapsed + '">';
    output += '<span class="property">\"' + htmlEncode(key) + '"</span>: ';
    output += valueToHTML(json[key]);
    if (i < length - 1) {
      output += ',';
    }
    output += '</div></li>';
  }
  output += '</ul>}';
  if (!hasContents) {
    output = '{ }';
  }
  return output;
}

function jsonToHTML(json) {
  level = 1;
  var output = '';
  output += '<div class="redoc-json">';
  output += valueToHTML(json);
  output += '</div>';
  return output;
}
