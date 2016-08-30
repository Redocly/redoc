'use strict';
import * as Remarkable from 'remarkable';
declare var Prism: any;

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

interface HeadersHandler {
  open: Function;
  close: Function;
}

export function renderMd(rawText:string, headersHandler?:HeadersHandler) {
  let _origRule;
  if (headersHandler) {
    _origRule = {
      open: md.renderer.rules.heading_open,
      close: md.renderer.rules.heading_close
    };
    md.renderer.rules.heading_open = (tokens, idx) => {
      if (tokens[idx].hLevel !== 1 ) {
        return _origRule.open(tokens, idx);
      } else {
        return headersHandler.open(tokens, idx);
      }
    };

    md.renderer.rules.heading_close = (tokens, idx) => {
      if (tokens[idx].hLevel !== 1 ) {
        return _origRule.close(tokens, idx);
      } else {
        return headersHandler.close(tokens, idx);
      }
    };
  }

  let res =  md.render(rawText);

  if (headersHandler) {
    md.renderer.rules.heading_open = _origRule.open;
    md.renderer.rules.heading_close = _origRule.close;
  }

  return res;
}

export function statusCodeType(statusCode) {
  if (statusCode < 100 || statusCode > 599) {
    throw new Error('invalid HTTP code');
  }
  let res = 'success';
  if (statusCode >= 300 && statusCode < 400) {
    res = 'redirect';
  } else if (statusCode >= 400) {
    res = 'error';
  } else if (statusCode < 200) {
    res = 'info';
  }
  return res;
}

export function defaults(target, src) {
  var props = Object.keys(src);

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    if (target[key] === undefined) {
      target[key] = src[key];
    }
  }
  return target;
}

export function safePush(obj, prop, val) {
  if (!obj[prop]) obj[prop] = [];
  obj[prop].push(val);
}

// credits https://remysharp.com/2010/07/21/throttling-function-calls
export function throttle(fn, threshhold, scope) {
  threshhold = threshhold || 250;
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
