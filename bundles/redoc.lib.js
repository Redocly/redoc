/*!
 * ReDoc - OpenAPI/Swagger-generated API Reference Documentation
 * -------------------------------------------------------------
 *   Version: "2.0.0-rc.0"
 *   Repo: https://github.com/Rebilly/ReDoc
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Redoc"] = factory();
	else
		root["Redoc"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 67);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mobx-react");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("polished");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("json-pointer");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("lunr");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("react-tabs");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("decko");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("marked");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("prismjs");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* escapes JSON Pointer using ~0 for ~ and ~1 for /
* @param s the string to escape
* @return the escaped string
*/
function jpescape(s) {
    s = s.split('~').join('~0');
    s = s.split('/').join('~1');
    return s;
}
/**
* unescapes JSON Pointer using ~0 for ~ and ~1 for /
* @param s the string to unescape
* @return the unescaped string
*/
function jpunescape(s) {
    s = s.split('~1').join('/');
    s = s.split('~0').join('~');
    return s;
}
// JSON Pointer specification: http://tools.ietf.org/html/rfc6901
/**
* from obj, return the property with a JSON Pointer prop, optionally setting it
* to newValue
* @param obj the object to point into
* @param prop the JSON Pointer or JSON Reference
* @param newValue optional value to set the property to
* @return the found property, or false
*/
function jptr(obj, prop, newValue) {
    if (typeof obj === 'undefined')
        return false;
    if (!prop || (prop === '#'))
        return (typeof newValue !== 'undefined' ? newValue : obj);
    if (prop.indexOf('#') >= 0) {
        var parts = prop.split('#');
        var uri = parts[0];
        if (uri)
            return false; // we do internal resolution only
        prop = parts[1];
        prop = decodeURIComponent(prop.slice(1)).split('+').join(' ');
    }
    if (prop.startsWith('/'))
        prop = prop.slice(1);
    var components = prop.split('/');
    for (var i = 0; i < components.length; i++) {
        components[i] = jpunescape(components[i]);
        var setAndLast = (typeof newValue !== 'undefined') && (i == components.length - 1);
        var index = parseInt(components[i], 10);
        if (!Array.isArray(obj) || isNaN(index) || (index.toString() !== components[i])) {
            index = (Array.isArray(obj) && components[i] === '-') ? -2 : -1;
        }
        else {
            components[i] = (i > 0) ? components[i - 1] : ''; // backtrack to indexed property name
        }
        if ((index != -1) || obj.hasOwnProperty(components[i])) {
            if (index >= 0) {
                if (setAndLast) {
                    obj[index] = newValue;
                }
                obj = obj[index];
            }
            else if (index === -2) {
                if (setAndLast) {
                    if (Array.isArray(obj)) {
                        obj.push(newValue);
                    }
                    return newValue;
                }
                else
                    return undefined;
            }
            else {
                if (setAndLast) {
                    obj[components[i]] = newValue;
                }
                obj = obj[components[i]];
            }
        }
        else {
            if ((typeof newValue !== 'undefined') && (typeof obj === 'object') &&
                (!Array.isArray(obj))) {
                obj[components[i]] = (setAndLast ? newValue : ((components[i + 1] === '0' || components[i + 1] === '-') ? [] : {}));
                obj = obj[components[i]];
            }
            else
                return false;
        }
    }
    return obj;
}
module.exports = {
    jptr: jptr,
    jpescape: jpescape,
    jpunescape: jpunescape
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* a collection of cloning functions
*/
/**
* a no-op placeholder which returns the given object unchanged
* useful for when a clone function needs to be passed but cloning is not
* required
* @param obj the input object
* @return the input object, unchanged
*/
function nop(obj) {
    return obj;
}
/**
* clones the given object using JSON.parse and JSON.stringify
* @param obj the object to clone
* @return the cloned object
*/
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
* clones the given object's properties shallowly, ignores properties from prototype
* @param obj the object to clone
* @return the cloned object
*/
function shallowClone(obj) {
    var result = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            result[p] = obj[p];
        }
    }
    return result;
}
/**
* clones the given object's properties deeply, ignores properties from prototype
* @param obj the object to clone
* @return the cloned object
*/
function deepClone(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p) || Array.isArray(obj)) {
            result[p] = (typeof obj[p] === 'object') ? deepClone(obj[p]) : obj[p];
        }
    }
    return result;
}
/**
* clones the given object's properties shallowly, using Object.assign
* @param obj the object to clone
* @return the cloned object
*/
function fastClone(obj) {
    return Object.assign({}, obj);
}
/**
* Source: stackoverflow http://bit.ly/2A1Kha6
*/
function circularClone(obj, hash) {
    if (!hash)
        hash = new WeakMap();
    // Do not try to clone primitives or functions
    if (Object(obj) !== obj || obj instanceof Function)
        return obj;
    if (hash.has(obj))
        return hash.get(obj); // Cyclic reference
    try { // Try to run constructor (without arguments, as we don't know them)
        var result = new obj.constructor();
    }
    catch (e) { // Constructor failed, create object without running the constructor
        result = Object.create(Object.getPrototypeOf(obj));
    }
    // Optional: support for some standard constructors (extend as desired)
    /*if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(circularClone(key, hash),
                                                   circularClone(val, hash)) );
    else if (obj instanceof Set)
        Array.from(obj, (key) => result.add(circularClone(key, hash)) );
    */
    // Register in hash
    hash.set(obj, result);
    // Clone and assign enumerable own properties recursively
    return Object.assign.apply(Object, [result].concat(Object.keys(obj).map(function (key) {
        var _a;
        return (_a = {}, _a[key] = circularClone(obj[key], hash), _a);
    })));
}
module.exports = {
    nop: nop,
    clone: clone,
    shallowClone: shallowClone,
    deepClone: deepClone,
    fastClone: fastClone,
    circularClone: circularClone
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("mark.js");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("openapi-sampler");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("perfect-scrollbar");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(65)(false);
// imports


// module
exports.push([module.i, "/*\n * Container style\n */\n.ps {\n  overflow: hidden !important;\n  overflow-anchor: none;\n  -ms-overflow-style: none;\n  touch-action: auto;\n  -ms-touch-action: auto;\n}\n\n/*\n * Scrollbar rail styles\n */\n.ps__rail-x {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  height: 15px;\n  /* there must be 'bottom' or 'top' for ps__rail-x */\n  bottom: 0px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-y {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  width: 15px;\n  /* there must be 'right' or 'left' for ps__rail-y */\n  right: 0;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps--active-x > .ps__rail-x,\n.ps--active-y > .ps__rail-y {\n  display: block;\n  background-color: transparent;\n}\n\n.ps:hover > .ps__rail-x,\n.ps:hover > .ps__rail-y,\n.ps--focus > .ps__rail-x,\n.ps--focus > .ps__rail-y,\n.ps--scrolling-x > .ps__rail-x,\n.ps--scrolling-y > .ps__rail-y {\n  opacity: 0.6;\n}\n\n.ps .ps__rail-x:hover,\n.ps .ps__rail-y:hover,\n.ps .ps__rail-x:focus,\n.ps .ps__rail-y:focus,\n.ps .ps__rail-x.ps--clicking,\n.ps .ps__rail-y.ps--clicking {\n  background-color: #eee;\n  opacity: 0.9;\n}\n\n/*\n * Scrollbar thumb styles\n */\n.ps__thumb-x {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, height .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, height .2s ease-in-out;\n  height: 6px;\n  /* there must be 'bottom' for ps__thumb-x */\n  bottom: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__thumb-y {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, width .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, width .2s ease-in-out;\n  width: 6px;\n  /* there must be 'right' for ps__thumb-y */\n  right: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-x:hover > .ps__thumb-x,\n.ps__rail-x:focus > .ps__thumb-x,\n.ps__rail-x.ps--clicking .ps__thumb-x {\n  background-color: #999;\n  height: 11px;\n}\n\n.ps__rail-y:hover > .ps__thumb-y,\n.ps__rail-y:focus > .ps__thumb-y,\n.ps__rail-y.ps--clicking .ps__thumb-y {\n  background-color: #999;\n  width: 11px;\n}\n\n/* MS supports */\n@supports (-ms-overflow-style: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports) {



/***/ }),
/* 23 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isRef(obj, key) {
    return ((key === '$ref') && (!!obj && typeof obj[key] === 'string'));
}
module.exports = {
    isRef: isRef
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var jpescape = __webpack_require__(16).jpescape;
function defaultState() {
    return {
        path: '#',
        depth: 0,
        pkey: '',
        parent: {},
        payload: {},
        seen: new WeakMap(),
        identity: false,
        identityDetection: false
    };
}
/**
* recurses through the properties of an object, given an optional starting state
* anything you pass in state.payload is passed to the callback each time
* @param object the object to recurse through
* @param state optional starting state, can be set to null or {}
* @param callback the function which receives object,key,state on each property
*/
function recurse(object, state, callback) {
    if (!state)
        state = { depth: 0 };
    if (!state.depth) {
        state = Object.assign({}, defaultState(), state);
    }
    if (typeof object !== 'object')
        return;
    var oPath = state.path;
    for (var key in object) {
        state.key = key;
        state.path = state.path + '/' + encodeURIComponent(jpescape(key));
        state.identityPath = state.seen.get(object[key]);
        state.identity = (typeof state.identityPath !== 'undefined');
        callback(object, key, state);
        if ((typeof object[key] === 'object') && (!state.identity)) {
            if (state.identityDetection && !Array.isArray(object[key]) && object[key] !== null) {
                state.seen.set(object[key], state.path);
            }
            var newState = {};
            newState.parent = object;
            newState.path = state.path;
            newState.depth = state.depth ? state.depth + 1 : 1;
            newState.pkey = key;
            newState.payload = state.payload;
            newState.seen = state.seen;
            newState.identity = false;
            newState.identityDetection = state.identityDetection;
            recurse(object[key], newState, callback);
        }
        state.path = oPath;
    }
}
module.exports = {
    recurse: recurse
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var yaml = __webpack_require__(15);
var colour = process.env.NODE_DISABLE_COLORS ?
    { red: '', yellow: '', green: '', normal: '' } :
    { red: '\x1b[31m', yellow: '\x1b[33;1m', green: '\x1b[32m', normal: '\x1b[0m' };
function uniqueOnly(value, index, self) {
    return self.indexOf(value) === index;
}
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
function allSame(array) {
    return (new Set(array)).size <= 1;
}
function deepEquals(obj1, obj2) {
    function _equals(obj1, obj2) {
        return yaml.dump(obj1) === yaml.dump(Object.assign({}, obj1, obj2));
    }
    return _equals(obj1, obj2) && _equals(obj2, obj1);
}
function compressArray(arr) {
    var result = [];
    var _loop_1 = function (candidate) {
        var dupe = result.find(function (e, i, a) {
            return deepEquals(e, candidate);
        });
        if (!dupe)
            result.push(candidate);
    };
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var candidate = arr_1[_i];
        _loop_1(candidate);
    }
    return result;
}
function distinctArray(arr) {
    return (arr.length === compressArray(arr).length);
}
/**
 * simple hash implementation based on https://stackoverflow.com/a/7616484/1749888
 * @param {string} s - string to hash
 * @returns {number} numerical hash code
 */
function hash(s) {
    var hash = 0;
    var chr;
    if (s.length === 0)
        return hash;
    for (var i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
String.prototype.toCamelCase = function camelize() {
    return this.toLowerCase().replace(/[-_ \/\.](.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
};
var parameterTypeProperties = [
    'format',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'minLength',
    'maxLength',
    'multipleOf',
    'minItems',
    'maxItems',
    'uniqueItems',
    'minProperties',
    'maxProperties',
    'additionalProperties',
    'pattern',
    'enum',
    'default'
];
var arrayProperties = [
    'items',
    'minItems',
    'maxItems',
    'uniqueItems'
];
var httpMethods = [
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'head',
    'options',
    'trace'
];
function sanitise(s) {
    s = s.replace('[]', 'Array');
    var components = s.split('/');
    components[0] = components[0].replace(/[^A-Za-z0-9_\-\.]+|\s+/gm, '_');
    return components.join('/');
}
function sanitiseAll(s) {
    return sanitise(s.split('/').join('_'));
}
module.exports = {
    colour: colour,
    uniqueOnly: uniqueOnly,
    hasDuplicates: hasDuplicates,
    allSame: allSame,
    distinctArray: distinctArray,
    hash: hash,
    parameterTypeProperties: parameterTypeProperties,
    arrayProperties: arrayProperties,
    httpMethods: httpMethods,
    sanitise: sanitise,
    sanitiseAll: sanitiseAll
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23)))

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "done", function() { return done; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toJS", function() { return toJS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "search", function() { return search; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lunr__WEBPACK_IMPORTED_MODULE_1__);


try {
    // tslint:disable-next-line
    __webpack_require__(64); // bundle into worker
}
catch (_) { } // nope
/* just for better typings */
var Worker = /** @class */ (function () {
    function Worker() {
        this.add = add;
        this.done = done;
        this.search = search;
        this.toJS = toJS;
        this.load = load;
    }
    return Worker;
}());
/* harmony default export */ __webpack_exports__["default"] = (Worker);
var store = [];
var resolveIndex = function () {
    throw new Error('Should not be called');
};
var index = new Promise(function (resolve) {
    resolveIndex = resolve;
});
lunr__WEBPACK_IMPORTED_MODULE_1__["tokenizer"].separator = /\s+/;
var builder = new lunr__WEBPACK_IMPORTED_MODULE_1__["Builder"]();
builder.field('title');
builder.field('description');
builder.ref('ref');
builder.pipeline.add(lunr__WEBPACK_IMPORTED_MODULE_1__["trimmer"], lunr__WEBPACK_IMPORTED_MODULE_1__["stopWordFilter"], lunr__WEBPACK_IMPORTED_MODULE_1__["stemmer"]);
var expandTerm = function (term) { return '*' + lunr__WEBPACK_IMPORTED_MODULE_1__["stemmer"](new lunr__WEBPACK_IMPORTED_MODULE_1__["Token"](term, {})) + '*'; };
function add(title, description, meta) {
    var ref = store.push(meta) - 1;
    var item = {
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        ref: ref
    };
    builder.add(item);
}
function done() {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            resolveIndex(builder.build());
            return [2 /*return*/];
        });
    });
}
function toJS() {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var _a;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        store: store
                    };
                    return [4 /*yield*/, index];
                case 1: return [2 /*return*/, (_a.index = (_b.sent()).toJSON(),
                        _a)];
            }
        });
    });
}
function load(state) {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            store = state.store;
            resolveIndex(lunr__WEBPACK_IMPORTED_MODULE_1__["Index"].load(state.index));
            return [2 /*return*/];
        });
    });
}
function search(q, limit) {
    if (limit === void 0) { limit = 0; }
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var searchResults;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (q.trim().length === 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, index];
                case 1:
                    searchResults = (_a.sent()).query(function (t) {
                        q.trim().toLowerCase().split(/\s+/).forEach(function (term) {
                            var exp = expandTerm(term);
                            t.term(exp, {});
                        });
                    });
                    if (limit > 0) {
                        searchResults = searchResults.slice(0, limit);
                    }
                    return [2 /*return*/, searchResults.map(function (res) { return ({
                            meta: store[res.ref],
                            score: res.score
                        }); })];
            }
        });
    });
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("slugify");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("styled-components");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("json-schema-ref-parser");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// @ts-check

var fs = __webpack_require__(22);
var url = __webpack_require__(7);
var pathlib = __webpack_require__(12);
var maybe = __webpack_require__(37);
var fetch = __webpack_require__(24);
var yaml = __webpack_require__(15);
var jptr = __webpack_require__(16);
var resolveInternal = jptr.jptr;
var isRef = __webpack_require__(25).isRef;
var clone = __webpack_require__(17).clone;
var cclone = __webpack_require__(17).circularClone;
var recurse = __webpack_require__(26).recurse;
var resolver = __webpack_require__(38);
var sw = __webpack_require__(40);
var common = __webpack_require__(27);
var statusCodes = __webpack_require__(41).statusCodes;
var ourVersion = __webpack_require__(42).version;
// TODO handle specification-extensions with plugins?
var targetVersion = '3.0.0';
var componentNames; // initialised in main
function throwError(message, options) {
    var err = new Error(message);
    err.options = options;
    if (options.promise) {
        options.promise.reject(err);
    }
    else {
        throw err;
    }
}
function throwOrWarn(message, container, options) {
    if (options.warnOnly) {
        container[options.warnProperty || 'x-s2o-warning'] = message;
    }
    else {
        throwError(message, options);
    }
}
function fixUpSubSchema(schema, parent, options) {
    if (schema.discriminator && typeof schema.discriminator === 'string') {
        schema.discriminator = { propertyName: schema.discriminator };
    }
    if (schema.items && Array.isArray(schema.items)) {
        if (schema.items.length === 0) {
            schema.items = {};
        }
        else if (schema.items.length === 1) {
            schema.items = schema.items[0];
        }
        else
            schema.items = { anyOf: schema.items };
    }
    if (schema.type && Array.isArray(schema.type)) {
        if (options.patch) {
            if (schema.type.length === 0) {
                delete schema.type;
            }
            else {
                if (!schema.oneOf)
                    schema.oneOf = [];
                for (var _i = 0, _a = schema.type; _i < _a.length; _i++) {
                    var type = _a[_i];
                    var newSchema = {};
                    if (type === 'null') {
                        schema.nullable = true;
                    }
                    else {
                        newSchema.type = type;
                        for (var _b = 0, _c = common.arrayProperties; _b < _c.length; _b++) {
                            var prop = _c[_b];
                            if (typeof schema.prop !== 'undefined') {
                                newSchema[prop] = schema[prop];
                                delete schema[prop];
                            }
                        }
                    }
                    if (newSchema.type) {
                        schema.oneOf.push(newSchema);
                    }
                }
                delete schema.type;
                if (schema.oneOf.length === 0) {
                    delete schema.oneOf; // means was just null => nullable
                }
                else if (schema.oneOf.length < 2) {
                    schema.type = schema.oneOf[0].type;
                    if (Object.keys(schema.oneOf[0]).length > 1) {
                        throwOrWarn('Lost properties from oneOf', schema, options);
                    }
                    delete schema.oneOf;
                }
            }
            // do not else this
            if (schema.type && Array.isArray(schema.type) && schema.type.length === 1) {
                schema.type = schema.type[0];
            }
        }
        else {
            throwError('(Patchable) schema type must not be an array', options);
        }
    }
    if (schema.type && schema.type === 'null') {
        delete schema.type;
        schema.nullable = true;
    }
    if ((schema.type === 'array') && (!schema.items)) {
        schema.items = {};
    }
    if (typeof schema.required === 'boolean') {
        if (schema.required && schema.name) {
            if (typeof parent.required === 'undefined') {
                parent.required = [];
            }
            if (Array.isArray(parent.required))
                parent.required.push(schema.name);
        }
        delete schema.required;
    }
    // TODO if we have a nested properties (object inside an object) and the
    // *parent* type is not set, force it to object
    // TODO if default is set but type is not set, force type to typeof default
    if (schema.xml && typeof schema.xml.namespace === 'string') {
        if (!schema.xml.namespace)
            delete schema.xml.namespace;
    }
}
function fixUpSubSchemaExtensions(schema, parent) {
    if (schema["x-required"] && Array.isArray(schema["x-required"])) {
        if (!schema.required)
            schema.required = [];
        schema.required = schema.required.concat(schema["x-required"]);
        delete schema["x-required"];
    }
    if (schema["x-anyOf"]) {
        schema.anyOf = schema["x-anyOf"];
        delete schema["x-anyOf"];
    }
    if (schema["x-oneOf"]) {
        schema.oneOf = schema["x-oneOf"];
        delete schema["x-oneOf"];
    }
    if (schema["x-not"]) {
        schema.not = schema["x-not"];
        delete schema["x-not"];
    }
    if (typeof schema["x-nullable"] === 'boolean') {
        schema.nullable = schema["x-nullable"];
        delete schema["x-nullable"];
    }
    if ((typeof schema["x-discriminator"] === 'object') && (typeof schema["x-discriminator"].propertyName === 'string')) {
        schema.discriminator = schema["x-discriminator"];
        delete schema["x-discriminator"];
        for (var entry in schema.discriminator.mapping) {
            var schemaOrRef = schema.discriminator.mapping[entry];
            if (schemaOrRef.startsWith('#/definitions/')) {
                schema.discriminator.mapping[entry] = schemaOrRef.replace('#/definitions/', '#/components/schemas/');
            }
        }
    }
}
function fixUpSchema(schema, options) {
    sw.walkSchema(schema, {}, {}, function (schema, parent, state) {
        fixUpSubSchemaExtensions(schema, parent);
        fixUpSubSchema(schema, parent, options);
    });
}
function getMiroComponentName(ref) {
    if (ref.indexOf('#') >= 0) {
        ref = ref.split('#')[1].split('/').pop();
    }
    else {
        ref = ref.split('/').pop().split('.')[0];
    }
    return encodeURIComponent(common.sanitise(ref));
}
function fixupRefs(obj, key, state) {
    var options = state.payload.options;
    if (isRef(obj, key)) {
        if (obj[key].startsWith('#/components/')) {
            // nop
        }
        else if (obj[key].startsWith('#/definitions/')) {
            //only the first part of a schema component name must be sanitised
            var keys = obj[key].replace('#/definitions/', '').split('/');
            var newKey = componentNames.schemas[decodeURIComponent(keys[0])]; // lookup, resolves a $ref
            if (newKey) {
                keys[0] = newKey;
            }
            else {
                throwOrWarn('Could not resolve reference ' + obj[key], obj, options);
            }
            obj[key] = '#/components/schemas/' + keys.join('/');
        }
        else if (obj[key].startsWith('#/parameters/')) {
            // for extensions like Apigee's x-templates
            obj[key] = '#/components/parameters/' + common.sanitise(obj[key].replace('#/parameters/', ''));
        }
        else if (obj[key].startsWith('#/responses/')) {
            // for extensions like Apigee's x-templates
            obj[key] = '#/components/responses/' + common.sanitise(obj[key].replace('#/responses/', ''));
        }
        else if (obj[key].startsWith('#')) {
            // fixes up direct $refs or those created by resolvers
            var target = clone(jptr.jptr(options.openapi, obj[key]));
            if (target === false)
                throwOrWarn('direct $ref not found ' + obj[key], obj, options);
            else if (options.refmap[obj[key]]) {
                obj[key] = options.refmap[obj[key]];
            }
            else {
                // we use a heuristic to determine what kind of thing is being referenced
                var oldRef = obj[key];
                oldRef = oldRef.replace('/properties/headers/', '');
                oldRef = oldRef.replace('/properties/responses/', '');
                oldRef = oldRef.replace('/properties/parameters/', '');
                oldRef = oldRef.replace('/properties/schemas/', '');
                var type = 'schemas';
                var schemaIndex = oldRef.lastIndexOf('/schema');
                type = (oldRef.indexOf('/headers/') > schemaIndex) ? 'headers' :
                    ((oldRef.indexOf('/responses/') > schemaIndex) ? 'responses' :
                        ((oldRef.indexOf('/example') > schemaIndex) ? 'examples' :
                            ((oldRef.indexOf('/parameters/') > schemaIndex) ? 'parameters' : 'schemas')));
                // non-body/form parameters have not moved in the overall structure (like responses)
                // but extracting the requestBodies can cause the *number* of parameters to change
                if (type === 'schemas') {
                    fixUpSchema(target, options);
                }
                if (type !== 'responses') {
                    var prefix = type.substr(0, type.length - 1);
                    if ((prefix === 'parameter') && target.name && (target.name === common.sanitise(target.name))) {
                        prefix = encodeURIComponent(target.name);
                    }
                    var suffix = 1;
                    if (obj['x-miro']) {
                        prefix = getMiroComponentName(obj['x-miro']);
                        suffix = '';
                    }
                    while (jptr.jptr(options.openapi, '#/components/' + type + '/' + prefix + suffix)) {
                        suffix = (suffix === '' ? 2 : ++suffix);
                    }
                    var newRef = '#/components/' + type + '/' + prefix + suffix;
                    var refSuffix = '';
                    if (type === 'examples') {
                        target = { value: target };
                        refSuffix = '/value';
                    }
                    jptr.jptr(options.openapi, newRef, target);
                    options.refmap[obj[key]] = newRef + refSuffix;
                    obj[key] = newRef + refSuffix;
                }
            }
        }
    }
    delete obj['x-miro'];
    if ((key === 'x-ms-odata') && (typeof obj[key] === 'string') && (obj[key].startsWith('#/'))) {
        var keys = obj[key].replace('#/definitions/', '').replace('#/components/schemas/', '').split('/');
        var newKey = componentNames.schemas[decodeURIComponent(keys[0])]; // lookup, resolves a $ref
        if (newKey) {
            keys[0] = newKey;
        }
        else {
            throwOrWarn('Could not resolve reference ' + obj[key], obj, options);
        }
        obj[key] = '#/components/schemas/' + keys.join('/');
    }
}
/*
* This has to happen as a separate pass because multiple $refs may point
* through elements of the same path
*/
function dedupeRefs(openapi, options) {
    for (var ref in options.refmap) {
        jptr.jptr(openapi, ref, { $ref: options.refmap[ref] });
    }
}
function processSecurity(securityObject) {
    for (var s in securityObject) {
        for (var k in securityObject[s]) {
            var sname = common.sanitise(k);
            if (k != sname) {
                securityObject[s][sname] = securityObject[s][k];
                delete securityObject[s][k];
            }
        }
    }
}
function processSecurityScheme(scheme, options) {
    if (scheme.type === 'basic') {
        scheme.type = 'http';
        scheme.scheme = 'basic';
    }
    if (scheme.type === 'oauth2') {
        var flow = {};
        var flowName = scheme.flow;
        if (scheme.flow === 'application')
            flowName = 'clientCredentials';
        if (scheme.flow === 'accessCode')
            flowName = 'authorizationCode';
        if (typeof scheme.authorizationUrl !== 'undefined')
            flow.authorizationUrl = scheme.authorizationUrl.split('?')[0].trim() || '/';
        if (typeof scheme.tokenUrl !== 'undefined')
            flow.tokenUrl = scheme.tokenUrl.split('?')[0].trim() || '/';
        flow.scopes = scheme.scopes || {};
        scheme.flows = {};
        scheme.flows[flowName] = flow;
        delete scheme.flow;
        delete scheme.authorizationUrl;
        delete scheme.tokenUrl;
        delete scheme.scopes;
        if (typeof scheme.name !== 'undefined') {
            if (options.patch) {
                delete scheme.name;
            }
            else {
                throwError('(Patchable) oauth2 securitySchemes should not have name property', options);
            }
        }
    }
}
function deleteParameters(value) {
    return !value["x-s2o-delete"];
}
function processHeader(header, options) {
    if (header.$ref) {
        header.$ref = header.$ref.replace('#/responses/', '#/components/responses/');
    }
    else {
        if (header.type && !header.schema) {
            header.schema = {};
        }
        if (header.type)
            header.schema.type = header.type;
        if (header.items && header.items.collectionFormat) {
            if (header.items.type && header.items.type != 'array') {
                if (header.items.collectionFormat != header.collectionFormat) {
                    throwOrWarn('Nested collectionFormats are not supported', header, options);
                }
                delete header.items.collectionFormat;
            }
        }
        if (typeof header.collectionFormat !== 'undefined') {
            if (header.type != 'array') {
                if (options.patch) {
                    delete header.collectionFormat;
                }
                else {
                    throwError('(Patchable) collectionFormat is only applicable to header.type array', options);
                }
            }
            if (header.collectionFormat === 'csv') {
                header.style = 'simple';
            }
            if (header.collectionFormat === 'ssv') {
                throwOrWarn('collectionFormat:ssv is no longer supported for headers', header, options); // not lossless
            }
            if (header.collectionFormat === 'pipes') {
                throwOrWarn('collectionFormat:pipes is no longer supported for headers', header, options); // not lossless
            }
            if (header.collectionFormat === 'multi') {
                header.explode = true;
            }
            if (header.collectionFormat === 'tsv') {
                throwOrWarn('collectionFormat:tsv is no longer supported', header, options); // not lossless
                header["x-collectionFormat"] = 'tsv';
            }
            delete header.collectionFormat;
        }
        delete header.type;
        for (var _i = 0, _a = common.parameterTypeProperties; _i < _a.length; _i++) {
            var prop = _a[_i];
            if (typeof header[prop] !== 'undefined') {
                header.schema[prop] = header[prop];
                delete header[prop];
            }
        }
        for (var _b = 0, _c = common.arrayProperties; _b < _c.length; _b++) {
            var prop = _c[_b];
            if (typeof header[prop] !== 'undefined') {
                header.schema[prop] = header[prop];
                delete header[prop];
            }
        }
    }
}
function fixParamRef(param, options) {
    if (param.$ref.indexOf('#/parameters/') >= 0) {
        var refComponents = param.$ref.split('#/parameters/');
        param.$ref = refComponents[0] + '#/components/parameters/' + common.sanitise(refComponents[1]);
    }
    if (param.$ref.indexOf('#/definitions/') >= 0) {
        throwOrWarn('Definition used as parameter', param, options);
    }
}
/**
 * @returns requestBody
 */
function processParameter(param, op, path, index, openapi, options) {
    var result = {};
    var singularRequestBody = true;
    var consumes = ((op && op.consumes) || (openapi.consumes || [])).filter(common.uniqueOnly);
    if (param.$ref && (typeof param.$ref === 'string')) {
        // if we still have a ref here, it must be an internal one
        fixParamRef(param, options);
        var ptr = decodeURIComponent(param.$ref.replace('#/components/parameters/', ''));
        var rbody = false;
        var target = openapi.components.parameters[ptr]; // resolves a $ref, must have been sanitised already
        if (((!target) || (target["x-s2o-delete"])) && param.$ref.startsWith('#/')) {
            // if it's gone, chances are it's a requestBody component now unless spec was broken
            param["x-s2o-delete"] = true;
            rbody = true;
        }
        // shared formData parameters from swagger or path level could be used in any combination.
        // we dereference all op.requestBody's then hash them and pull out common ones later
        if (rbody) {
            var ref = param.$ref;
            var newParam = resolveInternal(openapi, param.$ref);
            if (!newParam && ref.startsWith('#/')) {
                throwOrWarn('Could not resolve reference ' + ref, param, options);
            }
            else {
                if (newParam)
                    param = newParam; // preserve reference
            }
        }
    }
    if (param.name || param.in) { // if it's a real parameter OR we've dereferenced it
        if (typeof param['x-deprecated'] === 'boolean') {
            param.deprecated = param['x-deprecated'];
            delete param['x-deprecated'];
        }
        if (typeof param['x-example'] !== 'undefined') {
            param.example = param['x-example'];
            delete param['x-example'];
        }
        if ((param.in != 'body') && (!param.type)) {
            if (options.patch) {
                param.type = 'string';
            }
            else {
                throwError('(Patchable) parameter.type is mandatory for non-body parameters', options);
            }
        }
        if (param.type && typeof param.type === 'object' && param.type.$ref) {
            // $ref anywhere sensibility
            param.type = resolveInternal(openapi, param.type.$ref);
        }
        if (param.description && typeof param.description === 'object' && param.description.$ref) {
            // $ref anywhere sensibility
            param.description = resolveInternal(openapi, param.description.$ref);
        }
        if (param.description === null)
            delete param.description;
        var oldCollectionFormat_1 = param.collectionFormat;
        if (param.collectionFormat) {
            if (param.type != 'array') {
                if (options.patch) {
                    delete param.collectionFormat;
                }
                else {
                    throwError('(Patchable) collectionFormat is only applicable to param.type array', options);
                }
            }
            if ((param.collectionFormat === 'csv') && ((param.in === 'query') || (param.in === 'cookie'))) {
                param.style = 'form';
                param.explode = false;
            }
            if ((param.collectionFormat === 'csv') && ((param.in === 'path') || (param.in === 'header'))) {
                param.style = 'simple';
            }
            if (param.collectionFormat === 'ssv') {
                if (param.in === 'query') {
                    param.style = 'spaceDelimited';
                }
                else {
                    throwOrWarn('collectionFormat:ssv is no longer supported except for in:query parameters', param, options); // not lossless
                }
            }
            if (param.collectionFormat === 'pipes') {
                if (param.in === 'query') {
                    param.style = 'pipeDelimited';
                }
                else {
                    throwOrWarn('collectionFormat:pipes is no longer supported except for in:query parameters', param, options); // not lossless
                }
            }
            if (param.collectionFormat === 'multi') {
                param.explode = true;
            }
            if (param.collectionFormat === 'tsv') {
                throwOrWarn('collectionFormat:tsv is no longer supported', param, options); // not lossless
                param["x-collectionFormat"] = 'tsv';
            }
            delete param.collectionFormat;
        }
        if (param.type && (param.type != 'object') && (param.type != 'body') && (param.in != 'formData')) {
            if (param.items && param.schema) {
                throwOrWarn('parameter has array,items and schema', param, options);
            }
            else {
                if ((!param.schema) || (typeof param.schema !== 'object'))
                    param.schema = {};
                param.schema.type = param.type;
                if (param.items) {
                    param.schema.items = param.items;
                    delete param.items;
                    recurse(param.schema.items, null, function (obj, key, state) {
                        if ((key === 'collectionFormat') && (typeof obj[key] === 'string')) {
                            if (oldCollectionFormat_1 && obj[key] !== oldCollectionFormat_1) {
                                throwOrWarn('Nested collectionFormats are not supported', param, options);
                            }
                            delete obj[key]; // not lossless
                        }
                        // items in 2.0 was a subset of JSON-Schema items object, it gets
                        // fixed up below
                    });
                }
                for (var _i = 0, _a = common.parameterTypeProperties; _i < _a.length; _i++) {
                    var prop = _a[_i];
                    if (typeof param[prop] !== 'undefined')
                        param.schema[prop] = param[prop];
                    delete param[prop];
                }
            }
        }
        if (param.schema) {
            fixUpSchema(param.schema, options);
        }
        if (param["x-ms-skip-url-encoding"]) {
            if (param.in === 'query') { // might be in:path, not allowed in OAS3
                param.allowReserved = true;
                delete param["x-ms-skip-url-encoding"];
            }
        }
    }
    if (param.in === 'formData') {
        // convert to requestBody component
        singularRequestBody = false;
        result.content = {};
        var contentType = 'application/x-www-form-urlencoded';
        if ((consumes.length) && (consumes.indexOf('multipart/form-data') >= 0)) {
            contentType = 'multipart/form-data';
        }
        result.content[contentType] = {};
        if (param.schema) {
            result.content[contentType].schema = param.schema;
            if (param.schema.$ref) {
                result['x-s2o-name'] = decodeURIComponent(param.schema.$ref.replace('#/components/schemas/', ''));
            }
        }
        else {
            result.content[contentType].schema = {};
            result.content[contentType].schema.type = 'object';
            result.content[contentType].schema.properties = {};
            result.content[contentType].schema.properties[param.name] = {};
            var schema = result.content[contentType].schema;
            var target = result.content[contentType].schema.properties[param.name];
            if (param.description)
                target.description = param.description;
            if (param.example)
                target.example = param.example;
            if (param.type)
                target.type = param.type;
            for (var _b = 0, _c = common.parameterTypeProperties; _b < _c.length; _b++) {
                var prop = _c[_b];
                if (typeof param[prop] !== 'undefined')
                    target[prop] = param[prop];
            }
            if (param.required === true) {
                if (!schema.required)
                    schema.required = [];
                schema.required.push(param.name);
            }
            if (typeof param.default !== 'undefined')
                target.default = param.default;
            if (target.properties)
                target.properties = param.properties;
            if (param.allOf)
                target.allOf = param.allOf; // new are anyOf, oneOf, not, x- vendor extensions?
            if ((param.type === 'array') && (param.items)) {
                target.items = param.items;
                if (target.items.collectionFormat)
                    delete target.items.collectionFormat;
            }
            if (param.type === 'file') {
                target.type = 'string';
                target.format = 'binary';
            }
        }
    }
    else if (param.type === 'file') {
        // convert to requestBody
        if (param.required)
            result.required = param.required;
        result.content = {};
        result.content["application/octet-stream"] = {};
        result.content["application/octet-stream"].schema = {};
        result.content["application/octet-stream"].schema.type = 'string';
        result.content["application/octet-stream"].schema.format = 'binary';
    }
    if (param.in === 'body') {
        result.content = {};
        if (param.name)
            result['x-s2o-name'] = (op && op.operationId ? common.sanitiseAll(op.operationId) : '') + ('_' + param.name).toCamelCase();
        if (param.description)
            result.description = param.description;
        if (param.required)
            result.required = param.required;
        if (param.schema && param.schema.$ref) {
            result['x-s2o-name'] = decodeURIComponent(param.schema.$ref.replace('#/components/schemas/', ''));
        }
        else if (param.schema && (param.schema.type === 'array') && param.schema.items && param.schema.items.$ref) {
            result['x-s2o-name'] = decodeURIComponent(param.schema.items.$ref.replace('#/components/schemas/', '')) + 'Array';
        }
        if (!consumes.length) {
            consumes.push('application/json'); // TODO verify default
        }
        for (var _d = 0, consumes_1 = consumes; _d < consumes_1.length; _d++) {
            var mimetype = consumes_1[_d];
            result.content[mimetype] = {};
            result.content[mimetype].schema = clone(param.schema) || {};
            fixUpSchema(result.content[mimetype].schema, options);
        }
    }
    if (Object.keys(result).length > 0) {
        param["x-s2o-delete"] = true;
        // work out where to attach the requestBody
        if (op) {
            if (op.requestBody && singularRequestBody) {
                op.requestBody["x-s2o-overloaded"] = true;
                var opId = op.operationId || index;
                throwOrWarn('Operation ' + opId + ' has multiple requestBodies', op, options);
            }
            else {
                op.requestBody = Object.assign({}, op.requestBody); // make sure we have one
                if ((op.requestBody.content && op.requestBody.content["multipart/form-data"])
                    && (result.content["multipart/form-data"])) {
                    op.requestBody.content["multipart/form-data"].schema.properties =
                        Object.assign(op.requestBody.content["multipart/form-data"].schema.properties, result.content["multipart/form-data"].schema.properties);
                    op.requestBody.content["multipart/form-data"].schema.required = (op.requestBody.content["multipart/form-data"].schema.required || []).concat(result.content["multipart/form-data"].schema.required || []);
                    if (!op.requestBody.content["multipart/form-data"].schema.required.length) {
                        delete op.requestBody.content["multipart/form-data"].schema.required;
                    }
                }
                else if ((op.requestBody.content && op.requestBody.content["application/x-www-form-urlencoded"])
                    && (result.content["application/x-www-form-urlencoded"])) {
                    op.requestBody.content["application/x-www-form-urlencoded"].schema.properties =
                        Object.assign(op.requestBody.content["application/x-www-form-urlencoded"].schema.properties, result.content["application/x-www-form-urlencoded"].schema.properties);
                    op.requestBody.content["application/x-www-form-urlencoded"].schema.required = (op.requestBody.content["application/x-www-form-urlencoded"].schema.required || []).concat(result.content["application/x-www-form-urlencoded"].schema.required || []);
                    if (!op.requestBody.content["application/x-www-form-urlencoded"].schema.required.length) {
                        delete op.requestBody.content["application/x-www-form-urlencoded"].schema.required;
                    }
                }
                else {
                    op.requestBody = Object.assign(op.requestBody, result);
                    if (!op.requestBody['x-s2o-name']) {
                        if (op.requestBody.schema && op.requestBody.schema.$ref) {
                            op.requestBody['x-s2o-name'] = decodeURIComponent(op.requestBody.schema.$ref.replace('#/components/schemas/', '')).split('/').join('');
                        }
                        else if (op.operationId) {
                            op.requestBody['x-s2o-name'] = common.sanitiseAll(op.operationId);
                        }
                    }
                }
            }
        }
    }
    // tidy up
    delete param.type;
    for (var _e = 0, _f = common.parameterTypeProperties; _e < _f.length; _e++) {
        var prop = _f[_e];
        delete param[prop];
    }
    if ((param.in === 'path') && ((typeof param.required === 'undefined') || (param.required !== true))) {
        if (options.patch) {
            param.required = true;
        }
        else {
            throwError('(Patchable) path parameters must be required:true', options);
        }
    }
    return result;
}
function processResponse(response, name, op, openapi, options) {
    if (response.$ref && (typeof response.$ref === 'string')) {
        if (response.$ref.indexOf('#/definitions/') >= 0) {
            //response.$ref = '#/components/schemas/'+common.sanitise(response.$ref.replace('#/definitions/',''));
            throwOrWarn('definition used as response: ' + response.$ref, response, options);
        }
        else {
            if (response.$ref.startsWith('#/responses/')) {
                response.$ref = '#/components/responses/' + common.sanitise(decodeURIComponent(response.$ref.replace('#/responses/', '')));
            }
        }
    }
    else {
        if ((typeof response.description === 'undefined') || (response.description === null)
            || ((response.description === '') && options.patch)) {
            if (options.patch) {
                var sc = statusCodes.find(function (e) {
                    return e.code === name;
                });
                if ((typeof response === 'object') && (!Array.isArray(response))) {
                    response.description = (sc ? sc.phrase : '');
                }
            }
            else {
                throwError('(Patchable) response.description is mandatory', options);
            }
        }
        if (response.schema) {
            fixUpSchema(response.schema, options);
            if (response.schema.$ref && (typeof response.schema.$ref === 'string') && response.schema.$ref.startsWith('#/responses/')) {
                response.schema.$ref = '#/components/responses/' + common.sanitise(decodeURIComponent(response.schema.$ref.replace('#/responses/', '')));
            }
            var produces = ((op && op.produces) || (openapi.produces || [])).filter(common.uniqueOnly);
            if (!produces.length)
                produces.push('*/*'); // TODO verify default
            response.content = {};
            for (var _i = 0, produces_1 = produces; _i < produces_1.length; _i++) {
                var mimetype = produces_1[_i];
                response.content[mimetype] = {};
                response.content[mimetype].schema = clone(response.schema);
                if (response.examples && response.examples[mimetype]) {
                    var example = {};
                    example.value = response.examples[mimetype];
                    response.content[mimetype].examples = {};
                    response.content[mimetype].examples.response = example;
                    delete response.examples[mimetype];
                }
                if (response.content[mimetype].schema.type === 'file') {
                    response.content[mimetype].schema = { type: 'string', format: 'binary' };
                }
            }
            delete response.schema;
        }
        // examples for content-types not listed in produces
        for (var mimetype in response.examples) {
            if (!response.content)
                response.content = {};
            if (!response.content[mimetype])
                response.content[mimetype] = {};
            response.content[mimetype].examples = {};
            response.content[mimetype].examples.response = {};
            response.content[mimetype].examples.response.value = response.examples[mimetype];
        }
        delete response.examples;
        if (response.headers) {
            for (var h in response.headers) {
                if (h.toLowerCase() === 'status code') {
                    if (options.patch) {
                        delete response.headers[h];
                    }
                    else {
                        throwError('(Patchable) "Status Code" is not a valid header', options);
                    }
                }
                else {
                    processHeader(response.headers[h], options);
                }
            }
        }
    }
}
function processPaths(container, containerName, options, requestBodyCache, openapi) {
    for (var p in container) {
        var path = container[p];
        // path.$ref is external only
        if ((path['x-trace']) && (typeof path['x-trace'] === 'object')) {
            path.trace = path['x-trace'];
            delete path['x-trace'];
        }
        if ((path['x-summary']) && (typeof path['x-summary'] === 'string')) {
            path.summary = path['x-summary'];
            delete path['x-summary'];
        }
        if ((path['x-description']) && (typeof path['x-description'] === 'string')) {
            path.description = path['x-description'];
            delete path['x-description'];
        }
        if ((path['x-servers']) && (Array.isArray(path['x-servers']))) {
            path.servers = path['x-servers'];
            delete path['x-servers'];
        }
        for (var method in path) {
            if ((common.httpMethods.indexOf(method) >= 0) || (method === 'x-amazon-apigateway-any-method')) {
                var op = path[method];
                if (op.parameters && Array.isArray(op.parameters)) {
                    if (path.parameters) {
                        var _loop_1 = function (param) {
                            if (typeof param.$ref === 'string') {
                                fixParamRef(param, options);
                                param = resolveInternal(openapi, param.$ref);
                            }
                            var match = op.parameters.find(function (e, i, a) {
                                return ((e.name === param.name) && (e.in === param.in));
                            });
                            if (!match && ((param.in === 'formData') || (param.in === 'body') || (param.type === 'file'))) {
                                processParameter(param, op, path, p, openapi, options);
                            }
                        };
                        for (var _i = 0, _a = path.parameters; _i < _a.length; _i++) {
                            var param = _a[_i];
                            _loop_1(param);
                        }
                    }
                    for (var _b = 0, _c = op.parameters; _b < _c.length; _b++) {
                        var param = _c[_b];
                        processParameter(param, op, path, method + ':' + p, openapi, options);
                    }
                    if (!options.debug) {
                        op.parameters = op.parameters.filter(deleteParameters);
                    }
                }
                if (op.parameters === null)
                    delete op.parameters;
                if (op.security)
                    processSecurity(op.security);
                //don't need to remove requestBody for non-supported ops as they "SHALL be ignored"
                // responses
                if (!op.responses) {
                    var defaultResp = {};
                    defaultResp.description = 'Default response';
                    op.responses = { default: defaultResp };
                }
                for (var r in op.responses) {
                    var response = op.responses[r];
                    processResponse(response, r, op, openapi, options);
                }
                if ((op['x-servers']) && (Array.isArray(op['x-servers']))) {
                    op.servers = op['x-servers'];
                    delete op['x-servers'];
                }
                else if (op.schemes && op.schemes.length) {
                    for (var _d = 0, _e = op.schemes; _d < _e.length; _d++) {
                        var scheme = _e[_d];
                        if ((!openapi.schemes) || (openapi.schemes.indexOf(scheme) < 0)) {
                            if (!op.servers) {
                                op.servers = [];
                            }
                            for (var _f = 0, _g = openapi.servers; _f < _g.length; _f++) {
                                var server = _g[_f];
                                var newServer = clone(server);
                                var serverUrl = url.parse(newServer.url);
                                serverUrl.protocol = scheme;
                                newServer.url = serverUrl.format();
                                op.servers.push(newServer);
                            }
                        }
                    }
                }
                if (options.debug) {
                    op["x-s2o-consumes"] = op.consumes || [];
                    op["x-s2o-produces"] = op.produces || [];
                }
                delete op.consumes;
                delete op.produces;
                delete op.schemes;
                if (op["x-ms-examples"]) {
                    for (var e in op["x-ms-examples"]) {
                        var example = op["x-ms-examples"][e];
                        var se = common.sanitiseAll(e);
                        if (example.parameters) {
                            for (var p_1 in example.parameters) {
                                var value = example.parameters[p_1];
                                for (var _h = 0, _j = (op.parameters || []).concat(path.parameters || []); _h < _j.length; _h++) {
                                    var param = _j[_h];
                                    if (param.$ref) {
                                        param = jptr.jptr(openapi, param.$ref);
                                    }
                                    if ((param.name === p_1) && (!param.example)) {
                                        if (!param.examples) {
                                            param.examples = {};
                                        }
                                        param.examples[e] = { value: value };
                                    }
                                }
                            }
                        }
                        if (example.responses) {
                            for (var r in example.responses) {
                                if (example.responses[r].headers) {
                                    for (var h in example.responses[r].headers) {
                                        var value = example.responses[r].headers[h];
                                        for (var rh in op.responses[r].headers) {
                                            if (rh === h) {
                                                var header = op.responses[r].headers[rh];
                                                header.example = value;
                                            }
                                        }
                                    }
                                }
                                if (example.responses[r].body) {
                                    openapi.components.examples[se] = { value: clone(example.responses[r].body) };
                                    if (op.responses[r] && op.responses[r].content) {
                                        for (var ct in op.responses[r].content) {
                                            var contentType = op.responses[r].content[ct];
                                            if (!contentType.examples) {
                                                contentType.examples = {};
                                            }
                                            contentType.examples[e] = { $ref: '#/components/examples/' + se };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    delete op["x-ms-examples"];
                }
                if (op.parameters && op.parameters.length === 0)
                    delete op.parameters;
                if (op.requestBody) {
                    var effectiveOperationId = op.operationId ? common.sanitiseAll(op.operationId) : common.sanitiseAll(method + p).toCamelCase();
                    var rbName = common.sanitise(op.requestBody['x-s2o-name'] || effectiveOperationId || '');
                    delete op.requestBody['x-s2o-name'];
                    var rbStr = JSON.stringify(op.requestBody);
                    var rbHash = common.hash(rbStr);
                    if (!requestBodyCache[rbHash]) {
                        var entry = {};
                        entry.name = rbName;
                        entry.body = op.requestBody;
                        entry.refs = [];
                        requestBodyCache[rbHash] = entry;
                    }
                    var ptr = '#/' + containerName + '/' + encodeURIComponent(jptr.jpescape(p)) + '/' + method + '/requestBody';
                    requestBodyCache[rbHash].refs.push(ptr);
                }
            }
        }
        if (path.parameters === null)
            delete path.parameters;
        if (path.parameters) {
            for (var p2 in path.parameters) {
                var param = path.parameters[p2];
                processParameter(param, null, path, p, openapi, options); // index here is the path string
            }
            if (!options.debug) {
                path.parameters = path.parameters.filter(deleteParameters);
            }
        }
    }
}
function main(openapi, options) {
    var requestBodyCache = {};
    componentNames = { schemas: {} };
    if (openapi.security)
        processSecurity(openapi.security);
    for (var s in openapi.components.securitySchemes) {
        var sname = common.sanitise(s);
        if (s != sname) {
            if (openapi.components.securitySchemes[sname]) {
                throwError('Duplicate sanitised securityScheme name ' + sname, options);
            }
            openapi.components.securitySchemes[sname] = openapi.components.securitySchemes[s];
            delete openapi.components.securitySchemes[s];
        }
        processSecurityScheme(openapi.components.securitySchemes[sname], options);
    }
    for (var s in openapi.components.schemas) {
        var sname = common.sanitiseAll(s);
        var suffix = '';
        if (s != sname) {
            while (openapi.components.schemas[sname + suffix]) {
                // @ts-ignore
                suffix = (suffix ? ++suffix : 2);
            }
            openapi.components.schemas[sname + suffix] = openapi.components.schemas[s];
            delete openapi.components.schemas[s];
        }
        componentNames.schemas[s] = sname + suffix;
        fixUpSchema(openapi.components.schemas[sname + suffix], options);
    }
    // fix all $refs to their new locations (and potentially new names)
    options.refmap = {};
    recurse(openapi, { payload: { options: options } }, fixupRefs);
    dedupeRefs(openapi, options);
    for (var p in openapi.components.parameters) {
        var sname = common.sanitise(p);
        if (p != sname) {
            if (openapi.components.parameters[sname]) {
                throwError('Duplicate sanitised parameter name ' + sname, options);
            }
            openapi.components.parameters[sname] = openapi.components.parameters[p];
            delete openapi.components.parameters[p];
        }
        var param = openapi.components.parameters[sname];
        processParameter(param, null, null, sname, openapi, options);
    }
    for (var r in openapi.components.responses) {
        var sname = common.sanitise(r);
        if (r != sname) {
            if (openapi.components.responses[sname]) {
                throwError('Duplicate sanitised response name ' + sname, options);
            }
            openapi.components.responses[sname] = openapi.components.responses[r];
            delete openapi.components.responses[r];
        }
        var response = openapi.components.responses[sname];
        processResponse(response, sname, null, openapi, options);
        if (response.headers) {
            for (var h in response.headers) {
                if (h.toLowerCase() === 'status code') {
                    if (options.patch) {
                        delete response.headers[h];
                    }
                    else {
                        throwError('(Patchable) "Status Code" is not a valid header', options);
                    }
                }
                else {
                    processHeader(response.headers[h], options);
                }
            }
        }
    }
    for (var r in openapi.components.requestBodies) { // converted ones
        var rb = openapi.components.requestBodies[r];
        var rbStr = JSON.stringify(rb);
        var rbHash = common.hash(rbStr);
        var entry = {};
        entry.name = r;
        entry.body = rb;
        entry.refs = [];
        requestBodyCache[rbHash] = entry;
    }
    processPaths(openapi.paths, 'paths', options, requestBodyCache, openapi);
    if (openapi["x-ms-paths"]) {
        processPaths(openapi["x-ms-paths"], 'x-ms-paths', options, requestBodyCache, openapi);
    }
    if (!options.debug) {
        for (var p in openapi.components.parameters) {
            var param = openapi.components.parameters[p];
            if (param["x-s2o-delete"]) {
                delete openapi.components.parameters[p];
            }
        }
    }
    if (options.debug) {
        openapi["x-s2o-consumes"] = openapi.consumes || [];
        openapi["x-s2o-produces"] = openapi.produces || [];
    }
    delete openapi.consumes;
    delete openapi.produces;
    delete openapi.schemes;
    var rbNamesGenerated = [];
    openapi.components.requestBodies = {}; // for now as we've dereffed them
    var counter = 1;
    for (var e in requestBodyCache) {
        var entry = requestBodyCache[e];
        if (entry.refs.length > 1) {
            // create a shared requestBody
            var suffix = '';
            if (!entry.name) {
                entry.name = 'requestBody';
                // @ts-ignore
                suffix = counter++;
            }
            while (rbNamesGenerated.indexOf(entry.name + suffix) >= 0) {
                // @ts-ignore - this can happen if descriptions are not exactly the same (e.g. bitbucket)
                suffix = (suffix ? ++suffix : 2);
            }
            entry.name = entry.name + suffix;
            rbNamesGenerated.push(entry.name);
            openapi.components.requestBodies[entry.name] = clone(entry.body);
            for (var r in entry.refs) {
                var ref = {};
                ref.$ref = '#/components/requestBodies/' + entry.name;
                jptr.jptr(openapi, entry.refs[r], ref);
            }
        }
    }
    if (openapi.components.responses && Object.keys(openapi.components.responses).length === 0) {
        delete openapi.components.responses;
    }
    if (openapi.components.parameters && Object.keys(openapi.components.parameters).length === 0) {
        delete openapi.components.parameters;
    }
    if (openapi.components.examples && Object.keys(openapi.components.examples).length === 0) {
        delete openapi.components.examples;
    }
    if (openapi.components.requestBodies && Object.keys(openapi.components.requestBodies).length === 0) {
        delete openapi.components.requestBodies;
    }
    if (openapi.components.securitySchemes && Object.keys(openapi.components.securitySchemes).length === 0) {
        delete openapi.components.securitySchemes;
    }
    if (openapi.components.headers && Object.keys(openapi.components.headers).length === 0) {
        delete openapi.components.headers;
    }
    if (openapi.components.schemas && Object.keys(openapi.components.schemas).length === 0) {
        delete openapi.components.schemas;
    }
    if (openapi.components && Object.keys(openapi.components).length === 0) {
        delete openapi.components;
    }
    return openapi;
}
function extractServerParameters(server) {
    server.url = server.url.split('{{').join('{');
    server.url = server.url.split('}}').join('}');
    server.url.replace(/\{(.+?)\}/g, function (match, group1) {
        if (!server.variables) {
            server.variables = {};
        }
        server.variables[group1] = { default: 'unknown' };
    });
}
function fixInfo(openapi, options, reject) {
    if ((typeof openapi.info === 'undefined') || (openapi.info === null)) {
        if (options.patch) {
            openapi.info = { version: '', title: '' };
        }
        else {
            return reject(new Error('(Patchable) info object is mandatory'));
        }
    }
    if ((typeof openapi.info !== 'object') || (Array.isArray(openapi.info))) {
        return reject(new Error('info must be an object'));
    }
    if ((typeof openapi.info.title === 'undefined') || (openapi.info.title === null)) {
        if (options.patch) {
            openapi.info.title = '';
        }
        else {
            return reject(new Error('(Patchable) info.title cannot be null'));
        }
    }
    if ((typeof openapi.info.version === 'undefined') || (openapi.info.version === null)) {
        if (options.patch) {
            openapi.info.version = '';
        }
        else {
            return reject(new Error('(Patchable) info.version cannot be null'));
        }
    }
    if (typeof openapi.info.version !== 'string') {
        if (options.patch) {
            openapi.info.version = openapi.info.version.toString();
        }
        else {
            return reject(new Error('(Patchable) info.version must be a string'));
        }
    }
    if (typeof openapi.info.logo !== 'undefined') {
        if (options.patch) {
            openapi.info['x-logo'] = openapi.info.logo;
            delete openapi.info.logo;
        }
        else
            return reject(new Error('(Patchable) info should not have logo property'));
    }
    if (typeof openapi.info.termsOfService !== 'undefined') {
        if (openapi.info.termsOfService === null) {
            if (options.patch) {
                openapi.info.termsOfService = '';
            }
            else {
                return reject(new Error('(Patchable) info.termsOfService cannot be null'));
            }
        }
        if (url.URL && options.whatwg) {
            try {
                url.URL.parse(openapi.info.termsOfService);
            }
            catch (ex) {
                if (options.patch) {
                    delete openapi.info.termsOfService;
                }
                else
                    return reject(new Error('(Patchable) info.termsOfService must be a URL'));
            }
        }
    }
}
function fixPaths(openapi, options, reject) {
    if (typeof openapi.paths === 'undefined') {
        if (options.patch) {
            openapi.paths = {};
        }
        else {
            return reject(new Error('(Patchable) paths object is mandatory'));
        }
    }
}
function convertObj(swagger, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        options.externals = [];
        options.externalRefs = {};
        options.rewriteRefs = true; // avoids stack explosions
        options.preserveMiro = true;
        options.promise = {};
        options.promise.resolve = resolve;
        options.promise.reject = reject;
        if (!options.cache)
            options.cache = {};
        if (swagger.openapi && (typeof swagger.openapi === 'string') && swagger.openapi.startsWith('3.')) {
            options.openapi = cclone(swagger);
            fixInfo(options.openapi, options, reject);
            fixPaths(options.openapi, options, reject);
            resolver.optionalResolve(options) // is a no-op if options.resolve is not set
                .then(function () {
                if (options.direct) {
                    return resolve(options.openapi);
                }
                else {
                    return resolve(options);
                }
            })
                .catch(function (ex) {
                console.warn(ex);
                reject(ex);
            });
            return; // we should have resolved or rejected by now
        }
        if ((!swagger.swagger) || (swagger.swagger != "2.0")) {
            return reject(new Error('Unsupported swagger/OpenAPI version: ' + (swagger.openapi ? swagger.openapi : swagger.swagger)));
        }
        var openapi = options.openapi = {};
        openapi.openapi = targetVersion; // semver
        if (options.origin) {
            if (!openapi["x-origin"]) {
                openapi["x-origin"] = [];
            }
            var origin = {};
            origin.url = options.source || options.origin;
            origin.format = 'swagger';
            origin.version = swagger.swagger;
            origin.converter = {};
            origin.converter.url = 'https://github.com/mermade/oas-kit';
            origin.converter.version = ourVersion;
            openapi["x-origin"].push(origin);
        }
        // we want the new and existing properties to appear in a sensible order. Not guaranteed
        openapi = Object.assign(openapi, cclone(swagger));
        delete openapi.swagger;
        if (swagger.host) {
            for (var _i = 0, _a = swagger.schemes || ['']; _i < _a.length; _i++) {
                var s = _a[_i];
                var server = {};
                server.url = (s ? s + ':' : '') + '//' + swagger.host + (swagger.basePath ? swagger.basePath : '');
                extractServerParameters(server);
                if (!openapi.servers)
                    openapi.servers = [];
                openapi.servers.push(server);
            }
        }
        else if (swagger.basePath) {
            var server = {};
            server.url = swagger.basePath;
            extractServerParameters(server);
            if (!openapi.servers)
                openapi.servers = [];
            openapi.servers.push(server);
        }
        delete openapi.host;
        delete openapi.basePath;
        if (openapi['x-servers'] && Array.isArray(openapi['x-servers'])) {
            openapi.servers = openapi['x-servers'];
            delete openapi['x-servers'];
        }
        // TODO APIMatic extensions (x-server-configuration) ?
        if (swagger['x-ms-parameterized-host']) {
            var xMsPHost = swagger['x-ms-parameterized-host'];
            var server = {};
            server.url = xMsPHost.hostTemplate;
            server.variables = {};
            for (var msp in xMsPHost.parameters) {
                var param = xMsPHost.parameters[msp];
                if (param.$ref) {
                    param = clone(resolveInternal(openapi, param.$ref));
                }
                if (!msp.startsWith('x-')) {
                    delete param.required; // all true
                    delete param.type; // all strings
                    delete param.in; // all 'host'
                    if (typeof param.default === 'undefined') {
                        if (param.enum) {
                            param.default = param.enum[0];
                        }
                        else {
                            param.default = '';
                        }
                    }
                    server.variables[param.name] = param;
                    delete param.name;
                }
            }
            if (!openapi.servers)
                openapi.servers = [];
            openapi.servers.push(server);
            delete openapi['x-ms-parameterized-host'];
        }
        fixInfo(openapi, options, reject);
        fixPaths(openapi, options, reject);
        openapi.components = {};
        if (openapi['x-callbacks']) {
            openapi.components.callbacks = openapi['x-callbacks'];
            delete openapi['x-callbacks'];
        }
        openapi.components.examples = {};
        openapi.components.headers = {};
        if (openapi['x-links']) {
            openapi.components.links = openapi['x-links'];
            delete openapi['x-links'];
        }
        openapi.components.parameters = openapi.parameters || {};
        openapi.components.responses = openapi.responses || {};
        openapi.components.requestBodies = {};
        openapi.components.securitySchemes = openapi.securityDefinitions || {};
        openapi.components.schemas = openapi.definitions || {};
        delete openapi.definitions;
        delete openapi.responses;
        delete openapi.parameters;
        delete openapi.securityDefinitions;
        resolver.optionalResolve(options) // is a no-op if options.resolve is not set
            .then(function () {
            main(openapi, options);
            if (options.direct) {
                resolve(options.openapi);
            }
            else {
                resolve(options);
            }
        })
            .catch(function (ex) {
            console.warn(ex);
            reject(ex);
        });
    }));
}
function convertStr(str, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        var obj = null;
        try {
            obj = JSON.parse(str);
        }
        catch (ex) {
            try {
                obj = yaml.safeLoad(str, { json: true });
                options.sourceYaml = true;
            }
            catch (ex) { }
        }
        if (obj) {
            options.original = obj;
            convertObj(obj, options)
                .then(function (options) { return resolve(options); })
                .catch(function (ex) { return reject(ex); });
        }
        else {
            reject(new Error('Could not parse string'));
        }
    }));
}
function convertUrl(url, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        options.origin = true;
        if (!options.source) {
            options.source = url;
        }
        if (options.verbose) {
            console.log('GET ' + url);
        }
        fetch(url, { agent: options.agent }).then(function (res) {
            if (res.status !== 200)
                throw new Error("Received status code " + res.status);
            return res.text();
        }).then(function (body) {
            convertStr(body, options)
                .then(function (options) { return resolve(options); })
                .catch(function (ex) { return reject(ex); });
        }).catch(function (err) {
            reject(err);
        });
    }));
}
function convertFile(filename, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        fs.readFile(filename, options.encoding || 'utf8', function (err, s) {
            if (err) {
                reject(err);
            }
            else {
                options.sourceFile = filename;
                convertStr(s, options)
                    .then(function (options) { return resolve(options); })
                    .catch(function (ex) { return reject(ex); });
            }
        });
    }));
}
function convertStream(readable, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        var data = '';
        readable.on('data', function (chunk) {
            data += chunk;
        })
            .on('end', function () {
            convertStr(data, options)
                .then(function (options) { return resolve(options); })
                .catch(function (ex) { return reject(ex); });
        });
    }));
}
module.exports = {
    targetVersion: targetVersion,
    convert: convertObj,
    convertObj: convertObj,
    convertUrl: convertUrl,
    convertStr: convertStr,
    convertFile: convertFile,
    convertStream: convertStream
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("memoize-one");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("react-dropdown");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("dompurify");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("call-me-maybe");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fs = __webpack_require__(22);
var path = __webpack_require__(12);
var url = __webpack_require__(7);
var util = __webpack_require__(39);
var fetch = __webpack_require__(24);
var yaml = __webpack_require__(15);
var jptr = __webpack_require__(16).jptr;
var recurse = __webpack_require__(26).recurse;
var clone = __webpack_require__(17).clone;
var isRef = __webpack_require__(25).isRef;
var common = __webpack_require__(27);
function unique(arr) {
    return new Set(arr).slice();
}
function readFileAsync(filename, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, encoding, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
function resolveAllInternal(obj, context, src, parentPath, base, options) {
    var attachPoint = options.externalRefs[src + parentPath].paths[0];
    var baseUrl = url.parse(base);
    var seen = {}; // seen is indexed by the $ref value and contains path replacements
    var changes = 1;
    while (changes) {
        changes = 0;
        recurse(obj, { identityDetection: true }, function (obj, key, state) {
            if (isRef(obj, key)) {
                if (obj[key].startsWith('#')) {
                    if (!seen[obj[key]] && !obj.$fixed) {
                        var target = clone(jptr(context, obj[key]));
                        if (options.verbose > 1)
                            console.log((target === false ? common.colour.red : common.colour.green) + 'Internal resolution', obj[key], common.colour.normal);
                        /*
                            ResolutionCase:A is where there is a local reference in an externally
                            referenced document, and we have not seen it before. The reference
                            is replaced by a copy of the data pointed to, which may be outside this fragment
                            but within the context of the external document
                        */
                        if (target === false) {
                            state.parent[state.pkey] = {}; /* case:A(2) where the resolution fails */
                            if (options.fatal) {
                                var ex = new Error('Internal $ref resolution failed ' + obj[key]);
                                if (options.promise)
                                    options.promise.reject(ex);
                                else
                                    throw (ex);
                            }
                        }
                        else {
                            changes++;
                            state.parent[state.pkey] = target;
                            seen[obj[key]] = state.path.replace('/%24ref', '');
                        }
                    }
                    else {
                        if (!obj.$fixed) {
                            var newRef = (attachPoint + '/' + seen[obj[key]]).split('/#/').join('/');
                            state.parent[state.pkey] = { $ref: newRef, 'x-miro': obj[key], $fixed: true };
                            if (options.verbose > 1)
                                console.log('Replacing with', newRef);
                            changes++;
                        }
                        /*
                            ResolutionCase:B is where there is a local reference in an externally
                            referenced document, and we have seen this reference before and resolved it.
                            We create a new object containing the (immutable) $ref string
                        */
                    }
                }
                else if (baseUrl.protocol) {
                    var newRef = url.resolve(base, obj[key]).toString();
                    if (options.verbose > 1)
                        console.log(common.colour.yellow + 'Rewriting external url ref', obj[key], 'as', newRef, common.colour.normal);
                    obj['x-miro'] = obj[key];
                    obj[key] = newRef;
                }
                else if (!obj['x-miro']) {
                    var newRef = url.resolve(base, obj[key]).toString();
                    if (options.verbose > 1)
                        console.log(common.colour.yellow + 'Rewriting external ref', obj[key], 'as', newRef, common.colour.normal);
                    obj['x-miro'] = obj[key]; // we use x-miro as a flag so we don't do this > once
                    obj[key] = newRef;
                }
            }
        });
    }
    recurse(obj, {}, function (obj, key, state) {
        if (isRef(obj, key)) {
            if (typeof obj.$fixed !== 'undefined')
                delete obj.$fixed;
            if (!options.preserveMiro)
                delete obj['x-miro'];
        }
    });
    if (options.verbose > 1)
        console.log('Finished internal resolution');
    return obj;
}
function filterData(data, options) {
    if (!options.filters || !options.filters.length)
        return data;
    for (var _i = 0, _a = options.filters; _i < _a.length; _i++) {
        var filter = _a[_i];
        data = filter(data, options);
    }
    return data;
}
function resolveExternal(root, pointer, options, callback) {
    var u = url.parse(options.source);
    var base = options.source.split('\\').join('/').split('/');
    var doc = base.pop(); // drop the actual filename
    if (!doc)
        base.pop(); // in case it ended with a /
    var fragment = '';
    var fnComponents = pointer.split('#');
    if (fnComponents.length > 1) {
        fragment = '#' + fnComponents[1];
        pointer = fnComponents[0];
    }
    base = base.join('/');
    var u2 = url.parse(pointer);
    var effectiveProtocol = (u2.protocol ? u2.protocol : (u.protocol ? u.protocol : 'file:'));
    var target;
    if (effectiveProtocol === 'file:') {
        target = path.resolve(base ? base + '/' : '', pointer);
    }
    else {
        target = url.resolve(base ? base + '/' : '', pointer);
    }
    if (options.cache[target]) {
        if (options.verbose)
            console.log('CACHED', target, fragment);
        /*
            resolutionSource:A this is where we have cached the externally-referenced document from a
            file, http or custom handler
        */
        var context = clone(options.cache[target]);
        var data = context;
        if (fragment) {
            data = jptr(data, fragment);
            if (data === false) {
                data = {}; // case:A(2) where the resolution fails
                if (options.fatal) {
                    var ex = new Error('Cached $ref resolution failed ' + target + fragment);
                    if (options.promise)
                        options.promise.reject(ex);
                    else
                        throw (ex);
                }
            }
        }
        data = resolveAllInternal(data, context, pointer, fragment, target, options);
        data = filterData(data, options);
        callback(clone(data), target, options);
        return Promise.resolve(data);
    }
    if (options.verbose)
        console.log('GET', target, fragment);
    if (options.handlers && options.handlers[effectiveProtocol]) {
        return options.handlers[effectiveProtocol](base, pointer, fragment, options)
            .then(function (data) {
            data = filterData(data, options);
            options.cache[target] = data;
            callback(data, target, options);
            return data;
        })
            .catch(function (ex) {
            if (options.verbose)
                console.warn(ex);
            throw (ex);
        });
    }
    else if (effectiveProtocol && effectiveProtocol.startsWith('http')) {
        return fetch(target, { agent: options.agent })
            .then(function (res) {
            if (res.status !== 200)
                throw new Error("Received status code " + res.status);
            return res.text();
        })
            .then(function (data) {
            try {
                var context = yaml.safeLoad(data, { json: true });
                data = context;
                options.cache[target] = clone(data);
                /* resolutionSource:B, from the network, data is fresh, but we clone it into the cache */
                if (fragment) {
                    data = jptr(data, fragment);
                    if (data === false) {
                        data = {}; /* case:B(2) where the resolution fails */
                        if (options.fatal) {
                            var ex = new Error('Remote $ref resolution failed ' + target + fragment);
                            if (options.promise)
                                options.promise.reject(ex);
                            else
                                throw (ex);
                        }
                    }
                }
                data = resolveAllInternal(data, context, pointer, fragment, target, options);
                data = filterData(data, options);
            }
            catch (ex) {
                if (options.verbose)
                    console.warn(ex);
                if (options.promise && options.fatal)
                    options.promise.reject(ex);
                else
                    throw (ex);
            }
            callback(data, target, options);
            return data;
        })
            .catch(function (err) {
            if (options.verbose)
                console.warn(err);
            options.cache[target] = {};
            if (options.promise && options.fatal)
                options.promise.reject(err);
            else
                throw (err);
        });
    }
    else {
        return readFileAsync(target, options.encoding || 'utf8')
            .then(function (data) {
            try {
                var context = yaml.safeLoad(data, { json: true });
                data = context;
                /*
                    resolutionSource:C from a file, data is fresh but we clone it into the cache
                */
                options.cache[target] = clone(data);
                if (fragment) {
                    data = jptr(data, fragment);
                    if (data === false) {
                        data = {}; /* case:C(2) where the resolution fails */
                        if (options.fatal) {
                            var ex = new Error('File $ref resolution failed ' + target + fragment);
                            if (options.promise)
                                options.promise.reject(ex);
                            else
                                throw (ex);
                        }
                    }
                }
                data = resolveAllInternal(data, context, pointer, fragment, target, options);
                data = filterData(data, options);
            }
            catch (ex) {
                if (options.verbose)
                    console.warn(ex);
                if (options.promise && options.fatal)
                    options.promise.reject(ex);
                else
                    throw (ex);
            }
            callback(data, target, options);
            return data;
        })
            .catch(function (err) {
            if (options.verbose)
                console.warn(err);
            if (options.promise && options.fatal)
                options.promise.reject(err);
            else
                throw (err);
        });
    }
}
function scanExternalRefs(options) {
    return new Promise(function (res, rej) {
        var refs = options.externalRefs;
        if ((options.resolver.depth > 0) && (options.source === options.resolver.base)) {
            // we only need to do any of this when called directly on pass #1
            return res(refs);
        }
        recurse(options.openapi, { identityDetection: true }, function (obj, key, state) {
            if (obj[key] && isRef(obj[key], '$ref')) {
                var $ref = obj[key].$ref;
                if (!$ref.startsWith('#')) {
                    if (!refs[$ref]) {
                        refs[$ref] = { resolved: false, paths: [], description: obj[key].description };
                    }
                    if (refs[$ref].resolved) {
                        if (options.rewriteRefs) {
                            // we've already seen it
                            var newRef = refs[$ref].resolvedAt;
                            if (options.verbose > 1)
                                console.log('Rewriting ref', $ref, newRef);
                            obj[key]['x-miro'] = $ref;
                            obj[key].$ref = newRef; // resolutionCase:C (new string)
                        }
                        else {
                            obj[key] = clone(refs[$ref].data); // resolutionCase:D (cloned:yes)
                        }
                    }
                    else {
                        refs[$ref].paths.push(state.path);
                    }
                }
            }
        });
        res(refs);
    });
}
function findExternalRefs(options) {
    return new Promise(function (res, rej) {
        scanExternalRefs(options)
            .then(function (refs) {
            var _loop_1 = function (ref) {
                if (!refs[ref].resolved) {
                    var depth = options.resolver.depth;
                    if (depth > 0)
                        depth++;
                    options.resolver.actions[depth].push(function () {
                        return resolveExternal(options.openapi, ref, options, function (data, source, options) {
                            if (!refs[ref].resolved) {
                                var external = {};
                                external.context = refs[ref];
                                external.$ref = ref;
                                external.original = clone(data);
                                external.updated = data;
                                external.source = source;
                                options.externals.push(external);
                                refs[ref].resolved = true;
                            }
                            var localOptions = Object.assign({}, options, { source: '',
                                resolver: { actions: options.resolver.actions,
                                    depth: options.resolver.actions.length - 1, base: options.resolver.base } });
                            if (options.patch && refs[ref].description && !data.description &&
                                (typeof data === 'object')) {
                                data.description = refs[ref].description;
                            }
                            refs[ref].data = data;
                            // sorting $refs by length causes bugs (due to overlapping regions?)
                            var pointers = unique(refs[ref].paths);
                            for (var _i = 0, pointers_1 = pointers; _i < pointers_1.length; _i++) {
                                var ptr = pointers_1[_i];
                                // shared x-ms-examples $refs confuse the fixupRefs heuristic in index.js
                                if (refs[ref].resolvedAt && (ptr !== refs[ref].resolvedAt) && (ptr.indexOf('x-ms-examples/') < 0)) {
                                    if (options.verbose > 1)
                                        console.log('Creating pointer to data at', ptr);
                                    jptr(options.openapi, ptr, { $ref: refs[ref].resolvedAt, 'x-miro': ref }); // resolutionCase:E (new object)
                                }
                                else {
                                    if (refs[ref].resolvedAt) {
                                        if (options.verbose > 1)
                                            console.log('Avoiding circular reference');
                                    }
                                    else {
                                        refs[ref].resolvedAt = ptr;
                                        if (options.verbose > 1)
                                            console.log('Creating initial clone of data at', ptr);
                                    }
                                    var cdata = clone(data);
                                    jptr(options.openapi, ptr, cdata); // resolutionCase:F (cloned:yes)
                                }
                            }
                            if (options.resolver.actions[localOptions.resolver.depth].length === 0) {
                                //options.resolver.actions[localOptions.resolver.depth].push(function () { return scanExternalRefs(localOptions) });
                                options.resolver.actions[localOptions.resolver.depth].push(function () { return findExternalRefs(localOptions); }); // findExternalRefs calls scanExternalRefs
                            }
                        });
                    });
                }
            };
            for (var ref in refs) {
                _loop_1(ref);
            }
        })
            .catch(function (ex) {
            if (options.verbose)
                console.warn(ex);
            rej(ex);
        });
        var result = { options: options };
        result.actions = options.resolver.actions[options.resolver.depth];
        res(result);
    });
}
var serial = function (funcs) {
    return funcs.reduce(function (promise, func) {
        return promise.then(function (result) { return func().then(Array.prototype.concat.bind(result)); });
    }, Promise.resolve([]));
};
function loopReferences(options, res, rej) {
    options.resolver.actions.push([]);
    findExternalRefs(options)
        .then(function (data) {
        serial(data.actions)
            .then(function () {
            if (options.resolver.depth >= options.resolver.actions.length) {
                console.warn('Ran off the end of resolver actions');
                return res(true);
            }
            else {
                options.resolver.depth++;
                if (options.resolver.actions[options.resolver.depth].length) {
                    setTimeout(function () {
                        loopReferences(data.options, res, rej);
                    }, 0);
                }
                else {
                    if (options.verbose > 1)
                        console.log(common.colour.yellow + 'Finished resolution!', common.colour.normal);
                    res(options);
                }
            }
        })
            .catch(function (ex) {
            if (options.verbose)
                console.warn(ex);
            rej(ex);
        });
    })
        .catch(function (ex) {
        if (options.verbose)
            console.warn(ex);
        rej(ex);
    });
}
function setupOptions(options) {
    if (!options.cache)
        options.cache = {};
    if (options.source) {
        var srcUrl = url.parse(options.source);
        if (!srcUrl.protocol) {
            options.source = path.resolve(options.source);
        }
    }
    if (!options.externals)
        options.externals = [];
    if (!options.externalRefs)
        options.externalRefs = [];
    options.rewriteRefs = true;
    options.resolver = {};
    options.resolver.depth = 0;
    options.resolver.base = options.source;
    options.resolver.actions = [[]];
}
/** compatibility function for swagger2openapi */
function optionalResolve(options) {
    setupOptions(options);
    return new Promise(function (res, rej) {
        if (options.resolve)
            loopReferences(options, res, rej);
        else
            res(options);
    });
}
function resolve(openapi, source, options) {
    if (!options)
        options = {};
    options.openapi = openapi;
    options.source = source;
    options.resolve = true;
    setupOptions(options);
    return new Promise(function (res, rej) {
        loopReferences(options, res, rej);
    });
}
module.exports = {
    optionalResolve: optionalResolve,
    resolve: resolve
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* functions to walk an OpenAPI schema object and traverse all subschemas
* calling a callback function on each one
*/
/**
* obtains the default starting state for the `state` object used
* by walkSchema
* @return the state object suitable for use in walkSchema
*/
function getDefaultState() {
    return { depth: 0, seen: new WeakMap(), top: true, combine: false, allowRefSiblings: false };
}
/**
* begins the walk of a schema object, or the `state` object used
* by walkSchema
* @param parent the parent schema, if any. Use empty object if none
* @param state the initial starting state of the walker, usually obtained from `getDefaultState`
* @param callback, a function taking a schema, parent and state to be called on this and all subschemas
* @return the schema object
*/
function walkSchema(schema, parent, state, callback) {
    if (typeof state.depth === 'undefined')
        state = getDefaultState();
    if ((schema === null) || (typeof schema === 'undefined'))
        return schema;
    if (typeof schema.$ref !== 'undefined') {
        var temp = { $ref: schema.$ref };
        if (state.allowRefSiblings && schema.description) {
            temp.description = schema.description;
        }
        callback(temp, parent, state);
        return temp; // all other properties SHALL be ignored
    }
    if (state.combine) {
        if (schema.allOf && Array.isArray(schema.allOf) && schema.allOf.length === 1) {
            schema = Object.assign({}, schema.allOf[0], schema);
            delete schema.allOf;
        }
        if (schema.anyOf && Array.isArray(schema.anyOf) && schema.anyOf.length === 1) {
            schema = Object.assign({}, schema.anyOf[0], schema);
            delete schema.anyOf;
        }
        if (schema.oneOf && Array.isArray(schema.oneOf) && schema.oneOf.length === 1) {
            schema = Object.assign({}, schema.oneOf[0], schema);
            delete schema.oneOf;
        }
    }
    callback(schema, parent, state);
    if (state.seen.has(schema)) {
        return schema;
    }
    //else
    if ((typeof schema === 'object') && (schema !== null))
        state.seen.set(schema, true);
    state.top = false;
    state.depth++;
    if (typeof schema.items !== 'undefined') {
        state.property = 'items';
        walkSchema(schema.items, schema, state, callback);
    }
    if (schema.additionalItems) {
        if (typeof schema.additionalItems === 'object') {
            state.property = 'additionalItems';
            walkSchema(schema.additionalItems, schema, state, callback);
        }
    }
    if (schema.additionalProperties) {
        if (typeof schema.additionalProperties === 'object') {
            state.property = 'additionalProperties';
            walkSchema(schema.additionalProperties, schema, state, callback);
        }
    }
    if (schema.properties) {
        for (var prop in schema.properties) {
            var subSchema = schema.properties[prop];
            state.property = 'properties/' + prop;
            walkSchema(subSchema, schema, state, callback);
        }
    }
    if (schema.patternProperties) {
        for (var prop in schema.patternProperties) {
            var subSchema = schema.patternProperties[prop];
            state.property = 'patternProperties/' + prop;
            walkSchema(subSchema, schema, state, callback);
        }
    }
    if (schema.allOf) {
        for (var index in schema.allOf) {
            var subSchema = schema.allOf[index];
            state.property = 'allOf/' + index;
            walkSchema(subSchema, schema, state, callback);
        }
    }
    if (schema.anyOf) {
        for (var index in schema.anyOf) {
            var subSchema = schema.anyOf[index];
            state.property = 'anyOf/' + index;
            walkSchema(subSchema, schema, state, callback);
        }
    }
    if (schema.oneOf) {
        for (var index in schema.oneOf) {
            var subSchema = schema.oneOf[index];
            state.property = 'oneOf/' + index;
            walkSchema(subSchema, schema, state, callback);
        }
    }
    if (schema.not) {
        state.property = 'not';
        walkSchema(schema.not, schema, state, callback);
    }
    state.depth--;
    return schema;
}
module.exports = {
    getDefaultState: getDefaultState,
    walkSchema: walkSchema
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var statusCodes = [
    {
        "code": "default",
        "phrase": "Default response"
    },
    {
        "code": "1XX",
        "phrase": "Informational"
    },
    {
        "code": "100",
        "phrase": "Continue"
    },
    {
        "code": "101",
        "phrase": "Switching Protocols"
    },
    {
        "code": "2XX",
        "phrase": "Successful"
    },
    {
        "code": "200",
        "phrase": "OK"
    },
    {
        "code": "201",
        "phrase": "Created"
    },
    {
        "code": "202",
        "phrase": "Accepted"
    },
    {
        "code": "203",
        "phrase": "Non-Authoritative Information"
    },
    {
        "code": "204",
        "phrase": "No Content"
    },
    {
        "code": "205",
        "phrase": "Reset Content"
    },
    {
        "code": "206",
        "phrase": "Partial Content"
    },
    {
        "code": "3XX",
        "phrase": "Redirection"
    },
    {
        "code": "300",
        "phrase": "Multiple Choices"
    },
    {
        "code": "301",
        "phrase": "Moved Permanently"
    },
    {
        "code": "302",
        "phrase": "Found"
    },
    {
        "code": "303",
        "phrase": "See Other"
    },
    {
        "code": "304",
        "phrase": "Not Modified"
    },
    {
        "code": "305",
        "phrase": "Use Proxy"
    },
    {
        "code": "307",
        "phrase": "Temporary Redirect"
    },
    {
        "code": "4XX",
        "phrase": "Client Error"
    },
    {
        "code": "400",
        "phrase": "Bad Request"
    },
    {
        "code": "401",
        "phrase": "Unauthorized"
    },
    {
        "code": "402",
        "phrase": "Payment Required"
    },
    {
        "code": "403",
        "phrase": "Forbidden"
    },
    {
        "code": "404",
        "phrase": "Not Found"
    },
    {
        "code": "405",
        "phrase": "Method Not Allowed"
    },
    {
        "code": "406",
        "phrase": "Not Acceptable"
    },
    {
        "code": "407",
        "phrase": "Proxy Authentication Required"
    },
    {
        "code": "408",
        "phrase": "Request Timeout"
    },
    {
        "code": "409",
        "phrase": "Conflict"
    },
    {
        "code": "410",
        "phrase": "Gone"
    },
    {
        "code": "411",
        "phrase": "Length Required"
    },
    {
        "code": "412",
        "phrase": "Precondition Failed"
    },
    {
        "code": "413",
        "phrase": "Payload Too Large"
    },
    {
        "code": "414",
        "phrase": "URI Too Long"
    },
    {
        "code": "415",
        "phrase": "Unsupported Media Type"
    },
    {
        "code": "416",
        "phrase": "Range Not Satisfiable"
    },
    {
        "code": "417",
        "phrase": "Expectation Failed"
    },
    {
        "code": "418",
        "phrase": "I'm a teapot"
    },
    {
        "code": "421",
        "phrase": "Misdirected request"
    },
    {
        "code": "426",
        "phrase": "Upgrade Required"
    },
    {
        "code": "5XX",
        "phrase": "Server Error"
    },
    {
        "code": "500",
        "phrase": "Internal Server Error"
    },
    {
        "code": "501",
        "phrase": "Not Implemented"
    },
    {
        "code": "502",
        "phrase": "Bad Gateway"
    },
    {
        "code": "503",
        "phrase": "Service Unavailable"
    },
    {
        "code": "504",
        "phrase": "Gateway Time-out"
    },
    {
        "code": "505",
        "phrase": "HTTP Version Not Supported"
    },
    {
        "code": "102",
        "phrase": "Processing"
    },
    {
        "code": "103",
        "phrase": "Early Hints"
    },
    {
        "code": "207",
        "phrase": "Multi-Status"
    },
    {
        "code": "226",
        "phrase": "IM Used"
    },
    {
        "code": "308",
        "phrase": "Permanent Redirect"
    },
    {
        "code": "422",
        "phrase": "Unprocessable Entity"
    },
    {
        "code": "423",
        "phrase": "Locked"
    },
    {
        "code": "424",
        "phrase": "Failed Dependency"
    },
    {
        "code": "428",
        "phrase": "Precondition Required"
    },
    {
        "code": "429",
        "phrase": "Too Many Requests"
    },
    {
        "code": "431",
        "phrase": "Request Header Fields Too Large"
    },
    {
        "code": "451",
        "phrase": "Unavailable For Legal Reasons"
    },
    {
        "code": "506",
        "phrase": "Variant Also Negotiates"
    },
    {
        "code": "507",
        "phrase": "Insufficient Storage"
    },
    {
        "code": "511",
        "phrase": "Network Authentication Required"
    },
    {
        "code": "7XX",
        "phrase": "Developer Error"
    }
];
module.exports = {
    statusCodes: statusCodes
};


/***/ }),
/* 42 */
/***/ (function(module) {

module.exports = {"name":"swagger2openapi","version":"3.2.14","description":"Convert Swagger 2.0 definitions to OpenApi 3.0 and validate","main":"index.js","bin":{"swagger2openapi":"./swagger2openapi.js","oas-validate":"./oas-validate.js","oas-resolve":"./oas-resolve.js"},"scripts":{"test":"mocha"},"browserify":{"transform":[["babelify",{"presets":["es2015"]}]]},"repository":{"url":"https://github.com/Mermade/oas-kit.git","type":"git"},"author":"Mike Ralphson <mike.ralphson@gmail.com>","license":"BSD-3-Clause","dependencies":{"call-me-maybe":"^1.0.1","js-yaml":"^3.12.0","node-fetch":"^2.3.0","node-readfiles":"^0.2.0","oas-kit-common":"^1.0.4","oas-resolver":"^1.0.12","oas-schema-walker":"^1.1.0","oas-validator":"^1.1.13","reftools":"^1.0.3","yargs":"^12.0.2"},"keywords":["swagger","openapi","openapi2","openapi3","converter","conversion","validator","validation","resolver","lint","linter"],"gitHead":"4862e159745d6ca06044bc3ebabe57a2ad8b7152"};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-bash.js");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-c.js");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-clike.js");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-coffeescript.js");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-cpp.js");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-csharp.js");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-go.js");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-java.js");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-lua.js");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-markup-templating.js");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-markup.js");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-objectivec.js");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-perl.js");

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-php.js");

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-python.js");

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-ruby.js");

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-scala.js");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-sql.js");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-swift.js");

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {


				var addMethods = __webpack_require__(63)
				var methods = ["add","done","toJS","load","search"]
				module.exports = function() {
					var w = new Worker(URL.createObjectURL(new Blob(["/*!\n * ReDoc - OpenAPI/Swagger-generated API Reference Documentation\n * -------------------------------------------------------------\n *   Version: \"2.0.0-rc.0\"\n *   Repo: https://github.com/Rebilly/ReDoc\n */\n/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// define __esModule on exports\n/******/ \t__webpack_require__.r = function(exports) {\n/******/ \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t}\n/******/ \t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t};\n/******/\n/******/ \t// create a fake namespace object\n/******/ \t// mode & 1: value is a module id, require it\n/******/ \t// mode & 2: merge all properties of value into the ns\n/******/ \t// mode & 4: return value when already ns object\n/******/ \t// mode & 8|1: behave like require\n/******/ \t__webpack_require__.t = function(value, mode) {\n/******/ \t\tif(mode & 1) value = __webpack_require__(value);\n/******/ \t\tif(mode & 8) return value;\n/******/ \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n/******/ \t\tvar ns = Object.create(null);\n/******/ \t\t__webpack_require__.r(ns);\n/******/ \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n/******/ \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n/******/ \t\treturn ns;\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 69);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar store = __webpack_require__(24)('wks');\nvar uid = __webpack_require__(17);\nvar Symbol = __webpack_require__(1).Symbol;\nvar USE_SYMBOL = typeof Symbol == 'function';\n\nvar $exports = module.exports = function (name) {\n  return store[name] || (store[name] =\n    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));\n};\n\n$exports.store = store;\n\n\n/***/ }),\n/* 1 */\n/***/ (function(module, exports) {\n\n// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028\nvar global = module.exports = typeof window != 'undefined' && window.Math == Math\n  ? window : typeof self != 'undefined' && self.Math == Math ? self\n  // eslint-disable-next-line no-new-func\n  : Function('return this')();\nif (typeof __g == 'number') __g = global; // eslint-disable-line no-undef\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**\n * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.5\n * Copyright (C) 2018 Oliver Nightingale\n * @license MIT\n */\n\n;(function(){\n\n/**\n * A convenience function for configuring and constructing\n * a new lunr Index.\n *\n * A lunr.Builder instance is created and the pipeline setup\n * with a trimmer, stop word filter and stemmer.\n *\n * This builder object is yielded to the configuration function\n * that is passed as a parameter, allowing the list of fields\n * and other builder parameters to be customised.\n *\n * All documents _must_ be added within the passed config function.\n *\n * @example\n * var idx = lunr(function () {\n *   this.field('title')\n *   this.field('body')\n *   this.ref('id')\n *\n *   documents.forEach(function (doc) {\n *     this.add(doc)\n *   }, this)\n * })\n *\n * @see {@link lunr.Builder}\n * @see {@link lunr.Pipeline}\n * @see {@link lunr.trimmer}\n * @see {@link lunr.stopWordFilter}\n * @see {@link lunr.stemmer}\n * @namespace {function} lunr\n */\nvar lunr = function (config) {\n  var builder = new lunr.Builder\n\n  builder.pipeline.add(\n    lunr.trimmer,\n    lunr.stopWordFilter,\n    lunr.stemmer\n  )\n\n  builder.searchPipeline.add(\n    lunr.stemmer\n  )\n\n  config.call(builder, builder)\n  return builder.build()\n}\n\nlunr.version = \"2.3.5\"\n/*!\n * lunr.utils\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * A namespace containing utils for the rest of the lunr library\n * @namespace lunr.utils\n */\nlunr.utils = {}\n\n/**\n * Print a warning message to the console.\n *\n * @param {String} message The message to be printed.\n * @memberOf lunr.utils\n * @function\n */\nlunr.utils.warn = (function (global) {\n  /* eslint-disable no-console */\n  return function (message) {\n    if (global.console && console.warn) {\n      console.warn(message)\n    }\n  }\n  /* eslint-enable no-console */\n})(this)\n\n/**\n * Convert an object to a string.\n *\n * In the case of `null` and `undefined` the function returns\n * the empty string, in all other cases the result of calling\n * `toString` on the passed object is returned.\n *\n * @param {Any} obj The object to convert to a string.\n * @return {String} string representation of the passed object.\n * @memberOf lunr.utils\n */\nlunr.utils.asString = function (obj) {\n  if (obj === void 0 || obj === null) {\n    return \"\"\n  } else {\n    return obj.toString()\n  }\n}\n\n/**\n * Clones an object.\n *\n * Will create a copy of an existing object such that any mutations\n * on the copy cannot affect the original.\n *\n * Only shallow objects are supported, passing a nested object to this\n * function will cause a TypeError.\n *\n * Objects with primitives, and arrays of primitives are supported.\n *\n * @param {Object} obj The object to clone.\n * @return {Object} a clone of the passed object.\n * @throws {TypeError} when a nested object is passed.\n * @memberOf Utils\n */\nlunr.utils.clone = function (obj) {\n  if (obj === null || obj === undefined) {\n    return obj\n  }\n\n  var clone = Object.create(null),\n      keys = Object.keys(obj)\n\n  for (var i = 0; i < keys.length; i++) {\n    var key = keys[i],\n        val = obj[key]\n\n    if (Array.isArray(val)) {\n      clone[key] = val.slice()\n      continue\n    }\n\n    if (typeof val === 'string' ||\n        typeof val === 'number' ||\n        typeof val === 'boolean') {\n      clone[key] = val\n      continue\n    }\n\n    throw new TypeError(\"clone is not deep and does not support nested objects\")\n  }\n\n  return clone\n}\nlunr.FieldRef = function (docRef, fieldName, stringValue) {\n  this.docRef = docRef\n  this.fieldName = fieldName\n  this._stringValue = stringValue\n}\n\nlunr.FieldRef.joiner = \"/\"\n\nlunr.FieldRef.fromString = function (s) {\n  var n = s.indexOf(lunr.FieldRef.joiner)\n\n  if (n === -1) {\n    throw \"malformed field ref string\"\n  }\n\n  var fieldRef = s.slice(0, n),\n      docRef = s.slice(n + 1)\n\n  return new lunr.FieldRef (docRef, fieldRef, s)\n}\n\nlunr.FieldRef.prototype.toString = function () {\n  if (this._stringValue == undefined) {\n    this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef\n  }\n\n  return this._stringValue\n}\n/*!\n * lunr.Set\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * A lunr set.\n *\n * @constructor\n */\nlunr.Set = function (elements) {\n  this.elements = Object.create(null)\n\n  if (elements) {\n    this.length = elements.length\n\n    for (var i = 0; i < this.length; i++) {\n      this.elements[elements[i]] = true\n    }\n  } else {\n    this.length = 0\n  }\n}\n\n/**\n * A complete set that contains all elements.\n *\n * @static\n * @readonly\n * @type {lunr.Set}\n */\nlunr.Set.complete = {\n  intersect: function (other) {\n    return other\n  },\n\n  union: function (other) {\n    return other\n  },\n\n  contains: function () {\n    return true\n  }\n}\n\n/**\n * An empty set that contains no elements.\n *\n * @static\n * @readonly\n * @type {lunr.Set}\n */\nlunr.Set.empty = {\n  intersect: function () {\n    return this\n  },\n\n  union: function (other) {\n    return other\n  },\n\n  contains: function () {\n    return false\n  }\n}\n\n/**\n * Returns true if this set contains the specified object.\n *\n * @param {object} object - Object whose presence in this set is to be tested.\n * @returns {boolean} - True if this set contains the specified object.\n */\nlunr.Set.prototype.contains = function (object) {\n  return !!this.elements[object]\n}\n\n/**\n * Returns a new set containing only the elements that are present in both\n * this set and the specified set.\n *\n * @param {lunr.Set} other - set to intersect with this set.\n * @returns {lunr.Set} a new set that is the intersection of this and the specified set.\n */\n\nlunr.Set.prototype.intersect = function (other) {\n  var a, b, elements, intersection = []\n\n  if (other === lunr.Set.complete) {\n    return this\n  }\n\n  if (other === lunr.Set.empty) {\n    return other\n  }\n\n  if (this.length < other.length) {\n    a = this\n    b = other\n  } else {\n    a = other\n    b = this\n  }\n\n  elements = Object.keys(a.elements)\n\n  for (var i = 0; i < elements.length; i++) {\n    var element = elements[i]\n    if (element in b.elements) {\n      intersection.push(element)\n    }\n  }\n\n  return new lunr.Set (intersection)\n}\n\n/**\n * Returns a new set combining the elements of this and the specified set.\n *\n * @param {lunr.Set} other - set to union with this set.\n * @return {lunr.Set} a new set that is the union of this and the specified set.\n */\n\nlunr.Set.prototype.union = function (other) {\n  if (other === lunr.Set.complete) {\n    return lunr.Set.complete\n  }\n\n  if (other === lunr.Set.empty) {\n    return this\n  }\n\n  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))\n}\n/**\n * A function to calculate the inverse document frequency for\n * a posting. This is shared between the builder and the index\n *\n * @private\n * @param {object} posting - The posting for a given term\n * @param {number} documentCount - The total number of documents.\n */\nlunr.idf = function (posting, documentCount) {\n  var documentsWithTerm = 0\n\n  for (var fieldName in posting) {\n    if (fieldName == '_index') continue // Ignore the term index, its not a field\n    documentsWithTerm += Object.keys(posting[fieldName]).length\n  }\n\n  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)\n\n  return Math.log(1 + Math.abs(x))\n}\n\n/**\n * A token wraps a string representation of a token\n * as it is passed through the text processing pipeline.\n *\n * @constructor\n * @param {string} [str=''] - The string token being wrapped.\n * @param {object} [metadata={}] - Metadata associated with this token.\n */\nlunr.Token = function (str, metadata) {\n  this.str = str || \"\"\n  this.metadata = metadata || {}\n}\n\n/**\n * Returns the token string that is being wrapped by this object.\n *\n * @returns {string}\n */\nlunr.Token.prototype.toString = function () {\n  return this.str\n}\n\n/**\n * A token update function is used when updating or optionally\n * when cloning a token.\n *\n * @callback lunr.Token~updateFunction\n * @param {string} str - The string representation of the token.\n * @param {Object} metadata - All metadata associated with this token.\n */\n\n/**\n * Applies the given function to the wrapped string token.\n *\n * @example\n * token.update(function (str, metadata) {\n *   return str.toUpperCase()\n * })\n *\n * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.\n * @returns {lunr.Token}\n */\nlunr.Token.prototype.update = function (fn) {\n  this.str = fn(this.str, this.metadata)\n  return this\n}\n\n/**\n * Creates a clone of this token. Optionally a function can be\n * applied to the cloned token.\n *\n * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.\n * @returns {lunr.Token}\n */\nlunr.Token.prototype.clone = function (fn) {\n  fn = fn || function (s) { return s }\n  return new lunr.Token (fn(this.str, this.metadata), this.metadata)\n}\n/*!\n * lunr.tokenizer\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * A function for splitting a string into tokens ready to be inserted into\n * the search index. Uses `lunr.tokenizer.separator` to split strings, change\n * the value of this property to change how strings are split into tokens.\n *\n * This tokenizer will convert its parameter to a string by calling `toString` and\n * then will split this string on the character in `lunr.tokenizer.separator`.\n * Arrays will have their elements converted to strings and wrapped in a lunr.Token.\n *\n * Optional metadata can be passed to the tokenizer, this metadata will be cloned and\n * added as metadata to every token that is created from the object to be tokenized.\n *\n * @static\n * @param {?(string|object|object[])} obj - The object to convert into tokens\n * @param {?object} metadata - Optional metadata to associate with every token\n * @returns {lunr.Token[]}\n * @see {@link lunr.Pipeline}\n */\nlunr.tokenizer = function (obj, metadata) {\n  if (obj == null || obj == undefined) {\n    return []\n  }\n\n  if (Array.isArray(obj)) {\n    return obj.map(function (t) {\n      return new lunr.Token(\n        lunr.utils.asString(t).toLowerCase(),\n        lunr.utils.clone(metadata)\n      )\n    })\n  }\n\n  var str = obj.toString().trim().toLowerCase(),\n      len = str.length,\n      tokens = []\n\n  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {\n    var char = str.charAt(sliceEnd),\n        sliceLength = sliceEnd - sliceStart\n\n    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {\n\n      if (sliceLength > 0) {\n        var tokenMetadata = lunr.utils.clone(metadata) || {}\n        tokenMetadata[\"position\"] = [sliceStart, sliceLength]\n        tokenMetadata[\"index\"] = tokens.length\n\n        tokens.push(\n          new lunr.Token (\n            str.slice(sliceStart, sliceEnd),\n            tokenMetadata\n          )\n        )\n      }\n\n      sliceStart = sliceEnd + 1\n    }\n\n  }\n\n  return tokens\n}\n\n/**\n * The separator used to split a string into tokens. Override this property to change the behaviour of\n * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.\n *\n * @static\n * @see lunr.tokenizer\n */\nlunr.tokenizer.separator = /[\\s\\-]+/\n/*!\n * lunr.Pipeline\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * lunr.Pipelines maintain an ordered list of functions to be applied to all\n * tokens in documents entering the search index and queries being ran against\n * the index.\n *\n * An instance of lunr.Index created with the lunr shortcut will contain a\n * pipeline with a stop word filter and an English language stemmer. Extra\n * functions can be added before or after either of these functions or these\n * default functions can be removed.\n *\n * When run the pipeline will call each function in turn, passing a token, the\n * index of that token in the original list of all tokens and finally a list of\n * all the original tokens.\n *\n * The output of functions in the pipeline will be passed to the next function\n * in the pipeline. To exclude a token from entering the index the function\n * should return undefined, the rest of the pipeline will not be called with\n * this token.\n *\n * For serialisation of pipelines to work, all functions used in an instance of\n * a pipeline should be registered with lunr.Pipeline. Registered functions can\n * then be loaded. If trying to load a serialised pipeline that uses functions\n * that are not registered an error will be thrown.\n *\n * If not planning on serialising the pipeline then registering pipeline functions\n * is not necessary.\n *\n * @constructor\n */\nlunr.Pipeline = function () {\n  this._stack = []\n}\n\nlunr.Pipeline.registeredFunctions = Object.create(null)\n\n/**\n * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token\n * string as well as all known metadata. A pipeline function can mutate the token string\n * or mutate (or add) metadata for a given token.\n *\n * A pipeline function can indicate that the passed token should be discarded by returning\n * null. This token will not be passed to any downstream pipeline functions and will not be\n * added to the index.\n *\n * Multiple tokens can be returned by returning an array of tokens. Each token will be passed\n * to any downstream pipeline functions and all will returned tokens will be added to the index.\n *\n * Any number of pipeline functions may be chained together using a lunr.Pipeline.\n *\n * @interface lunr.PipelineFunction\n * @param {lunr.Token} token - A token from the document being processed.\n * @param {number} i - The index of this token in the complete list of tokens for this document/field.\n * @param {lunr.Token[]} tokens - All tokens for this document/field.\n * @returns {(?lunr.Token|lunr.Token[])}\n */\n\n/**\n * Register a function with the pipeline.\n *\n * Functions that are used in the pipeline should be registered if the pipeline\n * needs to be serialised, or a serialised pipeline needs to be loaded.\n *\n * Registering a function does not add it to a pipeline, functions must still be\n * added to instances of the pipeline for them to be used when running a pipeline.\n *\n * @param {lunr.PipelineFunction} fn - The function to check for.\n * @param {String} label - The label to register this function with\n */\nlunr.Pipeline.registerFunction = function (fn, label) {\n  if (label in this.registeredFunctions) {\n    lunr.utils.warn('Overwriting existing registered function: ' + label)\n  }\n\n  fn.label = label\n  lunr.Pipeline.registeredFunctions[fn.label] = fn\n}\n\n/**\n * Warns if the function is not registered as a Pipeline function.\n *\n * @param {lunr.PipelineFunction} fn - The function to check for.\n * @private\n */\nlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {\n  var isRegistered = fn.label && (fn.label in this.registeredFunctions)\n\n  if (!isRegistered) {\n    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\\n', fn)\n  }\n}\n\n/**\n * Loads a previously serialised pipeline.\n *\n * All functions to be loaded must already be registered with lunr.Pipeline.\n * If any function from the serialised data has not been registered then an\n * error will be thrown.\n *\n * @param {Object} serialised - The serialised pipeline to load.\n * @returns {lunr.Pipeline}\n */\nlunr.Pipeline.load = function (serialised) {\n  var pipeline = new lunr.Pipeline\n\n  serialised.forEach(function (fnName) {\n    var fn = lunr.Pipeline.registeredFunctions[fnName]\n\n    if (fn) {\n      pipeline.add(fn)\n    } else {\n      throw new Error('Cannot load unregistered function: ' + fnName)\n    }\n  })\n\n  return pipeline\n}\n\n/**\n * Adds new functions to the end of the pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.\n */\nlunr.Pipeline.prototype.add = function () {\n  var fns = Array.prototype.slice.call(arguments)\n\n  fns.forEach(function (fn) {\n    lunr.Pipeline.warnIfFunctionNotRegistered(fn)\n    this._stack.push(fn)\n  }, this)\n}\n\n/**\n * Adds a single function after a function that already exists in the\n * pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.\n * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.\n */\nlunr.Pipeline.prototype.after = function (existingFn, newFn) {\n  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)\n\n  var pos = this._stack.indexOf(existingFn)\n  if (pos == -1) {\n    throw new Error('Cannot find existingFn')\n  }\n\n  pos = pos + 1\n  this._stack.splice(pos, 0, newFn)\n}\n\n/**\n * Adds a single function before a function that already exists in the\n * pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.\n * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.\n */\nlunr.Pipeline.prototype.before = function (existingFn, newFn) {\n  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)\n\n  var pos = this._stack.indexOf(existingFn)\n  if (pos == -1) {\n    throw new Error('Cannot find existingFn')\n  }\n\n  this._stack.splice(pos, 0, newFn)\n}\n\n/**\n * Removes a function from the pipeline.\n *\n * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.\n */\nlunr.Pipeline.prototype.remove = function (fn) {\n  var pos = this._stack.indexOf(fn)\n  if (pos == -1) {\n    return\n  }\n\n  this._stack.splice(pos, 1)\n}\n\n/**\n * Runs the current list of functions that make up the pipeline against the\n * passed tokens.\n *\n * @param {Array} tokens The tokens to run through the pipeline.\n * @returns {Array}\n */\nlunr.Pipeline.prototype.run = function (tokens) {\n  var stackLength = this._stack.length\n\n  for (var i = 0; i < stackLength; i++) {\n    var fn = this._stack[i]\n    var memo = []\n\n    for (var j = 0; j < tokens.length; j++) {\n      var result = fn(tokens[j], j, tokens)\n\n      if (result === void 0 || result === '') continue\n\n      if (Array.isArray(result)) {\n        for (var k = 0; k < result.length; k++) {\n          memo.push(result[k])\n        }\n      } else {\n        memo.push(result)\n      }\n    }\n\n    tokens = memo\n  }\n\n  return tokens\n}\n\n/**\n * Convenience method for passing a string through a pipeline and getting\n * strings out. This method takes care of wrapping the passed string in a\n * token and mapping the resulting tokens back to strings.\n *\n * @param {string} str - The string to pass through the pipeline.\n * @param {?object} metadata - Optional metadata to associate with the token\n * passed to the pipeline.\n * @returns {string[]}\n */\nlunr.Pipeline.prototype.runString = function (str, metadata) {\n  var token = new lunr.Token (str, metadata)\n\n  return this.run([token]).map(function (t) {\n    return t.toString()\n  })\n}\n\n/**\n * Resets the pipeline by removing any existing processors.\n *\n */\nlunr.Pipeline.prototype.reset = function () {\n  this._stack = []\n}\n\n/**\n * Returns a representation of the pipeline ready for serialisation.\n *\n * Logs a warning if the function has not been registered.\n *\n * @returns {Array}\n */\nlunr.Pipeline.prototype.toJSON = function () {\n  return this._stack.map(function (fn) {\n    lunr.Pipeline.warnIfFunctionNotRegistered(fn)\n\n    return fn.label\n  })\n}\n/*!\n * lunr.Vector\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * A vector is used to construct the vector space of documents and queries. These\n * vectors support operations to determine the similarity between two documents or\n * a document and a query.\n *\n * Normally no parameters are required for initializing a vector, but in the case of\n * loading a previously dumped vector the raw elements can be provided to the constructor.\n *\n * For performance reasons vectors are implemented with a flat array, where an elements\n * index is immediately followed by its value. E.g. [index, value, index, value]. This\n * allows the underlying array to be as sparse as possible and still offer decent\n * performance when being used for vector calculations.\n *\n * @constructor\n * @param {Number[]} [elements] - The flat list of element index and element value pairs.\n */\nlunr.Vector = function (elements) {\n  this._magnitude = 0\n  this.elements = elements || []\n}\n\n\n/**\n * Calculates the position within the vector to insert a given index.\n *\n * This is used internally by insert and upsert. If there are duplicate indexes then\n * the position is returned as if the value for that index were to be updated, but it\n * is the callers responsibility to check whether there is a duplicate at that index\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @returns {Number}\n */\nlunr.Vector.prototype.positionForIndex = function (index) {\n  // For an empty vector the tuple can be inserted at the beginning\n  if (this.elements.length == 0) {\n    return 0\n  }\n\n  var start = 0,\n      end = this.elements.length / 2,\n      sliceLength = end - start,\n      pivotPoint = Math.floor(sliceLength / 2),\n      pivotIndex = this.elements[pivotPoint * 2]\n\n  while (sliceLength > 1) {\n    if (pivotIndex < index) {\n      start = pivotPoint\n    }\n\n    if (pivotIndex > index) {\n      end = pivotPoint\n    }\n\n    if (pivotIndex == index) {\n      break\n    }\n\n    sliceLength = end - start\n    pivotPoint = start + Math.floor(sliceLength / 2)\n    pivotIndex = this.elements[pivotPoint * 2]\n  }\n\n  if (pivotIndex == index) {\n    return pivotPoint * 2\n  }\n\n  if (pivotIndex > index) {\n    return pivotPoint * 2\n  }\n\n  if (pivotIndex < index) {\n    return (pivotPoint + 1) * 2\n  }\n}\n\n/**\n * Inserts an element at an index within the vector.\n *\n * Does not allow duplicates, will throw an error if there is already an entry\n * for this index.\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @param {Number} val - The value to be inserted into the vector.\n */\nlunr.Vector.prototype.insert = function (insertIdx, val) {\n  this.upsert(insertIdx, val, function () {\n    throw \"duplicate index\"\n  })\n}\n\n/**\n * Inserts or updates an existing index within the vector.\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @param {Number} val - The value to be inserted into the vector.\n * @param {function} fn - A function that is called for updates, the existing value and the\n * requested value are passed as arguments\n */\nlunr.Vector.prototype.upsert = function (insertIdx, val, fn) {\n  this._magnitude = 0\n  var position = this.positionForIndex(insertIdx)\n\n  if (this.elements[position] == insertIdx) {\n    this.elements[position + 1] = fn(this.elements[position + 1], val)\n  } else {\n    this.elements.splice(position, 0, insertIdx, val)\n  }\n}\n\n/**\n * Calculates the magnitude of this vector.\n *\n * @returns {Number}\n */\nlunr.Vector.prototype.magnitude = function () {\n  if (this._magnitude) return this._magnitude\n\n  var sumOfSquares = 0,\n      elementsLength = this.elements.length\n\n  for (var i = 1; i < elementsLength; i += 2) {\n    var val = this.elements[i]\n    sumOfSquares += val * val\n  }\n\n  return this._magnitude = Math.sqrt(sumOfSquares)\n}\n\n/**\n * Calculates the dot product of this vector and another vector.\n *\n * @param {lunr.Vector} otherVector - The vector to compute the dot product with.\n * @returns {Number}\n */\nlunr.Vector.prototype.dot = function (otherVector) {\n  var dotProduct = 0,\n      a = this.elements, b = otherVector.elements,\n      aLen = a.length, bLen = b.length,\n      aVal = 0, bVal = 0,\n      i = 0, j = 0\n\n  while (i < aLen && j < bLen) {\n    aVal = a[i], bVal = b[j]\n    if (aVal < bVal) {\n      i += 2\n    } else if (aVal > bVal) {\n      j += 2\n    } else if (aVal == bVal) {\n      dotProduct += a[i + 1] * b[j + 1]\n      i += 2\n      j += 2\n    }\n  }\n\n  return dotProduct\n}\n\n/**\n * Calculates the similarity between this vector and another vector.\n *\n * @param {lunr.Vector} otherVector - The other vector to calculate the\n * similarity with.\n * @returns {Number}\n */\nlunr.Vector.prototype.similarity = function (otherVector) {\n  return this.dot(otherVector) / this.magnitude() || 0\n}\n\n/**\n * Converts the vector to an array of the elements within the vector.\n *\n * @returns {Number[]}\n */\nlunr.Vector.prototype.toArray = function () {\n  var output = new Array (this.elements.length / 2)\n\n  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {\n    output[j] = this.elements[i]\n  }\n\n  return output\n}\n\n/**\n * A JSON serializable representation of the vector.\n *\n * @returns {Number[]}\n */\nlunr.Vector.prototype.toJSON = function () {\n  return this.elements\n}\n/* eslint-disable */\n/*!\n * lunr.stemmer\n * Copyright (C) 2018 Oliver Nightingale\n * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt\n */\n\n/**\n * lunr.stemmer is an english language stemmer, this is a JavaScript\n * implementation of the PorterStemmer taken from http://tartarus.org/~martin\n *\n * @static\n * @implements {lunr.PipelineFunction}\n * @param {lunr.Token} token - The string to stem\n * @returns {lunr.Token}\n * @see {@link lunr.Pipeline}\n * @function\n */\nlunr.stemmer = (function(){\n  var step2list = {\n      \"ational\" : \"ate\",\n      \"tional\" : \"tion\",\n      \"enci\" : \"ence\",\n      \"anci\" : \"ance\",\n      \"izer\" : \"ize\",\n      \"bli\" : \"ble\",\n      \"alli\" : \"al\",\n      \"entli\" : \"ent\",\n      \"eli\" : \"e\",\n      \"ousli\" : \"ous\",\n      \"ization\" : \"ize\",\n      \"ation\" : \"ate\",\n      \"ator\" : \"ate\",\n      \"alism\" : \"al\",\n      \"iveness\" : \"ive\",\n      \"fulness\" : \"ful\",\n      \"ousness\" : \"ous\",\n      \"aliti\" : \"al\",\n      \"iviti\" : \"ive\",\n      \"biliti\" : \"ble\",\n      \"logi\" : \"log\"\n    },\n\n    step3list = {\n      \"icate\" : \"ic\",\n      \"ative\" : \"\",\n      \"alize\" : \"al\",\n      \"iciti\" : \"ic\",\n      \"ical\" : \"ic\",\n      \"ful\" : \"\",\n      \"ness\" : \"\"\n    },\n\n    c = \"[^aeiou]\",          // consonant\n    v = \"[aeiouy]\",          // vowel\n    C = c + \"[^aeiouy]*\",    // consonant sequence\n    V = v + \"[aeiou]*\",      // vowel sequence\n\n    mgr0 = \"^(\" + C + \")?\" + V + C,               // [C]VC... is m>0\n    meq1 = \"^(\" + C + \")?\" + V + C + \"(\" + V + \")?$\",  // [C]VC[V] is m=1\n    mgr1 = \"^(\" + C + \")?\" + V + C + V + C,       // [C]VCVC... is m>1\n    s_v = \"^(\" + C + \")?\" + v;                   // vowel in stem\n\n  var re_mgr0 = new RegExp(mgr0);\n  var re_mgr1 = new RegExp(mgr1);\n  var re_meq1 = new RegExp(meq1);\n  var re_s_v = new RegExp(s_v);\n\n  var re_1a = /^(.+?)(ss|i)es$/;\n  var re2_1a = /^(.+?)([^s])s$/;\n  var re_1b = /^(.+?)eed$/;\n  var re2_1b = /^(.+?)(ed|ing)$/;\n  var re_1b_2 = /.$/;\n  var re2_1b_2 = /(at|bl|iz)$/;\n  var re3_1b_2 = new RegExp(\"([^aeiouylsz])\\\\1$\");\n  var re4_1b_2 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n\n  var re_1c = /^(.+?[^aeiou])y$/;\n  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;\n\n  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;\n\n  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;\n  var re2_4 = /^(.+?)(s|t)(ion)$/;\n\n  var re_5 = /^(.+?)e$/;\n  var re_5_1 = /ll$/;\n  var re3_5 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n\n  var porterStemmer = function porterStemmer(w) {\n    var stem,\n      suffix,\n      firstch,\n      re,\n      re2,\n      re3,\n      re4;\n\n    if (w.length < 3) { return w; }\n\n    firstch = w.substr(0,1);\n    if (firstch == \"y\") {\n      w = firstch.toUpperCase() + w.substr(1);\n    }\n\n    // Step 1a\n    re = re_1a\n    re2 = re2_1a;\n\n    if (re.test(w)) { w = w.replace(re,\"$1$2\"); }\n    else if (re2.test(w)) { w = w.replace(re2,\"$1$2\"); }\n\n    // Step 1b\n    re = re_1b;\n    re2 = re2_1b;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      re = re_mgr0;\n      if (re.test(fp[1])) {\n        re = re_1b_2;\n        w = w.replace(re,\"\");\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1];\n      re2 = re_s_v;\n      if (re2.test(stem)) {\n        w = stem;\n        re2 = re2_1b_2;\n        re3 = re3_1b_2;\n        re4 = re4_1b_2;\n        if (re2.test(w)) { w = w + \"e\"; }\n        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,\"\"); }\n        else if (re4.test(w)) { w = w + \"e\"; }\n      }\n    }\n\n    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)\n    re = re_1c;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      w = stem + \"i\";\n    }\n\n    // Step 2\n    re = re_2;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = re_mgr0;\n      if (re.test(stem)) {\n        w = stem + step2list[suffix];\n      }\n    }\n\n    // Step 3\n    re = re_3;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = re_mgr0;\n      if (re.test(stem)) {\n        w = stem + step3list[suffix];\n      }\n    }\n\n    // Step 4\n    re = re_4;\n    re2 = re2_4;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = re_mgr1;\n      if (re.test(stem)) {\n        w = stem;\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1] + fp[2];\n      re2 = re_mgr1;\n      if (re2.test(stem)) {\n        w = stem;\n      }\n    }\n\n    // Step 5\n    re = re_5;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = re_mgr1;\n      re2 = re_meq1;\n      re3 = re3_5;\n      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {\n        w = stem;\n      }\n    }\n\n    re = re_5_1;\n    re2 = re_mgr1;\n    if (re.test(w) && re2.test(w)) {\n      re = re_1b_2;\n      w = w.replace(re,\"\");\n    }\n\n    // and turn initial Y back to y\n\n    if (firstch == \"y\") {\n      w = firstch.toLowerCase() + w.substr(1);\n    }\n\n    return w;\n  };\n\n  return function (token) {\n    return token.update(porterStemmer);\n  }\n})();\n\nlunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')\n/*!\n * lunr.stopWordFilter\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * lunr.generateStopWordFilter builds a stopWordFilter function from the provided\n * list of stop words.\n *\n * The built in lunr.stopWordFilter is built using this generator and can be used\n * to generate custom stopWordFilters for applications or non English languages.\n *\n * @function\n * @param {Array} token The token to pass through the filter\n * @returns {lunr.PipelineFunction}\n * @see lunr.Pipeline\n * @see lunr.stopWordFilter\n */\nlunr.generateStopWordFilter = function (stopWords) {\n  var words = stopWords.reduce(function (memo, stopWord) {\n    memo[stopWord] = stopWord\n    return memo\n  }, {})\n\n  return function (token) {\n    if (token && words[token.toString()] !== token.toString()) return token\n  }\n}\n\n/**\n * lunr.stopWordFilter is an English language stop word list filter, any words\n * contained in the list will not be passed through the filter.\n *\n * This is intended to be used in the Pipeline. If the token does not pass the\n * filter then undefined will be returned.\n *\n * @function\n * @implements {lunr.PipelineFunction}\n * @params {lunr.Token} token - A token to check for being a stop word.\n * @returns {lunr.Token}\n * @see {@link lunr.Pipeline}\n */\nlunr.stopWordFilter = lunr.generateStopWordFilter([\n  'a',\n  'able',\n  'about',\n  'across',\n  'after',\n  'all',\n  'almost',\n  'also',\n  'am',\n  'among',\n  'an',\n  'and',\n  'any',\n  'are',\n  'as',\n  'at',\n  'be',\n  'because',\n  'been',\n  'but',\n  'by',\n  'can',\n  'cannot',\n  'could',\n  'dear',\n  'did',\n  'do',\n  'does',\n  'either',\n  'else',\n  'ever',\n  'every',\n  'for',\n  'from',\n  'get',\n  'got',\n  'had',\n  'has',\n  'have',\n  'he',\n  'her',\n  'hers',\n  'him',\n  'his',\n  'how',\n  'however',\n  'i',\n  'if',\n  'in',\n  'into',\n  'is',\n  'it',\n  'its',\n  'just',\n  'least',\n  'let',\n  'like',\n  'likely',\n  'may',\n  'me',\n  'might',\n  'most',\n  'must',\n  'my',\n  'neither',\n  'no',\n  'nor',\n  'not',\n  'of',\n  'off',\n  'often',\n  'on',\n  'only',\n  'or',\n  'other',\n  'our',\n  'own',\n  'rather',\n  'said',\n  'say',\n  'says',\n  'she',\n  'should',\n  'since',\n  'so',\n  'some',\n  'than',\n  'that',\n  'the',\n  'their',\n  'them',\n  'then',\n  'there',\n  'these',\n  'they',\n  'this',\n  'tis',\n  'to',\n  'too',\n  'twas',\n  'us',\n  'wants',\n  'was',\n  'we',\n  'were',\n  'what',\n  'when',\n  'where',\n  'which',\n  'while',\n  'who',\n  'whom',\n  'why',\n  'will',\n  'with',\n  'would',\n  'yet',\n  'you',\n  'your'\n])\n\nlunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')\n/*!\n * lunr.trimmer\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * lunr.trimmer is a pipeline function for trimming non word\n * characters from the beginning and end of tokens before they\n * enter the index.\n *\n * This implementation may not work correctly for non latin\n * characters and should either be removed or adapted for use\n * with languages with non-latin characters.\n *\n * @static\n * @implements {lunr.PipelineFunction}\n * @param {lunr.Token} token The token to pass through the filter\n * @returns {lunr.Token}\n * @see lunr.Pipeline\n */\nlunr.trimmer = function (token) {\n  return token.update(function (s) {\n    return s.replace(/^\\W+/, '').replace(/\\W+$/, '')\n  })\n}\n\nlunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')\n/*!\n * lunr.TokenSet\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * A token set is used to store the unique list of all tokens\n * within an index. Token sets are also used to represent an\n * incoming query to the index, this query token set and index\n * token set are then intersected to find which tokens to look\n * up in the inverted index.\n *\n * A token set can hold multiple tokens, as in the case of the\n * index token set, or it can hold a single token as in the\n * case of a simple query token set.\n *\n * Additionally token sets are used to perform wildcard matching.\n * Leading, contained and trailing wildcards are supported, and\n * from this edit distance matching can also be provided.\n *\n * Token sets are implemented as a minimal finite state automata,\n * where both common prefixes and suffixes are shared between tokens.\n * This helps to reduce the space used for storing the token set.\n *\n * @constructor\n */\nlunr.TokenSet = function () {\n  this.final = false\n  this.edges = {}\n  this.id = lunr.TokenSet._nextId\n  lunr.TokenSet._nextId += 1\n}\n\n/**\n * Keeps track of the next, auto increment, identifier to assign\n * to a new tokenSet.\n *\n * TokenSets require a unique identifier to be correctly minimised.\n *\n * @private\n */\nlunr.TokenSet._nextId = 1\n\n/**\n * Creates a TokenSet instance from the given sorted array of words.\n *\n * @param {String[]} arr - A sorted array of strings to create the set from.\n * @returns {lunr.TokenSet}\n * @throws Will throw an error if the input array is not sorted.\n */\nlunr.TokenSet.fromArray = function (arr) {\n  var builder = new lunr.TokenSet.Builder\n\n  for (var i = 0, len = arr.length; i < len; i++) {\n    builder.insert(arr[i])\n  }\n\n  builder.finish()\n  return builder.root\n}\n\n/**\n * Creates a token set from a query clause.\n *\n * @private\n * @param {Object} clause - A single clause from lunr.Query.\n * @param {string} clause.term - The query clause term.\n * @param {number} [clause.editDistance] - The optional edit distance for the term.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.fromClause = function (clause) {\n  if ('editDistance' in clause) {\n    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)\n  } else {\n    return lunr.TokenSet.fromString(clause.term)\n  }\n}\n\n/**\n * Creates a token set representing a single string with a specified\n * edit distance.\n *\n * Insertions, deletions, substitutions and transpositions are each\n * treated as an edit distance of 1.\n *\n * Increasing the allowed edit distance will have a dramatic impact\n * on the performance of both creating and intersecting these TokenSets.\n * It is advised to keep the edit distance less than 3.\n *\n * @param {string} str - The string to create the token set from.\n * @param {number} editDistance - The allowed edit distance to match.\n * @returns {lunr.Vector}\n */\nlunr.TokenSet.fromFuzzyString = function (str, editDistance) {\n  var root = new lunr.TokenSet\n\n  var stack = [{\n    node: root,\n    editsRemaining: editDistance,\n    str: str\n  }]\n\n  while (stack.length) {\n    var frame = stack.pop()\n\n    // no edit\n    if (frame.str.length > 0) {\n      var char = frame.str.charAt(0),\n          noEditNode\n\n      if (char in frame.node.edges) {\n        noEditNode = frame.node.edges[char]\n      } else {\n        noEditNode = new lunr.TokenSet\n        frame.node.edges[char] = noEditNode\n      }\n\n      if (frame.str.length == 1) {\n        noEditNode.final = true\n      }\n\n      stack.push({\n        node: noEditNode,\n        editsRemaining: frame.editsRemaining,\n        str: frame.str.slice(1)\n      })\n    }\n\n    // deletion\n    // can only do a deletion if we have enough edits remaining\n    // and if there are characters left to delete in the string\n    if (frame.editsRemaining > 0 && frame.str.length > 1) {\n      var char = frame.str.charAt(1),\n          deletionNode\n\n      if (char in frame.node.edges) {\n        deletionNode = frame.node.edges[char]\n      } else {\n        deletionNode = new lunr.TokenSet\n        frame.node.edges[char] = deletionNode\n      }\n\n      if (frame.str.length <= 2) {\n        deletionNode.final = true\n      } else {\n        stack.push({\n          node: deletionNode,\n          editsRemaining: frame.editsRemaining - 1,\n          str: frame.str.slice(2)\n        })\n      }\n    }\n\n    // deletion\n    // just removing the last character from the str\n    if (frame.editsRemaining > 0 && frame.str.length == 1) {\n      frame.node.final = true\n    }\n\n    // substitution\n    // can only do a substitution if we have enough edits remaining\n    // and if there are characters left to substitute\n    if (frame.editsRemaining > 0 && frame.str.length >= 1) {\n      if (\"*\" in frame.node.edges) {\n        var substitutionNode = frame.node.edges[\"*\"]\n      } else {\n        var substitutionNode = new lunr.TokenSet\n        frame.node.edges[\"*\"] = substitutionNode\n      }\n\n      if (frame.str.length == 1) {\n        substitutionNode.final = true\n      } else {\n        stack.push({\n          node: substitutionNode,\n          editsRemaining: frame.editsRemaining - 1,\n          str: frame.str.slice(1)\n        })\n      }\n    }\n\n    // insertion\n    // can only do insertion if there are edits remaining\n    if (frame.editsRemaining > 0) {\n      if (\"*\" in frame.node.edges) {\n        var insertionNode = frame.node.edges[\"*\"]\n      } else {\n        var insertionNode = new lunr.TokenSet\n        frame.node.edges[\"*\"] = insertionNode\n      }\n\n      if (frame.str.length == 0) {\n        insertionNode.final = true\n      } else {\n        stack.push({\n          node: insertionNode,\n          editsRemaining: frame.editsRemaining - 1,\n          str: frame.str\n        })\n      }\n    }\n\n    // transposition\n    // can only do a transposition if there are edits remaining\n    // and there are enough characters to transpose\n    if (frame.editsRemaining > 0 && frame.str.length > 1) {\n      var charA = frame.str.charAt(0),\n          charB = frame.str.charAt(1),\n          transposeNode\n\n      if (charB in frame.node.edges) {\n        transposeNode = frame.node.edges[charB]\n      } else {\n        transposeNode = new lunr.TokenSet\n        frame.node.edges[charB] = transposeNode\n      }\n\n      if (frame.str.length == 1) {\n        transposeNode.final = true\n      } else {\n        stack.push({\n          node: transposeNode,\n          editsRemaining: frame.editsRemaining - 1,\n          str: charA + frame.str.slice(2)\n        })\n      }\n    }\n  }\n\n  return root\n}\n\n/**\n * Creates a TokenSet from a string.\n *\n * The string may contain one or more wildcard characters (*)\n * that will allow wildcard matching when intersecting with\n * another TokenSet.\n *\n * @param {string} str - The string to create a TokenSet from.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.fromString = function (str) {\n  var node = new lunr.TokenSet,\n      root = node\n\n  /*\n   * Iterates through all characters within the passed string\n   * appending a node for each character.\n   *\n   * When a wildcard character is found then a self\n   * referencing edge is introduced to continually match\n   * any number of any characters.\n   */\n  for (var i = 0, len = str.length; i < len; i++) {\n    var char = str[i],\n        final = (i == len - 1)\n\n    if (char == \"*\") {\n      node.edges[char] = node\n      node.final = final\n\n    } else {\n      var next = new lunr.TokenSet\n      next.final = final\n\n      node.edges[char] = next\n      node = next\n    }\n  }\n\n  return root\n}\n\n/**\n * Converts this TokenSet into an array of strings\n * contained within the TokenSet.\n *\n * @returns {string[]}\n */\nlunr.TokenSet.prototype.toArray = function () {\n  var words = []\n\n  var stack = [{\n    prefix: \"\",\n    node: this\n  }]\n\n  while (stack.length) {\n    var frame = stack.pop(),\n        edges = Object.keys(frame.node.edges),\n        len = edges.length\n\n    if (frame.node.final) {\n      /* In Safari, at this point the prefix is sometimes corrupted, see:\n       * https://github.com/olivernn/lunr.js/issues/279 Calling any\n       * String.prototype method forces Safari to \"cast\" this string to what\n       * it's supposed to be, fixing the bug. */\n      frame.prefix.charAt(0)\n      words.push(frame.prefix)\n    }\n\n    for (var i = 0; i < len; i++) {\n      var edge = edges[i]\n\n      stack.push({\n        prefix: frame.prefix.concat(edge),\n        node: frame.node.edges[edge]\n      })\n    }\n  }\n\n  return words\n}\n\n/**\n * Generates a string representation of a TokenSet.\n *\n * This is intended to allow TokenSets to be used as keys\n * in objects, largely to aid the construction and minimisation\n * of a TokenSet. As such it is not designed to be a human\n * friendly representation of the TokenSet.\n *\n * @returns {string}\n */\nlunr.TokenSet.prototype.toString = function () {\n  // NOTE: Using Object.keys here as this.edges is very likely\n  // to enter 'hash-mode' with many keys being added\n  //\n  // avoiding a for-in loop here as it leads to the function\n  // being de-optimised (at least in V8). From some simple\n  // benchmarks the performance is comparable, but allowing\n  // V8 to optimize may mean easy performance wins in the future.\n\n  if (this._str) {\n    return this._str\n  }\n\n  var str = this.final ? '1' : '0',\n      labels = Object.keys(this.edges).sort(),\n      len = labels.length\n\n  for (var i = 0; i < len; i++) {\n    var label = labels[i],\n        node = this.edges[label]\n\n    str = str + label + node.id\n  }\n\n  return str\n}\n\n/**\n * Returns a new TokenSet that is the intersection of\n * this TokenSet and the passed TokenSet.\n *\n * This intersection will take into account any wildcards\n * contained within the TokenSet.\n *\n * @param {lunr.TokenSet} b - An other TokenSet to intersect with.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.prototype.intersect = function (b) {\n  var output = new lunr.TokenSet,\n      frame = undefined\n\n  var stack = [{\n    qNode: b,\n    output: output,\n    node: this\n  }]\n\n  while (stack.length) {\n    frame = stack.pop()\n\n    // NOTE: As with the #toString method, we are using\n    // Object.keys and a for loop instead of a for-in loop\n    // as both of these objects enter 'hash' mode, causing\n    // the function to be de-optimised in V8\n    var qEdges = Object.keys(frame.qNode.edges),\n        qLen = qEdges.length,\n        nEdges = Object.keys(frame.node.edges),\n        nLen = nEdges.length\n\n    for (var q = 0; q < qLen; q++) {\n      var qEdge = qEdges[q]\n\n      for (var n = 0; n < nLen; n++) {\n        var nEdge = nEdges[n]\n\n        if (nEdge == qEdge || qEdge == '*') {\n          var node = frame.node.edges[nEdge],\n              qNode = frame.qNode.edges[qEdge],\n              final = node.final && qNode.final,\n              next = undefined\n\n          if (nEdge in frame.output.edges) {\n            // an edge already exists for this character\n            // no need to create a new node, just set the finality\n            // bit unless this node is already final\n            next = frame.output.edges[nEdge]\n            next.final = next.final || final\n\n          } else {\n            // no edge exists yet, must create one\n            // set the finality bit and insert it\n            // into the output\n            next = new lunr.TokenSet\n            next.final = final\n            frame.output.edges[nEdge] = next\n          }\n\n          stack.push({\n            qNode: qNode,\n            output: next,\n            node: node\n          })\n        }\n      }\n    }\n  }\n\n  return output\n}\nlunr.TokenSet.Builder = function () {\n  this.previousWord = \"\"\n  this.root = new lunr.TokenSet\n  this.uncheckedNodes = []\n  this.minimizedNodes = {}\n}\n\nlunr.TokenSet.Builder.prototype.insert = function (word) {\n  var node,\n      commonPrefix = 0\n\n  if (word < this.previousWord) {\n    throw new Error (\"Out of order word insertion\")\n  }\n\n  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {\n    if (word[i] != this.previousWord[i]) break\n    commonPrefix++\n  }\n\n  this.minimize(commonPrefix)\n\n  if (this.uncheckedNodes.length == 0) {\n    node = this.root\n  } else {\n    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child\n  }\n\n  for (var i = commonPrefix; i < word.length; i++) {\n    var nextNode = new lunr.TokenSet,\n        char = word[i]\n\n    node.edges[char] = nextNode\n\n    this.uncheckedNodes.push({\n      parent: node,\n      char: char,\n      child: nextNode\n    })\n\n    node = nextNode\n  }\n\n  node.final = true\n  this.previousWord = word\n}\n\nlunr.TokenSet.Builder.prototype.finish = function () {\n  this.minimize(0)\n}\n\nlunr.TokenSet.Builder.prototype.minimize = function (downTo) {\n  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {\n    var node = this.uncheckedNodes[i],\n        childKey = node.child.toString()\n\n    if (childKey in this.minimizedNodes) {\n      node.parent.edges[node.char] = this.minimizedNodes[childKey]\n    } else {\n      // Cache the key for this node since\n      // we know it can't change anymore\n      node.child._str = childKey\n\n      this.minimizedNodes[childKey] = node.child\n    }\n\n    this.uncheckedNodes.pop()\n  }\n}\n/*!\n * lunr.Index\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * An index contains the built index of all documents and provides a query interface\n * to the index.\n *\n * Usually instances of lunr.Index will not be created using this constructor, instead\n * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be\n * used to load previously built and serialized indexes.\n *\n * @constructor\n * @param {Object} attrs - The attributes of the built search index.\n * @param {Object} attrs.invertedIndex - An index of term/field to document reference.\n * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors\n * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.\n * @param {string[]} attrs.fields - The names of indexed document fields.\n * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.\n */\nlunr.Index = function (attrs) {\n  this.invertedIndex = attrs.invertedIndex\n  this.fieldVectors = attrs.fieldVectors\n  this.tokenSet = attrs.tokenSet\n  this.fields = attrs.fields\n  this.pipeline = attrs.pipeline\n}\n\n/**\n * A result contains details of a document matching a search query.\n * @typedef {Object} lunr.Index~Result\n * @property {string} ref - The reference of the document this result represents.\n * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.\n * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.\n */\n\n/**\n * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple\n * query language which itself is parsed into an instance of lunr.Query.\n *\n * For programmatically building queries it is advised to directly use lunr.Query, the query language\n * is best used for human entered text rather than program generated text.\n *\n * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported\n * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'\n * or 'world', though those that contain both will rank higher in the results.\n *\n * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can\n * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding\n * wildcards will increase the number of documents that will be found but can also have a negative\n * impact on query performance, especially with wildcards at the beginning of a term.\n *\n * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term\n * hello in the title field will match this query. Using a field not present in the index will lead\n * to an error being thrown.\n *\n * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term\n * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported\n * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.\n * Avoid large values for edit distance to improve query performance.\n *\n * Each term also supports a presence modifier. By default a term's presence in document is optional, however\n * this can be changed to either required or prohibited. For a term's presence to be required in a document the\n * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and\n * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not\n * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.\n *\n * To escape special characters the backslash character '\\' can be used, this allows searches to include\n * characters that would normally be considered modifiers, e.g. `foo\\~2` will search for a term \"foo~2\" instead\n * of attempting to apply a boost of 2 to the search term \"foo\".\n *\n * @typedef {string} lunr.Index~QueryString\n * @example <caption>Simple single term query</caption>\n * hello\n * @example <caption>Multiple term query</caption>\n * hello world\n * @example <caption>term scoped to a field</caption>\n * title:hello\n * @example <caption>term with a boost of 10</caption>\n * hello^10\n * @example <caption>term with an edit distance of 2</caption>\n * hello~2\n * @example <caption>terms with presence modifiers</caption>\n * -foo +bar baz\n */\n\n/**\n * Performs a search against the index using lunr query syntax.\n *\n * Results will be returned sorted by their score, the most relevant results\n * will be returned first.  For details on how the score is calculated, please see\n * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.\n *\n * For more programmatic querying use lunr.Index#query.\n *\n * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.\n * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.\n * @returns {lunr.Index~Result[]}\n */\nlunr.Index.prototype.search = function (queryString) {\n  return this.query(function (query) {\n    var parser = new lunr.QueryParser(queryString, query)\n    parser.parse()\n  })\n}\n\n/**\n * A query builder callback provides a query object to be used to express\n * the query to perform on the index.\n *\n * @callback lunr.Index~queryBuilder\n * @param {lunr.Query} query - The query object to build up.\n * @this lunr.Query\n */\n\n/**\n * Performs a query against the index using the yielded lunr.Query object.\n *\n * If performing programmatic queries against the index, this method is preferred\n * over lunr.Index#search so as to avoid the additional query parsing overhead.\n *\n * A query object is yielded to the supplied function which should be used to\n * express the query to be run against the index.\n *\n * Note that although this function takes a callback parameter it is _not_ an\n * asynchronous operation, the callback is just yielded a query object to be\n * customized.\n *\n * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.\n * @returns {lunr.Index~Result[]}\n */\nlunr.Index.prototype.query = function (fn) {\n  // for each query clause\n  // * process terms\n  // * expand terms from token set\n  // * find matching documents and metadata\n  // * get document vectors\n  // * score documents\n\n  var query = new lunr.Query(this.fields),\n      matchingFields = Object.create(null),\n      queryVectors = Object.create(null),\n      termFieldCache = Object.create(null),\n      requiredMatches = Object.create(null),\n      prohibitedMatches = Object.create(null)\n\n  /*\n   * To support field level boosts a query vector is created per\n   * field. An empty vector is eagerly created to support negated\n   * queries.\n   */\n  for (var i = 0; i < this.fields.length; i++) {\n    queryVectors[this.fields[i]] = new lunr.Vector\n  }\n\n  fn.call(query, query)\n\n  for (var i = 0; i < query.clauses.length; i++) {\n    /*\n     * Unless the pipeline has been disabled for this term, which is\n     * the case for terms with wildcards, we need to pass the clause\n     * term through the search pipeline. A pipeline returns an array\n     * of processed terms. Pipeline functions may expand the passed\n     * term, which means we may end up performing multiple index lookups\n     * for a single query term.\n     */\n    var clause = query.clauses[i],\n        terms = null,\n        clauseMatches = lunr.Set.complete\n\n    if (clause.usePipeline) {\n      terms = this.pipeline.runString(clause.term, {\n        fields: clause.fields\n      })\n    } else {\n      terms = [clause.term]\n    }\n\n    for (var m = 0; m < terms.length; m++) {\n      var term = terms[m]\n\n      /*\n       * Each term returned from the pipeline needs to use the same query\n       * clause object, e.g. the same boost and or edit distance. The\n       * simplest way to do this is to re-use the clause object but mutate\n       * its term property.\n       */\n      clause.term = term\n\n      /*\n       * From the term in the clause we create a token set which will then\n       * be used to intersect the indexes token set to get a list of terms\n       * to lookup in the inverted index\n       */\n      var termTokenSet = lunr.TokenSet.fromClause(clause),\n          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()\n\n      /*\n       * If a term marked as required does not exist in the tokenSet it is\n       * impossible for the search to return any matches. We set all the field\n       * scoped required matches set to empty and stop examining any further\n       * clauses.\n       */\n      if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {\n        for (var k = 0; k < clause.fields.length; k++) {\n          var field = clause.fields[k]\n          requiredMatches[field] = lunr.Set.empty\n        }\n\n        break\n      }\n\n      for (var j = 0; j < expandedTerms.length; j++) {\n        /*\n         * For each term get the posting and termIndex, this is required for\n         * building the query vector.\n         */\n        var expandedTerm = expandedTerms[j],\n            posting = this.invertedIndex[expandedTerm],\n            termIndex = posting._index\n\n        for (var k = 0; k < clause.fields.length; k++) {\n          /*\n           * For each field that this query term is scoped by (by default\n           * all fields are in scope) we need to get all the document refs\n           * that have this term in that field.\n           *\n           * The posting is the entry in the invertedIndex for the matching\n           * term from above.\n           */\n          var field = clause.fields[k],\n              fieldPosting = posting[field],\n              matchingDocumentRefs = Object.keys(fieldPosting),\n              termField = expandedTerm + \"/\" + field,\n              matchingDocumentsSet = new lunr.Set(matchingDocumentRefs)\n\n          /*\n           * if the presence of this term is required ensure that the matching\n           * documents are added to the set of required matches for this clause.\n           *\n           */\n          if (clause.presence == lunr.Query.presence.REQUIRED) {\n            clauseMatches = clauseMatches.union(matchingDocumentsSet)\n\n            if (requiredMatches[field] === undefined) {\n              requiredMatches[field] = lunr.Set.complete\n            }\n          }\n\n          /*\n           * if the presence of this term is prohibited ensure that the matching\n           * documents are added to the set of prohibited matches for this field,\n           * creating that set if it does not yet exist.\n           */\n          if (clause.presence == lunr.Query.presence.PROHIBITED) {\n            if (prohibitedMatches[field] === undefined) {\n              prohibitedMatches[field] = lunr.Set.empty\n            }\n\n            prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet)\n\n            /*\n             * Prohibited matches should not be part of the query vector used for\n             * similarity scoring and no metadata should be extracted so we continue\n             * to the next field\n             */\n            continue\n          }\n\n          /*\n           * The query field vector is populated using the termIndex found for\n           * the term and a unit value with the appropriate boost applied.\n           * Using upsert because there could already be an entry in the vector\n           * for the term we are working with. In that case we just add the scores\n           * together.\n           */\n          queryVectors[field].upsert(termIndex, clause.boost, function (a, b) { return a + b })\n\n          /**\n           * If we've already seen this term, field combo then we've already collected\n           * the matching documents and metadata, no need to go through all that again\n           */\n          if (termFieldCache[termField]) {\n            continue\n          }\n\n          for (var l = 0; l < matchingDocumentRefs.length; l++) {\n            /*\n             * All metadata for this term/field/document triple\n             * are then extracted and collected into an instance\n             * of lunr.MatchData ready to be returned in the query\n             * results\n             */\n            var matchingDocumentRef = matchingDocumentRefs[l],\n                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),\n                metadata = fieldPosting[matchingDocumentRef],\n                fieldMatch\n\n            if ((fieldMatch = matchingFields[matchingFieldRef]) === undefined) {\n              matchingFields[matchingFieldRef] = new lunr.MatchData (expandedTerm, field, metadata)\n            } else {\n              fieldMatch.add(expandedTerm, field, metadata)\n            }\n\n          }\n\n          termFieldCache[termField] = true\n        }\n      }\n    }\n\n    /**\n     * If the presence was required we need to update the requiredMatches field sets.\n     * We do this after all fields for the term have collected their matches because\n     * the clause terms presence is required in _any_ of the fields not _all_ of the\n     * fields.\n     */\n    if (clause.presence === lunr.Query.presence.REQUIRED) {\n      for (var k = 0; k < clause.fields.length; k++) {\n        var field = clause.fields[k]\n        requiredMatches[field] = requiredMatches[field].intersect(clauseMatches)\n      }\n    }\n  }\n\n  /**\n   * Need to combine the field scoped required and prohibited\n   * matching documents into a global set of required and prohibited\n   * matches\n   */\n  var allRequiredMatches = lunr.Set.complete,\n      allProhibitedMatches = lunr.Set.empty\n\n  for (var i = 0; i < this.fields.length; i++) {\n    var field = this.fields[i]\n\n    if (requiredMatches[field]) {\n      allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field])\n    }\n\n    if (prohibitedMatches[field]) {\n      allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field])\n    }\n  }\n\n  var matchingFieldRefs = Object.keys(matchingFields),\n      results = [],\n      matches = Object.create(null)\n\n  /*\n   * If the query is negated (contains only prohibited terms)\n   * we need to get _all_ fieldRefs currently existing in the\n   * index. This is only done when we know that the query is\n   * entirely prohibited terms to avoid any cost of getting all\n   * fieldRefs unnecessarily.\n   *\n   * Additionally, blank MatchData must be created to correctly\n   * populate the results.\n   */\n  if (query.isNegated()) {\n    matchingFieldRefs = Object.keys(this.fieldVectors)\n\n    for (var i = 0; i < matchingFieldRefs.length; i++) {\n      var matchingFieldRef = matchingFieldRefs[i]\n      var fieldRef = lunr.FieldRef.fromString(matchingFieldRef)\n      matchingFields[matchingFieldRef] = new lunr.MatchData\n    }\n  }\n\n  for (var i = 0; i < matchingFieldRefs.length; i++) {\n    /*\n     * Currently we have document fields that match the query, but we\n     * need to return documents. The matchData and scores are combined\n     * from multiple fields belonging to the same document.\n     *\n     * Scores are calculated by field, using the query vectors created\n     * above, and combined into a final document score using addition.\n     */\n    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),\n        docRef = fieldRef.docRef\n\n    if (!allRequiredMatches.contains(docRef)) {\n      continue\n    }\n\n    if (allProhibitedMatches.contains(docRef)) {\n      continue\n    }\n\n    var fieldVector = this.fieldVectors[fieldRef],\n        score = queryVectors[fieldRef.fieldName].similarity(fieldVector),\n        docMatch\n\n    if ((docMatch = matches[docRef]) !== undefined) {\n      docMatch.score += score\n      docMatch.matchData.combine(matchingFields[fieldRef])\n    } else {\n      var match = {\n        ref: docRef,\n        score: score,\n        matchData: matchingFields[fieldRef]\n      }\n      matches[docRef] = match\n      results.push(match)\n    }\n  }\n\n  /*\n   * Sort the results objects by score, highest first.\n   */\n  return results.sort(function (a, b) {\n    return b.score - a.score\n  })\n}\n\n/**\n * Prepares the index for JSON serialization.\n *\n * The schema for this JSON blob will be described in a\n * separate JSON schema file.\n *\n * @returns {Object}\n */\nlunr.Index.prototype.toJSON = function () {\n  var invertedIndex = Object.keys(this.invertedIndex)\n    .sort()\n    .map(function (term) {\n      return [term, this.invertedIndex[term]]\n    }, this)\n\n  var fieldVectors = Object.keys(this.fieldVectors)\n    .map(function (ref) {\n      return [ref, this.fieldVectors[ref].toJSON()]\n    }, this)\n\n  return {\n    version: lunr.version,\n    fields: this.fields,\n    fieldVectors: fieldVectors,\n    invertedIndex: invertedIndex,\n    pipeline: this.pipeline.toJSON()\n  }\n}\n\n/**\n * Loads a previously serialized lunr.Index\n *\n * @param {Object} serializedIndex - A previously serialized lunr.Index\n * @returns {lunr.Index}\n */\nlunr.Index.load = function (serializedIndex) {\n  var attrs = {},\n      fieldVectors = {},\n      serializedVectors = serializedIndex.fieldVectors,\n      invertedIndex = Object.create(null),\n      serializedInvertedIndex = serializedIndex.invertedIndex,\n      tokenSetBuilder = new lunr.TokenSet.Builder,\n      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)\n\n  if (serializedIndex.version != lunr.version) {\n    lunr.utils.warn(\"Version mismatch when loading serialised index. Current version of lunr '\" + lunr.version + \"' does not match serialized index '\" + serializedIndex.version + \"'\")\n  }\n\n  for (var i = 0; i < serializedVectors.length; i++) {\n    var tuple = serializedVectors[i],\n        ref = tuple[0],\n        elements = tuple[1]\n\n    fieldVectors[ref] = new lunr.Vector(elements)\n  }\n\n  for (var i = 0; i < serializedInvertedIndex.length; i++) {\n    var tuple = serializedInvertedIndex[i],\n        term = tuple[0],\n        posting = tuple[1]\n\n    tokenSetBuilder.insert(term)\n    invertedIndex[term] = posting\n  }\n\n  tokenSetBuilder.finish()\n\n  attrs.fields = serializedIndex.fields\n\n  attrs.fieldVectors = fieldVectors\n  attrs.invertedIndex = invertedIndex\n  attrs.tokenSet = tokenSetBuilder.root\n  attrs.pipeline = pipeline\n\n  return new lunr.Index(attrs)\n}\n/*!\n * lunr.Builder\n * Copyright (C) 2018 Oliver Nightingale\n */\n\n/**\n * lunr.Builder performs indexing on a set of documents and\n * returns instances of lunr.Index ready for querying.\n *\n * All configuration of the index is done via the builder, the\n * fields to index, the document reference, the text processing\n * pipeline and document scoring parameters are all set on the\n * builder before indexing.\n *\n * @constructor\n * @property {string} _ref - Internal reference to the document reference field.\n * @property {string[]} _fields - Internal reference to the document fields to index.\n * @property {object} invertedIndex - The inverted index maps terms to document fields.\n * @property {object} documentTermFrequencies - Keeps track of document term frequencies.\n * @property {object} documentLengths - Keeps track of the length of documents added to the index.\n * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.\n * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.\n * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.\n * @property {number} documentCount - Keeps track of the total number of documents indexed.\n * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.\n * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.\n * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.\n * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.\n */\nlunr.Builder = function () {\n  this._ref = \"id\"\n  this._fields = Object.create(null)\n  this._documents = Object.create(null)\n  this.invertedIndex = Object.create(null)\n  this.fieldTermFrequencies = {}\n  this.fieldLengths = {}\n  this.tokenizer = lunr.tokenizer\n  this.pipeline = new lunr.Pipeline\n  this.searchPipeline = new lunr.Pipeline\n  this.documentCount = 0\n  this._b = 0.75\n  this._k1 = 1.2\n  this.termIndex = 0\n  this.metadataWhitelist = []\n}\n\n/**\n * Sets the document field used as the document reference. Every document must have this field.\n * The type of this field in the document should be a string, if it is not a string it will be\n * coerced into a string by calling toString.\n *\n * The default ref is 'id'.\n *\n * The ref should _not_ be changed during indexing, it should be set before any documents are\n * added to the index. Changing it during indexing can lead to inconsistent results.\n *\n * @param {string} ref - The name of the reference field in the document.\n */\nlunr.Builder.prototype.ref = function (ref) {\n  this._ref = ref\n}\n\n/**\n * A function that is used to extract a field from a document.\n *\n * Lunr expects a field to be at the top level of a document, if however the field\n * is deeply nested within a document an extractor function can be used to extract\n * the right field for indexing.\n *\n * @callback fieldExtractor\n * @param {object} doc - The document being added to the index.\n * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.\n * @example <caption>Extracting a nested field</caption>\n * function (doc) { return doc.nested.field }\n */\n\n/**\n * Adds a field to the list of document fields that will be indexed. Every document being\n * indexed should have this field. Null values for this field in indexed documents will\n * not cause errors but will limit the chance of that document being retrieved by searches.\n *\n * All fields should be added before adding documents to the index. Adding fields after\n * a document has been indexed will have no effect on already indexed documents.\n *\n * Fields can be boosted at build time. This allows terms within that field to have more\n * importance when ranking search results. Use a field boost to specify that matches within\n * one field are more important than other fields.\n *\n * @param {string} fieldName - The name of a field to index in all documents.\n * @param {object} attributes - Optional attributes associated with this field.\n * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.\n * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.\n * @throws {RangeError} fieldName cannot contain unsupported characters '/'\n */\nlunr.Builder.prototype.field = function (fieldName, attributes) {\n  if (/\\//.test(fieldName)) {\n    throw new RangeError (\"Field '\" + fieldName + \"' contains illegal character '/'\")\n  }\n\n  this._fields[fieldName] = attributes || {}\n}\n\n/**\n * A parameter to tune the amount of field length normalisation that is applied when\n * calculating relevance scores. A value of 0 will completely disable any normalisation\n * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b\n * will be clamped to the range 0 - 1.\n *\n * @param {number} number - The value to set for this tuning parameter.\n */\nlunr.Builder.prototype.b = function (number) {\n  if (number < 0) {\n    this._b = 0\n  } else if (number > 1) {\n    this._b = 1\n  } else {\n    this._b = number\n  }\n}\n\n/**\n * A parameter that controls the speed at which a rise in term frequency results in term\n * frequency saturation. The default value is 1.2. Setting this to a higher value will give\n * slower saturation levels, a lower value will result in quicker saturation.\n *\n * @param {number} number - The value to set for this tuning parameter.\n */\nlunr.Builder.prototype.k1 = function (number) {\n  this._k1 = number\n}\n\n/**\n * Adds a document to the index.\n *\n * Before adding fields to the index the index should have been fully setup, with the document\n * ref and all fields to index already having been specified.\n *\n * The document must have a field name as specified by the ref (by default this is 'id') and\n * it should have all fields defined for indexing, though null or undefined values will not\n * cause errors.\n *\n * Entire documents can be boosted at build time. Applying a boost to a document indicates that\n * this document should rank higher in search results than other documents.\n *\n * @param {object} doc - The document to add to the index.\n * @param {object} attributes - Optional attributes associated with this document.\n * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.\n */\nlunr.Builder.prototype.add = function (doc, attributes) {\n  var docRef = doc[this._ref],\n      fields = Object.keys(this._fields)\n\n  this._documents[docRef] = attributes || {}\n  this.documentCount += 1\n\n  for (var i = 0; i < fields.length; i++) {\n    var fieldName = fields[i],\n        extractor = this._fields[fieldName].extractor,\n        field = extractor ? extractor(doc) : doc[fieldName],\n        tokens = this.tokenizer(field, {\n          fields: [fieldName]\n        }),\n        terms = this.pipeline.run(tokens),\n        fieldRef = new lunr.FieldRef (docRef, fieldName),\n        fieldTerms = Object.create(null)\n\n    this.fieldTermFrequencies[fieldRef] = fieldTerms\n    this.fieldLengths[fieldRef] = 0\n\n    // store the length of this field for this document\n    this.fieldLengths[fieldRef] += terms.length\n\n    // calculate term frequencies for this field\n    for (var j = 0; j < terms.length; j++) {\n      var term = terms[j]\n\n      if (fieldTerms[term] == undefined) {\n        fieldTerms[term] = 0\n      }\n\n      fieldTerms[term] += 1\n\n      // add to inverted index\n      // create an initial posting if one doesn't exist\n      if (this.invertedIndex[term] == undefined) {\n        var posting = Object.create(null)\n        posting[\"_index\"] = this.termIndex\n        this.termIndex += 1\n\n        for (var k = 0; k < fields.length; k++) {\n          posting[fields[k]] = Object.create(null)\n        }\n\n        this.invertedIndex[term] = posting\n      }\n\n      // add an entry for this term/fieldName/docRef to the invertedIndex\n      if (this.invertedIndex[term][fieldName][docRef] == undefined) {\n        this.invertedIndex[term][fieldName][docRef] = Object.create(null)\n      }\n\n      // store all whitelisted metadata about this token in the\n      // inverted index\n      for (var l = 0; l < this.metadataWhitelist.length; l++) {\n        var metadataKey = this.metadataWhitelist[l],\n            metadata = term.metadata[metadataKey]\n\n        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {\n          this.invertedIndex[term][fieldName][docRef][metadataKey] = []\n        }\n\n        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)\n      }\n    }\n\n  }\n}\n\n/**\n * Calculates the average document length for this index\n *\n * @private\n */\nlunr.Builder.prototype.calculateAverageFieldLengths = function () {\n\n  var fieldRefs = Object.keys(this.fieldLengths),\n      numberOfFields = fieldRefs.length,\n      accumulator = {},\n      documentsWithField = {}\n\n  for (var i = 0; i < numberOfFields; i++) {\n    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),\n        field = fieldRef.fieldName\n\n    documentsWithField[field] || (documentsWithField[field] = 0)\n    documentsWithField[field] += 1\n\n    accumulator[field] || (accumulator[field] = 0)\n    accumulator[field] += this.fieldLengths[fieldRef]\n  }\n\n  var fields = Object.keys(this._fields)\n\n  for (var i = 0; i < fields.length; i++) {\n    var fieldName = fields[i]\n    accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName]\n  }\n\n  this.averageFieldLength = accumulator\n}\n\n/**\n * Builds a vector space model of every document using lunr.Vector\n *\n * @private\n */\nlunr.Builder.prototype.createFieldVectors = function () {\n  var fieldVectors = {},\n      fieldRefs = Object.keys(this.fieldTermFrequencies),\n      fieldRefsLength = fieldRefs.length,\n      termIdfCache = Object.create(null)\n\n  for (var i = 0; i < fieldRefsLength; i++) {\n    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),\n        fieldName = fieldRef.fieldName,\n        fieldLength = this.fieldLengths[fieldRef],\n        fieldVector = new lunr.Vector,\n        termFrequencies = this.fieldTermFrequencies[fieldRef],\n        terms = Object.keys(termFrequencies),\n        termsLength = terms.length\n\n\n    var fieldBoost = this._fields[fieldName].boost || 1,\n        docBoost = this._documents[fieldRef.docRef].boost || 1\n\n    for (var j = 0; j < termsLength; j++) {\n      var term = terms[j],\n          tf = termFrequencies[term],\n          termIndex = this.invertedIndex[term]._index,\n          idf, score, scoreWithPrecision\n\n      if (termIdfCache[term] === undefined) {\n        idf = lunr.idf(this.invertedIndex[term], this.documentCount)\n        termIdfCache[term] = idf\n      } else {\n        idf = termIdfCache[term]\n      }\n\n      score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf)\n      score *= fieldBoost\n      score *= docBoost\n      scoreWithPrecision = Math.round(score * 1000) / 1000\n      // Converts 1.23456789 to 1.234.\n      // Reducing the precision so that the vectors take up less\n      // space when serialised. Doing it now so that they behave\n      // the same before and after serialisation. Also, this is\n      // the fastest approach to reducing a number's precision in\n      // JavaScript.\n\n      fieldVector.insert(termIndex, scoreWithPrecision)\n    }\n\n    fieldVectors[fieldRef] = fieldVector\n  }\n\n  this.fieldVectors = fieldVectors\n}\n\n/**\n * Creates a token set of all tokens in the index using lunr.TokenSet\n *\n * @private\n */\nlunr.Builder.prototype.createTokenSet = function () {\n  this.tokenSet = lunr.TokenSet.fromArray(\n    Object.keys(this.invertedIndex).sort()\n  )\n}\n\n/**\n * Builds the index, creating an instance of lunr.Index.\n *\n * This completes the indexing process and should only be called\n * once all documents have been added to the index.\n *\n * @returns {lunr.Index}\n */\nlunr.Builder.prototype.build = function () {\n  this.calculateAverageFieldLengths()\n  this.createFieldVectors()\n  this.createTokenSet()\n\n  return new lunr.Index({\n    invertedIndex: this.invertedIndex,\n    fieldVectors: this.fieldVectors,\n    tokenSet: this.tokenSet,\n    fields: Object.keys(this._fields),\n    pipeline: this.searchPipeline\n  })\n}\n\n/**\n * Applies a plugin to the index builder.\n *\n * A plugin is a function that is called with the index builder as its context.\n * Plugins can be used to customise or extend the behaviour of the index\n * in some way. A plugin is just a function, that encapsulated the custom\n * behaviour that should be applied when building the index.\n *\n * The plugin function will be called with the index builder as its argument, additional\n * arguments can also be passed when calling use. The function will be called\n * with the index builder as its context.\n *\n * @param {Function} plugin The plugin to apply.\n */\nlunr.Builder.prototype.use = function (fn) {\n  var args = Array.prototype.slice.call(arguments, 1)\n  args.unshift(this)\n  fn.apply(this, args)\n}\n/**\n * Contains and collects metadata about a matching document.\n * A single instance of lunr.MatchData is returned as part of every\n * lunr.Index~Result.\n *\n * @constructor\n * @param {string} term - The term this match data is associated with\n * @param {string} field - The field in which the term was found\n * @param {object} metadata - The metadata recorded about this term in this field\n * @property {object} metadata - A cloned collection of metadata associated with this document.\n * @see {@link lunr.Index~Result}\n */\nlunr.MatchData = function (term, field, metadata) {\n  var clonedMetadata = Object.create(null),\n      metadataKeys = Object.keys(metadata || {})\n\n  // Cloning the metadata to prevent the original\n  // being mutated during match data combination.\n  // Metadata is kept in an array within the inverted\n  // index so cloning the data can be done with\n  // Array#slice\n  for (var i = 0; i < metadataKeys.length; i++) {\n    var key = metadataKeys[i]\n    clonedMetadata[key] = metadata[key].slice()\n  }\n\n  this.metadata = Object.create(null)\n\n  if (term !== undefined) {\n    this.metadata[term] = Object.create(null)\n    this.metadata[term][field] = clonedMetadata\n  }\n}\n\n/**\n * An instance of lunr.MatchData will be created for every term that matches a\n * document. However only one instance is required in a lunr.Index~Result. This\n * method combines metadata from another instance of lunr.MatchData with this\n * objects metadata.\n *\n * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.\n * @see {@link lunr.Index~Result}\n */\nlunr.MatchData.prototype.combine = function (otherMatchData) {\n  var terms = Object.keys(otherMatchData.metadata)\n\n  for (var i = 0; i < terms.length; i++) {\n    var term = terms[i],\n        fields = Object.keys(otherMatchData.metadata[term])\n\n    if (this.metadata[term] == undefined) {\n      this.metadata[term] = Object.create(null)\n    }\n\n    for (var j = 0; j < fields.length; j++) {\n      var field = fields[j],\n          keys = Object.keys(otherMatchData.metadata[term][field])\n\n      if (this.metadata[term][field] == undefined) {\n        this.metadata[term][field] = Object.create(null)\n      }\n\n      for (var k = 0; k < keys.length; k++) {\n        var key = keys[k]\n\n        if (this.metadata[term][field][key] == undefined) {\n          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]\n        } else {\n          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])\n        }\n\n      }\n    }\n  }\n}\n\n/**\n * Add metadata for a term/field pair to this instance of match data.\n *\n * @param {string} term - The term this match data is associated with\n * @param {string} field - The field in which the term was found\n * @param {object} metadata - The metadata recorded about this term in this field\n */\nlunr.MatchData.prototype.add = function (term, field, metadata) {\n  if (!(term in this.metadata)) {\n    this.metadata[term] = Object.create(null)\n    this.metadata[term][field] = metadata\n    return\n  }\n\n  if (!(field in this.metadata[term])) {\n    this.metadata[term][field] = metadata\n    return\n  }\n\n  var metadataKeys = Object.keys(metadata)\n\n  for (var i = 0; i < metadataKeys.length; i++) {\n    var key = metadataKeys[i]\n\n    if (key in this.metadata[term][field]) {\n      this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key])\n    } else {\n      this.metadata[term][field][key] = metadata[key]\n    }\n  }\n}\n/**\n * A lunr.Query provides a programmatic way of defining queries to be performed\n * against a {@link lunr.Index}.\n *\n * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method\n * so the query object is pre-initialized with the right index fields.\n *\n * @constructor\n * @property {lunr.Query~Clause[]} clauses - An array of query clauses.\n * @property {string[]} allFields - An array of all available fields in a lunr.Index.\n */\nlunr.Query = function (allFields) {\n  this.clauses = []\n  this.allFields = allFields\n}\n\n/**\n * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.\n *\n * This allows wildcards to be added to the beginning and end of a term without having to manually do any string\n * concatenation.\n *\n * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.\n *\n * @constant\n * @default\n * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour\n * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists\n * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists\n * @see lunr.Query~Clause\n * @see lunr.Query#clause\n * @see lunr.Query#term\n * @example <caption>query term with trailing wildcard</caption>\n * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })\n * @example <caption>query term with leading and trailing wildcard</caption>\n * query.term('foo', {\n *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING\n * })\n */\n\nlunr.Query.wildcard = new String (\"*\")\nlunr.Query.wildcard.NONE = 0\nlunr.Query.wildcard.LEADING = 1\nlunr.Query.wildcard.TRAILING = 2\n\n/**\n * Constants for indicating what kind of presence a term must have in matching documents.\n *\n * @constant\n * @enum {number}\n * @see lunr.Query~Clause\n * @see lunr.Query#clause\n * @see lunr.Query#term\n * @example <caption>query term with required presence</caption>\n * query.term('foo', { presence: lunr.Query.presence.REQUIRED })\n */\nlunr.Query.presence = {\n  /**\n   * Term's presence in a document is optional, this is the default value.\n   */\n  OPTIONAL: 1,\n\n  /**\n   * Term's presence in a document is required, documents that do not contain\n   * this term will not be returned.\n   */\n  REQUIRED: 2,\n\n  /**\n   * Term's presence in a document is prohibited, documents that do contain\n   * this term will not be returned.\n   */\n  PROHIBITED: 3\n}\n\n/**\n * A single clause in a {@link lunr.Query} contains a term and details on how to\n * match that term against a {@link lunr.Index}.\n *\n * @typedef {Object} lunr.Query~Clause\n * @property {string[]} fields - The fields in an index this clause should be matched against.\n * @property {number} [boost=1] - Any boost that should be applied when matching this clause.\n * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.\n * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.\n * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.\n * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.\n */\n\n/**\n * Adds a {@link lunr.Query~Clause} to this query.\n *\n * Unless the clause contains the fields to be matched all fields will be matched. In addition\n * a default boost of 1 is applied to the clause.\n *\n * @param {lunr.Query~Clause} clause - The clause to add to this query.\n * @see lunr.Query~Clause\n * @returns {lunr.Query}\n */\nlunr.Query.prototype.clause = function (clause) {\n  if (!('fields' in clause)) {\n    clause.fields = this.allFields\n  }\n\n  if (!('boost' in clause)) {\n    clause.boost = 1\n  }\n\n  if (!('usePipeline' in clause)) {\n    clause.usePipeline = true\n  }\n\n  if (!('wildcard' in clause)) {\n    clause.wildcard = lunr.Query.wildcard.NONE\n  }\n\n  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {\n    clause.term = \"*\" + clause.term\n  }\n\n  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {\n    clause.term = \"\" + clause.term + \"*\"\n  }\n\n  if (!('presence' in clause)) {\n    clause.presence = lunr.Query.presence.OPTIONAL\n  }\n\n  this.clauses.push(clause)\n\n  return this\n}\n\n/**\n * A negated query is one in which every clause has a presence of\n * prohibited. These queries require some special processing to return\n * the expected results.\n *\n * @returns boolean\n */\nlunr.Query.prototype.isNegated = function () {\n  for (var i = 0; i < this.clauses.length; i++) {\n    if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {\n      return false\n    }\n  }\n\n  return true\n}\n\n/**\n * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}\n * to the list of clauses that make up this query.\n *\n * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion\n * to a token or token-like string should be done before calling this method.\n *\n * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an\n * array, each term in the array will share the same options.\n *\n * @param {object|object[]} term - The term(s) to add to the query.\n * @param {object} [options] - Any additional properties to add to the query clause.\n * @returns {lunr.Query}\n * @see lunr.Query#clause\n * @see lunr.Query~Clause\n * @example <caption>adding a single term to a query</caption>\n * query.term(\"foo\")\n * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>\n * query.term(\"foo\", {\n *   fields: [\"title\"],\n *   boost: 10,\n *   wildcard: lunr.Query.wildcard.TRAILING\n * })\n * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>\n * query.term(lunr.tokenizer(\"foo bar\"))\n */\nlunr.Query.prototype.term = function (term, options) {\n  if (Array.isArray(term)) {\n    term.forEach(function (t) { this.term(t, lunr.utils.clone(options)) }, this)\n    return this\n  }\n\n  var clause = options || {}\n  clause.term = term.toString()\n\n  this.clause(clause)\n\n  return this\n}\nlunr.QueryParseError = function (message, start, end) {\n  this.name = \"QueryParseError\"\n  this.message = message\n  this.start = start\n  this.end = end\n}\n\nlunr.QueryParseError.prototype = new Error\nlunr.QueryLexer = function (str) {\n  this.lexemes = []\n  this.str = str\n  this.length = str.length\n  this.pos = 0\n  this.start = 0\n  this.escapeCharPositions = []\n}\n\nlunr.QueryLexer.prototype.run = function () {\n  var state = lunr.QueryLexer.lexText\n\n  while (state) {\n    state = state(this)\n  }\n}\n\nlunr.QueryLexer.prototype.sliceString = function () {\n  var subSlices = [],\n      sliceStart = this.start,\n      sliceEnd = this.pos\n\n  for (var i = 0; i < this.escapeCharPositions.length; i++) {\n    sliceEnd = this.escapeCharPositions[i]\n    subSlices.push(this.str.slice(sliceStart, sliceEnd))\n    sliceStart = sliceEnd + 1\n  }\n\n  subSlices.push(this.str.slice(sliceStart, this.pos))\n  this.escapeCharPositions.length = 0\n\n  return subSlices.join('')\n}\n\nlunr.QueryLexer.prototype.emit = function (type) {\n  this.lexemes.push({\n    type: type,\n    str: this.sliceString(),\n    start: this.start,\n    end: this.pos\n  })\n\n  this.start = this.pos\n}\n\nlunr.QueryLexer.prototype.escapeCharacter = function () {\n  this.escapeCharPositions.push(this.pos - 1)\n  this.pos += 1\n}\n\nlunr.QueryLexer.prototype.next = function () {\n  if (this.pos >= this.length) {\n    return lunr.QueryLexer.EOS\n  }\n\n  var char = this.str.charAt(this.pos)\n  this.pos += 1\n  return char\n}\n\nlunr.QueryLexer.prototype.width = function () {\n  return this.pos - this.start\n}\n\nlunr.QueryLexer.prototype.ignore = function () {\n  if (this.start == this.pos) {\n    this.pos += 1\n  }\n\n  this.start = this.pos\n}\n\nlunr.QueryLexer.prototype.backup = function () {\n  this.pos -= 1\n}\n\nlunr.QueryLexer.prototype.acceptDigitRun = function () {\n  var char, charCode\n\n  do {\n    char = this.next()\n    charCode = char.charCodeAt(0)\n  } while (charCode > 47 && charCode < 58)\n\n  if (char != lunr.QueryLexer.EOS) {\n    this.backup()\n  }\n}\n\nlunr.QueryLexer.prototype.more = function () {\n  return this.pos < this.length\n}\n\nlunr.QueryLexer.EOS = 'EOS'\nlunr.QueryLexer.FIELD = 'FIELD'\nlunr.QueryLexer.TERM = 'TERM'\nlunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'\nlunr.QueryLexer.BOOST = 'BOOST'\nlunr.QueryLexer.PRESENCE = 'PRESENCE'\n\nlunr.QueryLexer.lexField = function (lexer) {\n  lexer.backup()\n  lexer.emit(lunr.QueryLexer.FIELD)\n  lexer.ignore()\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexTerm = function (lexer) {\n  if (lexer.width() > 1) {\n    lexer.backup()\n    lexer.emit(lunr.QueryLexer.TERM)\n  }\n\n  lexer.ignore()\n\n  if (lexer.more()) {\n    return lunr.QueryLexer.lexText\n  }\n}\n\nlunr.QueryLexer.lexEditDistance = function (lexer) {\n  lexer.ignore()\n  lexer.acceptDigitRun()\n  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexBoost = function (lexer) {\n  lexer.ignore()\n  lexer.acceptDigitRun()\n  lexer.emit(lunr.QueryLexer.BOOST)\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexEOS = function (lexer) {\n  if (lexer.width() > 0) {\n    lexer.emit(lunr.QueryLexer.TERM)\n  }\n}\n\n// This matches the separator used when tokenising fields\n// within a document. These should match otherwise it is\n// not possible to search for some tokens within a document.\n//\n// It is possible for the user to change the separator on the\n// tokenizer so it _might_ clash with any other of the special\n// characters already used within the search string, e.g. :.\n//\n// This means that it is possible to change the separator in\n// such a way that makes some words unsearchable using a search\n// string.\nlunr.QueryLexer.termSeparator = lunr.tokenizer.separator\n\nlunr.QueryLexer.lexText = function (lexer) {\n  while (true) {\n    var char = lexer.next()\n\n    if (char == lunr.QueryLexer.EOS) {\n      return lunr.QueryLexer.lexEOS\n    }\n\n    // Escape character is '\\'\n    if (char.charCodeAt(0) == 92) {\n      lexer.escapeCharacter()\n      continue\n    }\n\n    if (char == \":\") {\n      return lunr.QueryLexer.lexField\n    }\n\n    if (char == \"~\") {\n      lexer.backup()\n      if (lexer.width() > 0) {\n        lexer.emit(lunr.QueryLexer.TERM)\n      }\n      return lunr.QueryLexer.lexEditDistance\n    }\n\n    if (char == \"^\") {\n      lexer.backup()\n      if (lexer.width() > 0) {\n        lexer.emit(lunr.QueryLexer.TERM)\n      }\n      return lunr.QueryLexer.lexBoost\n    }\n\n    // \"+\" indicates term presence is required\n    // checking for length to ensure that only\n    // leading \"+\" are considered\n    if (char == \"+\" && lexer.width() === 1) {\n      lexer.emit(lunr.QueryLexer.PRESENCE)\n      return lunr.QueryLexer.lexText\n    }\n\n    // \"-\" indicates term presence is prohibited\n    // checking for length to ensure that only\n    // leading \"-\" are considered\n    if (char == \"-\" && lexer.width() === 1) {\n      lexer.emit(lunr.QueryLexer.PRESENCE)\n      return lunr.QueryLexer.lexText\n    }\n\n    if (char.match(lunr.QueryLexer.termSeparator)) {\n      return lunr.QueryLexer.lexTerm\n    }\n  }\n}\n\nlunr.QueryParser = function (str, query) {\n  this.lexer = new lunr.QueryLexer (str)\n  this.query = query\n  this.currentClause = {}\n  this.lexemeIdx = 0\n}\n\nlunr.QueryParser.prototype.parse = function () {\n  this.lexer.run()\n  this.lexemes = this.lexer.lexemes\n\n  var state = lunr.QueryParser.parseClause\n\n  while (state) {\n    state = state(this)\n  }\n\n  return this.query\n}\n\nlunr.QueryParser.prototype.peekLexeme = function () {\n  return this.lexemes[this.lexemeIdx]\n}\n\nlunr.QueryParser.prototype.consumeLexeme = function () {\n  var lexeme = this.peekLexeme()\n  this.lexemeIdx += 1\n  return lexeme\n}\n\nlunr.QueryParser.prototype.nextClause = function () {\n  var completedClause = this.currentClause\n  this.query.clause(completedClause)\n  this.currentClause = {}\n}\n\nlunr.QueryParser.parseClause = function (parser) {\n  var lexeme = parser.peekLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  switch (lexeme.type) {\n    case lunr.QueryLexer.PRESENCE:\n      return lunr.QueryParser.parsePresence\n    case lunr.QueryLexer.FIELD:\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expected either a field or a term, found \" + lexeme.type\n\n      if (lexeme.str.length >= 1) {\n        errorMessage += \" with value '\" + lexeme.str + \"'\"\n      }\n\n      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n}\n\nlunr.QueryParser.parsePresence = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  switch (lexeme.str) {\n    case \"-\":\n      parser.currentClause.presence = lunr.Query.presence.PROHIBITED\n      break\n    case \"+\":\n      parser.currentClause.presence = lunr.Query.presence.REQUIRED\n      break\n    default:\n      var errorMessage = \"unrecognised presence operator'\" + lexeme.str + \"'\"\n      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    var errorMessage = \"expecting term or field, found nothing\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.FIELD:\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expecting term or field, found '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseField = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  if (parser.query.allFields.indexOf(lexeme.str) == -1) {\n    var possibleFields = parser.query.allFields.map(function (f) { return \"'\" + f + \"'\" }).join(', '),\n        errorMessage = \"unrecognised field '\" + lexeme.str + \"', possible fields: \" + possibleFields\n\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.fields = [lexeme.str]\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    var errorMessage = \"expecting term, found nothing\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expecting term, found '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseTerm = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  parser.currentClause.term = lexeme.str.toLowerCase()\n\n  if (lexeme.str.indexOf(\"*\") != -1) {\n    parser.currentClause.usePipeline = false\n  }\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseEditDistance = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  var editDistance = parseInt(lexeme.str, 10)\n\n  if (isNaN(editDistance)) {\n    var errorMessage = \"edit distance must be numeric\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.editDistance = editDistance\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseBoost = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  var boost = parseInt(lexeme.str, 10)\n\n  if (isNaN(boost)) {\n    var errorMessage = \"boost must be numeric\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.boost = boost\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\n  /**\n   * export the module via AMD, CommonJS or as a browser global\n   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js\n   */\n  ;(function (root, factory) {\n    if (true) {\n      // AMD. Register as an anonymous module.\n      !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))\n    } else {}\n  }(this, function () {\n    /**\n     * Just return a value to define the module export.\n     * This example returns an object, but the module\n     * can return a function as the exported value.\n     */\n    return lunr\n  }))\n})();\n\n\n/***/ }),\n/* 3 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(7);\nmodule.exports = function (it) {\n  if (!isObject(it)) throw TypeError(it + ' is not an object!');\n  return it;\n};\n\n\n/***/ }),\n/* 4 */\n/***/ (function(module, exports) {\n\nvar core = module.exports = { version: '2.5.7' };\nif (typeof __e == 'number') __e = core; // eslint-disable-line no-undef\n\n\n/***/ }),\n/* 5 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar dP = __webpack_require__(11);\nvar createDesc = __webpack_require__(26);\nmodule.exports = __webpack_require__(8) ? function (object, key, value) {\n  return dP.f(object, key, createDesc(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n\n\n/***/ }),\n/* 6 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(1);\nvar hide = __webpack_require__(5);\nvar has = __webpack_require__(12);\nvar SRC = __webpack_require__(17)('src');\nvar TO_STRING = 'toString';\nvar $toString = Function[TO_STRING];\nvar TPL = ('' + $toString).split(TO_STRING);\n\n__webpack_require__(4).inspectSource = function (it) {\n  return $toString.call(it);\n};\n\n(module.exports = function (O, key, val, safe) {\n  var isFunction = typeof val == 'function';\n  if (isFunction) has(val, 'name') || hide(val, 'name', key);\n  if (O[key] === val) return;\n  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));\n  if (O === global) {\n    O[key] = val;\n  } else if (!safe) {\n    delete O[key];\n    hide(O, key, val);\n  } else if (O[key]) {\n    O[key] = val;\n  } else {\n    hide(O, key, val);\n  }\n// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative\n})(Function.prototype, TO_STRING, function toString() {\n  return typeof this == 'function' && this[SRC] || $toString.call(this);\n});\n\n\n/***/ }),\n/* 7 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it) {\n  return typeof it === 'object' ? it !== null : typeof it === 'function';\n};\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// Thank's IE8 for his funny defineProperty\nmodule.exports = !__webpack_require__(25)(function () {\n  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;\n});\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports) {\n\nmodule.exports = {};\n\n\n/***/ }),\n/* 10 */\n/***/ (function(module, exports) {\n\nvar toString = {}.toString;\n\nmodule.exports = function (it) {\n  return toString.call(it).slice(8, -1);\n};\n\n\n/***/ }),\n/* 11 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(3);\nvar IE8_DOM_DEFINE = __webpack_require__(37);\nvar toPrimitive = __webpack_require__(38);\nvar dP = Object.defineProperty;\n\nexports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes) {\n  anObject(O);\n  P = toPrimitive(P, true);\n  anObject(Attributes);\n  if (IE8_DOM_DEFINE) try {\n    return dP(O, P, Attributes);\n  } catch (e) { /* empty */ }\n  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');\n  if ('value' in Attributes) O[P] = Attributes.value;\n  return O;\n};\n\n\n/***/ }),\n/* 12 */\n/***/ (function(module, exports) {\n\nvar hasOwnProperty = {}.hasOwnProperty;\nmodule.exports = function (it, key) {\n  return hasOwnProperty.call(it, key);\n};\n\n\n/***/ }),\n/* 13 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// optional / simple context binding\nvar aFunction = __webpack_require__(14);\nmodule.exports = function (fn, that, length) {\n  aFunction(fn);\n  if (that === undefined) return fn;\n  switch (length) {\n    case 1: return function (a) {\n      return fn.call(that, a);\n    };\n    case 2: return function (a, b) {\n      return fn.call(that, a, b);\n    };\n    case 3: return function (a, b, c) {\n      return fn.call(that, a, b, c);\n    };\n  }\n  return function (/* ...args */) {\n    return fn.apply(that, arguments);\n  };\n};\n\n\n/***/ }),\n/* 14 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it) {\n  if (typeof it != 'function') throw TypeError(it + ' is not a function!');\n  return it;\n};\n\n\n/***/ }),\n/* 15 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// getting tag from 19.1.3.6 Object.prototype.toString()\nvar cof = __webpack_require__(10);\nvar TAG = __webpack_require__(0)('toStringTag');\n// ES3 wrong here\nvar ARG = cof(function () { return arguments; }()) == 'Arguments';\n\n// fallback for IE11 Script Access Denied error\nvar tryGet = function (it, key) {\n  try {\n    return it[key];\n  } catch (e) { /* empty */ }\n};\n\nmodule.exports = function (it) {\n  var O, T, B;\n  return it === undefined ? 'Undefined' : it === null ? 'Null'\n    // @@toStringTag case\n    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T\n    // builtinTag case\n    : ARG ? cof(O)\n    // ES3 arguments fallback\n    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;\n};\n\n\n/***/ }),\n/* 16 */\n/***/ (function(module, exports) {\n\nmodule.exports = false;\n\n\n/***/ }),\n/* 17 */\n/***/ (function(module, exports) {\n\nvar id = 0;\nvar px = Math.random();\nmodule.exports = function (key) {\n  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));\n};\n\n\n/***/ }),\n/* 18 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(7);\nvar document = __webpack_require__(1).document;\n// typeof document.createElement is 'object' in old IE\nvar is = isObject(document) && isObject(document.createElement);\nmodule.exports = function (it) {\n  return is ? document.createElement(it) : {};\n};\n\n\n/***/ }),\n/* 19 */\n/***/ (function(module, exports) {\n\n// 7.1.4 ToInteger\nvar ceil = Math.ceil;\nvar floor = Math.floor;\nmodule.exports = function (it) {\n  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);\n};\n\n\n/***/ }),\n/* 20 */\n/***/ (function(module, exports) {\n\n// 7.2.1 RequireObjectCoercible(argument)\nmodule.exports = function (it) {\n  if (it == undefined) throw TypeError(\"Can't call method on  \" + it);\n  return it;\n};\n\n\n/***/ }),\n/* 21 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// to indexed object, toObject with fallback for non-array-like ES3 strings\nvar IObject = __webpack_require__(45);\nvar defined = __webpack_require__(20);\nmodule.exports = function (it) {\n  return IObject(defined(it));\n};\n\n\n/***/ }),\n/* 22 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar shared = __webpack_require__(24)('keys');\nvar uid = __webpack_require__(17);\nmodule.exports = function (key) {\n  return shared[key] || (shared[key] = uid(key));\n};\n\n\n/***/ }),\n/* 23 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar def = __webpack_require__(11).f;\nvar has = __webpack_require__(12);\nvar TAG = __webpack_require__(0)('toStringTag');\n\nmodule.exports = function (it, tag, stat) {\n  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });\n};\n\n\n/***/ }),\n/* 24 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar core = __webpack_require__(4);\nvar global = __webpack_require__(1);\nvar SHARED = '__core-js_shared__';\nvar store = global[SHARED] || (global[SHARED] = {});\n\n(module.exports = function (key, value) {\n  return store[key] || (store[key] = value !== undefined ? value : {});\n})('versions', []).push({\n  version: core.version,\n  mode: __webpack_require__(16) ? 'pure' : 'global',\n  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'\n});\n\n\n/***/ }),\n/* 25 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (exec) {\n  try {\n    return !!exec();\n  } catch (e) {\n    return true;\n  }\n};\n\n\n/***/ }),\n/* 26 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (bitmap, value) {\n  return {\n    enumerable: !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable: !(bitmap & 4),\n    value: value\n  };\n};\n\n\n/***/ }),\n/* 27 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar LIBRARY = __webpack_require__(16);\nvar $export = __webpack_require__(28);\nvar redefine = __webpack_require__(6);\nvar hide = __webpack_require__(5);\nvar Iterators = __webpack_require__(9);\nvar $iterCreate = __webpack_require__(41);\nvar setToStringTag = __webpack_require__(23);\nvar getPrototypeOf = __webpack_require__(48);\nvar ITERATOR = __webpack_require__(0)('iterator');\nvar BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`\nvar FF_ITERATOR = '@@iterator';\nvar KEYS = 'keys';\nvar VALUES = 'values';\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {\n  $iterCreate(Constructor, NAME, next);\n  var getMethod = function (kind) {\n    if (!BUGGY && kind in proto) return proto[kind];\n    switch (kind) {\n      case KEYS: return function keys() { return new Constructor(this, kind); };\n      case VALUES: return function values() { return new Constructor(this, kind); };\n    } return function entries() { return new Constructor(this, kind); };\n  };\n  var TAG = NAME + ' Iterator';\n  var DEF_VALUES = DEFAULT == VALUES;\n  var VALUES_BUG = false;\n  var proto = Base.prototype;\n  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];\n  var $default = $native || getMethod(DEFAULT);\n  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;\n  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;\n  var methods, key, IteratorPrototype;\n  // Fix native\n  if ($anyNative) {\n    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));\n    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {\n      // Set @@toStringTag to native iterators\n      setToStringTag(IteratorPrototype, TAG, true);\n      // fix for some old engines\n      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);\n    }\n  }\n  // fix Array#{values, @@iterator}.name in V8 / FF\n  if (DEF_VALUES && $native && $native.name !== VALUES) {\n    VALUES_BUG = true;\n    $default = function values() { return $native.call(this); };\n  }\n  // Define iterator\n  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {\n    hide(proto, ITERATOR, $default);\n  }\n  // Plug for library\n  Iterators[NAME] = $default;\n  Iterators[TAG] = returnThis;\n  if (DEFAULT) {\n    methods = {\n      values: DEF_VALUES ? $default : getMethod(VALUES),\n      keys: IS_SET ? $default : getMethod(KEYS),\n      entries: $entries\n    };\n    if (FORCED) for (key in methods) {\n      if (!(key in proto)) redefine(proto, key, methods[key]);\n    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);\n  }\n  return methods;\n};\n\n\n/***/ }),\n/* 28 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(1);\nvar core = __webpack_require__(4);\nvar hide = __webpack_require__(5);\nvar redefine = __webpack_require__(6);\nvar ctx = __webpack_require__(13);\nvar PROTOTYPE = 'prototype';\n\nvar $export = function (type, name, source) {\n  var IS_FORCED = type & $export.F;\n  var IS_GLOBAL = type & $export.G;\n  var IS_STATIC = type & $export.S;\n  var IS_PROTO = type & $export.P;\n  var IS_BIND = type & $export.B;\n  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];\n  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});\n  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});\n  var key, own, out, exp;\n  if (IS_GLOBAL) source = name;\n  for (key in source) {\n    // contains in native\n    own = !IS_FORCED && target && target[key] !== undefined;\n    // export native or passed\n    out = (own ? target : source)[key];\n    // bind timers to global for call from export context\n    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;\n    // extend global\n    if (target) redefine(target, key, out, type & $export.U);\n    // export\n    if (exports[key] != out) hide(exports, key, exp);\n    if (IS_PROTO && expProto[key] != out) expProto[key] = out;\n  }\n};\nglobal.core = core;\n// type bitmap\n$export.F = 1;   // forced\n$export.G = 2;   // global\n$export.S = 4;   // static\n$export.P = 8;   // proto\n$export.B = 16;  // bind\n$export.W = 32;  // wrap\n$export.U = 64;  // safe\n$export.R = 128; // real proto method for `library`\nmodule.exports = $export;\n\n\n/***/ }),\n/* 29 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 19.1.2.14 / 15.2.3.14 Object.keys(O)\nvar $keys = __webpack_require__(44);\nvar enumBugKeys = __webpack_require__(31);\n\nmodule.exports = Object.keys || function keys(O) {\n  return $keys(O, enumBugKeys);\n};\n\n\n/***/ }),\n/* 30 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 7.1.15 ToLength\nvar toInteger = __webpack_require__(19);\nvar min = Math.min;\nmodule.exports = function (it) {\n  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991\n};\n\n\n/***/ }),\n/* 31 */\n/***/ (function(module, exports) {\n\n// IE 8- don't enum bug keys\nmodule.exports = (\n  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'\n).split(',');\n\n\n/***/ }),\n/* 32 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar document = __webpack_require__(1).document;\nmodule.exports = document && document.documentElement;\n\n\n/***/ }),\n/* 33 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ctx = __webpack_require__(13);\nvar invoke = __webpack_require__(61);\nvar html = __webpack_require__(32);\nvar cel = __webpack_require__(18);\nvar global = __webpack_require__(1);\nvar process = global.process;\nvar setTask = global.setImmediate;\nvar clearTask = global.clearImmediate;\nvar MessageChannel = global.MessageChannel;\nvar Dispatch = global.Dispatch;\nvar counter = 0;\nvar queue = {};\nvar ONREADYSTATECHANGE = 'onreadystatechange';\nvar defer, channel, port;\nvar run = function () {\n  var id = +this;\n  // eslint-disable-next-line no-prototype-builtins\n  if (queue.hasOwnProperty(id)) {\n    var fn = queue[id];\n    delete queue[id];\n    fn();\n  }\n};\nvar listener = function (event) {\n  run.call(event.data);\n};\n// Node.js 0.9+ & IE10+ has setImmediate, otherwise:\nif (!setTask || !clearTask) {\n  setTask = function setImmediate(fn) {\n    var args = [];\n    var i = 1;\n    while (arguments.length > i) args.push(arguments[i++]);\n    queue[++counter] = function () {\n      // eslint-disable-next-line no-new-func\n      invoke(typeof fn == 'function' ? fn : Function(fn), args);\n    };\n    defer(counter);\n    return counter;\n  };\n  clearTask = function clearImmediate(id) {\n    delete queue[id];\n  };\n  // Node.js 0.8-\n  if (__webpack_require__(10)(process) == 'process') {\n    defer = function (id) {\n      process.nextTick(ctx(run, id, 1));\n    };\n  // Sphere (JS game engine) Dispatch API\n  } else if (Dispatch && Dispatch.now) {\n    defer = function (id) {\n      Dispatch.now(ctx(run, id, 1));\n    };\n  // Browsers with MessageChannel, includes WebWorkers\n  } else if (MessageChannel) {\n    channel = new MessageChannel();\n    port = channel.port2;\n    channel.port1.onmessage = listener;\n    defer = ctx(port.postMessage, port, 1);\n  // Browsers with postMessage, skip WebWorkers\n  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'\n  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {\n    defer = function (id) {\n      global.postMessage(id + '', '*');\n    };\n    global.addEventListener('message', listener, false);\n  // IE8-\n  } else if (ONREADYSTATECHANGE in cel('script')) {\n    defer = function (id) {\n      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {\n        html.removeChild(this);\n        run.call(id);\n      };\n    };\n  // Rest old browsers\n  } else {\n    defer = function (id) {\n      setTimeout(ctx(run, id, 1), 0);\n    };\n  }\n}\nmodule.exports = {\n  set: setTask,\n  clear: clearTask\n};\n\n\n/***/ }),\n/* 34 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n// 25.4.1.5 NewPromiseCapability(C)\nvar aFunction = __webpack_require__(14);\n\nfunction PromiseCapability(C) {\n  var resolve, reject;\n  this.promise = new C(function ($$resolve, $$reject) {\n    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');\n    resolve = $$resolve;\n    reject = $$reject;\n  });\n  this.resolve = aFunction(resolve);\n  this.reject = aFunction(reject);\n}\n\nmodule.exports.f = function (C) {\n  return new PromiseCapability(C);\n};\n\n\n/***/ }),\n/* 35 */\n/***/ (function(module, exports, __webpack_require__) {\n\n__webpack_require__(36);\n__webpack_require__(39);\n__webpack_require__(50);\n__webpack_require__(54);\nmodule.exports = __webpack_require__(4).Promise;\n\n\n/***/ }),\n/* 36 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n// 19.1.3.6 Object.prototype.toString()\nvar classof = __webpack_require__(15);\nvar test = {};\ntest[__webpack_require__(0)('toStringTag')] = 'z';\nif (test + '' != '[object z]') {\n  __webpack_require__(6)(Object.prototype, 'toString', function toString() {\n    return '[object ' + classof(this) + ']';\n  }, true);\n}\n\n\n/***/ }),\n/* 37 */\n/***/ (function(module, exports, __webpack_require__) {\n\nmodule.exports = !__webpack_require__(8) && !__webpack_require__(25)(function () {\n  return Object.defineProperty(__webpack_require__(18)('div'), 'a', { get: function () { return 7; } }).a != 7;\n});\n\n\n/***/ }),\n/* 38 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 7.1.1 ToPrimitive(input [, PreferredType])\nvar isObject = __webpack_require__(7);\n// instead of the ES6 spec version, we didn't implement @@toPrimitive case\n// and the second argument - flag - preferred type is a string\nmodule.exports = function (it, S) {\n  if (!isObject(it)) return it;\n  var fn, val;\n  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;\n  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;\n  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;\n  throw TypeError(\"Can't convert object to primitive value\");\n};\n\n\n/***/ }),\n/* 39 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar $at = __webpack_require__(40)(true);\n\n// 21.1.3.27 String.prototype[@@iterator]()\n__webpack_require__(27)(String, 'String', function (iterated) {\n  this._t = String(iterated); // target\n  this._i = 0;                // next index\n// 21.1.5.2.1 %StringIteratorPrototype%.next()\n}, function () {\n  var O = this._t;\n  var index = this._i;\n  var point;\n  if (index >= O.length) return { value: undefined, done: true };\n  point = $at(O, index);\n  this._i += point.length;\n  return { value: point, done: false };\n});\n\n\n/***/ }),\n/* 40 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toInteger = __webpack_require__(19);\nvar defined = __webpack_require__(20);\n// true  -> String#at\n// false -> String#codePointAt\nmodule.exports = function (TO_STRING) {\n  return function (that, pos) {\n    var s = String(defined(that));\n    var i = toInteger(pos);\n    var l = s.length;\n    var a, b;\n    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;\n    a = s.charCodeAt(i);\n    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff\n      ? TO_STRING ? s.charAt(i) : a\n      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;\n  };\n};\n\n\n/***/ }),\n/* 41 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar create = __webpack_require__(42);\nvar descriptor = __webpack_require__(26);\nvar setToStringTag = __webpack_require__(23);\nvar IteratorPrototype = {};\n\n// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()\n__webpack_require__(5)(IteratorPrototype, __webpack_require__(0)('iterator'), function () { return this; });\n\nmodule.exports = function (Constructor, NAME, next) {\n  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });\n  setToStringTag(Constructor, NAME + ' Iterator');\n};\n\n\n/***/ }),\n/* 42 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])\nvar anObject = __webpack_require__(3);\nvar dPs = __webpack_require__(43);\nvar enumBugKeys = __webpack_require__(31);\nvar IE_PROTO = __webpack_require__(22)('IE_PROTO');\nvar Empty = function () { /* empty */ };\nvar PROTOTYPE = 'prototype';\n\n// Create object with fake `null` prototype: use iframe Object with cleared prototype\nvar createDict = function () {\n  // Thrash, waste and sodomy: IE GC bug\n  var iframe = __webpack_require__(18)('iframe');\n  var i = enumBugKeys.length;\n  var lt = '<';\n  var gt = '>';\n  var iframeDocument;\n  iframe.style.display = 'none';\n  __webpack_require__(32).appendChild(iframe);\n  iframe.src = 'javascript:'; // eslint-disable-line no-script-url\n  // createDict = iframe.contentWindow.Object;\n  // html.removeChild(iframe);\n  iframeDocument = iframe.contentWindow.document;\n  iframeDocument.open();\n  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);\n  iframeDocument.close();\n  createDict = iframeDocument.F;\n  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];\n  return createDict();\n};\n\nmodule.exports = Object.create || function create(O, Properties) {\n  var result;\n  if (O !== null) {\n    Empty[PROTOTYPE] = anObject(O);\n    result = new Empty();\n    Empty[PROTOTYPE] = null;\n    // add \"__proto__\" for Object.getPrototypeOf polyfill\n    result[IE_PROTO] = O;\n  } else result = createDict();\n  return Properties === undefined ? result : dPs(result, Properties);\n};\n\n\n/***/ }),\n/* 43 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar dP = __webpack_require__(11);\nvar anObject = __webpack_require__(3);\nvar getKeys = __webpack_require__(29);\n\nmodule.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties) {\n  anObject(O);\n  var keys = getKeys(Properties);\n  var length = keys.length;\n  var i = 0;\n  var P;\n  while (length > i) dP.f(O, P = keys[i++], Properties[P]);\n  return O;\n};\n\n\n/***/ }),\n/* 44 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar has = __webpack_require__(12);\nvar toIObject = __webpack_require__(21);\nvar arrayIndexOf = __webpack_require__(46)(false);\nvar IE_PROTO = __webpack_require__(22)('IE_PROTO');\n\nmodule.exports = function (object, names) {\n  var O = toIObject(object);\n  var i = 0;\n  var result = [];\n  var key;\n  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);\n  // Don't enum bug & hidden keys\n  while (names.length > i) if (has(O, key = names[i++])) {\n    ~arrayIndexOf(result, key) || result.push(key);\n  }\n  return result;\n};\n\n\n/***/ }),\n/* 45 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// fallback for non-array-like ES3 and non-enumerable old V8 strings\nvar cof = __webpack_require__(10);\n// eslint-disable-next-line no-prototype-builtins\nmodule.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {\n  return cof(it) == 'String' ? it.split('') : Object(it);\n};\n\n\n/***/ }),\n/* 46 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// false -> Array#indexOf\n// true  -> Array#includes\nvar toIObject = __webpack_require__(21);\nvar toLength = __webpack_require__(30);\nvar toAbsoluteIndex = __webpack_require__(47);\nmodule.exports = function (IS_INCLUDES) {\n  return function ($this, el, fromIndex) {\n    var O = toIObject($this);\n    var length = toLength(O.length);\n    var index = toAbsoluteIndex(fromIndex, length);\n    var value;\n    // Array#includes uses SameValueZero equality algorithm\n    // eslint-disable-next-line no-self-compare\n    if (IS_INCLUDES && el != el) while (length > index) {\n      value = O[index++];\n      // eslint-disable-next-line no-self-compare\n      if (value != value) return true;\n    // Array#indexOf ignores holes, Array#includes - not\n    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {\n      if (O[index] === el) return IS_INCLUDES || index || 0;\n    } return !IS_INCLUDES && -1;\n  };\n};\n\n\n/***/ }),\n/* 47 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toInteger = __webpack_require__(19);\nvar max = Math.max;\nvar min = Math.min;\nmodule.exports = function (index, length) {\n  index = toInteger(index);\n  return index < 0 ? max(index + length, 0) : min(index, length);\n};\n\n\n/***/ }),\n/* 48 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)\nvar has = __webpack_require__(12);\nvar toObject = __webpack_require__(49);\nvar IE_PROTO = __webpack_require__(22)('IE_PROTO');\nvar ObjectProto = Object.prototype;\n\nmodule.exports = Object.getPrototypeOf || function (O) {\n  O = toObject(O);\n  if (has(O, IE_PROTO)) return O[IE_PROTO];\n  if (typeof O.constructor == 'function' && O instanceof O.constructor) {\n    return O.constructor.prototype;\n  } return O instanceof Object ? ObjectProto : null;\n};\n\n\n/***/ }),\n/* 49 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 7.1.13 ToObject(argument)\nvar defined = __webpack_require__(20);\nmodule.exports = function (it) {\n  return Object(defined(it));\n};\n\n\n/***/ }),\n/* 50 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar $iterators = __webpack_require__(51);\nvar getKeys = __webpack_require__(29);\nvar redefine = __webpack_require__(6);\nvar global = __webpack_require__(1);\nvar hide = __webpack_require__(5);\nvar Iterators = __webpack_require__(9);\nvar wks = __webpack_require__(0);\nvar ITERATOR = wks('iterator');\nvar TO_STRING_TAG = wks('toStringTag');\nvar ArrayValues = Iterators.Array;\n\nvar DOMIterables = {\n  CSSRuleList: true, // TODO: Not spec compliant, should be false.\n  CSSStyleDeclaration: false,\n  CSSValueList: false,\n  ClientRectList: false,\n  DOMRectList: false,\n  DOMStringList: false,\n  DOMTokenList: true,\n  DataTransferItemList: false,\n  FileList: false,\n  HTMLAllCollection: false,\n  HTMLCollection: false,\n  HTMLFormElement: false,\n  HTMLSelectElement: false,\n  MediaList: true, // TODO: Not spec compliant, should be false.\n  MimeTypeArray: false,\n  NamedNodeMap: false,\n  NodeList: true,\n  PaintRequestList: false,\n  Plugin: false,\n  PluginArray: false,\n  SVGLengthList: false,\n  SVGNumberList: false,\n  SVGPathSegList: false,\n  SVGPointList: false,\n  SVGStringList: false,\n  SVGTransformList: false,\n  SourceBufferList: false,\n  StyleSheetList: true, // TODO: Not spec compliant, should be false.\n  TextTrackCueList: false,\n  TextTrackList: false,\n  TouchList: false\n};\n\nfor (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {\n  var NAME = collections[i];\n  var explicit = DOMIterables[NAME];\n  var Collection = global[NAME];\n  var proto = Collection && Collection.prototype;\n  var key;\n  if (proto) {\n    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);\n    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);\n    Iterators[NAME] = ArrayValues;\n    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);\n  }\n}\n\n\n/***/ }),\n/* 51 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar addToUnscopables = __webpack_require__(52);\nvar step = __webpack_require__(53);\nvar Iterators = __webpack_require__(9);\nvar toIObject = __webpack_require__(21);\n\n// 22.1.3.4 Array.prototype.entries()\n// 22.1.3.13 Array.prototype.keys()\n// 22.1.3.29 Array.prototype.values()\n// 22.1.3.30 Array.prototype[@@iterator]()\nmodule.exports = __webpack_require__(27)(Array, 'Array', function (iterated, kind) {\n  this._t = toIObject(iterated); // target\n  this._i = 0;                   // next index\n  this._k = kind;                // kind\n// 22.1.5.2.1 %ArrayIteratorPrototype%.next()\n}, function () {\n  var O = this._t;\n  var kind = this._k;\n  var index = this._i++;\n  if (!O || index >= O.length) {\n    this._t = undefined;\n    return step(1);\n  }\n  if (kind == 'keys') return step(0, index);\n  if (kind == 'values') return step(0, O[index]);\n  return step(0, [index, O[index]]);\n}, 'values');\n\n// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)\nIterators.Arguments = Iterators.Array;\n\naddToUnscopables('keys');\naddToUnscopables('values');\naddToUnscopables('entries');\n\n\n/***/ }),\n/* 52 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 22.1.3.31 Array.prototype[@@unscopables]\nvar UNSCOPABLES = __webpack_require__(0)('unscopables');\nvar ArrayProto = Array.prototype;\nif (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(5)(ArrayProto, UNSCOPABLES, {});\nmodule.exports = function (key) {\n  ArrayProto[UNSCOPABLES][key] = true;\n};\n\n\n/***/ }),\n/* 53 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (done, value) {\n  return { value: value, done: !!done };\n};\n\n\n/***/ }),\n/* 54 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar LIBRARY = __webpack_require__(16);\nvar global = __webpack_require__(1);\nvar ctx = __webpack_require__(13);\nvar classof = __webpack_require__(15);\nvar $export = __webpack_require__(28);\nvar isObject = __webpack_require__(7);\nvar aFunction = __webpack_require__(14);\nvar anInstance = __webpack_require__(55);\nvar forOf = __webpack_require__(56);\nvar speciesConstructor = __webpack_require__(60);\nvar task = __webpack_require__(33).set;\nvar microtask = __webpack_require__(62)();\nvar newPromiseCapabilityModule = __webpack_require__(34);\nvar perform = __webpack_require__(63);\nvar userAgent = __webpack_require__(64);\nvar promiseResolve = __webpack_require__(65);\nvar PROMISE = 'Promise';\nvar TypeError = global.TypeError;\nvar process = global.process;\nvar versions = process && process.versions;\nvar v8 = versions && versions.v8 || '';\nvar $Promise = global[PROMISE];\nvar isNode = classof(process) == 'process';\nvar empty = function () { /* empty */ };\nvar Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;\nvar newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;\n\nvar USE_NATIVE = !!function () {\n  try {\n    // correct subclassing with @@species support\n    var promise = $Promise.resolve(1);\n    var FakePromise = (promise.constructor = {})[__webpack_require__(0)('species')] = function (exec) {\n      exec(empty, empty);\n    };\n    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test\n    return (isNode || typeof PromiseRejectionEvent == 'function')\n      && promise.then(empty) instanceof FakePromise\n      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables\n      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565\n      // we can't detect it synchronously, so just check versions\n      && v8.indexOf('6.6') !== 0\n      && userAgent.indexOf('Chrome/66') === -1;\n  } catch (e) { /* empty */ }\n}();\n\n// helpers\nvar isThenable = function (it) {\n  var then;\n  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;\n};\nvar notify = function (promise, isReject) {\n  if (promise._n) return;\n  promise._n = true;\n  var chain = promise._c;\n  microtask(function () {\n    var value = promise._v;\n    var ok = promise._s == 1;\n    var i = 0;\n    var run = function (reaction) {\n      var handler = ok ? reaction.ok : reaction.fail;\n      var resolve = reaction.resolve;\n      var reject = reaction.reject;\n      var domain = reaction.domain;\n      var result, then, exited;\n      try {\n        if (handler) {\n          if (!ok) {\n            if (promise._h == 2) onHandleUnhandled(promise);\n            promise._h = 1;\n          }\n          if (handler === true) result = value;\n          else {\n            if (domain) domain.enter();\n            result = handler(value); // may throw\n            if (domain) {\n              domain.exit();\n              exited = true;\n            }\n          }\n          if (result === reaction.promise) {\n            reject(TypeError('Promise-chain cycle'));\n          } else if (then = isThenable(result)) {\n            then.call(result, resolve, reject);\n          } else resolve(result);\n        } else reject(value);\n      } catch (e) {\n        if (domain && !exited) domain.exit();\n        reject(e);\n      }\n    };\n    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach\n    promise._c = [];\n    promise._n = false;\n    if (isReject && !promise._h) onUnhandled(promise);\n  });\n};\nvar onUnhandled = function (promise) {\n  task.call(global, function () {\n    var value = promise._v;\n    var unhandled = isUnhandled(promise);\n    var result, handler, console;\n    if (unhandled) {\n      result = perform(function () {\n        if (isNode) {\n          process.emit('unhandledRejection', value, promise);\n        } else if (handler = global.onunhandledrejection) {\n          handler({ promise: promise, reason: value });\n        } else if ((console = global.console) && console.error) {\n          console.error('Unhandled promise rejection', value);\n        }\n      });\n      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should\n      promise._h = isNode || isUnhandled(promise) ? 2 : 1;\n    } promise._a = undefined;\n    if (unhandled && result.e) throw result.v;\n  });\n};\nvar isUnhandled = function (promise) {\n  return promise._h !== 1 && (promise._a || promise._c).length === 0;\n};\nvar onHandleUnhandled = function (promise) {\n  task.call(global, function () {\n    var handler;\n    if (isNode) {\n      process.emit('rejectionHandled', promise);\n    } else if (handler = global.onrejectionhandled) {\n      handler({ promise: promise, reason: promise._v });\n    }\n  });\n};\nvar $reject = function (value) {\n  var promise = this;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  promise._v = value;\n  promise._s = 2;\n  if (!promise._a) promise._a = promise._c.slice();\n  notify(promise, true);\n};\nvar $resolve = function (value) {\n  var promise = this;\n  var then;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  try {\n    if (promise === value) throw TypeError(\"Promise can't be resolved itself\");\n    if (then = isThenable(value)) {\n      microtask(function () {\n        var wrapper = { _w: promise, _d: false }; // wrap\n        try {\n          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));\n        } catch (e) {\n          $reject.call(wrapper, e);\n        }\n      });\n    } else {\n      promise._v = value;\n      promise._s = 1;\n      notify(promise, false);\n    }\n  } catch (e) {\n    $reject.call({ _w: promise, _d: false }, e); // wrap\n  }\n};\n\n// constructor polyfill\nif (!USE_NATIVE) {\n  // 25.4.3.1 Promise(executor)\n  $Promise = function Promise(executor) {\n    anInstance(this, $Promise, PROMISE, '_h');\n    aFunction(executor);\n    Internal.call(this);\n    try {\n      executor(ctx($resolve, this, 1), ctx($reject, this, 1));\n    } catch (err) {\n      $reject.call(this, err);\n    }\n  };\n  // eslint-disable-next-line no-unused-vars\n  Internal = function Promise(executor) {\n    this._c = [];             // <- awaiting reactions\n    this._a = undefined;      // <- checked in isUnhandled reactions\n    this._s = 0;              // <- state\n    this._d = false;          // <- done\n    this._v = undefined;      // <- value\n    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled\n    this._n = false;          // <- notify\n  };\n  Internal.prototype = __webpack_require__(66)($Promise.prototype, {\n    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)\n    then: function then(onFulfilled, onRejected) {\n      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));\n      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;\n      reaction.fail = typeof onRejected == 'function' && onRejected;\n      reaction.domain = isNode ? process.domain : undefined;\n      this._c.push(reaction);\n      if (this._a) this._a.push(reaction);\n      if (this._s) notify(this, false);\n      return reaction.promise;\n    },\n    // 25.4.5.1 Promise.prototype.catch(onRejected)\n    'catch': function (onRejected) {\n      return this.then(undefined, onRejected);\n    }\n  });\n  OwnPromiseCapability = function () {\n    var promise = new Internal();\n    this.promise = promise;\n    this.resolve = ctx($resolve, promise, 1);\n    this.reject = ctx($reject, promise, 1);\n  };\n  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {\n    return C === $Promise || C === Wrapper\n      ? new OwnPromiseCapability(C)\n      : newGenericPromiseCapability(C);\n  };\n}\n\n$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });\n__webpack_require__(23)($Promise, PROMISE);\n__webpack_require__(67)(PROMISE);\nWrapper = __webpack_require__(4)[PROMISE];\n\n// statics\n$export($export.S + $export.F * !USE_NATIVE, PROMISE, {\n  // 25.4.4.5 Promise.reject(r)\n  reject: function reject(r) {\n    var capability = newPromiseCapability(this);\n    var $$reject = capability.reject;\n    $$reject(r);\n    return capability.promise;\n  }\n});\n$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {\n  // 25.4.4.6 Promise.resolve(x)\n  resolve: function resolve(x) {\n    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);\n  }\n});\n$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(68)(function (iter) {\n  $Promise.all(iter)['catch'](empty);\n})), PROMISE, {\n  // 25.4.4.1 Promise.all(iterable)\n  all: function all(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var resolve = capability.resolve;\n    var reject = capability.reject;\n    var result = perform(function () {\n      var values = [];\n      var index = 0;\n      var remaining = 1;\n      forOf(iterable, false, function (promise) {\n        var $index = index++;\n        var alreadyCalled = false;\n        values.push(undefined);\n        remaining++;\n        C.resolve(promise).then(function (value) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[$index] = value;\n          --remaining || resolve(values);\n        }, reject);\n      });\n      --remaining || resolve(values);\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  },\n  // 25.4.4.4 Promise.race(iterable)\n  race: function race(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var reject = capability.reject;\n    var result = perform(function () {\n      forOf(iterable, false, function (promise) {\n        C.resolve(promise).then(capability.resolve, reject);\n      });\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  }\n});\n\n\n/***/ }),\n/* 55 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it, Constructor, name, forbiddenField) {\n  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {\n    throw TypeError(name + ': incorrect invocation!');\n  } return it;\n};\n\n\n/***/ }),\n/* 56 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ctx = __webpack_require__(13);\nvar call = __webpack_require__(57);\nvar isArrayIter = __webpack_require__(58);\nvar anObject = __webpack_require__(3);\nvar toLength = __webpack_require__(30);\nvar getIterFn = __webpack_require__(59);\nvar BREAK = {};\nvar RETURN = {};\nvar exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {\n  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);\n  var f = ctx(fn, that, entries ? 2 : 1);\n  var index = 0;\n  var length, step, iterator, result;\n  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');\n  // fast case for arrays with default iterator\n  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {\n    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);\n    if (result === BREAK || result === RETURN) return result;\n  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {\n    result = call(iterator, f, step.value, entries);\n    if (result === BREAK || result === RETURN) return result;\n  }\n};\nexports.BREAK = BREAK;\nexports.RETURN = RETURN;\n\n\n/***/ }),\n/* 57 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// call something on iterator step with safe closing on error\nvar anObject = __webpack_require__(3);\nmodule.exports = function (iterator, fn, value, entries) {\n  try {\n    return entries ? fn(anObject(value)[0], value[1]) : fn(value);\n  // 7.4.6 IteratorClose(iterator, completion)\n  } catch (e) {\n    var ret = iterator['return'];\n    if (ret !== undefined) anObject(ret.call(iterator));\n    throw e;\n  }\n};\n\n\n/***/ }),\n/* 58 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// check on default Array iterator\nvar Iterators = __webpack_require__(9);\nvar ITERATOR = __webpack_require__(0)('iterator');\nvar ArrayProto = Array.prototype;\n\nmodule.exports = function (it) {\n  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);\n};\n\n\n/***/ }),\n/* 59 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar classof = __webpack_require__(15);\nvar ITERATOR = __webpack_require__(0)('iterator');\nvar Iterators = __webpack_require__(9);\nmodule.exports = __webpack_require__(4).getIteratorMethod = function (it) {\n  if (it != undefined) return it[ITERATOR]\n    || it['@@iterator']\n    || Iterators[classof(it)];\n};\n\n\n/***/ }),\n/* 60 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// 7.3.20 SpeciesConstructor(O, defaultConstructor)\nvar anObject = __webpack_require__(3);\nvar aFunction = __webpack_require__(14);\nvar SPECIES = __webpack_require__(0)('species');\nmodule.exports = function (O, D) {\n  var C = anObject(O).constructor;\n  var S;\n  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);\n};\n\n\n/***/ }),\n/* 61 */\n/***/ (function(module, exports) {\n\n// fast apply, http://jsperf.lnkit.com/fast-apply/5\nmodule.exports = function (fn, args, that) {\n  var un = that === undefined;\n  switch (args.length) {\n    case 0: return un ? fn()\n                      : fn.call(that);\n    case 1: return un ? fn(args[0])\n                      : fn.call(that, args[0]);\n    case 2: return un ? fn(args[0], args[1])\n                      : fn.call(that, args[0], args[1]);\n    case 3: return un ? fn(args[0], args[1], args[2])\n                      : fn.call(that, args[0], args[1], args[2]);\n    case 4: return un ? fn(args[0], args[1], args[2], args[3])\n                      : fn.call(that, args[0], args[1], args[2], args[3]);\n  } return fn.apply(that, args);\n};\n\n\n/***/ }),\n/* 62 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(1);\nvar macrotask = __webpack_require__(33).set;\nvar Observer = global.MutationObserver || global.WebKitMutationObserver;\nvar process = global.process;\nvar Promise = global.Promise;\nvar isNode = __webpack_require__(10)(process) == 'process';\n\nmodule.exports = function () {\n  var head, last, notify;\n\n  var flush = function () {\n    var parent, fn;\n    if (isNode && (parent = process.domain)) parent.exit();\n    while (head) {\n      fn = head.fn;\n      head = head.next;\n      try {\n        fn();\n      } catch (e) {\n        if (head) notify();\n        else last = undefined;\n        throw e;\n      }\n    } last = undefined;\n    if (parent) parent.enter();\n  };\n\n  // Node.js\n  if (isNode) {\n    notify = function () {\n      process.nextTick(flush);\n    };\n  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339\n  } else if (Observer && !(global.navigator && global.navigator.standalone)) {\n    var toggle = true;\n    var node = document.createTextNode('');\n    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new\n    notify = function () {\n      node.data = toggle = !toggle;\n    };\n  // environments with maybe non-completely correct, but existent Promise\n  } else if (Promise && Promise.resolve) {\n    // Promise.resolve without an argument throws an error in LG WebOS 2\n    var promise = Promise.resolve(undefined);\n    notify = function () {\n      promise.then(flush);\n    };\n  // for other environments - macrotask based on:\n  // - setImmediate\n  // - MessageChannel\n  // - window.postMessag\n  // - onreadystatechange\n  // - setTimeout\n  } else {\n    notify = function () {\n      // strange IE + webpack dev server bug - use .call(global)\n      macrotask.call(global, flush);\n    };\n  }\n\n  return function (fn) {\n    var task = { fn: fn, next: undefined };\n    if (last) last.next = task;\n    if (!head) {\n      head = task;\n      notify();\n    } last = task;\n  };\n};\n\n\n/***/ }),\n/* 63 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (exec) {\n  try {\n    return { e: false, v: exec() };\n  } catch (e) {\n    return { e: true, v: e };\n  }\n};\n\n\n/***/ }),\n/* 64 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(1);\nvar navigator = global.navigator;\n\nmodule.exports = navigator && navigator.userAgent || '';\n\n\n/***/ }),\n/* 65 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(3);\nvar isObject = __webpack_require__(7);\nvar newPromiseCapability = __webpack_require__(34);\n\nmodule.exports = function (C, x) {\n  anObject(C);\n  if (isObject(x) && x.constructor === C) return x;\n  var promiseCapability = newPromiseCapability.f(C);\n  var resolve = promiseCapability.resolve;\n  resolve(x);\n  return promiseCapability.promise;\n};\n\n\n/***/ }),\n/* 66 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar redefine = __webpack_require__(6);\nmodule.exports = function (target, src, safe) {\n  for (var key in src) redefine(target, key, src[key], safe);\n  return target;\n};\n\n\n/***/ }),\n/* 67 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar global = __webpack_require__(1);\nvar dP = __webpack_require__(11);\nvar DESCRIPTORS = __webpack_require__(8);\nvar SPECIES = __webpack_require__(0)('species');\n\nmodule.exports = function (KEY) {\n  var C = global[KEY];\n  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {\n    configurable: true,\n    get: function () { return this; }\n  });\n};\n\n\n/***/ }),\n/* 68 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar ITERATOR = __webpack_require__(0)('iterator');\nvar SAFE_CLOSING = false;\n\ntry {\n  var riter = [7][ITERATOR]();\n  riter['return'] = function () { SAFE_CLOSING = true; };\n  // eslint-disable-next-line no-throw-literal\n  Array.from(riter, function () { throw 2; });\n} catch (e) { /* empty */ }\n\nmodule.exports = function (exec, skipClosing) {\n  if (!skipClosing && !SAFE_CLOSING) return false;\n  var safe = false;\n  try {\n    var arr = [7];\n    var iter = arr[ITERATOR]();\n    iter.next = function () { return { done: safe = true }; };\n    arr[ITERATOR] = function () { return iter; };\n    exec(arr);\n  } catch (e) { /* empty */ }\n  return safe;\n};\n\n\n/***/ }),\n/* 69 */\n/***/ (function(module, __webpack_exports__, __webpack_require__) {\n\n\"use strict\";\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js\n/*! *****************************************************************************\r\nCopyright (c) Microsoft Corporation. All rights reserved.\r\nLicensed under the Apache License, Version 2.0 (the \"License\"); you may not use\r\nthis file except in compliance with the License. You may obtain a copy of the\r\nLicense at http://www.apache.org/licenses/LICENSE-2.0\r\n\r\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\r\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\r\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\r\nMERCHANTABLITY OR NON-INFRINGEMENT.\r\n\r\nSee the Apache Version 2.0 License for specific language governing permissions\r\nand limitations under the License.\r\n***************************************************************************** */\r\n/* global Reflect, Promise */\r\n\r\nvar extendStatics = function(d, b) {\r\n    extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return extendStatics(d, b);\r\n};\r\n\r\nfunction __extends(d, b) {\r\n    extendStatics(d, b);\r\n    function __() { this.constructor = d; }\r\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n}\r\n\r\nvar __assign = function() {\r\n    __assign = Object.assign || function __assign(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\r\n        }\r\n        return t;\r\n    }\r\n    return __assign.apply(this, arguments);\r\n}\r\n\r\nfunction __rest(s, e) {\r\n    var t = {};\r\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\r\n        t[p] = s[p];\r\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\r\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)\r\n            t[p[i]] = s[p[i]];\r\n    return t;\r\n}\r\n\r\nfunction __decorate(decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n}\r\n\r\nfunction __param(paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n}\r\n\r\nfunction __metadata(metadataKey, metadataValue) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(metadataKey, metadataValue);\r\n}\r\n\r\nfunction __awaiter(thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n}\r\n\r\nfunction __generator(thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n}\r\n\r\nfunction __exportStar(m, exports) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\n\r\nfunction __values(o) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator], i = 0;\r\n    if (m) return m.call(o);\r\n    return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n}\r\n\r\nfunction __read(o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n}\r\n\r\nfunction __spread() {\r\n    for (var ar = [], i = 0; i < arguments.length; i++)\r\n        ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n}\r\n\r\nfunction __await(v) {\r\n    return this instanceof __await ? (this.v = v, this) : new __await(v);\r\n}\r\n\r\nfunction __asyncGenerator(thisArg, _arguments, generator) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var g = generator.apply(thisArg, _arguments || []), i, q = [];\r\n    return i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i;\r\n    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }\r\n    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }\r\n    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }\r\n    function fulfill(value) { resume(\"next\", value); }\r\n    function reject(value) { resume(\"throw\", value); }\r\n    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }\r\n}\r\n\r\nfunction __asyncDelegator(o) {\r\n    var i, p;\r\n    return i = {}, verb(\"next\"), verb(\"throw\", function (e) { throw e; }), verb(\"return\"), i[Symbol.iterator] = function () { return this; }, i;\r\n    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === \"return\" } : f ? f(v) : v; } : f; }\r\n}\r\n\r\nfunction __asyncValues(o) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var m = o[Symbol.asyncIterator], i;\r\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\r\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\r\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\r\n}\r\n\r\nfunction __makeTemplateObject(cooked, raw) {\r\n    if (Object.defineProperty) { Object.defineProperty(cooked, \"raw\", { value: raw }); } else { cooked.raw = raw; }\r\n    return cooked;\r\n};\r\n\r\nfunction __importStar(mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result.default = mod;\r\n    return result;\r\n}\r\n\r\nfunction __importDefault(mod) {\r\n    return (mod && mod.__esModule) ? mod : { default: mod };\r\n}\r\n\n// EXTERNAL MODULE: ./node_modules/lunr/lunr.js\nvar lunr = __webpack_require__(2);\n\n// CONCATENATED MODULE: ./node_modules/workerize-loader/dist/rpc-worker-loader.js!./node_modules/ts-loader??ref--4-0!./node_modules/babel-loader/lib??ref--4-1!./src/services/SearchWorker.worker.ts\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"done\", function() { return done; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toJS\", function() { return toJS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"load\", function() { return load; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"search\", function() { return search; });\n\n\ntry {\n    // tslint:disable-next-line\n    __webpack_require__(35); // bundle into worker\n}\ncatch (_) { } // nope\n/* just for better typings */\nvar Worker = /** @class */ (function () {\n    function Worker() {\n        this.add = add;\n        this.done = done;\n        this.search = search;\n        this.toJS = toJS;\n        this.load = load;\n    }\n    return Worker;\n}());\n/* harmony default export */ var SearchWorker_worker = __webpack_exports__[\"default\"] = (Worker);\nvar store = [];\nvar resolveIndex = function () {\n    throw new Error('Should not be called');\n};\nvar index = new Promise(function (resolve) {\n    resolveIndex = resolve;\n});\nlunr[\"tokenizer\"].separator = /\\s+/;\nvar builder = new lunr[\"Builder\"]();\nbuilder.field('title');\nbuilder.field('description');\nbuilder.ref('ref');\nbuilder.pipeline.add(lunr[\"trimmer\"], lunr[\"stopWordFilter\"], lunr[\"stemmer\"]);\nvar expandTerm = function (term) { return '*' + lunr[\"stemmer\"](new lunr[\"Token\"](term, {})) + '*'; };\nfunction add(title, description, meta) {\n    var ref = store.push(meta) - 1;\n    var item = {\n        title: title.toLowerCase(),\n        description: description.toLowerCase(),\n        ref: ref\n    };\n    builder.add(item);\n}\nfunction done() {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            resolveIndex(builder.build());\n            return [2 /*return*/];\n        });\n    });\n}\nfunction toJS() {\n    return __awaiter(this, void 0, void 0, function () {\n        var _a;\n        return __generator(this, function (_b) {\n            switch (_b.label) {\n                case 0:\n                    _a = {\n                        store: store\n                    };\n                    return [4 /*yield*/, index];\n                case 1: return [2 /*return*/, (_a.index = (_b.sent()).toJSON(),\n                        _a)];\n            }\n        });\n    });\n}\nfunction load(state) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            store = state.store;\n            resolveIndex(lunr[\"Index\"].load(state.index));\n            return [2 /*return*/];\n        });\n    });\n}\nfunction search(q, limit) {\n    if (limit === void 0) { limit = 0; }\n    return __awaiter(this, void 0, void 0, function () {\n        var searchResults;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    if (q.trim().length === 0) {\n                        return [2 /*return*/, []];\n                    }\n                    return [4 /*yield*/, index];\n                case 1:\n                    searchResults = (_a.sent()).query(function (t) {\n                        q.trim().toLowerCase().split(/\\s+/).forEach(function (term) {\n                            var exp = expandTerm(term);\n                            t.term(exp, {});\n                        });\n                    });\n                    if (limit > 0) {\n                        searchResults = searchResults.slice(0, limit);\n                    }\n                    return [2 /*return*/, searchResults.map(function (res) { return ({\n                            meta: store[res.ref],\n                            score: res.score\n                        }); })];\n            }\n        });\n    });\n}\n\naddEventListener('message', function (e) {var ref = e.data;var type = ref.type;var method = ref.method;var id = ref.id;var params = ref.params;var f, p;if (type === 'RPC' && method) {if (f = __webpack_exports__[method]) {p = Promise.resolve().then(function () { return f.apply(__webpack_exports__, params); });} else {p = Promise.reject('No such method');}p.then(function (result) {postMessage({type: 'RPC',id: id,result: result});}).catch(function (e) {var error = {message: e};if (e.stack) {error.message = e.message;error.stack = e.stack;error.name = e.name;}postMessage({type: 'RPC',id: id,error: error});});}});postMessage({type: 'RPC',method: 'ready'});\n\n/***/ })\n/******/ ]);\n//# sourceMappingURL=99b31eea13ec7d991864.worker.js.map"])), { name: "[hash].worker.js" })
					addMethods(w, methods)
					
					return w
				}
			

/***/ }),
/* 63 */
/***/ (function(module, exports) {

function addMethods(worker, methods) {
    var c = 0;
    var callbacks = {};
    worker.addEventListener('message', function (e) {
        var d = e.data;
        if (d.type !== 'RPC') 
            { return; }
        if (d.id) {
            var f = callbacks[d.id];
            if (f) {
                delete callbacks[d.id];
                if (d.error) {
                    f[1](Object.assign(Error(d.error.message), d.error));
                } else {
                    f[0](d.result);
                }
            }
        } else {
            var evt = document.createEvent('Event');
            evt.initEvent(d.method, false, false);
            evt.data = d.params;
            worker.dispatchEvent(evt);
        }
    });
    methods.forEach(function (method) {
        worker[method] = (function () {
            var params = [], len = arguments.length;
            while ( len-- ) params[ len ] = arguments[ len ];

            return new Promise(function (a, b) {
            var id = ++c;
            callbacks[id] = [a,b];
            worker.postMessage({
                type: 'RPC',
                id: id,
                method: method,
                params: params
            });
        });
        });
    });
}

module.exports = addMethods;


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("core-js/es6/promise");

/***/ }),
/* 65 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("stickyfill");

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "tslib"
var external_tslib_ = __webpack_require__(1);

// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(9);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);

// EXTERNAL MODULE: external "polished"
var external_polished_ = __webpack_require__(4);

// CONCATENATED MODULE: ./src/theme.ts

var defaultTheme = {
    spacing: {
        unit: 5,
        sectionHorizontal: function (_a) {
            var spacing = _a.spacing;
            return spacing.unit * 8;
        },
        sectionVertical: 0
    },
    breakpoints: {
        small: '50rem',
        medium: '85rem',
        large: '105rem'
    },
    colors: {
        tonalOffset: 0.3,
        primary: {
            main: '#697cff',
            light: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["lighten"])(colors.tonalOffset, colors.primary.main);
            },
            dark: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["darken"])(colors.tonalOffset, colors.primary.main);
            },
            contrastText: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["readableColor"])(colors.primary.main);
            }
        },
        success: {
            main: '#2cb72d',
            light: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["lighten"])(colors.tonalOffset, colors.success.main);
            },
            dark: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["darken"])(colors.tonalOffset, colors.success.main);
            },
            contrastText: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["readableColor"])(colors.success.main);
            }
        },
        warning: {
            main: '#ff8f73',
            light: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["lighten"])(colors.tonalOffset, colors.warning.main);
            },
            dark: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["darken"])(colors.tonalOffset, colors.warning.main);
            },
            contrastText: '#ffffff'
        },
        error: {
            main: '#fc5b4f',
            light: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["lighten"])(colors.tonalOffset, colors.error.main);
            },
            dark: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["darken"])(colors.tonalOffset, colors.error.main);
            },
            contrastText: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["readableColor"])(colors.error.main);
            }
        },
        text: {
            primary: '#333333',
            secondary: function (_a) {
                var colors = _a.colors;
                return Object(external_polished_["lighten"])(colors.tonalOffset, colors.text.primary);
            }
        },
        border: {
            dark: 'rgba(0,0,0, 0.1)',
            light: '#ffffff'
        },
        responses: {
            success: {
                color: function (_a) {
                    var colors = _a.colors;
                    return colors.success.main;
                },
                backgroundColor: function (_a) {
                    var colors = _a.colors;
                    return Object(external_polished_["transparentize"])(0.9, colors.success.main);
                }
            },
            error: {
                color: function (_a) {
                    var colors = _a.colors;
                    return colors.error.main;
                },
                backgroundColor: function (_a) {
                    var colors = _a.colors;
                    return Object(external_polished_["transparentize"])(0.9, colors.error.main);
                }
            },
            redirect: {
                color: '#ffa500',
                backgroundColor: function (_a) {
                    var colors = _a.colors;
                    return Object(external_polished_["transparentize"])(0.9, colors.responses.redirect.color);
                }
            },
            info: {
                color: '#87ceeb',
                backgroundColor: function (_a) {
                    var colors = _a.colors;
                    return Object(external_polished_["transparentize"])(0.9, colors.responses.info.color);
                }
            }
        },
        http: {
            get: '#2cb72d',
            post: '#697cff',
            put: '#fbc03d',
            options: '#d3ca12',
            patch: '#e09d43',
            delete: '#e27a7a',
            basic: '#999',
            link: '#31bbb6',
            head: '#c167e4'
        }
    },
    schema: {
        linesColor: '#ddd',
        defaultDetailsWidth: '75%',
        typeNameColor: function (theme) { return theme.colors.text.secondary; },
        typeTitleColor: function (theme) { return theme.schema.typeNameColor; },
        optionalLabelColor: function (theme) { return theme.colors.success.main; },
        labelsTextSize: '0.9em',
        nestingSpacing: '1em',
        nestedBackground: '#fafafa',
        arrow: {
            size: '1.1em',
            color: function (theme) { return theme.colors.text.secondary; }
        }
    },
    typography: {
        fontSize: '14px',
        lineHeight: '1.5em',
        fontWeightRegular: '400',
        fontWeightBold: '600',
        fontWeightLight: '300',
        fontFamily: 'Roboto, sans-serif',
        smoothing: 'antialiased',
        optimizeSpeed: true,
        headings: {
            fontFamily: 'Arial',
            fontWeight: '400'
        },
        code: {
            fontSize: '13px',
            fontFamily: 'Courier, monospace',
            lineHeight: function (_a) {
                var typography = _a.typography;
                return typography.lineHeight;
            },
            fontWeight: function (_a) {
                var typography = _a.typography;
                return typography.fontWeightRegular;
            },
            color: '#e53935',
            backgroundColor: 'rgba(38, 50, 56, 0.05)',
            wrap: false
        },
        links: {
            color: function (_a) {
                var colors = _a.colors;
                return colors.primary.main;
            },
            visited: function (_a) {
                var typography = _a.typography;
                return typography.links.color;
            },
            hover: function (_a) {
                var typography = _a.typography;
                return Object(external_polished_["lighten"])(0.2, typography.links.color);
            }
        }
    },
    menu: {
        width: '260px',
        backgroundColor: '#fafafa',
        textColor: '#333333',
        groupItems: {
            textTransform: 'uppercase'
        },
        level1Items: {
            textTransform: 'none'
        },
        arrow: {
            size: '1.5em',
            color: function (theme) { return theme.menu.textColor; }
        }
    },
    logo: {
        maxHeight: function (_a) {
            var menu = _a.menu;
            return menu.width;
        },
        maxWidth: function (_a) {
            var menu = _a.menu;
            return menu.width;
        }
    },
    rightPanel: {
        backgroundColor: '#ffffff',
        width: '40%',
        textColor: '#333333'
    },
    codeSample: {
        backgroundColor: '#f8f8f8'
    }
};
/* harmony default export */ var src_theme = (defaultTheme);
function resolveTheme(theme) {
    var resolvedValues = {};
    var counter = 0;
    var setProxy = function (obj, path) {
        Object.keys(obj).forEach(function (k) {
            var currentPath = (path ? path + '.' : '') + k;
            var val = obj[k];
            if (typeof val === 'function') {
                Object.defineProperty(obj, k, {
                    get: function () {
                        if (!resolvedValues[currentPath]) {
                            counter++;
                            if (counter > 1000) {
                                throw new Error("Theme probably contains cirucal dependency at " + currentPath + ": " + val.toString());
                            }
                            resolvedValues[currentPath] = val(theme);
                        }
                        return resolvedValues[currentPath];
                    },
                    enumerable: true
                });
            }
            else if (typeof val === 'object') {
                setProxy(val, currentPath);
            }
        });
    };
    setProxy(theme, '');
    return JSON.parse(JSON.stringify(theme));
}

// CONCATENATED MODULE: ./src/utils/dom.ts
var IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;
function querySelector(selector) {
    if (typeof document !== 'undefined') {
        return document.querySelector(selector);
    }
    return null;
}
/**
 * Drop everything inside <...> (i.e., tags/elements), and keep the text.
 * Unlike browser innerText, this removes newlines; it also doesn't handle
 * un-encoded `<` or `>` characters very well, so don't feed it malformed HTML
 */
function html2Str(html) {
    return html.split(/<[^>]+>/).map(function (chunk) {
        return chunk.trim();
    }).filter(function (trimmedChunk) {
        return trimmedChunk.length > 0;
    }).join(' ');
} // scrollIntoViewIfNeeded polyfill
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
        centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;
        var parent = this.parentNode;
        var parentComputedStyle = window.getComputedStyle(parent, undefined);
        var parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'), 10);
        var parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width'), 10);
        var overTop = this.offsetTop - parent.offsetTop < parent.scrollTop;
        var overBottom = this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth > parent.scrollTop + parent.clientHeight;
        var overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft;
        var overRight = this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth > parent.scrollLeft + parent.clientWidth;
        var alignWithTop = overTop && !overBottom;
        if ((overTop || overBottom) && centerIfNeeded) {
            parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
        }
        if ((overLeft || overRight) && centerIfNeeded) {
            parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
        }
        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
            this.scrollIntoView(alignWithTop);
        }
    };
}

// EXTERNAL MODULE: external "slugify"
var external_slugify_ = __webpack_require__(29);
var external_slugify_default = /*#__PURE__*/__webpack_require__.n(external_slugify_);

// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(7);

// CONCATENATED MODULE: ./src/utils/helpers.ts



/**
 * Maps over array passing `isLast` bool to iterator as the second arguemnt
 */
function mapWithLast(array, iteratee) {
    var res = [];
    for (var i = 0; i < array.length - 1; i++) {
        res.push(iteratee(array[i], false));
    }
    if (array.length !== 0) {
        res.push(iteratee(array[array.length - 1], true));
    }
    return res;
}
/**
 * Creates an object with the same keys as object and values generated by running each
 * own enumerable string keyed property of object thru iteratee.
 * The iteratee is invoked with three arguments: (value, key, object).
 *
 * @param object the object to iterate over
 * @param iteratee the function invoked per iteration.
 */
function mapValues(object, iteratee) {
    var res = {};
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            res[key] = iteratee(object[key], key, object);
        }
    }
    return res;
}
/**
 * flattens collection using `prop` field as a children
 * @param collectionItems collection items
 * @param prop item property with child elements
 */
function flattenByProp(collectionItems, prop) {
    var res = [];
    var iterate = function (items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            res.push(item);
            if (item[prop]) {
                iterate(item[prop]);
            }
        }
    };
    iterate(collectionItems);
    return res;
}
function stripTrailingSlash(path) {
    if (path.endsWith('/')) {
        return path.substring(0, path.length - 1);
    }
    return path;
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function appendToMdHeading(md, heading, content) {
    // if  heading is already in md and append to the end of it
    var testRegex = new RegExp("(^|\\n)#\\s?" + heading + "\\s*\\n", 'i');
    var replaceRegex = new RegExp("((\\n|^)#\\s*" + heading + "\\s*(\\n|$)(?:.|\\n)*?)(\\n#|$)", 'i');
    if (testRegex.test(md)) {
        return md.replace(replaceRegex, "$1\n\n" + content + "\n$4");
    }
    else {
        // else append heading itself
        var br = md === '' || md.endsWith('\n\n') ? '' : md.endsWith('\n') ? '\n' : '\n\n';
        return "" + md + br + "# " + heading + "\n\n" + content;
    }
} // credits https://stackoverflow.com/a/46973278/1749888
var mergeObjects = function (target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length) {
        return target;
    }
    var source = sources.shift();
    if (source === undefined) {
        return target;
    }
    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeObjects(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        });
    }
    return mergeObjects.apply(void 0, [target].concat(sources));
};
var isObject = function (item) {
    return item !== null && typeof item === 'object';
};
var isMergebleObject = function (item) {
    return isObject(item) && !Array.isArray(item);
};
/**
 * slugify() returns empty string when failed to slugify.
 * so try to return minimun slugified-string with failed one which keeps original value
 * the regex codes are referenced with https://gist.github.com/mathewbyrne/1280286
 */
function safeSlugify(value) {
    return external_slugify_default()(value) || value.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/\--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}
function isAbsoluteUrl(url) {
    return /(?:^[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}
/**
 * simple resolve URL which doesn't break on strings with url fragments
 * e.g. resolveUrl('http://test.com:{port}', 'path') results in http://test.com:{port}/path
 */
function resolveUrl(url, to) {
    var res;
    if (to.startsWith('//')) {
        var specProtocol = Object(external_url_["parse"])(url).protocol;
        res = "" + specProtocol + to;
    }
    else if (isAbsoluteUrl(to)) {
        res = to;
    }
    else if (!to.startsWith('/')) {
        res = stripTrailingSlash(url) + '/' + to;
    }
    else {
        var urlObj = Object(external_url_["parse"])(url);
        res = Object(external_url_["format"])(external_tslib_["__assign"]({}, urlObj, { pathname: to }));
    }
    return stripTrailingSlash(res);
}
function getBasePath(serverUrl) {
    return new URL(serverUrl).pathname;
}

// CONCATENATED MODULE: ./src/services/RedocNormalizedOptions.ts




function argValueToBoolean(val) {
    if (val === undefined) {
        return false;
    }
    if (typeof val === 'string') {
        return true;
    }
    return val;
}
var RedocNormalizedOptions_RedocNormalizedOptions = /** @class */ (function () {
    function RedocNormalizedOptions(raw, defaults) {
        if (defaults === void 0) { defaults = {}; }
        raw = external_tslib_["__assign"]({}, defaults, raw);
        var hook = raw.theme && raw.theme.extensionsHook;
        this.theme = resolveTheme(mergeObjects({}, src_theme, external_tslib_["__assign"]({}, raw.theme, { extensionsHook: undefined })));
        this.theme.extensionsHook = hook;
        this.scrollYOffset = RedocNormalizedOptions.normalizeScrollYOffset(raw.scrollYOffset);
        this.hideHostname = RedocNormalizedOptions.normalizeHideHostname(raw.hideHostname);
        this.expandResponses = RedocNormalizedOptions.normalizeExpandResponses(raw.expandResponses);
        this.requiredPropsFirst = argValueToBoolean(raw.requiredPropsFirst);
        this.sortPropsAlphabetically = argValueToBoolean(raw.sortPropsAlphabetically);
        this.noAutoAuth = argValueToBoolean(raw.noAutoAuth);
        this.nativeScrollbars = argValueToBoolean(raw.nativeScrollbars);
        this.pathInMiddlePanel = true;
        this.untrustedSpec = argValueToBoolean(raw.untrustedSpec);
        this.hideDownloadButton = argValueToBoolean(raw.hideDownloadButton);
        this.disableSearch = true; //argValueToBoolean(raw.disableSearch);
        this.onlyRequiredInSamples = argValueToBoolean(raw.onlyRequiredInSamples);
        this.showExtensions = RedocNormalizedOptions.normalizeShowExtensions(raw.showExtensions);
        this.unstable_ignoreMimeParameters = argValueToBoolean(raw.unstable_ignoreMimeParameters);
        this.allowedMdComponents = raw.allowedMdComponents || {};
    }
    RedocNormalizedOptions.normalizeExpandResponses = function (value) {
        if (value === 'all') {
            return 'all';
        }
        if (typeof value === 'string') {
            var res_1 = {};
            value.split(',').forEach(function (code) {
                res_1[code.trim()] = true;
            });
            return res_1;
        }
        else if (value !== undefined) {
            console.warn("expandResponses must be a string but received value \"" + value + "\" of type " + typeof value);
        }
        return {};
    };
    RedocNormalizedOptions.normalizeHideHostname = function (value) {
        return !!value;
    };
    RedocNormalizedOptions.normalizeScrollYOffset = function (value) {
        // just number is not valid selector and leads to crash so checking if isNumeric here
        if (typeof value === 'string' && !isNumeric(value)) {
            var el = querySelector(value);
            if (!el) {
                console.warn('scrollYOffset value is a selector to non-existing element. Using offset 0 by default');
            }
            var bottom_1 = el && el.getBoundingClientRect().bottom || 0;
            return function () { return bottom_1; };
        }
        else if (typeof value === 'number' || isNumeric(value)) {
            return function () { return typeof value === 'number' ? value : parseFloat(value); };
        }
        else if (typeof value === 'function') {
            return function () {
                var res = value();
                if (typeof res !== 'number') {
                    console.warn("scrollYOffset should return number but returned value \"" + res + "\" of type " + typeof res);
                }
                return res;
            };
        }
        else if (value !== undefined) {
            console.warn('Wrong value for scrollYOffset ReDoc option: should be string, number or function');
        }
        return function () { return 0; };
    };
    RedocNormalizedOptions.normalizeShowExtensions = function (value) {
        if (typeof value === 'undefined') {
            return false;
        }
        if (value === '') {
            return true;
        }
        if (typeof value === 'string') {
            return value.split(',').map(function (ext) { return ext.trim(); });
        }
        return value;
    };
    return RedocNormalizedOptions;
}());


// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(30);

// CONCATENATED MODULE: ./src/styled-components.ts


var styled_components_a = external_styled_components_, styled = styled_components_a.default, css = styled_components_a.css, createGlobalStyle = styled_components_a.createGlobalStyle, keyframes = styled_components_a.keyframes, ThemeProvider = styled_components_a.ThemeProvider;
var media = {
    lessThan: function (breakpoint, print) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_1 || (templateObject_1 = external_tslib_["__makeTemplateObject"](["\n      @media ", " screen and (max-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media ", " screen and (max-width: ", ") {\n        ", ";\n      }\n    "])), print ? 'print, ' : '', function (props) { return props.theme.breakpoints[breakpoint]; }, css.apply(void 0, args));
        };
    },
    greaterThan: function (breakpoint) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_2 || (templateObject_2 = external_tslib_["__makeTemplateObject"](["\n      @media (min-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media (min-width: ", ") {\n        ", ";\n      }\n    "])), function (props) { return props.theme.breakpoints[breakpoint]; }, css.apply(void 0, args));
        };
    },
    between: function (firstBreakpoint, secondBreakpoint) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_3 || (templateObject_3 = external_tslib_["__makeTemplateObject"](["\n      @media (min-width: ", ") and (max-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media (min-width: ", ") and (max-width: ", ") {\n        ", ";\n      }\n    "])), function (props) { return props.theme.breakpoints[firstBreakpoint]; }, function (props) { return props.theme.breakpoints[secondBreakpoint]; }, css.apply(void 0, args));
        };
    }
};

/* harmony default export */ var styled_components = (styled);
function extensionsHook(styledName) {
    return function (props) {
        if (!props.theme.extensionsHook) {
            return;
        }
        return props.theme.extensionsHook(styledName, props);
    };
}
var templateObject_1, templateObject_2, templateObject_3;

// CONCATENATED MODULE: ./src/components/ErrorBoundary.tsx



var ErrorWrapper = styled_components.div.withConfig({
    componentId: "cxucko-0"
})(["padding:20px;color:red;"]);
var ErrorBoundary_ErrorBoundary = /** @class */ (function (_super) {
    external_tslib_["__extends"](ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            error: undefined
        };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error) {
        this.setState({
            error: error
        });
        return false;
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.error) {
            return external_react_["createElement"](ErrorWrapper, null,
                external_react_["createElement"]("h1", null, "Something went wrong..."),
                external_react_["createElement"]("small", null,
                    " ",
                    this.state.error.message,
                    " "),
                external_react_["createElement"]("p", null,
                    external_react_["createElement"]("details", null,
                        external_react_["createElement"]("summary", null, "Stack trace"),
                        external_react_["createElement"]("pre", null, this.state.error.stack))),
                external_react_["createElement"]("small", null,
                    " ReDoc Version: ",
                    "2.0.0-rc.0"),
                " ",
                external_react_["createElement"]("br", null),
                external_react_["createElement"]("small", null,
                    " Commit: ",
                    "b9b1d69"));
        }
        return external_react_["Children"].only(this.props.children);
    };
    return ErrorBoundary;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Loading/Spinner.svg.tsx


var _Spinner = function (props) { return external_react_["createElement"]("svg", { className: props.className, version: "1.1", width: "512", height: "512", viewBox: "0 0 512 512" },
    external_react_["createElement"]("path", { d: "M275.682 147.999c0 10.864-8.837 19.661-19.682 19.661v0c-10.875 0-19.681-8.796-19.681-19.661v-96.635c0-10.885 8.806-19.661 19.681-19.661v0c10.844 0 19.682 8.776 19.682 19.661v96.635z" }),
    external_react_["createElement"]("path", { d: "M275.682 460.615c0 10.865-8.837 19.682-19.682 19.682v0c-10.875 0-19.681-8.817-19.681-19.682v-96.604c0-10.885 8.806-19.681 19.681-19.681v0c10.844 0 19.682 8.796 19.682 19.682v96.604z" }),
    external_react_["createElement"]("path", { d: "M147.978 236.339c10.885 0 19.681 8.755 19.681 19.641v0c0 10.885-8.796 19.702-19.681 19.702h-96.624c-10.864 0-19.661-8.817-19.661-19.702v0c0-10.885 8.796-19.641 19.661-19.641h96.624z" }),
    external_react_["createElement"]("path", { d: "M460.615 236.339c10.865 0 19.682 8.755 19.682 19.641v0c0 10.885-8.817 19.702-19.682 19.702h-96.584c-10.885 0-19.722-8.817-19.722-19.702v0c0-10.885 8.837-19.641 19.722-19.641h96.584z" }),
    external_react_["createElement"]("path", { d: "M193.546 165.703c7.69 7.66 7.68 20.142 0 27.822v0c-7.701 7.701-20.162 7.701-27.853 0.020l-68.311-68.322c-7.68-7.701-7.68-20.142 0-27.863v0c7.68-7.68 20.121-7.68 27.822 0l68.342 68.342z" }),
    external_react_["createElement"]("path", { d: "M414.597 386.775c7.7 7.68 7.7 20.163 0.021 27.863v0c-7.7 7.659-20.142 7.659-27.843-0.062l-68.311-68.26c-7.68-7.7-7.68-20.204 0-27.863v0c7.68-7.7 20.163-7.7 27.842 0l68.291 68.322z" }),
    external_react_["createElement"]("path", { d: "M165.694 318.464c7.69-7.7 20.153-7.7 27.853 0v0c7.68 7.659 7.69 20.163 0 27.863l-68.342 68.322c-7.67 7.659-20.142 7.659-27.822-0.062v0c-7.68-7.68-7.68-20.122 0-27.801l68.311-68.322z" }),
    external_react_["createElement"]("path", { d: "M386.775 97.362c7.7-7.68 20.142-7.68 27.822 0v0c7.7 7.68 7.7 20.183 0.021 27.863l-68.322 68.311c-7.68 7.68-20.163 7.68-27.843-0.020v0c-7.68-7.68-7.68-20.162 0-27.822l68.322-68.332z" })); };
var rotate = keyframes(["0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}"]);
var Spinner = styled_components(_Spinner).withConfig({
    componentId: "sc-8xfcsx-0"
})(["animation:2s ", " linear infinite;width:50px;height:50px;content:'';display:inline-block;margin-left:-25px;path{fill:", ";}"], rotate, function (props) { return props.color; });

// CONCATENATED MODULE: ./src/components/Loading/Loading.tsx




var LoadingMessage = styled_components.div.withConfig({
    componentId: "xhqjuh-0"
})(["font-family:helvetica,sans;width:100%;text-align:center;font-size:25px;margin:30px 0 20px 0;color:", ";"], function (props) { return props.color; });
var Loading_Loading = /** @class */ (function (_super) {
    external_tslib_["__extends"](Loading, _super);
    function Loading() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Loading.prototype.render = function () {
        return external_react_["createElement"]("div", { style: {
                textAlign: 'center'
            } },
            external_react_["createElement"](LoadingMessage, { color: this.props.color }, "Loading ..."),
            external_react_["createElement"](Spinner, { color: this.props.color }));
    };
    return Loading;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/OptionsProvider.ts


var OptionsContext = external_react_["createContext"](new RedocNormalizedOptions_RedocNormalizedOptions({}));
var OptionsProvider = OptionsContext.Provider;
var OptionsConsumer = OptionsContext.Consumer;

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(3);

// EXTERNAL MODULE: external "json-schema-ref-parser"
var external_json_schema_ref_parser_ = __webpack_require__(31);

// EXTERNAL MODULE: ./node_modules/swagger2openapi/index.js
var swagger2openapi = __webpack_require__(32);

// CONCATENATED MODULE: ./src/utils/loadAndBundleSpec.ts


/* tslint:disable-next-line:no-implicit-dependencies */

function loadAndBundleSpec(specUrlOrObject) {
    return external_tslib_["__awaiter"](this, void 0, void 0, function () {
        var parser, spec;
        return external_tslib_["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0:
                    parser = new external_json_schema_ref_parser_();
                    return [4 /*yield*/, parser.bundle(specUrlOrObject, {
                            resolve: {
                                http: {
                                    withCredentials: false
                                }
                            }
                        })];
                case 1:
                    spec = _a.sent();
                    if (spec.swagger !== undefined) {
                        return [2 /*return*/, convertSwagger2OpenAPI(spec)];
                    }
                    else {
                        return [2 /*return*/, spec];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function convertSwagger2OpenAPI(spec) {
    console.warn('[ReDoc Compatibility mode]: Converting OpenAPI 2.0 to OpenAPI 3.0');
    return new Promise(function (resolve, reject) { return Object(swagger2openapi["convertObj"])(spec, {
        patch: true,
        warnOnly: true
    }, function (err, res) {
        // TODO: log any warnings
        if (err) {
            return reject(err);
        }
        resolve(res && res.openapi);
    }); });
}

// EXTERNAL MODULE: external "decko"
var external_decko_ = __webpack_require__(10);

// EXTERNAL MODULE: external "eventemitter3"
var external_eventemitter3_ = __webpack_require__(13);

// EXTERNAL MODULE: external "json-pointer"
var external_json_pointer_ = __webpack_require__(5);

// CONCATENATED MODULE: ./src/utils/JsonPointer.ts


var origParse = external_json_pointer_["parse"];
/**
 * Wrapper for JsonPointer. Provides common operations
 */
var JsonPointer_JsonPointer = /** @class */ (function () {
    function JsonPointer() {
    }
    /**
     * returns last JsonPointer token
     * if level > 1 returns levels last (second last/third last)
     * @example
     * // returns subpath
     * JsonPointerHelper.baseName('/path/0/subpath')
     * // returns foo
     * JsonPointerHelper.baseName('/path/foo/subpath', 2)
     */
    JsonPointer.baseName = function (pointer, level) {
        if (level === void 0) { level = 1; }
        var tokens = JsonPointer.parse(pointer);
        return tokens[tokens.length - level];
    };
    /**
     * returns dirname of pointer
     * if level > 1 returns corresponding dirname in the hierarchy
     * @example
     * // returns /path/0
     * JsonPointerHelper.dirName('/path/0/subpath')
     * // returns /path
     * JsonPointerHelper.dirName('/path/foo/subpath', 2)
     */
    JsonPointer.dirName = function (pointer, level) {
        if (level === void 0) { level = 1; }
        var tokens = JsonPointer.parse(pointer);
        return external_json_pointer_["compile"](tokens.slice(0, tokens.length - level));
    };
    /**
     * returns relative path tokens
     * @example
     * // returns ['subpath']
     * JsonPointerHelper.relative('/path/0', '/path/0/subpath')
     * // returns ['foo', 'subpath']
     * JsonPointerHelper.relative('/path', '/path/foo/subpath')
     */
    JsonPointer.relative = function (from, to) {
        var fromTokens = JsonPointer.parse(from);
        var toTokens = JsonPointer.parse(to);
        return toTokens.slice(fromTokens.length);
    };
    /**
     * overridden JsonPointer original parse to take care of prefixing '#' symbol
     * that is not valid JsonPointer
     */
    JsonPointer.parse = function (pointer) {
        var ptr = pointer;
        if (ptr.charAt(0) === '#') {
            ptr = ptr.substring(1);
        }
        return origParse(ptr);
    };
    /**
     * Creates a JSON pointer path, by joining one or more tokens to a base path.
     *
     * @param {string} base - The base path
     * @param {string|string[]} tokens - The token(s) to append (e.g. ["name", "first"])
     * @returns {string}
     */
    JsonPointer.join = function (base, tokens) {
        // TODO: optimize
        var baseTokens = JsonPointer.parse(base);
        var resTokens = baseTokens.concat(tokens);
        return external_json_pointer_["compile"](resTokens);
    };
    JsonPointer.get = function (object, pointer) {
        return external_json_pointer_["get"](object, pointer);
    };
    JsonPointer.compile = function (tokens) {
        return external_json_pointer_["compile"](tokens);
    };
    JsonPointer.escape = function (pointer) {
        return external_json_pointer_["escape"](pointer);
    };
    return JsonPointer;
}());

external_json_pointer_["parse"] = JsonPointer_JsonPointer.parse;
Object.assign(JsonPointer_JsonPointer, external_json_pointer_);
/* harmony default export */ var utils_JsonPointer = (JsonPointer_JsonPointer);

// EXTERNAL MODULE: ./node_modules/path-browserify/index.js
var path_browserify = __webpack_require__(12);

// CONCATENATED MODULE: ./src/utils/openapi.ts




function isWildcardStatusCode(statusCode) {
    return typeof statusCode === 'string' && /\dxx/i.test(statusCode);
}
function isStatusCode(statusCode) {
    return statusCode === 'default' || isNumeric(statusCode) || isWildcardStatusCode(statusCode);
}
function getStatusCodeType(statusCode, defaultAsError) {
    if (defaultAsError === void 0) { defaultAsError = false; }
    if (statusCode === 'default') {
        return defaultAsError ? 'error' : 'success';
    }
    var code = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;
    if (isWildcardStatusCode(statusCode)) {
        code *= 100; // parseInt('2xx') parses to 2
    }
    if (code < 100 || code > 599) {
        throw new Error('invalid HTTP code');
    }
    var res = 'success';
    if (code >= 300 && code < 400) {
        res = 'redirect';
    }
    else if (code >= 400) {
        res = 'error';
    }
    else if (code < 200) {
        res = 'info';
    }
    return res;
}
var operationNames = {
    get: true,
    post: true,
    put: true,
    head: true,
    patch: true,
    delete: true,
    options: true
};
function isOperationName(key) {
    return key in operationNames;
}
function getOperationSummary(operation) {
    return operation.summary || operation.operationId || operation.description && operation.description.substring(0, 50) || '<no summary>';
}
var schemaKeywordTypes = {
    multipleOf: 'number',
    maximum: 'number',
    exclusiveMaximum: 'number',
    minimum: 'number',
    exclusiveMinimum: 'number',
    maxLength: 'string',
    minLength: 'string',
    pattern: 'string',
    items: 'array',
    maxItems: 'array',
    minItems: 'array',
    uniqueItems: 'array',
    maxProperties: 'object',
    minProperties: 'object',
    required: 'object',
    additionalProperties: 'object',
    properties: 'object'
};
function detectType(schema) {
    if (schema.type !== undefined) {
        return schema.type;
    }
    var keywords = Object.keys(schemaKeywordTypes);
    for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
        var keyword = keywords_1[_i];
        var type = schemaKeywordTypes[keyword];
        if (schema[keyword] !== undefined) {
            return type;
        }
    }
    return 'any';
}
function isPrimitiveType(schema, type) {
    if (type === void 0) { type = schema.type; }
    if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
        return false;
    }
    if (type === 'object') {
        return schema.properties !== undefined ? Object.keys(schema.properties).length === 0 : schema.additionalProperties === undefined;
    }
    if (type === 'array') {
        if (schema.items === undefined) {
            return true;
        }
        return false;
    }
    return true;
}
function isJsonLike(contentType) {
    return contentType.search(/json/i) !== -1;
}
function langFromMime(contentType) {
    if (contentType.search(/xml/i) !== -1) {
        return 'xml';
    }
    return 'clike';
}
function isNamedDefinition(pointer) {
    return /^#\/components\/schemas\/[^\/]+$/.test(pointer || '');
}
function humanizeRangeConstraint(description, min, max) {
    var stringRange;
    if (min !== undefined && max !== undefined) {
        if (min === max) {
            stringRange = min + " " + description;
        }
        else {
            stringRange = "[ " + min + " .. " + max + " ] " + description;
        }
    }
    else if (max !== undefined) {
        stringRange = "<= " + max + " " + description;
    }
    else if (min !== undefined) {
        if (min === 1) {
            stringRange = 'non-empty';
        }
        else {
            stringRange = ">= " + min + " " + description;
        }
    }
    return stringRange;
}
function humanizeConstraints(schema) {
    var res = [];
    var stringRange = humanizeRangeConstraint('characters', schema.minLength, schema.maxLength);
    if (stringRange !== undefined) {
        res.push(stringRange);
    }
    var arrayRange = humanizeRangeConstraint('items', schema.minItems, schema.maxItems);
    if (arrayRange !== undefined) {
        res.push(arrayRange);
    }
    var numberRange;
    if (schema.minimum !== undefined && schema.maximum !== undefined) {
        numberRange = schema.exclusiveMinimum ? '( ' : '[ ';
        numberRange += schema.minimum;
        numberRange += ' .. ';
        numberRange += schema.maximum;
        numberRange += schema.exclusiveMaximum ? ' )' : ' ]';
    }
    else if (schema.maximum !== undefined) {
        numberRange = schema.exclusiveMaximum ? '< ' : '<= ';
        numberRange += schema.maximum;
    }
    else if (schema.minimum !== undefined) {
        numberRange = schema.exclusiveMinimum ? '> ' : '>= ';
        numberRange += schema.minimum;
    }
    if (numberRange !== undefined) {
        res.push(numberRange);
    }
    return res;
}
function sortByRequired(fields, order) {
    if (order === void 0) { order = []; }
    fields.sort(function (a, b) {
        if (!a.required && b.required) {
            return 1;
        }
        else if (a.required && !b.required) {
            return -1;
        }
        else if (a.required && b.required) {
            return order.indexOf(a.name) - order.indexOf(b.name);
        }
        else {
            return 0;
        }
    });
}
function sortByField(fields, param) {
    fields.sort(function (a, b) {
        return a[param].localeCompare(b[param]);
    });
}
function mergeParams(parser, pathParams, operationParams) {
    if (pathParams === void 0) { pathParams = []; }
    if (operationParams === void 0) { operationParams = []; }
    var operationParamNames = {};
    operationParams.forEach(function (param) {
        param = parser.shalowDeref(param);
        operationParamNames[param.name + '_' + param.in] = true;
    }); // filter out path params overriden by operation ones with the same name
    pathParams = pathParams.filter(function (param) {
        param = parser.shalowDeref(param);
        return !operationParamNames[param.name + '_' + param.in];
    });
    return pathParams.concat(operationParams);
}
function mergeSimilarMediaTypes(types) {
    var mergedTypes = {};
    Object.keys(types).forEach(function (name) {
        var mime = types[name]; // ignore content type parameters (e.g. charset) and merge
        var normalizedMimeName = name.split(';')[0].trim();
        if (!mergedTypes[normalizedMimeName]) {
            mergedTypes[normalizedMimeName] = mime;
            return;
        }
        mergedTypes[normalizedMimeName] = external_tslib_["__assign"]({}, mergedTypes[normalizedMimeName], mime);
    });
    return mergedTypes;
}
function expandVariables(url, variables) {
    if (variables === void 0) { variables = {}; }
    return url.replace(/(?:{)(\w+)(?:})/g, function (match, name) { return variables[name] && variables[name].default || match; });
}
function normalizeServers(specUrl, servers) {
    var baseUrl = specUrl === undefined ? IS_BROWSER ? window.location.href : '' : Object(path_browserify["dirname"])(specUrl);
    if (servers.length === 0) {
        return [{
                url: baseUrl
            }];
    }
    function normalizeUrl(url, variables) {
        url = expandVariables(url, variables);
        return resolveUrl(baseUrl, url);
    }
    return servers.map(function (server) {
        return external_tslib_["__assign"]({}, server, { url: normalizeUrl(server.url, server.variables), description: server.description || '' });
    });
}
var SECURITY_DEFINITIONS_COMPONENT_NAME = 'security-definitions';
var SECURITY_SCHEMES_SECTION_PREFIX = 'section/Authentication/';
function setSecuritySchemePrefix(prefix) {
    SECURITY_SCHEMES_SECTION_PREFIX = prefix;
}
var shortenHTTPVerb = function (verb) { return ({
    delete: 'del',
    options: 'opts'
})[verb] || verb; };
function isRedocExtension(key) {
    var redocExtensions = {
        'x-circular-ref': true,
        'x-code-samples': true,
        'x-displayName': true,
        'x-examples': true,
        'x-ignoredHeaderParameters': true,
        'x-logo': true,
        'x-nullable': true,
        'x-servers': true,
        'x-tagGroups': true,
        'x-traitTag': true
    };
    return key in redocExtensions;
}
function extractExtensions(obj, showExtensions) {
    return Object.keys(obj).filter(function (key) {
        if (showExtensions === true) {
            return key.startsWith('x-') && !isRedocExtension(key);
        }
        return key.startsWith('x-') && showExtensions.indexOf(key) > -1;
    }).reduce(function (acc, key) {
        acc[key] = obj[key];
        return acc;
    }, {});
}

// EXTERNAL MODULE: external "prismjs"
var external_prismjs_ = __webpack_require__(14);

// EXTERNAL MODULE: external "prismjs/components/prism-bash.js"
var prism_bash_js_ = __webpack_require__(43);

// EXTERNAL MODULE: external "prismjs/components/prism-c.js"
var prism_c_js_ = __webpack_require__(44);

// EXTERNAL MODULE: external "prismjs/components/prism-clike.js"
var prism_clike_js_ = __webpack_require__(45);

// EXTERNAL MODULE: external "prismjs/components/prism-coffeescript.js"
var prism_coffeescript_js_ = __webpack_require__(46);

// EXTERNAL MODULE: external "prismjs/components/prism-cpp.js"
var prism_cpp_js_ = __webpack_require__(47);

// EXTERNAL MODULE: external "prismjs/components/prism-csharp.js"
var prism_csharp_js_ = __webpack_require__(48);

// EXTERNAL MODULE: external "prismjs/components/prism-go.js"
var prism_go_js_ = __webpack_require__(49);

// EXTERNAL MODULE: external "prismjs/components/prism-java.js"
var prism_java_js_ = __webpack_require__(50);

// EXTERNAL MODULE: external "prismjs/components/prism-lua.js"
var prism_lua_js_ = __webpack_require__(51);

// EXTERNAL MODULE: external "prismjs/components/prism-markup-templating.js"
var prism_markup_templating_js_ = __webpack_require__(52);

// EXTERNAL MODULE: external "prismjs/components/prism-markup.js"
var prism_markup_js_ = __webpack_require__(53);

// EXTERNAL MODULE: external "prismjs/components/prism-objectivec.js"
var prism_objectivec_js_ = __webpack_require__(54);

// EXTERNAL MODULE: external "prismjs/components/prism-perl.js"
var prism_perl_js_ = __webpack_require__(55);

// EXTERNAL MODULE: external "prismjs/components/prism-php.js"
var prism_php_js_ = __webpack_require__(56);

// EXTERNAL MODULE: external "prismjs/components/prism-python.js"
var prism_python_js_ = __webpack_require__(57);

// EXTERNAL MODULE: external "prismjs/components/prism-ruby.js"
var prism_ruby_js_ = __webpack_require__(58);

// EXTERNAL MODULE: external "prismjs/components/prism-scala.js"
var prism_scala_js_ = __webpack_require__(59);

// EXTERNAL MODULE: external "prismjs/components/prism-sql.js"
var prism_sql_js_ = __webpack_require__(60);

// EXTERNAL MODULE: external "prismjs/components/prism-swift.js"
var prism_swift_js_ = __webpack_require__(61);

// CONCATENATED MODULE: ./src/utils/highlight.ts










 // dep of php
 // xml








var DEFAULT_LANG = 'clike';
/**
 * map language names to Prism.js names
 */
function mapLang(lang) {
    return {
        json: 'js',
        'c++': 'cpp',
        'c#': 'csharp',
        'objective-c': 'objectivec',
        shell: 'bash',
        viml: 'vim'
    }[lang] || DEFAULT_LANG;
}
/**
 * Highlight source code string using Prism.js
 * @param source source code to highlight
 * @param lang highlight language
 * @return highlighted souce code as **html string**
 */
function highlight(source, lang) {
    if (lang === void 0) { lang = DEFAULT_LANG; }
    lang = lang.toLowerCase();
    var grammar = external_prismjs_["languages"][lang];
    if (!grammar) {
        grammar = external_prismjs_["languages"][mapLang(lang)];
    }
    return external_prismjs_["highlight"](source, grammar);
}

// CONCATENATED MODULE: ./src/utils/decorators.ts
function throttle(func, wait) {
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };
    return function () {
        var now = new Date().getTime();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        }
        else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
function Throttle(delay) {
    return function (_, _2, desc) {
        desc.value = throttle(desc.value, delay);
    };
}

// CONCATENATED MODULE: ./src/utils/debug.ts
function debugTime(label) {
    if (false) {}
}
function debugTimeEnd(label) {
    if (false) {}
}

// CONCATENATED MODULE: ./src/utils/memoize.ts

// source: https://github.com/andreypopp/memoize-decorator
var SENTINEL = {};
function memoize(target, name, descriptor) {
    if (typeof descriptor.value === 'function') {
        return _memoizeMethod(target, name, descriptor);
    }
    else if (typeof descriptor.get === 'function') {
        return _memoizeGetter(target, name, descriptor);
    }
    else {
        throw new Error('@memoize decorator can be applied to methods or getters, got ' + String(descriptor.value) + ' instead');
    }
}
function _memoizeGetter(target, name, descriptor) {
    var memoizedName = "_memoized_" + name;
    var get = descriptor.get;
    target[memoizedName] = SENTINEL;
    return external_tslib_["__assign"]({}, descriptor, { get: function () {
            if (this[memoizedName] === SENTINEL) {
                this[memoizedName] = get.call(this);
            }
            return this[memoizedName];
        } });
}
function _memoizeMethod(target, name, descriptor) {
    if (!descriptor.value || descriptor.value.length > 0) {
        throw new Error('@memoize decorator can only be applied to methods of zero arguments');
    }
    var memoizedName = "_memoized_" + name;
    var value = descriptor.value;
    target[memoizedName] = SENTINEL;
    return external_tslib_["__assign"]({}, descriptor, { value: function () {
            if (this[memoizedName] === SENTINEL) {
                this[memoizedName] = value.call(this);
            }
            return this[memoizedName];
        } });
}

// CONCATENATED MODULE: ./src/utils/index.ts










// CONCATENATED MODULE: ./src/services/HistoryService.ts




var EVENT = 'hashchange';
var HistoryService_HistoryService = /** @class */ (function () {
    function HistoryService() {
        var _this = this;
        this.emit = function () {
            _this._emiter.emit(EVENT, _this.currentId);
        };
        this._emiter = new external_eventemitter3_["EventEmitter"]();
        this.bind();
    }
    Object.defineProperty(HistoryService.prototype, "currentId", {
        get: function () {
            return IS_BROWSER ? window.location.hash.substring(1) : '';
        },
        enumerable: true,
        configurable: true
    });
    HistoryService.prototype.linkForId = function (id) {
        if (!id) {
            return '';
        }
        return '#' + id;
    };
    HistoryService.prototype.subscribe = function (cb) {
        var emmiter = this._emiter.addListener(EVENT, cb);
        return function () { return emmiter.removeListener(EVENT, cb); };
    };
    HistoryService.prototype.bind = function () {
        if (IS_BROWSER) {
            window.addEventListener('hashchange', this.emit, false);
        }
    };
    HistoryService.prototype.dispose = function () {
        if (IS_BROWSER) {
            window.removeEventListener('hashchange', this.emit);
        }
    };
    HistoryService.prototype.replace = function (id, rewriteHistory) {
        if (rewriteHistory === void 0) { rewriteHistory = false; }
        if (!IS_BROWSER) {
            return;
        }
        if (id == null || id === this.currentId) {
            return;
        }
        if (rewriteHistory) {
            window.history.replaceState(null, '', window.location.href.split('#')[0] + this.linkForId(id));
            return;
        }
        window.history.pushState(null, '', window.location.href.split('#')[0] + this.linkForId(id));
        this.emit();
    };
    external_tslib_["__decorate"]([
        external_decko_["bind"],
        external_decko_["debounce"]
    ], HistoryService.prototype, "replace", null);
    return HistoryService;
}());

var HistoryService_history = new HistoryService_HistoryService();
if (false) {}

// EXTERNAL MODULE: external "mark.js"
var external_mark_js_ = __webpack_require__(18);

// CONCATENATED MODULE: ./src/services/MarkerService.ts

var MarkerService_MarkerService = /** @class */ (function () {
    function MarkerService() {
        this.map = new Map();
        this.prevTerm = '';
    }
    MarkerService.prototype.add = function (el) {
        this.map.set(el, new external_mark_js_(el));
    };
    MarkerService.prototype.delete = function (el) {
        this.map.delete(el);
    };
    MarkerService.prototype.addOnly = function (elements) {
        var _this = this;
        this.map.forEach(function (inst, elem) {
            if (elements.indexOf(elem) === -1) {
                inst.unmark();
                _this.map.delete(elem);
            }
        });
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var el = elements_1[_i];
            if (!this.map.has(el)) {
                this.map.set(el, new external_mark_js_(el));
            }
        }
    };
    MarkerService.prototype.clearAll = function () {
        this.unmark();
        this.map.clear();
    };
    MarkerService.prototype.mark = function (term) {
        var _this = this;
        if (!term && !this.prevTerm) {
            return;
        }
        this.map.forEach(function (val) {
            val.unmark();
            val.mark(term || _this.prevTerm);
        });
        this.prevTerm = term || this.prevTerm;
    };
    MarkerService.prototype.unmark = function () {
        this.map.forEach(function (val) { return val.unmark(); });
        this.prevTerm = '';
    };
    return MarkerService;
}());


// EXTERNAL MODULE: external "marked"
var external_marked_ = __webpack_require__(11);

// CONCATENATED MODULE: ./src/services/MarkdownRenderer.ts



var MarkdownRenderer_renderer = new external_marked_["Renderer"]();
external_marked_["setOptions"]({
    renderer: MarkdownRenderer_renderer,
    highlight: function (str, lang) {
        return highlight(str, lang);
    }
});
var LEGACY_REGEXP = '^ {0,3}<!-- ReDoc-Inject:\\s+?<({component}).*?/?>\\s+?-->\\s*$'; // prettier-ignore
var MDX_COMPONENT_REGEXP = '(?:^ {0,3}<({component})([\\s\\S]*?)>([\\s\\S]*?)</\\2>' // with children
    + '|^ {0,3}<({component})([\\s\\S]*?)(?:/>|\\n{2,}))'; // self-closing
var COMPONENT_REGEXP = '(?:' + LEGACY_REGEXP + '|' + MDX_COMPONENT_REGEXP + ')';
function buildComponentComment(name) {
    return "<!-- ReDoc-Inject: <" + name + "> -->";
}
var MarkdownRenderer_MarkdownRenderer = /** @class */ (function () {
    function MarkdownRenderer(options) {
        var _this = this;
        this.options = options;
        this.headings = [];
        this.headingRule = function (text, level, raw) {
            if (level === 1) {
                _this.currentTopHeading = _this.saveHeading(text, level);
            }
            else if (level === 2) {
                _this.saveHeading(text, level, _this.currentTopHeading && _this.currentTopHeading.items, _this.currentTopHeading && _this.currentTopHeading.id);
            }
            return _this.originalHeadingRule(text, level, raw);
        };
        this.headingEnhanceRenderer = new external_marked_["Renderer"]();
        this.originalHeadingRule = this.headingEnhanceRenderer.heading.bind(this.headingEnhanceRenderer);
        this.headingEnhanceRenderer.heading = this.headingRule;
    }
    MarkdownRenderer.containsComponent = function (rawText, componentName) {
        var compRegexp = new RegExp(COMPONENT_REGEXP.replace(/{component}/g, componentName), 'gmi');
        return compRegexp.test(rawText);
    };
    MarkdownRenderer.prototype.saveHeading = function (name, level, container, parentId) {
        if (container === void 0) { container = this.headings; }
        var item = {
            id: parentId ? parentId + "/" + safeSlugify(name) : "section/" + safeSlugify(name),
            name: name,
            level: level,
            items: []
        };
        container.push(item);
        return item;
    };
    MarkdownRenderer.prototype.flattenHeadings = function (container) {
        if (container === undefined) {
            return [];
        }
        var res = [];
        for (var _i = 0, container_1 = container; _i < container_1.length; _i++) {
            var heading = container_1[_i];
            res.push(heading);
            res.push.apply(res, this.flattenHeadings(heading.items));
        }
        return res;
    };
    MarkdownRenderer.prototype.attachHeadingsDescriptions = function (rawText) {
        var buildRegexp = function (heading) {
            return new RegExp("##?\\s+" + heading.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        };
        var flatHeadings = this.flattenHeadings(this.headings);
        if (flatHeadings.length < 1) {
            return;
        }
        var prevHeading = flatHeadings[0];
        var prevRegexp = buildRegexp(prevHeading);
        var prevPos = rawText.search(prevRegexp);
        for (var i = 1; i < flatHeadings.length; i++) {
            var heading = flatHeadings[i];
            var regexp = buildRegexp(heading);
            var currentPos = rawText.substr(prevPos + 1).search(regexp) + prevPos + 1;
            prevHeading.description = rawText.substring(prevPos, currentPos).replace(prevRegexp, '').trim();
            prevHeading = heading;
            prevRegexp = regexp;
            prevPos = currentPos;
        }
        prevHeading.description = rawText.substring(prevPos).replace(prevRegexp, '').trim();
    };
    MarkdownRenderer.prototype.renderMd = function (rawText, extractHeadings) {
        if (extractHeadings === void 0) { extractHeadings = false; }
        var opts = extractHeadings ? {
            renderer: this.headingEnhanceRenderer
        } : undefined;
        var res = external_marked_(rawText.toString(), opts);
        return res;
    };
    MarkdownRenderer.prototype.extractHeadings = function (rawText) {
        this.renderMd(rawText, true);
        this.attachHeadingsDescriptions(rawText);
        var res = this.headings;
        this.headings = [];
        return res;
    }; // regexp-based 👎: remark is slow and too big so for now using marked + regexps soup
    MarkdownRenderer.prototype.renderMdWithComponents = function (rawText) {
        var components = this.options && this.options.allowedMdComponents;
        if (!components || Object.keys(components).length === 0) {
            return [this.renderMd(rawText)];
        }
        var names = Object.keys(components).join('|');
        var componentsRegexp = new RegExp(COMPONENT_REGEXP.replace(/{component}/g, names), 'mig');
        var htmlParts = [];
        var componentDefs = [];
        var match = componentsRegexp.exec(rawText);
        var lasxtIdx = 0;
        while (match) {
            htmlParts.push(rawText.substring(lasxtIdx, match.index));
            lasxtIdx = componentsRegexp.lastIndex;
            var compName = match[1] || match[2] || match[5];
            var componentMeta = components[compName];
            var props = match[3] || match[6];
            var children = match[4];
            if (componentMeta) {
                componentDefs.push({
                    component: componentMeta.component,
                    propsSelector: componentMeta.propsSelector,
                    props: external_tslib_["__assign"]({}, parseProps(props), componentMeta.props, { children: children })
                });
            }
            match = componentsRegexp.exec(rawText);
        }
        htmlParts.push(rawText.substring(lasxtIdx));
        var res = [];
        for (var i = 0; i < htmlParts.length; i++) {
            var htmlPart = htmlParts[i];
            if (htmlPart) {
                res.push(this.renderMd(htmlPart));
            }
            if (componentDefs[i]) {
                res.push(componentDefs[i]);
            }
        }
        return res;
    };
    return MarkdownRenderer;
}());

function parseProps(props) {
    if (!props) {
        return {};
    }
    var regex = /([\w-]+)\s*=\s*(?:{([^}]+?)}|"([^"]+?)")/gim;
    var parsed = {};
    var match; // tslint:disable-next-line
    while ((match = regex.exec(props)) !== null) {
        if (match[3]) {
            // string prop match (in double quotes)
            parsed[match[1]] = match[3];
        }
        else if (match[2]) {
            // jsx prop match (in curly braces)
            var val = void 0;
            try {
                val = JSON.parse(match[2]);
            }
            catch (e) {
                /* noop */
            }
            parsed[match[1]] = val;
        }
    }
    return parsed;
}

// CONCATENATED MODULE: ./src/services/models/ApiInfo.ts

var ApiInfo_ApiInfoModel = /** @class */ (function () {
    function ApiInfoModel(parser) {
        this.parser = parser;
        Object.assign(this, parser.spec.info);
        this.description = parser.spec.info.description || '';
        var firstHeadingLinePos = this.description.search(/^##?\s+/m);
        if (firstHeadingLinePos > -1) {
            this.description = this.description.substring(0, firstHeadingLinePos);
        }
        this.downloadLink = this.getDownloadLink();
        this.downloadFileName = this.getDownloadFileName();
    }
    ApiInfoModel.prototype.getDownloadLink = function () {
        if (this.parser.specUrl) {
            return this.parser.specUrl;
        }
        if (IS_BROWSER && window.Blob && window.URL && window.URL.createObjectURL) {
            var blob = new Blob([JSON.stringify(this.parser.spec, null, 2)], {
                type: 'application/json'
            });
            return window.URL.createObjectURL(blob);
        }
    };
    ApiInfoModel.prototype.getDownloadFileName = function () {
        if (!this.parser.specUrl) {
            return 'swagger.json';
        }
        return undefined;
    };
    return ApiInfoModel;
}());


// CONCATENATED MODULE: ./src/services/models/SecuritySchemes.ts

var SecuritySchemes_SecuritySchemeModel = /** @class */ (function () {
    function SecuritySchemeModel(parser, id, scheme) {
        var info = parser.deref(scheme);
        this.id = id;
        this.sectionId = SECURITY_SCHEMES_SECTION_PREFIX + id;
        this.type = info.type;
        this.description = info.description || '';
        if (info.type === 'apiKey') {
            this.apiKey = {
                name: info.name,
                in: info.in
            };
        }
        if (info.type === 'http') {
            this.http = {
                scheme: info.scheme,
                bearerFormat: info.bearerFormat
            };
        }
        if (info.type === 'openIdConnect') {
            this.openId = {
                connectUrl: info.openIdConnectUrl
            };
        }
        if (info.type === 'oauth2' && info.flows) {
            this.flows = info.flows;
        }
    }
    return SecuritySchemeModel;
}());

var SecuritySchemesModel = /** @class */ (function () {
    function SecuritySchemesModel(parser) {
        var schemes = parser.spec.components && parser.spec.components.securitySchemes || {};
        this.schemes = Object.keys(schemes).map(function (name) { return new SecuritySchemes_SecuritySchemeModel(parser, name, schemes[name]); });
    }
    return SecuritySchemesModel;
}());


// CONCATENATED MODULE: ./src/services/OpenAPIParser.ts







/**
 * Helper class to keep track of visited references to avoid
 * endless recursion because of circular refs
 */
var RefCounter = /** @class */ (function () {
    function RefCounter() {
        this._counter = {};
    }
    RefCounter.prototype.reset = function () {
        this._counter = {};
    };
    RefCounter.prototype.visit = function (ref) {
        this._counter[ref] = this._counter[ref] ? this._counter[ref] + 1 : 1;
    };
    RefCounter.prototype.exit = function (ref) {
        this._counter[ref] = this._counter[ref] && this._counter[ref] - 1;
    };
    RefCounter.prototype.visited = function (ref) {
        return !!this._counter[ref];
    };
    return RefCounter;
}());
/**
 * Loads and keeps spec. Provides raw spec operations
 */
var OpenAPIParser_OpenAPIParser = /** @class */ (function () {
    function OpenAPIParser(spec, specUrl, options) {
        if (options === void 0) { options = new RedocNormalizedOptions_RedocNormalizedOptions({}); }
        var _this = this;
        this.options = options;
        this._refCounter = new RefCounter();
        /**
         * get spec part by JsonPointer ($ref)
         */
        this.byRef = function (ref) {
            var res;
            if (!_this.spec) {
                return;
            }
            if (ref.charAt(0) !== '#') {
                ref = '#' + ref;
            }
            ref = decodeURIComponent(ref);
            try {
                res = JsonPointer_JsonPointer.get(_this.spec, ref);
            }
            catch (e) { // do nothing
            }
            return res || {};
        };
        this.validate(spec);
        this.preprocess(spec);
        this.spec = spec;
        var href = IS_BROWSER ? window.location.href : '';
        if (typeof specUrl === 'string') {
            this.specUrl = Object(external_url_["resolve"])(href, specUrl);
        }
    }
    OpenAPIParser.prototype.validate = function (spec) {
        if (spec.openapi === undefined) {
            throw new Error('Document must be valid OpenAPI 3.0.0 definition');
        }
    };
    OpenAPIParser.prototype.preprocess = function (spec) {
        if (!this.options.noAutoAuth && spec.info && spec.components && spec.components.securitySchemes) {
            // Automatically inject Authentication section with SecurityDefinitions component
            var description = spec.info.description || '';
            if (!MarkdownRenderer_MarkdownRenderer.containsComponent(description, SECURITY_DEFINITIONS_COMPONENT_NAME)) {
                var comment = buildComponentComment(SECURITY_DEFINITIONS_COMPONENT_NAME);
                spec.info.description = appendToMdHeading(description, 'Authentication', comment);
            }
        }
    };
    /**
     * checks if the objectt is OpenAPI reference (containts $ref property)
     */
    OpenAPIParser.prototype.isRef = function (obj) {
        if (!obj) {
            return false;
        }
        return obj.$ref !== undefined && obj.$ref !== null;
    };
    /**
     * resets visited enpoints. should be run after
     */
    OpenAPIParser.prototype.resetVisited = function () {
        if (false) { var k; }
        this._refCounter = new RefCounter();
    };
    OpenAPIParser.prototype.exitRef = function (ref) {
        if (!this.isRef(ref)) {
            return;
        }
        this._refCounter.exit(ref.$ref);
    };
    /**
     * Resolve given reference object or return as is if it is not a reference
     * @param obj object to dereference
     * @param forceCircular whether to dereference even if it is cirular ref
     */
    OpenAPIParser.prototype.deref = function (obj, forceCircular) {
        if (forceCircular === void 0) { forceCircular = false; }
        if (this.isRef(obj)) {
            var resolved = this.byRef(obj.$ref);
            var visited = this._refCounter.visited(obj.$ref);
            this._refCounter.visit(obj.$ref);
            if (visited && !forceCircular) {
                // circular reference detected
                // tslint:disable-next-line
                return Object.assign({}, resolved, {
                    'x-circular-ref': true
                });
            } // deref again in case one more $ref is here
            if (this.isRef(resolved)) {
                var res = this.deref(resolved);
                this.exitRef(resolved);
                return res;
            }
            return resolved;
        }
        return obj;
    };
    OpenAPIParser.prototype.shalowDeref = function (obj) {
        if (this.isRef(obj)) {
            return this.byRef(obj.$ref);
        }
        return obj;
    };
    /**
     * Merge allOf contsraints.
     * @param schema schema with allOF
     * @param $ref pointer of the schema
     * @param forceCircular whether to dereference children even if it is a cirular ref
     */
    OpenAPIParser.prototype.mergeAllOf = function (schema, $ref, forceCircular) {
        var _this = this;
        if (forceCircular === void 0) { forceCircular = false; }
        schema = this.hoistOneOfs(schema);
        if (schema.allOf === undefined) {
            return schema;
        }
        var receiver = external_tslib_["__assign"]({}, schema, { allOf: undefined, parentRefs: [] }); // avoid mutating inner objects
        if (receiver.properties !== undefined && typeof receiver.properties === 'object') {
            receiver.properties = external_tslib_["__assign"]({}, receiver.properties);
        }
        if (receiver.items !== undefined && typeof receiver.items === 'object') {
            receiver.items = external_tslib_["__assign"]({}, receiver.items);
        }
        var allOfSchemas = schema.allOf.map(function (subSchema) {
            var _a;
            var resolved = _this.deref(subSchema, forceCircular);
            var subRef = subSchema.$ref || undefined;
            var subMerged = _this.mergeAllOf(resolved, subRef, forceCircular);
            (_a = receiver.parentRefs).push.apply(_a, (subMerged.parentRefs || []));
            return {
                $ref: subRef,
                schema: subMerged
            };
        });
        for (var _i = 0, allOfSchemas_1 = allOfSchemas; _i < allOfSchemas_1.length; _i++) {
            var _a = allOfSchemas_1[_i], subSchemaRef = _a.$ref, subSchema = _a.schema;
            if (receiver.type !== subSchema.type && receiver.type !== undefined && subSchema.type !== undefined) {
                throw new Error("Incompatible types in allOf at \"" + $ref + "\"");
            }
            if (subSchema.type !== undefined) {
                receiver.type = subSchema.type;
            }
            if (subSchema.properties !== undefined) {
                receiver.properties = receiver.properties || {};
                for (var prop in subSchema.properties) {
                    if (!receiver.properties[prop]) {
                        receiver.properties[prop] = subSchema.properties[prop];
                    }
                    else {
                        // merge inner properties
                        receiver.properties[prop] = this.mergeAllOf({
                            allOf: [receiver.properties[prop], subSchema.properties[prop]]
                        }, $ref + '/properties/' + prop);
                    }
                }
            }
            if (subSchema.items !== undefined) {
                receiver.items = receiver.items || {}; // merge inner properties
                receiver.items = this.mergeAllOf({
                    allOf: [receiver.items, subSchema.items]
                }, $ref + '/items');
            }
            if (subSchema.required !== undefined) {
                receiver.required = (receiver.required || []).concat(subSchema.required);
            } // merge rest of constraints
            // TODO: do more intelegent merge
            receiver = external_tslib_["__assign"]({}, subSchema, receiver);
            if (subSchemaRef) {
                receiver.parentRefs.push(subSchemaRef);
                if (receiver.title === undefined && isNamedDefinition(subSchemaRef)) { // this is not so correct behaviour. comented out for now
                    // ref: https://github.com/Rebilly/ReDoc/issues/601
                    // receiver.title = JsonPointer.baseName(subSchemaRef);
                }
            }
        } // name of definition or title on top level
        if (schema.title === undefined && isNamedDefinition($ref)) {
            receiver.title = JsonPointer_JsonPointer.baseName($ref);
        }
        return receiver;
    };
    /**
     * Find all derived definitions among #/components/schemas from any of $refs
     * returns map of definition pointer to definition name
     * @param $refs array of references to find derived from
     */
    OpenAPIParser.prototype.findDerived = function ($refs) {
        var res = {};
        var schemas = this.spec.components && this.spec.components.schemas || {};
        for (var defName in schemas) {
            var def = this.deref(schemas[defName]);
            if (def.allOf !== undefined && def.allOf.find(function (obj) { return obj.$ref !== undefined && $refs.indexOf(obj.$ref) > -1; })) {
                res['#/components/schemas/' + defName] = def['x-discriminator-value'] || defName;
            }
        }
        return res;
    };
    OpenAPIParser.prototype.exitParents = function (shema) {
        for (var _i = 0, _a = shema.parentRefs || []; _i < _a.length; _i++) {
            var parent$ref = _a[_i];
            this.exitRef({
                $ref: parent$ref
            });
        }
    };
    OpenAPIParser.prototype.hoistOneOfs = function (schema) {
        var _this = this;
        if (schema.allOf === undefined) {
            return schema;
        }
        var allOf = schema.allOf;
        var _loop_1 = function (i) {
            var sub = allOf[i];
            if (Array.isArray(sub.oneOf)) {
                var beforeAllOf_1 = allOf.slice(0, i);
                var afterAllOf_1 = allOf.slice(i + 1);
                return { value: {
                        oneOf: sub.oneOf.map(function (part) {
                            var merged = _this.mergeAllOf({
                                allOf: beforeAllOf_1.concat([part], afterAllOf_1)
                            }); // each oneOf should be independent so exiting all the parent refs
                            // otherwise it will cause false-positive recursive detection
                            _this.exitParents(merged);
                            return merged;
                        })
                    } };
            }
        };
        for (var i = 0; i < allOf.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return schema;
    };
    return OpenAPIParser;
}());


// CONCATENATED MODULE: ./src/services/SpecStore.ts




/**
 * Store that containts all the specification related information in the form of tree
 */
var SpecStore_SpecStore = /** @class */ (function () {
    function SpecStore(spec, specUrl, options) {
        this.options = options;
        this.parser = new OpenAPIParser_OpenAPIParser(spec, specUrl, options);
        this.info = new ApiInfo_ApiInfoModel(this.parser);
        this.externalDocs = this.parser.spec.externalDocs;
        this.contentItems = MenuBuilder_MenuBuilder.buildStructure(this.parser, this.options);
        this.securitySchemes = new SecuritySchemesModel(this.parser);
    }
    return SpecStore;
}());


// CONCATENATED MODULE: ./src/services/models/Group.model.ts



/**
 * Operations Group model ready to be used by components
 */
var Group_model_GroupModel = /** @class */ (function () {
    function GroupModel(type, tagOrGroup, parent) {
        this.items = [];
        this.active = false;
        this.expanded = false;
        // markdown headings already have ids calculated as they are needed for heading anchors
        this.id = tagOrGroup.id || type + '/' + safeSlugify(tagOrGroup.name);
        this.type = type;
        this.name = tagOrGroup['x-displayName'] || tagOrGroup.name;
        this.level = tagOrGroup.level || 1;
        this.description = tagOrGroup.description || '';
        this.parent = parent;
        this.externalDocs = tagOrGroup.externalDocs; // groups are active (expanded) by default
        if (this.type === 'group') {
            this.expanded = true;
        }
    }
    GroupModel.prototype.activate = function () {
        this.active = true;
    };
    GroupModel.prototype.expand = function () {
        if (this.parent) {
            this.parent.expand();
        }
        this.expanded = true;
    };
    GroupModel.prototype.collapse = function () {
        // disallow collapsing groups
        if (this.type === 'group') {
            return;
        }
        this.expanded = false;
    };
    GroupModel.prototype.deactivate = function () {
        this.active = false;
    };
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], GroupModel.prototype, "active", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], GroupModel.prototype, "expanded", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], GroupModel.prototype, "activate", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], GroupModel.prototype, "expand", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], GroupModel.prototype, "collapse", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], GroupModel.prototype, "deactivate", null);
    return GroupModel;
}());


// CONCATENATED MODULE: ./src/services/models/SecurityRequirement.ts


var SecurityRequirement_SecurityRequirementModel = /** @class */ (function () {
    function SecurityRequirementModel(requirement, parser) {
        var schemes = parser.spec.components && parser.spec.components.securitySchemes || {};
        this.schemes = Object.keys(requirement || {}).map(function (id) {
            var scheme = parser.deref(schemes[id]);
            var scopes = requirement[id] || [];
            if (!scheme) {
                console.warn("Non existing security scheme referenced: " + id + ". Skipping");
                return undefined;
            }
            return external_tslib_["__assign"]({}, scheme, { id: id, sectionId: SECURITY_SCHEMES_SECTION_PREFIX + id, scopes: scopes });
        }).filter(function (scheme) { return scheme !== undefined; });
    }
    return SecurityRequirementModel;
}());


// CONCATENATED MODULE: ./src/services/models/Schema.ts



 // TODO: refactor this model, maybe use getters instead of copying all the values
var Schema_SchemaModel = /** @class */ (function () {
    /**
     * @param isChild if schema discriminator Child
     * When true forces dereferencing in allOfs even if circular
     */
    function SchemaModel(parser, schemaOrRef, pointer, options, isChild) {
        if (isChild === void 0) { isChild = false; }
        this.options = options;
        this.typePrefix = '';
        this.isCircular = false;
        this.activeOneOf = 0;
        this.pointer = schemaOrRef.$ref || pointer || '';
        this.rawSchema = parser.deref(schemaOrRef);
        this.schema = parser.mergeAllOf(this.rawSchema, this.pointer, isChild);
        this.init(parser, isChild);
        parser.exitRef(schemaOrRef);
        parser.exitParents(this.schema);
        if (options.showExtensions) {
            this.extensions = extractExtensions(this.schema, options.showExtensions);
        }
    }
    /**
     * Set specified alternative schema as active
     * @param idx oneOf index
     */
    SchemaModel.prototype.activateOneOf = function (idx) {
        this.activeOneOf = idx;
    };
    SchemaModel.prototype.init = function (parser, isChild) {
        var schema = this.schema;
        this.isCircular = schema['x-circular-ref'];
        this.title = schema.title || isNamedDefinition(this.pointer) && JsonPointer_JsonPointer.baseName(this.pointer) || '';
        this.description = schema.description || '';
        this.type = schema.type || detectType(schema);
        this.format = schema.format;
        this.nullable = !!schema.nullable;
        this.enum = schema.enum || [];
        this.example = schema.example;
        this.deprecated = !!schema.deprecated;
        this.pattern = schema.pattern;
        this.externalDocs = schema.externalDocs;
        this.constraints = humanizeConstraints(schema);
        this.displayType = this.type;
        this.displayFormat = this.format;
        this.isPrimitive = isPrimitiveType(schema, this.type);
        this.default = schema.default;
        this.readOnly = !!schema.readOnly;
        this.writeOnly = !!schema.writeOnly;
        if (this.isCircular) {
            return;
        }
        if (!isChild && getDiscriminator(schema) !== undefined) {
            this.initDiscriminator(schema, parser);
            return;
        }
        if (schema.oneOf !== undefined) {
            this.initOneOf(schema.oneOf, parser);
            this.oneOfType = 'One of';
            if (schema.anyOf !== undefined) {
                console.warn("oneOf and anyOf are not supported on the same level. Skipping anyOf at " + this.pointer);
            }
            return;
        }
        if (schema.anyOf !== undefined) {
            this.initOneOf(schema.anyOf, parser);
            this.oneOfType = 'Any of';
            return;
        }
        if (this.type === 'object') {
            this.fields = buildFields(parser, schema, this.pointer, this.options);
        }
        else if (this.type === 'array' && schema.items) {
            this.items = new SchemaModel(parser, schema.items, this.pointer + '/items', this.options);
            this.displayType = this.items.displayType;
            this.displayFormat = this.items.format;
            this.typePrefix = this.items.typePrefix + 'Array of ';
            this.title = this.title || this.items.title;
            this.isPrimitive = this.items.isPrimitive;
            if (this.example === undefined && this.items.example !== undefined) {
                this.example = [this.items.example];
            }
            if (this.items.isPrimitive) {
                this.enum = this.items.enum;
            }
        }
    };
    SchemaModel.prototype.initOneOf = function (oneOf, parser) {
        var _this = this;
        this.oneOf = oneOf.map(function (variant, idx) {
            var merged = parser.mergeAllOf(variant, _this.pointer + '/oneOf/' + idx);
            var schema = new SchemaModel(parser, external_tslib_["__assign"]({}, merged, { allOf: [external_tslib_["__assign"]({}, _this.schema, { oneOf: undefined, anyOf: undefined })] }), _this.pointer + '/oneOf/' + idx, _this.options); // each oneOf should be independent so exiting all the parent refs
            // otherwise it will cause false-positive recursive detection
            parser.exitParents(merged);
            return schema;
        });
        this.displayType = this.oneOf.map(function (schema) {
            var name = schema.typePrefix + (schema.title ? schema.title + " (" + schema.displayType + ")" : schema.displayType);
            if (name.indexOf(' or ') > -1) {
                name = "(" + name + ")";
            }
            return name;
        }).join(' or ');
    };
    SchemaModel.prototype.initDiscriminator = function (schema, parser) {
        var _this = this;
        var discriminator = getDiscriminator(schema);
        this.discriminatorProp = discriminator.propertyName;
        var derived = parser.findDerived((schema.parentRefs || []).concat([this.pointer]));
        if (schema.oneOf) {
            for (var _i = 0, _a = schema.oneOf; _i < _a.length; _i++) {
                var variant = _a[_i];
                if (variant.$ref === undefined) {
                    continue;
                }
                var name_1 = JsonPointer_JsonPointer.dirName(variant.$ref);
                derived[variant.$ref] = name_1;
            }
        }
        var mapping = discriminator.mapping || {};
        for (var name_2 in mapping) {
            derived[mapping[name_2]] = name_2;
        }
        var refs = Object.keys(derived);
        this.oneOf = refs.map(function (ref) {
            var innerSchema = new SchemaModel(parser, parser.byRef(ref), ref, _this.options, true);
            innerSchema.title = derived[ref];
            return innerSchema;
        });
    };
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], SchemaModel.prototype, "activeOneOf", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], SchemaModel.prototype, "activateOneOf", null);
    return SchemaModel;
}());

function buildFields(parser, schema, $ref, options) {
    var props = schema.properties || {};
    var additionalProps = schema.additionalProperties;
    var defaults = schema.default || {};
    var fields = Object.keys(props || []).map(function (fieldName) {
        var field = props[fieldName];
        if (!field) {
            console.warn("Field \"" + fieldName + "\" is invalid, skipping.\n Field must be an object but got " + typeof field + " at \"" + $ref + "\"");
            field = {};
        }
        var required = schema.required === undefined ? false : schema.required.indexOf(fieldName) > -1;
        return new Field_FieldModel(parser, {
            name: fieldName,
            required: required,
            schema: external_tslib_["__assign"]({}, field, { default: field.default === undefined ? defaults[fieldName] : field.default })
        }, $ref + '/properties/' + fieldName, options);
    });
    if (options.sortPropsAlphabetically) {
        sortByField(fields, 'name');
    }
    if (options.requiredPropsFirst) {
        // if not sort alphabetically sort in the order from required keyword
        sortByRequired(fields, !options.sortPropsAlphabetically ? schema.required : undefined);
    }
    if (typeof additionalProps === 'object' || additionalProps === true) {
        fields.push(new Field_FieldModel(parser, {
            name: 'property name *',
            required: false,
            schema: additionalProps === true ? {} : additionalProps,
            kind: 'additionalProperties'
        }, $ref + '/additionalProperties', options));
    }
    return fields;
}
function getDiscriminator(schema) {
    return schema.discriminator || schema['x-discriminator'];
}

// CONCATENATED MODULE: ./src/services/models/Field.ts




/**
 * Field or Parameter model ready to be used by components
 */
var Field_FieldModel = /** @class */ (function () {
    function FieldModel(parser, infoOrRef, pointer, options) {
        this.expanded = false;
        var info = parser.deref(infoOrRef);
        this.kind = infoOrRef.kind || 'field';
        this.name = infoOrRef.name || info.name;
        this.in = info.in;
        this.required = !!info.required;
        this.schema = new Schema_SchemaModel(parser, info.schema || {}, pointer, options);
        this.description = info.description === undefined ? this.schema.description || '' : info.description;
        this.example = info.example || this.schema.example;
        this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;
        parser.exitRef(infoOrRef);
        if (options.showExtensions) {
            this.extensions = extractExtensions(info, options.showExtensions);
        }
    }
    FieldModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], FieldModel.prototype, "expanded", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], FieldModel.prototype, "toggle", null);
    return FieldModel;
}());


// EXTERNAL MODULE: external "openapi-sampler"
var external_openapi_sampler_ = __webpack_require__(19);

// CONCATENATED MODULE: ./src/services/models/Example.ts
var ExampleModel = /** @class */ (function () {
    function ExampleModel(parser, infoOrRef) {
        Object.assign(this, parser.deref(infoOrRef));
        parser.exitRef(infoOrRef);
    }
    return ExampleModel;
}());


// CONCATENATED MODULE: ./src/services/models/MediaType.ts




var MediaType_MediaTypeModel = /** @class */ (function () {
    /**
     * @param isRequestType needed to know if skipe RO/RW fields in objects
     */
    function MediaTypeModel(parser, name, isRequestType, info, options) {
        this.name = name;
        this.isRequestType = isRequestType;
        this.schema = info.schema && new Schema_SchemaModel(parser, info.schema, '', options);
        this.onlyRequiredInSamples = options.onlyRequiredInSamples;
        if (info.examples !== undefined) {
            this.examples = mapValues(info.examples, function (example) { return new ExampleModel(parser, example); });
        }
        else if (info.example !== undefined) {
            this.examples = {
                default: new ExampleModel(parser, {
                    value: info.example
                })
            };
        }
        else if (isJsonLike(name)) {
            this.generateExample(parser, info);
        }
    }
    MediaTypeModel.prototype.generateExample = function (parser, info) {
        var samplerOptions = {
            skipReadOnly: this.isRequestType,
            skipNonRequired: this.isRequestType && this.onlyRequiredInSamples,
            skipWriteOnly: !this.isRequestType
        };
        if (this.schema && this.schema.oneOf) {
            this.examples = {};
            for (var _i = 0, _a = this.schema.oneOf; _i < _a.length; _i++) {
                var subSchema = _a[_i];
                var sample = external_openapi_sampler_["sample"](subSchema.rawSchema, samplerOptions, parser.spec);
                if (this.schema.discriminatorProp && typeof sample === 'object' && sample) {
                    sample[this.schema.discriminatorProp] = subSchema.title;
                }
                this.examples[subSchema.title] = {
                    value: sample
                };
            }
        }
        else if (this.schema) {
            this.examples = {
                default: new ExampleModel(parser, {
                    value: external_openapi_sampler_["sample"](info.schema, samplerOptions, parser.spec)
                })
            };
        }
    };
    return MediaTypeModel;
}());


// CONCATENATED MODULE: ./src/services/models/MediaContent.ts




/**
 * MediaContent model ready to be sued by React components
 * Contains multiple MediaTypes and keeps track of the currently active one
 */
var MediaContent_MediaContentModel = /** @class */ (function () {
    /**
     * @param isRequestType needed to know if skipe RO/RW fields in objects
     */
    function MediaContentModel(parser, info, isRequestType, options) {
        this.parser = parser;
        this.isRequestType = isRequestType;
        this.activeMimeIdx = 0;
        if (options.unstable_ignoreMimeParameters) {
            info = mergeSimilarMediaTypes(info);
        }
        this.mediaTypes = Object.keys(info).map(function (name) {
            var mime = info[name]; // reset deref cache just in case something is left there
            parser.resetVisited();
            return new MediaType_MediaTypeModel(parser, name, isRequestType, mime, options);
        });
    }
    /**
     * Set active media type by index
     * @param idx media type index
     */
    MediaContentModel.prototype.activate = function (idx) {
        this.activeMimeIdx = idx;
    };
    Object.defineProperty(MediaContentModel.prototype, "active", {
        get: function () {
            return this.mediaTypes[this.activeMimeIdx];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaContentModel.prototype, "hasSample", {
        get: function () {
            return this.mediaTypes.filter(function (mime) { return !!mime.examples; }).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], MediaContentModel.prototype, "activeMimeIdx", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], MediaContentModel.prototype, "activate", null);
    external_tslib_["__decorate"]([
        external_mobx_["computed"]
    ], MediaContentModel.prototype, "active", null);
    return MediaContentModel;
}());


// CONCATENATED MODULE: ./src/services/models/RequestBody.ts

var RequestBody_RequestBodyModel = /** @class */ (function () {
    function RequestBodyModel(parser, infoOrRef, options) {
        var info = parser.deref(infoOrRef);
        this.description = info.description || '';
        this.required = !!info.required;
        parser.exitRef(infoOrRef);
        if (info.content !== undefined) {
            this.content = new MediaContent_MediaContentModel(parser, info.content, true, options);
        }
    }
    return RequestBodyModel;
}());


// CONCATENATED MODULE: ./src/services/models/Response.ts





var Response_ResponseModel = /** @class */ (function () {
    function ResponseModel(parser, code, defaultAsError, infoOrRef, options) {
        this.headers = [];
        this.expanded = options.expandResponses === 'all' || options.expandResponses[code];
        var info = parser.deref(infoOrRef);
        parser.exitRef(infoOrRef);
        this.code = code;
        if (info.content !== undefined) {
            this.content = new MediaContent_MediaContentModel(parser, info.content, false, options);
        }
        if (info['x-summary'] !== undefined) {
            this.summary = info['x-summary'];
            this.description = info.description || '';
        }
        else {
            this.summary = info.description || '';
            this.description = '';
        }
        this.type = getStatusCodeType(code, defaultAsError);
        var headers = info.headers;
        if (headers !== undefined) {
            this.headers = Object.keys(headers).map(function (name) {
                var header = headers[name];
                return new Field_FieldModel(parser, external_tslib_["__assign"]({}, header, { name: name }), '', options);
            });
        }
    }
    ResponseModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], ResponseModel.prototype, "expanded", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], ResponseModel.prototype, "toggle", null);
    return ResponseModel;
}());


// CONCATENATED MODULE: ./src/services/models/Operation.ts







/**
 * Operation model ready to be used by components
 */
var Operation_OperationModel = /** @class */ (function () {
    function OperationModel(parser, operationSpec, parent, options) {
        this.parser = parser;
        this.operationSpec = operationSpec;
        this.options = options;
        this.type = 'operation';
        this.items = [];
        this.ready = true;
        this.active = false;
        this.expanded = false; //#endregion
        this.pointer = JsonPointer_JsonPointer.compile(['paths', operationSpec.pathName, operationSpec.httpVerb]);
        this.id = operationSpec.operationId !== undefined ? 'operation/' + operationSpec.operationId : parent !== undefined ? parent.id + this.pointer : this.pointer;
        this.name = getOperationSummary(operationSpec);
        this.description = operationSpec.description;
        this.parent = parent;
        this.externalDocs = operationSpec.externalDocs;
        this.deprecated = !!operationSpec.deprecated;
        this.httpVerb = operationSpec.httpVerb;
        this.deprecated = !!operationSpec.deprecated;
        this.operationId = operationSpec.operationId;
        this.codeSamples = operationSpec['x-code-samples'] || [];
        this.path = operationSpec.pathName;
        var pathInfo = parser.byRef(JsonPointer_JsonPointer.compile(['paths', operationSpec.pathName]));
        this.servers = normalizeServers(parser.specUrl, operationSpec.servers || pathInfo && pathInfo.servers || parser.spec.servers || []);
        this.security = (operationSpec.security || parser.spec.security || []).map(function (security) { return new SecurityRequirement_SecurityRequirementModel(security, parser); });
        if (options.showExtensions) {
            this.extensions = extractExtensions(operationSpec, options.showExtensions);
        }
    }
    /**
     * set operation as active (used by side menu)
     */
    OperationModel.prototype.activate = function () {
        this.active = true;
    };
    /**
     * set operation as inactive (used by side menu)
     */
    OperationModel.prototype.deactivate = function () {
        this.active = false;
    };
    OperationModel.prototype.expand = function () {
        if (this.parent) {
            this.parent.expand();
        }
    };
    OperationModel.prototype.collapse = function () {
        /* do nothing */
    };
    Object.defineProperty(OperationModel.prototype, "requestBody", {
        get: function () {
            return this.operationSpec.requestBody && new RequestBody_RequestBodyModel(this.parser, this.operationSpec.requestBody, this.options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModel.prototype, "parameters", {
        get: function () {
            var _this = this;
            var _parameters = mergeParams(this.parser, this.operationSpec.pathParameters, this.operationSpec.parameters // TODO: fix pointer
            ).map(function (paramOrRef) { return new Field_FieldModel(_this.parser, paramOrRef, _this.pointer, _this.options); });
            if (this.options.sortPropsAlphabetically) {
                sortByField(_parameters, 'name');
            }
            if (this.options.requiredPropsFirst) {
                sortByRequired(_parameters);
            }
            return _parameters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationModel.prototype, "responses", {
        get: function () {
            var _this = this;
            var hasSuccessResponses = false;
            return Object.keys(this.operationSpec.responses || []).filter(function (code) {
                if (code === 'default') {
                    return true;
                }
                if (getStatusCodeType(code) === 'success') {
                    hasSuccessResponses = true;
                }
                return isStatusCode(code);
            }) // filter out other props (e.g. x-props)
                .map(function (code) {
                return new Response_ResponseModel(_this.parser, code, hasSuccessResponses, _this.operationSpec.responses[code], _this.options);
            });
        },
        enumerable: true,
        configurable: true
    });
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], OperationModel.prototype, "ready", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], OperationModel.prototype, "active", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], OperationModel.prototype, "expanded", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], OperationModel.prototype, "activate", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], OperationModel.prototype, "deactivate", null);
    external_tslib_["__decorate"]([
        memoize
    ], OperationModel.prototype, "requestBody", null);
    external_tslib_["__decorate"]([
        memoize
    ], OperationModel.prototype, "parameters", null);
    external_tslib_["__decorate"]([
        memoize
    ], OperationModel.prototype, "responses", null);
    return OperationModel;
}());


// CONCATENATED MODULE: ./src/services/models/index.ts













// CONCATENATED MODULE: ./src/services/MenuBuilder.ts




var GROUP_DEPTH = 0;
var MenuBuilder_MenuBuilder = /** @class */ (function () {
    function MenuBuilder() {
    }
    /**
     * Builds page content structure based on tags
     */
    MenuBuilder.buildStructure = function (parser, options) {
        var spec = parser.spec;
        var items = [];
        var tagsMap = MenuBuilder.getTagsWithOperations(spec);
        items.push.apply(items, MenuBuilder.addMarkdownItems(spec.info.description || '', options));
        if (spec['x-tagGroups']) {
            items.push.apply(items, MenuBuilder.getTagGroupsItems(parser, undefined, spec['x-tagGroups'], tagsMap, options));
        }
        else {
            items.push.apply(items, MenuBuilder.getTagsItems(parser, tagsMap, undefined, undefined, options));
        }
        return items;
    };
    /**
     * extracts items from markdown description
     * @param description - markdown source
     */
    MenuBuilder.addMarkdownItems = function (description, options) {
        var renderer = new MarkdownRenderer_MarkdownRenderer(options);
        var headings = renderer.extractHeadings(description || '');
        var mapHeadingsDeep = function (parent, items, depth) {
            if (depth === void 0) { depth = 1; }
            return items.map(function (heading) {
                var group = new Group_model_GroupModel('section', heading, parent);
                group.depth = depth;
                if (heading.items) {
                    group.items = mapHeadingsDeep(group, heading.items, depth + 1);
                }
                if (MarkdownRenderer_MarkdownRenderer.containsComponent(group.description || '', SECURITY_DEFINITIONS_COMPONENT_NAME)) {
                    setSecuritySchemePrefix(group.id + '/');
                }
                return group;
            });
        };
        return mapHeadingsDeep(undefined, headings);
    };
    /**
     * Returns array of OperationsGroup items for the tag groups (x-tagGroups vendor extenstion)
     * @param tags value of `x-tagGroups` vendor extension
     */
    MenuBuilder.getTagGroupsItems = function (parser, parent, groups, tags, options) {
        var res = [];
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            var item = new Group_model_GroupModel('group', group, parent);
            item.depth = GROUP_DEPTH;
            item.items = MenuBuilder.getTagsItems(parser, tags, item, group, options);
            res.push(item);
        } // TODO checkAllTagsUsedInGroups
        return res;
    };
    /**
     * Returns array of OperationsGroup items for the tags of the group or for all tags
     * @param tagsMap tags info returned from `getTagsWithOperations`
     * @param parent parent item
     * @param group group which this tag belongs to. if not provided gets all tags
     */
    MenuBuilder.getTagsItems = function (parser, tagsMap, parent, group, options) {
        var tagNames;
        if (group === undefined) {
            tagNames = Object.keys(tagsMap); // all tags
        }
        else {
            tagNames = group.tags;
        }
        var tags = tagNames.map(function (tagName) {
            if (!tagsMap[tagName]) {
                console.warn("Non-existing tag \"" + tagName + "\" is added to the group \"" + group.name + "\"");
                return null;
            }
            tagsMap[tagName].used = true;
            return tagsMap[tagName];
        });
        var res = [];
        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
            var tag = tags_1[_i];
            if (!tag) {
                continue;
            }
            var item = new Group_model_GroupModel('tag', tag, parent);
            item.depth = GROUP_DEPTH + 1;
            item.items = this.getOperationsItems(parser, item, tag, item.depth + 1, options); // don't put empty tag into content, instead put its operations
            if (tag.name === '') {
                var items = this.getOperationsItems(parser, undefined, tag, item.depth + 1, options);
                res.push.apply(res, items);
                continue;
            }
            res.push(item);
        }
        return res;
    };
    /**
     * Returns array of Operation items for the tag
     * @param parent parent OperationsGroup
     * @param tag tag info returned from `getTagsWithOperations`
     * @param depth items depth
     */
    MenuBuilder.getOperationsItems = function (parser, parent, tag, depth, options) {
        if (tag.operations.length === 0) {
            return [];
        }
        var res = [];
        for (var _i = 0, _a = tag.operations; _i < _a.length; _i++) {
            var operationInfo = _a[_i];
            var operation = new Operation_OperationModel(parser, operationInfo, parent, options);
            operation.depth = depth;
            res.push(operation);
        }
        return res;
    };
    /**
     * collects tags and maps each tag to list of operations belonging to this tag
     */
    MenuBuilder.getTagsWithOperations = function (spec) {
        var tags = {};
        for (var _i = 0, _a = spec.tags || []; _i < _a.length; _i++) {
            var tag = _a[_i];
            tags[tag.name] = external_tslib_["__assign"]({}, tag, { operations: [] });
        }
        var paths = spec.paths;
        for (var _b = 0, _c = Object.keys(paths); _b < _c.length; _b++) {
            var pathName = _c[_b];
            var path = paths[pathName];
            var operations = Object.keys(path).filter(isOperationName);
            for (var _d = 0, operations_1 = operations; _d < operations_1.length; _d++) {
                var operationName = operations_1[_d];
                var operationInfo = path[operationName];
                var operationTags = operationInfo.tags;
                if (!operationTags || !operationTags.length) {
                    // empty tag
                    operationTags = [''];
                }
                for (var _e = 0, operationTags_1 = operationTags; _e < operationTags_1.length; _e++) {
                    var tagName = operationTags_1[_e];
                    var tag = tags[tagName];
                    if (tag === undefined) {
                        tag = {
                            name: tagName,
                            operations: []
                        };
                        tags[tagName] = tag;
                    }
                    if (tag['x-traitTag']) {
                        continue;
                    }
                    tag.operations.push(external_tslib_["__assign"]({}, operationInfo, { pathName: pathName, httpVerb: operationName, pathParameters: path.parameters || [] }));
                }
            }
        }
        return tags;
    };
    return MenuBuilder;
}());


// CONCATENATED MODULE: ./src/services/MenuStore.ts






var SECTION_ATTR = 'data-section-id';
/**
 * Stores all side-menu related information
 */
var MenuStore_MenuStore = /** @class */ (function () {
    /**
     *
     * @param spec [SpecStore](#SpecStore) which contains page content structure
     * @param scroll scroll service instance used by this menu
     */
    function MenuStore(spec, scroll, history) {
        var _this = this;
        this.scroll = scroll;
        this.history = history;
        /**
         * active item absolute index (when flattened). -1 means nothing is selected
         */
        this.activeItemIdx = -1;
        /**
         * whether sidebar with menu is opened or not
         */
        this.sideBarOpened = false;
        /**
         * update active items on scroll
         * @param isScrolledDown whether last scroll was downside
         */
        this.updateOnScroll = function (isScrolledDown) {
            var step = isScrolledDown ? 1 : -1;
            var itemIdx = _this.activeItemIdx;
            while (true) {
                if (itemIdx === -1 && !isScrolledDown) {
                    break;
                }
                if (itemIdx >= _this.flatItems.length - 1 && isScrolledDown) {
                    break;
                }
                if (isScrolledDown) {
                    var el = _this.getElementAt(itemIdx + 1);
                    if (_this.scroll.isElementBellow(el)) {
                        break;
                    }
                }
                else {
                    var el = _this.getElementAt(itemIdx);
                    if (_this.scroll.isElementAbove(el)) {
                        break;
                    }
                }
                itemIdx += step;
            }
            _this.activate(_this.flatItems[itemIdx], true, true);
        };
        /**
         * update active items on hash change
         * @param id current hash
         */
        this.updateOnHistory = function (id) {
            if (id === void 0) { id = _this.history.currentId; }
            if (!id) {
                return;
            }
            var item;
            item = _this.flatItems.find(function (i) { return i.id === id; });
            if (item) {
                _this.activateAndScroll(item, false);
            }
            else {
                if (id.startsWith(SECURITY_SCHEMES_SECTION_PREFIX)) {
                    item = _this.flatItems.find(function (i) { return SECURITY_SCHEMES_SECTION_PREFIX.startsWith(i.id); });
                    _this.activate(item);
                }
                _this.scroll.scrollIntoViewBySelector("[" + SECTION_ATTR + "=\"" + id + "\"]");
            }
        };
        this.getItemById = function (id) {
            return _this.flatItems.find(function (item) { return item.id === id; });
        };
        this.items = spec.contentItems;
        this.flatItems = flattenByProp(this.items || [], 'items');
        this.flatItems.forEach(function (item, idx) { return item.absoluteIdx = idx; });
        this.subscribe();
    }
    /**
     * Statically try update scroll position
     * Used before hydrating from server-side rendered html to scroll page faster
     */
    MenuStore.updateOnHistory = function (id, scroll) {
        if (id === void 0) { id = HistoryService_history.currentId; }
        if (!id) {
            return;
        }
        scroll.scrollIntoViewBySelector("[" + SECTION_ATTR + "=\"" + id + "\"]");
    };
    MenuStore.prototype.subscribe = function () {
        this._unsubscribe = this.scroll.subscribe(this.updateOnScroll);
        this._hashUnsubscribe = this.history.subscribe(this.updateOnHistory);
    };
    MenuStore.prototype.toggleSidebar = function () {
        this.sideBarOpened = this.sideBarOpened ? false : true;
    };
    MenuStore.prototype.closeSidebar = function () {
        this.sideBarOpened = false;
    };
    /**
     * get section/operation DOM Node related to the item or null if it doesn't exist
     * @param idx item absolute index
     */
    MenuStore.prototype.getElementAt = function (idx) {
        var item = this.flatItems[idx];
        return item && querySelector("[" + SECTION_ATTR + "=\"" + item.id + "\"]") || null;
    };
    Object.defineProperty(MenuStore.prototype, "activeItem", {
        /**
         * current active item
         */
        get: function () {
            return this.flatItems[this.activeItemIdx] || undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * activate menu item
     * @param item item to activate
     * @param updateLocation [true] whether to update location
     * @param rewriteHistory [false] whether to rewrite browser history (do not create new enrty)
     */
    MenuStore.prototype.activate = function (item, updateLocation, rewriteHistory) {
        if (updateLocation === void 0) { updateLocation = true; }
        if (rewriteHistory === void 0) { rewriteHistory = false; }
        if ((this.activeItem && this.activeItem.id) === (item && item.id)) {
            return;
        }
        this.deactivate(this.activeItem);
        if (!item) {
            this.history.replace('', rewriteHistory);
            return;
        } // do not allow activating group items
        // TODO: control over options
        if (item.depth <= GROUP_DEPTH) {
            return;
        }
        this.activeItemIdx = item.absoluteIdx;
        if (updateLocation) {
            this.history.replace(item.id, rewriteHistory);
        }
        item.activate();
        item.expand();
    };
    /**
     * makes item and all the parents not active
     * @param item item to deactivate
     */
    MenuStore.prototype.deactivate = function (item) {
        if (item === undefined) {
            return;
        }
        item.deactivate();
        while (item !== undefined) {
            item.collapse();
            item = item.parent;
        }
    };
    /**
     * activate menu item and scroll to it
     * @see MenuStore.activate
     */
    MenuStore.prototype.activateAndScroll = function (item, updateLocation, rewriteHistory) {
        // item here can be a copy from search results so find corresponding item from menu
        var menuItem = item && this.getItemById(item.id) || item;
        this.activate(menuItem, updateLocation, rewriteHistory);
        this.scrollToActive();
        if (!menuItem || !menuItem.items.length) {
            this.closeSidebar();
        }
    };
    /**
     * scrolls to active section
     */
    MenuStore.prototype.scrollToActive = function () {
        this.scroll.scrollIntoView(this.getElementAt(this.activeItemIdx));
    };
    MenuStore.prototype.dispose = function () {
        this._unsubscribe();
        this._hashUnsubscribe();
    };
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], MenuStore.prototype, "activeItemIdx", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["observable"]
    ], MenuStore.prototype, "sideBarOpened", void 0);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], MenuStore.prototype, "toggleSidebar", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], MenuStore.prototype, "closeSidebar", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"]
    ], MenuStore.prototype, "activate", null);
    external_tslib_["__decorate"]([
        external_mobx_["action"].bound
    ], MenuStore.prototype, "activateAndScroll", null);
    return MenuStore;
}());


// CONCATENATED MODULE: ./src/services/ScrollService.ts




var ScrollService_EVENT = 'scroll';
var ScrollService_ScrollService = /** @class */ (function () {
    function ScrollService(options) {
        this.options = options;
        this._prevOffsetY = 0;
        this._scrollParent = IS_BROWSER ? window : undefined;
        this._emiter = new external_eventemitter3_();
        this.bind();
    }
    ScrollService.prototype.bind = function () {
        this._prevOffsetY = this.scrollY();
        if (this._scrollParent) {
            this._scrollParent.addEventListener('scroll', this.handleScroll);
        }
    };
    ScrollService.prototype.dispose = function () {
        if (this._scrollParent) {
            this._scrollParent.removeEventListener('scroll', this.handleScroll);
        }
        this._emiter.removeAllListeners(ScrollService_EVENT);
    };
    ScrollService.prototype.scrollY = function () {
        if (typeof HTMLElement !== 'undefined' && this._scrollParent instanceof HTMLElement) {
            return this._scrollParent.scrollTop;
        }
        else if (this._scrollParent !== undefined) {
            return this._scrollParent.pageYOffset;
        }
        else {
            return 0;
        }
    };
    ScrollService.prototype.isElementBellow = function (el) {
        if (el === null) {
            return;
        }
        return el.getBoundingClientRect().top > this.options.scrollYOffset();
    };
    ScrollService.prototype.isElementAbove = function (el) {
        if (el === null) {
            return;
        }
        var top = el.getBoundingClientRect().top;
        return (top > 0 ? Math.floor(top) : Math.ceil(top)) <= this.options.scrollYOffset();
    };
    ScrollService.prototype.subscribe = function (cb) {
        var emmiter = this._emiter.addListener(ScrollService_EVENT, cb);
        return function () { return emmiter.removeListener(ScrollService_EVENT, cb); };
    };
    ScrollService.prototype.scrollIntoView = function (element) {
        if (element === null) {
            return;
        }
        element.scrollIntoView();
        if (this._scrollParent && this._scrollParent.scrollBy) {
            this._scrollParent.scrollBy(0, -this.options.scrollYOffset());
        }
    };
    ScrollService.prototype.scrollIntoViewBySelector = function (selector) {
        var element = querySelector(selector);
        this.scrollIntoView(element);
    };
    ScrollService.prototype.handleScroll = function () {
        var scrollY = this.scrollY();
        var isScrolledDown = scrollY - this._prevOffsetY > 0;
        this._prevOffsetY = this.scrollY();
        this._emiter.emit(ScrollService_EVENT, isScrolledDown);
    };
    external_tslib_["__decorate"]([
        external_decko_["bind"],
        Throttle(100)
    ], ScrollService.prototype, "handleScroll", null);
    return ScrollService;
}());


// CONCATENATED MODULE: ./src/services/SearchStore.ts


var worker;
if (IS_BROWSER) {
    try {
        // tslint:disable-next-line
        worker = __webpack_require__(62);
    }
    catch (e) {
        worker = __webpack_require__(28).default;
    }
}
else {
    worker = __webpack_require__(28).default;
}
var SearchStore_SearchStore = /** @class */ (function () {
    function SearchStore() {
        this.searchWorker = new worker();
    }
    SearchStore.prototype.indexItems = function (groups) {
        var _this = this;
        var recurse = function (items) {
            items.forEach(function (group) {
                if (group.type !== 'group') {
                    _this.add(group.name, group.description || '', group.id);
                }
                recurse(group.items);
            });
        };
        recurse(groups);
        this.searchWorker.done();
    };
    SearchStore.prototype.add = function (title, body, meta) {
        this.searchWorker.add(title, body, meta);
    };
    SearchStore.prototype.search = function (q) {
        return this.searchWorker.search(q);
    };
    SearchStore.prototype.toJS = function () {
        return external_tslib_["__awaiter"](this, void 0, void 0, function () {
            return external_tslib_["__generator"](this, function (_a) {
                return [2 /*return*/, this.searchWorker.toJS()];
            });
        });
    };
    SearchStore.prototype.load = function (state) {
        this.searchWorker.load(state);
    };
    return SearchStore;
}());


// CONCATENATED MODULE: ./src/common-elements/panels.ts



var MiddlePanel = styled_components.div.withConfig({
    componentId: "sc-6itmo6-0"
})(["width:100%;padding:", ";"], function (props) { return props.theme.spacing.sectionVertical + "px " + props.theme.spacing.sectionHorizontal + "px"; });
var Section = styled_components.div.attrs(function (props) {
    var _a;
    return (_a = {},
        _a[SECTION_ATTR] = props.id,
        _a);
}).withConfig({
    componentId: "sc-6itmo6-1"
})(["padding:", "px 0;", " ", ""], function (props) { return props.theme.spacing.sectionVertical; }, media.lessThan('medium', true)(panels_templateObject_1 || (panels_templateObject_1 = external_tslib_["__makeTemplateObject"](["\n    padding: 0;\n  "], ["\n    padding: 0;\n  "]))), function (props) { return props.underlined && "\n    position: relative;\n\n    &:not(:last-of-type):after {\n      position: absolute;\n      bottom: 0;\n      width: 100%;\n      display: block;\n      content: '';\n      border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n    }\n  " || ''; });
var RightPanel = styled_components.div.withConfig({
    componentId: "sc-6itmo6-2"
})(["color:", ";background-color:", ";width:100%;padding:", ";"], function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (props) { return props.theme.rightPanel.backgroundColor; }, function (props) { return props.theme.spacing.sectionVertical + "px " + props.theme.spacing.sectionHorizontal + "px"; });
var DarkRightPanel = styled_components(RightPanel).withConfig({
    componentId: "sc-6itmo6-3"
})(["background-color:", ";"], function (props) { return props.theme.rightPanel.backgroundColor; });
var Row = styled_components.div.withConfig({
    componentId: "sc-6itmo6-4"
})(["display:flex;width:100%;padding:0;flex-direction:column;"]);
var panels_templateObject_1;

// CONCATENATED MODULE: ./src/common-elements/headers.ts

var headerFontSize = {
    1: '1.85714em',
    2: '1.57143em',
    3: '1.27em'
};
var headerCommonMixin = function (level) { return css(["font-family:", ";font-weight:", ";font-size:", ";"], function (props) { return props.theme.typography.headings.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.headings.fontWeight;
}, headerFontSize[level]); };
var H1 = styled_components.h1.withConfig({
    componentId: "shv3r-0"
})(["", ";color:", ";", ";"], headerCommonMixin(1), function (props) { return props.theme.colors.primary.main; }, extensionsHook('H1'));
var H2 = styled_components.h2.withConfig({
    componentId: "shv3r-1"
})(["", ";color:black;", ";"], headerCommonMixin(2), extensionsHook('H2'));
var H3 = styled_components.h2.withConfig({
    componentId: "shv3r-2"
})(["", ";color:black;", ";"], headerCommonMixin(3), extensionsHook('H3'));
var RightPanelHeader = styled_components.h3.withConfig({
    componentId: "shv3r-3"
})(["color:", ";", ";"], function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, extensionsHook('RightPanelHeader'));
var UnderlinedHeader = styled_components.h5.withConfig({
    componentId: "shv3r-4"
})(["border-bottom:1px solid rgba(38,50,56,0.3);margin:1em 0 1em 0;color:rgba(38,50,56,0.5);font-weight:normal;text-transform:uppercase;font-size:0.929em;line-height:20px;", ";"], extensionsHook('UnderlinedHeader'));

// EXTERNAL MODULE: external "memoize-one"
var external_memoize_one_ = __webpack_require__(33);
var external_memoize_one_default = /*#__PURE__*/__webpack_require__.n(external_memoize_one_);

// CONCATENATED MODULE: ./src/components/StoreBuilder.ts





var StoreBuilder_a = Object(external_react_["createContext"])(undefined), Provider = StoreBuilder_a.Provider, Consumer = StoreBuilder_a.Consumer;

var StoreBuilder_StoreBuilder = /** @class */ (function (_super) {
    external_tslib_["__extends"](StoreBuilder, _super);
    function StoreBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            loading: true,
            resolvedSpec: null
        };
        return _this;
    }
    StoreBuilder.getDerivedStateFromProps = function (nextProps, prevState) {
        if (nextProps.specUrl !== prevState.prevSpecUrl || nextProps.spec !== prevState.prevSpec) {
            return {
                loading: true,
                resolvedSpec: null,
                prevSpec: nextProps.spec,
                prevSpecUrl: nextProps.specUrl
            };
        }
        return null;
    };
    StoreBuilder.prototype.makeStore = function (spec, specUrl, options) {
        if (!spec) {
            return undefined;
        }
        try {
            return new AppStore_AppStore(spec, specUrl, options);
        }
        catch (e) {
            if (this.props.onLoaded) {
                this.props.onLoaded(e);
            }
            throw e;
        }
    };
    StoreBuilder.prototype.componentDidMount = function () {
        this.load();
    };
    StoreBuilder.prototype.componentDidUpdate = function () {
        if (this.state.resolvedSpec === null) {
            this.load();
        }
        else if (!this.state.loading && this.props.onLoaded) {
            // may run multiple time
            this.props.onLoaded();
        }
    };
    StoreBuilder.prototype.load = function () {
        return external_tslib_["__awaiter"](this, void 0, void 0, function () {
            var _a, specUrl, spec, resolvedSpec, e_1;
            return external_tslib_["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, specUrl = _a.specUrl, spec = _a.spec;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, loadAndBundleSpec(spec || specUrl)];
                    case 2:
                        resolvedSpec = _b.sent();
                        this.setState({
                            resolvedSpec: resolvedSpec,
                            loading: false
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        if (this.props.onLoaded) {
                            this.props.onLoaded(e_1);
                        }
                        this.setState({
                            error: e_1
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StoreBuilder.prototype.render = function () {
        if (this.state.error) {
            throw this.state.error;
        }
        var _a = this.props, specUrl = _a.specUrl, options = _a.options;
        var _b = this.state, loading = _b.loading, resolvedSpec = _b.resolvedSpec;
        return this.props.children({
            loading: loading,
            store: this.makeStore(resolvedSpec, specUrl, options)
        });
    };
    external_tslib_["__decorate"]([
        external_memoize_one_default.a
    ], StoreBuilder.prototype, "makeStore", null);
    return StoreBuilder;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/common-elements/linkify.tsx




var linkifyMixin = function (className) { return css(["", "{cursor:pointer;margin-left:-20px;padding:0;line-height:1;width:20px;display:inline-block;}", ":before{content:'';width:15px;height:15px;background-size:contain;background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');opacity:0.5;visibility:hidden;display:inline-block;vertical-align:middle;}h1:hover > ", "::before,h2:hover > ", "::before,", ":hover::before{visibility:visible;}"], className, className, className, className, className); };
var isModifiedEvent = function (event) { return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey); };
var linkify_Link = /** @class */ (function (_super) {
    external_tslib_["__extends"](Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.navigate = function (history, event) {
            if (!event.defaultPrevented && // onClick prevented default
                event.button === 0 && // ignore everything but left clicks
                !isModifiedEvent(event) // ignore clicks with modifier keys
            ) {
                event.preventDefault();
                history.replace(_this.props.to);
            }
        };
        return _this;
    }
    Link.prototype.render = function () {
        var _this = this;
        return external_react_["createElement"](Consumer, null, function (store) { return external_react_["createElement"]("a", { className: _this.props.className, href: store.menu.history.linkForId(_this.props.to), onClick: _this.navigate.bind(_this, store.menu.history) }, _this.props.children); });
    };
    return Link;
}(external_react_["Component"]));

var StyledShareLink = styled_components(linkify_Link).withConfig({
    componentId: "eb0njo-0"
})(["", ";"], linkifyMixin('&'));
function ShareLink(props) {
    return external_react_["createElement"](StyledShareLink, { to: props.to });
}

// CONCATENATED MODULE: ./src/common-elements/shelfs.tsx



var directionMap = {
    left: '90deg',
    right: '-90deg',
    up: '-180deg',
    down: '0'
};
var shelfs_IntShelfIcon = /** @class */ (function (_super) {
    external_tslib_["__extends"](IntShelfIcon, _super);
    function IntShelfIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntShelfIcon.prototype.render = function () {
        return external_react_["createElement"]("svg", { className: this.props.className, style: this.props.style, version: "1.1", viewBox: "0 0 24 24", x: "0", xmlns: "http://www.w3.org/2000/svg", y: "0" },
            external_react_["createElement"]("polygon", { points: "17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 " }));
    };
    return IntShelfIcon;
}(external_react_["PureComponent"]));
var ShelfIcon = styled_components(shelfs_IntShelfIcon).withConfig({
    componentId: "sc-1g5rdgs-0"
})(["height:", ";width:", ";vertical-align:middle;float:", ";transition:transform 0.2s ease-out;transform:rotateZ(", ");polygon{fill:", ";}"], function (props) { return props.size || '18px'; }, function (props) { return props.size || '18px'; }, function (props) { return props.float || ''; }, function (props) { return directionMap[props.direction || 'down']; }, function (props) { return props.color && props.theme.colors[props.color] && props.theme.colors[props.color].main || props.color; });
var Badge = styled_components.span.withConfig({
    componentId: "sc-1g5rdgs-1"
})(["display:inline-block;padding:0 5px;margin:0;background-color:", ";color:", ";font-size:", ";vertical-align:text-top;"], function (props) { return props.theme.colors[props.type].main; }, function (props) { return props.theme.colors[props.type].contrastText; }, function (props) { return props.theme.typography.code.fontSize; });

// CONCATENATED MODULE: ./src/common-elements/mixins.ts

var deprecatedCss = css(["text-decoration:line-through;color:#bdccd3;"]);

// CONCATENATED MODULE: ./src/common-elements/fields-layout.ts
// import { transparentize } from 'polished';


var PropertiesTableCaption = styled_components.caption.withConfig({
    componentId: "dz44d2-0"
})(["text-align:right;font-size:0.9em;font-weight:normal;color:", ";"], function (props) { return props.theme.colors.text.secondary; });
var PropertyCell = styled_components.td.withConfig({
    componentId: "dz44d2-1"
})(["border-left:1px solid ", ";box-sizing:border-box;position:relative;padding:10px 10px 10px 0;tr:first-of-type > &,tr.last > &{border-left-width:0;background-position:top left;background-repeat:no-repeat;background-size:1px 100%;}tr:first-of-type > &{background-image:linear-gradient( to bottom,transparent 0%,transparent 22px,", " 22px,", " 100% );}tr.last > &{background-image:linear-gradient( to bottom,", " 0%,", " 22px,transparent 22px,transparent 100% );}tr.last + tr > &{border-left-color:transparent;}tr.last:first-child > &{background:none;border-left-color:transparent;}"], function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; });
var PropertyCellWithInner = styled_components(PropertyCell).withConfig({
    componentId: "dz44d2-2"
})(["padding:0;"]);
var PropertyNameCell = styled_components(PropertyCell).withConfig({
    componentId: "dz44d2-3"
})(["vertical-align:top;line-height:20px;white-space:nowrap;font-size:0.929em;font-family:", ";&.deprecated{", ";}", ";", ";"], function (props) { return props.theme.typography.headings.fontFamily; }, deprecatedCss, function (_a) {
    var kind = _a.kind;
    return kind !== 'field' ? 'font-style: italic' : '';
}, extensionsHook('PropertyNameCell'));
var PropertyDetailsCell = styled_components.td.withConfig({
    componentId: "dz44d2-4"
})(["border-bottom:1px solid #eee;padding:10px 0;width:", ";box-sizing:border-box;tr.expanded &{border-bottom:none;}"], function (props) { return props.theme.schema.defaultDetailsWidth; });
var PropertyBullet = styled_components.span.withConfig({
    componentId: "dz44d2-5"
})(["color:", ";font-family:", ";margin-right:10px;&::before{content:'';display:inline-block;vertical-align:middle;width:10px;height:1px;background:", ";}&::after{content:'';display:inline-block;vertical-align:middle;width:1px;background:", ";height:7px;}"], function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; });
var InnerPropertiesWrap = styled_components.div.withConfig({
    componentId: "dz44d2-6"
})(["padding:", ";"], function (_a) {
    var theme = _a.theme;
    return theme.schema.nestingSpacing;
});
var PropertiesTable = styled_components.table.withConfig({
    componentId: "dz44d2-7"
})(["border-collapse:separate;border-radius:3px;font-size:", ";border-spacing:0;width:100%;> tr{vertical-align:middle;}& ", ",& ", " ", " ", ",& ", " ", " ", " ", " ", "{margin:", ";margin-right:0;background:", ";}& ", " ", ",& ", " ", " ", " ", ",& ", " ", " ", " ", " ", " ", "{background:#ffffff;}"], function (props) { return props.theme.typography.fontSize; }, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestingSpacing;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestedBackground;
}, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap);

// CONCATENATED MODULE: ./src/common-elements/schema.ts

var OneOfList = styled_components.ul.withConfig({
    componentId: "y3ai9j-0"
})(["margin:0 0 3px 0;padding:0;list-style:none;display:inline-block;"]);
var OneOfLabel = styled_components.span.withConfig({
    componentId: "y3ai9j-1"
})(["font-size:0.9em;margin-right:10px;color:", ";font-family:Montserrat;}"], function (props) { return props.theme.colors.primary.main; });
var schema_OneOfButton = styled_components.li.withConfig({
    componentId: "y3ai9j-2"
})(["display:inline-block;margin-right:10px;font-size:0.8em;cursor:pointer;border:1px solid ", ";padding:2px 10px;", ""], function (props) { return props.theme.colors.primary.main; }, function (props) {
    if (props.active) {
        return "\n      color: white;\n      background-color: " + props.theme.colors.primary.main + ";\n      ";
    }
    else {
        return "\n        color: " + props.theme.colors.primary.main + ";\n        background-color: white;\n      ";
    }
});
var ArrayOpenningLabel = styled_components.div.withConfig({
    componentId: "y3ai9j-3"
})(["font-size:0.9em;font-family:", ";&::after{content:' [';}"], function (props) { return props.theme.typography.code.fontFamily; });
var ArrayClosingLabel = styled_components.div.withConfig({
    componentId: "y3ai9j-4"
})(["font-size:0.9em;font-family:", ";&::after{content:']';}"], function (props) { return props.theme.typography.code.fontFamily; });

// EXTERNAL MODULE: external "react-dropdown"
var external_react_dropdown_ = __webpack_require__(34);
var external_react_dropdown_default = /*#__PURE__*/__webpack_require__.n(external_react_dropdown_);

// CONCATENATED MODULE: ./src/common-elements/dropdown.ts


var StyledDropdown = styled_components(external_react_dropdown_default.a).withConfig({
    componentId: "sc-1c2fwzw-0"
})(["min-width:100px;display:inline-block;position:relative;width:auto;font-family:", ";.Dropdown-control{font-family:", ";position:relative;font-size:0.929em;width:100%;line-height:1.5em;vertical-align:middle;cursor:pointer;border-color:rgba(38,50,56,0.5);color:#263238;outline:none;padding:0.15em 1.5em 0.2em 0.5em;border-radius:2px;border-width:1px;border-style:solid;margin-top:5px;background:white;box-sizing:border-box;&:hover{border-color:", ";color:", ";box-shadow:0px 2px 4px 0px rgba(34,36,38,0.12);}}.Dropdown-arrow{border-color:", " transparent transparent;border-style:solid;border-width:0.35em 0.35em 0;content:' ';display:block;height:0;position:absolute;right:0.35em;top:50%;margin-top:-0.125em;width:0;}.Dropdown-menu{position:absolute;margin-top:2px;left:0;right:0;z-index:10;min-width:100px;background:white;border:1px solid rgba(38,50,56,0.2);box-shadow:0px 2px 4px 0px rgba(34,36,38,0.12),0px 2px 10px 0px rgba(34,36,38,0.08);max-height:220px;overflow:auto;}.Dropdown-option{font-size:0.9em;color:#263238;cursor:pointer;padding:0.4em;&.is-selected{background-color:rgba(0,0,0,0.05);}&:hover{background-color:rgba(38,50,56,0.12);}}"], function (props) { return props.theme.typography.headings.fontFamily; }, function (props) { return props.theme.typography.headings.fontFamily; }, function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; });
var SimpleDropdown = styled_components(StyledDropdown).withConfig({
    componentId: "sc-1c2fwzw-1"
})(["margin-left:10px;text-transform:none;font-size:0.929em;.Dropdown-control{font-size:1em;border:none;padding:0 1.2em 0 0;background:transparent;&:hover{color:", ";box-shadow:none;}}"], function (props) { return props.theme.colors.primary.main; });
var MimeLabel = styled_components.span.withConfig({
    componentId: "sc-1c2fwzw-2"
})(["margin-left:10px;text-transform:none;font-size:0.929em;color:black;"]);

// EXTERNAL MODULE: external "react-tabs"
var external_react_tabs_ = __webpack_require__(8);

// CONCATENATED MODULE: ./src/common-elements/tabs.ts




var Tabs = styled_components(external_react_tabs_["Tabs"]).withConfig({
    componentId: "sc-1vrf7wa-0"
})(["> ul{list-style:none;padding:0;margin:0;margin:0 -5px;> li{padding:5px 10px;display:inline-block;background-color:#ffffff;border-bottom:1px solid rgba(0,0,0,0.5);cursor:pointer;text-align:center;outline:none;color:#333333;margin:5px;border:1px solid ", ";border-radius:4px;min-width:60px;font-size:0.9em;font-weight:bold;&.react-tabs__tab--selected{color:", ";border:1px solid ", ";}&:only-child{flex:none;min-width:100px;}&.tab-success{color:", ";}&.tab-redirect{color:", ";}&.tab-info{color:", ";}&.tab-error{color:", ";}}}> .react-tabs__tab-panel{background:", ";border-radius:4px;& > div,& > pre{padding:20px;margin:0;}}"], function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.1, theme.rightPanel.backgroundColor);
}, function (props) { return props.theme.colors.text.primary; }, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (props) { return props.theme.colors.responses.success.color; }, function (props) { return props.theme.colors.responses.redirect.color; }, function (props) { return props.theme.colors.responses.info.color; }, function (props) { return props.theme.colors.responses.error.color; }, function (_a) {
    var theme = _a.theme;
    return theme.codeSample.backgroundColor;
});
var SmallTabs = styled_components(Tabs).withConfig({
    componentId: "sc-1vrf7wa-1"
})(["> ul{display:block;> li{padding:2px 5px;min-width:auto;margin:0 15px 0 0;font-size:13px;font-weight:normal;border-bottom:1px dashed;color:", ";border-radius:0;background:none;&:last-child{margin-right:0;}&.react-tabs__tab--selected{color:", ";background:none;}}}> .react-tabs__tab-panel{& > div,& > pre{padding:10px 0;margin:0;}}"], function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(theme.colors.tonalOffset, theme.rightPanel.textColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
});

// CONCATENATED MODULE: ./src/common-elements/samples.tsx

var SampleControls = styled_components.div.withConfig({
    componentId: "sc-1rd7dj7-0"
})(["opacity:0.4;transition:opacity 0.3s ease;text-align:right;> span{display:inline-block;padding:2px 10px;cursor:pointer;:hover{background:rgba(255,255,255,0.1);}}"]);
var SampleControlsWrap = styled_components.div.withConfig({
    componentId: "sc-1rd7dj7-1"
})(["&:hover ", "{opacity:1;}"], SampleControls);

// EXTERNAL MODULE: external "perfect-scrollbar"
var external_perfect_scrollbar_ = __webpack_require__(20);
var external_perfect_scrollbar_default = /*#__PURE__*/__webpack_require__.n(external_perfect_scrollbar_);

// EXTERNAL MODULE: ./node_modules/perfect-scrollbar/css/perfect-scrollbar.css
var perfect_scrollbar = __webpack_require__(21);
var perfect_scrollbar_default = /*#__PURE__*/__webpack_require__.n(perfect_scrollbar);

// CONCATENATED MODULE: ./src/common-elements/perfect-scrollbar.tsx






/*
 * perfect scrollbar umd bundle uses exports assignment while module uses default export
 * so when bundled with webpack default export works but with jest it crashes
 * That's why the following ugly fix is required
 */
var PerfectScrollbarConstructor = external_perfect_scrollbar_default.a || external_perfect_scrollbar_;
var PSStyling = createGlobalStyle(perfect_scrollbar_templateObject_1 || (perfect_scrollbar_templateObject_1 = external_tslib_["__makeTemplateObject"](["", ""], ["", ""])), perfect_scrollbar_default.a && perfect_scrollbar_default.a.toString());
var StyledScrollWrapper = styled_components.div.withConfig({
    componentId: "i2xdng-0"
})(["position:relative;"]);
var perfect_scrollbar_PerfectScrollbar = /** @class */ (function (_super) {
    external_tslib_["__extends"](PerfectScrollbar, _super);
    function PerfectScrollbar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleRef = function (ref) {
            _this._container = ref;
        };
        return _this;
    }
    PerfectScrollbar.prototype.componentDidMount = function () {
        var offset = this._container.parentElement && this._container.parentElement.scrollTop || 0;
        this.inst = new PerfectScrollbarConstructor(this._container, this.props.options || {});
        if (this._container.scrollTo) {
            this._container.scrollTo(0, offset);
        }
    };
    PerfectScrollbar.prototype.componentDidUpdate = function () {
        this.inst.update();
    };
    PerfectScrollbar.prototype.componentWillUnmount = function () {
        this.inst.destroy();
    };
    PerfectScrollbar.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, updateFn = _a.updateFn;
        if (updateFn) {
            updateFn(this.componentDidUpdate.bind(this));
        }
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](PSStyling, null),
            external_react_["createElement"](StyledScrollWrapper, { className: "scrollbar-container " + className, ref: this.handleRef }, children));
    };
    return PerfectScrollbar;
}(external_react_["Component"]));

function PerfectScrollbarWrap(props) {
    return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return !options.nativeScrollbars ? external_react_["createElement"](perfect_scrollbar_PerfectScrollbar, external_tslib_["__assign"]({}, props), props.children) : external_react_["createElement"]("div", { style: {
            overflow: 'auto',
            msOverflowStyle: '-ms-autohiding-scrollbar'
        } }, props.children); });
}
var perfect_scrollbar_templateObject_1;

// CONCATENATED MODULE: ./src/common-elements/index.ts












// EXTERNAL MODULE: external "dompurify"
var external_dompurify_ = __webpack_require__(35);

// CONCATENATED MODULE: ./src/common-elements/PrismDiv.tsx

var PrismDiv = styled_components.div.withConfig({
    componentId: "sc-107yc6q-0"
})(["code[class*='language-'],pre[class*='language-']{background:#f8f8f8;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none;}@media print{code[class*='language-'],pre[class*='language-']{text-shadow:none;}}pre[class*='language-']{padding:1em;margin:0.5em 0;overflow:auto;}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:#bbb;}.token.punctuation{opacity:0.7;}.namespace{opacity:0.7;}.token.property,.token.tag,.token.number,.token.constant,.token.symbol{color:#4a8bb3;}.token.boolean{color:firebrick;}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.punctuation,.token.inserted{color:#333333;& + a,& + a:visited{color:#4ed2ba;text-decoration:underline;}}.token.operator,.token.entity,.token.url,.token.variable{color:#ee8208;}.token.atrule,.token.attr-value,.token.keyword{color:#aa64cc;}.token.regex,.token.important{color:#e90;}.token.important,.token.bold{font-weight:bold;}.token.italic{font-style:italic;}.token.entity{cursor:help;}.token.deleted{color:red;}", ";"], extensionsHook('Prism'));

// CONCATENATED MODULE: ./src/components/Markdown/styled.elements.tsx



var linksCss = css(["a{text-decoration:none;color:", ";&:visited{color:", ";}&:hover{color:", ";}}"], function (props) { return props.theme.typography.links.color; }, function (props) { return props.theme.typography.links.visited; }, function (props) { return props.theme.typography.links.hover; });
var StyledMarkdownBlock = styled_components(PrismDiv).withConfig({
    componentId: "sc-1m0b31p-0"
})(["font-family:", ";font-weight:", ";line-height:", ";p{&:last-child{margin-bottom:0;}}", " ", " h1{", ";color:", ";margin-top:0;}h2{", ";color:", ";}code{color:", ";background-color:#fff;font-family:", ";border-radius:2px;padding:0.1em 0.25em 0.2em;font-size:", ";font-weight:", ";word-break:break-word;}pre{font-family:", ";white-space:", ";background-color:#f5f5f5;color:#333333;padding:12px 14px 15px 14px;overflow-x:auto;line-height:normal;border-radius:0px code{background-color:transparent;color:#333333;padding:0;&:before,&:after{content:none;}}}blockquote{margin:0;margin-bottom:1em;padding:0 15px;color:#777;border-left:4px solid #ddd;}img{max-width:100%;box-sizing:content-box;}ul,ol{padding-left:2em;margin:0;margin-bottom:1em;ul,ol{margin-bottom:0;margin-top:0;}}table{display:block;width:100%;overflow:auto;word-break:normal;word-break:keep-all;border-collapse:collapse;border-spacing:0;margin-top:1.5em;margin-bottom:1.5em;}table tr{background-color:#fff;border-top:1px solid #ccc;&:nth-child(2n){background-color:", ";}}table th,table td{padding:6px 13px;border:1px solid #ddd;}table th{text-align:left;font-weight:bold;}", ";", " ", ";"], function (props) { return props.theme.typography.fontFamily; }, function (props) { return props.theme.typography.fontWeightRegular; }, function (props) { return props.theme.typography.lineHeight; }, function (_a) {
    var compact = _a.compact;
    return compact && "\n    p:first-child {\n      margin-top: 0;\n    }\n    p:last-child {\n      margin-bottom: 0;\n    }\n  ";
}, function (_a) {
    var inline = _a.inline;
    return inline && " p {\n    display: inline-block;\n  }";
}, headerCommonMixin(1), function (props) { return props.theme.colors.primary.main; }, headerCommonMixin(2), function (props) { return props.theme.colors.text.primary; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.color;
}, function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.fontWeight;
}, function (props) { return props.theme.typography.code.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestedBackground;
}, linkifyMixin('.share-link'), linksCss, extensionsHook('Markdown'));

// CONCATENATED MODULE: ./src/components/Markdown/SanitizedMdBlock.tsx





var StyledMarkdownSpan = StyledMarkdownBlock.withComponent('span');
var sanitize = function (untrustedSpec, html) { return untrustedSpec ? external_dompurify_["sanitize"](html) : html; };
function SanitizedMarkdownHTML(props) {
    var Wrap = props.inline ? StyledMarkdownSpan : StyledMarkdownBlock;
    return external_react_["createElement"](OptionsConsumer, null, function (options) { return external_react_["createElement"](Wrap, external_tslib_["__assign"]({ className: 'redoc-markdown ' + (props.className || ''), dangerouslySetInnerHTML: {
            __html: sanitize(options.untrustedSpec, props.html)
        } }, props)); });
}

// CONCATENATED MODULE: ./src/components/Markdown/Markdown.tsx




var Markdown_Markdown = /** @class */ (function (_super) {
    external_tslib_["__extends"](Markdown, _super);
    function Markdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Markdown.prototype.render = function () {
        var _a = this.props, source = _a.source, inline = _a.inline, compact = _a.compact, className = _a.className;
        var renderer = new MarkdownRenderer_MarkdownRenderer();
        return external_react_["createElement"](SanitizedMarkdownHTML, { html: renderer.renderMd(source), inline: inline, compact: compact, className: className });
    };
    return Markdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SecuritySchemes/SecuritySchemes.tsx





var AUTH_TYPES = {
    oauth2: 'OAuth2',
    apiKey: 'API Key',
    http: 'HTTP',
    openIdConnect: 'Open ID Connect'
};
var SecuritySchemes_OAuthFlow = /** @class */ (function (_super) {
    external_tslib_["__extends"](OAuthFlow, _super);
    function OAuthFlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OAuthFlow.prototype.render = function () {
        var _a = this.props, type = _a.type, flow = _a.flow;
        return external_react_["createElement"]("tr", null,
            external_react_["createElement"]("th", null,
                " ",
                type,
                " OAuth Flow "),
            external_react_["createElement"]("td", null,
                type === 'implicit' || type === 'authorizationCode' ? external_react_["createElement"]("div", null,
                    external_react_["createElement"]("strong", null, " Authorization URL: "),
                    flow.authorizationUrl) : null,
                type === 'password' || type === 'clientCredentials' || type === 'authorizationCode' ? external_react_["createElement"]("div", null,
                    external_react_["createElement"]("strong", null, " Token URL: "),
                    flow.tokenUrl) : null,
                flow.refreshUrl && external_react_["createElement"]("div", null,
                    external_react_["createElement"]("strong", null, " Refresh URL: "),
                    flow.refreshUrl),
                external_react_["createElement"]("div", null,
                    external_react_["createElement"]("strong", null, " Scopes: ")),
                external_react_["createElement"]("ul", null, Object.keys(flow.scopes).map(function (scope) { return external_react_["createElement"]("li", { key: scope },
                    external_react_["createElement"]("code", null, scope),
                    " - ",
                    external_react_["createElement"](Markdown_Markdown, { inline: true, source: flow.scopes[scope] || '' })); }))));
    };
    return OAuthFlow;
}(external_react_["PureComponent"]));

var SecuritySchemes_SecurityDefs = /** @class */ (function (_super) {
    external_tslib_["__extends"](SecurityDefs, _super);
    function SecurityDefs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityDefs.prototype.render = function () {
        return this.props.securitySchemes.schemes.map(function (scheme) { return external_react_["createElement"](Section, { id: scheme.sectionId, key: scheme.id },
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"](H2, null,
                        external_react_["createElement"](ShareLink, { to: scheme.sectionId }),
                        scheme.id),
                    external_react_["createElement"](Markdown_Markdown, { source: scheme.description || '' }),
                    external_react_["createElement"](StyledMarkdownBlock, null,
                        external_react_["createElement"]("table", { className: "security-details" },
                            external_react_["createElement"]("tbody", null,
                                external_react_["createElement"]("tr", null,
                                    external_react_["createElement"]("th", null, " Security scheme type: "),
                                    external_react_["createElement"]("td", null,
                                        " ",
                                        AUTH_TYPES[scheme.type] || scheme.type,
                                        " ")),
                                scheme.apiKey ? external_react_["createElement"]("tr", null,
                                    external_react_["createElement"]("th", null,
                                        " ",
                                        scheme.apiKey.in,
                                        " parameter name:"),
                                    external_react_["createElement"]("td", null,
                                        " ",
                                        scheme.apiKey.name,
                                        " ")) : scheme.http ? [external_react_["createElement"]("tr", { key: "scheme" },
                                        external_react_["createElement"]("th", null, " HTTP Authorization Scheme "),
                                        external_react_["createElement"]("td", null,
                                            " ",
                                            scheme.http.scheme,
                                            " ")), scheme.http.scheme === 'bearer' && scheme.http.bearerFormat && external_react_["createElement"]("tr", { key: "bearer" },
                                        external_react_["createElement"]("th", null, " Bearer format "),
                                        external_react_["createElement"]("td", null,
                                            " \"",
                                            scheme.http.bearerFormat,
                                            "\" "))] : scheme.openId ? external_react_["createElement"]("tr", null,
                                    external_react_["createElement"]("th", null, " Connect URL "),
                                    external_react_["createElement"]("td", null,
                                        external_react_["createElement"]("a", { target: "_blank", href: scheme.openId.connectUrl }, scheme.openId.connectUrl))) : scheme.flows ? Object.keys(scheme.flows).map(function (type) { return external_react_["createElement"](SecuritySchemes_OAuthFlow, { key: type, type: type, flow: scheme.flows[type] }); }) : null)))))); });
    };
    return SecurityDefs;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/services/AppStore.ts

var AppStore_a;











function createStore(spec, specUrl, options) {
    if (options === void 0) { options = {}; }
    return external_tslib_["__awaiter"](this, void 0, void 0, function () {
        var resolvedSpec;
        return external_tslib_["__generator"](this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadAndBundleSpec(spec || specUrl)];
                case 1:
                    resolvedSpec = _a.sent();
                    return [2 /*return*/, new AppStore_AppStore(resolvedSpec, specUrl, options)];
            }
        });
    });
}
var AppStore_AppStore = /** @class */ (function () {
    function AppStore(spec, specUrl, options, createSearchIndex) {
        if (options === void 0) { options = {}; }
        if (createSearchIndex === void 0) { createSearchIndex = true; }
        var _this = this;
        this.marker = new MarkerService_MarkerService();
        this.disposer = null;
        this.rawOptions = options;
        this.options = new RedocNormalizedOptions_RedocNormalizedOptions(options, DEFAULT_OPTIONS);
        this.scroll = new ScrollService_ScrollService(this.options); // update position statically based on hash (in case of SSR)
        MenuStore_MenuStore.updateOnHistory(HistoryService_history.currentId, this.scroll);
        this.spec = new SpecStore_SpecStore(spec, specUrl, this.options);
        this.menu = new MenuStore_MenuStore(this.spec, this.scroll, HistoryService_history);
        if (!this.options.disableSearch) {
            this.search = new SearchStore_SearchStore();
            if (createSearchIndex) {
                this.search.indexItems(this.menu.items);
            }
            this.disposer = Object(external_mobx_["observe"])(this.menu, 'activeItemIdx', function (change) {
                _this.updateMarkOnMenu(change.newValue);
            });
        }
    }
    /**
     * deserialize store
     * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
     */
    // TODO:
    AppStore.fromJS = function (state) {
        var inst = new AppStore(state.spec.data, state.spec.url, state.options, false);
        inst.menu.activeItemIdx = state.menu.activeItemIdx || 0;
        inst.menu.activate(inst.menu.flatItems[inst.menu.activeItemIdx]);
        if (!inst.options.disableSearch) {
            inst.search.load(state.searchIndex);
        }
        return inst;
    };
    AppStore.prototype.onDidMount = function () {
        this.menu.updateOnHistory();
        this.updateMarkOnMenu(this.menu.activeItemIdx);
    };
    AppStore.prototype.dispose = function () {
        this.scroll.dispose();
        this.menu.dispose();
        if (this.disposer != null) {
            this.disposer();
        }
    };
    /**
     * serializes store
     * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
     */
    // TODO: improve
    AppStore.prototype.toJS = function () {
        return external_tslib_["__awaiter"](this, void 0, void 0, function () {
            var _a, _b;
            return external_tslib_["__generator"](this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = {
                            menu: {
                                activeItemIdx: this.menu.activeItemIdx
                            },
                            spec: {
                                url: this.spec.parser.specUrl,
                                data: this.spec.parser.spec
                            }
                        };
                        if (!this.search) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.search.toJS()];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = undefined;
                        _c.label = 3;
                    case 3: return [2 /*return*/, (_a.searchIndex = _b,
                            _a.options = this.rawOptions,
                            _a)];
                }
            });
        });
    };
    AppStore.prototype.updateMarkOnMenu = function (idx) {
        var start = Math.max(0, idx);
        var end = Math.min(this.menu.flatItems.length, start + 5);
        var elements = [];
        for (var i = start; i < end; i++) {
            var elem = this.menu.getElementAt(i);
            if (!elem) {
                continue;
            }
            if (this.menu.flatItems[i].type === 'section') {
                elem = elem.parentElement.parentElement;
            }
            if (elem) {
                elements.push(elem);
            }
        }
        this.marker.addOnly(elements);
        this.marker.mark();
    };
    return AppStore;
}());

var DEFAULT_OPTIONS = {
    allowedMdComponents: (AppStore_a = {},
        AppStore_a[SECURITY_DEFINITIONS_COMPONENT_NAME] = {
            component: SecuritySchemes_SecurityDefs,
            propsSelector: function (store) { return ({
                securitySchemes: store.spec.securitySchemes
            }); }
        },
        AppStore_a)
};

// CONCATENATED MODULE: ./src/services/ClipboardService.ts
var isSupported = typeof document !== 'undefined' && document.queryCommandSupported && document.queryCommandSupported('copy');
var ClipboardService = /** @class */ (function () {
    function ClipboardService() {
    }
    ClipboardService.isSupported = function () {
        return isSupported;
    };
    ClipboardService.selectElement = function (element) {
        var range;
        var selection;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        }
        else if (document.createRange && window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
    ClipboardService.deselect = function () {
        if (document.selection) {
            document.selection.empty();
        }
        else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };
    ClipboardService.copySelected = function () {
        var result;
        try {
            result = document.execCommand('copy');
        }
        catch (err) {
            result = false;
        }
        return result;
    };
    ClipboardService.copyElement = function (element) {
        ClipboardService.selectElement(element);
        var res = ClipboardService.copySelected();
        if (res) {
            ClipboardService.deselect();
        }
        return res;
    };
    ClipboardService.copyCustom = function (text) {
        var textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0'; // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em'; // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = '0'; // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none'; // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        var res = ClipboardService.copySelected();
        document.body.removeChild(textArea);
        return res;
    };
    return ClipboardService;
}());


// CONCATENATED MODULE: ./src/services/index.ts














// EXTERNAL MODULE: external "mobx-react"
var external_mobx_react_ = __webpack_require__(2);

// CONCATENATED MODULE: ./src/components/ExternalDocumentation/ExternalDocumentation.tsx





var LinkWrap = styled_components.div.withConfig({
    componentId: "sc-1whyat8-0"
})(["", ";", ""], linksCss, function (_a) {
    var compact = _a.compact;
    return !compact ? 'margin: 1em 0' : '';
});
var ExternalDocumentation_ExternalDocumentation = /** @class */ (function (_super) {
    external_tslib_["__extends"](ExternalDocumentation, _super);
    function ExternalDocumentation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExternalDocumentation.prototype.render = function () {
        var externalDocs = this.props.externalDocs;
        if (!externalDocs || !externalDocs.url) {
            return null;
        }
        return external_react_["createElement"](LinkWrap, { compact: this.props.compact },
            external_react_["createElement"]("a", { href: externalDocs.url }, externalDocs.description || externalDocs.url));
    };
    ExternalDocumentation = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ExternalDocumentation);
    return ExternalDocumentation;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/ApiInfo/styled.elements.ts


var delimiterWidth = 15;
var ApiInfoWrap = MiddlePanel;
var ApiHeader = styled_components(H1).withConfig({
    componentId: "sc-1mcjnf5-0"
})(["margin-top:0;margin-bottom:0.5em;", ";"], extensionsHook('ApiHeader'));
var DownloadButton = styled_components.a.withConfig({
    componentId: "sc-1mcjnf5-1"
})(["border:1px solid ", ";color:", ";font-weight:normal;margin-left:0.5em;padding:4px 8px 4px;display:inline-block;text-decoration:none;cursor:pointer;", ";"], function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; }, extensionsHook('DownloadButton'));
var InfoSpan = styled_components.span.withConfig({
    componentId: "sc-1mcjnf5-2"
})(["&::before{content:'|';display:inline-block;opacity:0.5;width:", "px;text-align:center;}&:last-child::after{display:none;}"], delimiterWidth);
var InfoSpanBoxWrap = styled_components.div.withConfig({
    componentId: "sc-1mcjnf5-3"
})(["overflow:hidden;"]);
var InfoSpanBox = styled_components.div.withConfig({
    componentId: "sc-1mcjnf5-4"
})(["display:flex;flex-wrap:wrap;margin-left:-", "px;"], delimiterWidth);

// CONCATENATED MODULE: ./src/components/ApiInfo/ApiInfo.tsx








var ApiInfo_ApiInfo = /** @class */ (function (_super) {
    external_tslib_["__extends"](ApiInfo, _super);
    function ApiInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleDownloadClick = function (e) {
            if (!e.target.href) {
                e.target.href = _this.props.store.spec.info.downloadLink;
            }
        };
        return _this;
    }
    ApiInfo.prototype.render = function () {
        var store = this.props.store;
        var _a = store.spec, info = _a.info, externalDocs = _a.externalDocs;
        var hideDownloadButton = store.options.hideDownloadButton;
        var downloadFilename = info.downloadFileName;
        var downloadLink = info.downloadLink;
        var license = info.license && external_react_["createElement"](InfoSpan, null,
            "License: ",
            external_react_["createElement"]("a", { href: info.license.url }, info.license.name)) || null;
        var website = info.contact && info.contact.url && external_react_["createElement"](InfoSpan, null,
            "URL: ",
            external_react_["createElement"]("a", { href: info.contact.url }, info.contact.url)) || null;
        var email = info.contact && info.contact.email && external_react_["createElement"](InfoSpan, null,
            info.contact.name || 'E-mail',
            ":",
            ' ',
            external_react_["createElement"]("a", { href: 'mailto:' + info.contact.email }, info.contact.email)) || null;
        var terms = info.termsOfService && external_react_["createElement"](InfoSpan, null,
            external_react_["createElement"]("a", { href: info.termsOfService }, "Terms of Service")) || null;
        return external_react_["createElement"](Section, null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, { className: "api-info" },
                    external_react_["createElement"](ApiHeader, null,
                        info.title,
                        " ",
                        external_react_["createElement"]("span", null,
                            "(",
                            info.version,
                            ")")),
                    !hideDownloadButton && external_react_["createElement"]("p", null,
                        "Download OpenAPI specification:",
                        external_react_["createElement"](DownloadButton, { download: downloadFilename, target: "_blank", href: downloadLink, onClick: this.handleDownloadClick }, "Download")),
                    external_react_["createElement"](StyledMarkdownBlock, null, (info.license || info.contact || info.termsOfService) && external_react_["createElement"](InfoSpanBoxWrap, null,
                        external_react_["createElement"](InfoSpanBox, null,
                            email,
                            " ",
                            website,
                            " ",
                            license,
                            " ",
                            terms)) || null),
                    external_react_["createElement"](Markdown_Markdown, { source: store.spec.info.description }),
                    externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs }))));
    };
    ApiInfo = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ApiInfo);
    return ApiInfo;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/ApiInfo/index.ts


// CONCATENATED MODULE: ./src/components/ApiLogo/styled.elements.tsx


var LogoImgEl = styled_components.img.withConfig({
    componentId: "sc-1ypz5kk-0"
})(["max-height:", ";max-width:", ";width:100%;display:block;"], function (props) { return props.theme.logo.maxHeight; }, function (props) { return props.theme.logo.maxWidth; });
var LogoWrap = styled_components.div.withConfig({
    componentId: "sc-1ypz5kk-1"
})(["text-align:center;"]);
var styled_elements_Link = styled_components.a.withConfig({
    componentId: "sc-1ypz5kk-2"
})(["display:inline-block;"]);
var styled_elements_LinkWrap = function (url) { return function (Component) { return external_react_["createElement"](styled_elements_Link, { href: url }, Component); }; };

// CONCATENATED MODULE: ./src/components/ApiLogo/ApiLogo.tsx




var ApiLogo_ApiLogo = /** @class */ (function (_super) {
    external_tslib_["__extends"](ApiLogo, _super);
    function ApiLogo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApiLogo.prototype.render = function () {
        var info = this.props.info;
        var logoInfo = info['x-logo'];
        if (!logoInfo || !logoInfo.url) {
            return null;
        }
        var logoHref = logoInfo.href || info.contact && info.contact.url; // Use the english word logo if no alt text is provided
        var altText = logoInfo.altText ? logoInfo.altText : 'logo';
        var logo = external_react_["createElement"](LogoImgEl, { src: logoInfo.url, style: {
                backgroundColor: logoInfo.backgroundColor
            }, alt: altText });
        return external_react_["createElement"](LogoWrap, null, logoHref ? styled_elements_LinkWrap(logoHref)(logo) : logo);
    };
    ApiLogo = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ApiLogo);
    return ApiLogo;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Markdown/AdvancedMarkdown.tsx






var AdvancedMarkdown_AdvancedMarkdown = /** @class */ (function (_super) {
    external_tslib_["__extends"](AdvancedMarkdown, _super);
    function AdvancedMarkdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdvancedMarkdown.prototype.render = function () {
        var _this = this;
        return external_react_["createElement"](OptionsConsumer, null, function (options) { return external_react_["createElement"](Consumer, null, function (store) { return _this.renderWithOptionsAndStore(options, store); }); });
    };
    AdvancedMarkdown.prototype.renderWithOptionsAndStore = function (options, store) {
        var _a = this.props, source = _a.source, _b = _a.htmlWrap, htmlWrap = _b === void 0 ? function (i) { return i; } : _b;
        if (!store) {
            throw new Error('When using componentes in markdown, store prop must be provided');
        }
        var renderer = new MarkdownRenderer_MarkdownRenderer(options);
        var parts = renderer.renderMdWithComponents(source);
        if (!parts.length) {
            return null;
        }
        return parts.map(function (part, idx) {
            if (typeof part === 'string') {
                return external_react_["cloneElement"](htmlWrap(external_react_["createElement"](SanitizedMarkdownHTML, { html: part, inline: false, compact: false })), {
                    key: idx
                });
            }
            return external_react_["createElement"](part.component, external_tslib_["__assign"]({ key: idx }, external_tslib_["__assign"]({}, part.props, part.propsSelector(store))));
        });
    };
    return AdvancedMarkdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SecurityRequirement/SecurityRequirement.tsx

// import { transparentize } from 'polished';




var ScopeName = styled_components.code.withConfig({
    componentId: "zmmjx2-0"
})(["font-size:", ";font-family:", ";border:1px solid ", ";margin:0 3px;padding:0.2em;display:inline-block;line-height:1;&:after{content:',';}&:last-child:after{content:none;}"], function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.typography.code.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.colors.border.dark;
});
var SecurityRequirementAndWrap = styled_components.span.withConfig({
    componentId: "zmmjx2-1"
})(["&:after{content:' AND ';font-weight:bold;}&:last-child:after{content:none;}", ";"], linksCss);
var SecurityRequirementOrWrap = styled_components.span.withConfig({
    componentId: "zmmjx2-2"
})(["&:before{content:'( ';font-weight:bold;}&:after{content:' ) OR ';font-weight:bold;}&:last-child:after{content:' )';}&:only-child:before,&:only-child:after{content:none;}", ";"], linksCss);
var SecurityRequirement_SecurityRequirement = /** @class */ (function (_super) {
    external_tslib_["__extends"](SecurityRequirement, _super);
    function SecurityRequirement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityRequirement.prototype.render = function () {
        var security = this.props.security;
        return external_react_["createElement"](SecurityRequirementOrWrap, null, security.schemes.map(function (scheme) {
            return external_react_["createElement"](SecurityRequirementAndWrap, { key: scheme.id },
                external_react_["createElement"](linkify_Link, { to: scheme.sectionId }, scheme.id),
                scheme.scopes.length > 0 && ' (',
                scheme.scopes.map(function (scope) { return external_react_["createElement"](ScopeName, { key: scope }, scope); }),
                scheme.scopes.length > 0 && ') ');
        }));
    };
    return SecurityRequirement;
}(external_react_["PureComponent"]));

var AuthHeaderColumn = styled_components.div.withConfig({
    componentId: "zmmjx2-3"
})(["flex:1;"]);
var SecuritiesColumn = styled_components.div.withConfig({
    componentId: "zmmjx2-4"
})(["width:", ";"], function (props) { return props.theme.schema.defaultDetailsWidth; });
var AuthHeader = styled_components(UnderlinedHeader).withConfig({
    componentId: "zmmjx2-5"
})(["display:inline-block;margin:0;"]);
var SecurityRequirement_Wrap = styled_components.div.withConfig({
    componentId: "zmmjx2-6"
})(["width:100%;display:flex;margin:1em 0;"]);
var SecurityRequirement_SecurityRequirements = /** @class */ (function (_super) {
    external_tslib_["__extends"](SecurityRequirements, _super);
    function SecurityRequirements() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityRequirements.prototype.render = function () {
        var securities = this.props.securities;
        if (!securities.length) {
            return null;
        }
        return external_react_["createElement"](SecurityRequirement_Wrap, null,
            external_react_["createElement"](AuthHeaderColumn, null,
                external_react_["createElement"](AuthHeader, null, "Authorizations: ")),
            external_react_["createElement"](SecuritiesColumn, null, securities.map(function (security, idx) { return external_react_["createElement"](SecurityRequirement_SecurityRequirement, { key: idx, security: security }); })));
    };
    return SecurityRequirements;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/SelectOnClick/SelectOnClick.tsx



var SelectOnClick_SelectOnClick = /** @class */ (function (_super) {
    external_tslib_["__extends"](SelectOnClick, _super);
    function SelectOnClick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function () {
            ClipboardService.selectElement(_this.child);
        };
        return _this;
    }
    SelectOnClick.prototype.render = function () {
        var _this = this;
        var children = this.props.children;
        return external_react_["createElement"]("div", { ref: function (el) { return _this.child = el; }, onClick: this.handleClick }, children);
    };
    return SelectOnClick;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Endpoint/styled.elements.ts

var OperationEndpointWrap = styled_components.div.withConfig({
    componentId: "nrhuz6-0"
})(["cursor:pointer;position:relative;margin-bottom:5px;margin-top:20px;"]);
var ServerRelativeURL = styled_components.span.withConfig({
    componentId: "nrhuz6-1"
})(["font-family:", ";margin-left:10px;text-overflow:ellipsis;"], function (props) { return props.theme.typography.headings.fontFamily; });
var EndpointInfo = styled_components.div.withConfig({
    componentId: "nrhuz6-2"
})(["margin-top:-15px;padding:10px 30px 10px ", ";border-radius:", ";background-color:", ";display:flex;white-space:nowrap;align-items:center;border:", ";border-bottom:", ";border-radius:4px;transition:border-color 0.25s ease;width:fit-content;", " .", "{color:", "}"], function (props) { return props.inverted ? '10px' : '20px'; }, function (props) { return props.inverted ? '0' : '4px 4px 0 0'; }, function (props) { return props.theme.codeSample.backgroundColor; }, function (props) { return props.inverted ? '0' : '1px solid transparent'; }, function (props) { return props.inverted ? '1px solid #ccc' : '0'; }, function (props) { return props.expanded && !props.inverted && "border-color: " + props.theme.colors.border.dark + ";" || ''; }, ServerRelativeURL, function (props) { return props.inverted ? props.theme.colors.text.primary : '#ffffff'; });
var HttpVerb = styled_components.span.attrs(function (props) { return ({
    className: "http-verb " + props.type
}); }).withConfig({
    componentId: "nrhuz6-3"
})(["font-size:0.929em;line-height:20px;background-color:", ";color:#ffffff;padding:3px 10px;text-transform:uppercase;font-family:", ";margin:0;"], function (props) { return props.theme.colors.http[props.type] || '#999999'; }, function (props) { return props.theme.typography.headings.fontFamily; });
var ServersOverlay = styled_components.div.withConfig({
    componentId: "nrhuz6-4"
})(["position:absolute;width:fit-content;z-index:100;background:#fafafa;color:#263238;box-sizing:border-box;box-shadow:0px 2px 2px rgba(0,0,0,0.33);overflow:hidden;border-bottom-left-radius:4px;border-bottom-right-radius:4px;transition:all 0.25s ease;", ""], function (props) { return props.expanded ? '' : 'transform: translateY(-50%) scaleY(0);'; });
var ServerItem = styled_components.div.withConfig({
    componentId: "nrhuz6-5"
})(["padding:10px;"]);
var ServerUrl = styled_components.div.withConfig({
    componentId: "nrhuz6-6"
})(["padding:5px;border:1px solid #ccc;background:#fff;word-break:break-all;color:", ";> span{color:", ";}"], function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.text.primary; });

// CONCATENATED MODULE: ./src/components/Endpoint/Endpoint.tsx








var Endpoint_Endpoint = /** @class */ (function (_super) {
    external_tslib_["__extends"](Endpoint, _super);
    function Endpoint(props) {
        var _this = _super.call(this, props) || this;
        _this.toggle = function () {
            _this.setState({
                expanded: !_this.state.expanded
            });
        };
        _this.state = {
            expanded: false
        };
        return _this;
    }
    Endpoint.prototype.render = function () {
        var _this = this;
        var _a = this.props, operation = _a.operation, inverted = _a.inverted, hideHostname = _a.hideHostname;
        var expanded = this.state.expanded; // TODO: highlight server variables, e.g. https://{user}.test.com
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](OperationEndpointWrap, null,
            external_react_["createElement"](EndpointInfo, { onClick: _this.toggle, expanded: expanded, inverted: inverted },
                external_react_["createElement"](HttpVerb, { type: operation.httpVerb },
                    " ",
                    operation.httpVerb),
                ' ',
                external_react_["createElement"](ServerRelativeURL, null, operation.path),
                external_react_["createElement"](ShelfIcon, { float: 'right', color: inverted ? 'black' : 'white', size: '20px', direction: expanded ? 'up' : 'down', style: {
                        marginRight: '-25px'
                    } })),
            external_react_["createElement"](ServersOverlay, { expanded: expanded }, operation.servers.map(function (server) { return external_react_["createElement"](ServerItem, { key: server.url },
                external_react_["createElement"](Markdown_Markdown, { source: server.description || '', compact: true }),
                external_react_["createElement"](SelectOnClick_SelectOnClick, null,
                    external_react_["createElement"](ServerUrl, null,
                        external_react_["createElement"]("span", null, hideHostname || options.hideHostname ? getBasePath(server.url) : server.url),
                        operation.path))); }))); });
    };
    return Endpoint;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/DropdownOrLabel/DropdownOrLabel.tsx



function DropdownOrLabel(props) {
    var _a = props.Label, Label = _a === void 0 ? MimeLabel : _a, _b = props.Dropdown, Dropdown = _b === void 0 ? SimpleDropdown : _b;
    if (props.options.length === 1) {
        return external_react_["createElement"](Label, null, props.options[0].label);
    }
    return external_react_["createElement"](Dropdown, external_tslib_["__assign"]({}, props));
}

// CONCATENATED MODULE: ./src/common-elements/fields.ts




var ClickablePropertyNameCell = styled_components(PropertyNameCell).withConfig({
    componentId: "sc-1noysbl-0"
})(["cursor:pointer;", "{height:", ";width:", ";polygon{fill:", ";}}"], ShelfIcon, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.color;
});
var FieldLabel = styled_components.span.withConfig({
    componentId: "sc-1noysbl-1"
})(["vertical-align:middle;font-size:0.929em;line-height:20px;"]);
var TypePrefix = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-2"
})(["color:", ";"], function (props) { return Object(external_polished_["transparentize"])(0.2, props.theme.schema.typeNameColor); });
var TypeName = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-3"
})(["color:", ";"], function (props) { return props.theme.schema.typeNameColor; });
var TypeTitle = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-4"
})(["color:", ";"], function (props) { return props.theme.schema.typeTitleColor; });
var TypeFormat = TypeName;
var OptionalLabel = styled_components(FieldLabel.withComponent('div')).withConfig({
    componentId: "sc-1noysbl-5"
})(["color:", ";font-size:", ";font-weight:normal;margin-left:20px;line-height:1;"], function (props) { return props.theme.schema.optionalLabelColor; }, function (props) { return props.theme.schema.labelsTextSize; });
var RecursiveLabel = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-6"
})(["color:", ";font-size:13px;"], function (_a) {
    var theme = _a.theme;
    return theme.colors.warning.main;
});
var NullableLabel = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-7"
})(["color:#3195a6;font-size:13px;"]);
var PatternLabel = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-8"
})(["color:#3195a6;&::before,&::after{content:'/';font-weight:bold;}"]);
var ExampleValue = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-9"
})(["border-radius:2px;", ";& + &{margin-left:0;}", ";"], function (_a) {
    var theme = _a.theme;
    return "\n    background-color: " + Object(external_polished_["transparentize"])(0.95, theme.colors.text.primary) + ";\n    color: " + Object(external_polished_["transparentize"])(0.1, theme.colors.text.primary) + ";\n\n    margin: " + theme.spacing.unit + "px;\n    padding: 0 " + theme.spacing.unit + "px;\n    border: 1px solid " + Object(external_polished_["transparentize"])(0.9, theme.colors.text.primary) + ";\n}";
}, extensionsHook('ExampleValue'));
var ConstraintItem = styled_components(FieldLabel).withConfig({
    componentId: "sc-1noysbl-10"
})(["border-radius:2px;", ";& + &{margin-left:0;}", ";"], function (_a) {
    var theme = _a.theme;
    return "\n    background-color: " + Object(external_polished_["transparentize"])(0.95, theme.colors.primary.light) + ";\n    color: " + Object(external_polished_["transparentize"])(0.1, theme.colors.primary.main) + ";\n\n    margin: 0 " + theme.spacing.unit + "px;\n    padding: 0 " + theme.spacing.unit + "px;\n    border: 1px solid " + Object(external_polished_["transparentize"])(0.9, theme.colors.primary.main) + ";\n}";
}, extensionsHook('ConstraintItem'));

// CONCATENATED MODULE: ./src/components/Fields/EnumValues.tsx



var EnumValues_EnumValues = /** @class */ (function (_super) {
    external_tslib_["__extends"](EnumValues, _super);
    function EnumValues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnumValues.prototype.render = function () {
        var _a = this.props, values = _a.values, type = _a.type;
        if (!values.length) {
            return null;
        }
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](FieldLabel, null,
                type === 'array' ? 'Items' : '',
                " ",
                values.length === 1 ? 'Value' : 'Enum',
                ":"),
            values.map(function (value, idx) { return external_react_["createElement"](ExampleValue, { key: idx },
                JSON.stringify(value),
                " "); }));
    };
    return EnumValues;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/Extensions.tsx





var Extension = styled_components(StyledMarkdownBlock).withConfig({
    componentId: "sc-12fpph1-0"
})(["opacity:0.9;margin:2px 0;"]);
var ExtensionLable = styled_components.span.withConfig({
    componentId: "sc-12fpph1-1"
})(["font-style:italic;"]);
var Extensions_Extensions = /** @class */ (function (_super) {
    external_tslib_["__extends"](Extensions, _super);
    function Extensions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Extensions.prototype.render = function () {
        var _this = this;
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](external_react_["Fragment"], null, options.showExtensions && Object.keys(_this.props.extensions).map(function (key) { return external_react_["createElement"](Extension, { key: key },
            external_react_["createElement"](ExtensionLable, null, key),
            ":",
            ' ',
            external_react_["createElement"]("code", null, JSON.stringify(_this.props.extensions[key]))); })); });
    };
    return Extensions;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/FieldContstraints.tsx



var FieldContstraints_ConstraintsView = /** @class */ (function (_super) {
    external_tslib_["__extends"](ConstraintsView, _super);
    function ConstraintsView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConstraintsView.prototype.render = function () {
        if (this.props.constraints.length === 0) {
            return null;
        }
        return external_react_["createElement"]("span", null,
            ' ',
            this.props.constraints.map(function (constraint) { return external_react_["createElement"](ConstraintItem, { key: constraint },
                " ",
                constraint,
                " "); }));
    };
    return ConstraintsView;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/FieldDetail.tsx



var FieldDetail_FieldDetail = /** @class */ (function (_super) {
    external_tslib_["__extends"](FieldDetail, _super);
    function FieldDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldDetail.prototype.render = function () {
        if (this.props.value === undefined) {
            return null;
        }
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](FieldLabel, null,
                " ",
                this.props.label,
                " "),
            ' ',
            external_react_["createElement"](ExampleValue, null,
                " ",
                JSON.stringify(this.props.value),
                " "));
    };
    return FieldDetail;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/FieldDetails.tsx










var FieldDetails_FieldDetails = /** @class */ (function (_super) {
    external_tslib_["__extends"](FieldDetails, _super);
    function FieldDetails() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldDetails.prototype.render = function () {
        var _a = this.props, showExamples = _a.showExamples, field = _a.field, renderDiscriminatorSwitch = _a.renderDiscriminatorSwitch;
        var schema = field.schema, description = field.description, example = field.example, deprecated = field.deprecated;
        return external_react_["createElement"]("div", null,
            external_react_["createElement"]("div", null,
                external_react_["createElement"](TypePrefix, null, schema.typePrefix),
                external_react_["createElement"](TypeName, null, schema.displayType),
                schema.displayFormat && external_react_["createElement"](TypeFormat, null,
                    ' ',
                    "<",
                    schema.displayFormat,
                    ">",
                    ' '),
                schema.title && external_react_["createElement"](TypeTitle, null,
                    " (",
                    schema.title,
                    ") "),
                external_react_["createElement"](FieldContstraints_ConstraintsView, { constraints: schema.constraints }),
                schema.nullable && external_react_["createElement"](NullableLabel, null, " Nullable "),
                schema.pattern && external_react_["createElement"](PatternLabel, null, schema.pattern),
                schema.isCircular && external_react_["createElement"](RecursiveLabel, null, " Recursive ")),
            deprecated && external_react_["createElement"]("div", null,
                external_react_["createElement"](Badge, { type: "warning" }, " Deprecated ")),
            external_react_["createElement"](FieldDetail_FieldDetail, { label: 'Default:', value: schema.default }),
            !renderDiscriminatorSwitch && external_react_["createElement"](EnumValues_EnumValues, { type: schema.type, values: schema.enum }),
            ' ',
            showExamples && external_react_["createElement"](FieldDetail_FieldDetail, { label: 'Example:', value: example }),
            external_react_["createElement"](Extensions_Extensions, { extensions: external_tslib_["__assign"]({}, field.extensions, schema.extensions) }),
            external_react_["createElement"]("div", null,
                external_react_["createElement"](Markdown_Markdown, { compact: true, source: description })),
            schema.externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: schema.externalDocs, compact: true }),
            renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props) || null);
    };
    return FieldDetails;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Schema/ArraySchema.tsx





var PaddedSchema = styled_components.div.withConfig({
    componentId: "sc-71zhzb-0"
})(["padding-left:", "px;"], function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit * 2;
});
var ArraySchema_ArraySchema = /** @class */ (function (_super) {
    external_tslib_["__extends"](ArraySchema, _super);
    function ArraySchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArraySchema.prototype.render = function () {
        var itemsSchema = this.props.schema.items;
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](ArrayOpenningLabel, null, " Array "),
            external_react_["createElement"](PaddedSchema, null,
                external_react_["createElement"](Schema_Schema, external_tslib_["__assign"]({}, this.props, { schema: itemsSchema }))),
            external_react_["createElement"](ArrayClosingLabel, null));
    };
    return ArraySchema;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Schema/DiscriminatorDropdown.tsx




var DiscriminatorDropdown_DiscriminatorDropdown = /** @class */ (function (_super) {
    external_tslib_["__extends"](DiscriminatorDropdown, _super);
    function DiscriminatorDropdown() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.changeActiveChild = function (_a) {
            var value = _a.value;
            var idx = parseInt(value, 10);
            _this.props.parent.activateOneOf(idx);
        };
        return _this;
    }
    DiscriminatorDropdown.prototype.sortOptions = function (options, enumValues) {
        if (enumValues.length === 0) {
            return;
        }
        var enumOrder = {};
        enumValues.forEach(function (enumItem, idx) {
            enumOrder[enumItem] = idx;
        });
        options.sort(function (a, b) {
            return enumOrder[a.label] > enumOrder[b.label] ? 1 : -1;
        });
    };
    DiscriminatorDropdown.prototype.render = function () {
        var _a = this.props, parent = _a.parent, enumValues = _a.enumValues;
        if (parent.oneOf === undefined) {
            return null;
        }
        var options = parent.oneOf.map(function (subSchema, idx) {
            return {
                value: idx.toString(),
                label: subSchema.title
            };
        });
        var activeItem = options[parent.activeOneOf];
        this.sortOptions(options, enumValues);
        return external_react_["createElement"](StyledDropdown, { value: activeItem, options: options, onChange: this.changeActiveChild });
    };
    DiscriminatorDropdown = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], DiscriminatorDropdown);
    return DiscriminatorDropdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/ObjectSchema.tsx







var ObjectSchema_ObjectSchema = /** @class */ (function (_super) {
    external_tslib_["__extends"](ObjectSchema, _super);
    function ObjectSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ObjectSchema.prototype, "parentSchema", {
        get: function () {
            return this.props.discriminator.parentSchema;
        },
        enumerable: true,
        configurable: true
    });
    ObjectSchema.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.schema.fields, fields = _b === void 0 ? [] : _b, showTitle = _a.showTitle, discriminator = _a.discriminator;
        var needFilter = this.props.skipReadOnly || this.props.skipWriteOnly;
        var filteredFields = needFilter ? fields.filter(function (item) {
            return _this.props.skipReadOnly && !item.schema.readOnly || _this.props.skipWriteOnly && !item.schema.writeOnly;
        }) : fields;
        return external_react_["createElement"](PropertiesTable, null,
            showTitle && external_react_["createElement"](PropertiesTableCaption, null, this.props.schema.title),
            external_react_["createElement"]("tbody", null, mapWithLast(filteredFields, function (field, isLast) {
                return external_react_["createElement"](Field_Field, { key: field.name, isLast: isLast, field: field, renderDiscriminatorSwitch: discriminator && discriminator.fieldName === field.name && (function () { return external_react_["createElement"](DiscriminatorDropdown_DiscriminatorDropdown, { parent: _this.parentSchema, enumValues: field.schema.enum }); }) || undefined, className: field.expanded ? 'expanded' : undefined, showExamples: false, skipReadOnly: _this.props.skipReadOnly, skipWriteOnly: _this.props.skipWriteOnly, showTitle: _this.props.showTitle });
            })));
    };
    ObjectSchema = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ObjectSchema);
    return ObjectSchema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/OneOfSchema.tsx





var OneOfSchema_OneOfButton = /** @class */ (function (_super) {
    external_tslib_["__extends"](OneOfButton, _super);
    function OneOfButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activateOneOf = function () {
            _this.props.schema.activateOneOf(_this.props.idx);
        };
        return _this;
    }
    OneOfButton.prototype.render = function () {
        var _a = this.props, idx = _a.idx, schema = _a.schema, subSchema = _a.subSchema;
        return external_react_["createElement"](schema_OneOfButton, { active: idx === schema.activeOneOf, onClick: this.activateOneOf }, subSchema.title || subSchema.typePrefix + subSchema.displayType);
    };
    OneOfButton = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], OneOfButton);
    return OneOfButton;
}(external_react_["Component"]));

var OneOfSchema_OneOfSchema = /** @class */ (function (_super) {
    external_tslib_["__extends"](OneOfSchema, _super);
    function OneOfSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OneOfSchema.prototype.render = function () {
        var _a = this.props, oneOf = _a.schema.oneOf, schema = _a.schema;
        if (oneOf === undefined) {
            return null;
        }
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](OneOfLabel, null,
                " ",
                schema.oneOfType,
                " "),
            external_react_["createElement"](OneOfList, null, oneOf.map(function (subSchema, idx) { return external_react_["createElement"](OneOfSchema_OneOfButton, { key: subSchema.pointer, schema: schema, subSchema: subSchema, idx: idx }); })),
            external_react_["createElement"](Schema_Schema, external_tslib_["__assign"]({}, this.props, { schema: oneOf[schema.activeOneOf] })));
    };
    OneOfSchema = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], OneOfSchema);
    return OneOfSchema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/Schema.tsx








var Schema_Schema = /** @class */ (function (_super) {
    external_tslib_["__extends"](Schema, _super);
    function Schema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Schema.prototype.render = function () {
        var schema = this.props.schema;
        if (!schema) {
            return external_react_["createElement"]("em", null, " Schema not provided ");
        }
        var type = schema.type, oneOf = schema.oneOf, discriminatorProp = schema.discriminatorProp, isCircular = schema.isCircular;
        if (isCircular) {
            return external_react_["createElement"]("div", null,
                external_react_["createElement"](TypeName, null, schema.displayType),
                schema.title && external_react_["createElement"](TypeTitle, null,
                    " ",
                    schema.title,
                    " "),
                external_react_["createElement"](RecursiveLabel, null, " Recursive "));
        }
        if (discriminatorProp !== undefined) {
            if (!oneOf || !oneOf.length) {
                throw new Error("Looks like you are using discriminator wrong: you don't have any definition inherited from the " + schema.title);
            }
            return external_react_["createElement"](ObjectSchema_ObjectSchema, external_tslib_["__assign"]({}, external_tslib_["__assign"]({}, this.props, { schema: oneOf[schema.activeOneOf] }), { discriminator: {
                    fieldName: discriminatorProp,
                    parentSchema: schema
                } }));
        }
        if (oneOf !== undefined) {
            return external_react_["createElement"](OneOfSchema_OneOfSchema, external_tslib_["__assign"]({ schema: schema }, this.props));
        }
        switch (type) {
            case 'object':
                return external_react_["createElement"](ObjectSchema_ObjectSchema, external_tslib_["__assign"]({}, this.props));
            case 'array':
                return external_react_["createElement"](ArraySchema_ArraySchema, external_tslib_["__assign"]({}, this.props));
        } // TODO: maybe adjust FieldDetails to accept schema
        var field = {
            schema: schema,
            name: '',
            required: false,
            description: schema.description,
            externalDocs: schema.externalDocs,
            deprecated: false,
            toggle: function () { return null; },
            expanded: false
        }; // cast needed for hot-loader to not fail
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](FieldDetails_FieldDetails, { field: field }));
    };
    Schema = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], Schema);
    return Schema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Fields/Field.tsx








var Field_Field = /** @class */ (function (_super) {
    external_tslib_["__extends"](Field, _super);
    function Field() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggle = function () {
            _this.props.field.toggle();
        };
        return _this;
    }
    Field.prototype.render = function () {
        var _a = this.props, className = _a.className, field = _a.field, isLast = _a.isLast;
        var name = field.name, expanded = field.expanded, deprecated = field.deprecated, required = field.required, kind = field.kind;
        var withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;
        var paramName = withSubSchema ? external_react_["createElement"](ClickablePropertyNameCell, { onClick: this.toggle, className: deprecated ? 'deprecated' : '', kind: kind, title: name },
            external_react_["createElement"](PropertyBullet, null),
            name,
            external_react_["createElement"](ShelfIcon, { direction: expanded ? 'down' : 'right' }),
            !required && external_react_["createElement"](OptionalLabel, null, " optional ")) : external_react_["createElement"](PropertyNameCell, { className: deprecated ? 'deprecated' : undefined, kind: kind, title: name },
            external_react_["createElement"](PropertyBullet, null),
            name,
            !required && external_react_["createElement"](OptionalLabel, null, " optional "));
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"]("tr", { className: isLast ? 'last ' + className : className },
                paramName,
                external_react_["createElement"](PropertyDetailsCell, null,
                    external_react_["createElement"](FieldDetails_FieldDetails, external_tslib_["__assign"]({}, this.props)))),
            field.expanded && withSubSchema && external_react_["createElement"]("tr", { key: field.name + 'inner' },
                external_react_["createElement"](PropertyCellWithInner, { colSpan: 2 },
                    external_react_["createElement"](InnerPropertiesWrap, null,
                        external_react_["createElement"](Schema_Schema, { schema: field.schema, skipReadOnly: this.props.skipReadOnly, skipWriteOnly: this.props.skipWriteOnly, showTitle: this.props.showTitle })))));
    };
    Field = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], Field);
    return Field;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Parameters/ParametersGroup.tsx






var ParametersGroup_ParametersGroup = /** @class */ (function (_super) {
    external_tslib_["__extends"](ParametersGroup, _super);
    function ParametersGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParametersGroup.prototype.render = function () {
        var _a = this.props, place = _a.place, parameters = _a.parameters;
        if (!parameters || !parameters.length) {
            return null;
        }
        return external_react_["createElement"]("div", { key: place },
            external_react_["createElement"](UnderlinedHeader, null,
                place,
                " Parameters"),
            external_react_["createElement"](PropertiesTable, null,
                external_react_["createElement"]("tbody", null, mapWithLast(parameters, function (field, isLast) { return external_react_["createElement"](Field_Field, { key: field.name, isLast: isLast, field: field, showExamples: true }); }))));
    };
    return ParametersGroup;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/MediaTypeSwitch/MediaTypesSwitch.tsx



var MediaTypesSwitch_MediaTypesSwitch = /** @class */ (function (_super) {
    external_tslib_["__extends"](MediaTypesSwitch, _super);
    function MediaTypesSwitch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.switchMedia = function (_a) {
            var value = _a.value;
            if (_this.props.content) {
                _this.props.content.activate(parseInt(value, 10));
            }
        };
        return _this;
    }
    MediaTypesSwitch.prototype.render = function () {
        var content = this.props.content;
        if (!content || !content.mediaTypes || !content.mediaTypes.length) {
            return null;
        }
        var activeMimeIdx = content.activeMimeIdx;
        var options = content.mediaTypes.map(function (mime, idx) {
            return {
                label: mime.name,
                value: idx.toString()
            };
        });
        return external_react_["createElement"](external_react_["Fragment"], null,
            this.props.renderDropdown({
                value: options[activeMimeIdx],
                options: options,
                onChange: this.switchMedia
            }),
            this.props.children(content.active));
    };
    MediaTypesSwitch = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], MediaTypesSwitch);
    return MediaTypesSwitch;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/index.ts






// CONCATENATED MODULE: ./src/components/Parameters/Parameters.tsx







function safePush(obj, prop, item) {
    if (!obj[prop]) {
        obj[prop] = [];
    }
    obj[prop].push(item);
}
var PARAM_PLACES = ['path', 'query', 'cookie', 'header'];
var Parameters_Parameters = /** @class */ (function (_super) {
    external_tslib_["__extends"](Parameters, _super);
    function Parameters() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parameters.prototype.orderParams = function (params) {
        var res = {};
        params.forEach(function (param) {
            safePush(res, param.in, param);
        });
        return res;
    };
    Parameters.prototype.render = function () {
        var _a = this.props, body = _a.body, _b = _a.parameters, parameters = _b === void 0 ? [] : _b;
        if (body === undefined && parameters === undefined) {
            return null;
        }
        var paramsMap = this.orderParams(parameters);
        var paramsPlaces = parameters.length > 0 ? PARAM_PLACES : [];
        var bodyContent = body && body.content;
        return external_react_["createElement"]("div", null,
            paramsPlaces.map(function (place) { return external_react_["createElement"](ParametersGroup_ParametersGroup, { key: place, place: place, parameters: paramsMap[place] }); }),
            bodyContent && external_react_["createElement"](BodyContent, { content: bodyContent }));
    };
    return Parameters;
}(external_react_["PureComponent"]));

function DropdownWithinHeader(props) {
    return external_react_["createElement"](UnderlinedHeader, { key: "header" },
        "Request Body schema: ",
        external_react_["createElement"](DropdownOrLabel, external_tslib_["__assign"]({}, props)));
}
function BodyContent(props) {
    var content = props.content;
    return external_react_["createElement"](MediaTypesSwitch_MediaTypesSwitch, { content: content, renderDropdown: DropdownWithinHeader }, function (_a) {
        var schema = _a.schema;
        return external_react_["createElement"](Schema_Schema, { skipReadOnly: true, key: "schema", schema: schema });
    });
}

// CONCATENATED MODULE: ./src/common-elements/Tooltip.tsx



var Wrapper = styled_components.div.withConfig({
    componentId: "t0v3fg-0"
})(["position:relative;"]);
var Tip = styled_components.div.withConfig({
    componentId: "t0v3fg-1"
})(["position:absolute;min-width:80px;max-width:500px;background:#fff;bottom:100%;left:50%;margin-bottom:10px;transform:translateX(-50%);border-radius:4px;padding:0.3em 0.6em;text-align:center;box-shadow:0px 0px 5px 0px rgba(204,204,204,1);"]);
var Content = styled_components.div.withConfig({
    componentId: "t0v3fg-2"
})(["background:#fff;color:#000;display:inline;font-size:0.85em;white-space:nowrap;"]);
var Arrow = styled_components.div.withConfig({
    componentId: "t0v3fg-3"
})(["position:absolute;width:0;height:0;bottom:-5px;left:50%;margin-left:-5px;border-left:solid transparent 5px;border-right:solid transparent 5px;border-top:solid #bbb 5px;"]);
var Gap = styled_components.div.withConfig({
    componentId: "t0v3fg-4"
})(["position:absolute;width:100%;height:20px;bottom:-20px;"]);
var Tooltip_Tooltip = /** @class */ (function (_super) {
    external_tslib_["__extends"](Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, open = _a.open, title = _a.title, children = _a.children;
        return external_react_["createElement"](Wrapper, null,
            children,
            open && external_react_["createElement"](Tip, null,
                external_react_["createElement"](Content, null, title),
                external_react_["createElement"](Arrow, null),
                external_react_["createElement"](Gap, null)));
    };
    return Tooltip;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/common-elements/CopyButtonWrapper.tsx




var CopyButtonWrapper_CopyButtonWrapper = /** @class */ (function (_super) {
    external_tslib_["__extends"](CopyButtonWrapper, _super);
    function CopyButtonWrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.copy = function () {
            var content = typeof _this.props.data === 'string' ? _this.props.data : JSON.stringify(_this.props.data, null, 2);
            ClipboardService.copyCustom(content);
            _this.showTooltip();
        };
        _this.renderCopyButton = function () {
            return external_react_["createElement"]("span", { onClick: _this.copy },
                external_react_["createElement"](Tooltip_Tooltip, { title: ClipboardService.isSupported() ? 'Copied' : 'Not supported in your browser', open: _this.state.tooltipShown }, "Copy"));
        };
        _this.state = {
            tooltipShown: false
        };
        return _this;
    }
    CopyButtonWrapper.prototype.render = function () {
        return this.props.children({
            renderCopyButton: this.renderCopyButton
        });
    };
    CopyButtonWrapper.prototype.showTooltip = function () {
        var _this = this;
        this.setState({
            tooltipShown: true
        });
        setTimeout(function () {
            _this.setState({
                tooltipShown: false
            });
        }, 1500);
    };
    return CopyButtonWrapper;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/utils/jsonToHtml.ts
var jsonToHtml_level = 1;
var COLLAPSE_LEVEL = 2;
function jsonToHTML(json) {
    jsonToHtml_level = 1;
    var output = '';
    output += '<div class="redoc-json">';
    output += valueToHTML(json);
    output += '</div>';
    return output;
}
function htmlEncode(t) {
    return t !== undefined ? t.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}
function decorateWithSpan(value, className) {
    return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}
function punctuation(val) {
    return '<span class="token punctuation">' + val + '</span>';
}
function valueToHTML(value) {
    var valueType = typeof value;
    var output = '';
    if (value === undefined || value === null) {
        output += decorateWithSpan('null', 'token keyword');
    }
    else if (value && value.constructor === Array) {
        jsonToHtml_level++;
        output += arrayToHTML(value);
        jsonToHtml_level--;
    }
    else if (value && value.constructor === Date) {
        output += decorateWithSpan('"' + value.toISOString() + '"', 'token string');
    }
    else if (valueType === 'object') {
        jsonToHtml_level++;
        output += objectToHTML(value);
        jsonToHtml_level--;
    }
    else if (valueType === 'number') {
        output += decorateWithSpan(value, 'token number');
    }
    else if (valueType === 'string') {
        if (/^(http|https):\/\/[^\s]+$/.test(value)) {
            output += decorateWithSpan('"', 'token string') + '<a href="' + value + '">' + htmlEncode(value) + '</a>' + decorateWithSpan('"', 'token string');
        }
        else {
            output += decorateWithSpan('"' + value + '"', 'token string');
        }
    }
    else if (valueType === 'boolean') {
        output += decorateWithSpan(value, 'token boolean');
    }
    return output;
}
function arrayToHTML(json) {
    var collapsed = jsonToHtml_level > COLLAPSE_LEVEL ? 'collapsed' : '';
    var output = "<div class=\"collapser\"></div>" + punctuation('[') + "<span class=\"ellipsis\"></span><ul class=\"array collapsible\">";
    var hasContents = false;
    var length = json.length;
    for (var i = 0; i < length; i++) {
        hasContents = true;
        output += '<li><div class="hoverable ' + collapsed + '">';
        output += valueToHTML(json[i]);
        if (i < length - 1) {
            output += ',';
        }
        output += '</div></li>';
    }
    output += "</ul>" + punctuation(']');
    if (!hasContents) {
        output = punctuation('[ ]');
    }
    return output;
}
function objectToHTML(json) {
    var collapsed = jsonToHtml_level > COLLAPSE_LEVEL ? 'collapsed' : '';
    var keys = Object.keys(json);
    var length = keys.length;
    var output = "<div class=\"collapser\"></div>" + punctuation('{') + "<span class=\"ellipsis\"></span><ul class=\"obj collapsible\">";
    var hasContents = false;
    for (var i = 0; i < length; i++) {
        var key = keys[i];
        hasContents = true;
        output += '<li><div class="hoverable ' + collapsed + '">';
        output += '<span class="property token string">"' + htmlEncode(key) + '"</span>: ';
        output += valueToHTML(json[key]);
        if (i < length - 1) {
            output += punctuation(',');
        }
        output += '</div></li>';
    }
    output += "</ul>" + punctuation('}');
    if (!hasContents) {
        output = punctuation('{ }');
    }
    return output;
}

// CONCATENATED MODULE: ./src/components/JsonViewer/style.ts

var jsonStyles = css([".redoc-json > .collapser{display:none;}.redoc-json{color:#c2c2c2;}font-family:", ";font-size:", ";white-space:", ";contain:content;overflow-x:auto;.callback-function{color:gray;}.collapser:after{content:'-';cursor:pointer;}.collapsed > .collapser:after{content:'+';cursor:pointer;}.ellipsis:after{content:' \u2026 ';}.collapsible{margin-left:2em;}.hoverable{padding-top:1px;padding-bottom:1px;padding-left:2px;padding-right:2px;border-radius:2px;}.hovered{background-color:rgba(235,238,249,1);}.collapser{padding-right:6px;padding-left:6px;}ul{list-style-type:none;padding:0px;margin:0px 0px 0px 26px;}li{position:relative;display:block;}.hoverable{display:inline-block;}.selected{outline-style:solid;outline-width:1px;outline-style:dotted;}.collapsed > .collapsible{display:none;}.ellipsis{display:none;}.collapsed > .ellipsis{display:inherit;}.collapser{position:absolute;top:1px;left:-1.5em;cursor:default;user-select:none;-webkit-user-select:none;}"], function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
});

// CONCATENATED MODULE: ./src/components/JsonViewer/JsonViewer.tsx








var JsonViewerWrap = styled_components.div.withConfig({
    componentId: "sc-1d3n1g3-0"
})(["&:hover > ", "{opacity:1;}"], SampleControls);
var JsonViewer_Json = /** @class */ (function (_super) {
    external_tslib_["__extends"](Json, _super);
    function Json() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderInner = function (_a) {
            var renderCopyButton = _a.renderCopyButton;
            return external_react_["createElement"](JsonViewerWrap, null,
                external_react_["createElement"](SampleControls, null,
                    renderCopyButton(),
                    external_react_["createElement"]("span", { onClick: _this.expandAll }, " Expand all "),
                    external_react_["createElement"]("span", { onClick: _this.collapseAll }, " Collapse all ")),
                external_react_["createElement"](PrismDiv, { className: _this.props.className, ref: function (node) { return _this.node = node; }, dangerouslySetInnerHTML: {
                        __html: jsonToHTML(_this.props.data)
                    } }));
        };
        _this.expandAll = function () {
            var elements = _this.node.getElementsByClassName('collapsible');
            for (var _i = 0, _a = Array.prototype.slice.call(elements); _i < _a.length; _i++) {
                var collapsed = _a[_i];
                collapsed.parentNode.classList.remove('collapsed');
            }
        };
        _this.collapseAll = function () {
            var elements = _this.node.getElementsByClassName('collapsible');
            for (var _i = 0, _a = Array.prototype.slice.call(elements); _i < _a.length; _i++) {
                var expanded = _a[_i];
                // const collapsed = elements[i];
                if (expanded.parentNode.classList.contains('redoc-json')) {
                    continue;
                }
                expanded.parentNode.classList.add('collapsed');
            }
        };
        _this.clickListener = function (event) {
            var collapsed;
            var target = event.target;
            if (target.className === 'collapser') {
                collapsed = target.parentElement.getElementsByClassName('collapsible')[0];
                if (collapsed.parentElement.classList.contains('collapsed')) {
                    collapsed.parentElement.classList.remove('collapsed');
                }
                else {
                    collapsed.parentElement.classList.add('collapsed');
                }
            }
        };
        return _this;
    }
    Json.prototype.render = function () {
        return external_react_["createElement"](CopyButtonWrapper_CopyButtonWrapper, { data: this.props.data }, this.renderInner);
    };
    Json.prototype.componentDidMount = function () {
        this.node.addEventListener('click', this.clickListener);
    };
    Json.prototype.componentWillUnmount = function () {
        this.node.removeEventListener('click', this.clickListener);
    };
    return Json;
}(external_react_["PureComponent"]));
var JsonViewer = styled_components(JsonViewer_Json).withConfig({
    componentId: "sc-1d3n1g3-1"
})(["", ";"], jsonStyles);

// CONCATENATED MODULE: ./src/components/SourceCode/SourceCode.tsx







var StyledPre = styled_components(PrismDiv.withComponent('pre')).withConfig({
    componentId: "sc-166mz29-0"
})(["font-family:", ";font-size:", ";overflow-x:auto;margin:0;white-space:", ";"], function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
});
var SourceCode_SourceCode = /** @class */ (function (_super) {
    external_tslib_["__extends"](SourceCode, _super);
    function SourceCode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SourceCode.prototype.render = function () {
        var _a = this.props, source = _a.source, lang = _a.lang;
        return external_react_["createElement"](StyledPre, { dangerouslySetInnerHTML: {
                __html: highlight(source, lang)
            } });
    };
    return SourceCode;
}(external_react_["PureComponent"]));

var SourceCode_SourceCodeWithCopy = /** @class */ (function (_super) {
    external_tslib_["__extends"](SourceCodeWithCopy, _super);
    function SourceCodeWithCopy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SourceCodeWithCopy.prototype.render = function () {
        var _this = this;
        return external_react_["createElement"](CopyButtonWrapper_CopyButtonWrapper, { data: this.props.source }, function (_a) {
            var renderCopyButton = _a.renderCopyButton;
            return external_react_["createElement"](SampleControlsWrap, null,
                external_react_["createElement"](SampleControls, null, renderCopyButton()),
                external_react_["createElement"](SourceCode_SourceCode, { lang: _this.props.lang, source: _this.props.source }));
        });
    };
    return SourceCodeWithCopy;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/PayloadSamples/styled.elements.ts


var styled_elements_MimeLabel = styled_components.div.withConfig({
    componentId: "futasu-0"
})(["border-bottom:1px solid #c2c2c2;margin:0 0 10px 0;display:block;"]);
var InvertedSimpleDropdown = styled_components(StyledDropdown).withConfig({
    componentId: "futasu-1"
})(["margin-left:10px;text-transform:none;font-size:0.929em;border-bottom:1px solid ", ";margin:0 0 10px 0;display:block;.Dropdown-control,.Dropdown-control:hover{font-size:1em;border:none;padding:0 1.2em 0 0;background:transparent;color:", ";box-shadow:none;.Dropdown-arrow{border-top-color:", ";}}.Dropdown-menu{margin:0;}"], function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
});
var NoSampleLabel = styled_components.div.withConfig({
    componentId: "futasu-2"
})(["font-family:", ";font-size:12px;color:#ee807f;"], function (props) { return props.theme.typography.code.fontFamily; });

// CONCATENATED MODULE: ./src/components/PayloadSamples/MediaTypeSamples.tsx







var MediaTypeSamples_MediaTypeSamples = /** @class */ (function (_super) {
    external_tslib_["__extends"](MediaTypeSamples, _super);
    function MediaTypeSamples() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MediaTypeSamples.prototype.render = function () {
        var examples = this.props.mediaType.examples || {};
        var mimeType = this.props.mediaType.name;
        var noSample = external_react_["createElement"](NoSampleLabel, null, "No sample");
        var sampleView = isJsonLike(mimeType) ? function (sample) { return external_react_["createElement"](JsonViewer, { data: sample }); } : function (sample) { return sample !== undefined && external_react_["createElement"](SourceCode_SourceCodeWithCopy, { lang: langFromMime(mimeType), source: sample }) || noSample; };
        var examplesNames = Object.keys(examples);
        if (examplesNames.length === 0) {
            return noSample;
        }
        if (examplesNames.length > 1) {
            return external_react_["createElement"](SmallTabs, { defaultIndex: 0 },
                external_react_["createElement"](external_react_tabs_["TabList"], null, examplesNames.map(function (name) { return external_react_["createElement"](external_react_tabs_["Tab"], { key: name },
                    " ",
                    examples[name].summary || name,
                    " "); })),
                examplesNames.map(function (name) { return external_react_["createElement"](external_react_tabs_["TabPanel"], { key: name }, sampleView(examples[name].value)); }));
        }
        else {
            var name_1 = examplesNames[0];
            return external_react_["createElement"]("div", null, sampleView(examples[name_1].value));
        }
    };
    return MediaTypeSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/PayloadSamples/PayloadSamples.tsx







var PayloadSamples_PayloadSamples = /** @class */ (function (_super) {
    external_tslib_["__extends"](PayloadSamples, _super);
    function PayloadSamples() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDropdown = function (props) {
            return external_react_["createElement"](DropdownOrLabel, external_tslib_["__assign"]({ Label: styled_elements_MimeLabel, Dropdown: InvertedSimpleDropdown }, props));
        };
        return _this;
    }
    PayloadSamples.prototype.render = function () {
        var mimeContent = this.props.content;
        if (mimeContent === undefined) {
            return null;
        }
        return external_react_["createElement"](MediaTypesSwitch_MediaTypesSwitch, { content: mimeContent, renderDropdown: this.renderDropdown }, function (mediaType) { return external_react_["createElement"](MediaTypeSamples_MediaTypeSamples, { key: "samples", mediaType: mediaType }); });
    };
    PayloadSamples = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], PayloadSamples);
    return PayloadSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/RequestSamples/RequestSamples.tsx






var RequestSamples_RequestSamples = /** @class */ (function (_super) {
    external_tslib_["__extends"](RequestSamples, _super);
    function RequestSamples() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RequestSamples.prototype.render = function () {
        var operation = this.props.operation;
        var requestBodyContent = operation.requestBody && operation.requestBody.content;
        var hasBodySample = requestBodyContent && requestBodyContent.hasSample;
        var samples = operation.codeSamples;
        var hasSamples = hasBodySample || samples.length > 0;
        return hasSamples && external_react_["createElement"]("div", null,
            external_react_["createElement"](RightPanelHeader, null, " Request samples "),
            samples.length > 0 ? external_react_["createElement"](Tabs, { defaultIndex: 0 },
                external_react_["createElement"](external_react_tabs_["TabList"], null,
                    hasBodySample && external_react_["createElement"](external_react_tabs_["Tab"], { key: "payload" }, " Payload "),
                    samples.map(function (sample) { return external_react_["createElement"](external_react_tabs_["Tab"], { key: sample.lang }, sample.label !== undefined ? sample.label : sample.lang); })),
                hasBodySample && external_react_["createElement"](external_react_tabs_["TabPanel"], { key: "payload" },
                    external_react_["createElement"]("div", null,
                        external_react_["createElement"](PayloadSamples_PayloadSamples, { content: requestBodyContent }))),
                samples.map(function (sample) { return external_react_["createElement"](external_react_tabs_["TabPanel"], { key: sample.lang },
                    external_react_["createElement"](SourceCode_SourceCodeWithCopy, { lang: sample.lang, source: sample.source })); })) : external_react_["createElement"]("div", null,
                external_react_["createElement"](PayloadSamples_PayloadSamples, { content: requestBodyContent }))) || null;
    };
    RequestSamples = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], RequestSamples);
    return RequestSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Responses/ResponseTitle.tsx




var ResponseTitle_ResponseTitle = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponseTitle, _super);
    function ResponseTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponseTitle.prototype.render = function () {
        var _a = this.props, title = _a.title, type = _a.type, empty = _a.empty, code = _a.code, opened = _a.opened, className = _a.className, onClick = _a.onClick;
        return external_react_["createElement"]("div", { className: className, onClick: !empty && onClick || undefined },
            !empty && external_react_["createElement"](ShelfIcon, { size: '1.5em', color: type, direction: opened ? 'up' : 'down', float: 'left' }),
            external_react_["createElement"]("strong", null,
                code,
                " "),
            external_react_["createElement"](Markdown_Markdown, { compact: true, inline: true, source: title }));
    };
    return ResponseTitle;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Responses/styled.elements.ts
// import { transparentize } from 'polished';



var StyledResponseTitle = styled_components(ResponseTitle_ResponseTitle).withConfig({
    componentId: "sc-1kbihq-0"
})(["padding:10px;border-radius:4px;margin-bottom:4px;line-height:1.5em;background-color:#f8f8f8;cursor:pointer;color:", ";", ";"], function (props) { return props.theme.colors.responses[props.type].color; }, function (props) { return props.empty && "\ncursor: default;\n&::before {\n  content: \"\u2014\";\n  font-weight: bold;\n  width: 1.5em;\n  text-align: center;\n  display: inline-block;\n}\n" || ''; });
var ResponseDetailsWrap = styled_components.div.withConfig({
    componentId: "sc-1kbihq-1"
})([""]);
var HeadersCaption = styled_components(UnderlinedHeader.withComponent('caption')).withConfig({
    componentId: "sc-1kbihq-2"
})(["text-align:left;margin-top:1em;caption-side:top;"]);

// CONCATENATED MODULE: ./src/components/Responses/ResponseHeaders.tsx






var ResponseHeaders_ResponseHeaders = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponseHeaders, _super);
    function ResponseHeaders() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponseHeaders.prototype.render = function () {
        var headers = this.props.headers;
        if (headers === undefined || headers.length === 0) {
            return null;
        }
        return external_react_["createElement"](PropertiesTable, null,
            external_react_["createElement"](HeadersCaption, null, " Response Headers "),
            external_react_["createElement"]("tbody", null, mapWithLast(headers, function (header, isLast) { return external_react_["createElement"](Field_Field, { isLast: isLast, key: header.name, field: header, showExamples: true }); })));
    };
    return ResponseHeaders;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Responses/ResponseDetails.tsx








var ResponseDetails_ResponseDetails = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponseDetails, _super);
    function ResponseDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDropdown = function (props) {
            return external_react_["createElement"](UnderlinedHeader, { key: "header" },
                "Response Schema: ",
                external_react_["createElement"](DropdownOrLabel, external_tslib_["__assign"]({}, props)));
        };
        return _this;
    }
    ResponseDetails.prototype.render = function () {
        var _a = this.props.response, description = _a.description, headers = _a.headers, content = _a.content;
        return external_react_["createElement"](external_react_["Fragment"], null,
            description && external_react_["createElement"](Markdown_Markdown, { source: description }),
            external_react_["createElement"](ResponseHeaders_ResponseHeaders, { headers: headers }),
            external_react_["createElement"](MediaTypesSwitch_MediaTypesSwitch, { content: content, renderDropdown: this.renderDropdown }, function (_a) {
                var schema = _a.schema;
                return external_react_["createElement"](Schema_Schema, { skipWriteOnly: true, key: "schema", schema: schema });
            }));
    };
    return ResponseDetails;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Responses/Response.tsx





var Response_ResponseView = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponseView, _super);
    function ResponseView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggle = function () {
            _this.props.response.toggle();
        };
        return _this;
    }
    ResponseView.prototype.render = function () {
        var _a = this.props.response, headers = _a.headers, description = _a.description, code = _a.code, content = _a.content;
        var mimes = content === undefined ? [] : content.mediaTypes.filter(function (mime) { return mime.schema !== undefined; });
        var empty = headers.length === 0 && mimes.length === 0 && !description;
        return external_react_["createElement"]("div", null, code === '200' && !empty && external_react_["createElement"](ResponseDetailsWrap, null,
            external_react_["createElement"](ResponseDetails_ResponseDetails, { response: this.props.response })));
    };
    ResponseView = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ResponseView);
    return ResponseView;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Responses/ResponsesList.tsx



var ResponsesList_ResponsesList = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponsesList, _super);
    function ResponsesList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponsesList.prototype.render = function () {
        var responses = this.props.responses;
        if (!responses || responses.length === 0) {
            return null;
        }
        return external_react_["createElement"]("div", null, responses.map(function (response) {
            return external_react_["createElement"](Response_ResponseView, { key: response.code, response: response });
        }));
    };
    return ResponsesList;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Operation/Operation.tsx












 // import { ResponseSamples } from '../ResponseSamples/ResponseSamples';


var OperationRow = styled_components(Row).withConfig({
    componentId: "bf7xj3-0"
})(["backface-visibility:hidden;margin-bottom:12px;padding-bottom:40px;"]);
var Description = styled_components.div.withConfig({
    componentId: "bf7xj3-1"
})(["margin-bottom:", "px;"], function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit * 6;
});
var Operation_Operation = /** @class */ (function (_super) {
    external_tslib_["__extends"](Operation, _super);
    function Operation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Operation.prototype.render = function () {
        var operation = this.props.operation;
        var summary = operation.name, description = operation.description, deprecated = operation.deprecated, externalDocs = operation.externalDocs;
        var hasDescription = !!(description || externalDocs);
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](OperationRow, null,
            external_react_["createElement"](MiddlePanel, null,
                external_react_["createElement"](H2, null,
                    external_react_["createElement"](ShareLink, { to: operation.id }),
                    summary,
                    " ",
                    deprecated && external_react_["createElement"](Badge, { type: "warning" }, " Deprecated ")),
                options.pathInMiddlePanel && external_react_["createElement"](Endpoint_Endpoint, { operation: operation, inverted: true }),
                hasDescription && external_react_["createElement"](Description, null,
                    description !== undefined && external_react_["createElement"](Markdown_Markdown, { source: description }),
                    externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs })),
                external_react_["createElement"](Extensions_Extensions, { extensions: operation.extensions }),
                external_react_["createElement"](SecurityRequirement_SecurityRequirements, { securities: operation.security }),
                external_react_["createElement"](Parameters_Parameters, { parameters: operation.parameters, body: operation.requestBody }),
                external_react_["createElement"](ResponsesList_ResponsesList, { responses: operation.responses }),
                external_react_["createElement"](RequestSamples_RequestSamples, { operation: operation }))); });
    };
    Operation = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], Operation);
    return Operation;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/ContentItems/ContentItems.tsx







var ContentItems_ContentItems = /** @class */ (function (_super) {
    external_tslib_["__extends"](ContentItems, _super);
    function ContentItems() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentItems.prototype.render = function () {
        var items = this.props.items;
        if (items.length === 0) {
            return null;
        }
        return items.map(function (item) { return external_react_["createElement"](ContentItems_ContentItem, { item: item, key: item.id }); });
    };
    ContentItems = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ContentItems);
    return ContentItems;
}(external_react_["Component"]));

var ContentItems_ContentItem = /** @class */ (function (_super) {
    external_tslib_["__extends"](ContentItem, _super);
    function ContentItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentItem.prototype.render = function () {
        var item = this.props.item;
        var content;
        var type = item.type;
        switch (type) {
            case 'group':
                content = null;
                break;
            case 'tag':
            case 'section':
                content = external_react_["createElement"](ContentItems_SectionItem, external_tslib_["__assign"]({}, this.props));
                break;
            case 'operation':
                content = external_react_["createElement"](ContentItems_OperationItem, { item: item });
                break;
            default:
                content = external_react_["createElement"](ContentItems_SectionItem, external_tslib_["__assign"]({}, this.props));
        }
        return external_react_["createElement"](external_react_["Fragment"], null,
            content && external_react_["createElement"](Section, { id: item.id, underlined: item.type === 'operation' }, content),
            item.items && external_react_["createElement"](ContentItems_ContentItems, { items: item.items }));
    };
    ContentItem = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ContentItem);
    return ContentItem;
}(external_react_["Component"]));

var middlePanelWrap = function (component) { return external_react_["createElement"](MiddlePanel, null, component); };
var ContentItems_SectionItem = /** @class */ (function (_super) {
    external_tslib_["__extends"](SectionItem, _super);
    function SectionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SectionItem.prototype.render = function () {
        var _a = this.props.item, name = _a.name, description = _a.description, externalDocs = _a.externalDocs, level = _a.level;
        var Header = level === 2 ? H2 : H1;
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"](Header, null,
                        external_react_["createElement"](ShareLink, { to: this.props.item.id }),
                        name))),
            external_react_["createElement"](AdvancedMarkdown_AdvancedMarkdown, { source: description || '', htmlWrap: middlePanelWrap }),
            externalDocs && external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs }))));
    };
    SectionItem = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], SectionItem);
    return SectionItem;
}(external_react_["Component"]));

var ContentItems_OperationItem = /** @class */ (function (_super) {
    external_tslib_["__extends"](OperationItem, _super);
    function OperationItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationItem.prototype.render = function () {
        return external_react_["createElement"](Operation_Operation, { operation: this.props.item });
    };
    OperationItem = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], OperationItem);
    return OperationItem;
}(external_react_["Component"]));


// EXTERNAL MODULE: external "classnames"
var external_classnames_ = __webpack_require__(36);

// CONCATENATED MODULE: ./src/components/SideMenu/styled.elements.ts




var OperationBadge = styled_components.span.attrs(function (props) { return ({
    className: "operation-type " + props.type
}); }).withConfig({
    componentId: "sc-10atcbm-0"
})(["width:32px;display:inline-block;height:", ";line-height:", ";background-color:#333;border-radius:3px;background-repeat:no-repeat;background-position:6px 4px;font-size:7px;font-family:Verdana;color:white;text-transform:uppercase;text-align:center;font-weight:bold;vertical-align:middle;margin-right:6px;margin-top:2px;&.get{background-color:", ";}&.post{background-color:", ";}&.put{background-color:", ";}&.options{background-color:", ";}&.patch{background-color:", ";}&.delete{background-color:", ";}&.basic{background-color:", ";}&.link{background-color:", ";}&.head{background-color:", ";}"], function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.colors.http.get; }, function (props) { return props.theme.colors.http.post; }, function (props) { return props.theme.colors.http.put; }, function (props) { return props.theme.colors.http.options; }, function (props) { return props.theme.colors.http.patch; }, function (props) { return props.theme.colors.http.delete; }, function (props) { return props.theme.colors.http.basic; }, function (props) { return props.theme.colors.http.link; }, function (props) { return props.theme.colors.http.head; });
function menuItemActiveBg(depth, _a) {
    var theme = _a.theme;
    if (depth > 1) {
        return Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor);
    }
    else if (depth === 1) {
        return Object(external_polished_["darken"])(0.05, theme.menu.backgroundColor);
    }
    else {
        return '';
    }
}
var MenuItemUl = styled_components.ul.withConfig({
    componentId: "sc-10atcbm-1"
})(["margin:0;padding:0;& &{font-size:0.929em;}", ";"], function (props) { return props.expanded ? '' : 'display: none;'; });
var MenuItemLi = styled_components.li.withConfig({
    componentId: "sc-10atcbm-2"
})(["list-style:none inside none;overflow:hidden;text-overflow:ellipsis;padding:0;", ";"], function (props) { return props.depth === 0 ? 'margin-top: 15px' : ''; });
var menuItemDepth = {
    0: css(["opacity:0.7;text-transform:", ";font-size:0.8em;padding-bottom:0;cursor:default;color:", ";"], function (_a) {
        var theme = _a.theme;
        return theme.menu.groupItems.textTransform;
    }, function (props) { return props.theme.menu.textColor; }),
    1: css(["font-size:0.929em;text-transform:", ";&:hover{color:", ";}"], function (_a) {
        var theme = _a.theme;
        return theme.menu.level1Items.textTransform;
    }, function (props) { return props.theme.colors.primary.main; }),
    2: css(["color:", ";"], function (props) { return props.theme.menu.textColor; })
};
var MenuItemLabel = styled_components.label.attrs(function (props) { return ({
    role: 'menuitem',
    className: external_classnames_('-depth' + props.depth, {
        active: props.active
    })
}); }).withConfig({
    componentId: "sc-10atcbm-3"
})(["cursor:pointer;color:", ";margin:0;padding:12.5px ", "px;", " display:flex;justify-content:space-between;font-family:", ";", ";background-color:", ";", ";&:hover{background-color:", ";}", "{height:", ";width:", ";polygon{fill:", ";}}"], function (props) { return props.active ? props.theme.colors.primary.main : props.theme.menu.textColor; }, function (props) { return props.theme.spacing.unit * 4; }, function (_a) {
    var depth = _a.depth, type = _a.type, theme = _a.theme;
    return type === 'section' && depth > 1 && 'padding-left: ' + theme.spacing.unit * 8 + 'px;' || '';
}, function (props) { return props.theme.typography.headings.fontFamily; }, function (props) { return menuItemDepth[props.depth]; }, function (props) { return props.active ? menuItemActiveBg(props.depth, props) : ''; }, function (props) { return props.deprecated && deprecatedCss || ''; }, function (props) { return menuItemActiveBg(props.depth, props); }, ShelfIcon, function (_a) {
    var theme = _a.theme;
    return theme.menu.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.menu.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.menu.arrow.color;
});
var MenuItemTitle = styled_components.span.withConfig({
    componentId: "sc-10atcbm-4"
})(["display:inline-block;vertical-align:middle;width:", ";overflow:hidden;text-overflow:ellipsis;"], function (props) { return props.width ? props.width : 'auto'; });
var RedocAttribution = styled_components.div.withConfig({
    componentId: "sc-10atcbm-5"
})(["", ";"], function (_a) {
    var theme = _a.theme;
    return "\n  font-size: 0.8em;\n  margin-top: " + theme.spacing.unit * 2 + "px;\n  padding: 0 " + theme.spacing.unit * 4 + "px;\n  text-align: left;\n\n  opacity: 0.7;\n\n  a,\n  a:visited,\n  a:hover {\n    color: " + theme.menu.textColor + " !important;\n    border-top: 1px solid " + Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor) + ";\n    padding: " + theme.spacing.unit + "px 0;\n    display: block;\n  }\n";
});

// CONCATENATED MODULE: ./src/components/SideMenu/MenuItem.tsx







var MenuItem_MenuItem = /** @class */ (function (_super) {
    external_tslib_["__extends"](MenuItem, _super);
    function MenuItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activate = function (evt) {
            _this.props.onActivate(_this.props.item);
            evt.stopPropagation();
        };
        _this.saveRef = function (ref) {
            _this.ref = ref;
        };
        return _this;
    }
    MenuItem.prototype.componentDidMount = function () {
        this.scrollIntoViewIfActive();
    };
    MenuItem.prototype.componentDidUpdate = function () {
        this.scrollIntoViewIfActive();
    };
    MenuItem.prototype.scrollIntoViewIfActive = function () {
        if (this.props.item.active && this.ref) {
            this.ref.scrollIntoViewIfNeeded();
        }
    };
    MenuItem.prototype.render = function () {
        var _a = this.props, item = _a.item, withoutChildren = _a.withoutChildren;
        return external_react_["createElement"](MenuItemLi, { onClick: this.activate, depth: item.depth, ref: this.saveRef, "data-item-id": item.id },
            item.type === 'operation' ? external_react_["createElement"](MenuItem_OperationMenuItemContent, external_tslib_["__assign"]({}, this.props, { item: item })) : external_react_["createElement"](MenuItemLabel, { depth: item.depth, active: item.active, type: item.type },
                external_react_["createElement"](MenuItemTitle, { title: item.name },
                    item.name,
                    this.props.children),
                item.depth > 0 && item.items.length > 0 && external_react_["createElement"](ShelfIcon, { float: 'right', direction: item.expanded ? 'down' : 'right' }) || null),
            !withoutChildren && item.items && item.items.length > 0 && external_react_["createElement"](MenuItems_MenuItems, { expanded: item.expanded, items: item.items, onActivate: this.props.onActivate }));
    };
    MenuItem = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], MenuItem);
    return MenuItem;
}(external_react_["Component"]));

var MenuItem_OperationMenuItemContent = /** @class */ (function (_super) {
    external_tslib_["__extends"](OperationMenuItemContent, _super);
    function OperationMenuItemContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationMenuItemContent.prototype.render = function () {
        var item = this.props.item;
        return external_react_["createElement"](MenuItemLabel, { depth: item.depth, active: item.active, deprecated: item.deprecated },
            external_react_["createElement"](OperationBadge, { type: item.httpVerb }, shortenHTTPVerb(item.httpVerb)),
            external_react_["createElement"](MenuItemTitle, { width: "calc(100% - 38px)" },
                item.name,
                this.props.children));
    };
    OperationMenuItemContent = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], OperationMenuItemContent);
    return OperationMenuItemContent;
}(external_react_["Component"]));

// CONCATENATED MODULE: ./src/components/SideMenu/MenuItems.tsx





var MenuItems_MenuItems = /** @class */ (function (_super) {
    external_tslib_["__extends"](MenuItems, _super);
    function MenuItems() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItems.prototype.render = function () {
        var _this = this;
        var _a = this.props, items = _a.items, root = _a.root, className = _a.className;
        var expanded = this.props.expanded == null ? true : this.props.expanded;
        return external_react_["createElement"](MenuItemUl, external_tslib_["__assign"]({ className: className, style: this.props.style, expanded: expanded }, root ? {
            role: 'navigation'
        } : {}), items.map(function (item, idx) { return external_react_["createElement"](MenuItem_MenuItem, { key: idx, item: item, onActivate: _this.props.onActivate }); }));
    };
    MenuItems = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], MenuItems);
    return MenuItems;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SideMenu/SideMenu.tsx





var SideMenu_SideMenu = /** @class */ (function (_super) {
    external_tslib_["__extends"](SideMenu, _super);
    function SideMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activate = function (item) {
            _this.props.menu.activateAndScroll(item, true);
            setTimeout(function () {
                if (_this._updateScroll) {
                    _this._updateScroll();
                }
            });
        };
        _this.saveScrollUpdate = function (upd) {
            _this._updateScroll = upd;
        };
        return _this;
    }
    SideMenu.prototype.render = function () {
        var store = this.props.menu;
        return external_react_["createElement"](PerfectScrollbarWrap, { updateFn: this.saveScrollUpdate, className: this.props.className, options: {
                wheelPropagation: false
            } },
            external_react_["createElement"](MenuItems_MenuItems, { items: store.items, onActivate: this.activate, root: true }));
    };
    SideMenu = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], SideMenu);
    return SideMenu;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/StickySidebar/ChevronSvg.tsx


var AnimatedChevronButton = function (_a) {
    var open = _a.open;
    var iconOffset = open ? 8 : -4;
    return external_react_["createElement"](ChevronContainer, null,
        external_react_["createElement"](ChevronSvg, { size: 15, style: {
                transform: "translate(2px, " + iconOffset + "px) rotate(180deg)",
                transition: 'transform 0.2s ease'
            } }),
        external_react_["createElement"](ChevronSvg, { size: 15, style: {
                transform: "translate(2px, " + (0 - iconOffset) + "px)",
                transition: 'transform 0.2s ease'
            } }));
}; // adapted from reactjs.org
var ChevronSvg = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 10 : _b, _c = _a.className, className = _c === void 0 ? '' : _c, style = _a.style;
    return external_react_["createElement"]("svg", { className: className, style: style || {}, viewBox: "0 0 926.23699 573.74994", version: "1.1", x: "0px", y: "0px", width: size, height: size },
        external_react_["createElement"]("g", { transform: "translate(904.92214,-879.1482)" },
            external_react_["createElement"]("path", { d: "\n          m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,\n          -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,\n          0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,\n          -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,\n          -174.68583 0.6895,0 26.281,25.03215 56.8701,\n          55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864\n          -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,\n          -104.0616 -231.873,-231.248 z\n        ", fill: "currentColor" })));
};
var ChevronContainer = styled_components.div.withConfig({
    componentId: "sc-1qaepcz-0"
})(["user-select:none;width:20px;height:20px;align-self:center;display:flex;flex-direction:column;color:", ";"], function (props) { return props.theme.colors.primary.main; });

// CONCATENATED MODULE: ./src/components/StickySidebar/StickyResponsiveSidebar.tsx








var Stickyfill;
if (IS_BROWSER) {
    Stickyfill = __webpack_require__(66);
}
var stickyfill = Stickyfill && Stickyfill();
var StyledStickySidebar = styled_components.div.withConfig({
    componentId: "sc-1sch5l7-0"
})(["width:", ";background-color:", ";overflow:hidden;display:flex;flex-direction:column;backface-visibility:hidden;contain:strict;height:100vh;position:sticky;position:-webkit-sticky;top:0;", ";@media print{display:none;}"], function (props) { return props.theme.menu.width; }, function (props) { return props.theme.menu.backgroundColor; }, media.lessThan('small')(StickyResponsiveSidebar_templateObject_1 || (StickyResponsiveSidebar_templateObject_1 = external_tslib_["__makeTemplateObject"](["\n    position: fixed;\n    z-index: 20;\n    width: 100%;\n    background: #ffffff;\n    display: ", ";\n  "], ["\n    position: fixed;\n    z-index: 20;\n    width: 100%;\n    background: #ffffff;\n    display: ", ";\n  "])), function (props) { return props.open ? 'flex' : 'none'; }));
var FloatingButton = styled_components.div.withConfig({
    componentId: "sc-1sch5l7-1"
})(["outline:none;user-select:none;background-color:#f2f2f2;color:", ";display:none;cursor:pointer;position:fixed;right:20px;z-index:100;border-radius:50%;box-shadow:0 0 20px rgba(0,0,0,0.3);", ";bottom:44px;width:60px;height:60px;padding:0 20px;@media print{display:none;}"], function (props) { return props.theme.colors.primary.main; }, media.lessThan('small')(StickyResponsiveSidebar_templateObject_2 || (StickyResponsiveSidebar_templateObject_2 = external_tslib_["__makeTemplateObject"](["\n    display: flex;\n  "], ["\n    display: flex;\n  "]))));
var StickyResponsiveSidebar_StickyResponsiveSidebar = /** @class */ (function (_super) {
    external_tslib_["__extends"](StickyResponsiveSidebar, _super);
    function StickyResponsiveSidebar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggleNavMenu = function () {
            _this.props.menu.toggleSidebar();
        }; // private closeNavMenu = () => {
        return _this;
        //   this.setState({ open: false });
        // };
    }
    StickyResponsiveSidebar.prototype.componentDidMount = function () {
        if (stickyfill) {
            stickyfill.add(this.stickyElement);
        }
    };
    StickyResponsiveSidebar.prototype.componentWillUnmount = function () {
        if (stickyfill) {
            stickyfill.remove(this.stickyElement);
        }
    };
    StickyResponsiveSidebar.prototype.getScrollYOffset = function (options) {
        var top;
        if (this.props.scrollYOffset !== undefined) {
            top = RedocNormalizedOptions_RedocNormalizedOptions.normalizeScrollYOffset(this.props.scrollYOffset)();
        }
        else {
            top = options.scrollYOffset();
        }
        return top + 'px';
    };
    StickyResponsiveSidebar.prototype.render = function () {
        var _this = this;
        var open = this.props.menu.sideBarOpened;
        var style = function (options) {
            var top = _this.getScrollYOffset(options);
            return {
                top: top,
                height: "calc(100vh - " + top + ")"
            };
        };
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](StyledStickySidebar, { open: open, className: _this.props.className, style: style(options), ref: function (el) {
                    _this.stickyElement = el;
                } }, _this.props.children),
            external_react_["createElement"](FloatingButton, { onClick: _this.toggleNavMenu },
                external_react_["createElement"](AnimatedChevronButton, { open: open }))); });
    };
    StickyResponsiveSidebar = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], StickyResponsiveSidebar);
    return StickyResponsiveSidebar;
}(external_react_["Component"]));

var StickyResponsiveSidebar_templateObject_1, StickyResponsiveSidebar_templateObject_2;

// CONCATENATED MODULE: ./src/components/Redoc/styled.elements.tsx


var RedocWrap = styled_components.div.withConfig({
    componentId: "sc-13p9gjn-0"
})(["", ";"], function (_a) {
    var theme = _a.theme;
    return "\n  font-family: " + theme.typography.fontFamily + ";\n  font-size: " + theme.typography.fontSize + ";\n  font-weight: " + theme.typography.fontWeightRegular + ";\n  line-height: " + theme.typography.lineHeight + ";\n  color: " + theme.colors.text.primary + ";\n  display: flex;\n  position: relative;\n  text-align: left;\n\n  -webkit-font-smoothing: " + theme.typography.smoothing + ";\n  font-smoothing: " + theme.typography.smoothing + ";\n  " + (theme.typography.optimizeSpeed && 'text-rendering: optimizeSpeed !important' || '') + ";\n\n  tap-highlight-color: rgba(0, 0, 0, 0);\n  text-size-adjust: 100%;\n\n  * {\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  }\n";
});
var ApiContentWrap = styled_components.div.withConfig({
    componentId: "sc-13p9gjn-1"
})(["z-index:1;position:relative;overflow:hidden;width:calc(100% - ", ");", ";contain:layout;"], function (props) { return props.theme.menu.width; }, media.lessThan('small', true)(styled_elements_templateObject_1 || (styled_elements_templateObject_1 = external_tslib_["__makeTemplateObject"](["\n    width: 100%;\n  "], ["\n    width: 100%;\n  "]))));
var BackgroundStub = styled_components.div.withConfig({
    componentId: "sc-13p9gjn-2"
})(["background:", ";position:absolute;top:0;bottom:0;right:0;width:", ";", ";"], function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.backgroundColor;
}, function (_a) {
    var theme = _a.theme;
    if (theme.rightPanel.width.endsWith('%')) {
        var percents = parseInt(theme.rightPanel.width, 10);
        return "calc((100% - " + theme.menu.width + ") * " + percents / 100 + ")";
    }
    else {
        return theme.rightPanel.width;
    }
}, media.lessThan('medium', true)(styled_elements_templateObject_2 || (styled_elements_templateObject_2 = external_tslib_["__makeTemplateObject"](["\n    display: none;\n  "], ["\n    display: none;\n  "]))));
var styled_elements_templateObject_1, styled_elements_templateObject_2;

// CONCATENATED MODULE: ./src/components/SearchBox/styled.elements.tsx




var SearchWrap = styled_components.div.withConfig({
    componentId: "k4h4y9-0"
})(["padding:5px 0;"]);
var SearchInput = styled_components.input.attrs(function () { return ({
    className: 'search-input'
}); }).withConfig({
    componentId: "k4h4y9-1"
})(["width:calc(100% - ", "px);box-sizing:border-box;margin:0 ", "px;padding:5px ", "px 5px ", "px;border:0;border-bottom:1px solid ", ";font-family:", ";font-weight:bold;font-size:13px;color:", ";background-color:transparent;outline:none;"], function (props) { return props.theme.spacing.unit * 8; }, function (props) { return props.theme.spacing.unit * 4; }, function (props) { return props.theme.spacing.unit * 2; }, function (props) { return props.theme.spacing.unit * 4; }, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.typography.fontFamily;
}, function (props) { return props.theme.menu.textColor; });
var SearchIcon = styled_components(function (props) { return external_react_["createElement"]("svg", { className: props.className, version: "1.1", viewBox: "0 0 1000 1000", x: "0px", xmlns: "http://www.w3.org/2000/svg", y: "0px" },
    external_react_["createElement"]("path", { d: "M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z" })); }).attrs({
    className: 'search-icon'
}).withConfig({
    componentId: "k4h4y9-2"
})(["position:absolute;left:", "px;height:1.8em;width:0.9em;path{fill:", ";}"], function (props) { return props.theme.spacing.unit * 4; }, function (props) { return props.theme.menu.textColor; });
var SearchResultsBox = styled_components.div.withConfig({
    componentId: "k4h4y9-3"
})(["padding:", "px 0;background-color:#ededed;min-height:150px;max-height:250px;border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;margin-top:10px;line-height:1.4;font-size:0.9em;", "{padding-top:6px;padding-bottom:6px;&:hover{background-color:#e1e1e1;}> svg{display:none;}&.active{background-color:#e1e1e1;}}"], function (props) { return props.theme.spacing.unit; }, MenuItemLabel);
var ClearIcon = styled_components.i.withConfig({
    componentId: "k4h4y9-4"
})(["position:absolute;display:inline-block;width:", "px;text-align:center;right:", "px;line-height:2em;vertical-align:middle;margin-right:2px;cursor:pointer;font-style:normal;color:'#666';"], function (props) { return props.theme.spacing.unit * 2; }, function (props) { return props.theme.spacing.unit * 4; });

// CONCATENATED MODULE: ./src/components/SearchBox/SearchBox.tsx





var SearchBox_SearchBox = /** @class */ (function (_super) {
    external_tslib_["__extends"](SearchBox, _super);
    function SearchBox(props) {
        var _this = _super.call(this, props) || this;
        _this.activeItemRef = null;
        _this.clear = function () {
            _this.setState({
                results: [],
                term: '',
                activeItemIdx: -1
            });
            _this.props.marker.unmark();
        };
        _this.handleKeyDown = function (event) {
            if (event.keyCode === 27) {
                // ESQ
                _this.clear();
            }
            if (event.keyCode === 40) {
                // Arrow down
                _this.setState({
                    activeItemIdx: Math.min(_this.state.activeItemIdx + 1, _this.state.results.length - 1)
                });
                event.preventDefault();
            }
            if (event.keyCode === 38) {
                // Arrow up
                _this.setState({
                    activeItemIdx: Math.max(0, _this.state.activeItemIdx - 1)
                });
                event.preventDefault();
            }
            if (event.keyCode === 13) {
                // enter
                var activeResult = _this.state.results[_this.state.activeItemIdx];
                if (activeResult) {
                    var item = _this.props.getItemById(activeResult.meta);
                    if (item) {
                        _this.props.onActivate(item);
                    }
                }
            }
        };
        _this.search = function (event) {
            var q = event.target.value;
            if (q.length < 3) {
                _this.clearResults(q);
                return;
            }
            _this.setState({
                term: q
            });
            _this.props.search.search(event.target.value).then(function (res) {
                _this.setResults(res, q);
            });
        };
        _this.state = {
            results: [],
            term: '',
            activeItemIdx: -1
        };
        return _this;
    }
    SearchBox.prototype.clearResults = function (term) {
        this.setState({
            results: [],
            term: term
        });
        this.props.marker.unmark();
    };
    SearchBox.prototype.setResults = function (results, term) {
        this.setState({
            results: results,
            term: term
        });
        this.props.marker.mark(term);
    };
    SearchBox.prototype.render = function () {
        var _this = this;
        var activeItemIdx = this.state.activeItemIdx;
        var results = this.state.results.map(function (res) { return ({
            item: _this.props.getItemById(res.meta),
            score: res.score
        }); });
        results.sort(function (a, b) { return b.score - a.score; });
        return external_react_["createElement"](SearchWrap, { role: "search" },
            this.state.term && external_react_["createElement"](ClearIcon, { onClick: this.clear }, "\u00D7"),
            external_react_["createElement"](SearchIcon, null),
            external_react_["createElement"](SearchInput, { value: this.state.term, onKeyDown: this.handleKeyDown, placeholder: "Search...", type: "text", onChange: this.search }),
            results.length > 0 && external_react_["createElement"](PerfectScrollbarWrap, { options: {
                    wheelPropagation: false
                } },
                external_react_["createElement"](SearchResultsBox, { "data-role": "search:results" }, results.map(function (res, idx) { return external_react_["createElement"](MenuItem_MenuItem, { item: Object.create(res.item, {
                        active: {
                            value: idx === activeItemIdx
                        }
                    }), onActivate: _this.props.onActivate, withoutChildren: true, key: res.item.id, "data-role": "search:result" }); }))));
    };
    return SearchBox;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Redoc/Redoc.tsx














var Redoc_Redoc = /** @class */ (function (_super) {
    external_tslib_["__extends"](Redoc, _super);
    function Redoc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Redoc.prototype.componentDidMount = function () {
        this.props.store.onDidMount();
    };
    Redoc.prototype.componentWillUnmount = function () {
        this.props.store.dispose();
    };
    Redoc.prototype.render = function () {
        var _a = this.props.store, spec = _a.spec, menu = _a.menu, options = _a.options, search = _a.search, marker = _a.marker;
        var store = this.props.store;
        return external_react_["createElement"](ThemeProvider, { theme: options.theme },
            external_react_["createElement"](Provider, { value: this.props.store },
                external_react_["createElement"](OptionsProvider, { value: options },
                    external_react_["createElement"](RedocWrap, { className: "redoc-wrap" },
                        external_react_["createElement"](StickyResponsiveSidebar_StickyResponsiveSidebar, { menu: menu, className: "menu-content" },
                            external_react_["createElement"](ApiLogo_ApiLogo, { info: spec.info }),
                            !options.disableSearch && external_react_["createElement"](SearchBox_SearchBox, { search: search, marker: marker, getItemById: menu.getItemById, onActivate: menu.activateAndScroll }) || null,
                            external_react_["createElement"](SideMenu_SideMenu, { menu: menu })),
                        external_react_["createElement"](ApiContentWrap, { className: "api-content" },
                            external_react_["createElement"](ApiInfo_ApiInfo, { store: store }),
                            external_react_["createElement"](ContentItems_ContentItems, { items: menu.items })),
                        external_react_["createElement"](BackgroundStub, null)))));
    };
    Redoc.propTypes = {
        store: external_prop_types_["instanceOf"](AppStore_AppStore).isRequired
    };
    return Redoc;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/RedocStandalone.tsx








var RedocStandalone_RedocStandalone = /** @class */ (function (_super) {
    external_tslib_["__extends"](RedocStandalone, _super);
    function RedocStandalone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RedocStandalone.prototype.render = function () {
        var _a = this.props, spec = _a.spec, specUrl = _a.specUrl, _b = _a.options, options = _b === void 0 ? {} : _b, onLoaded = _a.onLoaded;
        var hideLoading = options.hideLoading !== undefined;
        var normalizedOpts = new RedocNormalizedOptions_RedocNormalizedOptions(options);
        return external_react_["createElement"](ErrorBoundary_ErrorBoundary, null,
            external_react_["createElement"](StoreBuilder_StoreBuilder, { spec: spec, specUrl: specUrl, options: options, onLoaded: onLoaded }, function (_a) {
                var loading = _a.loading, store = _a.store;
                return !loading ? external_react_["createElement"](Redoc_Redoc, { store: store }) : hideLoading ? null : external_react_["createElement"](Loading_Loading, { color: normalizedOpts.theme.colors.primary.main });
            }));
    };
    RedocStandalone.propTypes = {
        spec: function (props, _, componentName) {
            if (!props.spec && !props.specUrl) {
                return new Error("One of props 'spec' or 'specUrl' was not specified in '" + componentName + "'.");
            }
            return null;
        },
        specUrl: function (props, _, componentName) {
            if (!props.spec && !props.specUrl) {
                return new Error("One of props 'spec' or 'specUrl' was not specified in '" + componentName + "'.");
            }
            return null;
        },
        options: external_prop_types_["any"],
        onLoaded: external_prop_types_["any"]
    };
    return RedocStandalone;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/JsonViewer/index.tsx


// CONCATENATED MODULE: ./src/components/ResponseSamples/ResponseSamples.tsx





var ResponseSamples_ResponseSamples = /** @class */ (function (_super) {
    external_tslib_["__extends"](ResponseSamples, _super);
    function ResponseSamples() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponseSamples.prototype.render = function () {
        var operation = this.props.operation;
        var responses = operation.responses.filter(function (response) {
            return response.content && response.content.hasSample;
        });
        return responses.length > 0 && external_react_["createElement"]("div", null,
            external_react_["createElement"](RightPanelHeader, null, " Response samples "),
            external_react_["createElement"](Tabs, { defaultIndex: 0 },
                external_react_["createElement"](external_react_tabs_["TabList"], null, responses.map(function (response) { return external_react_["createElement"](external_react_tabs_["Tab"], { className: 'tab-' + response.type, key: response.code }, response.code); })),
                responses.map(function (response) { return external_react_["createElement"](external_react_tabs_["TabPanel"], { key: response.code },
                    external_react_["createElement"]("div", null,
                        external_react_["createElement"](PayloadSamples_PayloadSamples, { content: response.content }))); }))) || null;
    };
    ResponseSamples = external_tslib_["__decorate"]([
        external_mobx_react_["observer"]
    ], ResponseSamples);
    return ResponseSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SideMenu/index.ts





// CONCATENATED MODULE: ./src/components/index.ts






























// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport ApiContentWrap */__webpack_require__.d(__webpack_exports__, "ApiContentWrap", function() { return ApiContentWrap; });
/* concated harmony reexport BackgroundStub */__webpack_require__.d(__webpack_exports__, "BackgroundStub", function() { return BackgroundStub; });
/* concated harmony reexport RedocWrap */__webpack_require__.d(__webpack_exports__, "RedocWrap", function() { return RedocWrap; });
/* concated harmony reexport StyledMarkdownBlock */__webpack_require__.d(__webpack_exports__, "StyledMarkdownBlock", function() { return StyledMarkdownBlock; });
/* concated harmony reexport RedocStandalone */__webpack_require__.d(__webpack_exports__, "RedocStandalone", function() { return RedocStandalone_RedocStandalone; });
/* concated harmony reexport Redoc */__webpack_require__.d(__webpack_exports__, "Redoc", function() { return Redoc_Redoc; });
/* concated harmony reexport ApiInfo */__webpack_require__.d(__webpack_exports__, "ApiInfo", function() { return ApiInfo_ApiInfo; });
/* concated harmony reexport ApiLogo */__webpack_require__.d(__webpack_exports__, "ApiLogo", function() { return ApiLogo_ApiLogo; });
/* concated harmony reexport ContentItems */__webpack_require__.d(__webpack_exports__, "ContentItems", function() { return ContentItems_ContentItems; });
/* concated harmony reexport ContentItem */__webpack_require__.d(__webpack_exports__, "ContentItem", function() { return ContentItems_ContentItem; });
/* concated harmony reexport SectionItem */__webpack_require__.d(__webpack_exports__, "SectionItem", function() { return ContentItems_SectionItem; });
/* concated harmony reexport OperationItem */__webpack_require__.d(__webpack_exports__, "OperationItem", function() { return ContentItems_OperationItem; });
/* concated harmony reexport SearchBox */__webpack_require__.d(__webpack_exports__, "SearchBox", function() { return SearchBox_SearchBox; });
/* concated harmony reexport Operation */__webpack_require__.d(__webpack_exports__, "Operation", function() { return Operation_Operation; });
/* concated harmony reexport Loading */__webpack_require__.d(__webpack_exports__, "Loading", function() { return Loading_Loading; });
/* concated harmony reexport Markdown */__webpack_require__.d(__webpack_exports__, "Markdown", function() { return Markdown_Markdown; });
/* concated harmony reexport OAuthFlow */__webpack_require__.d(__webpack_exports__, "OAuthFlow", function() { return SecuritySchemes_OAuthFlow; });
/* concated harmony reexport SecurityDefs */__webpack_require__.d(__webpack_exports__, "SecurityDefs", function() { return SecuritySchemes_SecurityDefs; });
/* concated harmony reexport ResponseView */__webpack_require__.d(__webpack_exports__, "ResponseView", function() { return Response_ResponseView; });
/* concated harmony reexport ResponseDetails */__webpack_require__.d(__webpack_exports__, "ResponseDetails", function() { return ResponseDetails_ResponseDetails; });
/* concated harmony reexport ResponseHeaders */__webpack_require__.d(__webpack_exports__, "ResponseHeaders", function() { return ResponseHeaders_ResponseHeaders; });
/* concated harmony reexport ResponsesList */__webpack_require__.d(__webpack_exports__, "ResponsesList", function() { return ResponsesList_ResponsesList; });
/* concated harmony reexport ResponseTitle */__webpack_require__.d(__webpack_exports__, "ResponseTitle", function() { return ResponseTitle_ResponseTitle; });
/* concated harmony reexport ResponseSamples */__webpack_require__.d(__webpack_exports__, "ResponseSamples", function() { return ResponseSamples_ResponseSamples; });
/* concated harmony reexport PayloadSamples */__webpack_require__.d(__webpack_exports__, "PayloadSamples", function() { return PayloadSamples_PayloadSamples; });
/* concated harmony reexport MediaTypesSwitch */__webpack_require__.d(__webpack_exports__, "MediaTypesSwitch", function() { return MediaTypesSwitch_MediaTypesSwitch; });
/* concated harmony reexport ErrorBoundary */__webpack_require__.d(__webpack_exports__, "ErrorBoundary", function() { return ErrorBoundary_ErrorBoundary; });
/* concated harmony reexport StoreProvider */__webpack_require__.d(__webpack_exports__, "StoreProvider", function() { return Provider; });
/* concated harmony reexport StoreConsumer */__webpack_require__.d(__webpack_exports__, "StoreConsumer", function() { return Consumer; });
/* concated harmony reexport StoreBuilder */__webpack_require__.d(__webpack_exports__, "StoreBuilder", function() { return StoreBuilder_StoreBuilder; });
/* concated harmony reexport OptionsContext */__webpack_require__.d(__webpack_exports__, "OptionsContext", function() { return OptionsContext; });
/* concated harmony reexport OptionsProvider */__webpack_require__.d(__webpack_exports__, "OptionsProvider", function() { return OptionsProvider; });
/* concated harmony reexport OptionsConsumer */__webpack_require__.d(__webpack_exports__, "OptionsConsumer", function() { return OptionsConsumer; });
/* concated harmony reexport StickyResponsiveSidebar */__webpack_require__.d(__webpack_exports__, "StickyResponsiveSidebar", function() { return StickyResponsiveSidebar_StickyResponsiveSidebar; });
/* concated harmony reexport Schema */__webpack_require__.d(__webpack_exports__, "Schema", function() { return Schema_Schema; });
/* concated harmony reexport ObjectSchema */__webpack_require__.d(__webpack_exports__, "ObjectSchema", function() { return ObjectSchema_ObjectSchema; });
/* concated harmony reexport OneOfButton */__webpack_require__.d(__webpack_exports__, "OneOfButton", function() { return OneOfSchema_OneOfButton; });
/* concated harmony reexport OneOfSchema */__webpack_require__.d(__webpack_exports__, "OneOfSchema", function() { return OneOfSchema_OneOfSchema; });
/* concated harmony reexport ArraySchema */__webpack_require__.d(__webpack_exports__, "ArraySchema", function() { return ArraySchema_ArraySchema; });
/* concated harmony reexport DiscriminatorDropdown */__webpack_require__.d(__webpack_exports__, "DiscriminatorDropdown", function() { return DiscriminatorDropdown_DiscriminatorDropdown; });
/* concated harmony reexport JsonViewer */__webpack_require__.d(__webpack_exports__, "JsonViewer", function() { return JsonViewer; });
/* concated harmony reexport MenuItem */__webpack_require__.d(__webpack_exports__, "MenuItem", function() { return MenuItem_MenuItem; });
/* concated harmony reexport MenuItems */__webpack_require__.d(__webpack_exports__, "MenuItems", function() { return MenuItems_MenuItems; });
/* concated harmony reexport SideMenu */__webpack_require__.d(__webpack_exports__, "SideMenu", function() { return SideMenu_SideMenu; });
/* concated harmony reexport OperationBadge */__webpack_require__.d(__webpack_exports__, "OperationBadge", function() { return OperationBadge; });
/* concated harmony reexport MenuItemUl */__webpack_require__.d(__webpack_exports__, "MenuItemUl", function() { return MenuItemUl; });
/* concated harmony reexport MenuItemLi */__webpack_require__.d(__webpack_exports__, "MenuItemLi", function() { return MenuItemLi; });
/* concated harmony reexport menuItemDepth */__webpack_require__.d(__webpack_exports__, "menuItemDepth", function() { return menuItemDepth; });
/* concated harmony reexport MenuItemLabel */__webpack_require__.d(__webpack_exports__, "MenuItemLabel", function() { return MenuItemLabel; });
/* concated harmony reexport MenuItemTitle */__webpack_require__.d(__webpack_exports__, "MenuItemTitle", function() { return MenuItemTitle; });
/* concated harmony reexport RedocAttribution */__webpack_require__.d(__webpack_exports__, "RedocAttribution", function() { return RedocAttribution; });
/* concated harmony reexport MiddlePanel */__webpack_require__.d(__webpack_exports__, "MiddlePanel", function() { return MiddlePanel; });
/* concated harmony reexport Row */__webpack_require__.d(__webpack_exports__, "Row", function() { return Row; });
/* concated harmony reexport RightPanel */__webpack_require__.d(__webpack_exports__, "RightPanel", function() { return RightPanel; });
/* concated harmony reexport Section */__webpack_require__.d(__webpack_exports__, "Section", function() { return Section; });
/* concated harmony reexport createStore */__webpack_require__.d(__webpack_exports__, "createStore", function() { return createStore; });
/* concated harmony reexport AppStore */__webpack_require__.d(__webpack_exports__, "AppStore", function() { return AppStore_AppStore; });
/* concated harmony reexport OpenAPIParser */__webpack_require__.d(__webpack_exports__, "OpenAPIParser", function() { return OpenAPIParser_OpenAPIParser; });
/* concated harmony reexport LEGACY_REGEXP */__webpack_require__.d(__webpack_exports__, "LEGACY_REGEXP", function() { return LEGACY_REGEXP; });
/* concated harmony reexport MDX_COMPONENT_REGEXP */__webpack_require__.d(__webpack_exports__, "MDX_COMPONENT_REGEXP", function() { return MDX_COMPONENT_REGEXP; });
/* concated harmony reexport COMPONENT_REGEXP */__webpack_require__.d(__webpack_exports__, "COMPONENT_REGEXP", function() { return COMPONENT_REGEXP; });
/* concated harmony reexport buildComponentComment */__webpack_require__.d(__webpack_exports__, "buildComponentComment", function() { return buildComponentComment; });
/* concated harmony reexport MarkdownRenderer */__webpack_require__.d(__webpack_exports__, "MarkdownRenderer", function() { return MarkdownRenderer_MarkdownRenderer; });
/* concated harmony reexport SECTION_ATTR */__webpack_require__.d(__webpack_exports__, "SECTION_ATTR", function() { return SECTION_ATTR; });
/* concated harmony reexport MenuStore */__webpack_require__.d(__webpack_exports__, "MenuStore", function() { return MenuStore_MenuStore; });
/* concated harmony reexport ScrollService */__webpack_require__.d(__webpack_exports__, "ScrollService", function() { return ScrollService_ScrollService; });
/* concated harmony reexport SpecStore */__webpack_require__.d(__webpack_exports__, "SpecStore", function() { return SpecStore_SpecStore; });
/* concated harmony reexport ClipboardService */__webpack_require__.d(__webpack_exports__, "ClipboardService", function() { return ClipboardService; });
/* concated harmony reexport HistoryService */__webpack_require__.d(__webpack_exports__, "HistoryService", function() { return HistoryService_HistoryService; });
/* concated harmony reexport history */__webpack_require__.d(__webpack_exports__, "history", function() { return HistoryService_history; });
/* concated harmony reexport ApiInfoModel */__webpack_require__.d(__webpack_exports__, "ApiInfoModel", function() { return ApiInfo_ApiInfoModel; });
/* concated harmony reexport SecuritySchemeModel */__webpack_require__.d(__webpack_exports__, "SecuritySchemeModel", function() { return SecuritySchemes_SecuritySchemeModel; });
/* concated harmony reexport SecuritySchemesModel */__webpack_require__.d(__webpack_exports__, "SecuritySchemesModel", function() { return SecuritySchemesModel; });
/* concated harmony reexport RedocNormalizedOptions */__webpack_require__.d(__webpack_exports__, "RedocNormalizedOptions", function() { return RedocNormalizedOptions_RedocNormalizedOptions; });
/* concated harmony reexport GROUP_DEPTH */__webpack_require__.d(__webpack_exports__, "GROUP_DEPTH", function() { return GROUP_DEPTH; });
/* concated harmony reexport MenuBuilder */__webpack_require__.d(__webpack_exports__, "MenuBuilder", function() { return MenuBuilder_MenuBuilder; });
/* concated harmony reexport SearchStore */__webpack_require__.d(__webpack_exports__, "SearchStore", function() { return SearchStore_SearchStore; });
/* concated harmony reexport MarkerService */__webpack_require__.d(__webpack_exports__, "MarkerService", function() { return MarkerService_MarkerService; });
/* concated harmony reexport GroupModel */__webpack_require__.d(__webpack_exports__, "GroupModel", function() { return Group_model_GroupModel; });
/* concated harmony reexport OperationModel */__webpack_require__.d(__webpack_exports__, "OperationModel", function() { return Operation_OperationModel; });
/* concated harmony reexport RequestBodyModel */__webpack_require__.d(__webpack_exports__, "RequestBodyModel", function() { return RequestBody_RequestBodyModel; });
/* concated harmony reexport ExampleModel */__webpack_require__.d(__webpack_exports__, "ExampleModel", function() { return ExampleModel; });
/* concated harmony reexport MediaContentModel */__webpack_require__.d(__webpack_exports__, "MediaContentModel", function() { return MediaContent_MediaContentModel; });
/* concated harmony reexport MediaTypeModel */__webpack_require__.d(__webpack_exports__, "MediaTypeModel", function() { return MediaType_MediaTypeModel; });
/* concated harmony reexport ResponseModel */__webpack_require__.d(__webpack_exports__, "ResponseModel", function() { return Response_ResponseModel; });
/* concated harmony reexport SchemaModel */__webpack_require__.d(__webpack_exports__, "SchemaModel", function() { return Schema_SchemaModel; });
/* concated harmony reexport FieldModel */__webpack_require__.d(__webpack_exports__, "FieldModel", function() { return Field_FieldModel; });
/* concated harmony reexport JsonPointer */__webpack_require__.d(__webpack_exports__, "JsonPointer", function() { return JsonPointer_JsonPointer; });
/* concated harmony reexport isStatusCode */__webpack_require__.d(__webpack_exports__, "isStatusCode", function() { return isStatusCode; });
/* concated harmony reexport getStatusCodeType */__webpack_require__.d(__webpack_exports__, "getStatusCodeType", function() { return getStatusCodeType; });
/* concated harmony reexport isOperationName */__webpack_require__.d(__webpack_exports__, "isOperationName", function() { return isOperationName; });
/* concated harmony reexport getOperationSummary */__webpack_require__.d(__webpack_exports__, "getOperationSummary", function() { return getOperationSummary; });
/* concated harmony reexport detectType */__webpack_require__.d(__webpack_exports__, "detectType", function() { return detectType; });
/* concated harmony reexport isPrimitiveType */__webpack_require__.d(__webpack_exports__, "isPrimitiveType", function() { return isPrimitiveType; });
/* concated harmony reexport isJsonLike */__webpack_require__.d(__webpack_exports__, "isJsonLike", function() { return isJsonLike; });
/* concated harmony reexport langFromMime */__webpack_require__.d(__webpack_exports__, "langFromMime", function() { return langFromMime; });
/* concated harmony reexport isNamedDefinition */__webpack_require__.d(__webpack_exports__, "isNamedDefinition", function() { return isNamedDefinition; });
/* concated harmony reexport humanizeConstraints */__webpack_require__.d(__webpack_exports__, "humanizeConstraints", function() { return humanizeConstraints; });
/* concated harmony reexport sortByRequired */__webpack_require__.d(__webpack_exports__, "sortByRequired", function() { return sortByRequired; });
/* concated harmony reexport sortByField */__webpack_require__.d(__webpack_exports__, "sortByField", function() { return sortByField; });
/* concated harmony reexport mergeParams */__webpack_require__.d(__webpack_exports__, "mergeParams", function() { return mergeParams; });
/* concated harmony reexport mergeSimilarMediaTypes */__webpack_require__.d(__webpack_exports__, "mergeSimilarMediaTypes", function() { return mergeSimilarMediaTypes; });
/* concated harmony reexport normalizeServers */__webpack_require__.d(__webpack_exports__, "normalizeServers", function() { return normalizeServers; });
/* concated harmony reexport SECURITY_DEFINITIONS_COMPONENT_NAME */__webpack_require__.d(__webpack_exports__, "SECURITY_DEFINITIONS_COMPONENT_NAME", function() { return SECURITY_DEFINITIONS_COMPONENT_NAME; });
/* concated harmony reexport SECURITY_SCHEMES_SECTION_PREFIX */__webpack_require__.d(__webpack_exports__, "SECURITY_SCHEMES_SECTION_PREFIX", function() { return SECURITY_SCHEMES_SECTION_PREFIX; });
/* concated harmony reexport setSecuritySchemePrefix */__webpack_require__.d(__webpack_exports__, "setSecuritySchemePrefix", function() { return setSecuritySchemePrefix; });
/* concated harmony reexport shortenHTTPVerb */__webpack_require__.d(__webpack_exports__, "shortenHTTPVerb", function() { return shortenHTTPVerb; });
/* concated harmony reexport isRedocExtension */__webpack_require__.d(__webpack_exports__, "isRedocExtension", function() { return isRedocExtension; });
/* concated harmony reexport extractExtensions */__webpack_require__.d(__webpack_exports__, "extractExtensions", function() { return extractExtensions; });
/* concated harmony reexport mapWithLast */__webpack_require__.d(__webpack_exports__, "mapWithLast", function() { return mapWithLast; });
/* concated harmony reexport mapValues */__webpack_require__.d(__webpack_exports__, "mapValues", function() { return mapValues; });
/* concated harmony reexport flattenByProp */__webpack_require__.d(__webpack_exports__, "flattenByProp", function() { return flattenByProp; });
/* concated harmony reexport stripTrailingSlash */__webpack_require__.d(__webpack_exports__, "stripTrailingSlash", function() { return stripTrailingSlash; });
/* concated harmony reexport isNumeric */__webpack_require__.d(__webpack_exports__, "isNumeric", function() { return isNumeric; });
/* concated harmony reexport appendToMdHeading */__webpack_require__.d(__webpack_exports__, "appendToMdHeading", function() { return appendToMdHeading; });
/* concated harmony reexport mergeObjects */__webpack_require__.d(__webpack_exports__, "mergeObjects", function() { return mergeObjects; });
/* concated harmony reexport safeSlugify */__webpack_require__.d(__webpack_exports__, "safeSlugify", function() { return safeSlugify; });
/* concated harmony reexport isAbsoluteUrl */__webpack_require__.d(__webpack_exports__, "isAbsoluteUrl", function() { return isAbsoluteUrl; });
/* concated harmony reexport resolveUrl */__webpack_require__.d(__webpack_exports__, "resolveUrl", function() { return resolveUrl; });
/* concated harmony reexport getBasePath */__webpack_require__.d(__webpack_exports__, "getBasePath", function() { return getBasePath; });
/* concated harmony reexport mapLang */__webpack_require__.d(__webpack_exports__, "mapLang", function() { return mapLang; });
/* concated harmony reexport highlight */__webpack_require__.d(__webpack_exports__, "highlight", function() { return highlight; });
/* concated harmony reexport loadAndBundleSpec */__webpack_require__.d(__webpack_exports__, "loadAndBundleSpec", function() { return loadAndBundleSpec; });
/* concated harmony reexport convertSwagger2OpenAPI */__webpack_require__.d(__webpack_exports__, "convertSwagger2OpenAPI", function() { return convertSwagger2OpenAPI; });
/* concated harmony reexport IS_BROWSER */__webpack_require__.d(__webpack_exports__, "IS_BROWSER", function() { return IS_BROWSER; });
/* concated harmony reexport querySelector */__webpack_require__.d(__webpack_exports__, "querySelector", function() { return querySelector; });
/* concated harmony reexport html2Str */__webpack_require__.d(__webpack_exports__, "html2Str", function() { return html2Str; });
/* concated harmony reexport Throttle */__webpack_require__.d(__webpack_exports__, "Throttle", function() { return Throttle; });
/* concated harmony reexport debugTime */__webpack_require__.d(__webpack_exports__, "debugTime", function() { return debugTime; });
/* concated harmony reexport debugTimeEnd */__webpack_require__.d(__webpack_exports__, "debugTimeEnd", function() { return debugTimeEnd; });
/* concated harmony reexport memoize */__webpack_require__.d(__webpack_exports__, "memoize", function() { return memoize; });
/* concated harmony reexport media */__webpack_require__.d(__webpack_exports__, "media", function() { return media; });
/* concated harmony reexport css */__webpack_require__.d(__webpack_exports__, "css", function() { return css; });
/* concated harmony reexport createGlobalStyle */__webpack_require__.d(__webpack_exports__, "createGlobalStyle", function() { return createGlobalStyle; });
/* concated harmony reexport keyframes */__webpack_require__.d(__webpack_exports__, "keyframes", function() { return keyframes; });
/* concated harmony reexport ThemeProvider */__webpack_require__.d(__webpack_exports__, "ThemeProvider", function() { return ThemeProvider; });
/* concated harmony reexport extensionsHook */__webpack_require__.d(__webpack_exports__, "extensionsHook", function() { return extensionsHook; });
/* concated harmony reexport styled */__webpack_require__.d(__webpack_exports__, "styled", function() { return styled_components; });








/***/ })
/******/ ]);
});
//# sourceMappingURL=redoc.lib.js.map