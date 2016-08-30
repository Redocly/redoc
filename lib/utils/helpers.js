'use strict';
var Remarkable = require('remarkable');
var md = new Remarkable({
    html: true,
    linkify: true,
    breaks: false,
    typographer: false,
    highlight: function (str, lang) {
        if (lang === 'json')
            lang = 'js';
        var grammar = Prism.languages[lang];
        if (!grammar)
            return str;
        return Prism.highlight(str, grammar);
    }
});
function renderMd(rawText, headersHandler) {
    var _origRule;
    if (headersHandler) {
        _origRule = {
            open: md.renderer.rules.heading_open,
            close: md.renderer.rules.heading_close
        };
        md.renderer.rules.heading_open = function (tokens, idx) {
            if (tokens[idx].hLevel !== 1) {
                return _origRule.open(tokens, idx);
            }
            else {
                return headersHandler.open(tokens, idx);
            }
        };
        md.renderer.rules.heading_close = function (tokens, idx) {
            if (tokens[idx].hLevel !== 1) {
                return _origRule.close(tokens, idx);
            }
            else {
                return headersHandler.close(tokens, idx);
            }
        };
    }
    var res = md.render(rawText);
    if (headersHandler) {
        md.renderer.rules.heading_open = _origRule.open;
        md.renderer.rules.heading_close = _origRule.close;
    }
    return res;
}
exports.renderMd = renderMd;
function statusCodeType(statusCode) {
    if (statusCode < 100 || statusCode > 599) {
        throw new Error('invalid HTTP code');
    }
    var res = 'success';
    if (statusCode >= 300 && statusCode < 400) {
        res = 'redirect';
    }
    else if (statusCode >= 400) {
        res = 'error';
    }
    else if (statusCode < 200) {
        res = 'info';
    }
    return res;
}
exports.statusCodeType = statusCodeType;
function defaults(target, src) {
    var props = Object.keys(src);
    var index = -1, length = props.length;
    while (++index < length) {
        var key = props[index];
        if (target[key] === undefined) {
            target[key] = src[key];
        }
    }
    return target;
}
exports.defaults = defaults;
function safePush(obj, prop, val) {
    if (!obj[prop])
        obj[prop] = [];
    obj[prop].push(val);
}
exports.safePush = safePush;
function throttle(fn, threshhold, scope) {
    threshhold = threshhold || 250;
    var last, deferTimer;
    return function () {
        var context = scope || this;
        var now = +new Date, args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        }
        else {
            last = now;
            fn.apply(context, args);
        }
    };
}
exports.throttle = throttle;
