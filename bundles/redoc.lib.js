/*!
 * ReDoc - OpenAPI/Swagger-generated API Reference Documentation
 * -------------------------------------------------------------
 *   Version: "20.1.4"
 *   Repo: https://github.com/Redocly/redoc
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
/******/ 	return __webpack_require__(__webpack_require__.s = 82);
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

module.exports = require("polished");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mobx-react");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("json-pointer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("lunr");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("decko");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("react-tabs");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("prismjs");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
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

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(16)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("marked");

/***/ }),
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* escapes JSON Pointer using ~0 for ~ and ~1 for /
* @param s the string to escape
* @return the escaped string
*/
function jpescape(s) {
    return s.replace(/\~/g, '~0').replace(/\//g, '~1');
}
/**
* unescapes JSON Pointer using ~0 for ~ and ~1 for /
* @param s the string to unescape
* @return the unescaped string
*/
function jpunescape(s) {
    return s.replace(/\~1/g, '/').replace(/~0/g, '~');
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
    if (!prop || typeof prop !== 'string' || (prop === '#'))
        return (typeof newValue !== 'undefined' ? newValue : obj);
    if (prop.indexOf('#') >= 0) {
        var parts = prop.split('#');
        var uri = parts[0];
        if (uri)
            return false; // we do internal resolution only
        prop = parts[1];
        prop = decodeURIComponent(prop.slice(1).split('+').join(' '));
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(1);
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
    return Object.assign.apply(Object, tslib_1.__spreadArrays([result], Object.keys(obj).map(function (key) {
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
/* 19 */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("url-template");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isRef(obj, key) {
    return ((key === '$ref') && (!!obj && typeof obj[key] === 'string'));
}
module.exports = {
    isRef: isRef
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var jpescape = __webpack_require__(17).jpescape;
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
        if (object.hasOwnProperty(key)) {
            callback(object, key, state);
        }
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
/* 23 */
/***/ (function(module, exports) {

module.exports = require("mark.js");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("openapi-sampler");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("perfect-scrollbar");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(80);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "/*\n * Container style\n */\n.ps {\n  overflow: hidden !important;\n  overflow-anchor: none;\n  -ms-overflow-style: none;\n  touch-action: auto;\n  -ms-touch-action: auto;\n}\n\n/*\n * Scrollbar rail styles\n */\n.ps__rail-x {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  height: 15px;\n  /* there must be 'bottom' or 'top' for ps__rail-x */\n  bottom: 0px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-y {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  width: 15px;\n  /* there must be 'right' or 'left' for ps__rail-y */\n  right: 0;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps--active-x > .ps__rail-x,\n.ps--active-y > .ps__rail-y {\n  display: block;\n  background-color: transparent;\n}\n\n.ps:hover > .ps__rail-x,\n.ps:hover > .ps__rail-y,\n.ps--focus > .ps__rail-x,\n.ps--focus > .ps__rail-y,\n.ps--scrolling-x > .ps__rail-x,\n.ps--scrolling-y > .ps__rail-y {\n  opacity: 0.6;\n}\n\n.ps .ps__rail-x:hover,\n.ps .ps__rail-y:hover,\n.ps .ps__rail-x:focus,\n.ps .ps__rail-y:focus,\n.ps .ps__rail-x.ps--clicking,\n.ps .ps__rail-y.ps--clicking {\n  background-color: #eee;\n  opacity: 0.9;\n}\n\n/*\n * Scrollbar thumb styles\n */\n.ps__thumb-x {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, height .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, height .2s ease-in-out;\n  height: 6px;\n  /* there must be 'bottom' for ps__thumb-x */\n  bottom: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__thumb-y {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, width .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, width .2s ease-in-out;\n  width: 6px;\n  /* there must be 'right' for ps__thumb-y */\n  right: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-x:hover > .ps__thumb-x,\n.ps__rail-x:focus > .ps__thumb-x,\n.ps__rail-x.ps--clicking .ps__thumb-x {\n  background-color: #999;\n  height: 11px;\n}\n\n.ps__rail-y:hover > .ps__thumb-y,\n.ps__rail-y:focus > .ps__thumb-y,\n.ps__rail-y.ps--clicking .ps__thumb-y {\n  background-color: #999;\n  width: 11px;\n}\n\n/* MS supports */\n@supports (-ms-overflow-style: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 27 */
/***/ (function(module, exports) {



/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var sjs = __webpack_require__(11);
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
        return sjs.stringify(obj1) === sjs.stringify(Object.assign({}, obj1, obj2));
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
function firstDupe(arr) {
    return arr.find(function (e, i, a) {
        return arr.indexOf(e) < i;
    });
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
    firstDupe: firstDupe,
    hash: hash,
    parameterTypeProperties: parameterTypeProperties,
    arrayProperties: arrayProperties,
    httpMethods: httpMethods,
    sanitise: sanitise,
    sanitiseAll: sanitiseAll
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(16)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(50)
var ieee754 = __webpack_require__(51)
var isArray = __webpack_require__(52)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

// The xhr request to example.com may violate some restrictive CSP configurations,
// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
// and assume support for certain features below.
var xhr
function getXHR () {
	// Cache the xhr value
	if (xhr !== undefined) return xhr

	if (global.XMLHttpRequest) {
		xhr = new global.XMLHttpRequest()
		// If XDomainRequest is available (ie only, where xhr might not work
		// cross domain), use the page location. Otherwise use example.com
		// Note: this doesn't actually make an http request.
		try {
			xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
		} catch(e) {
			xhr = null
		}
	} else {
		// Service workers don't have XHR
		xhr = null
	}
	return xhr
}

function checkTypeSupport (type) {
	var xhr = getXHR()
	if (!xhr) return false
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

// If fetch is supported, then arraybuffer will be supported too. Skip calling
// checkTypeSupport(), since that calls getXHR().
exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')

// If fetch is supported, then overrideMimeType will be supported too. Skip calling
// getXHR().
exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
	return typeof value === 'function'
}

xhr = null // Help gc

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("inherits");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Buffer, global) {var capability = __webpack_require__(30)
var inherits = __webpack_require__(31)
var stream = __webpack_require__(33)

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		
		response.headers.forEach(function (header, key){
			self.headers[key.toLowerCase()] = header
			self.rawHeaders.push(key, header)
		})

		if (capability.writableStream) {
			var writable = new WritableStream({
				write: function (chunk) {
					return new Promise(function (resolve, reject) {
						if (self._destroyed) {
							reject()
						} else if(self.push(new Buffer(chunk))) {
							resolve()
						} else {
							self._resumeFetch = resolve
						}
					})
				},
				close: function () {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.push(null)
				},
				abort: function (err) {
					if (!self._destroyed)
						self.emit('error', err)
				}
			})

			try {
				response.body.pipeTo(writable).catch(function (err) {
					global.clearTimeout(fetchTimer)
					if (!self._destroyed)
						self.emit('error', err)
				})
				return
			} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
		}
		// fallback for when writableStream or pipeTo aren't available
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					global.clearTimeout(fetchTimer)
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			}).catch(function (err) {
				global.clearTimeout(fetchTimer)
				if (!self._destroyed)
					self.emit('error', err)
			})
		}
		read()
	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
	var self = this

	var resolve = self._resumeFetch
	if (resolve) {
		self._resumeFetch = null
		resolve()
	}
}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE || !xhr.response)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(16), __webpack_require__(29).Buffer, __webpack_require__(12)))

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("readable-stream");

/***/ }),
/* 34 */
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
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lunr__WEBPACK_IMPORTED_MODULE_1__);


try {
    // tslint:disable-next-line
    __webpack_require__(79); // bundle into worker
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
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
            resolveIndex(builder.build());
            return [2 /*return*/];
        });
    });
}
function toJS() {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        var _a;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
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
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
            store = state.store;
            resolveIndex(lunr__WEBPACK_IMPORTED_MODULE_1__["Index"].load(state.index));
            return [2 /*return*/];
        });
    });
}
function search(q, limit) {
    if (limit === void 0) { limit = 0; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
        var searchResults;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
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
/* 35 */
/***/ (function(module, exports) {

module.exports = require("slugify");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("styled-components");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("json-schema-ref-parser");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// @ts-check

var tslib_1 = __webpack_require__(1);
var fs = __webpack_require__(27);
var url = __webpack_require__(5);
var pathlib = __webpack_require__(13);
var maybe = __webpack_require__(43);
var fetch = __webpack_require__(11);
var yaml = __webpack_require__(11);
var jptr = __webpack_require__(17);
var resolveInternal = jptr.jptr;
var isRef = __webpack_require__(21).isRef;
var clone = __webpack_require__(18).clone;
var cclone = __webpack_require__(18).circularClone;
var recurse = __webpack_require__(22).recurse;
var resolver = __webpack_require__(44);
var sw = __webpack_require__(46);
var common = __webpack_require__(28);
var statusCodes = __webpack_require__(47).statusCodes;
var ourVersion = __webpack_require__(56).version;
// TODO handle specification-extensions with plugins?
var targetVersion = '3.0.0';
var componentNames; // initialised in main
var S2OError = /** @class */ (function (_super) {
    tslib_1.__extends(S2OError, _super);
    function S2OError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'S2OError';
        return _this;
    }
    return S2OError;
}(Error));
function throwError(message, options) {
    var err = new S2OError(message);
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
            // no-op
        }
        else if (obj[key] === '#/consumes') {
            // people are *so* creative
            delete obj[key];
            state.parent[state.pkey] = clone(options.openapi.consumes);
        }
        else if (obj[key] === '#/produces') {
            // and by creative, I mean devious
            delete obj[key];
            state.parent[state.pkey] = clone(options.openapi.produces);
        }
        else if (obj[key].startsWith('#/definitions/')) {
            //only the first part of a schema component name must be sanitised
            var keys = obj[key].replace('#/definitions/', '').split('/');
            var ref = jptr.jpunescape(keys[0]);
            var newKey = componentNames.schemas[decodeURIComponent(ref)]; // lookup, resolves a $ref
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
                            ((oldRef.indexOf('/x-') > schemaIndex) ? 'extensions' :
                                ((oldRef.indexOf('/parameters/') > schemaIndex) ? 'parameters' : 'schemas'))));
                // non-body/form parameters have not moved in the overall structure (like responses)
                // but extracting the requestBodies can cause the *number* of parameters to change
                if (type === 'schemas') {
                    fixUpSchema(target, options);
                }
                if ((type !== 'responses') && (type !== 'extensions')) {
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
        delete obj['x-miro'];
        // do this last - rework cases where $ref object has sibling properties
        if (Object.keys(obj).length > 1) {
            var tmpRef = obj[key];
            var inSchema = state.path.indexOf('/schema') >= 0; // not perfect, but in the absence of a reasonably-sized and complete OAS 2.0 parser...
            if (options.refSiblings === 'preserve') {
                // no-op
            }
            else if (inSchema && (options.refSiblings === 'allOf')) {
                delete obj.$ref;
                state.parent[state.pkey] = { allOf: [{ $ref: tmpRef }, obj] };
            }
            else { // remove, or not 'preserve' and not in a schema
                state.parent[state.pkey] = { $ref: tmpRef };
            }
        }
    }
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
        if (typeof scheme.tokenUrl === 'string')
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
function keepParameters(value) {
    return (value && !value["x-s2o-delete"]);
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
        if (header.items && header.items.type !== 'array') {
            if (header.items.collectionFormat !== header.collectionFormat) {
                throwOrWarn('Nested collectionFormats are not supported', header, options);
            }
            delete header.items.collectionFormat;
        }
        if (header.type === 'array') {
            if (header.collectionFormat === 'ssv') {
                throwOrWarn('collectionFormat:ssv is no longer supported for headers', header, options); // not lossless
            }
            else if (header.collectionFormat === 'pipes') {
                throwOrWarn('collectionFormat:pipes is no longer supported for headers', header, options); // not lossless
            }
            else if (header.collectionFormat === 'multi') {
                header.explode = true;
            }
            else if (header.collectionFormat === 'tsv') {
                throwOrWarn('collectionFormat:tsv is no longer supported', header, options); // not lossless
                header["x-collectionFormat"] = 'tsv';
            }
            else { // 'csv'
                header.style = 'simple';
            }
            delete header.collectionFormat;
        }
        else if (header.collectionFormat) {
            if (options.patch) {
                delete header.collectionFormat;
            }
            else {
                throwError('(Patchable) collectionFormat is only applicable to header.type array', options);
            }
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
function attachRequestBody(op, options) {
    var newOp = {};
    for (var _i = 0, _a = Object.keys(op); _i < _a.length; _i++) {
        var key = _a[_i];
        newOp[key] = op[key];
        if (key === 'parameters') {
            newOp.requestBody = {};
            if (options.rbname)
                newOp[options.rbname] = '';
        }
    }
    newOp.requestBody = {}; // just in case there are no parameters
    return newOp;
}
/**
 * @returns op, as it may have changed
 */
function processParameter(param, op, path, method, index, openapi, options) {
    var result = {};
    var singularRequestBody = true;
    var originalType;
    if (op && op.consumes && (typeof op.consumes === 'string')) {
        if (options.patch) {
            op.consumes = [op.consumes];
        }
        else {
            return throwError('(Patchable) operation.consumes must be an array', options);
        }
    }
    if (!Array.isArray(openapi.consumes))
        delete openapi.consumes;
    var consumes = ((op ? op.consumes : null) || (openapi.consumes || [])).filter(common.uniqueOnly);
    if (param && param.$ref && (typeof param.$ref === 'string')) {
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
    if (param && (param.name || param.in)) { // if it's a real parameter OR we've dereferenced it
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
        if (param.type === 'file') {
            param['x-s2o-originalType'] = param.type;
            originalType = param.type;
        }
        if (param.description && typeof param.description === 'object' && param.description.$ref) {
            // $ref anywhere sensibility
            param.description = resolveInternal(openapi, param.description.$ref);
        }
        if (param.description === null)
            delete param.description;
        var oldCollectionFormat_1 = param.collectionFormat;
        if ((param.type === 'array') && !oldCollectionFormat_1) {
            oldCollectionFormat_1 = 'csv';
        }
        if (oldCollectionFormat_1) {
            if (param.type != 'array') {
                if (options.patch) {
                    delete param.collectionFormat;
                }
                else {
                    throwError('(Patchable) collectionFormat is only applicable to param.type array', options);
                }
            }
            if ((oldCollectionFormat_1 === 'csv') && ((param.in === 'query') || (param.in === 'cookie'))) {
                param.style = 'form';
                param.explode = false;
            }
            if ((oldCollectionFormat_1 === 'csv') && ((param.in === 'path') || (param.in === 'header'))) {
                param.style = 'simple';
            }
            if (oldCollectionFormat_1 === 'ssv') {
                if (param.in === 'query') {
                    param.style = 'spaceDelimited';
                }
                else {
                    throwOrWarn('collectionFormat:ssv is no longer supported except for in:query parameters', param, options); // not lossless
                }
            }
            if (oldCollectionFormat_1 === 'pipes') {
                if (param.in === 'query') {
                    param.style = 'pipeDelimited';
                }
                else {
                    throwOrWarn('collectionFormat:pipes is no longer supported except for in:query parameters', param, options); // not lossless
                }
            }
            if (oldCollectionFormat_1 === 'multi') {
                param.explode = true;
            }
            if (oldCollectionFormat_1 === 'tsv') {
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
                        // items in 2.0 was a subset of the JSON-Schema items
                        // object, it gets fixed up below
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
    if (param && param.in === 'formData') {
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
                target.allOf = param.allOf; // new are anyOf, oneOf, not
            if ((param.type === 'array') && (param.items)) {
                target.items = param.items;
                if (target.items.collectionFormat)
                    delete target.items.collectionFormat;
            }
            if ((originalType === 'file') || (param['x-s2o-originalType'] === 'file')) {
                target.type = 'string';
                target.format = 'binary';
            }
            // Copy any extensions on the form param to the target schema property.
            copyExtensions(param, target);
        }
    }
    else if (param && param.type === 'file') {
        // convert to requestBody
        if (param.required)
            result.required = param.required;
        result.content = {};
        result.content["application/octet-stream"] = {};
        result.content["application/octet-stream"].schema = {};
        result.content["application/octet-stream"].schema.type = 'string';
        result.content["application/octet-stream"].schema.format = 'binary';
        copyExtensions(param, result);
    }
    if (param && param.in === 'body') {
        result.content = {};
        if (param.name)
            result['x-s2o-name'] = (op && op.operationId ? common.sanitiseAll(op.operationId) : '') + ('_' + param.name).toCamelCase();
        if (param.description)
            result.description = param.description;
        if (param.required)
            result.required = param.required;
        // Set the "request body name" extension on the operation if requested.
        if (op && options.rbname && param.name) {
            op[options.rbname] = param.name;
        }
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
            result.content[mimetype].schema = clone(param.schema || {});
            fixUpSchema(result.content[mimetype].schema, options);
        }
        // Copy any extensions from the original parameter to the new requestBody
        copyExtensions(param, result);
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
                if (!op.requestBody) {
                    op = path[method] = attachRequestBody(op, options); // make sure we have one
                }
                if ((op.requestBody.content && op.requestBody.content["multipart/form-data"])
                    && (op.requestBody.content["multipart/form-data"].schema) && (op.requestBody.content["multipart/form-data"].schema.properties) && (result.content["multipart/form-data"]) && (result.content["multipart/form-data"].schema) && (result.content["multipart/form-data"].schema.properties)) {
                    op.requestBody.content["multipart/form-data"].schema.properties =
                        Object.assign(op.requestBody.content["multipart/form-data"].schema.properties, result.content["multipart/form-data"].schema.properties);
                    op.requestBody.content["multipart/form-data"].schema.required = (op.requestBody.content["multipart/form-data"].schema.required || []).concat(result.content["multipart/form-data"].schema.required || []);
                    if (!op.requestBody.content["multipart/form-data"].schema.required.length) {
                        delete op.requestBody.content["multipart/form-data"].schema.required;
                    }
                }
                else if ((op.requestBody.content && op.requestBody.content["application/x-www-form-urlencoded"] && op.requestBody.content["application/x-www-form-urlencoded"].schema && op.requestBody.content["application/x-www-form-urlencoded"].schema.properties)
                    && result.content["application/x-www-form-urlencoded"] && result.content["application/x-www-form-urlencoded"].schema && result.content["application/x-www-form-urlencoded"].schema.properties) {
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
    if (param && !param['x-s2o-delete']) {
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
                throwError('(Patchable) path parameters must be required:true [' + param.name + ' in ' + index + ']', options);
            }
        }
    }
    return op;
}
function copyExtensions(src, tgt) {
    for (var prop in src) {
        if (prop.startsWith('x-') && !prop.startsWith('x-s2o')) {
            tgt[prop] = src[prop];
        }
    }
}
function processResponse(response, name, op, openapi, options) {
    if (!response)
        return false;
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
                if ((typeof response === 'object') && (!Array.isArray(response))) {
                    response.description = (statusCodes[response] || '');
                }
            }
            else {
                throwError('(Patchable) response.description is mandatory', options);
            }
        }
        if (typeof response.schema !== 'undefined') {
            fixUpSchema(response.schema, options);
            if (response.schema.$ref && (typeof response.schema.$ref === 'string') && response.schema.$ref.startsWith('#/responses/')) {
                response.schema.$ref = '#/components/responses/' + common.sanitise(decodeURIComponent(response.schema.$ref.replace('#/responses/', '')));
            }
            if (op && op.produces && (typeof op.produces === 'string')) {
                if (options.patch) {
                    op.produces = [op.produces];
                }
                else {
                    return throwError('(Patchable) operation.produces must be an array', options);
                }
            }
            if (openapi.produces && !Array.isArray(openapi.produces))
                delete openapi.produces;
            var produces = ((op ? op.produces : null) || (openapi.produces || [])).filter(common.uniqueOnly);
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
        if (path && (path['x-trace']) && (typeof path['x-trace'] === 'object')) {
            path.trace = path['x-trace'];
            delete path['x-trace'];
        }
        if (path && (path['x-summary']) && (typeof path['x-summary'] === 'string')) {
            path.summary = path['x-summary'];
            delete path['x-summary'];
        }
        if (path && (path['x-description']) && (typeof path['x-description'] === 'string')) {
            path.description = path['x-description'];
            delete path['x-description'];
        }
        if (path && (path['x-servers']) && (Array.isArray(path['x-servers']))) {
            path.servers = path['x-servers'];
            delete path['x-servers'];
        }
        for (var method in path) {
            if ((common.httpMethods.indexOf(method) >= 0) || (method === 'x-amazon-apigateway-any-method')) {
                var op = path[method];
                if (op && op.parameters && Array.isArray(op.parameters)) {
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
                                op = processParameter(param, op, path, method, p, openapi, options);
                                if (options.rbname && op[options.rbname] === '') {
                                    delete op[options.rbname];
                                }
                            }
                        };
                        for (var _i = 0, _a = path.parameters; _i < _a.length; _i++) {
                            var param = _a[_i];
                            _loop_1(param);
                        }
                    }
                    for (var _b = 0, _c = op.parameters; _b < _c.length; _b++) {
                        var param = _c[_b];
                        op = processParameter(param, op, path, method, method + ':' + p, openapi, options);
                    }
                    if (options.rbname && op[options.rbname] === '') {
                        delete op[options.rbname];
                    }
                    if (!options.debug) {
                        op.parameters = op.parameters.filter(keepParameters);
                    }
                }
                if (op && op.security)
                    processSecurity(op.security);
                //don't need to remove requestBody for non-supported ops as they "SHALL be ignored"
                // responses
                if (typeof op === 'object') {
                    if (!op.responses) {
                        var defaultResp = {};
                        defaultResp.description = 'Default response';
                        op.responses = { default: defaultResp };
                    }
                    for (var r in op.responses) {
                        var response = op.responses[r];
                        processResponse(response, r, op, openapi, options);
                    }
                }
                if (op && (op['x-servers']) && (Array.isArray(op['x-servers']))) {
                    op.servers = op['x-servers'];
                    delete op['x-servers'];
                }
                else if (op && op.schemes && op.schemes.length) {
                    for (var _d = 0, _e = op.schemes; _d < _e.length; _d++) {
                        var scheme = _e[_d];
                        if ((!openapi.schemes) || (openapi.schemes.indexOf(scheme) < 0)) {
                            if (!op.servers) {
                                op.servers = [];
                            }
                            if (Array.isArray(openapi.servers)) {
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
                }
                if (options.debug) {
                    op["x-s2o-consumes"] = op.consumes || [];
                    op["x-s2o-produces"] = op.produces || [];
                }
                if (op) {
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
        }
        if (path && path.parameters) {
            for (var p2 in path.parameters) {
                var param = path.parameters[p2];
                processParameter(param, null, path, null, p, openapi, options); // index here is the path string
            }
            if (!options.debug && Array.isArray(path.parameters)) {
                path.parameters = path.parameters.filter(keepParameters);
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
        processParameter(param, null, null, null, sname, openapi, options);
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
    if (!options.resolveInternal) {
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
    if (!server || !server.url || (typeof server.url !== 'string'))
        return server;
    server.url = server.url.split('{{').join('{');
    server.url = server.url.split('}}').join('}');
    server.url.replace(/\{(.+?)\}/g, function (match, group1) {
        if (!server.variables) {
            server.variables = {};
        }
        server.variables[group1] = { default: 'unknown' };
    });
    return server;
}
function fixInfo(openapi, options, reject) {
    if ((typeof openapi.info === 'undefined') || (openapi.info === null)) {
        if (options.patch) {
            openapi.info = { version: '', title: '' };
        }
        else {
            return reject(new S2OError('(Patchable) info object is mandatory'));
        }
    }
    if ((typeof openapi.info !== 'object') || (Array.isArray(openapi.info))) {
        return reject(new S2OError('info must be an object'));
    }
    if ((typeof openapi.info.title === 'undefined') || (openapi.info.title === null)) {
        if (options.patch) {
            openapi.info.title = '';
        }
        else {
            return reject(new S2OError('(Patchable) info.title cannot be null'));
        }
    }
    if ((typeof openapi.info.version === 'undefined') || (openapi.info.version === null)) {
        if (options.patch) {
            openapi.info.version = '';
        }
        else {
            return reject(new S2OError('(Patchable) info.version cannot be null'));
        }
    }
    if (typeof openapi.info.version !== 'string') {
        if (options.patch) {
            openapi.info.version = openapi.info.version.toString();
        }
        else {
            return reject(new S2OError('(Patchable) info.version must be a string'));
        }
    }
    if (typeof openapi.info.logo !== 'undefined') {
        if (options.patch) {
            openapi.info['x-logo'] = openapi.info.logo;
            delete openapi.info.logo;
        }
        else
            return reject(new S2OError('(Patchable) info should not have logo property'));
    }
    if (typeof openapi.info.termsOfService !== 'undefined') {
        if (openapi.info.termsOfService === null) {
            if (options.patch) {
                openapi.info.termsOfService = '';
            }
            else {
                return reject(new S2OError('(Patchable) info.termsOfService cannot be null'));
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
                    return reject(new S2OError('(Patchable) info.termsOfService must be a URL'));
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
            return reject(new S2OError('(Patchable) paths object is mandatory'));
        }
    }
}
function convertObj(swagger, options, callback) {
    return maybe(callback, new Promise(function (resolve, reject) {
        if (!swagger)
            swagger = {};
        options.original = swagger;
        if (!options.text)
            options.text = yaml.stringify(swagger);
        options.externals = [];
        options.externalRefs = {};
        options.rewriteRefs = true; // avoids stack explosions
        options.preserveMiro = true;
        options.promise = {};
        options.promise.resolve = resolve;
        options.promise.reject = reject;
        if (!options.cache)
            options.cache = {};
        if (options.source)
            options.cache[options.source] = options.original;
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
            return reject(new S2OError('Unsupported swagger/OpenAPI version: ' + (swagger.openapi ? swagger.openapi : swagger.swagger)));
        }
        var openapi = options.openapi = {};
        openapi.openapi = (typeof options.targetVersion === 'string' && options.targetVersion.startsWith('3.')) ? options.targetVersion : targetVersion; // semver
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
        recurse(openapi, {}, function (obj, key, state) {
            if ((obj[key] === null) && (!key.startsWith('x-')) && key !== 'default' && (state.path.indexOf('/example') < 0))
                delete obj[key]; // this saves *so* much grief later
        });
        if (swagger.host) {
            for (var _i = 0, _a = (Array.isArray(swagger.schemes) ? swagger.schemes : ['']); _i < _a.length; _i++) {
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
            var server_1 = {};
            server_1.url = xMsPHost.hostTemplate + (swagger.basePath ? swagger.basePath : '');
            server_1.variables = {};
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
                    server_1.variables[param.name] = param;
                    delete param.name;
                }
            }
            if (!openapi.servers)
                openapi.servers = [];
            if (xMsPHost.useSchemePrefix === false) {
                // The server URL already includes a protocol scheme
                openapi.servers.push(server_1);
            }
            else {
                // Define this server once for each given protocol scheme
                swagger.schemes.forEach(function (scheme) {
                    openapi.servers.push(Object.assign({}, server_1, { url: scheme + '://' + server_1.url }));
                });
            }
            delete openapi['x-ms-parameterized-host'];
        }
        fixInfo(openapi, options, reject);
        fixPaths(openapi, options, reject);
        if (typeof openapi.consumes === 'string') {
            openapi.consumes = [openapi.consumes];
        }
        if (typeof openapi.produces === 'string') {
            openapi.produces = [openapi.produces];
        }
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
            main(options.openapi, options);
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
        var error = null;
        try {
            obj = JSON.parse(str);
            options.text = JSON.stringify(obj, null, 2);
        }
        catch (ex) {
            error = ex;
            try {
                obj = yaml.parse(str, { schema: 'core', prettyErrors: true });
                options.sourceYaml = true;
                options.text = str;
            }
            catch (ex) {
                error = ex;
            }
        }
        if (obj) {
            convertObj(obj, options)
                .then(function (options) { return resolve(options); })
                .catch(function (ex) { return reject(ex); });
        }
        else {
            reject(new S2OError(error ? error.message : 'Could not parse string'));
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
            console.warn('GET ' + url);
        }
        fetch(url, { agent: options.agent }).then(function (res) {
            if (res.status !== 200)
                throw new S2OError("Received status code " + res.status);
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
    S2OError: S2OError,
    targetVersion: targetVersion,
    convert: convertObj,
    convertObj: convertObj,
    convertUrl: convertUrl,
    convertStr: convertStr,
    convertFile: convertFile,
    convertStream: convertStream
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (newInputs[i] !== lastInputs[i]) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

module.exports = memoizeOne;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("react-dropdown");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("dompurify");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("call-me-maybe");

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(1);
var fs = __webpack_require__(27);
var path = __webpack_require__(13);
var url = __webpack_require__(5);
var fetch = __webpack_require__(11);
var yaml = __webpack_require__(11);
var jptr = __webpack_require__(17).jptr;
var recurse = __webpack_require__(22).recurse;
var clone = __webpack_require__(18).clone;
var deRef = __webpack_require__(45).dereference;
var isRef = __webpack_require__(21).isRef;
var common = __webpack_require__(28);
function unique(arr) {
    return tslib_1.__spreadArrays(new Set(arr));
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
function resolveAllFragment(obj, context, src, parentPath, base, options) {
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
                            console.warn((target === false ? common.colour.red : common.colour.green) + 'Fragment resolution', obj[key], common.colour.normal);
                        /*
                            ResolutionCase:A is where there is a local reference in an externally
                            referenced document, and we have not seen it before. The reference
                            is replaced by a copy of the data pointed to, which may be outside this fragment
                            but within the context of the external document
                        */
                        if (target === false) {
                            state.parent[state.pkey] = {}; /* case:A(2) where the resolution fails */
                            if (options.fatal) {
                                var ex = new Error('Fragment $ref resolution failed ' + obj[key]);
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
                                console.warn('Replacing with', newRef);
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
                        console.warn(common.colour.yellow + 'Rewriting external url ref', obj[key], 'as', newRef, common.colour.normal);
                    obj['x-miro'] = obj[key];
                    obj[key] = newRef;
                }
                else if (!obj['x-miro']) {
                    var newRef = url.resolve(base, obj[key]).toString();
                    if (options.verbose > 1)
                        console.warn(common.colour.yellow + 'Rewriting external ref', obj[key], 'as', newRef, common.colour.normal);
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
        }
    });
    if (options.verbose > 1)
        console.warn('Finished fragment resolution');
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
function testProtocol(input, backup) {
    if (input && input.length > 2)
        return input;
    if (backup && backup.length > 2)
        return backup;
    return 'file:';
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
    var effectiveProtocol = testProtocol(u2.protocol, u.protocol);
    var target;
    if (effectiveProtocol === 'file:') {
        target = path.resolve(base ? base + '/' : '', pointer);
    }
    else {
        target = url.resolve(base ? base + '/' : '', pointer);
    }
    if (options.cache[target]) {
        if (options.verbose)
            console.warn('CACHED', target, fragment);
        /*
            resolutionSource:A this is where we have cached the externally-referenced document from a
            file, http or custom handler
        */
        var context = clone(options.cache[target]);
        var data = options.externalRef = context;
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
        data = resolveAllFragment(data, context, pointer, fragment, target, options);
        data = filterData(data, options);
        callback(clone(data), target, options);
        return Promise.resolve(data);
    }
    if (options.verbose)
        console.warn('GET', target, fragment);
    if (options.handlers && options.handlers[effectiveProtocol]) {
        return options.handlers[effectiveProtocol](base, pointer, fragment, options)
            .then(function (data) {
            options.externalRef = data;
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
                var context = yaml.parse(data, { schema: 'core', prettyErrors: true });
                data = options.externalRef = context;
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
                data = resolveAllFragment(data, context, pointer, fragment, target, options);
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
                var context = yaml.parse(data, { schema: 'core', prettyErrors: true });
                data = options.externalRef = context;
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
                data = resolveAllFragment(data, context, pointer, fragment, target, options);
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
        function inner(obj, key, state) {
            if (obj[key] && isRef(obj[key], '$ref')) {
                var $ref_1 = obj[key].$ref;
                if (!$ref_1.startsWith('#')) { // is external
                    var $extra = '';
                    if (!refs[$ref_1]) {
                        var potential = Object.keys(refs).find(function (e, i, a) {
                            return $ref_1.startsWith(e + '/');
                        });
                        if (potential) {
                            if (options.verbose)
                                console.warn('Found potential subschema at', potential);
                            $extra = '/' + ($ref_1.split('#')[1] || '').replace(potential.split('#')[1] || '');
                            $extra = $extra.split('/undefined').join(''); // FIXME
                            $ref_1 = potential;
                        }
                    }
                    if (!refs[$ref_1]) {
                        refs[$ref_1] = { resolved: false, paths: [], extras: {}, description: obj[key].description };
                    }
                    if (refs[$ref_1].resolved) {
                        if (options.rewriteRefs) {
                            // we've already seen it
                            var newRef = refs[$ref_1].resolvedAt;
                            if (options.verbose > 1)
                                console.warn('Rewriting ref', $ref_1, newRef);
                            obj[key]['x-miro'] = $ref_1;
                            obj[key].$ref = newRef + $extra; // resolutionCase:C (new string)
                        }
                        else {
                            obj[key] = clone(refs[$ref_1].data); // resolutionCase:D (cloned:yes)
                        }
                    }
                    else {
                        refs[$ref_1].paths.push(state.path);
                        refs[$ref_1].extras[state.path] = $extra;
                    }
                }
            }
        }
        var refs = options.externalRefs;
        if ((options.resolver.depth > 0) && (options.source === options.resolver.base)) {
            // we only need to do any of this when called directly on pass #1
            return res(refs);
        }
        recurse(options.openapi.definitions, { identityDetection: true, path: '#/definitions' }, inner);
        recurse(options.openapi.components, { identityDetection: true, path: '#/components' }, inner);
        recurse(options.openapi, { identityDetection: true }, inner);
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
                            pointers = pointers.sort(function (a, b) {
                                var aComp = (a.startsWith('#/components/') || a.startsWith('#/definitions/'));
                                var bComp = (b.startsWith('#/components/') || b.startsWith('#/definitions/'));
                                if (aComp && !bComp)
                                    return -1;
                                if (bComp && !aComp)
                                    return +1;
                                return 0;
                            });
                            for (var _i = 0, pointers_1 = pointers; _i < pointers_1.length; _i++) {
                                var ptr = pointers_1[_i];
                                // shared x-ms-examples $refs confuse the fixupRefs heuristic in index.js
                                if (refs[ref].resolvedAt && (ptr !== refs[ref].resolvedAt) && (ptr.indexOf('x-ms-examples/') < 0)) {
                                    if (options.verbose > 1)
                                        console.warn('Creating pointer to data at', ptr);
                                    jptr(options.openapi, ptr, { $ref: refs[ref].resolvedAt + refs[ref].extras[ptr], 'x-miro': ref + refs[ref].extras[ptr] }); // resolutionCase:E (new object)
                                }
                                else {
                                    if (refs[ref].resolvedAt) {
                                        if (options.verbose > 1)
                                            console.warn('Avoiding circular reference');
                                    }
                                    else {
                                        refs[ref].resolvedAt = ptr;
                                        if (options.verbose > 1)
                                            console.warn('Creating initial clone of data at', ptr);
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
                        console.warn(common.colour.yellow + 'Finished external resolution!', common.colour.normal);
                    if (options.resolveInternal) {
                        if (options.verbose > 1)
                            console.warn(common.colour.yellow + 'Starting internal resolution!', common.colour.normal);
                        options.openapi = deRef(options.openapi, options.original, { verbose: options.verbose - 1 });
                        if (options.verbose > 1)
                            console.warn(common.colour.yellow + 'Finished internal resolution!', common.colour.normal);
                    }
                    recurse(options.openapi, {}, function (obj, key, state) {
                        if (isRef(obj, key)) {
                            if (!options.preserveMiro)
                                delete obj['x-miro'];
                        }
                    });
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
        if (!srcUrl.protocol || srcUrl.protocol.length <= 2) { // windows drive-letters
            options.source = path.resolve(options.source);
        }
    }
    if (!options.externals)
        options.externals = [];
    if (!options.externalRefs)
        options.externalRefs = {};
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var recurse = __webpack_require__(22).recurse;
var clone = __webpack_require__(18).shallowClone;
var jptr = __webpack_require__(17).jptr;
var isRef = __webpack_require__(21).isRef;
var getLogger = function (options) {
    if (options && options.verbose) {
        return {
            warn: function () {
                var args = Array.prototype.slice.call(arguments);
                console.warn.apply(console, args);
            }
        };
    }
    else {
        return {
            warn: function () {
                //nop
            }
        };
    }
};
/**
* dereferences the given object
* @param o the object to dereference
* @definitions a source of definitions to reference
* @options optional settings (used recursively)
* @return the dereferenced object
*/
function dereference(o, definitions, options) {
    if (!options)
        options = {};
    if (!options.cache)
        options.cache = {};
    if (!options.state)
        options.state = {};
    options.state.identityDetection = true;
    // options.depth allows us to limit cloning to the first invocation
    options.depth = (options.depth ? options.depth + 1 : 1);
    var obj = (options.depth > 1 ? o : clone(o));
    var container = { data: obj };
    var defs = (options.depth > 1 ? definitions : clone(definitions));
    // options.master is the top level object, regardless of depth
    if (!options.master)
        options.master = obj;
    var logger = getLogger(options);
    var changes = 1;
    while (changes > 0) {
        changes = 0;
        recurse(container, options.state, function (obj, key, state) {
            if (isRef(obj, key)) {
                var $ref = obj[key]; // immutable
                changes++;
                if (!options.cache[$ref]) {
                    var entry = {};
                    entry.path = state.path.split('/$ref')[0];
                    entry.key = $ref;
                    logger.warn('Dereffing %s at %s', $ref, entry.path);
                    entry.source = defs;
                    entry.data = jptr(entry.source, entry.key);
                    if (entry.data === false) {
                        entry.data = jptr(options.master, entry.key);
                        entry.source = options.master;
                    }
                    if (entry.data === false) {
                        logger.warn('Missing $ref target', entry.key);
                    }
                    options.cache[$ref] = entry;
                    entry.data = state.parent[state.pkey] = dereference(jptr(entry.source, entry.key), entry.source, options);
                    if ((options.$ref) && (typeof state.parent[state.pkey] === 'object'))
                        state.parent[state.pkey][options.$ref] = $ref;
                    entry.resolved = true;
                }
                else {
                    var entry = options.cache[$ref];
                    if (entry.resolved) {
                        // we have already seen and resolved this reference
                        logger.warn('Patching %s for %s', $ref, entry.path);
                        state.parent[state.pkey] = entry.data;
                        if ((options.$ref) && (typeof state.parent[state.pkey] === 'object'))
                            state.parent[state.pkey][options.$ref] = $ref;
                    }
                    else if ($ref === entry.path) {
                        // reference to itself, throw
                        throw new Error("Tight circle at " + entry.path);
                    }
                    else {
                        // we're dealing with a circular reference here
                        logger.warn('Unresolved ref');
                        state.parent[state.pkey] = jptr(entry.source, entry.path);
                        if (state.parent[state.pkey] === false) {
                            state.parent[state.pkey] = jptr(entry.source, entry.key);
                        }
                        if ((options.$ref) && (typeof state.parent[state.pkey] === 'object'))
                            state.parent[options.$ref] = $ref;
                    }
                }
            }
        });
    }
    return container.data;
}
module.exports = {
    dereference: dereference
};


/***/ }),
/* 46 */
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
* begins the walk of a schema object
* @param parent the parent schema, if any. Use empty object if none
* @param state the initial starting state of the walker, usually obtained from `getDefaultState`. Use empty object to auto-initialise
* @param callback a function taking a schema, parent and state to be called on this and all subschemas
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var http = __webpack_require__(48);
var ours = {
    "default": "Default response",
    "1XX": "Informational",
    "103": "Early hints",
    "2XX": "Successful",
    "3XX": "Redirection",
    "4XX": "Client Error",
    "5XX": "Server Error",
    "7XX": "Developer Error" // April fools RFC
};
module.exports = {
    statusCodes: Object.assign({}, ours, http.STATUS_CODES)
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var ClientRequest = __webpack_require__(49)
var response = __webpack_require__(32)
var extend = __webpack_require__(54)
var statusCodes = __webpack_require__(55)
var url = __webpack_require__(5)

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var capability = __webpack_require__(30)
var inherits = __webpack_require__(31)
var response = __webpack_require__(32)
var stream = __webpack_require__(33)
var toArrayBuffer = __webpack_require__(53)

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary, useFetch) {
	if (capability.fetch && useFetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	var useFetch = true
	if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
		// If the use of XHR should be preferred. Not typically needed.
		useFetch = false
		preferBinary = true
	} else if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary, useFetch)
	self._fetchTimer = null

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var header = this._headers[name.toLowerCase()]
	if (header)
		return header.value
	return null
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body = null
	if (opts.method !== 'GET' && opts.method !== 'HEAD') {
		if (capability.arraybuffer) {
			body = toArrayBuffer(Buffer.concat(self._body))
		} else if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	// create flattened list of headers
	var headersList = []
	Object.keys(headersObj).forEach(function (keyName) {
		var name = headersObj[keyName].name
		var value = headersObj[keyName].value
		if (Array.isArray(value)) {
			value.forEach(function (v) {
				headersList.push([name, v])
			})
		} else {
			headersList.push([name, value])
		}
	})

	if (self._mode === 'fetch') {
		var signal = null
		var fetchTimer = null
		if (capability.abortController) {
			var controller = new AbortController()
			signal = controller.signal
			self._fetchAbortController = controller

			if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
				self._fetchTimer = global.setTimeout(function () {
					self.emit('requestTimeout')
					if (self._fetchAbortController)
						self._fetchAbortController.abort()
				}, opts.requestTimeout)
			}
		}

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headersList,
			body: body || undefined,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin',
			signal: signal
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			global.clearTimeout(self._fetchTimer)
			if (!self._destroyed)
				self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		if ('requestTimeout' in opts) {
			xhr.timeout = opts.requestTimeout
			xhr.ontimeout = function () {
				self.emit('requestTimeout')
			}
		}

		headersList.forEach(function (header) {
			xhr.setRequestHeader(header[0], header[1])
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
	self._response.on('error', function(err) {
		self.emit('error', err)
	})

	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	global.clearTimeout(self._fetchTimer)
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	else if (self._fetchAbortController)
		self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
]

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(29).Buffer, __webpack_require__(12), __webpack_require__(16)))

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("base64-js");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("ieee754");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("isarray");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("to-arraybuffer");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("xtend");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("builtin-status-codes");

/***/ }),
/* 56 */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"swagger2openapi\",\"version\":\"5.3.4\",\"description\":\"Convert Swagger 2.0 definitions to OpenApi 3.0 and validate\",\"main\":\"index.js\",\"bin\":{\"swagger2openapi\":\"./swagger2openapi.js\",\"oas-validate\":\"./oas-validate.js\",\"boast\":\"./boast.js\"},\"scripts\":{\"test\":\"mocha\"},\"browserify\":{\"transform\":[[\"babelify\",{\"presets\":[\"es2015\"]}]]},\"repository\":{\"url\":\"https://github.com/Mermade/oas-kit.git\",\"type\":\"git\"},\"bugs\":{\"url\":\"https://github.com/mermade/oas-kit/issues\"},\"author\":\"Mike Ralphson <mike.ralphson@gmail.com>\",\"license\":\"BSD-3-Clause\",\"dependencies\":{\"better-ajv-errors\":\"^0.6.1\",\"call-me-maybe\":\"^1.0.1\",\"node-fetch-h2\":\"^2.3.0\",\"node-readfiles\":\"^0.2.0\",\"oas-kit-common\":\"^1.0.7\",\"oas-resolver\":\"^2.2.8\",\"oas-schema-walker\":\"^1.1.3\",\"oas-validator\":\"^3.3.4\",\"reftools\":\"^1.0.11\",\"yaml\":\"^1.8.0\",\"yargs\":\"^12.0.5\"},\"keywords\":[\"swagger\",\"openapi\",\"openapi2\",\"openapi3\",\"converter\",\"conversion\",\"validator\",\"validation\",\"resolver\",\"lint\",\"linter\"],\"gitHead\":\"3c04d8c190507d806746d45042fcb8d579dfb237\"}");

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-bash.js");

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-c.js");

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-clike.js");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-coffeescript.js");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-cpp.js");

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-csharp.js");

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-go.js");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-http.js");

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-java.js");

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-lua.js");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-markup-templating.js");

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-markup.js");

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-objectivec.js");

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-perl.js");

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-php.js");

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-python.js");

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-ruby.js");

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-scala.js");

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-sql.js");

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = require("prismjs/components/prism-swift.js");

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {


				var addMethods = __webpack_require__(78)
				var methods = ["add","done","toJS","load","search"]
				module.exports = function() {
					var w = new Worker(URL.createObjectURL(new Blob(["/*!\n * ReDoc - OpenAPI/Swagger-generated API Reference Documentation\n * -------------------------------------------------------------\n *   Version: \"20.1.4\"\n *   Repo: https://github.com/Redocly/redoc\n */\n/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// define __esModule on exports\n/******/ \t__webpack_require__.r = function(exports) {\n/******/ \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t}\n/******/ \t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t};\n/******/\n/******/ \t// create a fake namespace object\n/******/ \t// mode & 1: value is a module id, require it\n/******/ \t// mode & 2: merge all properties of value into the ns\n/******/ \t// mode & 4: return value when already ns object\n/******/ \t// mode & 8|1: behave like require\n/******/ \t__webpack_require__.t = function(value, mode) {\n/******/ \t\tif(mode & 1) value = __webpack_require__(value);\n/******/ \t\tif(mode & 8) return value;\n/******/ \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n/******/ \t\tvar ns = Object.create(null);\n/******/ \t\t__webpack_require__.r(ns);\n/******/ \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n/******/ \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n/******/ \t\treturn ns;\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 97);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\n/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {\n  return it && it.Math == Math && it;\n};\n\n// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028\nmodule.exports =\n  // eslint-disable-next-line no-undef\n  check(typeof globalThis == 'object' && globalThis) ||\n  check(typeof window == 'object' && window) ||\n  check(typeof self == 'object' && self) ||\n  check(typeof global == 'object' && global) ||\n  // eslint-disable-next-line no-new-func\n  Function('return this')();\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(59)))\n\n/***/ }),\n/* 1 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar shared = __webpack_require__(32);\nvar has = __webpack_require__(3);\nvar uid = __webpack_require__(36);\nvar NATIVE_SYMBOL = __webpack_require__(37);\nvar USE_SYMBOL_AS_UID = __webpack_require__(60);\n\nvar WellKnownSymbolsStore = shared('wks');\nvar Symbol = global.Symbol;\nvar createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;\n\nmodule.exports = function (name) {\n  if (!has(WellKnownSymbolsStore, name)) {\n    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];\n    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);\n  } return WellKnownSymbolsStore[name];\n};\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(7);\n\nmodule.exports = function (it) {\n  if (!isObject(it)) {\n    throw TypeError(String(it) + ' is not an object');\n  } return it;\n};\n\n\n/***/ }),\n/* 3 */\n/***/ (function(module, exports) {\n\nvar hasOwnProperty = {}.hasOwnProperty;\n\nmodule.exports = function (it, key) {\n  return hasOwnProperty.call(it, key);\n};\n\n\n/***/ }),\n/* 4 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**\n * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.8\n * Copyright (C) 2019 Oliver Nightingale\n * @license MIT\n */\n\n;(function(){\n\n/**\n * A convenience function for configuring and constructing\n * a new lunr Index.\n *\n * A lunr.Builder instance is created and the pipeline setup\n * with a trimmer, stop word filter and stemmer.\n *\n * This builder object is yielded to the configuration function\n * that is passed as a parameter, allowing the list of fields\n * and other builder parameters to be customised.\n *\n * All documents _must_ be added within the passed config function.\n *\n * @example\n * var idx = lunr(function () {\n *   this.field('title')\n *   this.field('body')\n *   this.ref('id')\n *\n *   documents.forEach(function (doc) {\n *     this.add(doc)\n *   }, this)\n * })\n *\n * @see {@link lunr.Builder}\n * @see {@link lunr.Pipeline}\n * @see {@link lunr.trimmer}\n * @see {@link lunr.stopWordFilter}\n * @see {@link lunr.stemmer}\n * @namespace {function} lunr\n */\nvar lunr = function (config) {\n  var builder = new lunr.Builder\n\n  builder.pipeline.add(\n    lunr.trimmer,\n    lunr.stopWordFilter,\n    lunr.stemmer\n  )\n\n  builder.searchPipeline.add(\n    lunr.stemmer\n  )\n\n  config.call(builder, builder)\n  return builder.build()\n}\n\nlunr.version = \"2.3.8\"\n/*!\n * lunr.utils\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * A namespace containing utils for the rest of the lunr library\n * @namespace lunr.utils\n */\nlunr.utils = {}\n\n/**\n * Print a warning message to the console.\n *\n * @param {String} message The message to be printed.\n * @memberOf lunr.utils\n * @function\n */\nlunr.utils.warn = (function (global) {\n  /* eslint-disable no-console */\n  return function (message) {\n    if (global.console && console.warn) {\n      console.warn(message)\n    }\n  }\n  /* eslint-enable no-console */\n})(this)\n\n/**\n * Convert an object to a string.\n *\n * In the case of `null` and `undefined` the function returns\n * the empty string, in all other cases the result of calling\n * `toString` on the passed object is returned.\n *\n * @param {Any} obj The object to convert to a string.\n * @return {String} string representation of the passed object.\n * @memberOf lunr.utils\n */\nlunr.utils.asString = function (obj) {\n  if (obj === void 0 || obj === null) {\n    return \"\"\n  } else {\n    return obj.toString()\n  }\n}\n\n/**\n * Clones an object.\n *\n * Will create a copy of an existing object such that any mutations\n * on the copy cannot affect the original.\n *\n * Only shallow objects are supported, passing a nested object to this\n * function will cause a TypeError.\n *\n * Objects with primitives, and arrays of primitives are supported.\n *\n * @param {Object} obj The object to clone.\n * @return {Object} a clone of the passed object.\n * @throws {TypeError} when a nested object is passed.\n * @memberOf Utils\n */\nlunr.utils.clone = function (obj) {\n  if (obj === null || obj === undefined) {\n    return obj\n  }\n\n  var clone = Object.create(null),\n      keys = Object.keys(obj)\n\n  for (var i = 0; i < keys.length; i++) {\n    var key = keys[i],\n        val = obj[key]\n\n    if (Array.isArray(val)) {\n      clone[key] = val.slice()\n      continue\n    }\n\n    if (typeof val === 'string' ||\n        typeof val === 'number' ||\n        typeof val === 'boolean') {\n      clone[key] = val\n      continue\n    }\n\n    throw new TypeError(\"clone is not deep and does not support nested objects\")\n  }\n\n  return clone\n}\nlunr.FieldRef = function (docRef, fieldName, stringValue) {\n  this.docRef = docRef\n  this.fieldName = fieldName\n  this._stringValue = stringValue\n}\n\nlunr.FieldRef.joiner = \"/\"\n\nlunr.FieldRef.fromString = function (s) {\n  var n = s.indexOf(lunr.FieldRef.joiner)\n\n  if (n === -1) {\n    throw \"malformed field ref string\"\n  }\n\n  var fieldRef = s.slice(0, n),\n      docRef = s.slice(n + 1)\n\n  return new lunr.FieldRef (docRef, fieldRef, s)\n}\n\nlunr.FieldRef.prototype.toString = function () {\n  if (this._stringValue == undefined) {\n    this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef\n  }\n\n  return this._stringValue\n}\n/*!\n * lunr.Set\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * A lunr set.\n *\n * @constructor\n */\nlunr.Set = function (elements) {\n  this.elements = Object.create(null)\n\n  if (elements) {\n    this.length = elements.length\n\n    for (var i = 0; i < this.length; i++) {\n      this.elements[elements[i]] = true\n    }\n  } else {\n    this.length = 0\n  }\n}\n\n/**\n * A complete set that contains all elements.\n *\n * @static\n * @readonly\n * @type {lunr.Set}\n */\nlunr.Set.complete = {\n  intersect: function (other) {\n    return other\n  },\n\n  union: function (other) {\n    return other\n  },\n\n  contains: function () {\n    return true\n  }\n}\n\n/**\n * An empty set that contains no elements.\n *\n * @static\n * @readonly\n * @type {lunr.Set}\n */\nlunr.Set.empty = {\n  intersect: function () {\n    return this\n  },\n\n  union: function (other) {\n    return other\n  },\n\n  contains: function () {\n    return false\n  }\n}\n\n/**\n * Returns true if this set contains the specified object.\n *\n * @param {object} object - Object whose presence in this set is to be tested.\n * @returns {boolean} - True if this set contains the specified object.\n */\nlunr.Set.prototype.contains = function (object) {\n  return !!this.elements[object]\n}\n\n/**\n * Returns a new set containing only the elements that are present in both\n * this set and the specified set.\n *\n * @param {lunr.Set} other - set to intersect with this set.\n * @returns {lunr.Set} a new set that is the intersection of this and the specified set.\n */\n\nlunr.Set.prototype.intersect = function (other) {\n  var a, b, elements, intersection = []\n\n  if (other === lunr.Set.complete) {\n    return this\n  }\n\n  if (other === lunr.Set.empty) {\n    return other\n  }\n\n  if (this.length < other.length) {\n    a = this\n    b = other\n  } else {\n    a = other\n    b = this\n  }\n\n  elements = Object.keys(a.elements)\n\n  for (var i = 0; i < elements.length; i++) {\n    var element = elements[i]\n    if (element in b.elements) {\n      intersection.push(element)\n    }\n  }\n\n  return new lunr.Set (intersection)\n}\n\n/**\n * Returns a new set combining the elements of this and the specified set.\n *\n * @param {lunr.Set} other - set to union with this set.\n * @return {lunr.Set} a new set that is the union of this and the specified set.\n */\n\nlunr.Set.prototype.union = function (other) {\n  if (other === lunr.Set.complete) {\n    return lunr.Set.complete\n  }\n\n  if (other === lunr.Set.empty) {\n    return this\n  }\n\n  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))\n}\n/**\n * A function to calculate the inverse document frequency for\n * a posting. This is shared between the builder and the index\n *\n * @private\n * @param {object} posting - The posting for a given term\n * @param {number} documentCount - The total number of documents.\n */\nlunr.idf = function (posting, documentCount) {\n  var documentsWithTerm = 0\n\n  for (var fieldName in posting) {\n    if (fieldName == '_index') continue // Ignore the term index, its not a field\n    documentsWithTerm += Object.keys(posting[fieldName]).length\n  }\n\n  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)\n\n  return Math.log(1 + Math.abs(x))\n}\n\n/**\n * A token wraps a string representation of a token\n * as it is passed through the text processing pipeline.\n *\n * @constructor\n * @param {string} [str=''] - The string token being wrapped.\n * @param {object} [metadata={}] - Metadata associated with this token.\n */\nlunr.Token = function (str, metadata) {\n  this.str = str || \"\"\n  this.metadata = metadata || {}\n}\n\n/**\n * Returns the token string that is being wrapped by this object.\n *\n * @returns {string}\n */\nlunr.Token.prototype.toString = function () {\n  return this.str\n}\n\n/**\n * A token update function is used when updating or optionally\n * when cloning a token.\n *\n * @callback lunr.Token~updateFunction\n * @param {string} str - The string representation of the token.\n * @param {Object} metadata - All metadata associated with this token.\n */\n\n/**\n * Applies the given function to the wrapped string token.\n *\n * @example\n * token.update(function (str, metadata) {\n *   return str.toUpperCase()\n * })\n *\n * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.\n * @returns {lunr.Token}\n */\nlunr.Token.prototype.update = function (fn) {\n  this.str = fn(this.str, this.metadata)\n  return this\n}\n\n/**\n * Creates a clone of this token. Optionally a function can be\n * applied to the cloned token.\n *\n * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.\n * @returns {lunr.Token}\n */\nlunr.Token.prototype.clone = function (fn) {\n  fn = fn || function (s) { return s }\n  return new lunr.Token (fn(this.str, this.metadata), this.metadata)\n}\n/*!\n * lunr.tokenizer\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * A function for splitting a string into tokens ready to be inserted into\n * the search index. Uses `lunr.tokenizer.separator` to split strings, change\n * the value of this property to change how strings are split into tokens.\n *\n * This tokenizer will convert its parameter to a string by calling `toString` and\n * then will split this string on the character in `lunr.tokenizer.separator`.\n * Arrays will have their elements converted to strings and wrapped in a lunr.Token.\n *\n * Optional metadata can be passed to the tokenizer, this metadata will be cloned and\n * added as metadata to every token that is created from the object to be tokenized.\n *\n * @static\n * @param {?(string|object|object[])} obj - The object to convert into tokens\n * @param {?object} metadata - Optional metadata to associate with every token\n * @returns {lunr.Token[]}\n * @see {@link lunr.Pipeline}\n */\nlunr.tokenizer = function (obj, metadata) {\n  if (obj == null || obj == undefined) {\n    return []\n  }\n\n  if (Array.isArray(obj)) {\n    return obj.map(function (t) {\n      return new lunr.Token(\n        lunr.utils.asString(t).toLowerCase(),\n        lunr.utils.clone(metadata)\n      )\n    })\n  }\n\n  var str = obj.toString().toLowerCase(),\n      len = str.length,\n      tokens = []\n\n  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {\n    var char = str.charAt(sliceEnd),\n        sliceLength = sliceEnd - sliceStart\n\n    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {\n\n      if (sliceLength > 0) {\n        var tokenMetadata = lunr.utils.clone(metadata) || {}\n        tokenMetadata[\"position\"] = [sliceStart, sliceLength]\n        tokenMetadata[\"index\"] = tokens.length\n\n        tokens.push(\n          new lunr.Token (\n            str.slice(sliceStart, sliceEnd),\n            tokenMetadata\n          )\n        )\n      }\n\n      sliceStart = sliceEnd + 1\n    }\n\n  }\n\n  return tokens\n}\n\n/**\n * The separator used to split a string into tokens. Override this property to change the behaviour of\n * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.\n *\n * @static\n * @see lunr.tokenizer\n */\nlunr.tokenizer.separator = /[\\s\\-]+/\n/*!\n * lunr.Pipeline\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * lunr.Pipelines maintain an ordered list of functions to be applied to all\n * tokens in documents entering the search index and queries being ran against\n * the index.\n *\n * An instance of lunr.Index created with the lunr shortcut will contain a\n * pipeline with a stop word filter and an English language stemmer. Extra\n * functions can be added before or after either of these functions or these\n * default functions can be removed.\n *\n * When run the pipeline will call each function in turn, passing a token, the\n * index of that token in the original list of all tokens and finally a list of\n * all the original tokens.\n *\n * The output of functions in the pipeline will be passed to the next function\n * in the pipeline. To exclude a token from entering the index the function\n * should return undefined, the rest of the pipeline will not be called with\n * this token.\n *\n * For serialisation of pipelines to work, all functions used in an instance of\n * a pipeline should be registered with lunr.Pipeline. Registered functions can\n * then be loaded. If trying to load a serialised pipeline that uses functions\n * that are not registered an error will be thrown.\n *\n * If not planning on serialising the pipeline then registering pipeline functions\n * is not necessary.\n *\n * @constructor\n */\nlunr.Pipeline = function () {\n  this._stack = []\n}\n\nlunr.Pipeline.registeredFunctions = Object.create(null)\n\n/**\n * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token\n * string as well as all known metadata. A pipeline function can mutate the token string\n * or mutate (or add) metadata for a given token.\n *\n * A pipeline function can indicate that the passed token should be discarded by returning\n * null, undefined or an empty string. This token will not be passed to any downstream pipeline\n * functions and will not be added to the index.\n *\n * Multiple tokens can be returned by returning an array of tokens. Each token will be passed\n * to any downstream pipeline functions and all will returned tokens will be added to the index.\n *\n * Any number of pipeline functions may be chained together using a lunr.Pipeline.\n *\n * @interface lunr.PipelineFunction\n * @param {lunr.Token} token - A token from the document being processed.\n * @param {number} i - The index of this token in the complete list of tokens for this document/field.\n * @param {lunr.Token[]} tokens - All tokens for this document/field.\n * @returns {(?lunr.Token|lunr.Token[])}\n */\n\n/**\n * Register a function with the pipeline.\n *\n * Functions that are used in the pipeline should be registered if the pipeline\n * needs to be serialised, or a serialised pipeline needs to be loaded.\n *\n * Registering a function does not add it to a pipeline, functions must still be\n * added to instances of the pipeline for them to be used when running a pipeline.\n *\n * @param {lunr.PipelineFunction} fn - The function to check for.\n * @param {String} label - The label to register this function with\n */\nlunr.Pipeline.registerFunction = function (fn, label) {\n  if (label in this.registeredFunctions) {\n    lunr.utils.warn('Overwriting existing registered function: ' + label)\n  }\n\n  fn.label = label\n  lunr.Pipeline.registeredFunctions[fn.label] = fn\n}\n\n/**\n * Warns if the function is not registered as a Pipeline function.\n *\n * @param {lunr.PipelineFunction} fn - The function to check for.\n * @private\n */\nlunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {\n  var isRegistered = fn.label && (fn.label in this.registeredFunctions)\n\n  if (!isRegistered) {\n    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\\n', fn)\n  }\n}\n\n/**\n * Loads a previously serialised pipeline.\n *\n * All functions to be loaded must already be registered with lunr.Pipeline.\n * If any function from the serialised data has not been registered then an\n * error will be thrown.\n *\n * @param {Object} serialised - The serialised pipeline to load.\n * @returns {lunr.Pipeline}\n */\nlunr.Pipeline.load = function (serialised) {\n  var pipeline = new lunr.Pipeline\n\n  serialised.forEach(function (fnName) {\n    var fn = lunr.Pipeline.registeredFunctions[fnName]\n\n    if (fn) {\n      pipeline.add(fn)\n    } else {\n      throw new Error('Cannot load unregistered function: ' + fnName)\n    }\n  })\n\n  return pipeline\n}\n\n/**\n * Adds new functions to the end of the pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.\n */\nlunr.Pipeline.prototype.add = function () {\n  var fns = Array.prototype.slice.call(arguments)\n\n  fns.forEach(function (fn) {\n    lunr.Pipeline.warnIfFunctionNotRegistered(fn)\n    this._stack.push(fn)\n  }, this)\n}\n\n/**\n * Adds a single function after a function that already exists in the\n * pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.\n * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.\n */\nlunr.Pipeline.prototype.after = function (existingFn, newFn) {\n  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)\n\n  var pos = this._stack.indexOf(existingFn)\n  if (pos == -1) {\n    throw new Error('Cannot find existingFn')\n  }\n\n  pos = pos + 1\n  this._stack.splice(pos, 0, newFn)\n}\n\n/**\n * Adds a single function before a function that already exists in the\n * pipeline.\n *\n * Logs a warning if the function has not been registered.\n *\n * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.\n * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.\n */\nlunr.Pipeline.prototype.before = function (existingFn, newFn) {\n  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)\n\n  var pos = this._stack.indexOf(existingFn)\n  if (pos == -1) {\n    throw new Error('Cannot find existingFn')\n  }\n\n  this._stack.splice(pos, 0, newFn)\n}\n\n/**\n * Removes a function from the pipeline.\n *\n * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.\n */\nlunr.Pipeline.prototype.remove = function (fn) {\n  var pos = this._stack.indexOf(fn)\n  if (pos == -1) {\n    return\n  }\n\n  this._stack.splice(pos, 1)\n}\n\n/**\n * Runs the current list of functions that make up the pipeline against the\n * passed tokens.\n *\n * @param {Array} tokens The tokens to run through the pipeline.\n * @returns {Array}\n */\nlunr.Pipeline.prototype.run = function (tokens) {\n  var stackLength = this._stack.length\n\n  for (var i = 0; i < stackLength; i++) {\n    var fn = this._stack[i]\n    var memo = []\n\n    for (var j = 0; j < tokens.length; j++) {\n      var result = fn(tokens[j], j, tokens)\n\n      if (result === null || result === void 0 || result === '') continue\n\n      if (Array.isArray(result)) {\n        for (var k = 0; k < result.length; k++) {\n          memo.push(result[k])\n        }\n      } else {\n        memo.push(result)\n      }\n    }\n\n    tokens = memo\n  }\n\n  return tokens\n}\n\n/**\n * Convenience method for passing a string through a pipeline and getting\n * strings out. This method takes care of wrapping the passed string in a\n * token and mapping the resulting tokens back to strings.\n *\n * @param {string} str - The string to pass through the pipeline.\n * @param {?object} metadata - Optional metadata to associate with the token\n * passed to the pipeline.\n * @returns {string[]}\n */\nlunr.Pipeline.prototype.runString = function (str, metadata) {\n  var token = new lunr.Token (str, metadata)\n\n  return this.run([token]).map(function (t) {\n    return t.toString()\n  })\n}\n\n/**\n * Resets the pipeline by removing any existing processors.\n *\n */\nlunr.Pipeline.prototype.reset = function () {\n  this._stack = []\n}\n\n/**\n * Returns a representation of the pipeline ready for serialisation.\n *\n * Logs a warning if the function has not been registered.\n *\n * @returns {Array}\n */\nlunr.Pipeline.prototype.toJSON = function () {\n  return this._stack.map(function (fn) {\n    lunr.Pipeline.warnIfFunctionNotRegistered(fn)\n\n    return fn.label\n  })\n}\n/*!\n * lunr.Vector\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * A vector is used to construct the vector space of documents and queries. These\n * vectors support operations to determine the similarity between two documents or\n * a document and a query.\n *\n * Normally no parameters are required for initializing a vector, but in the case of\n * loading a previously dumped vector the raw elements can be provided to the constructor.\n *\n * For performance reasons vectors are implemented with a flat array, where an elements\n * index is immediately followed by its value. E.g. [index, value, index, value]. This\n * allows the underlying array to be as sparse as possible and still offer decent\n * performance when being used for vector calculations.\n *\n * @constructor\n * @param {Number[]} [elements] - The flat list of element index and element value pairs.\n */\nlunr.Vector = function (elements) {\n  this._magnitude = 0\n  this.elements = elements || []\n}\n\n\n/**\n * Calculates the position within the vector to insert a given index.\n *\n * This is used internally by insert and upsert. If there are duplicate indexes then\n * the position is returned as if the value for that index were to be updated, but it\n * is the callers responsibility to check whether there is a duplicate at that index\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @returns {Number}\n */\nlunr.Vector.prototype.positionForIndex = function (index) {\n  // For an empty vector the tuple can be inserted at the beginning\n  if (this.elements.length == 0) {\n    return 0\n  }\n\n  var start = 0,\n      end = this.elements.length / 2,\n      sliceLength = end - start,\n      pivotPoint = Math.floor(sliceLength / 2),\n      pivotIndex = this.elements[pivotPoint * 2]\n\n  while (sliceLength > 1) {\n    if (pivotIndex < index) {\n      start = pivotPoint\n    }\n\n    if (pivotIndex > index) {\n      end = pivotPoint\n    }\n\n    if (pivotIndex == index) {\n      break\n    }\n\n    sliceLength = end - start\n    pivotPoint = start + Math.floor(sliceLength / 2)\n    pivotIndex = this.elements[pivotPoint * 2]\n  }\n\n  if (pivotIndex == index) {\n    return pivotPoint * 2\n  }\n\n  if (pivotIndex > index) {\n    return pivotPoint * 2\n  }\n\n  if (pivotIndex < index) {\n    return (pivotPoint + 1) * 2\n  }\n}\n\n/**\n * Inserts an element at an index within the vector.\n *\n * Does not allow duplicates, will throw an error if there is already an entry\n * for this index.\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @param {Number} val - The value to be inserted into the vector.\n */\nlunr.Vector.prototype.insert = function (insertIdx, val) {\n  this.upsert(insertIdx, val, function () {\n    throw \"duplicate index\"\n  })\n}\n\n/**\n * Inserts or updates an existing index within the vector.\n *\n * @param {Number} insertIdx - The index at which the element should be inserted.\n * @param {Number} val - The value to be inserted into the vector.\n * @param {function} fn - A function that is called for updates, the existing value and the\n * requested value are passed as arguments\n */\nlunr.Vector.prototype.upsert = function (insertIdx, val, fn) {\n  this._magnitude = 0\n  var position = this.positionForIndex(insertIdx)\n\n  if (this.elements[position] == insertIdx) {\n    this.elements[position + 1] = fn(this.elements[position + 1], val)\n  } else {\n    this.elements.splice(position, 0, insertIdx, val)\n  }\n}\n\n/**\n * Calculates the magnitude of this vector.\n *\n * @returns {Number}\n */\nlunr.Vector.prototype.magnitude = function () {\n  if (this._magnitude) return this._magnitude\n\n  var sumOfSquares = 0,\n      elementsLength = this.elements.length\n\n  for (var i = 1; i < elementsLength; i += 2) {\n    var val = this.elements[i]\n    sumOfSquares += val * val\n  }\n\n  return this._magnitude = Math.sqrt(sumOfSquares)\n}\n\n/**\n * Calculates the dot product of this vector and another vector.\n *\n * @param {lunr.Vector} otherVector - The vector to compute the dot product with.\n * @returns {Number}\n */\nlunr.Vector.prototype.dot = function (otherVector) {\n  var dotProduct = 0,\n      a = this.elements, b = otherVector.elements,\n      aLen = a.length, bLen = b.length,\n      aVal = 0, bVal = 0,\n      i = 0, j = 0\n\n  while (i < aLen && j < bLen) {\n    aVal = a[i], bVal = b[j]\n    if (aVal < bVal) {\n      i += 2\n    } else if (aVal > bVal) {\n      j += 2\n    } else if (aVal == bVal) {\n      dotProduct += a[i + 1] * b[j + 1]\n      i += 2\n      j += 2\n    }\n  }\n\n  return dotProduct\n}\n\n/**\n * Calculates the similarity between this vector and another vector.\n *\n * @param {lunr.Vector} otherVector - The other vector to calculate the\n * similarity with.\n * @returns {Number}\n */\nlunr.Vector.prototype.similarity = function (otherVector) {\n  return this.dot(otherVector) / this.magnitude() || 0\n}\n\n/**\n * Converts the vector to an array of the elements within the vector.\n *\n * @returns {Number[]}\n */\nlunr.Vector.prototype.toArray = function () {\n  var output = new Array (this.elements.length / 2)\n\n  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {\n    output[j] = this.elements[i]\n  }\n\n  return output\n}\n\n/**\n * A JSON serializable representation of the vector.\n *\n * @returns {Number[]}\n */\nlunr.Vector.prototype.toJSON = function () {\n  return this.elements\n}\n/* eslint-disable */\n/*!\n * lunr.stemmer\n * Copyright (C) 2019 Oliver Nightingale\n * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt\n */\n\n/**\n * lunr.stemmer is an english language stemmer, this is a JavaScript\n * implementation of the PorterStemmer taken from http://tartarus.org/~martin\n *\n * @static\n * @implements {lunr.PipelineFunction}\n * @param {lunr.Token} token - The string to stem\n * @returns {lunr.Token}\n * @see {@link lunr.Pipeline}\n * @function\n */\nlunr.stemmer = (function(){\n  var step2list = {\n      \"ational\" : \"ate\",\n      \"tional\" : \"tion\",\n      \"enci\" : \"ence\",\n      \"anci\" : \"ance\",\n      \"izer\" : \"ize\",\n      \"bli\" : \"ble\",\n      \"alli\" : \"al\",\n      \"entli\" : \"ent\",\n      \"eli\" : \"e\",\n      \"ousli\" : \"ous\",\n      \"ization\" : \"ize\",\n      \"ation\" : \"ate\",\n      \"ator\" : \"ate\",\n      \"alism\" : \"al\",\n      \"iveness\" : \"ive\",\n      \"fulness\" : \"ful\",\n      \"ousness\" : \"ous\",\n      \"aliti\" : \"al\",\n      \"iviti\" : \"ive\",\n      \"biliti\" : \"ble\",\n      \"logi\" : \"log\"\n    },\n\n    step3list = {\n      \"icate\" : \"ic\",\n      \"ative\" : \"\",\n      \"alize\" : \"al\",\n      \"iciti\" : \"ic\",\n      \"ical\" : \"ic\",\n      \"ful\" : \"\",\n      \"ness\" : \"\"\n    },\n\n    c = \"[^aeiou]\",          // consonant\n    v = \"[aeiouy]\",          // vowel\n    C = c + \"[^aeiouy]*\",    // consonant sequence\n    V = v + \"[aeiou]*\",      // vowel sequence\n\n    mgr0 = \"^(\" + C + \")?\" + V + C,               // [C]VC... is m>0\n    meq1 = \"^(\" + C + \")?\" + V + C + \"(\" + V + \")?$\",  // [C]VC[V] is m=1\n    mgr1 = \"^(\" + C + \")?\" + V + C + V + C,       // [C]VCVC... is m>1\n    s_v = \"^(\" + C + \")?\" + v;                   // vowel in stem\n\n  var re_mgr0 = new RegExp(mgr0);\n  var re_mgr1 = new RegExp(mgr1);\n  var re_meq1 = new RegExp(meq1);\n  var re_s_v = new RegExp(s_v);\n\n  var re_1a = /^(.+?)(ss|i)es$/;\n  var re2_1a = /^(.+?)([^s])s$/;\n  var re_1b = /^(.+?)eed$/;\n  var re2_1b = /^(.+?)(ed|ing)$/;\n  var re_1b_2 = /.$/;\n  var re2_1b_2 = /(at|bl|iz)$/;\n  var re3_1b_2 = new RegExp(\"([^aeiouylsz])\\\\1$\");\n  var re4_1b_2 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n\n  var re_1c = /^(.+?[^aeiou])y$/;\n  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;\n\n  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;\n\n  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;\n  var re2_4 = /^(.+?)(s|t)(ion)$/;\n\n  var re_5 = /^(.+?)e$/;\n  var re_5_1 = /ll$/;\n  var re3_5 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n\n  var porterStemmer = function porterStemmer(w) {\n    var stem,\n      suffix,\n      firstch,\n      re,\n      re2,\n      re3,\n      re4;\n\n    if (w.length < 3) { return w; }\n\n    firstch = w.substr(0,1);\n    if (firstch == \"y\") {\n      w = firstch.toUpperCase() + w.substr(1);\n    }\n\n    // Step 1a\n    re = re_1a\n    re2 = re2_1a;\n\n    if (re.test(w)) { w = w.replace(re,\"$1$2\"); }\n    else if (re2.test(w)) { w = w.replace(re2,\"$1$2\"); }\n\n    // Step 1b\n    re = re_1b;\n    re2 = re2_1b;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      re = re_mgr0;\n      if (re.test(fp[1])) {\n        re = re_1b_2;\n        w = w.replace(re,\"\");\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1];\n      re2 = re_s_v;\n      if (re2.test(stem)) {\n        w = stem;\n        re2 = re2_1b_2;\n        re3 = re3_1b_2;\n        re4 = re4_1b_2;\n        if (re2.test(w)) { w = w + \"e\"; }\n        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,\"\"); }\n        else if (re4.test(w)) { w = w + \"e\"; }\n      }\n    }\n\n    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)\n    re = re_1c;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      w = stem + \"i\";\n    }\n\n    // Step 2\n    re = re_2;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = re_mgr0;\n      if (re.test(stem)) {\n        w = stem + step2list[suffix];\n      }\n    }\n\n    // Step 3\n    re = re_3;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = re_mgr0;\n      if (re.test(stem)) {\n        w = stem + step3list[suffix];\n      }\n    }\n\n    // Step 4\n    re = re_4;\n    re2 = re2_4;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = re_mgr1;\n      if (re.test(stem)) {\n        w = stem;\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1] + fp[2];\n      re2 = re_mgr1;\n      if (re2.test(stem)) {\n        w = stem;\n      }\n    }\n\n    // Step 5\n    re = re_5;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = re_mgr1;\n      re2 = re_meq1;\n      re3 = re3_5;\n      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {\n        w = stem;\n      }\n    }\n\n    re = re_5_1;\n    re2 = re_mgr1;\n    if (re.test(w) && re2.test(w)) {\n      re = re_1b_2;\n      w = w.replace(re,\"\");\n    }\n\n    // and turn initial Y back to y\n\n    if (firstch == \"y\") {\n      w = firstch.toLowerCase() + w.substr(1);\n    }\n\n    return w;\n  };\n\n  return function (token) {\n    return token.update(porterStemmer);\n  }\n})();\n\nlunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')\n/*!\n * lunr.stopWordFilter\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * lunr.generateStopWordFilter builds a stopWordFilter function from the provided\n * list of stop words.\n *\n * The built in lunr.stopWordFilter is built using this generator and can be used\n * to generate custom stopWordFilters for applications or non English languages.\n *\n * @function\n * @param {Array} token The token to pass through the filter\n * @returns {lunr.PipelineFunction}\n * @see lunr.Pipeline\n * @see lunr.stopWordFilter\n */\nlunr.generateStopWordFilter = function (stopWords) {\n  var words = stopWords.reduce(function (memo, stopWord) {\n    memo[stopWord] = stopWord\n    return memo\n  }, {})\n\n  return function (token) {\n    if (token && words[token.toString()] !== token.toString()) return token\n  }\n}\n\n/**\n * lunr.stopWordFilter is an English language stop word list filter, any words\n * contained in the list will not be passed through the filter.\n *\n * This is intended to be used in the Pipeline. If the token does not pass the\n * filter then undefined will be returned.\n *\n * @function\n * @implements {lunr.PipelineFunction}\n * @params {lunr.Token} token - A token to check for being a stop word.\n * @returns {lunr.Token}\n * @see {@link lunr.Pipeline}\n */\nlunr.stopWordFilter = lunr.generateStopWordFilter([\n  'a',\n  'able',\n  'about',\n  'across',\n  'after',\n  'all',\n  'almost',\n  'also',\n  'am',\n  'among',\n  'an',\n  'and',\n  'any',\n  'are',\n  'as',\n  'at',\n  'be',\n  'because',\n  'been',\n  'but',\n  'by',\n  'can',\n  'cannot',\n  'could',\n  'dear',\n  'did',\n  'do',\n  'does',\n  'either',\n  'else',\n  'ever',\n  'every',\n  'for',\n  'from',\n  'get',\n  'got',\n  'had',\n  'has',\n  'have',\n  'he',\n  'her',\n  'hers',\n  'him',\n  'his',\n  'how',\n  'however',\n  'i',\n  'if',\n  'in',\n  'into',\n  'is',\n  'it',\n  'its',\n  'just',\n  'least',\n  'let',\n  'like',\n  'likely',\n  'may',\n  'me',\n  'might',\n  'most',\n  'must',\n  'my',\n  'neither',\n  'no',\n  'nor',\n  'not',\n  'of',\n  'off',\n  'often',\n  'on',\n  'only',\n  'or',\n  'other',\n  'our',\n  'own',\n  'rather',\n  'said',\n  'say',\n  'says',\n  'she',\n  'should',\n  'since',\n  'so',\n  'some',\n  'than',\n  'that',\n  'the',\n  'their',\n  'them',\n  'then',\n  'there',\n  'these',\n  'they',\n  'this',\n  'tis',\n  'to',\n  'too',\n  'twas',\n  'us',\n  'wants',\n  'was',\n  'we',\n  'were',\n  'what',\n  'when',\n  'where',\n  'which',\n  'while',\n  'who',\n  'whom',\n  'why',\n  'will',\n  'with',\n  'would',\n  'yet',\n  'you',\n  'your'\n])\n\nlunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')\n/*!\n * lunr.trimmer\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * lunr.trimmer is a pipeline function for trimming non word\n * characters from the beginning and end of tokens before they\n * enter the index.\n *\n * This implementation may not work correctly for non latin\n * characters and should either be removed or adapted for use\n * with languages with non-latin characters.\n *\n * @static\n * @implements {lunr.PipelineFunction}\n * @param {lunr.Token} token The token to pass through the filter\n * @returns {lunr.Token}\n * @see lunr.Pipeline\n */\nlunr.trimmer = function (token) {\n  return token.update(function (s) {\n    return s.replace(/^\\W+/, '').replace(/\\W+$/, '')\n  })\n}\n\nlunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')\n/*!\n * lunr.TokenSet\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * A token set is used to store the unique list of all tokens\n * within an index. Token sets are also used to represent an\n * incoming query to the index, this query token set and index\n * token set are then intersected to find which tokens to look\n * up in the inverted index.\n *\n * A token set can hold multiple tokens, as in the case of the\n * index token set, or it can hold a single token as in the\n * case of a simple query token set.\n *\n * Additionally token sets are used to perform wildcard matching.\n * Leading, contained and trailing wildcards are supported, and\n * from this edit distance matching can also be provided.\n *\n * Token sets are implemented as a minimal finite state automata,\n * where both common prefixes and suffixes are shared between tokens.\n * This helps to reduce the space used for storing the token set.\n *\n * @constructor\n */\nlunr.TokenSet = function () {\n  this.final = false\n  this.edges = {}\n  this.id = lunr.TokenSet._nextId\n  lunr.TokenSet._nextId += 1\n}\n\n/**\n * Keeps track of the next, auto increment, identifier to assign\n * to a new tokenSet.\n *\n * TokenSets require a unique identifier to be correctly minimised.\n *\n * @private\n */\nlunr.TokenSet._nextId = 1\n\n/**\n * Creates a TokenSet instance from the given sorted array of words.\n *\n * @param {String[]} arr - A sorted array of strings to create the set from.\n * @returns {lunr.TokenSet}\n * @throws Will throw an error if the input array is not sorted.\n */\nlunr.TokenSet.fromArray = function (arr) {\n  var builder = new lunr.TokenSet.Builder\n\n  for (var i = 0, len = arr.length; i < len; i++) {\n    builder.insert(arr[i])\n  }\n\n  builder.finish()\n  return builder.root\n}\n\n/**\n * Creates a token set from a query clause.\n *\n * @private\n * @param {Object} clause - A single clause from lunr.Query.\n * @param {string} clause.term - The query clause term.\n * @param {number} [clause.editDistance] - The optional edit distance for the term.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.fromClause = function (clause) {\n  if ('editDistance' in clause) {\n    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)\n  } else {\n    return lunr.TokenSet.fromString(clause.term)\n  }\n}\n\n/**\n * Creates a token set representing a single string with a specified\n * edit distance.\n *\n * Insertions, deletions, substitutions and transpositions are each\n * treated as an edit distance of 1.\n *\n * Increasing the allowed edit distance will have a dramatic impact\n * on the performance of both creating and intersecting these TokenSets.\n * It is advised to keep the edit distance less than 3.\n *\n * @param {string} str - The string to create the token set from.\n * @param {number} editDistance - The allowed edit distance to match.\n * @returns {lunr.Vector}\n */\nlunr.TokenSet.fromFuzzyString = function (str, editDistance) {\n  var root = new lunr.TokenSet\n\n  var stack = [{\n    node: root,\n    editsRemaining: editDistance,\n    str: str\n  }]\n\n  while (stack.length) {\n    var frame = stack.pop()\n\n    // no edit\n    if (frame.str.length > 0) {\n      var char = frame.str.charAt(0),\n          noEditNode\n\n      if (char in frame.node.edges) {\n        noEditNode = frame.node.edges[char]\n      } else {\n        noEditNode = new lunr.TokenSet\n        frame.node.edges[char] = noEditNode\n      }\n\n      if (frame.str.length == 1) {\n        noEditNode.final = true\n      }\n\n      stack.push({\n        node: noEditNode,\n        editsRemaining: frame.editsRemaining,\n        str: frame.str.slice(1)\n      })\n    }\n\n    if (frame.editsRemaining == 0) {\n      continue\n    }\n\n    // insertion\n    if (\"*\" in frame.node.edges) {\n      var insertionNode = frame.node.edges[\"*\"]\n    } else {\n      var insertionNode = new lunr.TokenSet\n      frame.node.edges[\"*\"] = insertionNode\n    }\n\n    if (frame.str.length == 0) {\n      insertionNode.final = true\n    }\n\n    stack.push({\n      node: insertionNode,\n      editsRemaining: frame.editsRemaining - 1,\n      str: frame.str\n    })\n\n    // deletion\n    // can only do a deletion if we have enough edits remaining\n    // and if there are characters left to delete in the string\n    if (frame.str.length > 1) {\n      stack.push({\n        node: frame.node,\n        editsRemaining: frame.editsRemaining - 1,\n        str: frame.str.slice(1)\n      })\n    }\n\n    // deletion\n    // just removing the last character from the str\n    if (frame.str.length == 1) {\n      frame.node.final = true\n    }\n\n    // substitution\n    // can only do a substitution if we have enough edits remaining\n    // and if there are characters left to substitute\n    if (frame.str.length >= 1) {\n      if (\"*\" in frame.node.edges) {\n        var substitutionNode = frame.node.edges[\"*\"]\n      } else {\n        var substitutionNode = new lunr.TokenSet\n        frame.node.edges[\"*\"] = substitutionNode\n      }\n\n      if (frame.str.length == 1) {\n        substitutionNode.final = true\n      }\n\n      stack.push({\n        node: substitutionNode,\n        editsRemaining: frame.editsRemaining - 1,\n        str: frame.str.slice(1)\n      })\n    }\n\n    // transposition\n    // can only do a transposition if there are edits remaining\n    // and there are enough characters to transpose\n    if (frame.str.length > 1) {\n      var charA = frame.str.charAt(0),\n          charB = frame.str.charAt(1),\n          transposeNode\n\n      if (charB in frame.node.edges) {\n        transposeNode = frame.node.edges[charB]\n      } else {\n        transposeNode = new lunr.TokenSet\n        frame.node.edges[charB] = transposeNode\n      }\n\n      if (frame.str.length == 1) {\n        transposeNode.final = true\n      }\n\n      stack.push({\n        node: transposeNode,\n        editsRemaining: frame.editsRemaining - 1,\n        str: charA + frame.str.slice(2)\n      })\n    }\n  }\n\n  return root\n}\n\n/**\n * Creates a TokenSet from a string.\n *\n * The string may contain one or more wildcard characters (*)\n * that will allow wildcard matching when intersecting with\n * another TokenSet.\n *\n * @param {string} str - The string to create a TokenSet from.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.fromString = function (str) {\n  var node = new lunr.TokenSet,\n      root = node\n\n  /*\n   * Iterates through all characters within the passed string\n   * appending a node for each character.\n   *\n   * When a wildcard character is found then a self\n   * referencing edge is introduced to continually match\n   * any number of any characters.\n   */\n  for (var i = 0, len = str.length; i < len; i++) {\n    var char = str[i],\n        final = (i == len - 1)\n\n    if (char == \"*\") {\n      node.edges[char] = node\n      node.final = final\n\n    } else {\n      var next = new lunr.TokenSet\n      next.final = final\n\n      node.edges[char] = next\n      node = next\n    }\n  }\n\n  return root\n}\n\n/**\n * Converts this TokenSet into an array of strings\n * contained within the TokenSet.\n *\n * This is not intended to be used on a TokenSet that\n * contains wildcards, in these cases the results are\n * undefined and are likely to cause an infinite loop.\n *\n * @returns {string[]}\n */\nlunr.TokenSet.prototype.toArray = function () {\n  var words = []\n\n  var stack = [{\n    prefix: \"\",\n    node: this\n  }]\n\n  while (stack.length) {\n    var frame = stack.pop(),\n        edges = Object.keys(frame.node.edges),\n        len = edges.length\n\n    if (frame.node.final) {\n      /* In Safari, at this point the prefix is sometimes corrupted, see:\n       * https://github.com/olivernn/lunr.js/issues/279 Calling any\n       * String.prototype method forces Safari to \"cast\" this string to what\n       * it's supposed to be, fixing the bug. */\n      frame.prefix.charAt(0)\n      words.push(frame.prefix)\n    }\n\n    for (var i = 0; i < len; i++) {\n      var edge = edges[i]\n\n      stack.push({\n        prefix: frame.prefix.concat(edge),\n        node: frame.node.edges[edge]\n      })\n    }\n  }\n\n  return words\n}\n\n/**\n * Generates a string representation of a TokenSet.\n *\n * This is intended to allow TokenSets to be used as keys\n * in objects, largely to aid the construction and minimisation\n * of a TokenSet. As such it is not designed to be a human\n * friendly representation of the TokenSet.\n *\n * @returns {string}\n */\nlunr.TokenSet.prototype.toString = function () {\n  // NOTE: Using Object.keys here as this.edges is very likely\n  // to enter 'hash-mode' with many keys being added\n  //\n  // avoiding a for-in loop here as it leads to the function\n  // being de-optimised (at least in V8). From some simple\n  // benchmarks the performance is comparable, but allowing\n  // V8 to optimize may mean easy performance wins in the future.\n\n  if (this._str) {\n    return this._str\n  }\n\n  var str = this.final ? '1' : '0',\n      labels = Object.keys(this.edges).sort(),\n      len = labels.length\n\n  for (var i = 0; i < len; i++) {\n    var label = labels[i],\n        node = this.edges[label]\n\n    str = str + label + node.id\n  }\n\n  return str\n}\n\n/**\n * Returns a new TokenSet that is the intersection of\n * this TokenSet and the passed TokenSet.\n *\n * This intersection will take into account any wildcards\n * contained within the TokenSet.\n *\n * @param {lunr.TokenSet} b - An other TokenSet to intersect with.\n * @returns {lunr.TokenSet}\n */\nlunr.TokenSet.prototype.intersect = function (b) {\n  var output = new lunr.TokenSet,\n      frame = undefined\n\n  var stack = [{\n    qNode: b,\n    output: output,\n    node: this\n  }]\n\n  while (stack.length) {\n    frame = stack.pop()\n\n    // NOTE: As with the #toString method, we are using\n    // Object.keys and a for loop instead of a for-in loop\n    // as both of these objects enter 'hash' mode, causing\n    // the function to be de-optimised in V8\n    var qEdges = Object.keys(frame.qNode.edges),\n        qLen = qEdges.length,\n        nEdges = Object.keys(frame.node.edges),\n        nLen = nEdges.length\n\n    for (var q = 0; q < qLen; q++) {\n      var qEdge = qEdges[q]\n\n      for (var n = 0; n < nLen; n++) {\n        var nEdge = nEdges[n]\n\n        if (nEdge == qEdge || qEdge == '*') {\n          var node = frame.node.edges[nEdge],\n              qNode = frame.qNode.edges[qEdge],\n              final = node.final && qNode.final,\n              next = undefined\n\n          if (nEdge in frame.output.edges) {\n            // an edge already exists for this character\n            // no need to create a new node, just set the finality\n            // bit unless this node is already final\n            next = frame.output.edges[nEdge]\n            next.final = next.final || final\n\n          } else {\n            // no edge exists yet, must create one\n            // set the finality bit and insert it\n            // into the output\n            next = new lunr.TokenSet\n            next.final = final\n            frame.output.edges[nEdge] = next\n          }\n\n          stack.push({\n            qNode: qNode,\n            output: next,\n            node: node\n          })\n        }\n      }\n    }\n  }\n\n  return output\n}\nlunr.TokenSet.Builder = function () {\n  this.previousWord = \"\"\n  this.root = new lunr.TokenSet\n  this.uncheckedNodes = []\n  this.minimizedNodes = {}\n}\n\nlunr.TokenSet.Builder.prototype.insert = function (word) {\n  var node,\n      commonPrefix = 0\n\n  if (word < this.previousWord) {\n    throw new Error (\"Out of order word insertion\")\n  }\n\n  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {\n    if (word[i] != this.previousWord[i]) break\n    commonPrefix++\n  }\n\n  this.minimize(commonPrefix)\n\n  if (this.uncheckedNodes.length == 0) {\n    node = this.root\n  } else {\n    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child\n  }\n\n  for (var i = commonPrefix; i < word.length; i++) {\n    var nextNode = new lunr.TokenSet,\n        char = word[i]\n\n    node.edges[char] = nextNode\n\n    this.uncheckedNodes.push({\n      parent: node,\n      char: char,\n      child: nextNode\n    })\n\n    node = nextNode\n  }\n\n  node.final = true\n  this.previousWord = word\n}\n\nlunr.TokenSet.Builder.prototype.finish = function () {\n  this.minimize(0)\n}\n\nlunr.TokenSet.Builder.prototype.minimize = function (downTo) {\n  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {\n    var node = this.uncheckedNodes[i],\n        childKey = node.child.toString()\n\n    if (childKey in this.minimizedNodes) {\n      node.parent.edges[node.char] = this.minimizedNodes[childKey]\n    } else {\n      // Cache the key for this node since\n      // we know it can't change anymore\n      node.child._str = childKey\n\n      this.minimizedNodes[childKey] = node.child\n    }\n\n    this.uncheckedNodes.pop()\n  }\n}\n/*!\n * lunr.Index\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * An index contains the built index of all documents and provides a query interface\n * to the index.\n *\n * Usually instances of lunr.Index will not be created using this constructor, instead\n * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be\n * used to load previously built and serialized indexes.\n *\n * @constructor\n * @param {Object} attrs - The attributes of the built search index.\n * @param {Object} attrs.invertedIndex - An index of term/field to document reference.\n * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors\n * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.\n * @param {string[]} attrs.fields - The names of indexed document fields.\n * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.\n */\nlunr.Index = function (attrs) {\n  this.invertedIndex = attrs.invertedIndex\n  this.fieldVectors = attrs.fieldVectors\n  this.tokenSet = attrs.tokenSet\n  this.fields = attrs.fields\n  this.pipeline = attrs.pipeline\n}\n\n/**\n * A result contains details of a document matching a search query.\n * @typedef {Object} lunr.Index~Result\n * @property {string} ref - The reference of the document this result represents.\n * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.\n * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.\n */\n\n/**\n * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple\n * query language which itself is parsed into an instance of lunr.Query.\n *\n * For programmatically building queries it is advised to directly use lunr.Query, the query language\n * is best used for human entered text rather than program generated text.\n *\n * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported\n * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'\n * or 'world', though those that contain both will rank higher in the results.\n *\n * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can\n * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding\n * wildcards will increase the number of documents that will be found but can also have a negative\n * impact on query performance, especially with wildcards at the beginning of a term.\n *\n * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term\n * hello in the title field will match this query. Using a field not present in the index will lead\n * to an error being thrown.\n *\n * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term\n * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported\n * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.\n * Avoid large values for edit distance to improve query performance.\n *\n * Each term also supports a presence modifier. By default a term's presence in document is optional, however\n * this can be changed to either required or prohibited. For a term's presence to be required in a document the\n * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and\n * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not\n * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.\n *\n * To escape special characters the backslash character '\\' can be used, this allows searches to include\n * characters that would normally be considered modifiers, e.g. `foo\\~2` will search for a term \"foo~2\" instead\n * of attempting to apply a boost of 2 to the search term \"foo\".\n *\n * @typedef {string} lunr.Index~QueryString\n * @example <caption>Simple single term query</caption>\n * hello\n * @example <caption>Multiple term query</caption>\n * hello world\n * @example <caption>term scoped to a field</caption>\n * title:hello\n * @example <caption>term with a boost of 10</caption>\n * hello^10\n * @example <caption>term with an edit distance of 2</caption>\n * hello~2\n * @example <caption>terms with presence modifiers</caption>\n * -foo +bar baz\n */\n\n/**\n * Performs a search against the index using lunr query syntax.\n *\n * Results will be returned sorted by their score, the most relevant results\n * will be returned first.  For details on how the score is calculated, please see\n * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.\n *\n * For more programmatic querying use lunr.Index#query.\n *\n * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.\n * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.\n * @returns {lunr.Index~Result[]}\n */\nlunr.Index.prototype.search = function (queryString) {\n  return this.query(function (query) {\n    var parser = new lunr.QueryParser(queryString, query)\n    parser.parse()\n  })\n}\n\n/**\n * A query builder callback provides a query object to be used to express\n * the query to perform on the index.\n *\n * @callback lunr.Index~queryBuilder\n * @param {lunr.Query} query - The query object to build up.\n * @this lunr.Query\n */\n\n/**\n * Performs a query against the index using the yielded lunr.Query object.\n *\n * If performing programmatic queries against the index, this method is preferred\n * over lunr.Index#search so as to avoid the additional query parsing overhead.\n *\n * A query object is yielded to the supplied function which should be used to\n * express the query to be run against the index.\n *\n * Note that although this function takes a callback parameter it is _not_ an\n * asynchronous operation, the callback is just yielded a query object to be\n * customized.\n *\n * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.\n * @returns {lunr.Index~Result[]}\n */\nlunr.Index.prototype.query = function (fn) {\n  // for each query clause\n  // * process terms\n  // * expand terms from token set\n  // * find matching documents and metadata\n  // * get document vectors\n  // * score documents\n\n  var query = new lunr.Query(this.fields),\n      matchingFields = Object.create(null),\n      queryVectors = Object.create(null),\n      termFieldCache = Object.create(null),\n      requiredMatches = Object.create(null),\n      prohibitedMatches = Object.create(null)\n\n  /*\n   * To support field level boosts a query vector is created per\n   * field. An empty vector is eagerly created to support negated\n   * queries.\n   */\n  for (var i = 0; i < this.fields.length; i++) {\n    queryVectors[this.fields[i]] = new lunr.Vector\n  }\n\n  fn.call(query, query)\n\n  for (var i = 0; i < query.clauses.length; i++) {\n    /*\n     * Unless the pipeline has been disabled for this term, which is\n     * the case for terms with wildcards, we need to pass the clause\n     * term through the search pipeline. A pipeline returns an array\n     * of processed terms. Pipeline functions may expand the passed\n     * term, which means we may end up performing multiple index lookups\n     * for a single query term.\n     */\n    var clause = query.clauses[i],\n        terms = null,\n        clauseMatches = lunr.Set.complete\n\n    if (clause.usePipeline) {\n      terms = this.pipeline.runString(clause.term, {\n        fields: clause.fields\n      })\n    } else {\n      terms = [clause.term]\n    }\n\n    for (var m = 0; m < terms.length; m++) {\n      var term = terms[m]\n\n      /*\n       * Each term returned from the pipeline needs to use the same query\n       * clause object, e.g. the same boost and or edit distance. The\n       * simplest way to do this is to re-use the clause object but mutate\n       * its term property.\n       */\n      clause.term = term\n\n      /*\n       * From the term in the clause we create a token set which will then\n       * be used to intersect the indexes token set to get a list of terms\n       * to lookup in the inverted index\n       */\n      var termTokenSet = lunr.TokenSet.fromClause(clause),\n          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()\n\n      /*\n       * If a term marked as required does not exist in the tokenSet it is\n       * impossible for the search to return any matches. We set all the field\n       * scoped required matches set to empty and stop examining any further\n       * clauses.\n       */\n      if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {\n        for (var k = 0; k < clause.fields.length; k++) {\n          var field = clause.fields[k]\n          requiredMatches[field] = lunr.Set.empty\n        }\n\n        break\n      }\n\n      for (var j = 0; j < expandedTerms.length; j++) {\n        /*\n         * For each term get the posting and termIndex, this is required for\n         * building the query vector.\n         */\n        var expandedTerm = expandedTerms[j],\n            posting = this.invertedIndex[expandedTerm],\n            termIndex = posting._index\n\n        for (var k = 0; k < clause.fields.length; k++) {\n          /*\n           * For each field that this query term is scoped by (by default\n           * all fields are in scope) we need to get all the document refs\n           * that have this term in that field.\n           *\n           * The posting is the entry in the invertedIndex for the matching\n           * term from above.\n           */\n          var field = clause.fields[k],\n              fieldPosting = posting[field],\n              matchingDocumentRefs = Object.keys(fieldPosting),\n              termField = expandedTerm + \"/\" + field,\n              matchingDocumentsSet = new lunr.Set(matchingDocumentRefs)\n\n          /*\n           * if the presence of this term is required ensure that the matching\n           * documents are added to the set of required matches for this clause.\n           *\n           */\n          if (clause.presence == lunr.Query.presence.REQUIRED) {\n            clauseMatches = clauseMatches.union(matchingDocumentsSet)\n\n            if (requiredMatches[field] === undefined) {\n              requiredMatches[field] = lunr.Set.complete\n            }\n          }\n\n          /*\n           * if the presence of this term is prohibited ensure that the matching\n           * documents are added to the set of prohibited matches for this field,\n           * creating that set if it does not yet exist.\n           */\n          if (clause.presence == lunr.Query.presence.PROHIBITED) {\n            if (prohibitedMatches[field] === undefined) {\n              prohibitedMatches[field] = lunr.Set.empty\n            }\n\n            prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet)\n\n            /*\n             * Prohibited matches should not be part of the query vector used for\n             * similarity scoring and no metadata should be extracted so we continue\n             * to the next field\n             */\n            continue\n          }\n\n          /*\n           * The query field vector is populated using the termIndex found for\n           * the term and a unit value with the appropriate boost applied.\n           * Using upsert because there could already be an entry in the vector\n           * for the term we are working with. In that case we just add the scores\n           * together.\n           */\n          queryVectors[field].upsert(termIndex, clause.boost, function (a, b) { return a + b })\n\n          /**\n           * If we've already seen this term, field combo then we've already collected\n           * the matching documents and metadata, no need to go through all that again\n           */\n          if (termFieldCache[termField]) {\n            continue\n          }\n\n          for (var l = 0; l < matchingDocumentRefs.length; l++) {\n            /*\n             * All metadata for this term/field/document triple\n             * are then extracted and collected into an instance\n             * of lunr.MatchData ready to be returned in the query\n             * results\n             */\n            var matchingDocumentRef = matchingDocumentRefs[l],\n                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),\n                metadata = fieldPosting[matchingDocumentRef],\n                fieldMatch\n\n            if ((fieldMatch = matchingFields[matchingFieldRef]) === undefined) {\n              matchingFields[matchingFieldRef] = new lunr.MatchData (expandedTerm, field, metadata)\n            } else {\n              fieldMatch.add(expandedTerm, field, metadata)\n            }\n\n          }\n\n          termFieldCache[termField] = true\n        }\n      }\n    }\n\n    /**\n     * If the presence was required we need to update the requiredMatches field sets.\n     * We do this after all fields for the term have collected their matches because\n     * the clause terms presence is required in _any_ of the fields not _all_ of the\n     * fields.\n     */\n    if (clause.presence === lunr.Query.presence.REQUIRED) {\n      for (var k = 0; k < clause.fields.length; k++) {\n        var field = clause.fields[k]\n        requiredMatches[field] = requiredMatches[field].intersect(clauseMatches)\n      }\n    }\n  }\n\n  /**\n   * Need to combine the field scoped required and prohibited\n   * matching documents into a global set of required and prohibited\n   * matches\n   */\n  var allRequiredMatches = lunr.Set.complete,\n      allProhibitedMatches = lunr.Set.empty\n\n  for (var i = 0; i < this.fields.length; i++) {\n    var field = this.fields[i]\n\n    if (requiredMatches[field]) {\n      allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field])\n    }\n\n    if (prohibitedMatches[field]) {\n      allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field])\n    }\n  }\n\n  var matchingFieldRefs = Object.keys(matchingFields),\n      results = [],\n      matches = Object.create(null)\n\n  /*\n   * If the query is negated (contains only prohibited terms)\n   * we need to get _all_ fieldRefs currently existing in the\n   * index. This is only done when we know that the query is\n   * entirely prohibited terms to avoid any cost of getting all\n   * fieldRefs unnecessarily.\n   *\n   * Additionally, blank MatchData must be created to correctly\n   * populate the results.\n   */\n  if (query.isNegated()) {\n    matchingFieldRefs = Object.keys(this.fieldVectors)\n\n    for (var i = 0; i < matchingFieldRefs.length; i++) {\n      var matchingFieldRef = matchingFieldRefs[i]\n      var fieldRef = lunr.FieldRef.fromString(matchingFieldRef)\n      matchingFields[matchingFieldRef] = new lunr.MatchData\n    }\n  }\n\n  for (var i = 0; i < matchingFieldRefs.length; i++) {\n    /*\n     * Currently we have document fields that match the query, but we\n     * need to return documents. The matchData and scores are combined\n     * from multiple fields belonging to the same document.\n     *\n     * Scores are calculated by field, using the query vectors created\n     * above, and combined into a final document score using addition.\n     */\n    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),\n        docRef = fieldRef.docRef\n\n    if (!allRequiredMatches.contains(docRef)) {\n      continue\n    }\n\n    if (allProhibitedMatches.contains(docRef)) {\n      continue\n    }\n\n    var fieldVector = this.fieldVectors[fieldRef],\n        score = queryVectors[fieldRef.fieldName].similarity(fieldVector),\n        docMatch\n\n    if ((docMatch = matches[docRef]) !== undefined) {\n      docMatch.score += score\n      docMatch.matchData.combine(matchingFields[fieldRef])\n    } else {\n      var match = {\n        ref: docRef,\n        score: score,\n        matchData: matchingFields[fieldRef]\n      }\n      matches[docRef] = match\n      results.push(match)\n    }\n  }\n\n  /*\n   * Sort the results objects by score, highest first.\n   */\n  return results.sort(function (a, b) {\n    return b.score - a.score\n  })\n}\n\n/**\n * Prepares the index for JSON serialization.\n *\n * The schema for this JSON blob will be described in a\n * separate JSON schema file.\n *\n * @returns {Object}\n */\nlunr.Index.prototype.toJSON = function () {\n  var invertedIndex = Object.keys(this.invertedIndex)\n    .sort()\n    .map(function (term) {\n      return [term, this.invertedIndex[term]]\n    }, this)\n\n  var fieldVectors = Object.keys(this.fieldVectors)\n    .map(function (ref) {\n      return [ref, this.fieldVectors[ref].toJSON()]\n    }, this)\n\n  return {\n    version: lunr.version,\n    fields: this.fields,\n    fieldVectors: fieldVectors,\n    invertedIndex: invertedIndex,\n    pipeline: this.pipeline.toJSON()\n  }\n}\n\n/**\n * Loads a previously serialized lunr.Index\n *\n * @param {Object} serializedIndex - A previously serialized lunr.Index\n * @returns {lunr.Index}\n */\nlunr.Index.load = function (serializedIndex) {\n  var attrs = {},\n      fieldVectors = {},\n      serializedVectors = serializedIndex.fieldVectors,\n      invertedIndex = Object.create(null),\n      serializedInvertedIndex = serializedIndex.invertedIndex,\n      tokenSetBuilder = new lunr.TokenSet.Builder,\n      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)\n\n  if (serializedIndex.version != lunr.version) {\n    lunr.utils.warn(\"Version mismatch when loading serialised index. Current version of lunr '\" + lunr.version + \"' does not match serialized index '\" + serializedIndex.version + \"'\")\n  }\n\n  for (var i = 0; i < serializedVectors.length; i++) {\n    var tuple = serializedVectors[i],\n        ref = tuple[0],\n        elements = tuple[1]\n\n    fieldVectors[ref] = new lunr.Vector(elements)\n  }\n\n  for (var i = 0; i < serializedInvertedIndex.length; i++) {\n    var tuple = serializedInvertedIndex[i],\n        term = tuple[0],\n        posting = tuple[1]\n\n    tokenSetBuilder.insert(term)\n    invertedIndex[term] = posting\n  }\n\n  tokenSetBuilder.finish()\n\n  attrs.fields = serializedIndex.fields\n\n  attrs.fieldVectors = fieldVectors\n  attrs.invertedIndex = invertedIndex\n  attrs.tokenSet = tokenSetBuilder.root\n  attrs.pipeline = pipeline\n\n  return new lunr.Index(attrs)\n}\n/*!\n * lunr.Builder\n * Copyright (C) 2019 Oliver Nightingale\n */\n\n/**\n * lunr.Builder performs indexing on a set of documents and\n * returns instances of lunr.Index ready for querying.\n *\n * All configuration of the index is done via the builder, the\n * fields to index, the document reference, the text processing\n * pipeline and document scoring parameters are all set on the\n * builder before indexing.\n *\n * @constructor\n * @property {string} _ref - Internal reference to the document reference field.\n * @property {string[]} _fields - Internal reference to the document fields to index.\n * @property {object} invertedIndex - The inverted index maps terms to document fields.\n * @property {object} documentTermFrequencies - Keeps track of document term frequencies.\n * @property {object} documentLengths - Keeps track of the length of documents added to the index.\n * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.\n * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.\n * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.\n * @property {number} documentCount - Keeps track of the total number of documents indexed.\n * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.\n * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.\n * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.\n * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.\n */\nlunr.Builder = function () {\n  this._ref = \"id\"\n  this._fields = Object.create(null)\n  this._documents = Object.create(null)\n  this.invertedIndex = Object.create(null)\n  this.fieldTermFrequencies = {}\n  this.fieldLengths = {}\n  this.tokenizer = lunr.tokenizer\n  this.pipeline = new lunr.Pipeline\n  this.searchPipeline = new lunr.Pipeline\n  this.documentCount = 0\n  this._b = 0.75\n  this._k1 = 1.2\n  this.termIndex = 0\n  this.metadataWhitelist = []\n}\n\n/**\n * Sets the document field used as the document reference. Every document must have this field.\n * The type of this field in the document should be a string, if it is not a string it will be\n * coerced into a string by calling toString.\n *\n * The default ref is 'id'.\n *\n * The ref should _not_ be changed during indexing, it should be set before any documents are\n * added to the index. Changing it during indexing can lead to inconsistent results.\n *\n * @param {string} ref - The name of the reference field in the document.\n */\nlunr.Builder.prototype.ref = function (ref) {\n  this._ref = ref\n}\n\n/**\n * A function that is used to extract a field from a document.\n *\n * Lunr expects a field to be at the top level of a document, if however the field\n * is deeply nested within a document an extractor function can be used to extract\n * the right field for indexing.\n *\n * @callback fieldExtractor\n * @param {object} doc - The document being added to the index.\n * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.\n * @example <caption>Extracting a nested field</caption>\n * function (doc) { return doc.nested.field }\n */\n\n/**\n * Adds a field to the list of document fields that will be indexed. Every document being\n * indexed should have this field. Null values for this field in indexed documents will\n * not cause errors but will limit the chance of that document being retrieved by searches.\n *\n * All fields should be added before adding documents to the index. Adding fields after\n * a document has been indexed will have no effect on already indexed documents.\n *\n * Fields can be boosted at build time. This allows terms within that field to have more\n * importance when ranking search results. Use a field boost to specify that matches within\n * one field are more important than other fields.\n *\n * @param {string} fieldName - The name of a field to index in all documents.\n * @param {object} attributes - Optional attributes associated with this field.\n * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.\n * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.\n * @throws {RangeError} fieldName cannot contain unsupported characters '/'\n */\nlunr.Builder.prototype.field = function (fieldName, attributes) {\n  if (/\\//.test(fieldName)) {\n    throw new RangeError (\"Field '\" + fieldName + \"' contains illegal character '/'\")\n  }\n\n  this._fields[fieldName] = attributes || {}\n}\n\n/**\n * A parameter to tune the amount of field length normalisation that is applied when\n * calculating relevance scores. A value of 0 will completely disable any normalisation\n * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b\n * will be clamped to the range 0 - 1.\n *\n * @param {number} number - The value to set for this tuning parameter.\n */\nlunr.Builder.prototype.b = function (number) {\n  if (number < 0) {\n    this._b = 0\n  } else if (number > 1) {\n    this._b = 1\n  } else {\n    this._b = number\n  }\n}\n\n/**\n * A parameter that controls the speed at which a rise in term frequency results in term\n * frequency saturation. The default value is 1.2. Setting this to a higher value will give\n * slower saturation levels, a lower value will result in quicker saturation.\n *\n * @param {number} number - The value to set for this tuning parameter.\n */\nlunr.Builder.prototype.k1 = function (number) {\n  this._k1 = number\n}\n\n/**\n * Adds a document to the index.\n *\n * Before adding fields to the index the index should have been fully setup, with the document\n * ref and all fields to index already having been specified.\n *\n * The document must have a field name as specified by the ref (by default this is 'id') and\n * it should have all fields defined for indexing, though null or undefined values will not\n * cause errors.\n *\n * Entire documents can be boosted at build time. Applying a boost to a document indicates that\n * this document should rank higher in search results than other documents.\n *\n * @param {object} doc - The document to add to the index.\n * @param {object} attributes - Optional attributes associated with this document.\n * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.\n */\nlunr.Builder.prototype.add = function (doc, attributes) {\n  var docRef = doc[this._ref],\n      fields = Object.keys(this._fields)\n\n  this._documents[docRef] = attributes || {}\n  this.documentCount += 1\n\n  for (var i = 0; i < fields.length; i++) {\n    var fieldName = fields[i],\n        extractor = this._fields[fieldName].extractor,\n        field = extractor ? extractor(doc) : doc[fieldName],\n        tokens = this.tokenizer(field, {\n          fields: [fieldName]\n        }),\n        terms = this.pipeline.run(tokens),\n        fieldRef = new lunr.FieldRef (docRef, fieldName),\n        fieldTerms = Object.create(null)\n\n    this.fieldTermFrequencies[fieldRef] = fieldTerms\n    this.fieldLengths[fieldRef] = 0\n\n    // store the length of this field for this document\n    this.fieldLengths[fieldRef] += terms.length\n\n    // calculate term frequencies for this field\n    for (var j = 0; j < terms.length; j++) {\n      var term = terms[j]\n\n      if (fieldTerms[term] == undefined) {\n        fieldTerms[term] = 0\n      }\n\n      fieldTerms[term] += 1\n\n      // add to inverted index\n      // create an initial posting if one doesn't exist\n      if (this.invertedIndex[term] == undefined) {\n        var posting = Object.create(null)\n        posting[\"_index\"] = this.termIndex\n        this.termIndex += 1\n\n        for (var k = 0; k < fields.length; k++) {\n          posting[fields[k]] = Object.create(null)\n        }\n\n        this.invertedIndex[term] = posting\n      }\n\n      // add an entry for this term/fieldName/docRef to the invertedIndex\n      if (this.invertedIndex[term][fieldName][docRef] == undefined) {\n        this.invertedIndex[term][fieldName][docRef] = Object.create(null)\n      }\n\n      // store all whitelisted metadata about this token in the\n      // inverted index\n      for (var l = 0; l < this.metadataWhitelist.length; l++) {\n        var metadataKey = this.metadataWhitelist[l],\n            metadata = term.metadata[metadataKey]\n\n        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {\n          this.invertedIndex[term][fieldName][docRef][metadataKey] = []\n        }\n\n        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)\n      }\n    }\n\n  }\n}\n\n/**\n * Calculates the average document length for this index\n *\n * @private\n */\nlunr.Builder.prototype.calculateAverageFieldLengths = function () {\n\n  var fieldRefs = Object.keys(this.fieldLengths),\n      numberOfFields = fieldRefs.length,\n      accumulator = {},\n      documentsWithField = {}\n\n  for (var i = 0; i < numberOfFields; i++) {\n    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),\n        field = fieldRef.fieldName\n\n    documentsWithField[field] || (documentsWithField[field] = 0)\n    documentsWithField[field] += 1\n\n    accumulator[field] || (accumulator[field] = 0)\n    accumulator[field] += this.fieldLengths[fieldRef]\n  }\n\n  var fields = Object.keys(this._fields)\n\n  for (var i = 0; i < fields.length; i++) {\n    var fieldName = fields[i]\n    accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName]\n  }\n\n  this.averageFieldLength = accumulator\n}\n\n/**\n * Builds a vector space model of every document using lunr.Vector\n *\n * @private\n */\nlunr.Builder.prototype.createFieldVectors = function () {\n  var fieldVectors = {},\n      fieldRefs = Object.keys(this.fieldTermFrequencies),\n      fieldRefsLength = fieldRefs.length,\n      termIdfCache = Object.create(null)\n\n  for (var i = 0; i < fieldRefsLength; i++) {\n    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),\n        fieldName = fieldRef.fieldName,\n        fieldLength = this.fieldLengths[fieldRef],\n        fieldVector = new lunr.Vector,\n        termFrequencies = this.fieldTermFrequencies[fieldRef],\n        terms = Object.keys(termFrequencies),\n        termsLength = terms.length\n\n\n    var fieldBoost = this._fields[fieldName].boost || 1,\n        docBoost = this._documents[fieldRef.docRef].boost || 1\n\n    for (var j = 0; j < termsLength; j++) {\n      var term = terms[j],\n          tf = termFrequencies[term],\n          termIndex = this.invertedIndex[term]._index,\n          idf, score, scoreWithPrecision\n\n      if (termIdfCache[term] === undefined) {\n        idf = lunr.idf(this.invertedIndex[term], this.documentCount)\n        termIdfCache[term] = idf\n      } else {\n        idf = termIdfCache[term]\n      }\n\n      score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf)\n      score *= fieldBoost\n      score *= docBoost\n      scoreWithPrecision = Math.round(score * 1000) / 1000\n      // Converts 1.23456789 to 1.234.\n      // Reducing the precision so that the vectors take up less\n      // space when serialised. Doing it now so that they behave\n      // the same before and after serialisation. Also, this is\n      // the fastest approach to reducing a number's precision in\n      // JavaScript.\n\n      fieldVector.insert(termIndex, scoreWithPrecision)\n    }\n\n    fieldVectors[fieldRef] = fieldVector\n  }\n\n  this.fieldVectors = fieldVectors\n}\n\n/**\n * Creates a token set of all tokens in the index using lunr.TokenSet\n *\n * @private\n */\nlunr.Builder.prototype.createTokenSet = function () {\n  this.tokenSet = lunr.TokenSet.fromArray(\n    Object.keys(this.invertedIndex).sort()\n  )\n}\n\n/**\n * Builds the index, creating an instance of lunr.Index.\n *\n * This completes the indexing process and should only be called\n * once all documents have been added to the index.\n *\n * @returns {lunr.Index}\n */\nlunr.Builder.prototype.build = function () {\n  this.calculateAverageFieldLengths()\n  this.createFieldVectors()\n  this.createTokenSet()\n\n  return new lunr.Index({\n    invertedIndex: this.invertedIndex,\n    fieldVectors: this.fieldVectors,\n    tokenSet: this.tokenSet,\n    fields: Object.keys(this._fields),\n    pipeline: this.searchPipeline\n  })\n}\n\n/**\n * Applies a plugin to the index builder.\n *\n * A plugin is a function that is called with the index builder as its context.\n * Plugins can be used to customise or extend the behaviour of the index\n * in some way. A plugin is just a function, that encapsulated the custom\n * behaviour that should be applied when building the index.\n *\n * The plugin function will be called with the index builder as its argument, additional\n * arguments can also be passed when calling use. The function will be called\n * with the index builder as its context.\n *\n * @param {Function} plugin The plugin to apply.\n */\nlunr.Builder.prototype.use = function (fn) {\n  var args = Array.prototype.slice.call(arguments, 1)\n  args.unshift(this)\n  fn.apply(this, args)\n}\n/**\n * Contains and collects metadata about a matching document.\n * A single instance of lunr.MatchData is returned as part of every\n * lunr.Index~Result.\n *\n * @constructor\n * @param {string} term - The term this match data is associated with\n * @param {string} field - The field in which the term was found\n * @param {object} metadata - The metadata recorded about this term in this field\n * @property {object} metadata - A cloned collection of metadata associated with this document.\n * @see {@link lunr.Index~Result}\n */\nlunr.MatchData = function (term, field, metadata) {\n  var clonedMetadata = Object.create(null),\n      metadataKeys = Object.keys(metadata || {})\n\n  // Cloning the metadata to prevent the original\n  // being mutated during match data combination.\n  // Metadata is kept in an array within the inverted\n  // index so cloning the data can be done with\n  // Array#slice\n  for (var i = 0; i < metadataKeys.length; i++) {\n    var key = metadataKeys[i]\n    clonedMetadata[key] = metadata[key].slice()\n  }\n\n  this.metadata = Object.create(null)\n\n  if (term !== undefined) {\n    this.metadata[term] = Object.create(null)\n    this.metadata[term][field] = clonedMetadata\n  }\n}\n\n/**\n * An instance of lunr.MatchData will be created for every term that matches a\n * document. However only one instance is required in a lunr.Index~Result. This\n * method combines metadata from another instance of lunr.MatchData with this\n * objects metadata.\n *\n * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.\n * @see {@link lunr.Index~Result}\n */\nlunr.MatchData.prototype.combine = function (otherMatchData) {\n  var terms = Object.keys(otherMatchData.metadata)\n\n  for (var i = 0; i < terms.length; i++) {\n    var term = terms[i],\n        fields = Object.keys(otherMatchData.metadata[term])\n\n    if (this.metadata[term] == undefined) {\n      this.metadata[term] = Object.create(null)\n    }\n\n    for (var j = 0; j < fields.length; j++) {\n      var field = fields[j],\n          keys = Object.keys(otherMatchData.metadata[term][field])\n\n      if (this.metadata[term][field] == undefined) {\n        this.metadata[term][field] = Object.create(null)\n      }\n\n      for (var k = 0; k < keys.length; k++) {\n        var key = keys[k]\n\n        if (this.metadata[term][field][key] == undefined) {\n          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]\n        } else {\n          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])\n        }\n\n      }\n    }\n  }\n}\n\n/**\n * Add metadata for a term/field pair to this instance of match data.\n *\n * @param {string} term - The term this match data is associated with\n * @param {string} field - The field in which the term was found\n * @param {object} metadata - The metadata recorded about this term in this field\n */\nlunr.MatchData.prototype.add = function (term, field, metadata) {\n  if (!(term in this.metadata)) {\n    this.metadata[term] = Object.create(null)\n    this.metadata[term][field] = metadata\n    return\n  }\n\n  if (!(field in this.metadata[term])) {\n    this.metadata[term][field] = metadata\n    return\n  }\n\n  var metadataKeys = Object.keys(metadata)\n\n  for (var i = 0; i < metadataKeys.length; i++) {\n    var key = metadataKeys[i]\n\n    if (key in this.metadata[term][field]) {\n      this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key])\n    } else {\n      this.metadata[term][field][key] = metadata[key]\n    }\n  }\n}\n/**\n * A lunr.Query provides a programmatic way of defining queries to be performed\n * against a {@link lunr.Index}.\n *\n * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method\n * so the query object is pre-initialized with the right index fields.\n *\n * @constructor\n * @property {lunr.Query~Clause[]} clauses - An array of query clauses.\n * @property {string[]} allFields - An array of all available fields in a lunr.Index.\n */\nlunr.Query = function (allFields) {\n  this.clauses = []\n  this.allFields = allFields\n}\n\n/**\n * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.\n *\n * This allows wildcards to be added to the beginning and end of a term without having to manually do any string\n * concatenation.\n *\n * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.\n *\n * @constant\n * @default\n * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour\n * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists\n * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists\n * @see lunr.Query~Clause\n * @see lunr.Query#clause\n * @see lunr.Query#term\n * @example <caption>query term with trailing wildcard</caption>\n * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })\n * @example <caption>query term with leading and trailing wildcard</caption>\n * query.term('foo', {\n *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING\n * })\n */\n\nlunr.Query.wildcard = new String (\"*\")\nlunr.Query.wildcard.NONE = 0\nlunr.Query.wildcard.LEADING = 1\nlunr.Query.wildcard.TRAILING = 2\n\n/**\n * Constants for indicating what kind of presence a term must have in matching documents.\n *\n * @constant\n * @enum {number}\n * @see lunr.Query~Clause\n * @see lunr.Query#clause\n * @see lunr.Query#term\n * @example <caption>query term with required presence</caption>\n * query.term('foo', { presence: lunr.Query.presence.REQUIRED })\n */\nlunr.Query.presence = {\n  /**\n   * Term's presence in a document is optional, this is the default value.\n   */\n  OPTIONAL: 1,\n\n  /**\n   * Term's presence in a document is required, documents that do not contain\n   * this term will not be returned.\n   */\n  REQUIRED: 2,\n\n  /**\n   * Term's presence in a document is prohibited, documents that do contain\n   * this term will not be returned.\n   */\n  PROHIBITED: 3\n}\n\n/**\n * A single clause in a {@link lunr.Query} contains a term and details on how to\n * match that term against a {@link lunr.Index}.\n *\n * @typedef {Object} lunr.Query~Clause\n * @property {string[]} fields - The fields in an index this clause should be matched against.\n * @property {number} [boost=1] - Any boost that should be applied when matching this clause.\n * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.\n * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.\n * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.\n * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.\n */\n\n/**\n * Adds a {@link lunr.Query~Clause} to this query.\n *\n * Unless the clause contains the fields to be matched all fields will be matched. In addition\n * a default boost of 1 is applied to the clause.\n *\n * @param {lunr.Query~Clause} clause - The clause to add to this query.\n * @see lunr.Query~Clause\n * @returns {lunr.Query}\n */\nlunr.Query.prototype.clause = function (clause) {\n  if (!('fields' in clause)) {\n    clause.fields = this.allFields\n  }\n\n  if (!('boost' in clause)) {\n    clause.boost = 1\n  }\n\n  if (!('usePipeline' in clause)) {\n    clause.usePipeline = true\n  }\n\n  if (!('wildcard' in clause)) {\n    clause.wildcard = lunr.Query.wildcard.NONE\n  }\n\n  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {\n    clause.term = \"*\" + clause.term\n  }\n\n  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {\n    clause.term = \"\" + clause.term + \"*\"\n  }\n\n  if (!('presence' in clause)) {\n    clause.presence = lunr.Query.presence.OPTIONAL\n  }\n\n  this.clauses.push(clause)\n\n  return this\n}\n\n/**\n * A negated query is one in which every clause has a presence of\n * prohibited. These queries require some special processing to return\n * the expected results.\n *\n * @returns boolean\n */\nlunr.Query.prototype.isNegated = function () {\n  for (var i = 0; i < this.clauses.length; i++) {\n    if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {\n      return false\n    }\n  }\n\n  return true\n}\n\n/**\n * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}\n * to the list of clauses that make up this query.\n *\n * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion\n * to a token or token-like string should be done before calling this method.\n *\n * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an\n * array, each term in the array will share the same options.\n *\n * @param {object|object[]} term - The term(s) to add to the query.\n * @param {object} [options] - Any additional properties to add to the query clause.\n * @returns {lunr.Query}\n * @see lunr.Query#clause\n * @see lunr.Query~Clause\n * @example <caption>adding a single term to a query</caption>\n * query.term(\"foo\")\n * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>\n * query.term(\"foo\", {\n *   fields: [\"title\"],\n *   boost: 10,\n *   wildcard: lunr.Query.wildcard.TRAILING\n * })\n * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>\n * query.term(lunr.tokenizer(\"foo bar\"))\n */\nlunr.Query.prototype.term = function (term, options) {\n  if (Array.isArray(term)) {\n    term.forEach(function (t) { this.term(t, lunr.utils.clone(options)) }, this)\n    return this\n  }\n\n  var clause = options || {}\n  clause.term = term.toString()\n\n  this.clause(clause)\n\n  return this\n}\nlunr.QueryParseError = function (message, start, end) {\n  this.name = \"QueryParseError\"\n  this.message = message\n  this.start = start\n  this.end = end\n}\n\nlunr.QueryParseError.prototype = new Error\nlunr.QueryLexer = function (str) {\n  this.lexemes = []\n  this.str = str\n  this.length = str.length\n  this.pos = 0\n  this.start = 0\n  this.escapeCharPositions = []\n}\n\nlunr.QueryLexer.prototype.run = function () {\n  var state = lunr.QueryLexer.lexText\n\n  while (state) {\n    state = state(this)\n  }\n}\n\nlunr.QueryLexer.prototype.sliceString = function () {\n  var subSlices = [],\n      sliceStart = this.start,\n      sliceEnd = this.pos\n\n  for (var i = 0; i < this.escapeCharPositions.length; i++) {\n    sliceEnd = this.escapeCharPositions[i]\n    subSlices.push(this.str.slice(sliceStart, sliceEnd))\n    sliceStart = sliceEnd + 1\n  }\n\n  subSlices.push(this.str.slice(sliceStart, this.pos))\n  this.escapeCharPositions.length = 0\n\n  return subSlices.join('')\n}\n\nlunr.QueryLexer.prototype.emit = function (type) {\n  this.lexemes.push({\n    type: type,\n    str: this.sliceString(),\n    start: this.start,\n    end: this.pos\n  })\n\n  this.start = this.pos\n}\n\nlunr.QueryLexer.prototype.escapeCharacter = function () {\n  this.escapeCharPositions.push(this.pos - 1)\n  this.pos += 1\n}\n\nlunr.QueryLexer.prototype.next = function () {\n  if (this.pos >= this.length) {\n    return lunr.QueryLexer.EOS\n  }\n\n  var char = this.str.charAt(this.pos)\n  this.pos += 1\n  return char\n}\n\nlunr.QueryLexer.prototype.width = function () {\n  return this.pos - this.start\n}\n\nlunr.QueryLexer.prototype.ignore = function () {\n  if (this.start == this.pos) {\n    this.pos += 1\n  }\n\n  this.start = this.pos\n}\n\nlunr.QueryLexer.prototype.backup = function () {\n  this.pos -= 1\n}\n\nlunr.QueryLexer.prototype.acceptDigitRun = function () {\n  var char, charCode\n\n  do {\n    char = this.next()\n    charCode = char.charCodeAt(0)\n  } while (charCode > 47 && charCode < 58)\n\n  if (char != lunr.QueryLexer.EOS) {\n    this.backup()\n  }\n}\n\nlunr.QueryLexer.prototype.more = function () {\n  return this.pos < this.length\n}\n\nlunr.QueryLexer.EOS = 'EOS'\nlunr.QueryLexer.FIELD = 'FIELD'\nlunr.QueryLexer.TERM = 'TERM'\nlunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'\nlunr.QueryLexer.BOOST = 'BOOST'\nlunr.QueryLexer.PRESENCE = 'PRESENCE'\n\nlunr.QueryLexer.lexField = function (lexer) {\n  lexer.backup()\n  lexer.emit(lunr.QueryLexer.FIELD)\n  lexer.ignore()\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexTerm = function (lexer) {\n  if (lexer.width() > 1) {\n    lexer.backup()\n    lexer.emit(lunr.QueryLexer.TERM)\n  }\n\n  lexer.ignore()\n\n  if (lexer.more()) {\n    return lunr.QueryLexer.lexText\n  }\n}\n\nlunr.QueryLexer.lexEditDistance = function (lexer) {\n  lexer.ignore()\n  lexer.acceptDigitRun()\n  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexBoost = function (lexer) {\n  lexer.ignore()\n  lexer.acceptDigitRun()\n  lexer.emit(lunr.QueryLexer.BOOST)\n  return lunr.QueryLexer.lexText\n}\n\nlunr.QueryLexer.lexEOS = function (lexer) {\n  if (lexer.width() > 0) {\n    lexer.emit(lunr.QueryLexer.TERM)\n  }\n}\n\n// This matches the separator used when tokenising fields\n// within a document. These should match otherwise it is\n// not possible to search for some tokens within a document.\n//\n// It is possible for the user to change the separator on the\n// tokenizer so it _might_ clash with any other of the special\n// characters already used within the search string, e.g. :.\n//\n// This means that it is possible to change the separator in\n// such a way that makes some words unsearchable using a search\n// string.\nlunr.QueryLexer.termSeparator = lunr.tokenizer.separator\n\nlunr.QueryLexer.lexText = function (lexer) {\n  while (true) {\n    var char = lexer.next()\n\n    if (char == lunr.QueryLexer.EOS) {\n      return lunr.QueryLexer.lexEOS\n    }\n\n    // Escape character is '\\'\n    if (char.charCodeAt(0) == 92) {\n      lexer.escapeCharacter()\n      continue\n    }\n\n    if (char == \":\") {\n      return lunr.QueryLexer.lexField\n    }\n\n    if (char == \"~\") {\n      lexer.backup()\n      if (lexer.width() > 0) {\n        lexer.emit(lunr.QueryLexer.TERM)\n      }\n      return lunr.QueryLexer.lexEditDistance\n    }\n\n    if (char == \"^\") {\n      lexer.backup()\n      if (lexer.width() > 0) {\n        lexer.emit(lunr.QueryLexer.TERM)\n      }\n      return lunr.QueryLexer.lexBoost\n    }\n\n    // \"+\" indicates term presence is required\n    // checking for length to ensure that only\n    // leading \"+\" are considered\n    if (char == \"+\" && lexer.width() === 1) {\n      lexer.emit(lunr.QueryLexer.PRESENCE)\n      return lunr.QueryLexer.lexText\n    }\n\n    // \"-\" indicates term presence is prohibited\n    // checking for length to ensure that only\n    // leading \"-\" are considered\n    if (char == \"-\" && lexer.width() === 1) {\n      lexer.emit(lunr.QueryLexer.PRESENCE)\n      return lunr.QueryLexer.lexText\n    }\n\n    if (char.match(lunr.QueryLexer.termSeparator)) {\n      return lunr.QueryLexer.lexTerm\n    }\n  }\n}\n\nlunr.QueryParser = function (str, query) {\n  this.lexer = new lunr.QueryLexer (str)\n  this.query = query\n  this.currentClause = {}\n  this.lexemeIdx = 0\n}\n\nlunr.QueryParser.prototype.parse = function () {\n  this.lexer.run()\n  this.lexemes = this.lexer.lexemes\n\n  var state = lunr.QueryParser.parseClause\n\n  while (state) {\n    state = state(this)\n  }\n\n  return this.query\n}\n\nlunr.QueryParser.prototype.peekLexeme = function () {\n  return this.lexemes[this.lexemeIdx]\n}\n\nlunr.QueryParser.prototype.consumeLexeme = function () {\n  var lexeme = this.peekLexeme()\n  this.lexemeIdx += 1\n  return lexeme\n}\n\nlunr.QueryParser.prototype.nextClause = function () {\n  var completedClause = this.currentClause\n  this.query.clause(completedClause)\n  this.currentClause = {}\n}\n\nlunr.QueryParser.parseClause = function (parser) {\n  var lexeme = parser.peekLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  switch (lexeme.type) {\n    case lunr.QueryLexer.PRESENCE:\n      return lunr.QueryParser.parsePresence\n    case lunr.QueryLexer.FIELD:\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expected either a field or a term, found \" + lexeme.type\n\n      if (lexeme.str.length >= 1) {\n        errorMessage += \" with value '\" + lexeme.str + \"'\"\n      }\n\n      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n}\n\nlunr.QueryParser.parsePresence = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  switch (lexeme.str) {\n    case \"-\":\n      parser.currentClause.presence = lunr.Query.presence.PROHIBITED\n      break\n    case \"+\":\n      parser.currentClause.presence = lunr.Query.presence.REQUIRED\n      break\n    default:\n      var errorMessage = \"unrecognised presence operator'\" + lexeme.str + \"'\"\n      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    var errorMessage = \"expecting term or field, found nothing\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.FIELD:\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expecting term or field, found '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseField = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  if (parser.query.allFields.indexOf(lexeme.str) == -1) {\n    var possibleFields = parser.query.allFields.map(function (f) { return \"'\" + f + \"'\" }).join(', '),\n        errorMessage = \"unrecognised field '\" + lexeme.str + \"', possible fields: \" + possibleFields\n\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.fields = [lexeme.str]\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    var errorMessage = \"expecting term, found nothing\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      return lunr.QueryParser.parseTerm\n    default:\n      var errorMessage = \"expecting term, found '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseTerm = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  parser.currentClause.term = lexeme.str.toLowerCase()\n\n  if (lexeme.str.indexOf(\"*\") != -1) {\n    parser.currentClause.usePipeline = false\n  }\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseEditDistance = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  var editDistance = parseInt(lexeme.str, 10)\n\n  if (isNaN(editDistance)) {\n    var errorMessage = \"edit distance must be numeric\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.editDistance = editDistance\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\nlunr.QueryParser.parseBoost = function (parser) {\n  var lexeme = parser.consumeLexeme()\n\n  if (lexeme == undefined) {\n    return\n  }\n\n  var boost = parseInt(lexeme.str, 10)\n\n  if (isNaN(boost)) {\n    var errorMessage = \"boost must be numeric\"\n    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)\n  }\n\n  parser.currentClause.boost = boost\n\n  var nextLexeme = parser.peekLexeme()\n\n  if (nextLexeme == undefined) {\n    parser.nextClause()\n    return\n  }\n\n  switch (nextLexeme.type) {\n    case lunr.QueryLexer.TERM:\n      parser.nextClause()\n      return lunr.QueryParser.parseTerm\n    case lunr.QueryLexer.FIELD:\n      parser.nextClause()\n      return lunr.QueryParser.parseField\n    case lunr.QueryLexer.EDIT_DISTANCE:\n      return lunr.QueryParser.parseEditDistance\n    case lunr.QueryLexer.BOOST:\n      return lunr.QueryParser.parseBoost\n    case lunr.QueryLexer.PRESENCE:\n      parser.nextClause()\n      return lunr.QueryParser.parsePresence\n    default:\n      var errorMessage = \"Unexpected lexeme type '\" + nextLexeme.type + \"'\"\n      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)\n  }\n}\n\n  /**\n   * export the module via AMD, CommonJS or as a browser global\n   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js\n   */\n  ;(function (root, factory) {\n    if (true) {\n      // AMD. Register as an anonymous module.\n      !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))\n    } else {}\n  }(this, function () {\n    /**\n     * Just return a value to define the module export.\n     * This example returns an object, but the module\n     * can return a function as the exported value.\n     */\n    return lunr\n  }))\n})();\n\n\n/***/ }),\n/* 5 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (exec) {\n  try {\n    return !!exec();\n  } catch (error) {\n    return true;\n  }\n};\n\n\n/***/ }),\n/* 6 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DESCRIPTORS = __webpack_require__(8);\nvar definePropertyModule = __webpack_require__(9);\nvar createPropertyDescriptor = __webpack_require__(22);\n\nmodule.exports = DESCRIPTORS ? function (object, key, value) {\n  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n\n\n/***/ }),\n/* 7 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it) {\n  return typeof it === 'object' ? it !== null : typeof it === 'function';\n};\n\n\n/***/ }),\n/* 8 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar fails = __webpack_require__(5);\n\n// Thank's IE8 for his funny defineProperty\nmodule.exports = !fails(function () {\n  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;\n});\n\n\n/***/ }),\n/* 9 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DESCRIPTORS = __webpack_require__(8);\nvar IE8_DOM_DEFINE = __webpack_require__(34);\nvar anObject = __webpack_require__(2);\nvar toPrimitive = __webpack_require__(35);\n\nvar nativeDefineProperty = Object.defineProperty;\n\n// `Object.defineProperty` method\n// https://tc39.github.io/ecma262/#sec-object.defineproperty\nexports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {\n  anObject(O);\n  P = toPrimitive(P, true);\n  anObject(Attributes);\n  if (IE8_DOM_DEFINE) try {\n    return nativeDefineProperty(O, P, Attributes);\n  } catch (error) { /* empty */ }\n  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');\n  if ('value' in Attributes) O[P] = Attributes.value;\n  return O;\n};\n\n\n/***/ }),\n/* 10 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar has = __webpack_require__(3);\nvar setGlobal = __webpack_require__(20);\nvar inspectSource = __webpack_require__(23);\nvar InternalStateModule = __webpack_require__(16);\n\nvar getInternalState = InternalStateModule.get;\nvar enforceInternalState = InternalStateModule.enforce;\nvar TEMPLATE = String(String).split('String');\n\n(module.exports = function (O, key, value, options) {\n  var unsafe = options ? !!options.unsafe : false;\n  var simple = options ? !!options.enumerable : false;\n  var noTargetGet = options ? !!options.noTargetGet : false;\n  if (typeof value == 'function') {\n    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);\n    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');\n  }\n  if (O === global) {\n    if (simple) O[key] = value;\n    else setGlobal(key, value);\n    return;\n  } else if (!unsafe) {\n    delete O[key];\n  } else if (!noTargetGet && O[key]) {\n    simple = true;\n  }\n  if (simple) O[key] = value;\n  else createNonEnumerableProperty(O, key, value);\n// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative\n})(Function.prototype, 'toString', function toString() {\n  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);\n});\n\n\n/***/ }),\n/* 11 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar path = __webpack_require__(40);\nvar global = __webpack_require__(0);\n\nvar aFunction = function (variable) {\n  return typeof variable == 'function' ? variable : undefined;\n};\n\nmodule.exports = function (namespace, method) {\n  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])\n    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];\n};\n\n\n/***/ }),\n/* 12 */\n/***/ (function(module, exports) {\n\nmodule.exports = false;\n\n\n/***/ }),\n/* 13 */\n/***/ (function(module, exports) {\n\nvar toString = {}.toString;\n\nmodule.exports = function (it) {\n  return toString.call(it).slice(8, -1);\n};\n\n\n/***/ }),\n/* 14 */\n/***/ (function(module, exports) {\n\nmodule.exports = {};\n\n\n/***/ }),\n/* 15 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it) {\n  if (typeof it != 'function') {\n    throw TypeError(String(it) + ' is not a function');\n  } return it;\n};\n\n\n/***/ }),\n/* 16 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar NATIVE_WEAK_MAP = __webpack_require__(61);\nvar global = __webpack_require__(0);\nvar isObject = __webpack_require__(7);\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar objectHas = __webpack_require__(3);\nvar sharedKey = __webpack_require__(24);\nvar hiddenKeys = __webpack_require__(25);\n\nvar WeakMap = global.WeakMap;\nvar set, get, has;\n\nvar enforce = function (it) {\n  return has(it) ? get(it) : set(it, {});\n};\n\nvar getterFor = function (TYPE) {\n  return function (it) {\n    var state;\n    if (!isObject(it) || (state = get(it)).type !== TYPE) {\n      throw TypeError('Incompatible receiver, ' + TYPE + ' required');\n    } return state;\n  };\n};\n\nif (NATIVE_WEAK_MAP) {\n  var store = new WeakMap();\n  var wmget = store.get;\n  var wmhas = store.has;\n  var wmset = store.set;\n  set = function (it, metadata) {\n    wmset.call(store, it, metadata);\n    return metadata;\n  };\n  get = function (it) {\n    return wmget.call(store, it) || {};\n  };\n  has = function (it) {\n    return wmhas.call(store, it);\n  };\n} else {\n  var STATE = sharedKey('state');\n  hiddenKeys[STATE] = true;\n  set = function (it, metadata) {\n    createNonEnumerableProperty(it, STATE, metadata);\n    return metadata;\n  };\n  get = function (it) {\n    return objectHas(it, STATE) ? it[STATE] : {};\n  };\n  has = function (it) {\n    return objectHas(it, STATE);\n  };\n}\n\nmodule.exports = {\n  set: set,\n  get: get,\n  has: has,\n  enforce: enforce,\n  getterFor: getterFor\n};\n\n\n/***/ }),\n/* 17 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar getOwnPropertyDescriptor = __webpack_require__(28).f;\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar redefine = __webpack_require__(10);\nvar setGlobal = __webpack_require__(20);\nvar copyConstructorProperties = __webpack_require__(67);\nvar isForced = __webpack_require__(43);\n\n/*\n  options.target      - name of the target object\n  options.global      - target is the global object\n  options.stat        - export as static methods of target\n  options.proto       - export as prototype methods of target\n  options.real        - real prototype method for the `pure` version\n  options.forced      - export even if the native feature is available\n  options.bind        - bind methods to the target, required for the `pure` version\n  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version\n  options.unsafe      - use the simple assignment of property instead of delete + defineProperty\n  options.sham        - add a flag to not completely full polyfills\n  options.enumerable  - export as enumerable property\n  options.noTargetGet - prevent calling a getter on target\n*/\nmodule.exports = function (options, source) {\n  var TARGET = options.target;\n  var GLOBAL = options.global;\n  var STATIC = options.stat;\n  var FORCED, target, key, targetProperty, sourceProperty, descriptor;\n  if (GLOBAL) {\n    target = global;\n  } else if (STATIC) {\n    target = global[TARGET] || setGlobal(TARGET, {});\n  } else {\n    target = (global[TARGET] || {}).prototype;\n  }\n  if (target) for (key in source) {\n    sourceProperty = source[key];\n    if (options.noTargetGet) {\n      descriptor = getOwnPropertyDescriptor(target, key);\n      targetProperty = descriptor && descriptor.value;\n    } else targetProperty = target[key];\n    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);\n    // contained in target\n    if (!FORCED && targetProperty !== undefined) {\n      if (typeof sourceProperty === typeof targetProperty) continue;\n      copyConstructorProperties(sourceProperty, targetProperty);\n    }\n    // add a flag to not completely full polyfills\n    if (options.sham || (targetProperty && targetProperty.sham)) {\n      createNonEnumerableProperty(sourceProperty, 'sham', true);\n    }\n    // extend global\n    redefine(target, key, sourceProperty, options);\n  }\n};\n\n\n/***/ }),\n/* 18 */\n/***/ (function(module, exports, __webpack_require__) {\n\n// toObject with fallback for non-array-like ES3 strings\nvar IndexedObject = __webpack_require__(66);\nvar requireObjectCoercible = __webpack_require__(27);\n\nmodule.exports = function (it) {\n  return IndexedObject(requireObjectCoercible(it));\n};\n\n\n/***/ }),\n/* 19 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\nvar test = {};\n\ntest[TO_STRING_TAG] = 'z';\n\nmodule.exports = String(test) === '[object z]';\n\n\n/***/ }),\n/* 20 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar createNonEnumerableProperty = __webpack_require__(6);\n\nmodule.exports = function (key, value) {\n  try {\n    createNonEnumerableProperty(global, key, value);\n  } catch (error) {\n    global[key] = value;\n  } return value;\n};\n\n\n/***/ }),\n/* 21 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar isObject = __webpack_require__(7);\n\nvar document = global.document;\n// typeof document.createElement is 'object' in old IE\nvar EXISTS = isObject(document) && isObject(document.createElement);\n\nmodule.exports = function (it) {\n  return EXISTS ? document.createElement(it) : {};\n};\n\n\n/***/ }),\n/* 22 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (bitmap, value) {\n  return {\n    enumerable: !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable: !(bitmap & 4),\n    value: value\n  };\n};\n\n\n/***/ }),\n/* 23 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar store = __webpack_require__(33);\n\nvar functionToString = Function.toString;\n\n// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper\nif (typeof store.inspectSource != 'function') {\n  store.inspectSource = function (it) {\n    return functionToString.call(it);\n  };\n}\n\nmodule.exports = store.inspectSource;\n\n\n/***/ }),\n/* 24 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar shared = __webpack_require__(32);\nvar uid = __webpack_require__(36);\n\nvar keys = shared('keys');\n\nmodule.exports = function (key) {\n  return keys[key] || (keys[key] = uid(key));\n};\n\n\n/***/ }),\n/* 25 */\n/***/ (function(module, exports) {\n\nmodule.exports = {};\n\n\n/***/ }),\n/* 26 */\n/***/ (function(module, exports) {\n\nvar ceil = Math.ceil;\nvar floor = Math.floor;\n\n// `ToInteger` abstract operation\n// https://tc39.github.io/ecma262/#sec-tointeger\nmodule.exports = function (argument) {\n  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);\n};\n\n\n/***/ }),\n/* 27 */\n/***/ (function(module, exports) {\n\n// `RequireObjectCoercible` abstract operation\n// https://tc39.github.io/ecma262/#sec-requireobjectcoercible\nmodule.exports = function (it) {\n  if (it == undefined) throw TypeError(\"Can't call method on \" + it);\n  return it;\n};\n\n\n/***/ }),\n/* 28 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DESCRIPTORS = __webpack_require__(8);\nvar propertyIsEnumerableModule = __webpack_require__(65);\nvar createPropertyDescriptor = __webpack_require__(22);\nvar toIndexedObject = __webpack_require__(18);\nvar toPrimitive = __webpack_require__(35);\nvar has = __webpack_require__(3);\nvar IE8_DOM_DEFINE = __webpack_require__(34);\n\nvar nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;\n\n// `Object.getOwnPropertyDescriptor` method\n// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor\nexports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {\n  O = toIndexedObject(O);\n  P = toPrimitive(P, true);\n  if (IE8_DOM_DEFINE) try {\n    return nativeGetOwnPropertyDescriptor(O, P);\n  } catch (error) { /* empty */ }\n  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);\n};\n\n\n/***/ }),\n/* 29 */\n/***/ (function(module, exports) {\n\n// IE8- don't enum bug keys\nmodule.exports = [\n  'constructor',\n  'hasOwnProperty',\n  'isPrototypeOf',\n  'propertyIsEnumerable',\n  'toLocaleString',\n  'toString',\n  'valueOf'\n];\n\n\n/***/ }),\n/* 30 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar defineProperty = __webpack_require__(9).f;\nvar has = __webpack_require__(3);\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\n\nmodule.exports = function (it, TAG, STATIC) {\n  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {\n    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });\n  }\n};\n\n\n/***/ }),\n/* 31 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar aFunction = __webpack_require__(15);\n\nvar PromiseCapability = function (C) {\n  var resolve, reject;\n  this.promise = new C(function ($$resolve, $$reject) {\n    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');\n    resolve = $$resolve;\n    reject = $$reject;\n  });\n  this.resolve = aFunction(resolve);\n  this.reject = aFunction(reject);\n};\n\n// 25.4.1.5 NewPromiseCapability(C)\nmodule.exports.f = function (C) {\n  return new PromiseCapability(C);\n};\n\n\n/***/ }),\n/* 32 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar IS_PURE = __webpack_require__(12);\nvar store = __webpack_require__(33);\n\n(module.exports = function (key, value) {\n  return store[key] || (store[key] = value !== undefined ? value : {});\n})('versions', []).push({\n  version: '3.6.4',\n  mode: IS_PURE ? 'pure' : 'global',\n  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'\n});\n\n\n/***/ }),\n/* 33 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar setGlobal = __webpack_require__(20);\n\nvar SHARED = '__core-js_shared__';\nvar store = global[SHARED] || setGlobal(SHARED, {});\n\nmodule.exports = store;\n\n\n/***/ }),\n/* 34 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DESCRIPTORS = __webpack_require__(8);\nvar fails = __webpack_require__(5);\nvar createElement = __webpack_require__(21);\n\n// Thank's IE8 for his funny defineProperty\nmodule.exports = !DESCRIPTORS && !fails(function () {\n  return Object.defineProperty(createElement('div'), 'a', {\n    get: function () { return 7; }\n  }).a != 7;\n});\n\n\n/***/ }),\n/* 35 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(7);\n\n// `ToPrimitive` abstract operation\n// https://tc39.github.io/ecma262/#sec-toprimitive\n// instead of the ES6 spec version, we didn't implement @@toPrimitive case\n// and the second argument - flag - preferred type is a string\nmodule.exports = function (input, PREFERRED_STRING) {\n  if (!isObject(input)) return input;\n  var fn, val;\n  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;\n  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;\n  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;\n  throw TypeError(\"Can't convert object to primitive value\");\n};\n\n\n/***/ }),\n/* 36 */\n/***/ (function(module, exports) {\n\nvar id = 0;\nvar postfix = Math.random();\n\nmodule.exports = function (key) {\n  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);\n};\n\n\n/***/ }),\n/* 37 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar fails = __webpack_require__(5);\n\nmodule.exports = !!Object.getOwnPropertySymbols && !fails(function () {\n  // Chrome 38 Symbol has incorrect toString conversion\n  // eslint-disable-next-line no-undef\n  return !String(Symbol());\n});\n\n\n/***/ }),\n/* 38 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar TO_STRING_TAG_SUPPORT = __webpack_require__(19);\nvar classofRaw = __webpack_require__(13);\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\n// ES3 wrong here\nvar CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';\n\n// fallback for IE11 Script Access Denied error\nvar tryGet = function (it, key) {\n  try {\n    return it[key];\n  } catch (error) { /* empty */ }\n};\n\n// getting tag from ES6+ `Object.prototype.toString`\nmodule.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {\n  var O, tag, result;\n  return it === undefined ? 'Undefined' : it === null ? 'Null'\n    // @@toStringTag case\n    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag\n    // builtinTag case\n    : CORRECT_ARGUMENTS ? classofRaw(O)\n    // ES3 arguments fallback\n    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;\n};\n\n\n/***/ }),\n/* 39 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar $ = __webpack_require__(17);\nvar createIteratorConstructor = __webpack_require__(73);\nvar getPrototypeOf = __webpack_require__(45);\nvar setPrototypeOf = __webpack_require__(78);\nvar setToStringTag = __webpack_require__(30);\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar redefine = __webpack_require__(10);\nvar wellKnownSymbol = __webpack_require__(1);\nvar IS_PURE = __webpack_require__(12);\nvar Iterators = __webpack_require__(14);\nvar IteratorsCore = __webpack_require__(44);\n\nvar IteratorPrototype = IteratorsCore.IteratorPrototype;\nvar BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;\nvar ITERATOR = wellKnownSymbol('iterator');\nvar KEYS = 'keys';\nvar VALUES = 'values';\nvar ENTRIES = 'entries';\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {\n  createIteratorConstructor(IteratorConstructor, NAME, next);\n\n  var getIterationMethod = function (KIND) {\n    if (KIND === DEFAULT && defaultIterator) return defaultIterator;\n    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];\n    switch (KIND) {\n      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };\n      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };\n      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };\n    } return function () { return new IteratorConstructor(this); };\n  };\n\n  var TO_STRING_TAG = NAME + ' Iterator';\n  var INCORRECT_VALUES_NAME = false;\n  var IterablePrototype = Iterable.prototype;\n  var nativeIterator = IterablePrototype[ITERATOR]\n    || IterablePrototype['@@iterator']\n    || DEFAULT && IterablePrototype[DEFAULT];\n  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);\n  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;\n  var CurrentIteratorPrototype, methods, KEY;\n\n  // fix native\n  if (anyNativeIterator) {\n    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));\n    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {\n      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {\n        if (setPrototypeOf) {\n          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);\n        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {\n          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);\n        }\n      }\n      // Set @@toStringTag to native iterators\n      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);\n      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;\n    }\n  }\n\n  // fix Array#{values, @@iterator}.name in V8 / FF\n  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {\n    INCORRECT_VALUES_NAME = true;\n    defaultIterator = function values() { return nativeIterator.call(this); };\n  }\n\n  // define iterator\n  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {\n    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);\n  }\n  Iterators[NAME] = defaultIterator;\n\n  // export additional methods\n  if (DEFAULT) {\n    methods = {\n      values: getIterationMethod(VALUES),\n      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),\n      entries: getIterationMethod(ENTRIES)\n    };\n    if (FORCED) for (KEY in methods) {\n      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {\n        redefine(IterablePrototype, KEY, methods[KEY]);\n      }\n    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);\n  }\n\n  return methods;\n};\n\n\n/***/ }),\n/* 40 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\n\nmodule.exports = global;\n\n\n/***/ }),\n/* 41 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar has = __webpack_require__(3);\nvar toIndexedObject = __webpack_require__(18);\nvar indexOf = __webpack_require__(70).indexOf;\nvar hiddenKeys = __webpack_require__(25);\n\nmodule.exports = function (object, names) {\n  var O = toIndexedObject(object);\n  var i = 0;\n  var result = [];\n  var key;\n  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);\n  // Don't enum bug & hidden keys\n  while (names.length > i) if (has(O, key = names[i++])) {\n    ~indexOf(result, key) || result.push(key);\n  }\n  return result;\n};\n\n\n/***/ }),\n/* 42 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toInteger = __webpack_require__(26);\n\nvar min = Math.min;\n\n// `ToLength` abstract operation\n// https://tc39.github.io/ecma262/#sec-tolength\nmodule.exports = function (argument) {\n  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991\n};\n\n\n/***/ }),\n/* 43 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar fails = __webpack_require__(5);\n\nvar replacement = /#|\\.prototype\\./;\n\nvar isForced = function (feature, detection) {\n  var value = data[normalize(feature)];\n  return value == POLYFILL ? true\n    : value == NATIVE ? false\n    : typeof detection == 'function' ? fails(detection)\n    : !!detection;\n};\n\nvar normalize = isForced.normalize = function (string) {\n  return String(string).replace(replacement, '.').toLowerCase();\n};\n\nvar data = isForced.data = {};\nvar NATIVE = isForced.NATIVE = 'N';\nvar POLYFILL = isForced.POLYFILL = 'P';\n\nmodule.exports = isForced;\n\n\n/***/ }),\n/* 44 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar getPrototypeOf = __webpack_require__(45);\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar has = __webpack_require__(3);\nvar wellKnownSymbol = __webpack_require__(1);\nvar IS_PURE = __webpack_require__(12);\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar BUGGY_SAFARI_ITERATORS = false;\n\nvar returnThis = function () { return this; };\n\n// `%IteratorPrototype%` object\n// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object\nvar IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;\n\nif ([].keys) {\n  arrayIterator = [].keys();\n  // Safari 8 has buggy iterators w/o `next`\n  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;\n  else {\n    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));\n    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;\n  }\n}\n\nif (IteratorPrototype == undefined) IteratorPrototype = {};\n\n// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()\nif (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {\n  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);\n}\n\nmodule.exports = {\n  IteratorPrototype: IteratorPrototype,\n  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS\n};\n\n\n/***/ }),\n/* 45 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar has = __webpack_require__(3);\nvar toObject = __webpack_require__(74);\nvar sharedKey = __webpack_require__(24);\nvar CORRECT_PROTOTYPE_GETTER = __webpack_require__(75);\n\nvar IE_PROTO = sharedKey('IE_PROTO');\nvar ObjectPrototype = Object.prototype;\n\n// `Object.getPrototypeOf` method\n// https://tc39.github.io/ecma262/#sec-object.getprototypeof\nmodule.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {\n  O = toObject(O);\n  if (has(O, IE_PROTO)) return O[IE_PROTO];\n  if (typeof O.constructor == 'function' && O instanceof O.constructor) {\n    return O.constructor.prototype;\n  } return O instanceof Object ? ObjectPrototype : null;\n};\n\n\n/***/ }),\n/* 46 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\nvar defineProperties = __webpack_require__(76);\nvar enumBugKeys = __webpack_require__(29);\nvar hiddenKeys = __webpack_require__(25);\nvar html = __webpack_require__(47);\nvar documentCreateElement = __webpack_require__(21);\nvar sharedKey = __webpack_require__(24);\n\nvar GT = '>';\nvar LT = '<';\nvar PROTOTYPE = 'prototype';\nvar SCRIPT = 'script';\nvar IE_PROTO = sharedKey('IE_PROTO');\n\nvar EmptyConstructor = function () { /* empty */ };\n\nvar scriptTag = function (content) {\n  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;\n};\n\n// Create object with fake `null` prototype: use ActiveX Object with cleared prototype\nvar NullProtoObjectViaActiveX = function (activeXDocument) {\n  activeXDocument.write(scriptTag(''));\n  activeXDocument.close();\n  var temp = activeXDocument.parentWindow.Object;\n  activeXDocument = null; // avoid memory leak\n  return temp;\n};\n\n// Create object with fake `null` prototype: use iframe Object with cleared prototype\nvar NullProtoObjectViaIFrame = function () {\n  // Thrash, waste and sodomy: IE GC bug\n  var iframe = documentCreateElement('iframe');\n  var JS = 'java' + SCRIPT + ':';\n  var iframeDocument;\n  iframe.style.display = 'none';\n  html.appendChild(iframe);\n  // https://github.com/zloirock/core-js/issues/475\n  iframe.src = String(JS);\n  iframeDocument = iframe.contentWindow.document;\n  iframeDocument.open();\n  iframeDocument.write(scriptTag('document.F=Object'));\n  iframeDocument.close();\n  return iframeDocument.F;\n};\n\n// Check for document.domain and active x support\n// No need to use active x approach when document.domain is not set\n// see https://github.com/es-shims/es5-shim/issues/150\n// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346\n// avoid IE GC bug\nvar activeXDocument;\nvar NullProtoObject = function () {\n  try {\n    /* global ActiveXObject */\n    activeXDocument = document.domain && new ActiveXObject('htmlfile');\n  } catch (error) { /* ignore */ }\n  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();\n  var length = enumBugKeys.length;\n  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];\n  return NullProtoObject();\n};\n\nhiddenKeys[IE_PROTO] = true;\n\n// `Object.create` method\n// https://tc39.github.io/ecma262/#sec-object.create\nmodule.exports = Object.create || function create(O, Properties) {\n  var result;\n  if (O !== null) {\n    EmptyConstructor[PROTOTYPE] = anObject(O);\n    result = new EmptyConstructor();\n    EmptyConstructor[PROTOTYPE] = null;\n    // add \"__proto__\" for Object.getPrototypeOf polyfill\n    result[IE_PROTO] = O;\n  } else result = NullProtoObject();\n  return Properties === undefined ? result : defineProperties(result, Properties);\n};\n\n\n/***/ }),\n/* 47 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getBuiltIn = __webpack_require__(11);\n\nmodule.exports = getBuiltIn('document', 'documentElement');\n\n\n/***/ }),\n/* 48 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\n\nmodule.exports = global.Promise;\n\n\n/***/ }),\n/* 49 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\nvar isArrayIteratorMethod = __webpack_require__(88);\nvar toLength = __webpack_require__(42);\nvar bind = __webpack_require__(50);\nvar getIteratorMethod = __webpack_require__(89);\nvar callWithSafeIterationClosing = __webpack_require__(90);\n\nvar Result = function (stopped, result) {\n  this.stopped = stopped;\n  this.result = result;\n};\n\nvar iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {\n  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);\n  var iterator, iterFn, index, length, result, next, step;\n\n  if (IS_ITERATOR) {\n    iterator = iterable;\n  } else {\n    iterFn = getIteratorMethod(iterable);\n    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');\n    // optimisation for array iterators\n    if (isArrayIteratorMethod(iterFn)) {\n      for (index = 0, length = toLength(iterable.length); length > index; index++) {\n        result = AS_ENTRIES\n          ? boundFunction(anObject(step = iterable[index])[0], step[1])\n          : boundFunction(iterable[index]);\n        if (result && result instanceof Result) return result;\n      } return new Result(false);\n    }\n    iterator = iterFn.call(iterable);\n  }\n\n  next = iterator.next;\n  while (!(step = next.call(iterator)).done) {\n    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);\n    if (typeof result == 'object' && result && result instanceof Result) return result;\n  } return new Result(false);\n};\n\niterate.stop = function (result) {\n  return new Result(true, result);\n};\n\n\n/***/ }),\n/* 50 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar aFunction = __webpack_require__(15);\n\n// optional / simple context binding\nmodule.exports = function (fn, that, length) {\n  aFunction(fn);\n  if (that === undefined) return fn;\n  switch (length) {\n    case 0: return function () {\n      return fn.call(that);\n    };\n    case 1: return function (a) {\n      return fn.call(that, a);\n    };\n    case 2: return function (a, b) {\n      return fn.call(that, a, b);\n    };\n    case 3: return function (a, b, c) {\n      return fn.call(that, a, b, c);\n    };\n  }\n  return function (/* ...args */) {\n    return fn.apply(that, arguments);\n  };\n};\n\n\n/***/ }),\n/* 51 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\nvar aFunction = __webpack_require__(15);\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar SPECIES = wellKnownSymbol('species');\n\n// `SpeciesConstructor` abstract operation\n// https://tc39.github.io/ecma262/#sec-speciesconstructor\nmodule.exports = function (O, defaultConstructor) {\n  var C = anObject(O).constructor;\n  var S;\n  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);\n};\n\n\n/***/ }),\n/* 52 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar fails = __webpack_require__(5);\nvar classof = __webpack_require__(13);\nvar bind = __webpack_require__(50);\nvar html = __webpack_require__(47);\nvar createElement = __webpack_require__(21);\nvar IS_IOS = __webpack_require__(53);\n\nvar location = global.location;\nvar set = global.setImmediate;\nvar clear = global.clearImmediate;\nvar process = global.process;\nvar MessageChannel = global.MessageChannel;\nvar Dispatch = global.Dispatch;\nvar counter = 0;\nvar queue = {};\nvar ONREADYSTATECHANGE = 'onreadystatechange';\nvar defer, channel, port;\n\nvar run = function (id) {\n  // eslint-disable-next-line no-prototype-builtins\n  if (queue.hasOwnProperty(id)) {\n    var fn = queue[id];\n    delete queue[id];\n    fn();\n  }\n};\n\nvar runner = function (id) {\n  return function () {\n    run(id);\n  };\n};\n\nvar listener = function (event) {\n  run(event.data);\n};\n\nvar post = function (id) {\n  // old engines have not location.origin\n  global.postMessage(id + '', location.protocol + '//' + location.host);\n};\n\n// Node.js 0.9+ & IE10+ has setImmediate, otherwise:\nif (!set || !clear) {\n  set = function setImmediate(fn) {\n    var args = [];\n    var i = 1;\n    while (arguments.length > i) args.push(arguments[i++]);\n    queue[++counter] = function () {\n      // eslint-disable-next-line no-new-func\n      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);\n    };\n    defer(counter);\n    return counter;\n  };\n  clear = function clearImmediate(id) {\n    delete queue[id];\n  };\n  // Node.js 0.8-\n  if (classof(process) == 'process') {\n    defer = function (id) {\n      process.nextTick(runner(id));\n    };\n  // Sphere (JS game engine) Dispatch API\n  } else if (Dispatch && Dispatch.now) {\n    defer = function (id) {\n      Dispatch.now(runner(id));\n    };\n  // Browsers with MessageChannel, includes WebWorkers\n  // except iOS - https://github.com/zloirock/core-js/issues/624\n  } else if (MessageChannel && !IS_IOS) {\n    channel = new MessageChannel();\n    port = channel.port2;\n    channel.port1.onmessage = listener;\n    defer = bind(port.postMessage, port, 1);\n  // Browsers with postMessage, skip WebWorkers\n  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'\n  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts && !fails(post)) {\n    defer = post;\n    global.addEventListener('message', listener, false);\n  // IE8-\n  } else if (ONREADYSTATECHANGE in createElement('script')) {\n    defer = function (id) {\n      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {\n        html.removeChild(this);\n        run(id);\n      };\n    };\n  // Rest old browsers\n  } else {\n    defer = function (id) {\n      setTimeout(runner(id), 0);\n    };\n  }\n}\n\nmodule.exports = {\n  set: set,\n  clear: clear\n};\n\n\n/***/ }),\n/* 53 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar userAgent = __webpack_require__(54);\n\nmodule.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);\n\n\n/***/ }),\n/* 54 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getBuiltIn = __webpack_require__(11);\n\nmodule.exports = getBuiltIn('navigator', 'userAgent') || '';\n\n\n/***/ }),\n/* 55 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\nvar isObject = __webpack_require__(7);\nvar newPromiseCapability = __webpack_require__(31);\n\nmodule.exports = function (C, x) {\n  anObject(C);\n  if (isObject(x) && x.constructor === C) return x;\n  var promiseCapability = newPromiseCapability.f(C);\n  var resolve = promiseCapability.resolve;\n  resolve(x);\n  return promiseCapability.promise;\n};\n\n\n/***/ }),\n/* 56 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (exec) {\n  try {\n    return { error: false, value: exec() };\n  } catch (error) {\n    return { error: true, value: error };\n  }\n};\n\n\n/***/ }),\n/* 57 */\n/***/ (function(module, exports, __webpack_require__) {\n\n__webpack_require__(58);\n__webpack_require__(63);\n__webpack_require__(80);\n__webpack_require__(84);\n__webpack_require__(95);\n__webpack_require__(96);\nvar path = __webpack_require__(40);\n\nmodule.exports = path.Promise;\n\n\n/***/ }),\n/* 58 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar TO_STRING_TAG_SUPPORT = __webpack_require__(19);\nvar redefine = __webpack_require__(10);\nvar toString = __webpack_require__(62);\n\n// `Object.prototype.toString` method\n// https://tc39.github.io/ecma262/#sec-object.prototype.tostring\nif (!TO_STRING_TAG_SUPPORT) {\n  redefine(Object.prototype, 'toString', toString, { unsafe: true });\n}\n\n\n/***/ }),\n/* 59 */\n/***/ (function(module, exports) {\n\nvar g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n/***/ }),\n/* 60 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar NATIVE_SYMBOL = __webpack_require__(37);\n\nmodule.exports = NATIVE_SYMBOL\n  // eslint-disable-next-line no-undef\n  && !Symbol.sham\n  // eslint-disable-next-line no-undef\n  && typeof Symbol.iterator == 'symbol';\n\n\n/***/ }),\n/* 61 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar inspectSource = __webpack_require__(23);\n\nvar WeakMap = global.WeakMap;\n\nmodule.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));\n\n\n/***/ }),\n/* 62 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar TO_STRING_TAG_SUPPORT = __webpack_require__(19);\nvar classof = __webpack_require__(38);\n\n// `Object.prototype.toString` method implementation\n// https://tc39.github.io/ecma262/#sec-object.prototype.tostring\nmodule.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {\n  return '[object ' + classof(this) + ']';\n};\n\n\n/***/ }),\n/* 63 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar charAt = __webpack_require__(64).charAt;\nvar InternalStateModule = __webpack_require__(16);\nvar defineIterator = __webpack_require__(39);\n\nvar STRING_ITERATOR = 'String Iterator';\nvar setInternalState = InternalStateModule.set;\nvar getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);\n\n// `String.prototype[@@iterator]` method\n// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator\ndefineIterator(String, 'String', function (iterated) {\n  setInternalState(this, {\n    type: STRING_ITERATOR,\n    string: String(iterated),\n    index: 0\n  });\n// `%StringIteratorPrototype%.next` method\n// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next\n}, function next() {\n  var state = getInternalState(this);\n  var string = state.string;\n  var index = state.index;\n  var point;\n  if (index >= string.length) return { value: undefined, done: true };\n  point = charAt(string, index);\n  state.index += point.length;\n  return { value: point, done: false };\n});\n\n\n/***/ }),\n/* 64 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toInteger = __webpack_require__(26);\nvar requireObjectCoercible = __webpack_require__(27);\n\n// `String.prototype.{ codePointAt, at }` methods implementation\nvar createMethod = function (CONVERT_TO_STRING) {\n  return function ($this, pos) {\n    var S = String(requireObjectCoercible($this));\n    var position = toInteger(pos);\n    var size = S.length;\n    var first, second;\n    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;\n    first = S.charCodeAt(position);\n    return first < 0xD800 || first > 0xDBFF || position + 1 === size\n      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF\n        ? CONVERT_TO_STRING ? S.charAt(position) : first\n        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;\n  };\n};\n\nmodule.exports = {\n  // `String.prototype.codePointAt` method\n  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat\n  codeAt: createMethod(false),\n  // `String.prototype.at` method\n  // https://github.com/mathiasbynens/String.prototype.at\n  charAt: createMethod(true)\n};\n\n\n/***/ }),\n/* 65 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar nativePropertyIsEnumerable = {}.propertyIsEnumerable;\nvar getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;\n\n// Nashorn ~ JDK8 bug\nvar NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);\n\n// `Object.prototype.propertyIsEnumerable` method implementation\n// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable\nexports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {\n  var descriptor = getOwnPropertyDescriptor(this, V);\n  return !!descriptor && descriptor.enumerable;\n} : nativePropertyIsEnumerable;\n\n\n/***/ }),\n/* 66 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar fails = __webpack_require__(5);\nvar classof = __webpack_require__(13);\n\nvar split = ''.split;\n\n// fallback for non-array-like ES3 and non-enumerable old V8 strings\nmodule.exports = fails(function () {\n  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346\n  // eslint-disable-next-line no-prototype-builtins\n  return !Object('z').propertyIsEnumerable(0);\n}) ? function (it) {\n  return classof(it) == 'String' ? split.call(it, '') : Object(it);\n} : Object;\n\n\n/***/ }),\n/* 67 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar has = __webpack_require__(3);\nvar ownKeys = __webpack_require__(68);\nvar getOwnPropertyDescriptorModule = __webpack_require__(28);\nvar definePropertyModule = __webpack_require__(9);\n\nmodule.exports = function (target, source) {\n  var keys = ownKeys(source);\n  var defineProperty = definePropertyModule.f;\n  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;\n  for (var i = 0; i < keys.length; i++) {\n    var key = keys[i];\n    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));\n  }\n};\n\n\n/***/ }),\n/* 68 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar getBuiltIn = __webpack_require__(11);\nvar getOwnPropertyNamesModule = __webpack_require__(69);\nvar getOwnPropertySymbolsModule = __webpack_require__(72);\nvar anObject = __webpack_require__(2);\n\n// all object keys, includes non-enumerable and symbols\nmodule.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {\n  var keys = getOwnPropertyNamesModule.f(anObject(it));\n  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;\n  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;\n};\n\n\n/***/ }),\n/* 69 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar internalObjectKeys = __webpack_require__(41);\nvar enumBugKeys = __webpack_require__(29);\n\nvar hiddenKeys = enumBugKeys.concat('length', 'prototype');\n\n// `Object.getOwnPropertyNames` method\n// https://tc39.github.io/ecma262/#sec-object.getownpropertynames\nexports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {\n  return internalObjectKeys(O, hiddenKeys);\n};\n\n\n/***/ }),\n/* 70 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toIndexedObject = __webpack_require__(18);\nvar toLength = __webpack_require__(42);\nvar toAbsoluteIndex = __webpack_require__(71);\n\n// `Array.prototype.{ indexOf, includes }` methods implementation\nvar createMethod = function (IS_INCLUDES) {\n  return function ($this, el, fromIndex) {\n    var O = toIndexedObject($this);\n    var length = toLength(O.length);\n    var index = toAbsoluteIndex(fromIndex, length);\n    var value;\n    // Array#includes uses SameValueZero equality algorithm\n    // eslint-disable-next-line no-self-compare\n    if (IS_INCLUDES && el != el) while (length > index) {\n      value = O[index++];\n      // eslint-disable-next-line no-self-compare\n      if (value != value) return true;\n    // Array#indexOf ignores holes, Array#includes - not\n    } else for (;length > index; index++) {\n      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;\n    } return !IS_INCLUDES && -1;\n  };\n};\n\nmodule.exports = {\n  // `Array.prototype.includes` method\n  // https://tc39.github.io/ecma262/#sec-array.prototype.includes\n  includes: createMethod(true),\n  // `Array.prototype.indexOf` method\n  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof\n  indexOf: createMethod(false)\n};\n\n\n/***/ }),\n/* 71 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar toInteger = __webpack_require__(26);\n\nvar max = Math.max;\nvar min = Math.min;\n\n// Helper for a popular repeating case of the spec:\n// Let integer be ? ToInteger(index).\n// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).\nmodule.exports = function (index, length) {\n  var integer = toInteger(index);\n  return integer < 0 ? max(integer + length, 0) : min(integer, length);\n};\n\n\n/***/ }),\n/* 72 */\n/***/ (function(module, exports) {\n\nexports.f = Object.getOwnPropertySymbols;\n\n\n/***/ }),\n/* 73 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar IteratorPrototype = __webpack_require__(44).IteratorPrototype;\nvar create = __webpack_require__(46);\nvar createPropertyDescriptor = __webpack_require__(22);\nvar setToStringTag = __webpack_require__(30);\nvar Iterators = __webpack_require__(14);\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (IteratorConstructor, NAME, next) {\n  var TO_STRING_TAG = NAME + ' Iterator';\n  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });\n  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);\n  Iterators[TO_STRING_TAG] = returnThis;\n  return IteratorConstructor;\n};\n\n\n/***/ }),\n/* 74 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar requireObjectCoercible = __webpack_require__(27);\n\n// `ToObject` abstract operation\n// https://tc39.github.io/ecma262/#sec-toobject\nmodule.exports = function (argument) {\n  return Object(requireObjectCoercible(argument));\n};\n\n\n/***/ }),\n/* 75 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar fails = __webpack_require__(5);\n\nmodule.exports = !fails(function () {\n  function F() { /* empty */ }\n  F.prototype.constructor = null;\n  return Object.getPrototypeOf(new F()) !== F.prototype;\n});\n\n\n/***/ }),\n/* 76 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar DESCRIPTORS = __webpack_require__(8);\nvar definePropertyModule = __webpack_require__(9);\nvar anObject = __webpack_require__(2);\nvar objectKeys = __webpack_require__(77);\n\n// `Object.defineProperties` method\n// https://tc39.github.io/ecma262/#sec-object.defineproperties\nmodule.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {\n  anObject(O);\n  var keys = objectKeys(Properties);\n  var length = keys.length;\n  var index = 0;\n  var key;\n  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);\n  return O;\n};\n\n\n/***/ }),\n/* 77 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar internalObjectKeys = __webpack_require__(41);\nvar enumBugKeys = __webpack_require__(29);\n\n// `Object.keys` method\n// https://tc39.github.io/ecma262/#sec-object.keys\nmodule.exports = Object.keys || function keys(O) {\n  return internalObjectKeys(O, enumBugKeys);\n};\n\n\n/***/ }),\n/* 78 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\nvar aPossiblePrototype = __webpack_require__(79);\n\n// `Object.setPrototypeOf` method\n// https://tc39.github.io/ecma262/#sec-object.setprototypeof\n// Works with __proto__ only. Old v8 can't work with null proto objects.\n/* eslint-disable no-proto */\nmodule.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {\n  var CORRECT_SETTER = false;\n  var test = {};\n  var setter;\n  try {\n    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;\n    setter.call(test, []);\n    CORRECT_SETTER = test instanceof Array;\n  } catch (error) { /* empty */ }\n  return function setPrototypeOf(O, proto) {\n    anObject(O);\n    aPossiblePrototype(proto);\n    if (CORRECT_SETTER) setter.call(O, proto);\n    else O.__proto__ = proto;\n    return O;\n  };\n}() : undefined);\n\n\n/***/ }),\n/* 79 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar isObject = __webpack_require__(7);\n\nmodule.exports = function (it) {\n  if (!isObject(it) && it !== null) {\n    throw TypeError(\"Can't set \" + String(it) + ' as a prototype');\n  } return it;\n};\n\n\n/***/ }),\n/* 80 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar DOMIterables = __webpack_require__(81);\nvar ArrayIteratorMethods = __webpack_require__(82);\nvar createNonEnumerableProperty = __webpack_require__(6);\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\nvar ArrayValues = ArrayIteratorMethods.values;\n\nfor (var COLLECTION_NAME in DOMIterables) {\n  var Collection = global[COLLECTION_NAME];\n  var CollectionPrototype = Collection && Collection.prototype;\n  if (CollectionPrototype) {\n    // some Chrome versions have non-configurable methods on DOMTokenList\n    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {\n      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);\n    } catch (error) {\n      CollectionPrototype[ITERATOR] = ArrayValues;\n    }\n    if (!CollectionPrototype[TO_STRING_TAG]) {\n      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);\n    }\n    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {\n      // some Chrome versions have non-configurable methods on DOMTokenList\n      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {\n        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);\n      } catch (error) {\n        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];\n      }\n    }\n  }\n}\n\n\n/***/ }),\n/* 81 */\n/***/ (function(module, exports) {\n\n// iterable DOM collections\n// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods\nmodule.exports = {\n  CSSRuleList: 0,\n  CSSStyleDeclaration: 0,\n  CSSValueList: 0,\n  ClientRectList: 0,\n  DOMRectList: 0,\n  DOMStringList: 0,\n  DOMTokenList: 1,\n  DataTransferItemList: 0,\n  FileList: 0,\n  HTMLAllCollection: 0,\n  HTMLCollection: 0,\n  HTMLFormElement: 0,\n  HTMLSelectElement: 0,\n  MediaList: 0,\n  MimeTypeArray: 0,\n  NamedNodeMap: 0,\n  NodeList: 1,\n  PaintRequestList: 0,\n  Plugin: 0,\n  PluginArray: 0,\n  SVGLengthList: 0,\n  SVGNumberList: 0,\n  SVGPathSegList: 0,\n  SVGPointList: 0,\n  SVGStringList: 0,\n  SVGTransformList: 0,\n  SourceBufferList: 0,\n  StyleSheetList: 0,\n  TextTrackCueList: 0,\n  TextTrackList: 0,\n  TouchList: 0\n};\n\n\n/***/ }),\n/* 82 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar toIndexedObject = __webpack_require__(18);\nvar addToUnscopables = __webpack_require__(83);\nvar Iterators = __webpack_require__(14);\nvar InternalStateModule = __webpack_require__(16);\nvar defineIterator = __webpack_require__(39);\n\nvar ARRAY_ITERATOR = 'Array Iterator';\nvar setInternalState = InternalStateModule.set;\nvar getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);\n\n// `Array.prototype.entries` method\n// https://tc39.github.io/ecma262/#sec-array.prototype.entries\n// `Array.prototype.keys` method\n// https://tc39.github.io/ecma262/#sec-array.prototype.keys\n// `Array.prototype.values` method\n// https://tc39.github.io/ecma262/#sec-array.prototype.values\n// `Array.prototype[@@iterator]` method\n// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator\n// `CreateArrayIterator` internal method\n// https://tc39.github.io/ecma262/#sec-createarrayiterator\nmodule.exports = defineIterator(Array, 'Array', function (iterated, kind) {\n  setInternalState(this, {\n    type: ARRAY_ITERATOR,\n    target: toIndexedObject(iterated), // target\n    index: 0,                          // next index\n    kind: kind                         // kind\n  });\n// `%ArrayIteratorPrototype%.next` method\n// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next\n}, function () {\n  var state = getInternalState(this);\n  var target = state.target;\n  var kind = state.kind;\n  var index = state.index++;\n  if (!target || index >= target.length) {\n    state.target = undefined;\n    return { value: undefined, done: true };\n  }\n  if (kind == 'keys') return { value: index, done: false };\n  if (kind == 'values') return { value: target[index], done: false };\n  return { value: [index, target[index]], done: false };\n}, 'values');\n\n// argumentsList[@@iterator] is %ArrayProto_values%\n// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject\n// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject\nIterators.Arguments = Iterators.Array;\n\n// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables\naddToUnscopables('keys');\naddToUnscopables('values');\naddToUnscopables('entries');\n\n\n/***/ }),\n/* 83 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar wellKnownSymbol = __webpack_require__(1);\nvar create = __webpack_require__(46);\nvar definePropertyModule = __webpack_require__(9);\n\nvar UNSCOPABLES = wellKnownSymbol('unscopables');\nvar ArrayPrototype = Array.prototype;\n\n// Array.prototype[@@unscopables]\n// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables\nif (ArrayPrototype[UNSCOPABLES] == undefined) {\n  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {\n    configurable: true,\n    value: create(null)\n  });\n}\n\n// add a key to Array.prototype[@@unscopables]\nmodule.exports = function (key) {\n  ArrayPrototype[UNSCOPABLES][key] = true;\n};\n\n\n/***/ }),\n/* 84 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar $ = __webpack_require__(17);\nvar IS_PURE = __webpack_require__(12);\nvar global = __webpack_require__(0);\nvar getBuiltIn = __webpack_require__(11);\nvar NativePromise = __webpack_require__(48);\nvar redefine = __webpack_require__(10);\nvar redefineAll = __webpack_require__(85);\nvar setToStringTag = __webpack_require__(30);\nvar setSpecies = __webpack_require__(86);\nvar isObject = __webpack_require__(7);\nvar aFunction = __webpack_require__(15);\nvar anInstance = __webpack_require__(87);\nvar classof = __webpack_require__(13);\nvar inspectSource = __webpack_require__(23);\nvar iterate = __webpack_require__(49);\nvar checkCorrectnessOfIteration = __webpack_require__(91);\nvar speciesConstructor = __webpack_require__(51);\nvar task = __webpack_require__(52).set;\nvar microtask = __webpack_require__(92);\nvar promiseResolve = __webpack_require__(55);\nvar hostReportErrors = __webpack_require__(93);\nvar newPromiseCapabilityModule = __webpack_require__(31);\nvar perform = __webpack_require__(56);\nvar InternalStateModule = __webpack_require__(16);\nvar isForced = __webpack_require__(43);\nvar wellKnownSymbol = __webpack_require__(1);\nvar V8_VERSION = __webpack_require__(94);\n\nvar SPECIES = wellKnownSymbol('species');\nvar PROMISE = 'Promise';\nvar getInternalState = InternalStateModule.get;\nvar setInternalState = InternalStateModule.set;\nvar getInternalPromiseState = InternalStateModule.getterFor(PROMISE);\nvar PromiseConstructor = NativePromise;\nvar TypeError = global.TypeError;\nvar document = global.document;\nvar process = global.process;\nvar $fetch = getBuiltIn('fetch');\nvar newPromiseCapability = newPromiseCapabilityModule.f;\nvar newGenericPromiseCapability = newPromiseCapability;\nvar IS_NODE = classof(process) == 'process';\nvar DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);\nvar UNHANDLED_REJECTION = 'unhandledrejection';\nvar REJECTION_HANDLED = 'rejectionhandled';\nvar PENDING = 0;\nvar FULFILLED = 1;\nvar REJECTED = 2;\nvar HANDLED = 1;\nvar UNHANDLED = 2;\nvar Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;\n\nvar FORCED = isForced(PROMISE, function () {\n  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);\n  if (!GLOBAL_CORE_JS_PROMISE) {\n    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables\n    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565\n    // We can't detect it synchronously, so just check versions\n    if (V8_VERSION === 66) return true;\n    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test\n    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;\n  }\n  // We need Promise#finally in the pure version for preventing prototype pollution\n  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;\n  // We can't use @@species feature detection in V8 since it causes\n  // deoptimization and performance degradation\n  // https://github.com/zloirock/core-js/issues/679\n  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;\n  // Detect correctness of subclassing with @@species support\n  var promise = PromiseConstructor.resolve(1);\n  var FakePromise = function (exec) {\n    exec(function () { /* empty */ }, function () { /* empty */ });\n  };\n  var constructor = promise.constructor = {};\n  constructor[SPECIES] = FakePromise;\n  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);\n});\n\nvar INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {\n  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });\n});\n\n// helpers\nvar isThenable = function (it) {\n  var then;\n  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;\n};\n\nvar notify = function (promise, state, isReject) {\n  if (state.notified) return;\n  state.notified = true;\n  var chain = state.reactions;\n  microtask(function () {\n    var value = state.value;\n    var ok = state.state == FULFILLED;\n    var index = 0;\n    // variable length - can't use forEach\n    while (chain.length > index) {\n      var reaction = chain[index++];\n      var handler = ok ? reaction.ok : reaction.fail;\n      var resolve = reaction.resolve;\n      var reject = reaction.reject;\n      var domain = reaction.domain;\n      var result, then, exited;\n      try {\n        if (handler) {\n          if (!ok) {\n            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);\n            state.rejection = HANDLED;\n          }\n          if (handler === true) result = value;\n          else {\n            if (domain) domain.enter();\n            result = handler(value); // can throw\n            if (domain) {\n              domain.exit();\n              exited = true;\n            }\n          }\n          if (result === reaction.promise) {\n            reject(TypeError('Promise-chain cycle'));\n          } else if (then = isThenable(result)) {\n            then.call(result, resolve, reject);\n          } else resolve(result);\n        } else reject(value);\n      } catch (error) {\n        if (domain && !exited) domain.exit();\n        reject(error);\n      }\n    }\n    state.reactions = [];\n    state.notified = false;\n    if (isReject && !state.rejection) onUnhandled(promise, state);\n  });\n};\n\nvar dispatchEvent = function (name, promise, reason) {\n  var event, handler;\n  if (DISPATCH_EVENT) {\n    event = document.createEvent('Event');\n    event.promise = promise;\n    event.reason = reason;\n    event.initEvent(name, false, true);\n    global.dispatchEvent(event);\n  } else event = { promise: promise, reason: reason };\n  if (handler = global['on' + name]) handler(event);\n  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);\n};\n\nvar onUnhandled = function (promise, state) {\n  task.call(global, function () {\n    var value = state.value;\n    var IS_UNHANDLED = isUnhandled(state);\n    var result;\n    if (IS_UNHANDLED) {\n      result = perform(function () {\n        if (IS_NODE) {\n          process.emit('unhandledRejection', value, promise);\n        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);\n      });\n      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should\n      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;\n      if (result.error) throw result.value;\n    }\n  });\n};\n\nvar isUnhandled = function (state) {\n  return state.rejection !== HANDLED && !state.parent;\n};\n\nvar onHandleUnhandled = function (promise, state) {\n  task.call(global, function () {\n    if (IS_NODE) {\n      process.emit('rejectionHandled', promise);\n    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);\n  });\n};\n\nvar bind = function (fn, promise, state, unwrap) {\n  return function (value) {\n    fn(promise, state, value, unwrap);\n  };\n};\n\nvar internalReject = function (promise, state, value, unwrap) {\n  if (state.done) return;\n  state.done = true;\n  if (unwrap) state = unwrap;\n  state.value = value;\n  state.state = REJECTED;\n  notify(promise, state, true);\n};\n\nvar internalResolve = function (promise, state, value, unwrap) {\n  if (state.done) return;\n  state.done = true;\n  if (unwrap) state = unwrap;\n  try {\n    if (promise === value) throw TypeError(\"Promise can't be resolved itself\");\n    var then = isThenable(value);\n    if (then) {\n      microtask(function () {\n        var wrapper = { done: false };\n        try {\n          then.call(value,\n            bind(internalResolve, promise, wrapper, state),\n            bind(internalReject, promise, wrapper, state)\n          );\n        } catch (error) {\n          internalReject(promise, wrapper, error, state);\n        }\n      });\n    } else {\n      state.value = value;\n      state.state = FULFILLED;\n      notify(promise, state, false);\n    }\n  } catch (error) {\n    internalReject(promise, { done: false }, error, state);\n  }\n};\n\n// constructor polyfill\nif (FORCED) {\n  // 25.4.3.1 Promise(executor)\n  PromiseConstructor = function Promise(executor) {\n    anInstance(this, PromiseConstructor, PROMISE);\n    aFunction(executor);\n    Internal.call(this);\n    var state = getInternalState(this);\n    try {\n      executor(bind(internalResolve, this, state), bind(internalReject, this, state));\n    } catch (error) {\n      internalReject(this, state, error);\n    }\n  };\n  // eslint-disable-next-line no-unused-vars\n  Internal = function Promise(executor) {\n    setInternalState(this, {\n      type: PROMISE,\n      done: false,\n      notified: false,\n      parent: false,\n      reactions: [],\n      rejection: false,\n      state: PENDING,\n      value: undefined\n    });\n  };\n  Internal.prototype = redefineAll(PromiseConstructor.prototype, {\n    // `Promise.prototype.then` method\n    // https://tc39.github.io/ecma262/#sec-promise.prototype.then\n    then: function then(onFulfilled, onRejected) {\n      var state = getInternalPromiseState(this);\n      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));\n      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;\n      reaction.fail = typeof onRejected == 'function' && onRejected;\n      reaction.domain = IS_NODE ? process.domain : undefined;\n      state.parent = true;\n      state.reactions.push(reaction);\n      if (state.state != PENDING) notify(this, state, false);\n      return reaction.promise;\n    },\n    // `Promise.prototype.catch` method\n    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch\n    'catch': function (onRejected) {\n      return this.then(undefined, onRejected);\n    }\n  });\n  OwnPromiseCapability = function () {\n    var promise = new Internal();\n    var state = getInternalState(promise);\n    this.promise = promise;\n    this.resolve = bind(internalResolve, promise, state);\n    this.reject = bind(internalReject, promise, state);\n  };\n  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {\n    return C === PromiseConstructor || C === PromiseWrapper\n      ? new OwnPromiseCapability(C)\n      : newGenericPromiseCapability(C);\n  };\n\n  if (!IS_PURE && typeof NativePromise == 'function') {\n    nativeThen = NativePromise.prototype.then;\n\n    // wrap native Promise#then for native async functions\n    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {\n      var that = this;\n      return new PromiseConstructor(function (resolve, reject) {\n        nativeThen.call(that, resolve, reject);\n      }).then(onFulfilled, onRejected);\n    // https://github.com/zloirock/core-js/issues/640\n    }, { unsafe: true });\n\n    // wrap fetch result\n    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {\n      // eslint-disable-next-line no-unused-vars\n      fetch: function fetch(input /* , init */) {\n        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));\n      }\n    });\n  }\n}\n\n$({ global: true, wrap: true, forced: FORCED }, {\n  Promise: PromiseConstructor\n});\n\nsetToStringTag(PromiseConstructor, PROMISE, false, true);\nsetSpecies(PROMISE);\n\nPromiseWrapper = getBuiltIn(PROMISE);\n\n// statics\n$({ target: PROMISE, stat: true, forced: FORCED }, {\n  // `Promise.reject` method\n  // https://tc39.github.io/ecma262/#sec-promise.reject\n  reject: function reject(r) {\n    var capability = newPromiseCapability(this);\n    capability.reject.call(undefined, r);\n    return capability.promise;\n  }\n});\n\n$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {\n  // `Promise.resolve` method\n  // https://tc39.github.io/ecma262/#sec-promise.resolve\n  resolve: function resolve(x) {\n    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);\n  }\n});\n\n$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {\n  // `Promise.all` method\n  // https://tc39.github.io/ecma262/#sec-promise.all\n  all: function all(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var resolve = capability.resolve;\n    var reject = capability.reject;\n    var result = perform(function () {\n      var $promiseResolve = aFunction(C.resolve);\n      var values = [];\n      var counter = 0;\n      var remaining = 1;\n      iterate(iterable, function (promise) {\n        var index = counter++;\n        var alreadyCalled = false;\n        values.push(undefined);\n        remaining++;\n        $promiseResolve.call(C, promise).then(function (value) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[index] = value;\n          --remaining || resolve(values);\n        }, reject);\n      });\n      --remaining || resolve(values);\n    });\n    if (result.error) reject(result.value);\n    return capability.promise;\n  },\n  // `Promise.race` method\n  // https://tc39.github.io/ecma262/#sec-promise.race\n  race: function race(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var reject = capability.reject;\n    var result = perform(function () {\n      var $promiseResolve = aFunction(C.resolve);\n      iterate(iterable, function (promise) {\n        $promiseResolve.call(C, promise).then(capability.resolve, reject);\n      });\n    });\n    if (result.error) reject(result.value);\n    return capability.promise;\n  }\n});\n\n\n/***/ }),\n/* 85 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar redefine = __webpack_require__(10);\n\nmodule.exports = function (target, src, options) {\n  for (var key in src) redefine(target, key, src[key], options);\n  return target;\n};\n\n\n/***/ }),\n/* 86 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar getBuiltIn = __webpack_require__(11);\nvar definePropertyModule = __webpack_require__(9);\nvar wellKnownSymbol = __webpack_require__(1);\nvar DESCRIPTORS = __webpack_require__(8);\n\nvar SPECIES = wellKnownSymbol('species');\n\nmodule.exports = function (CONSTRUCTOR_NAME) {\n  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);\n  var defineProperty = definePropertyModule.f;\n\n  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {\n    defineProperty(Constructor, SPECIES, {\n      configurable: true,\n      get: function () { return this; }\n    });\n  }\n};\n\n\n/***/ }),\n/* 87 */\n/***/ (function(module, exports) {\n\nmodule.exports = function (it, Constructor, name) {\n  if (!(it instanceof Constructor)) {\n    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');\n  } return it;\n};\n\n\n/***/ }),\n/* 88 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar wellKnownSymbol = __webpack_require__(1);\nvar Iterators = __webpack_require__(14);\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar ArrayPrototype = Array.prototype;\n\n// check on default Array iterator\nmodule.exports = function (it) {\n  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);\n};\n\n\n/***/ }),\n/* 89 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar classof = __webpack_require__(38);\nvar Iterators = __webpack_require__(14);\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar ITERATOR = wellKnownSymbol('iterator');\n\nmodule.exports = function (it) {\n  if (it != undefined) return it[ITERATOR]\n    || it['@@iterator']\n    || Iterators[classof(it)];\n};\n\n\n/***/ }),\n/* 90 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar anObject = __webpack_require__(2);\n\n// call something on iterator step with safe closing on error\nmodule.exports = function (iterator, fn, value, ENTRIES) {\n  try {\n    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);\n  // 7.4.6 IteratorClose(iterator, completion)\n  } catch (error) {\n    var returnMethod = iterator['return'];\n    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));\n    throw error;\n  }\n};\n\n\n/***/ }),\n/* 91 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar wellKnownSymbol = __webpack_require__(1);\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar SAFE_CLOSING = false;\n\ntry {\n  var called = 0;\n  var iteratorWithReturn = {\n    next: function () {\n      return { done: !!called++ };\n    },\n    'return': function () {\n      SAFE_CLOSING = true;\n    }\n  };\n  iteratorWithReturn[ITERATOR] = function () {\n    return this;\n  };\n  // eslint-disable-next-line no-throw-literal\n  Array.from(iteratorWithReturn, function () { throw 2; });\n} catch (error) { /* empty */ }\n\nmodule.exports = function (exec, SKIP_CLOSING) {\n  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;\n  var ITERATION_SUPPORT = false;\n  try {\n    var object = {};\n    object[ITERATOR] = function () {\n      return {\n        next: function () {\n          return { done: ITERATION_SUPPORT = true };\n        }\n      };\n    };\n    exec(object);\n  } catch (error) { /* empty */ }\n  return ITERATION_SUPPORT;\n};\n\n\n/***/ }),\n/* 92 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar getOwnPropertyDescriptor = __webpack_require__(28).f;\nvar classof = __webpack_require__(13);\nvar macrotask = __webpack_require__(52).set;\nvar IS_IOS = __webpack_require__(53);\n\nvar MutationObserver = global.MutationObserver || global.WebKitMutationObserver;\nvar process = global.process;\nvar Promise = global.Promise;\nvar IS_NODE = classof(process) == 'process';\n// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`\nvar queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');\nvar queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;\n\nvar flush, head, last, notify, toggle, node, promise, then;\n\n// modern engines have queueMicrotask method\nif (!queueMicrotask) {\n  flush = function () {\n    var parent, fn;\n    if (IS_NODE && (parent = process.domain)) parent.exit();\n    while (head) {\n      fn = head.fn;\n      head = head.next;\n      try {\n        fn();\n      } catch (error) {\n        if (head) notify();\n        else last = undefined;\n        throw error;\n      }\n    } last = undefined;\n    if (parent) parent.enter();\n  };\n\n  // Node.js\n  if (IS_NODE) {\n    notify = function () {\n      process.nextTick(flush);\n    };\n  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339\n  } else if (MutationObserver && !IS_IOS) {\n    toggle = true;\n    node = document.createTextNode('');\n    new MutationObserver(flush).observe(node, { characterData: true });\n    notify = function () {\n      node.data = toggle = !toggle;\n    };\n  // environments with maybe non-completely correct, but existent Promise\n  } else if (Promise && Promise.resolve) {\n    // Promise.resolve without an argument throws an error in LG WebOS 2\n    promise = Promise.resolve(undefined);\n    then = promise.then;\n    notify = function () {\n      then.call(promise, flush);\n    };\n  // for other environments - macrotask based on:\n  // - setImmediate\n  // - MessageChannel\n  // - window.postMessag\n  // - onreadystatechange\n  // - setTimeout\n  } else {\n    notify = function () {\n      // strange IE + webpack dev server bug - use .call(global)\n      macrotask.call(global, flush);\n    };\n  }\n}\n\nmodule.exports = queueMicrotask || function (fn) {\n  var task = { fn: fn, next: undefined };\n  if (last) last.next = task;\n  if (!head) {\n    head = task;\n    notify();\n  } last = task;\n};\n\n\n/***/ }),\n/* 93 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\n\nmodule.exports = function (a, b) {\n  var console = global.console;\n  if (console && console.error) {\n    arguments.length === 1 ? console.error(a) : console.error(a, b);\n  }\n};\n\n\n/***/ }),\n/* 94 */\n/***/ (function(module, exports, __webpack_require__) {\n\nvar global = __webpack_require__(0);\nvar userAgent = __webpack_require__(54);\n\nvar process = global.process;\nvar versions = process && process.versions;\nvar v8 = versions && versions.v8;\nvar match, version;\n\nif (v8) {\n  match = v8.split('.');\n  version = match[0] + match[1];\n} else if (userAgent) {\n  match = userAgent.match(/Edge\\/(\\d+)/);\n  if (!match || match[1] >= 74) {\n    match = userAgent.match(/Chrome\\/(\\d+)/);\n    if (match) version = match[1];\n  }\n}\n\nmodule.exports = version && +version;\n\n\n/***/ }),\n/* 95 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar $ = __webpack_require__(17);\nvar aFunction = __webpack_require__(15);\nvar newPromiseCapabilityModule = __webpack_require__(31);\nvar perform = __webpack_require__(56);\nvar iterate = __webpack_require__(49);\n\n// `Promise.allSettled` method\n// https://github.com/tc39/proposal-promise-allSettled\n$({ target: 'Promise', stat: true }, {\n  allSettled: function allSettled(iterable) {\n    var C = this;\n    var capability = newPromiseCapabilityModule.f(C);\n    var resolve = capability.resolve;\n    var reject = capability.reject;\n    var result = perform(function () {\n      var promiseResolve = aFunction(C.resolve);\n      var values = [];\n      var counter = 0;\n      var remaining = 1;\n      iterate(iterable, function (promise) {\n        var index = counter++;\n        var alreadyCalled = false;\n        values.push(undefined);\n        remaining++;\n        promiseResolve.call(C, promise).then(function (value) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[index] = { status: 'fulfilled', value: value };\n          --remaining || resolve(values);\n        }, function (e) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[index] = { status: 'rejected', reason: e };\n          --remaining || resolve(values);\n        });\n      });\n      --remaining || resolve(values);\n    });\n    if (result.error) reject(result.value);\n    return capability.promise;\n  }\n});\n\n\n/***/ }),\n/* 96 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\nvar $ = __webpack_require__(17);\nvar IS_PURE = __webpack_require__(12);\nvar NativePromise = __webpack_require__(48);\nvar fails = __webpack_require__(5);\nvar getBuiltIn = __webpack_require__(11);\nvar speciesConstructor = __webpack_require__(51);\nvar promiseResolve = __webpack_require__(55);\nvar redefine = __webpack_require__(10);\n\n// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829\nvar NON_GENERIC = !!NativePromise && fails(function () {\n  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });\n});\n\n// `Promise.prototype.finally` method\n// https://tc39.github.io/ecma262/#sec-promise.prototype.finally\n$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {\n  'finally': function (onFinally) {\n    var C = speciesConstructor(this, getBuiltIn('Promise'));\n    var isFunction = typeof onFinally == 'function';\n    return this.then(\n      isFunction ? function (x) {\n        return promiseResolve(C, onFinally()).then(function () { return x; });\n      } : onFinally,\n      isFunction ? function (e) {\n        return promiseResolve(C, onFinally()).then(function () { throw e; });\n      } : onFinally\n    );\n  }\n});\n\n// patch native Promise.prototype for native async functions\nif (!IS_PURE && typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {\n  redefine(NativePromise.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);\n}\n\n\n/***/ }),\n/* 97 */\n/***/ (function(module, __webpack_exports__, __webpack_require__) {\n\n\"use strict\";\n// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// EXPORTS\n__webpack_require__.d(__webpack_exports__, \"add\", function() { return /* binding */ add; });\n__webpack_require__.d(__webpack_exports__, \"done\", function() { return /* binding */ done; });\n__webpack_require__.d(__webpack_exports__, \"toJS\", function() { return /* binding */ toJS; });\n__webpack_require__.d(__webpack_exports__, \"load\", function() { return /* binding */ load; });\n__webpack_require__.d(__webpack_exports__, \"search\", function() { return /* binding */ search; });\n\n// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js\n/*! *****************************************************************************\r\nCopyright (c) Microsoft Corporation. All rights reserved.\r\nLicensed under the Apache License, Version 2.0 (the \"License\"); you may not use\r\nthis file except in compliance with the License. You may obtain a copy of the\r\nLicense at http://www.apache.org/licenses/LICENSE-2.0\r\n\r\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\r\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\r\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\r\nMERCHANTABLITY OR NON-INFRINGEMENT.\r\n\r\nSee the Apache Version 2.0 License for specific language governing permissions\r\nand limitations under the License.\r\n***************************************************************************** */\r\n/* global Reflect, Promise */\r\n\r\nvar extendStatics = function(d, b) {\r\n    extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return extendStatics(d, b);\r\n};\r\n\r\nfunction __extends(d, b) {\r\n    extendStatics(d, b);\r\n    function __() { this.constructor = d; }\r\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n}\r\n\r\nvar __assign = function() {\r\n    __assign = Object.assign || function __assign(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\r\n        }\r\n        return t;\r\n    }\r\n    return __assign.apply(this, arguments);\r\n}\r\n\r\nfunction __rest(s, e) {\r\n    var t = {};\r\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\r\n        t[p] = s[p];\r\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\r\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {\r\n            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))\r\n                t[p[i]] = s[p[i]];\r\n        }\r\n    return t;\r\n}\r\n\r\nfunction __decorate(decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n}\r\n\r\nfunction __param(paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n}\r\n\r\nfunction __metadata(metadataKey, metadataValue) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(metadataKey, metadataValue);\r\n}\r\n\r\nfunction __awaiter(thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n}\r\n\r\nfunction __generator(thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n}\r\n\r\nfunction __exportStar(m, exports) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\n\r\nfunction __values(o) {\r\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === \"number\") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\r\n}\r\n\r\nfunction __read(o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n}\r\n\r\nfunction __spread() {\r\n    for (var ar = [], i = 0; i < arguments.length; i++)\r\n        ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n}\r\n\r\nfunction __spreadArrays() {\r\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\r\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\r\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\r\n            r[k] = a[j];\r\n    return r;\r\n};\r\n\r\nfunction __await(v) {\r\n    return this instanceof __await ? (this.v = v, this) : new __await(v);\r\n}\r\n\r\nfunction __asyncGenerator(thisArg, _arguments, generator) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var g = generator.apply(thisArg, _arguments || []), i, q = [];\r\n    return i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i;\r\n    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }\r\n    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }\r\n    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }\r\n    function fulfill(value) { resume(\"next\", value); }\r\n    function reject(value) { resume(\"throw\", value); }\r\n    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }\r\n}\r\n\r\nfunction __asyncDelegator(o) {\r\n    var i, p;\r\n    return i = {}, verb(\"next\"), verb(\"throw\", function (e) { throw e; }), verb(\"return\"), i[Symbol.iterator] = function () { return this; }, i;\r\n    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === \"return\" } : f ? f(v) : v; } : f; }\r\n}\r\n\r\nfunction __asyncValues(o) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var m = o[Symbol.asyncIterator], i;\r\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\r\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\r\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\r\n}\r\n\r\nfunction __makeTemplateObject(cooked, raw) {\r\n    if (Object.defineProperty) { Object.defineProperty(cooked, \"raw\", { value: raw }); } else { cooked.raw = raw; }\r\n    return cooked;\r\n};\r\n\r\nfunction __importStar(mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result.default = mod;\r\n    return result;\r\n}\r\n\r\nfunction __importDefault(mod) {\r\n    return (mod && mod.__esModule) ? mod : { default: mod };\r\n}\r\n\r\nfunction __classPrivateFieldGet(receiver, privateMap) {\r\n    if (!privateMap.has(receiver)) {\r\n        throw new TypeError(\"attempted to get private field on non-instance\");\r\n    }\r\n    return privateMap.get(receiver);\r\n}\r\n\r\nfunction __classPrivateFieldSet(receiver, privateMap, value) {\r\n    if (!privateMap.has(receiver)) {\r\n        throw new TypeError(\"attempted to set private field on non-instance\");\r\n    }\r\n    privateMap.set(receiver, value);\r\n    return value;\r\n}\r\n\n// EXTERNAL MODULE: ./node_modules/lunr/lunr.js\nvar lunr = __webpack_require__(4);\n\n// CONCATENATED MODULE: ./node_modules/workerize-loader/dist/rpc-worker-loader.js!./node_modules/ts-loader??ref--4-0!./node_modules/babel-loader/lib??ref--4-1!./src/services/SearchWorker.worker.ts\n\n\ntry {\n    // tslint:disable-next-line\n    __webpack_require__(57); // bundle into worker\n}\ncatch (_) { } // nope\n/* just for better typings */\nvar Worker = /** @class */ (function () {\n    function Worker() {\n        this.add = add;\n        this.done = done;\n        this.search = search;\n        this.toJS = toJS;\n        this.load = load;\n    }\n    return Worker;\n}());\n/* harmony default export */ var SearchWorker_worker = __webpack_exports__[\"default\"] = (Worker);\nvar store = [];\nvar resolveIndex = function () {\n    throw new Error('Should not be called');\n};\nvar index = new Promise(function (resolve) {\n    resolveIndex = resolve;\n});\nlunr[\"tokenizer\"].separator = /\\s+/;\nvar builder = new lunr[\"Builder\"]();\nbuilder.field('title');\nbuilder.field('description');\nbuilder.ref('ref');\nbuilder.pipeline.add(lunr[\"trimmer\"], lunr[\"stopWordFilter\"], lunr[\"stemmer\"]);\nvar expandTerm = function (term) { return '*' + lunr[\"stemmer\"](new lunr[\"Token\"](term, {})) + '*'; };\nfunction add(title, description, meta) {\n    var ref = store.push(meta) - 1;\n    var item = {\n        title: title.toLowerCase(),\n        description: description.toLowerCase(),\n        ref: ref\n    };\n    builder.add(item);\n}\nfunction done() {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            resolveIndex(builder.build());\n            return [2 /*return*/];\n        });\n    });\n}\nfunction toJS() {\n    return __awaiter(this, void 0, void 0, function () {\n        var _a;\n        return __generator(this, function (_b) {\n            switch (_b.label) {\n                case 0:\n                    _a = {\n                        store: store\n                    };\n                    return [4 /*yield*/, index];\n                case 1: return [2 /*return*/, (_a.index = (_b.sent()).toJSON(),\n                        _a)];\n            }\n        });\n    });\n}\nfunction load(state) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            store = state.store;\n            resolveIndex(lunr[\"Index\"].load(state.index));\n            return [2 /*return*/];\n        });\n    });\n}\nfunction search(q, limit) {\n    if (limit === void 0) { limit = 0; }\n    return __awaiter(this, void 0, void 0, function () {\n        var searchResults;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    if (q.trim().length === 0) {\n                        return [2 /*return*/, []];\n                    }\n                    return [4 /*yield*/, index];\n                case 1:\n                    searchResults = (_a.sent()).query(function (t) {\n                        q.trim().toLowerCase().split(/\\s+/).forEach(function (term) {\n                            var exp = expandTerm(term);\n                            t.term(exp, {});\n                        });\n                    });\n                    if (limit > 0) {\n                        searchResults = searchResults.slice(0, limit);\n                    }\n                    return [2 /*return*/, searchResults.map(function (res) { return ({\n                            meta: store[res.ref],\n                            score: res.score\n                        }); })];\n            }\n        });\n    });\n}\n\naddEventListener('message', function (e) {var ref = e.data;var type = ref.type;var method = ref.method;var id = ref.id;var params = ref.params;var f,p;if (type === 'RPC' && method) {if (f = __webpack_exports__[method]) {p = Promise.resolve().then(function () { return f.apply(__webpack_exports__, params); });} else {p = Promise.reject('No such method');}p.then(function (result) {postMessage({type: 'RPC',id: id,result: result});}).catch(function (e) {var error = {message: e};if (e.stack) {error.message = e.message;error.stack = e.stack;error.name = e.name;}postMessage({type: 'RPC',id: id,error: error});});}});postMessage({type: 'RPC',method: 'ready'});\n\n/***/ })\n/******/ ]);\n//# sourceMappingURL=fea68db94dba05b54c01.worker.js.map"])), { name: "[hash].worker.js" })
					addMethods(w, methods)
					
					return w
				}
			

/***/ }),
/* 78 */
/***/ (function(module, exports) {

function addMethods(worker, methods) {
  var c = 0;
  var callbacks = {};
  worker.addEventListener('message', function (e) {
    var d = e.data;
    if (d.type !== 'RPC') { return; }

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
    worker[method] = function () {
      var params = [], len = arguments.length;
      while ( len-- ) params[ len ] = arguments[ len ];

      return new Promise(function (a, b) {
      var id = ++c;
      callbacks[id] = [a, b];
      worker.postMessage({
        type: 'RPC',
        id: id,
        method: method,
        params: params
      });
    });
    };
  });
}

module.exports = addMethods;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = require("core-js/es/promise");

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = require("stickyfill");

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "RedocStandalone", function() { return /* reexport */ RedocStandalone_RedocStandalone; });
__webpack_require__.d(__webpack_exports__, "Redoc", function() { return /* reexport */ Redoc_Redoc; });
__webpack_require__.d(__webpack_exports__, "ApiInfo", function() { return /* reexport */ ApiInfo_ApiInfo; });
__webpack_require__.d(__webpack_exports__, "ApiLogo", function() { return /* reexport */ ApiLogo_ApiLogo; });
__webpack_require__.d(__webpack_exports__, "ContentItems", function() { return /* reexport */ ContentItems_ContentItems; });
__webpack_require__.d(__webpack_exports__, "ContentItem", function() { return /* reexport */ ContentItems_ContentItem; });
__webpack_require__.d(__webpack_exports__, "SectionItem", function() { return /* reexport */ ContentItems_SectionItem; });
__webpack_require__.d(__webpack_exports__, "OperationItem", function() { return /* reexport */ ContentItems_OperationItem; });
__webpack_require__.d(__webpack_exports__, "ApiContentWrap", function() { return /* reexport */ ApiContentWrap; });
__webpack_require__.d(__webpack_exports__, "BackgroundStub", function() { return /* reexport */ BackgroundStub; });
__webpack_require__.d(__webpack_exports__, "RedocWrap", function() { return /* reexport */ RedocWrap; });
__webpack_require__.d(__webpack_exports__, "Schema", function() { return /* reexport */ Schema_Schema; });
__webpack_require__.d(__webpack_exports__, "ObjectSchema", function() { return /* reexport */ ObjectSchema_ObjectSchema; });
__webpack_require__.d(__webpack_exports__, "OneOfButton", function() { return /* reexport */ OneOfSchema_OneOfButton; });
__webpack_require__.d(__webpack_exports__, "OneOfSchema", function() { return /* reexport */ OneOfSchema_OneOfSchema; });
__webpack_require__.d(__webpack_exports__, "ArraySchema", function() { return /* reexport */ ArraySchema_ArraySchema; });
__webpack_require__.d(__webpack_exports__, "DiscriminatorDropdown", function() { return /* reexport */ DiscriminatorDropdown_DiscriminatorDropdown; });
__webpack_require__.d(__webpack_exports__, "SearchBox", function() { return /* reexport */ SearchBox_SearchBox; });
__webpack_require__.d(__webpack_exports__, "Operation", function() { return /* reexport */ Operation_Operation; });
__webpack_require__.d(__webpack_exports__, "Loading", function() { return /* reexport */ Loading_Loading; });
__webpack_require__.d(__webpack_exports__, "JsonViewer", function() { return /* reexport */ JsonViewer; });
__webpack_require__.d(__webpack_exports__, "Markdown", function() { return /* reexport */ Markdown_Markdown; });
__webpack_require__.d(__webpack_exports__, "StyledMarkdownBlock", function() { return /* reexport */ StyledMarkdownBlock; });
__webpack_require__.d(__webpack_exports__, "OAuthFlow", function() { return /* reexport */ SecuritySchemes_OAuthFlow; });
__webpack_require__.d(__webpack_exports__, "SecurityDefs", function() { return /* reexport */ SecuritySchemes_SecurityDefs; });
__webpack_require__.d(__webpack_exports__, "ResponseView", function() { return /* reexport */ Response_ResponseView; });
__webpack_require__.d(__webpack_exports__, "ResponseDetails", function() { return /* reexport */ ResponseDetails_ResponseDetails; });
__webpack_require__.d(__webpack_exports__, "ResponseHeaders", function() { return /* reexport */ ResponseHeaders_ResponseHeaders; });
__webpack_require__.d(__webpack_exports__, "ResponsesList", function() { return /* reexport */ ResponsesList_ResponsesList; });
__webpack_require__.d(__webpack_exports__, "ResponseTitle", function() { return /* reexport */ ResponseTitle_ResponseTitle; });
__webpack_require__.d(__webpack_exports__, "ResponseSamples", function() { return /* reexport */ ResponseSamples_ResponseSamples; });
__webpack_require__.d(__webpack_exports__, "PayloadSamples", function() { return /* reexport */ PayloadSamples_PayloadSamples; });
__webpack_require__.d(__webpack_exports__, "MediaTypesSwitch", function() { return /* reexport */ MediaTypesSwitch_MediaTypesSwitch; });
__webpack_require__.d(__webpack_exports__, "ErrorBoundary", function() { return /* reexport */ ErrorBoundary_ErrorBoundary; });
__webpack_require__.d(__webpack_exports__, "StoreProvider", function() { return /* reexport */ Provider; });
__webpack_require__.d(__webpack_exports__, "StoreConsumer", function() { return /* reexport */ Consumer; });
__webpack_require__.d(__webpack_exports__, "StoreBuilder", function() { return /* reexport */ StoreBuilder_StoreBuilder; });
__webpack_require__.d(__webpack_exports__, "OptionsContext", function() { return /* reexport */ OptionsContext; });
__webpack_require__.d(__webpack_exports__, "OptionsProvider", function() { return /* reexport */ OptionsProvider; });
__webpack_require__.d(__webpack_exports__, "OptionsConsumer", function() { return /* reexport */ OptionsConsumer; });
__webpack_require__.d(__webpack_exports__, "MenuItem", function() { return /* reexport */ MenuItem_MenuItem; });
__webpack_require__.d(__webpack_exports__, "OperationMenuItemContent", function() { return /* reexport */ MenuItem_OperationMenuItemContent; });
__webpack_require__.d(__webpack_exports__, "MenuItems", function() { return /* reexport */ MenuItems_MenuItems; });
__webpack_require__.d(__webpack_exports__, "SideMenu", function() { return /* reexport */ SideMenu_SideMenu; });
__webpack_require__.d(__webpack_exports__, "OperationBadge", function() { return /* reexport */ OperationBadge; });
__webpack_require__.d(__webpack_exports__, "MenuItemUl", function() { return /* reexport */ MenuItemUl; });
__webpack_require__.d(__webpack_exports__, "MenuItemLi", function() { return /* reexport */ MenuItemLi; });
__webpack_require__.d(__webpack_exports__, "menuItemDepth", function() { return /* reexport */ menuItemDepth; });
__webpack_require__.d(__webpack_exports__, "MenuItemLabel", function() { return /* reexport */ MenuItemLabel; });
__webpack_require__.d(__webpack_exports__, "MenuItemTitle", function() { return /* reexport */ MenuItemTitle; });
__webpack_require__.d(__webpack_exports__, "RedocAttribution", function() { return /* reexport */ RedocAttribution; });
__webpack_require__.d(__webpack_exports__, "StickyResponsiveSidebar", function() { return /* reexport */ StickyResponsiveSidebar_StickyResponsiveSidebar; });
__webpack_require__.d(__webpack_exports__, "SchemaDefinition", function() { return /* reexport */ SchemaDefinition_SchemaDefinition; });
__webpack_require__.d(__webpack_exports__, "SourceCode", function() { return /* reexport */ SourceCode_SourceCode; });
__webpack_require__.d(__webpack_exports__, "SourceCodeWithCopy", function() { return /* reexport */ SourceCode_SourceCodeWithCopy; });
__webpack_require__.d(__webpack_exports__, "MiddlePanel", function() { return /* reexport */ MiddlePanel; });
__webpack_require__.d(__webpack_exports__, "Row", function() { return /* reexport */ Row; });
__webpack_require__.d(__webpack_exports__, "RightPanel", function() { return /* reexport */ RightPanel; });
__webpack_require__.d(__webpack_exports__, "Section", function() { return /* reexport */ Section; });
__webpack_require__.d(__webpack_exports__, "createStore", function() { return /* reexport */ createStore; });
__webpack_require__.d(__webpack_exports__, "AppStore", function() { return /* reexport */ AppStore_AppStore; });
__webpack_require__.d(__webpack_exports__, "OpenAPIParser", function() { return /* reexport */ OpenAPIParser_OpenAPIParser; });
__webpack_require__.d(__webpack_exports__, "LEGACY_REGEXP", function() { return /* reexport */ LEGACY_REGEXP; });
__webpack_require__.d(__webpack_exports__, "MDX_COMPONENT_REGEXP", function() { return /* reexport */ MDX_COMPONENT_REGEXP; });
__webpack_require__.d(__webpack_exports__, "COMPONENT_REGEXP", function() { return /* reexport */ COMPONENT_REGEXP; });
__webpack_require__.d(__webpack_exports__, "buildComponentComment", function() { return /* reexport */ buildComponentComment; });
__webpack_require__.d(__webpack_exports__, "MarkdownRenderer", function() { return /* reexport */ MarkdownRenderer_MarkdownRenderer; });
__webpack_require__.d(__webpack_exports__, "SECTION_ATTR", function() { return /* reexport */ SECTION_ATTR; });
__webpack_require__.d(__webpack_exports__, "MenuStore", function() { return /* reexport */ MenuStore_MenuStore; });
__webpack_require__.d(__webpack_exports__, "ScrollService", function() { return /* reexport */ ScrollService_ScrollService; });
__webpack_require__.d(__webpack_exports__, "SpecStore", function() { return /* reexport */ SpecStore_SpecStore; });
__webpack_require__.d(__webpack_exports__, "ClipboardService", function() { return /* reexport */ ClipboardService; });
__webpack_require__.d(__webpack_exports__, "HistoryService", function() { return /* reexport */ HistoryService_HistoryService; });
__webpack_require__.d(__webpack_exports__, "history", function() { return /* reexport */ HistoryService_history; });
__webpack_require__.d(__webpack_exports__, "GroupModel", function() { return /* reexport */ Group_model_GroupModel; });
__webpack_require__.d(__webpack_exports__, "isPayloadSample", function() { return /* reexport */ isPayloadSample; });
__webpack_require__.d(__webpack_exports__, "OperationModel", function() { return /* reexport */ Operation_OperationModel; });
__webpack_require__.d(__webpack_exports__, "RequestBodyModel", function() { return /* reexport */ RequestBody_RequestBodyModel; });
__webpack_require__.d(__webpack_exports__, "ExampleModel", function() { return /* reexport */ Example_ExampleModel; });
__webpack_require__.d(__webpack_exports__, "MediaContentModel", function() { return /* reexport */ MediaContent_MediaContentModel; });
__webpack_require__.d(__webpack_exports__, "MediaTypeModel", function() { return /* reexport */ MediaType_MediaTypeModel; });
__webpack_require__.d(__webpack_exports__, "ResponseModel", function() { return /* reexport */ Response_ResponseModel; });
__webpack_require__.d(__webpack_exports__, "SchemaModel", function() { return /* reexport */ Schema_SchemaModel; });
__webpack_require__.d(__webpack_exports__, "FieldModel", function() { return /* reexport */ Field_FieldModel; });
__webpack_require__.d(__webpack_exports__, "ApiInfoModel", function() { return /* reexport */ ApiInfo_ApiInfoModel; });
__webpack_require__.d(__webpack_exports__, "SecuritySchemeModel", function() { return /* reexport */ SecuritySchemes_SecuritySchemeModel; });
__webpack_require__.d(__webpack_exports__, "SecuritySchemesModel", function() { return /* reexport */ SecuritySchemesModel; });
__webpack_require__.d(__webpack_exports__, "RedocNormalizedOptions", function() { return /* reexport */ RedocNormalizedOptions_RedocNormalizedOptions; });
__webpack_require__.d(__webpack_exports__, "GROUP_DEPTH", function() { return /* reexport */ GROUP_DEPTH; });
__webpack_require__.d(__webpack_exports__, "MenuBuilder", function() { return /* reexport */ MenuBuilder_MenuBuilder; });
__webpack_require__.d(__webpack_exports__, "SearchStore", function() { return /* reexport */ SearchStore_SearchStore; });
__webpack_require__.d(__webpack_exports__, "MarkerService", function() { return /* reexport */ MarkerService_MarkerService; });
__webpack_require__.d(__webpack_exports__, "JsonPointer", function() { return /* reexport */ JsonPointer_JsonPointer; });
__webpack_require__.d(__webpack_exports__, "isStatusCode", function() { return /* reexport */ isStatusCode; });
__webpack_require__.d(__webpack_exports__, "getStatusCodeType", function() { return /* reexport */ getStatusCodeType; });
__webpack_require__.d(__webpack_exports__, "isOperationName", function() { return /* reexport */ isOperationName; });
__webpack_require__.d(__webpack_exports__, "getOperationSummary", function() { return /* reexport */ getOperationSummary; });
__webpack_require__.d(__webpack_exports__, "detectType", function() { return /* reexport */ detectType; });
__webpack_require__.d(__webpack_exports__, "isPrimitiveType", function() { return /* reexport */ isPrimitiveType; });
__webpack_require__.d(__webpack_exports__, "isJsonLike", function() { return /* reexport */ isJsonLike; });
__webpack_require__.d(__webpack_exports__, "isFormUrlEncoded", function() { return /* reexport */ isFormUrlEncoded; });
__webpack_require__.d(__webpack_exports__, "urlFormEncodePayload", function() { return /* reexport */ urlFormEncodePayload; });
__webpack_require__.d(__webpack_exports__, "serializeParameterValueWithMime", function() { return /* reexport */ serializeParameterValueWithMime; });
__webpack_require__.d(__webpack_exports__, "serializeParameterValue", function() { return /* reexport */ serializeParameterValue; });
__webpack_require__.d(__webpack_exports__, "langFromMime", function() { return /* reexport */ langFromMime; });
__webpack_require__.d(__webpack_exports__, "isNamedDefinition", function() { return /* reexport */ isNamedDefinition; });
__webpack_require__.d(__webpack_exports__, "humanizeConstraints", function() { return /* reexport */ humanizeConstraints; });
__webpack_require__.d(__webpack_exports__, "sortByRequired", function() { return /* reexport */ sortByRequired; });
__webpack_require__.d(__webpack_exports__, "sortByField", function() { return /* reexport */ sortByField; });
__webpack_require__.d(__webpack_exports__, "mergeParams", function() { return /* reexport */ mergeParams; });
__webpack_require__.d(__webpack_exports__, "mergeSimilarMediaTypes", function() { return /* reexport */ mergeSimilarMediaTypes; });
__webpack_require__.d(__webpack_exports__, "expandDefaultServerVariables", function() { return /* reexport */ expandDefaultServerVariables; });
__webpack_require__.d(__webpack_exports__, "normalizeServers", function() { return /* reexport */ normalizeServers; });
__webpack_require__.d(__webpack_exports__, "SECURITY_DEFINITIONS_COMPONENT_NAME", function() { return /* reexport */ SECURITY_DEFINITIONS_COMPONENT_NAME; });
__webpack_require__.d(__webpack_exports__, "SECURITY_DEFINITIONS_JSX_NAME", function() { return /* reexport */ SECURITY_DEFINITIONS_JSX_NAME; });
__webpack_require__.d(__webpack_exports__, "SCHEMA_DEFINITION_JSX_NAME", function() { return /* reexport */ SCHEMA_DEFINITION_JSX_NAME; });
__webpack_require__.d(__webpack_exports__, "SECURITY_SCHEMES_SECTION_PREFIX", function() { return /* reexport */ SECURITY_SCHEMES_SECTION_PREFIX; });
__webpack_require__.d(__webpack_exports__, "setSecuritySchemePrefix", function() { return /* reexport */ setSecuritySchemePrefix; });
__webpack_require__.d(__webpack_exports__, "shortenHTTPVerb", function() { return /* reexport */ shortenHTTPVerb; });
__webpack_require__.d(__webpack_exports__, "isRedocExtension", function() { return /* reexport */ isRedocExtension; });
__webpack_require__.d(__webpack_exports__, "extractExtensions", function() { return /* reexport */ extractExtensions; });
__webpack_require__.d(__webpack_exports__, "pluralizeType", function() { return /* reexport */ pluralizeType; });
__webpack_require__.d(__webpack_exports__, "mapWithLast", function() { return /* reexport */ mapWithLast; });
__webpack_require__.d(__webpack_exports__, "mapValues", function() { return /* reexport */ mapValues; });
__webpack_require__.d(__webpack_exports__, "flattenByProp", function() { return /* reexport */ flattenByProp; });
__webpack_require__.d(__webpack_exports__, "stripTrailingSlash", function() { return /* reexport */ stripTrailingSlash; });
__webpack_require__.d(__webpack_exports__, "isNumeric", function() { return /* reexport */ isNumeric; });
__webpack_require__.d(__webpack_exports__, "appendToMdHeading", function() { return /* reexport */ appendToMdHeading; });
__webpack_require__.d(__webpack_exports__, "mergeObjects", function() { return /* reexport */ mergeObjects; });
__webpack_require__.d(__webpack_exports__, "safeSlugify", function() { return /* reexport */ safeSlugify; });
__webpack_require__.d(__webpack_exports__, "isAbsoluteUrl", function() { return /* reexport */ isAbsoluteUrl; });
__webpack_require__.d(__webpack_exports__, "resolveUrl", function() { return /* reexport */ resolveUrl; });
__webpack_require__.d(__webpack_exports__, "getBasePath", function() { return /* reexport */ getBasePath; });
__webpack_require__.d(__webpack_exports__, "titleize", function() { return /* reexport */ titleize; });
__webpack_require__.d(__webpack_exports__, "removeQueryString", function() { return /* reexport */ removeQueryString; });
__webpack_require__.d(__webpack_exports__, "unescapeHTMLChars", function() { return /* reexport */ unescapeHTMLChars; });
__webpack_require__.d(__webpack_exports__, "mapLang", function() { return /* reexport */ mapLang; });
__webpack_require__.d(__webpack_exports__, "highlight", function() { return /* reexport */ highlight; });
__webpack_require__.d(__webpack_exports__, "loadAndBundleSpec", function() { return /* reexport */ loadAndBundleSpec; });
__webpack_require__.d(__webpack_exports__, "convertSwagger2OpenAPI", function() { return /* reexport */ convertSwagger2OpenAPI; });
__webpack_require__.d(__webpack_exports__, "IS_BROWSER", function() { return /* reexport */ IS_BROWSER; });
__webpack_require__.d(__webpack_exports__, "querySelector", function() { return /* reexport */ querySelector; });
__webpack_require__.d(__webpack_exports__, "html2Str", function() { return /* reexport */ html2Str; });
__webpack_require__.d(__webpack_exports__, "Throttle", function() { return /* reexport */ Throttle; });
__webpack_require__.d(__webpack_exports__, "debugTime", function() { return /* reexport */ debugTime; });
__webpack_require__.d(__webpack_exports__, "debugTimeEnd", function() { return /* reexport */ debugTimeEnd; });
__webpack_require__.d(__webpack_exports__, "memoize", function() { return /* reexport */ memoize; });
__webpack_require__.d(__webpack_exports__, "media", function() { return /* reexport */ media; });
__webpack_require__.d(__webpack_exports__, "css", function() { return /* reexport */ css; });
__webpack_require__.d(__webpack_exports__, "createGlobalStyle", function() { return /* reexport */ createGlobalStyle; });
__webpack_require__.d(__webpack_exports__, "keyframes", function() { return /* reexport */ keyframes; });
__webpack_require__.d(__webpack_exports__, "ThemeProvider", function() { return /* reexport */ ThemeProvider; });
__webpack_require__.d(__webpack_exports__, "extensionsHook", function() { return /* reexport */ extensionsHook; });
__webpack_require__.d(__webpack_exports__, "styled", function() { return /* reexport */ styled_components; });

// EXTERNAL MODULE: external "tslib"
var external_tslib_ = __webpack_require__(1);

// EXTERNAL MODULE: external "prop-types"
var external_prop_types_ = __webpack_require__(14);

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);

// EXTERNAL MODULE: external "polished"
var external_polished_ = __webpack_require__(2);

// CONCATENATED MODULE: ./src/theme.ts

var defaultTheme = {
    spacing: {
        unit: 5,
        sectionHorizontal: function (_a) {
            var spacing = _a.spacing;
            return spacing.unit * 8;
        },
        sectionVertical: function (_a) {
            var spacing = _a.spacing;
            return spacing.unit * 8;
        }
    },
    breakpoints: {
        small: '50rem',
        medium: '85rem',
        large: '105rem'
    },
    colors: {
        tonalOffset: 0.3,
        primary: {
            main: '#232E72',
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
            main: '#00aa13',
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
            main: '#d4ad03',
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
            main: '#e53935',
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
            get: '#078db3',
            post: '#006353',
            put: '#eeb111',
            options: '#7e929f',
            patch: '#8cc53e',
            delete: '#f05822',
            basic: '#999',
            link: '#31bbb6',
            head: '#725ea6'
        }
    },
    schema: {
        linesColor: function (theme) { return Object(external_polished_["lighten"])(theme.colors.tonalOffset, Object(external_polished_["desaturate"])(theme.colors.tonalOffset, theme.colors.primary.main)); },
        defaultDetailsWidth: '75%',
        typeNameColor: function (theme) { return theme.colors.text.secondary; },
        typeTitleColor: function (theme) { return theme.schema.typeNameColor; },
        requireLabelColor: function (theme) { return theme.colors.error.main; },
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
        fontFamily: resolveFontFamily(),
        smoothing: 'antialiased',
        optimizeSpeed: true,
        headings: {
            fontFamily: resolveFontFamily(),
            fontWeight: '400',
            lineHeight: '1.6em'
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
        backgroundColor: '#F3F6FB',
        textColor: '#232E72',
        activeTextColor: function (theme) { return theme.menu.textColor !== defaultTheme.menu.textColor ? theme.menu.textColor : theme.colors.primary.main; },
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
        },
        gutter: '2px'
    },
    rightPanel: {
        backgroundColor: '#3C3C3C',
        width: '40%',
        textColor: '#ffffff'
    },
    codeSample: {
        backgroundColor: function (_a) {
            var rightPanel = _a.rightPanel;
            return Object(external_polished_["darken"])(0.1, rightPanel.backgroundColor);
        }
    }
};
function resolveFontFamily() {
    return '' + '"OTSans", ' + '-apple-system, ' + 'system-ui, ' + 'BlinkMacSystemFont, ' + '"Segoe UI", Roboto, ' + '"Helvetica Neue", ' + 'Arial, ' + 'sans-serif';
}
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
                                throw new Error("Theme probably contains circular dependency at " + currentPath + ": " + val.toString());
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
var external_slugify_ = __webpack_require__(35);
var external_slugify_default = /*#__PURE__*/__webpack_require__.n(external_slugify_);

// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(5);

// CONCATENATED MODULE: ./src/utils/helpers.ts



/**
 * Maps over array passing `isLast` bool to iterator as the second argument
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
    return mergeObjects.apply(void 0, Object(external_tslib_["__spreadArrays"])([target], sources));
};
var isObject = function (item) {
    return item !== null && typeof item === 'object';
};
var isMergebleObject = function (item) {
    return isObject(item) && !Array.isArray(item);
};
/**
 * slugify() returns empty string when failed to slugify.
 * so try to return minimum slugified-string with failed one which keeps original value
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
        res = "" + (specProtocol || 'https:') + to;
    }
    else if (isAbsoluteUrl(to)) {
        res = to;
    }
    else if (!to.startsWith('/')) {
        res = stripTrailingSlash(url) + '/' + to;
    }
    else {
        var urlObj = Object(external_url_["parse"])(url);
        res = Object(external_url_["format"])(Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, urlObj), { pathname: to }));
    }
    return stripTrailingSlash(res);
}
function getBasePath(serverUrl) {
    try {
        return parseURL(serverUrl).pathname;
    }
    catch (e) {
        // when using with redoc-cli serverUrl can be empty resulting in crash
        return serverUrl;
    }
}
function titleize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function removeQueryString(serverUrl) {
    try {
        var url = parseURL(serverUrl);
        url.search = '';
        return url.toString();
    }
    catch (e) {
        // when using with redoc-cli serverUrl can be empty resulting in crash
        return serverUrl;
    }
}
function parseURL(url) {
    if (typeof URL === 'undefined') {
        // node
        return new (__webpack_require__(5).URL)(url);
    }
    else {
        return new URL(url);
    }
}
function unescapeHTMLChars(str) {
    return str.replace(/&#(\d+);/g, function (_m, code) { return String.fromCharCode(parseInt(code, 10)); });
}

// CONCATENATED MODULE: ./src/services/Labels.ts
var labels = {
    enum: 'Enum',
    enumSingleValue: 'Value',
    enumArray: 'Items',
    default: 'Default',
    deprecated: 'Deprecated',
    example: 'Example',
    nullable: 'Nullable',
    recursive: 'Recursive',
    arrayOf: 'Array of '
};
function setRedocLabels(_labels) {
    Object.assign(labels, _labels);
}
function l(key, idx) {
    var label = labels[key];
    if (idx !== undefined) {
        return label[idx];
    }
    return label;
}

// CONCATENATED MODULE: ./src/services/RedocNormalizedOptions.ts





function argValueToBoolean(val, defaultValue) {
    if (val === undefined) {
        return defaultValue || false;
    }
    if (typeof val === 'string') {
        return val === 'false' ? false : true;
    }
    return val;
}
function argValueToString(val, defaultValue) {
    if (val === undefined) {
        return defaultValue || '';
    }
    if (typeof val === 'string') {
        return val;
    }
}
var RedocNormalizedOptions_RedocNormalizedOptions = /** @class */ (function () {
    function RedocNormalizedOptions(raw, defaults) {
        if (defaults === void 0) { defaults = {}; }
        raw = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, defaults), raw);
        var hook = raw.theme && raw.theme.extensionsHook;
        this.theme = resolveTheme(mergeObjects({}, src_theme, Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, raw.theme), { extensionsHook: undefined })));
        this.theme.extensionsHook = hook; // do not support dynamic labels changes. Labels should be configured before
        setRedocLabels(raw.labels);
        this.scrollYOffset = RedocNormalizedOptions.normalizeScrollYOffset(raw.scrollYOffset);
        this.hideHostname = RedocNormalizedOptions.normalizeHideHostname(raw.hideHostname);
        this.expandResponses = RedocNormalizedOptions.normalizeExpandResponses(raw.expandResponses);
        this.requiredPropsFirst = argValueToBoolean(raw.requiredPropsFirst);
        this.sortPropsAlphabetically = argValueToBoolean(raw.sortPropsAlphabetically);
        this.noAutoAuth = argValueToBoolean(raw.noAutoAuth);
        this.nativeScrollbars = argValueToBoolean(raw.nativeScrollbars);
        this.pathInMiddlePanel = argValueToBoolean(raw.pathInMiddlePanel);
        this.untrustedSpec = argValueToBoolean(raw.untrustedSpec);
        this.hideDownloadButton = argValueToBoolean(raw.hideDownloadButton);
        this.disableSearch = argValueToBoolean(raw.disableSearch);
        this.onlyRequiredInSamples = argValueToBoolean(raw.onlyRequiredInSamples);
        this.showExtensions = RedocNormalizedOptions.normalizeShowExtensions(raw.showExtensions);
        this.additionalDocUrl = argValueToString(raw.additionalDocUrl);
        this.hideSingleRequestSampleTab = argValueToBoolean(raw.hideSingleRequestSampleTab);
        this.menuToggle = argValueToBoolean(raw.menuToggle, true);
        this.jsonSampleExpandLevel = RedocNormalizedOptions.normalizeJsonSampleExpandLevel(raw.jsonSampleExpandLevel);
        this.enumSkipQuotes = argValueToBoolean(raw.enumSkipQuotes);
        this.hideSchemaTitles = argValueToBoolean(raw.hideSchemaTitles);
        this.payloadSampleIdx = RedocNormalizedOptions.normalizePayloadSampleIdx(raw.payloadSampleIdx);
        this.expandSingleSchemaField = argValueToBoolean(raw.expandSingleSchemaField); // eslint-disable-next-line @typescript-eslint/camelcase
        this.unstable_ignoreMimeParameters = argValueToBoolean(raw.unstable_ignoreMimeParameters);
        this.allowedMdComponents = raw.allowedMdComponents || {};
        this.expandDefaultServerVariables = argValueToBoolean(raw.expandDefaultServerVariables);
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
    RedocNormalizedOptions.normalizePayloadSampleIdx = function (value) {
        if (typeof value === 'number') {
            return Math.max(0, value); // always greater or equal than 0
        }
        if (typeof value === 'string') {
            return isFinite(value) ? parseInt(value, 10) : 0;
        }
        return 0;
    };
    RedocNormalizedOptions.normalizeJsonSampleExpandLevel = function (level) {
        if (level === 'all') {
            return +Infinity;
        }
        if (!isNaN(Number(level))) {
            return Math.ceil(Number(level));
        }
        return 2;
    };
    return RedocNormalizedOptions;
}());


// EXTERNAL MODULE: external "styled-components"
var external_styled_components_ = __webpack_require__(36);

// CONCATENATED MODULE: ./src/styled-components.ts


var styled_components_a = external_styled_components_, styled = styled_components_a.default, css = styled_components_a.css, createGlobalStyle = styled_components_a.createGlobalStyle, keyframes = styled_components_a.keyframes, ThemeProvider = styled_components_a.ThemeProvider;
var media = {
    lessThan: function (breakpoint, print) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_1 || (templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n      @media ", " screen and (max-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media ", " screen and (max-width: ", ") {\n        ", ";\n      }\n    "])), print ? 'print, ' : '', function (props) { return props.theme.breakpoints[breakpoint]; }, css.apply(void 0, args));
        };
    },
    greaterThan: function (breakpoint) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_2 || (templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n      @media (min-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media (min-width: ", ") {\n        ", ";\n      }\n    "])), function (props) { return props.theme.breakpoints[breakpoint]; }, css.apply(void 0, args));
        };
    },
    between: function (firstBreakpoint, secondBreakpoint) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return css(templateObject_3 || (templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n      @media (min-width: ", ") and (max-width: ", ") {\n        ", ";\n      }\n    "], ["\n      @media (min-width: ", ") and (max-width: ", ") {\n        ", ";\n      }\n    "])), function (props) { return props.theme.breakpoints[firstBreakpoint]; }, function (props) { return props.theme.breakpoints[secondBreakpoint]; }, css.apply(void 0, args));
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



var ErrorWrapper = styled_components.div(ErrorBoundary_templateObject_1 || (ErrorBoundary_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 20px;\n  color: red;\n"], ["\n  padding: 20px;\n  color: red;\n"])));
var ErrorBoundary_ErrorBoundary = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ErrorBoundary, _super);
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
                    "20.1.4"),
                " ",
                external_react_["createElement"]("br", null),
                external_react_["createElement"]("small", null,
                    " Commit: ",
                    "1b4fcb54"));
        }
        return external_react_["Children"].only(this.props.children);
    };
    return ErrorBoundary;
}(external_react_["Component"]));

var ErrorBoundary_templateObject_1;

// CONCATENATED MODULE: ./src/components/Loading/Spinner.svg.tsx



var _Spinner = function (props) { return external_react_["createElement"]("svg", { className: props.className, width: "42", height: "42", viewBox: "0 0 42 42", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    external_react_["createElement"]("path", { d: "M21 0C9.4 0 0 9.4 0 21C0 32.6 9.4 42 21 42C32.6 42 42 32.6 42 21C42 9.4 32.6 0 21 0ZM21 35C13.27 35 7 28.73 7 21C7 13.27 13.27 7 21 7C28.73 7 35 13.27 35 21C35 28.73 28.73 35 21 35Z" }),
    external_react_["createElement"]("path", { id: "rotator", d: "M21 1V6C28.94 6 35.45 12.18 35.96 20H40.97C40.45 9.42 31.71 1 21 1Z", fill: "white" })); };
var rotate = keyframes(Spinner_svg_templateObject_1 || (Spinner_svg_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  0% {\n    transform: rotate(0deg); }\n  100% {\n    transform: rotate(360deg);\n  }\n"], ["\n  0% {\n    transform: rotate(0deg); }\n  100% {\n    transform: rotate(360deg);\n  }\n"])));
var Spinner = styled_components(_Spinner)(Spinner_svg_templateObject_2 || (Spinner_svg_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  animation: 1.5s ", " linear infinite;\n  width: 42px;\n  height: 42px;\n  content: '';\n  display: inline-block;\n  margin-left: -25px;\n\n  path:not(#rotator) {\n    fill: ", ";\n  }\n"], ["\n  animation: 1.5s ", " linear infinite;\n  width: 42px;\n  height: 42px;\n  content: '';\n  display: inline-block;\n  margin-left: -25px;\n\n  path:not(#rotator) {\n    fill: ", ";\n  }\n"])), rotate, function (props) { return props.color; });
var Spinner_svg_templateObject_1, Spinner_svg_templateObject_2;

// CONCATENATED MODULE: ./src/components/Loading/Loading.tsx




var LoadingMessage = styled_components.div(Loading_templateObject_1 || (Loading_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: helvetica, sans;\n  width: 100%;\n  text-align: center;\n  font-size: 25px;\n  margin: 30px 0 20px 0;\n  color: ", ";\n"], ["\n  font-family: helvetica, sans;\n  width: 100%;\n  text-align: center;\n  font-size: 25px;\n  margin: 30px 0 20px 0;\n  color: ", ";\n"])), function (props) { return props.color; });
var Loading_Loading = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Loading, _super);
    function Loading() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Loading.prototype.render = function () {
        return external_react_["createElement"]("div", { style: {
                textAlign: 'center'
            } },
            external_react_["createElement"](LoadingMessage, { color: this.props.color }),
            external_react_["createElement"](Spinner, { color: this.props.color }));
    };
    return Loading;
}(external_react_["PureComponent"]));

var Loading_templateObject_1;

// EXTERNAL MODULE: external "mobx"
var external_mobx_ = __webpack_require__(4);

// EXTERNAL MODULE: external "json-schema-ref-parser"
var external_json_schema_ref_parser_ = __webpack_require__(37);

// EXTERNAL MODULE: ./node_modules/swagger2openapi/index.js
var swagger2openapi = __webpack_require__(38);

// CONCATENATED MODULE: ./src/utils/loadAndBundleSpec.ts


/* tslint:disable-next-line:no-implicit-dependencies */

function loadAndBundleSpec(specUrlOrObject) {
    return Object(external_tslib_["__awaiter"])(this, void 0, void 0, function () {
        var parser, spec;
        return Object(external_tslib_["__generator"])(this, function (_a) {
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
        warnOnly: true,
        text: '{}'
    }, function (err, res) {
        // TODO: log any warnings
        if (err) {
            return reject(err);
        }
        resolve(res && res.openapi);
    }); });
}

// EXTERNAL MODULE: external "decko"
var external_decko_ = __webpack_require__(8);

// EXTERNAL MODULE: external "eventemitter3"
var external_eventemitter3_ = __webpack_require__(19);

// EXTERNAL MODULE: external "json-pointer"
var external_json_pointer_ = __webpack_require__(6);

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
var path_browserify = __webpack_require__(13);

// EXTERNAL MODULE: external "url-template"
var external_url_template_ = __webpack_require__(20);

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
function isFormUrlEncoded(contentType) {
    return contentType === 'application/x-www-form-urlencoded';
}
function delimitedEncodeField(fieldVal, fieldName, delimiter) {
    if (Array.isArray(fieldVal)) {
        return fieldVal.map(function (v) { return v.toString(); }).join(delimiter);
    }
    else if (typeof fieldVal === 'object') {
        return Object.keys(fieldVal).map(function (k) { return "" + k + delimiter + fieldVal[k]; }).join(delimiter);
    }
    else {
        return fieldName + '=' + fieldVal.toString();
    }
}
function deepObjectEncodeField(fieldVal, fieldName) {
    if (Array.isArray(fieldVal)) {
        console.warn('deepObject style cannot be used with array value:' + fieldVal.toString());
        return '';
    }
    else if (typeof fieldVal === 'object') {
        return Object.keys(fieldVal).map(function (k) { return fieldName + "[" + k + "]=" + fieldVal[k]; }).join('&');
    }
    else {
        console.warn('deepObject style cannot be used with non-object value:' + fieldVal.toString());
        return '';
    }
}
function serializeFormValue(name, explode, value) {
    var _a;
    // Use RFC6570 safe name ([a-zA-Z0-9_]) and replace with our name later
    // e.g. URI.template doesn't parse names with hyphen (-) which are valid query param names
    var safeName = '__redoc_param_name__';
    var suffix = explode ? '*' : '';
    var template = external_url_template_["parse"]("{?" + safeName + suffix + "}");
    return template.expand((_a = {},
        _a[safeName] = value,
        _a)).substring(1).replace(/__redoc_param_name__/g, name);
}
/*
 * Should be used only for url-form-encoded body payloads
 * To be used for parameters should be extended with other style values
 */
function urlFormEncodePayload(payload, encoding) {
    if (encoding === void 0) { encoding = {}; }
    if (Array.isArray(payload)) {
        throw new Error('Payload must have fields: ' + payload.toString());
    }
    else {
        return Object.keys(payload).map(function (fieldName) {
            var fieldVal = payload[fieldName];
            var _a = encoding[fieldName] || {}, _b = _a.style, style = _b === void 0 ? 'form' : _b, _c = _a.explode, explode = _c === void 0 ? true : _c;
            switch (style) {
                case 'form':
                    return serializeFormValue(fieldName, explode, fieldVal);
                case 'spaceDelimited':
                    return delimitedEncodeField(fieldVal, fieldName, '%20');
                case 'pipeDelimited':
                    return delimitedEncodeField(fieldVal, fieldName, '|');
                case 'deepObject':
                    return deepObjectEncodeField(fieldVal, fieldName);
                default:
                    // TODO implement rest of styles for path parameters
                    console.warn('Incorrect or unsupported encoding style: ' + style);
                    return '';
            }
        }).join('&');
    }
}
function serializePathParameter(name, style, explode, value) {
    var _a;
    var suffix = explode ? '*' : '';
    var prefix = '';
    if (style === 'label') {
        prefix = '.';
    }
    else if (style === 'matrix') {
        prefix = ';';
    } // Use RFC6570 safe name ([a-zA-Z0-9_]) and replace with our name later
    // e.g. URI.template doesn't parse names with hyphen (-) which are valid query param names
    var safeName = '__redoc_param_name__';
    var template = external_url_template_["parse"]("{" + prefix + safeName + suffix + "}");
    return template.expand((_a = {},
        _a[safeName] = value,
        _a)).replace(/__redoc_param_name__/g, name);
}
function serializeQueryParameter(name, style, explode, value) {
    switch (style) {
        case 'form':
            return serializeFormValue(name, explode, value);
        case 'spaceDelimited':
            if (!Array.isArray(value)) {
                console.warn('The style spaceDelimited is only applicable to arrays');
                return '';
            }
            if (explode) {
                return serializeFormValue(name, explode, value);
            }
            return name + "=" + value.join('%20');
        case 'pipeDelimited':
            if (!Array.isArray(value)) {
                console.warn('The style pipeDelimited is only applicable to arrays');
                return '';
            }
            if (explode) {
                return serializeFormValue(name, explode, value);
            }
            return name + "=" + value.join('|');
        case 'deepObject':
            if (!explode || Array.isArray(value) || typeof value !== 'object') {
                console.warn('The style deepObject is only applicable for objects with explode=true');
                return '';
            }
            return deepObjectEncodeField(value, name);
        default:
            console.warn('Unexpected style for query: ' + style);
            return '';
    }
}
function serializeHeaderParameter(style, explode, value) {
    var _a;
    switch (style) {
        case 'simple':
            var suffix = explode ? '*' : ''; // name is not important here, so use RFC6570 safe name ([a-zA-Z0-9_])
            var name_1 = '__redoc_param_name__';
            var template = external_url_template_["parse"]("{" + name_1 + suffix + "}");
            return decodeURIComponent(template.expand((_a = {},
                _a[name_1] = value,
                _a)));
        default:
            console.warn('Unexpected style for header: ' + style);
            return '';
    }
}
function serializeCookieParameter(name, style, explode, value) {
    switch (style) {
        case 'form':
            return serializeFormValue(name, explode, value);
        default:
            console.warn('Unexpected style for cookie: ' + style);
            return '';
    }
}
function serializeParameterValueWithMime(value, mime) {
    if (isJsonLike(mime)) {
        return JSON.stringify(value);
    }
    else {
        console.warn("Parameter serialization as " + mime + " is not supported");
        return '';
    }
}
function serializeParameterValue(parameter, value) {
    var name = parameter.name, style = parameter.style, _a = parameter.explode, explode = _a === void 0 ? false : _a, serializationMime = parameter.serializationMime;
    if (serializationMime) {
        switch (parameter.in) {
            case 'path':
            case 'header':
                return serializeParameterValueWithMime(value, serializationMime);
            case 'cookie':
            case 'query':
                return name + "=" + serializeParameterValueWithMime(value, serializationMime);
            default:
                console.warn('Unexpected parameter location: ' + parameter.in);
                return '';
        }
    }
    if (!style) {
        console.warn("Missing style attribute or content for parameter " + name);
        return '';
    }
    switch (parameter.in) {
        case 'path':
            return serializePathParameter(name, style, explode, value);
        case 'query':
            return serializeQueryParameter(name, style, explode, value);
        case 'header':
            return serializeHeaderParameter(style, explode, value);
        case 'cookie':
            return serializeCookieParameter(name, style, explode, value);
        default:
            console.warn('Unexpected parameter location: ' + parameter.in);
            return '';
    }
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
function humanizeMultipleOfConstraint(multipleOf) {
    if (multipleOf === undefined) {
        return;
    }
    var strigifiedMultipleOf = multipleOf.toString(10);
    if (!/^0\.0*1$/.test(strigifiedMultipleOf)) {
        return "multiple of " + strigifiedMultipleOf;
    }
    return "decimal places <= " + strigifiedMultipleOf.split('.')[1].length;
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
    var multipleOfConstraint = humanizeMultipleOfConstraint(schema.multipleOf);
    if (multipleOfConstraint !== undefined) {
        res.push(multipleOfConstraint);
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
    var unrequiredFields = [];
    var orderedFields = [];
    var unorderedFields = [];
    fields.forEach(function (field) {
        if (field.required) {
            order.includes(field.name) ? orderedFields.push(field) : unorderedFields.push(field);
        }
        else {
            unrequiredFields.push(field);
        }
    });
    orderedFields.sort(function (a, b) { return order.indexOf(a.name) - order.indexOf(b.name); });
    return Object(external_tslib_["__spreadArrays"])(orderedFields, unorderedFields, unrequiredFields);
}
function sortByField(fields, param) {
    return Object(external_tslib_["__spreadArrays"])(fields).sort(function (a, b) {
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
    }); // filter out path params overridden by operation ones with the same name
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
        mergedTypes[normalizedMimeName] = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, mergedTypes[normalizedMimeName]), mime);
    });
    return mergedTypes;
}
function expandDefaultServerVariables(url, variables) {
    if (variables === void 0) { variables = {}; }
    return url.replace(/(?:{)(\w+)(?:})/g, function (match, name) { return variables[name] && variables[name].default || match; });
}
function normalizeServers(specUrl, servers) {
    var getHref = function () {
        if (!IS_BROWSER) {
            return '';
        }
        var href = window.location.href;
        return href.endsWith('.html') ? Object(path_browserify["dirname"])(href) : href;
    };
    var baseUrl = specUrl === undefined ? removeQueryString(getHref()) : Object(path_browserify["dirname"])(specUrl);
    if (servers.length === 0) {
        // Behaviour defined in OpenAPI spec: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#openapi-object
        servers = [{
                url: '/'
            }];
    }
    function normalizeUrl(url) {
        return resolveUrl(baseUrl, url);
    }
    return servers.map(function (server) {
        return Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, server), { url: normalizeUrl(server.url), description: server.description || '' });
    });
}
var SECURITY_DEFINITIONS_COMPONENT_NAME = 'security-definitions';
var SECURITY_DEFINITIONS_JSX_NAME = 'SecurityDefinitions';
var SCHEMA_DEFINITION_JSX_NAME = 'SchemaDefinition';
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
        'x-traitTag': true,
        'x-additionalPropertiesName': true
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
function pluralizeType(displayType) {
    return displayType.split(' or ').map(function (type) { return type.replace(/^(string|object|number|integer|array|boolean)s?( ?.*)/, '$1s$2'); }).join(' or ');
}

// EXTERNAL MODULE: external "prismjs"
var external_prismjs_ = __webpack_require__(10);

// EXTERNAL MODULE: external "prismjs/components/prism-bash.js"
var prism_bash_js_ = __webpack_require__(57);

// EXTERNAL MODULE: external "prismjs/components/prism-c.js"
var prism_c_js_ = __webpack_require__(58);

// EXTERNAL MODULE: external "prismjs/components/prism-clike.js"
var prism_clike_js_ = __webpack_require__(59);

// EXTERNAL MODULE: external "prismjs/components/prism-coffeescript.js"
var prism_coffeescript_js_ = __webpack_require__(60);

// EXTERNAL MODULE: external "prismjs/components/prism-cpp.js"
var prism_cpp_js_ = __webpack_require__(61);

// EXTERNAL MODULE: external "prismjs/components/prism-csharp.js"
var prism_csharp_js_ = __webpack_require__(62);

// EXTERNAL MODULE: external "prismjs/components/prism-go.js"
var prism_go_js_ = __webpack_require__(63);

// EXTERNAL MODULE: external "prismjs/components/prism-http.js"
var prism_http_js_ = __webpack_require__(64);

// EXTERNAL MODULE: external "prismjs/components/prism-java.js"
var prism_java_js_ = __webpack_require__(65);

// EXTERNAL MODULE: external "prismjs/components/prism-lua.js"
var prism_lua_js_ = __webpack_require__(66);

// EXTERNAL MODULE: external "prismjs/components/prism-markup-templating.js"
var prism_markup_templating_js_ = __webpack_require__(67);

// EXTERNAL MODULE: external "prismjs/components/prism-markup.js"
var prism_markup_js_ = __webpack_require__(68);

// EXTERNAL MODULE: external "prismjs/components/prism-objectivec.js"
var prism_objectivec_js_ = __webpack_require__(69);

// EXTERNAL MODULE: external "prismjs/components/prism-perl.js"
var prism_perl_js_ = __webpack_require__(70);

// EXTERNAL MODULE: external "prismjs/components/prism-php.js"
var prism_php_js_ = __webpack_require__(71);

// EXTERNAL MODULE: external "prismjs/components/prism-python.js"
var prism_python_js_ = __webpack_require__(72);

// EXTERNAL MODULE: external "prismjs/components/prism-ruby.js"
var prism_ruby_js_ = __webpack_require__(73);

// EXTERNAL MODULE: external "prismjs/components/prism-scala.js"
var prism_scala_js_ = __webpack_require__(74);

// EXTERNAL MODULE: external "prismjs/components/prism-sql.js"
var prism_sql_js_ = __webpack_require__(75);

// EXTERNAL MODULE: external "prismjs/components/prism-swift.js"
var prism_swift_js_ = __webpack_require__(76);

// CONCATENATED MODULE: ./src/utils/highlight.ts











 // dep of php
 // xml








var DEFAULT_LANG = 'clike';
external_prismjs_["languages"].insertBefore('javascript', 'string', {
    'property string': {
        pattern: /([{,]\s*)"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
        lookbehind: true
    }
}, undefined);
external_prismjs_["languages"].insertBefore('javascript', 'punctuation', {
    property: {
        pattern: /([{,]\s*)[a-z]\w*(?=\s*:)/i,
        lookbehind: true
    }
}, undefined);
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
 * @return highlighted source code as **html string**
 */
function highlight(source, lang) {
    if (lang === void 0) { lang = DEFAULT_LANG; }
    lang = lang.toLowerCase();
    var grammar = external_prismjs_["languages"][lang];
    if (!grammar) {
        grammar = external_prismjs_["languages"][mapLang(lang)];
    }
    return external_prismjs_["highlight"](source, grammar, lang);
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
        context = this; // eslint-disable-next-line prefer-rest-params
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
    return Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, descriptor), { get: function () {
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
    return Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, descriptor), { value: function () {
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
            return IS_BROWSER ? decodeURIComponent(window.location.hash.substring(1)) : '';
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
    Object(external_tslib_["__decorate"])([
        external_decko_["bind"],
        external_decko_["debounce"]
    ], HistoryService.prototype, "replace", null);
    return HistoryService;
}());

var HistoryService_history = new HistoryService_HistoryService();
if (false) {}

// EXTERNAL MODULE: external "mark.js"
var external_mark_js_ = __webpack_require__(23);

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
var external_marked_ = __webpack_require__(15);

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
        this.headingRule = function (text, level, raw, slugger) {
            if (level === 1) {
                _this.currentTopHeading = _this.saveHeading(text, level);
            }
            else if (level === 2) {
                _this.saveHeading(text, level, _this.currentTopHeading && _this.currentTopHeading.items, _this.currentTopHeading && _this.currentTopHeading.id);
            }
            return _this.originalHeadingRule(text, level, raw, slugger);
        };
        this.headingEnhanceRenderer = new external_marked_["Renderer"]();
        this.originalHeadingRule = this.headingEnhanceRenderer.heading.bind(this.headingEnhanceRenderer);
        this.headingEnhanceRenderer.heading = this.headingRule;
    }
    MarkdownRenderer.containsComponent = function (rawText, componentName) {
        var compRegexp = new RegExp(COMPONENT_REGEXP.replace(/{component}/g, componentName), 'gmi');
        return compRegexp.test(rawText);
    };
    MarkdownRenderer.getTextBeforeHading = function (md, heading) {
        var headingLinePos = md.search(new RegExp("^##?\\s+" + heading, 'm'));
        if (headingLinePos > -1) {
            return md.substring(0, headingLinePos);
        }
        return md;
    };
    MarkdownRenderer.prototype.saveHeading = function (name, level, container, parentId) {
        if (container === void 0) { container = this.headings; }
        name = unescapeHTMLChars(name);
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
                    props: Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, parseProps(props)), componentMeta.props), { children: children })
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
        var _this = this;
        if (options === void 0) { options = new RedocNormalizedOptions_RedocNormalizedOptions({}); }
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
        this.mergeRefs = new Set();
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
            if (!MarkdownRenderer_MarkdownRenderer.containsComponent(description, SECURITY_DEFINITIONS_COMPONENT_NAME) && !MarkdownRenderer_MarkdownRenderer.containsComponent(description, SECURITY_DEFINITIONS_JSX_NAME)) {
                var comment = buildComponentComment(SECURITY_DEFINITIONS_COMPONENT_NAME);
                spec.info.description = appendToMdHeading(description, 'Authentication', comment);
            }
        }
    };
    /**
     * checks if the object is OpenAPI reference (contains $ref property)
     */
    OpenAPIParser.prototype.isRef = function (obj) {
        if (!obj) {
            return false;
        }
        return obj.$ref !== undefined && obj.$ref !== null;
    };
    /**
     * resets visited endpoints. should be run after
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
     * @param forceCircular whether to dereference even if it is circular ref
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
     * Merge allOf constraints.
     * @param schema schema with allOF
     * @param $ref pointer of the schema
     * @param forceCircular whether to dereference children even if it is a circular ref
     */
    OpenAPIParser.prototype.mergeAllOf = function (schema, $ref, forceCircular, used$Refs) {
        var _this = this;
        if (forceCircular === void 0) { forceCircular = false; }
        if (used$Refs === void 0) { used$Refs = new Set(); }
        if ($ref) {
            used$Refs.add($ref);
        }
        schema = this.hoistOneOfs(schema);
        if (schema.allOf === undefined) {
            return schema;
        }
        var receiver = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, schema), { allOf: undefined, parentRefs: [], title: schema.title || (isNamedDefinition($ref) ? JsonPointer_JsonPointer.baseName($ref) : undefined) }); // avoid mutating inner objects
        if (receiver.properties !== undefined && typeof receiver.properties === 'object') {
            receiver.properties = Object(external_tslib_["__assign"])({}, receiver.properties);
        }
        if (receiver.items !== undefined && typeof receiver.items === 'object') {
            receiver.items = Object(external_tslib_["__assign"])({}, receiver.items);
        }
        var allOfSchemas = schema.allOf.map(function (subSchema) {
            var _a;
            if (subSchema && subSchema.$ref && used$Refs.has(subSchema.$ref)) {
                return undefined;
            }
            var resolved = _this.deref(subSchema, forceCircular);
            var subRef = subSchema.$ref || undefined;
            var subMerged = _this.mergeAllOf(resolved, subRef, forceCircular, used$Refs);
            (_a = receiver.parentRefs).push.apply(_a, (subMerged.parentRefs || []));
            return {
                $ref: subRef,
                schema: subMerged
            };
        }).filter(function (child) { return child !== undefined; });
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
            // TODO: do more intelligent merge
            receiver = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, subSchema), receiver);
            if (subSchemaRef) {
                receiver.parentRefs.push(subSchemaRef);
                if (receiver.title === undefined && isNamedDefinition(subSchemaRef)) { // this is not so correct behaviour. commented out for now
                    // ref: https://github.com/Redocly/redoc/issues/601
                    // receiver.title = JsonPointer.baseName(subSchemaRef);
                }
            }
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
                res['#/components/schemas/' + defName] = [def['x-discriminator-value'] || defName];
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
                                allOf: Object(external_tslib_["__spreadArrays"])(beforeAllOf_1, [part], afterAllOf_1)
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
 * Store that contains all the specification related information in the form of tree
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
        this.level = tagOrGroup.level || 1; // remove sections from markdown, same as in ApiInfo
        this.description = tagOrGroup.description || '';
        var items = tagOrGroup.items;
        if (items && items.length) {
            this.description = MarkdownRenderer_MarkdownRenderer.getTextBeforeHading(this.description, items[0].name);
        }
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
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], GroupModel.prototype, "active", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], GroupModel.prototype, "expanded", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], GroupModel.prototype, "activate", null);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], GroupModel.prototype, "expand", null);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], GroupModel.prototype, "collapse", null);
    Object(external_tslib_["__decorate"])([
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
            return Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, scheme), { id: id, sectionId: SECURITY_SCHEMES_SECTION_PREFIX + id, scopes: scopes });
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
        var _this = this;
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
        else if (isChild && Array.isArray(schema.oneOf) && schema.oneOf.find(function (s) { return s.$ref === _this.pointer; })) {
            // we hit allOf of the schema with the parent discriminator
            delete schema.oneOf;
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
            this.displayType = pluralizeType(this.items.displayType);
            this.displayFormat = this.items.format;
            this.typePrefix = this.items.typePrefix + l('arrayOf');
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
            var derefVariant = parser.deref(variant);
            var merged = parser.mergeAllOf(derefVariant, _this.pointer + '/oneOf/' + idx); // try to infer title
            var title = isNamedDefinition(variant.$ref) && !merged.title ? JsonPointer_JsonPointer.baseName(variant.$ref) : merged.title;
            var schema = new SchemaModel(parser, Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, merged), { title: title, allOf: [Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, _this.schema), { oneOf: undefined, anyOf: undefined })] }), _this.pointer + '/oneOf/' + idx, _this.options);
            parser.exitRef(variant); // each oneOf should be independent so exiting all the parent refs
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
        var implicitInversedMapping = parser.findDerived(Object(external_tslib_["__spreadArrays"])((schema.parentRefs || []), [this.pointer]));
        if (schema.oneOf) {
            for (var _i = 0, _a = schema.oneOf; _i < _a.length; _i++) {
                var variant = _a[_i];
                if (variant.$ref === undefined) {
                    continue;
                }
                var name_1 = JsonPointer_JsonPointer.baseName(variant.$ref);
                implicitInversedMapping[variant.$ref] = name_1;
            }
        }
        var mapping = discriminator.mapping || {};
        var explicitInversedMapping = {};
        for (var name_2 in mapping) {
            var $ref = mapping[name_2];
            if (Array.isArray(explicitInversedMapping[$ref])) {
                explicitInversedMapping[$ref].push(name_2);
            }
            else {
                // overrides implicit mapping here
                explicitInversedMapping[$ref] = [name_2];
            }
        }
        var inversedMapping = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, implicitInversedMapping), explicitInversedMapping);
        var refs = [];
        for (var _b = 0, _c = Object.keys(inversedMapping); _b < _c.length; _b++) {
            var $ref = _c[_b];
            var names = inversedMapping[$ref];
            if (Array.isArray(names)) {
                for (var _d = 0, names_1 = names; _d < names_1.length; _d++) {
                    var name_3 = names_1[_d];
                    refs.push({
                        $ref: $ref,
                        name: name_3
                    });
                }
            }
            else {
                refs.push({
                    $ref: $ref,
                    name: names
                });
            }
        }
        this.oneOf = refs.map(function (_a) {
            var $ref = _a.$ref, name = _a.name;
            var innerSchema = new SchemaModel(parser, parser.byRef($ref), $ref, _this.options, true);
            innerSchema.title = name;
            return innerSchema;
        });
    };
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], SchemaModel.prototype, "activeOneOf", void 0);
    Object(external_tslib_["__decorate"])([
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
            schema: Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, field), { default: field.default === undefined ? defaults[fieldName] : field.default })
        }, $ref + '/properties/' + fieldName, options);
    });
    if (options.sortPropsAlphabetically) {
        fields = sortByField(fields, 'name');
    }
    if (options.requiredPropsFirst) {
        // if not sort alphabetically sort in the order from required keyword
        fields = sortByRequired(fields, !options.sortPropsAlphabetically ? schema.required : undefined);
    }
    if (typeof additionalProps === 'object' || additionalProps === true) {
        fields.push(new Field_FieldModel(parser, {
            name: (typeof additionalProps === 'object' ? additionalProps['x-additionalPropertiesName'] || 'property name' : 'property name').concat('*'),
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




function getDefaultStyleValue(parameterLocation) {
    switch (parameterLocation) {
        case 'header':
            return 'simple';
        case 'query':
            return 'form';
        case 'path':
            return 'simple';
        default:
            return 'form';
    }
}
/**
 * Field or Parameter model ready to be used by components
 */
var Field_FieldModel = /** @class */ (function () {
    function FieldModel(parser, infoOrRef, pointer, options) {
        var info = parser.deref(infoOrRef);
        this.kind = infoOrRef.kind || 'field';
        this.name = infoOrRef.name || info.name;
        this.in = info.in;
        this.required = !!info.required;
        var fieldSchema = info.schema;
        var serializationMime = '';
        if (!fieldSchema && info.in && info.content) {
            serializationMime = Object.keys(info.content)[0];
            fieldSchema = info.content[serializationMime] && info.content[serializationMime].schema;
        }
        this.schema = new Schema_SchemaModel(parser, fieldSchema || {}, pointer, options);
        this.description = info.description === undefined ? this.schema.description || '' : info.description;
        this.example = info.example || this.schema.example;
        if (serializationMime) {
            this.serializationMime = serializationMime;
        }
        else if (info.style) {
            this.style = info.style;
        }
        else if (this.in) {
            this.style = getDefaultStyleValue(this.in);
        }
        this.explode = !!info.explode;
        this.deprecated = info.deprecated === undefined ? !!this.schema.deprecated : info.deprecated;
        parser.exitRef(infoOrRef);
        if (options.showExtensions) {
            this.extensions = extractExtensions(info, options.showExtensions);
        }
    }
    FieldModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], FieldModel.prototype, "expanded", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], FieldModel.prototype, "toggle", null);
    return FieldModel;
}());


// EXTERNAL MODULE: external "openapi-sampler"
var external_openapi_sampler_ = __webpack_require__(24);

// CONCATENATED MODULE: ./src/services/models/Example.ts


var externalExamplesCache = {};
var Example_ExampleModel = /** @class */ (function () {
    function ExampleModel(parser, infoOrRef, mime, encoding) {
        this.mime = mime;
        var example = parser.deref(infoOrRef);
        this.value = example.value;
        this.summary = example.summary;
        this.description = example.description;
        if (example.externalValue) {
            this.externalValueUrl = Object(external_url_["resolve"])(parser.specUrl || '', example.externalValue);
        }
        parser.exitRef(infoOrRef);
        if (isFormUrlEncoded(mime) && this.value && typeof this.value === 'object') {
            this.value = urlFormEncodePayload(this.value, encoding);
        }
    }
    ExampleModel.prototype.getExternalValue = function (mimeType) {
        if (!this.externalValueUrl) {
            return Promise.resolve(undefined);
        }
        if (externalExamplesCache[this.externalValueUrl]) {
            return externalExamplesCache[this.externalValueUrl];
        }
        externalExamplesCache[this.externalValueUrl] = fetch(this.externalValueUrl).then(function (res) {
            return res.text().then(function (txt) {
                if (!res.ok) {
                    return Promise.reject(new Error(txt));
                }
                if (isJsonLike(mimeType)) {
                    try {
                        return JSON.parse(txt);
                    }
                    catch (e) {
                        return txt;
                    }
                }
                else {
                    return txt;
                }
            });
        });
        return externalExamplesCache[this.externalValueUrl];
    };
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
            this.examples = mapValues(info.examples, function (example) { return new Example_ExampleModel(parser, example, name, info.encoding); });
        }
        else if (info.example !== undefined) {
            this.examples = {
                default: new Example_ExampleModel(parser, {
                    value: parser.shalowDeref(info.example)
                }, name, info.encoding)
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
                this.examples[subSchema.title] = new Example_ExampleModel(parser, {
                    value: sample
                }, this.name, info.encoding);
            }
        }
        else if (this.schema) {
            this.examples = {
                default: new Example_ExampleModel(parser, {
                    value: external_openapi_sampler_["sample"](info.schema, samplerOptions, parser.spec)
                }, this.name, info.encoding)
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
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], MediaContentModel.prototype, "activeMimeIdx", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], MediaContentModel.prototype, "activate", null);
    Object(external_tslib_["__decorate"])([
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
                return new Field_FieldModel(parser, Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, header), { name: name }), '', options);
            });
        }
    }
    ResponseModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], ResponseModel.prototype, "expanded", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], ResponseModel.prototype, "toggle", null);
    return ResponseModel;
}());


// CONCATENATED MODULE: ./src/services/models/Operation.ts







function isPayloadSample(sample) {
    return sample.lang === 'payload' && sample.requestBodyContent;
}
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
    Object.defineProperty(OperationModel.prototype, "codeSamples", {
        get: function () {
            var samples = this.operationSpec['x-code-samples'] || [];
            var requestBodyContent = this.requestBody && this.requestBody.content;
            if (requestBodyContent && requestBodyContent.hasSample) {
                var insertInx = Math.min(samples.length, this.options.payloadSampleIdx);
                samples = Object(external_tslib_["__spreadArrays"])(samples.slice(0, insertInx), [{
                        lang: 'payload',
                        label: 'Payload',
                        source: '',
                        requestBodyContent: requestBodyContent
                    }], samples.slice(insertInx));
            }
            return samples;
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
                return sortByField(_parameters, 'name');
            }
            if (this.options.requiredPropsFirst) {
                return sortByRequired(_parameters);
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
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], OperationModel.prototype, "ready", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], OperationModel.prototype, "active", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], OperationModel.prototype, "expanded", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], OperationModel.prototype, "activate", null);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], OperationModel.prototype, "deactivate", null);
    Object(external_tslib_["__decorate"])([
        memoize
    ], OperationModel.prototype, "requestBody", null);
    Object(external_tslib_["__decorate"])([
        memoize
    ], OperationModel.prototype, "codeSamples", null);
    Object(external_tslib_["__decorate"])([
        memoize
    ], OperationModel.prototype, "parameters", null);
    Object(external_tslib_["__decorate"])([
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
        items.push.apply(items, MenuBuilder.addMarkdownItems(spec.info.description || '', undefined, 1, options));
        if (spec['x-tagGroups'] && spec['x-tagGroups'].length > 0) {
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
    MenuBuilder.addMarkdownItems = function (description, parent, initialDepth, options) {
        var renderer = new MarkdownRenderer_MarkdownRenderer(options);
        var headings = renderer.extractHeadings(description || '');
        if (headings.length && parent && parent.description) {
            parent.description = MarkdownRenderer_MarkdownRenderer.getTextBeforeHading(parent.description, headings[0].name);
        }
        var mapHeadingsDeep = function (_parent, items, depth) {
            if (depth === void 0) { depth = 1; }
            return items.map(function (heading) {
                var group = new Group_model_GroupModel('section', heading, _parent);
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
        return mapHeadingsDeep(parent, headings, initialDepth);
    };
    /**
     * Returns array of OperationsGroup items for the tag groups (x-tagGroups vendor extension)
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
            item.depth = GROUP_DEPTH + 1; // don't put empty tag into content, instead put its operations
            if (tag.name === '') {
                var items = Object(external_tslib_["__spreadArrays"])(MenuBuilder.addMarkdownItems(tag.description || '', item, item.depth + 1, options), this.getOperationsItems(parser, undefined, tag, item.depth + 1, options));
                res.push.apply(res, items);
                continue;
            }
            item.items = Object(external_tslib_["__spreadArrays"])(MenuBuilder.addMarkdownItems(tag.description || '', item, item.depth + 1, options), this.getOperationsItems(parser, item, tag, item.depth + 1, options));
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
            tags[tag.name] = Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, tag), { operations: [] });
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
                    tag.operations.push(Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, operationInfo), { pathName: pathName, httpVerb: operationName, pathParameters: path.parameters || [] }));
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
                    var el = _this.getElementAtOrFirstChild(itemIdx + 1);
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
    /**
     * get section/operation DOM Node related to the item or if it is group item, returns first item of the group
     * @param idx item absolute index
     */
    MenuStore.prototype.getElementAtOrFirstChild = function (idx) {
        var item = this.flatItems[idx];
        if (item && item.type === 'group') {
            item = item.items[0];
        }
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
     * @param rewriteHistory [false] whether to rewrite browser history (do not create new entry)
     */
    MenuStore.prototype.activate = function (item, updateLocation, rewriteHistory) {
        if (updateLocation === void 0) { updateLocation = true; }
        if (rewriteHistory === void 0) { rewriteHistory = false; }
        if ((this.activeItem && this.activeItem.id) === (item && item.id)) {
            return;
        }
        if (item && item.type === 'group') {
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
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], MenuStore.prototype, "activeItemIdx", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["observable"]
    ], MenuStore.prototype, "sideBarOpened", void 0);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], MenuStore.prototype, "toggleSidebar", null);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], MenuStore.prototype, "closeSidebar", null);
    Object(external_tslib_["__decorate"])([
        external_mobx_["action"]
    ], MenuStore.prototype, "activate", null);
    Object(external_tslib_["__decorate"])([
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
            // adding 1 account rounding errors in case scrollYOffset is float-number
            this._scrollParent.scrollBy(0, -this.options.scrollYOffset() + 1);
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
    Object(external_tslib_["__decorate"])([
        external_decko_["bind"],
        Throttle(100)
    ], ScrollService.prototype, "handleScroll", null);
    return ScrollService;
}());


// CONCATENATED MODULE: ./src/services/SearchStore.ts


function getWorker() {
    var worker;
    if (IS_BROWSER) {
        try {
            // tslint:disable-next-line
            worker = __webpack_require__(77);
        }
        catch (e) {
            worker = __webpack_require__(34).default;
        }
    }
    else {
        worker = __webpack_require__(34).default;
    }
    return new worker();
}
var SearchStore_SearchStore = /** @class */ (function () {
    function SearchStore() {
        this.searchWorker = getWorker();
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
    SearchStore.prototype.dispose = function () {
        this.searchWorker.terminate();
    };
    SearchStore.prototype.search = function (q) {
        return this.searchWorker.search(q);
    };
    SearchStore.prototype.toJS = function () {
        return Object(external_tslib_["__awaiter"])(this, void 0, void 0, function () {
            return Object(external_tslib_["__generator"])(this, function (_a) {
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



var MiddlePanel = styled_components.div(panels_templateObject_2 || (panels_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: calc(100% - ", ");\n  padding: 0 ", "px;\n\n  ", ";\n"], ["\n  width: calc(100% - ", ");\n  padding: 0 ", "px;\n\n  ",
    ";\n"])), function (props) { return props.theme.rightPanel.width; }, function (props) { return props.theme.spacing.sectionHorizontal; }, function (_a) {
    var compact = _a.compact, theme = _a.theme;
    return media.lessThan('medium', true)(panels_templateObject_1 || (panels_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n    width: 100%;\n    padding: ", ";\n  "], ["\n    width: 100%;\n    padding: ", ";\n  "])), (compact ? 0 : theme.spacing.sectionVertical) + "px " + theme.spacing.sectionHorizontal + "px");
});
var Section = styled_components.div.attrs(function (props) {
    var _a;
    return (_a = {},
        _a[SECTION_ATTR] = props.id,
        _a);
})(templateObject_4 || (templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: ", "px 0;\n\n  &:last-child {\n    min-height: calc(100vh + 1px);\n  }\n\n  & > &:last-child {\n    min-height: initial;\n  }\n\n  ", "\n  ", "\n"], ["\n  padding: ", "px 0;\n\n  &:last-child {\n    min-height: calc(100vh + 1px);\n  }\n\n  & > &:last-child {\n    min-height: initial;\n  }\n\n  ",
    "\n  ",
    "\n"])), function (props) { return props.theme.spacing.sectionVertical; }, media.lessThan('medium', true)(panels_templateObject_3 || (panels_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n    padding: 0;\n  "], ["\n    padding: 0;\n  "]))), function (props) { return props.underlined && "\n    position: relative;\n\n    &:not(:last-of-type):after {\n      position: absolute;\n      bottom: 0;\n      width: 100%;\n      display: block;\n      content: '';\n      border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n    }\n  " || ''; });
var RightPanel = styled_components.div(templateObject_6 || (templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: ", ";\n  color: ", ";\n  background-color: ", ";\n  padding: 0 ", "px;\n\n  ", ";\n"], ["\n  width: ", ";\n  color: ",
    ";\n  background-color: ", ";\n  padding: 0 ", "px;\n\n  ",
    ";\n"])), function (props) { return props.theme.rightPanel.width; }, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (props) { return props.theme.rightPanel.backgroundColor; }, function (props) { return props.theme.spacing.sectionHorizontal; }, media.lessThan('medium', true)(templateObject_5 || (templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n    width: 100%;\n    padding: ", ";\n  "], ["\n    width: 100%;\n    padding: ", ";\n  "])), function (props) { return props.theme.spacing.sectionVertical + "px " + props.theme.spacing.sectionHorizontal + "px"; }));
var DarkRightPanel = styled_components(RightPanel)(templateObject_7 || (templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  background-color: ", ";\n"], ["\n  background-color: ", ";\n"])), function (props) { return props.theme.rightPanel.backgroundColor; });
var Row = styled_components.div(templateObject_9 || (templateObject_9 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: flex;\n  width: 100%;\n  padding: 0;\n\n  ", ";\n"], ["\n  display: flex;\n  width: 100%;\n  padding: 0;\n\n  ",
    ";\n"])), media.lessThan('medium', true)(templateObject_8 || (templateObject_8 = Object(external_tslib_["__makeTemplateObject"])(["\n    flex-direction: column;\n  "], ["\n    flex-direction: column;\n  "]))));
var panels_templateObject_1, panels_templateObject_2, panels_templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;

// CONCATENATED MODULE: ./src/common-elements/headers.ts


var headerFontSize = {
    1: '1.85714em',
    2: '1.57143em',
    3: '1.27em'
};
var headerCommonMixin = function (level) { return css(headers_templateObject_1 || (headers_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: ", ";\n  font-weight: ", ";\n  font-size: ", ";\n  line-height: ", ";\n"], ["\n  font-family: ",
    ";\n  font-weight: ",
    ";\n  font-size: ", ";\n  line-height: ",
    ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.typography.headings.fontFamily;
}, function (_a) {
    var theme = _a.theme;
    return theme.typography.headings.fontWeight;
}, headerFontSize[level], function (_a) {
    var theme = _a.theme;
    return theme.typography.headings.lineHeight;
}); };
var H1 = styled_components.h1(headers_templateObject_2 || (headers_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n  color: ", ";\n\n  ", ";\n"], ["\n  ", ";\n  color: ",
    ";\n\n  ", ";\n"])), headerCommonMixin(1), function (_a) {
    var theme = _a.theme;
    return theme.colors.primary.main;
}, extensionsHook('H1'));
var H2 = styled_components.h2(headers_templateObject_3 || (headers_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n  color: black;\n\n  ", ";\n"], ["\n  ", ";\n  color: black;\n\n  ", ";\n"])), headerCommonMixin(2), extensionsHook('H2'));
var H3 = styled_components.h2(headers_templateObject_4 || (headers_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n  color: black;\n\n  ", ";\n"], ["\n  ", ";\n  color: black;\n\n  ", ";\n"])), headerCommonMixin(3), extensionsHook('H3'));
var RightPanelHeader = styled_components.h3(headers_templateObject_5 || (headers_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n\n  ", ";\n"], ["\n  color: ",
    ";\n\n  ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, extensionsHook('RightPanelHeader'));
var UnderlinedHeader = styled_components.h5(headers_templateObject_6 || (headers_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-bottom: 1px solid rgba(38, 50, 56, 0.3);\n  margin: 1em 0 1em 0;\n  color: rgba(38, 50, 56, 0.5);\n  font-weight: normal;\n  text-transform: uppercase;\n  font-size: 0.929em;\n  line-height: 20px;\n\n  ", ";\n"], ["\n  border-bottom: 1px solid rgba(38, 50, 56, 0.3);\n  margin: 1em 0 1em 0;\n  color: rgba(38, 50, 56, 0.5);\n  font-weight: normal;\n  text-transform: uppercase;\n  font-size: 0.929em;\n  line-height: 20px;\n\n  ", ";\n"])), extensionsHook('UnderlinedHeader'));
var headers_templateObject_1, headers_templateObject_2, headers_templateObject_3, headers_templateObject_4, headers_templateObject_5, headers_templateObject_6;

// EXTERNAL MODULE: ./node_modules/memoize-one/dist/memoize-one.cjs.js
var memoize_one_cjs = __webpack_require__(39);

// CONCATENATED MODULE: ./src/components/StoreBuilder.ts

 // fixme: https://github.com/alexreardon/memoize-one/issues/37



var StoreBuilder_a = Object(external_react_["createContext"])(undefined), Provider = StoreBuilder_a.Provider, Consumer = StoreBuilder_a.Consumer;

var StoreBuilder_StoreBuilder = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(StoreBuilder, _super);
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
        return Object(external_tslib_["__awaiter"])(this, void 0, void 0, function () {
            var _a, specUrl, spec, resolvedSpec, e_1;
            return Object(external_tslib_["__generator"])(this, function (_b) {
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
    Object(external_tslib_["__decorate"])([
        memoize_one_cjs
    ], StoreBuilder.prototype, "makeStore", null);
    return StoreBuilder;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/common-elements/linkify.tsx




var StyledLink = styled_components.a(linkify_templateObject_1 || (linkify_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  text-decoration: none;\n"], ["\n  text-decoration: none;\n"]))); // tslint:disable-next-line
var linkifyMixin = function (className) { return css(linkify_templateObject_2 || (linkify_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", " {\n    cursor: pointer;\n    margin-left: -20px;\n    padding: 0;\n    line-height: 1;\n    width: 20px;\n    display: inline-block;\n  }\n  ", ":before {\n    content: '';\n    width: 15px;\n    height: 15px;\n    background-size: contain;\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');\n    opacity: 0.5;\n    visibility: hidden;\n    display: inline-block;\n    vertical-align: middle;\n  }\n\n  h1:hover > ", "::before, h2:hover > ", "::before, ", ":hover::before {\n    visibility: visible;\n  }\n"], ["\n  ", " {\n    cursor: pointer;\n    margin-left: -20px;\n    padding: 0;\n    line-height: 1;\n    width: 20px;\n    display: inline-block;\n  }\n  ", ":before {\n    content: '';\n    width: 15px;\n    height: 15px;\n    background-size: contain;\n    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');\n    opacity: 0.5;\n    visibility: hidden;\n    display: inline-block;\n    vertical-align: middle;\n  }\n\n  h1:hover > ", "::before, h2:hover > ", "::before, ", ":hover::before {\n    visibility: visible;\n  }\n"])), className, className, className, className, className); };
var isModifiedEvent = function (event) { return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey); };
var linkify_Link = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Link, _super);
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

var StyledShareLink = styled_components(linkify_Link)(linkify_templateObject_3 || (linkify_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n"], ["\n  ", ";\n"])), linkifyMixin('&'));
function ShareLink(props) {
    return external_react_["createElement"](StyledShareLink, { to: props.to });
}
var linkify_templateObject_1, linkify_templateObject_2, linkify_templateObject_3;

// CONCATENATED MODULE: ./src/common-elements/shelfs.tsx



var directionMap = {
    left: '90deg',
    right: '-90deg',
    up: '-180deg',
    down: '0'
};
var shelfs_IntShelfIcon = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(IntShelfIcon, _super);
    function IntShelfIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntShelfIcon.prototype.render = function () {
        return external_react_["createElement"]("svg", { className: this.props.className, style: this.props.style, version: "1.1", viewBox: "0 0 24 24", x: "0", xmlns: "http://www.w3.org/2000/svg", y: "0" },
            external_react_["createElement"]("polygon", { points: "17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 " }));
    };
    return IntShelfIcon;
}(external_react_["PureComponent"]));
var ShelfIcon = styled_components(shelfs_IntShelfIcon)(shelfs_templateObject_1 || (shelfs_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  height: ", ";\n  width: ", ";\n  vertical-align: middle;\n  float: ", ";\n  transition: transform 0.2s ease-out;\n  transform: rotateZ(", ");\n\n  polygon {\n    fill: ", ";\n  }\n"], ["\n  height: ", ";\n  width: ", ";\n  vertical-align: middle;\n  float: ", ";\n  transition: transform 0.2s ease-out;\n  transform: rotateZ(", ");\n\n  polygon {\n    fill: ", ";\n  }\n"])), function (props) { return props.size || '18px'; }, function (props) { return props.size || '18px'; }, function (props) { return props.float || ''; }, function (props) { return directionMap[props.direction || 'down']; }, function (props) { return props.color && props.theme.colors[props.color] && props.theme.colors[props.color].main || props.color; });
var Badge = styled_components.span(shelfs_templateObject_2 || (shelfs_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: inline-block;\n  padding: 0 5px;\n  margin: 0;\n  background-color: ", ";\n  color: ", ";\n  font-size: ", ";\n  vertical-align: text-top;\n"], ["\n  display: inline-block;\n  padding: 0 5px;\n  margin: 0;\n  background-color: ", ";\n  color: ", ";\n  font-size: ", ";\n  vertical-align: text-top;\n"])), function (props) { return props.theme.colors[props.type].main; }, function (props) { return props.theme.colors[props.type].contrastText; }, function (props) { return props.theme.typography.code.fontSize; });
var shelfs_templateObject_1, shelfs_templateObject_2;

// CONCATENATED MODULE: ./src/common-elements/mixins.ts


var deprecatedCss = css(mixins_templateObject_1 || (mixins_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  text-decoration: line-through;\n  color: #bdccd3;\n"], ["\n  text-decoration: line-through;\n  color: #bdccd3;\n"])));
var mixins_templateObject_1;

// CONCATENATED MODULE: ./src/common-elements/fields-layout.ts

// import { transparentize } from 'polished';


var PropertiesTableCaption = styled_components.caption(fields_layout_templateObject_1 || (fields_layout_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  text-align: right;\n  font-size: 0.9em;\n  font-weight: normal;\n  color: ", ";\n"], ["\n  text-align: right;\n  font-size: 0.9em;\n  font-weight: normal;\n  color: ", ";\n"])), function (props) { return props.theme.colors.text.secondary; });
var PropertyCell = styled_components.td(fields_layout_templateObject_2 || (fields_layout_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-left: 1px solid ", ";\n  box-sizing: border-box;\n  position: relative;\n  padding: 10px 10px 10px 0;\n\n  tr:first-of-type > &,\n  tr.last > & {\n    border-left-width: 0;\n    background-position: top left;\n    background-repeat: no-repeat;\n    background-size: 1px 100%;\n  }\n\n  tr:first-of-type > & {\n    background-image: linear-gradient(\n      to bottom,\n      transparent 0%,\n      transparent 22px,\n      ", " 22px,\n      ", " 100%\n    );\n  }\n\n  tr.last > & {\n    background-image: linear-gradient(\n      to bottom,\n      ", " 0%,\n      ", " 22px,\n      transparent 22px,\n      transparent 100%\n    );\n  }\n\n  tr.last + tr > & {\n    border-left-color: transparent;\n  }\n\n  tr.last:first-child > & {\n    background: none;\n    border-left-color: transparent;\n  }\n"], ["\n  border-left: 1px solid ", ";\n  box-sizing: border-box;\n  position: relative;\n  padding: 10px 10px 10px 0;\n\n  tr:first-of-type > &,\n  tr.last > & {\n    border-left-width: 0;\n    background-position: top left;\n    background-repeat: no-repeat;\n    background-size: 1px 100%;\n  }\n\n  tr:first-of-type > & {\n    background-image: linear-gradient(\n      to bottom,\n      transparent 0%,\n      transparent 22px,\n      ", " 22px,\n      ", " 100%\n    );\n  }\n\n  tr.last > & {\n    background-image: linear-gradient(\n      to bottom,\n      ", " 0%,\n      ", " 22px,\n      transparent 22px,\n      transparent 100%\n    );\n  }\n\n  tr.last + tr > & {\n    border-left-color: transparent;\n  }\n\n  tr.last:first-child > & {\n    background: none;\n    border-left-color: transparent;\n  }\n"])), function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; });
var PropertyCellWithInner = styled_components(PropertyCell)(fields_layout_templateObject_3 || (fields_layout_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 0;\n"], ["\n  padding: 0;\n"])));
var PropertyNameCell = styled_components(PropertyCell)(fields_layout_templateObject_4 || (fields_layout_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  vertical-align: top;\n  line-height: 20px;\n  white-space: nowrap;\n  font-size: 0.929em;\n  font-family: ", ";\n\n  &.deprecated {\n    ", ";\n  }\n\n  ", ";\n\n  ", ";\n"], ["\n  vertical-align: top;\n  line-height: 20px;\n  white-space: nowrap;\n  font-size: 0.929em;\n  font-family: ", ";\n\n  &.deprecated {\n    ", ";\n  }\n\n  ",
    ";\n\n  ", ";\n"])), function (props) { return props.theme.typography.code.fontFamily; }, deprecatedCss, function (_a) {
    var kind = _a.kind;
    return kind !== 'field' ? 'font-style: italic' : '';
}, extensionsHook('PropertyNameCell'));
var PropertyDetailsCell = styled_components.td(fields_layout_templateObject_5 || (fields_layout_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-bottom: 1px solid #9fb4be;\n  padding: 10px 0;\n  width: ", ";\n  box-sizing: border-box;\n\n  tr.expanded & {\n    border-bottom: none;\n  }\n"], ["\n  border-bottom: 1px solid #9fb4be;\n  padding: 10px 0;\n  width: ", ";\n  box-sizing: border-box;\n\n  tr.expanded & {\n    border-bottom: none;\n  }\n"])), function (props) { return props.theme.schema.defaultDetailsWidth; });
var PropertyBullet = styled_components.span(fields_layout_templateObject_6 || (fields_layout_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n  font-family: ", ";\n  margin-right: 10px;\n\n  &::before {\n    content: '';\n    display: inline-block;\n    vertical-align: middle;\n    width: 10px;\n    height: 1px;\n    background: ", ";\n  }\n\n  &::after {\n    content: '';\n    display: inline-block;\n    vertical-align: middle;\n    width: 1px;\n    background: ", ";\n    height: 7px;\n  }\n"], ["\n  color: ", ";\n  font-family: ", ";\n  margin-right: 10px;\n\n  &::before {\n    content: '';\n    display: inline-block;\n    vertical-align: middle;\n    width: 10px;\n    height: 1px;\n    background: ", ";\n  }\n\n  &::after {\n    content: '';\n    display: inline-block;\n    vertical-align: middle;\n    width: 1px;\n    background: ", ";\n    height: 7px;\n  }\n"])), function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.schema.linesColor; }, function (props) { return props.theme.schema.linesColor; });
var InnerPropertiesWrap = styled_components.div(fields_layout_templateObject_7 || (fields_layout_templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: ", ";\n"], ["\n  padding: ",
    ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.schema.nestingSpacing;
});
var PropertiesTable = styled_components.table(fields_layout_templateObject_8 || (fields_layout_templateObject_8 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-collapse: separate;\n  border-radius: 3px;\n  font-size: ", ";\n\n  border-spacing: 0;\n  width: 100%;\n\n  > tr {\n    vertical-align: middle;\n  }\n\n  &\n    ", ",\n    &\n    ", "\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", "\n    ", " {\n    margin: ", ";\n    margin-right: 0;\n    background: ", ";\n  }\n\n  &\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", " {\n    background: #ffffff;\n  }\n"], ["\n  border-collapse: separate;\n  border-radius: 3px;\n  font-size: ", ";\n\n  border-spacing: 0;\n  width: 100%;\n\n  > tr {\n    vertical-align: middle;\n  }\n\n  &\n    ", ",\n    &\n    ", "\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", "\n    ", " {\n    margin: ",
    ";\n    margin-right: 0;\n    background: ",
    ";\n  }\n\n  &\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", ",\n    &\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", " {\n    background: #ffffff;\n  }\n"])), function (props) { return props.theme.typography.fontSize; }, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestingSpacing;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestedBackground;
}, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap, InnerPropertiesWrap);
var fields_layout_templateObject_1, fields_layout_templateObject_2, fields_layout_templateObject_3, fields_layout_templateObject_4, fields_layout_templateObject_5, fields_layout_templateObject_6, fields_layout_templateObject_7, fields_layout_templateObject_8;

// CONCATENATED MODULE: ./src/common-elements/schema.ts


var OneOfList = styled_components.ul(schema_templateObject_1 || (schema_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin: 0 0 3px 0;\n  padding: 0;\n  list-style: none;\n  display: inline-block;\n"], ["\n  margin: 0 0 3px 0;\n  padding: 0;\n  list-style: none;\n  display: inline-block;\n"])));
var OneOfLabel = styled_components.span(schema_templateObject_2 || (schema_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: 0.9em;\n  margin-right: 10px;\n  color: ", ";\n  font-family: ", ";\n}\n"], ["\n  font-size: 0.9em;\n  margin-right: 10px;\n  color: ", ";\n  font-family: ", ";\n}\n"])), function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.typography.headings.fontFamily; });
var schema_OneOfButton = styled_components.li(schema_templateObject_3 || (schema_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: inline-block;\n  margin-right: 10px;\n  margin-bottom: 5px;\n  font-size: 0.8em;\n  cursor: pointer;\n  border: 1px solid ", ";\n  padding: 2px 10px;\n\n  ", "\n"], ["\n  display: inline-block;\n  margin-right: 10px;\n  margin-bottom: 5px;\n  font-size: 0.8em;\n  cursor: pointer;\n  border: 1px solid ", ";\n  padding: 2px 10px;\n\n  ",
    "\n"])), function (props) { return props.theme.colors.primary.main; }, function (props) {
    if (props.active) {
        return "\n      color: white;\n      background-color: " + props.theme.colors.primary.main + ";\n      ";
    }
    else {
        return "\n        color: " + props.theme.colors.primary.main + ";\n        background-color: white;\n      ";
    }
});
var ArrayOpenningLabel = styled_components.div(schema_templateObject_4 || (schema_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: 0.9em;\n  font-family: ", ";\n  &::after {\n    content: ' [';\n  }\n"], ["\n  font-size: 0.9em;\n  font-family: ", ";\n  &::after {\n    content: ' [';\n  }\n"])), function (props) { return props.theme.typography.code.fontFamily; });
var ArrayClosingLabel = styled_components.div(schema_templateObject_5 || (schema_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: 0.9em;\n  font-family: ", ";\n  &::after {\n    content: ']';\n  }\n"], ["\n  font-size: 0.9em;\n  font-family: ", ";\n  &::after {\n    content: ']';\n  }\n"])), function (props) { return props.theme.typography.code.fontFamily; });
var schema_templateObject_1, schema_templateObject_2, schema_templateObject_3, schema_templateObject_4, schema_templateObject_5;

// EXTERNAL MODULE: external "react-dropdown"
var external_react_dropdown_ = __webpack_require__(40);
var external_react_dropdown_default = /*#__PURE__*/__webpack_require__.n(external_react_dropdown_);

// CONCATENATED MODULE: ./src/common-elements/dropdown.ts



var StyledDropdown = styled_components(external_react_dropdown_default.a)(dropdown_templateObject_1 || (dropdown_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  min-width: 100px;\n  display: inline-block;\n  position: relative;\n  width: auto;\n  font-family: ", ";\n\n  .Dropdown-control {\n    font-family: ", ";\n    position: relative;\n    font-size: 0.929em;\n    width: 100%;\n    line-height: 1.5em;\n    vertical-align: middle;\n    cursor: pointer;\n    border-color: rgba(38, 50, 56, 0.5);\n    color: #263238;\n    outline: none;\n    padding: 0.15em 1.5em 0.2em 0.5em;\n    border-radius: 2px;\n    border-width: 1px;\n    border-style: solid;\n    margin-top: 5px;\n    background: white;\n\n    box-sizing: border-box;\n\n    &:hover {\n      border-color: ", ";\n      color: ", ";\n      box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12);\n    }\n  }\n\n  .Dropdown-arrow {\n    border-color: ", " transparent transparent;\n    border-style: solid;\n    border-width: 0.35em 0.35em 0;\n    content: ' ';\n    display: block;\n    height: 0;\n    position: absolute;\n    right: 0.3em;\n    top: 50%;\n    margin-top: -0.125em;\n    width: 0;\n  }\n\n  .Dropdown-menu {\n    position: absolute;\n    margin-top: 2px;\n    left: 0;\n    right: 0;\n\n    z-index: 10;\n    min-width: 100px;\n\n    background: white;\n    border: 1px solid rgba(38, 50, 56, 0.2);\n    box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12), 0px 2px 10px 0px rgba(34, 36, 38, 0.08);\n\n    max-height: 220px;\n    overflow: auto;\n  }\n\n  .Dropdown-option {\n    font-size: 0.9em;\n    color: #263238;\n    cursor: pointer;\n    padding: 0.4em;\n\n    &.is-selected {\n      background-color: rgba(0, 0, 0, 0.05);\n    }\n\n    &:hover {\n      background-color: rgba(38, 50, 56, 0.12);\n    }\n  }\n"], ["\n  min-width: 100px;\n  display: inline-block;\n  position: relative;\n  width: auto;\n  font-family: ", ";\n\n  .Dropdown-control {\n    font-family: ", ";\n    position: relative;\n    font-size: 0.929em;\n    width: 100%;\n    line-height: 1.5em;\n    vertical-align: middle;\n    cursor: pointer;\n    border-color: rgba(38, 50, 56, 0.5);\n    color: #263238;\n    outline: none;\n    padding: 0.15em 1.5em 0.2em 0.5em;\n    border-radius: 2px;\n    border-width: 1px;\n    border-style: solid;\n    margin-top: 5px;\n    background: white;\n\n    box-sizing: border-box;\n\n    &:hover {\n      border-color: ", ";\n      color: ", ";\n      box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12);\n    }\n  }\n\n  .Dropdown-arrow {\n    border-color: ", " transparent transparent;\n    border-style: solid;\n    border-width: 0.35em 0.35em 0;\n    content: ' ';\n    display: block;\n    height: 0;\n    position: absolute;\n    right: 0.3em;\n    top: 50%;\n    margin-top: -0.125em;\n    width: 0;\n  }\n\n  .Dropdown-menu {\n    position: absolute;\n    margin-top: 2px;\n    left: 0;\n    right: 0;\n\n    z-index: 10;\n    min-width: 100px;\n\n    background: white;\n    border: 1px solid rgba(38, 50, 56, 0.2);\n    box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12), 0px 2px 10px 0px rgba(34, 36, 38, 0.08);\n\n    max-height: 220px;\n    overflow: auto;\n  }\n\n  .Dropdown-option {\n    font-size: 0.9em;\n    color: #263238;\n    cursor: pointer;\n    padding: 0.4em;\n\n    &.is-selected {\n      background-color: rgba(0, 0, 0, 0.05);\n    }\n\n    &:hover {\n      background-color: rgba(38, 50, 56, 0.12);\n    }\n  }\n"])), function (props) { return props.theme.typography.headings.fontFamily; }, function (props) { return props.theme.typography.headings.fontFamily; }, function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; });
var SimpleDropdown = styled_components(StyledDropdown)(dropdown_templateObject_2 || (dropdown_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.969em;\n\n  .Dropdown-control {\n    font-size: 1em;\n    border: none;\n    padding: 0 1.2em 0 0;\n    background: transparent;\n\n    &:hover {\n      color: ", ";\n      box-shadow: none;\n    }\n  }\n"], ["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.969em;\n\n  .Dropdown-control {\n    font-size: 1em;\n    border: none;\n    padding: 0 1.2em 0 0;\n    background: transparent;\n\n    &:hover {\n      color: ", ";\n      box-shadow: none;\n    }\n  }\n"])), function (props) { return props.theme.colors.primary.main; });
var MimeLabel = styled_components.span(dropdown_templateObject_3 || (dropdown_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.929em;\n  color: black;\n"], ["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.929em;\n  color: black;\n"])));
var dropdown_templateObject_1, dropdown_templateObject_2, dropdown_templateObject_3;

// EXTERNAL MODULE: external "react-tabs"
var external_react_tabs_ = __webpack_require__(9);

// CONCATENATED MODULE: ./src/common-elements/tabs.ts





var Tabs = styled_components(external_react_tabs_["Tabs"])(tabs_templateObject_1 || (tabs_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  > ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    margin: 0 -5px;\n\n    > li {\n      padding: 5px 10px;\n      display: inline-block;\n\n      background-color: ", ";\n      border-bottom: 1px solid rgba(0, 0, 0, 0.5);\n      cursor: pointer;\n      text-align: center;\n      outline: none;\n      color: ", ";\n      margin: 0\n        ", ";\n      border: 1px solid ", ";\n      border-radius: 5px;\n      min-width: 60px;\n      font-size: 0.9em;\n      font-weight: bold;\n\n      &.react-tabs__tab--selected {\n        color: ", ";\n        background: ", ";\n      }\n\n      &:only-child {\n        flex: none;\n        min-width: 100px;\n      }\n\n      &.tab-success {\n        color: ", ";\n      }\n\n      &.tab-redirect {\n        color: ", ";\n      }\n\n      &.tab-info {\n        color: ", ";\n      }\n\n      &.tab-error {\n        color: ", ";\n      }\n    }\n  }\n  > .react-tabs__tab-panel {\n    background: ", ";\n    & > div,\n    & > pre {\n      padding: ", "px;\n      margin: 0;\n    }\n\n    & > div > pre {\n      padding: 0;\n    }\n  }\n"], ["\n  > ul {\n    list-style: none;\n    padding: 0;\n    margin: 0;\n    margin: 0 -5px;\n\n    > li {\n      padding: 5px 10px;\n      display: inline-block;\n\n      background-color: ",
    ";\n      border-bottom: 1px solid rgba(0, 0, 0, 0.5);\n      cursor: pointer;\n      text-align: center;\n      outline: none;\n      color: ",
    ";\n      margin: 0\n        ",
    ";\n      border: 1px solid ",
    ";\n      border-radius: 5px;\n      min-width: 60px;\n      font-size: 0.9em;\n      font-weight: bold;\n\n      &.react-tabs__tab--selected {\n        color: ", ";\n        background: ",
    ";\n      }\n\n      &:only-child {\n        flex: none;\n        min-width: 100px;\n      }\n\n      &.tab-success {\n        color: ", ";\n      }\n\n      &.tab-redirect {\n        color: ", ";\n      }\n\n      &.tab-info {\n        color: ", ";\n      }\n\n      &.tab-error {\n        color: ", ";\n      }\n    }\n  }\n  > .react-tabs__tab-panel {\n    background: ",
    ";\n    & > div,\n    & > pre {\n      padding: ", "px;\n      margin: 0;\n    }\n\n    & > div > pre {\n      padding: 0;\n    }\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.codeSample.backgroundColor;
}, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(theme.colors.tonalOffset, theme.rightPanel.textColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit + "px " + theme.spacing.unit + "px " + theme.spacing.unit + "px";
}, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.05, theme.codeSample.backgroundColor);
}, function (props) { return props.theme.colors.text.primary; }, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (props) { return props.theme.colors.responses.success.color; }, function (props) { return props.theme.colors.responses.redirect.color; }, function (props) { return props.theme.colors.responses.info.color; }, function (props) { return props.theme.colors.responses.error.color; }, function (_a) {
    var theme = _a.theme;
    return theme.codeSample.backgroundColor;
}, function (props) { return props.theme.spacing.unit * 4; });
var SmallTabs = styled_components(Tabs)(tabs_templateObject_2 || (tabs_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  > ul {\n    display: block;\n    > li {\n      padding: 2px 5px;\n      min-width: auto;\n      margin: 0 15px 0 0;\n      font-size: 13px;\n      font-weight: normal;\n      border-bottom: 1px dashed;\n      color: ", ";\n      border-radius: 0;\n      background: none;\n\n      &:last-child {\n        margin-right: 0;\n      }\n\n      &.react-tabs__tab--selected {\n        color: ", ";\n        background: none;\n      }\n    }\n  }\n  > .react-tabs__tab-panel {\n    & > div,\n    & > pre {\n      padding: ", "px 0;\n    }\n  }\n"], ["\n  > ul {\n    display: block;\n    > li {\n      padding: 2px 5px;\n      min-width: auto;\n      margin: 0 15px 0 0;\n      font-size: 13px;\n      font-weight: normal;\n      border-bottom: 1px dashed;\n      color: ",
    ";\n      border-radius: 0;\n      background: none;\n\n      &:last-child {\n        margin-right: 0;\n      }\n\n      &.react-tabs__tab--selected {\n        color: ",
    ";\n        background: none;\n      }\n    }\n  }\n  > .react-tabs__tab-panel {\n    & > div,\n    & > pre {\n      padding: ", "px 0;\n    }\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(theme.colors.tonalOffset, theme.rightPanel.textColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (props) { return props.theme.spacing.unit * 2; });
var tabs_templateObject_1, tabs_templateObject_2;

// CONCATENATED MODULE: ./src/common-elements/PrismDiv.tsx


var PrismDiv = styled_components.div(PrismDiv_templateObject_1 || (PrismDiv_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  /**\n  * Based on prism-dark.css\n  */\n\n  code[class*='language-'],\n  pre[class*='language-'] {\n    /* color: white;\n    background: none; */\n    text-shadow: 0 -0.1em 0.2em black;\n    text-align: left;\n    white-space: pre;\n    word-spacing: normal;\n    word-break: normal;\n    word-wrap: normal;\n    line-height: 1.5;\n\n    -moz-tab-size: 4;\n    -o-tab-size: 4;\n    tab-size: 4;\n\n    -webkit-hyphens: none;\n    -moz-hyphens: none;\n    -ms-hyphens: none;\n    hyphens: none;\n  }\n\n  @media print {\n    code[class*='language-'],\n    pre[class*='language-'] {\n      text-shadow: none;\n    }\n  }\n\n  /* Code blocks */\n  pre[class*='language-'] {\n    padding: 1em;\n    margin: 0.5em 0;\n    overflow: auto;\n  }\n\n  .token.comment,\n  .token.prolog,\n  .token.doctype,\n  .token.cdata {\n    color: hsl(30, 20%, 50%);\n  }\n\n  .token.punctuation {\n    opacity: 0.7;\n  }\n\n  .namespace {\n    opacity: 0.7;\n  }\n\n  .token.property,\n  .token.tag,\n  .token.number,\n  .token.constant,\n  .token.symbol {\n    color: #4a8bb3;\n  }\n\n  .token.boolean {\n    color: firebrick;\n  }\n\n  .token.selector,\n  .token.attr-name,\n  .token.string,\n  .token.char,\n  .token.builtin,\n  .token.inserted {\n    color: #a0fbaa;\n    & + a,\n    & + a:visited {\n      color: #4ed2ba;\n      text-decoration: underline;\n    }\n  }\n\n  /* .property.token.string {\n    color: white;\n  } */\n\n  .token.operator,\n  .token.entity,\n  .token.url,\n  .token.variable {\n    color: hsl(40, 90%, 60%);\n  }\n\n  .token.atrule,\n  .token.attr-value,\n  .token.keyword {\n    color: hsl(350, 40%, 70%);\n  }\n\n  .token.regex,\n  .token.important {\n    color: #e90;\n  }\n\n  .token.important,\n  .token.bold {\n    font-weight: bold;\n  }\n  .token.italic {\n    font-style: italic;\n  }\n\n  .token.entity {\n    cursor: help;\n  }\n\n  .token.deleted {\n    color: red;\n  }\n\n  ", ";\n"], ["\n  /**\n  * Based on prism-dark.css\n  */\n\n  code[class*='language-'],\n  pre[class*='language-'] {\n    /* color: white;\n    background: none; */\n    text-shadow: 0 -0.1em 0.2em black;\n    text-align: left;\n    white-space: pre;\n    word-spacing: normal;\n    word-break: normal;\n    word-wrap: normal;\n    line-height: 1.5;\n\n    -moz-tab-size: 4;\n    -o-tab-size: 4;\n    tab-size: 4;\n\n    -webkit-hyphens: none;\n    -moz-hyphens: none;\n    -ms-hyphens: none;\n    hyphens: none;\n  }\n\n  @media print {\n    code[class*='language-'],\n    pre[class*='language-'] {\n      text-shadow: none;\n    }\n  }\n\n  /* Code blocks */\n  pre[class*='language-'] {\n    padding: 1em;\n    margin: 0.5em 0;\n    overflow: auto;\n  }\n\n  .token.comment,\n  .token.prolog,\n  .token.doctype,\n  .token.cdata {\n    color: hsl(30, 20%, 50%);\n  }\n\n  .token.punctuation {\n    opacity: 0.7;\n  }\n\n  .namespace {\n    opacity: 0.7;\n  }\n\n  .token.property,\n  .token.tag,\n  .token.number,\n  .token.constant,\n  .token.symbol {\n    color: #4a8bb3;\n  }\n\n  .token.boolean {\n    color: firebrick;\n  }\n\n  .token.selector,\n  .token.attr-name,\n  .token.string,\n  .token.char,\n  .token.builtin,\n  .token.inserted {\n    color: #a0fbaa;\n    & + a,\n    & + a:visited {\n      color: #4ed2ba;\n      text-decoration: underline;\n    }\n  }\n\n  /* .property.token.string {\n    color: white;\n  } */\n\n  .token.operator,\n  .token.entity,\n  .token.url,\n  .token.variable {\n    color: hsl(40, 90%, 60%);\n  }\n\n  .token.atrule,\n  .token.attr-value,\n  .token.keyword {\n    color: hsl(350, 40%, 70%);\n  }\n\n  .token.regex,\n  .token.important {\n    color: #e90;\n  }\n\n  .token.important,\n  .token.bold {\n    font-weight: bold;\n  }\n  .token.italic {\n    font-style: italic;\n  }\n\n  .token.entity {\n    cursor: help;\n  }\n\n  .token.deleted {\n    color: red;\n  }\n\n  ", ";\n"])), extensionsHook('Prism'));
var PrismDiv_templateObject_1;

// CONCATENATED MODULE: ./src/common-elements/samples.tsx



var SampleControls = styled_components.div(samples_templateObject_1 || (samples_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  opacity: 0.4;\n  transition: opacity 0.3s ease;\n  text-align: right;\n\n  > span {\n    display: inline-block;\n    padding: 2px 10px;\n    cursor: pointer;\n\n    :hover {\n      background: rgba(255, 255, 255, 0.1);\n    }\n  }\n"], ["\n  opacity: 0.4;\n  transition: opacity 0.3s ease;\n  text-align: right;\n\n  > span {\n    display: inline-block;\n    padding: 2px 10px;\n    cursor: pointer;\n\n    :hover {\n      background: rgba(255, 255, 255, 0.1);\n    }\n  }\n"])));
var SampleControlsWrap = styled_components.div(samples_templateObject_2 || (samples_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  &:hover ", " {\n    opacity: 1;\n  }\n"], ["\n  &:hover ", " {\n    opacity: 1;\n  }\n"])), SampleControls);
var StyledPre = styled_components(PrismDiv.withComponent('pre'))(samples_templateObject_3 || (samples_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: ", ";\n  font-size: ", ";\n  overflow-x: auto;\n  margin: 0;\n\n  white-space: ", ";\n"], ["\n  font-family: ", ";\n  font-size: ", ";\n  overflow-x: auto;\n  margin: 0;\n\n  white-space: ",
    ";\n"])), function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
});
var samples_templateObject_1, samples_templateObject_2, samples_templateObject_3;

// EXTERNAL MODULE: external "perfect-scrollbar"
var external_perfect_scrollbar_ = __webpack_require__(25);
var external_perfect_scrollbar_default = /*#__PURE__*/__webpack_require__.n(external_perfect_scrollbar_);

// EXTERNAL MODULE: ./node_modules/perfect-scrollbar/css/perfect-scrollbar.css
var perfect_scrollbar = __webpack_require__(26);
var perfect_scrollbar_default = /*#__PURE__*/__webpack_require__.n(perfect_scrollbar);

// CONCATENATED MODULE: ./src/components/OptionsProvider.ts


var OptionsContext = external_react_["createContext"](new RedocNormalizedOptions_RedocNormalizedOptions({}));
var OptionsProvider = OptionsContext.Provider;
var OptionsConsumer = OptionsContext.Consumer;

// CONCATENATED MODULE: ./src/common-elements/perfect-scrollbar.tsx






/*
 * perfect scrollbar umd bundle uses exports assignment while module uses default export
 * so when bundled with webpack default export works but with jest it crashes
 * That's why the following ugly fix is required
 */
var PerfectScrollbarConstructor = external_perfect_scrollbar_default.a || external_perfect_scrollbar_;
var PSStyling = createGlobalStyle(perfect_scrollbar_templateObject_1 || (perfect_scrollbar_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["", ""], ["", ""])), perfect_scrollbar_default.a && perfect_scrollbar_default.a.toString());
var StyledScrollWrapper = styled_components.div(perfect_scrollbar_templateObject_2 || (perfect_scrollbar_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var perfect_scrollbar_PerfectScrollbar = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(PerfectScrollbar, _super);
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
    return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return !options.nativeScrollbars ? external_react_["createElement"](perfect_scrollbar_PerfectScrollbar, Object(external_tslib_["__assign"])({}, props), props.children) : external_react_["createElement"]("div", { style: {
            overflow: 'auto',
            msOverflowStyle: '-ms-autohiding-scrollbar'
        } }, props.children); });
}
var perfect_scrollbar_templateObject_1, perfect_scrollbar_templateObject_2;

// CONCATENATED MODULE: ./src/common-elements/index.ts












// CONCATENATED MODULE: ./src/components/DropdownOrLabel/DropdownOrLabel.tsx



function DropdownOrLabel(props) {
    var _a = props.Label, Label = _a === void 0 ? MimeLabel : _a, _b = props.Dropdown, Dropdown = _b === void 0 ? SimpleDropdown : _b;
    if (props.options.length === 1) {
        return external_react_["createElement"](Label, null, props.options[0].label);
    }
    return external_react_["createElement"](Dropdown, Object(external_tslib_["__assign"])({}, props));
}

// EXTERNAL MODULE: external "dompurify"
var external_dompurify_ = __webpack_require__(41);

// CONCATENATED MODULE: ./src/components/Markdown/styled.elements.tsx




var linksCss = css(styled_elements_templateObject_1 || (styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  a {\n    text-decoration: none;\n    color: ", ";\n\n    &:visited {\n      color: ", ";\n    }\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"], ["\n  a {\n    text-decoration: none;\n    color: ", ";\n\n    &:visited {\n      color: ", ";\n    }\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"])), function (props) { return props.theme.typography.links.color; }, function (props) { return props.theme.typography.links.visited; }, function (props) { return props.theme.typography.links.hover; });
var StyledMarkdownBlock = styled_components(PrismDiv)(styled_elements_templateObject_2 || (styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n\n  font-family: ", ";\n  font-weight: ", ";\n  line-height: ", ";\n\n  p {\n    &:last-child {\n      margin-bottom: 0;\n    }\n  }\n\n  ", "\n\n  ", "\n\n  h1 {\n    ", ";\n    color: ", ";\n    margin-top: 0;\n  }\n\n  h2 {\n    ", ";\n    color: ", ";\n  }\n\n  code {\n    color: ", ";\n    background-color: ", ";\n\n    font-family: ", ";\n    border-radius: 2px;\n    border: 1px solid rgba(38, 50, 56, 0.1);\n    padding: 0 ", "px;\n    font-size: ", ";\n    font-weight: ", ";\n\n    word-break: break-word;\n  }\n\n  pre {\n    font-family: ", ";\n    white-space:", ";\n    background-color: #263238;\n    color: white;\n    padding: ", "px;\n    overflow-x: auto;\n    line-height: normal;\n    border-radius: 0px\n    border: 1px solid rgba(38, 50, 56, 0.1);\n\n    code {\n      background-color: transparent;\n      color: white;\n      padding: 0;\n\n      &:before,\n      &:after {\n        content: none;\n      }\n    }\n  }\n\n  blockquote {\n    margin: 0;\n    margin-bottom: 1em;\n    padding: 0 15px;\n    color: #777;\n    border-left: 4px solid #ddd;\n  }\n\n  img {\n    max-width: 100%;\n    box-sizing: content-box;\n  }\n\n  ul,\n  ol {\n    padding-left: 2em;\n    margin: 0;\n    margin-bottom: 1em;\n\n    ul, ol {\n      margin-bottom: 0;\n      margin-top: 0;\n    }\n  }\n\n  table {\n    display: block;\n    width: 100%;\n    overflow: auto;\n    word-break: normal;\n    word-break: keep-all;\n    border-collapse: collapse;\n    border-spacing: 0;\n    margin-top: 1.5em;\n    margin-bottom: 1.5em;\n  }\n\n  table tr {\n    background-color: #fff;\n    border-top: 1px solid #ccc;\n\n    &:nth-child(2n) {\n      background-color: ", ";\n    }\n  }\n\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #ddd;\n  }\n\n  table th {\n    text-align: left;\n    font-weight: bold;\n  }\n\n  ", ";\n\n  ", "\n\n  ", ";\n"], ["\n\n  font-family: ", ";\n  font-weight: ", ";\n  line-height: ", ";\n\n  p {\n    &:last-child {\n      margin-bottom: 0;\n    }\n  }\n\n  ",
    "\n\n  ",
    "\n\n  h1 {\n    ", ";\n    color: ", ";\n    margin-top: 0;\n  }\n\n  h2 {\n    ", ";\n    color: ", ";\n  }\n\n  code {\n    color: ",
    ";\n    background-color: ",
    ";\n\n    font-family: ", ";\n    border-radius: 2px;\n    border: 1px solid rgba(38, 50, 56, 0.1);\n    padding: 0 ",
    "px;\n    font-size: ", ";\n    font-weight: ",
    ";\n\n    word-break: break-word;\n  }\n\n  pre {\n    font-family: ", ";\n    white-space:",
    ";\n    background-color: #263238;\n    color: white;\n    padding: ", "px;\n    overflow-x: auto;\n    line-height: normal;\n    border-radius: 0px\n    border: 1px solid rgba(38, 50, 56, 0.1);\n\n    code {\n      background-color: transparent;\n      color: white;\n      padding: 0;\n\n      &:before,\n      &:after {\n        content: none;\n      }\n    }\n  }\n\n  blockquote {\n    margin: 0;\n    margin-bottom: 1em;\n    padding: 0 15px;\n    color: #777;\n    border-left: 4px solid #ddd;\n  }\n\n  img {\n    max-width: 100%;\n    box-sizing: content-box;\n  }\n\n  ul,\n  ol {\n    padding-left: 2em;\n    margin: 0;\n    margin-bottom: 1em;\n\n    ul, ol {\n      margin-bottom: 0;\n      margin-top: 0;\n    }\n  }\n\n  table {\n    display: block;\n    width: 100%;\n    overflow: auto;\n    word-break: normal;\n    word-break: keep-all;\n    border-collapse: collapse;\n    border-spacing: 0;\n    margin-top: 1.5em;\n    margin-bottom: 1.5em;\n  }\n\n  table tr {\n    background-color: #fff;\n    border-top: 1px solid #ccc;\n\n    &:nth-child(2n) {\n      background-color: ",
    ";\n    }\n  }\n\n  table th,\n  table td {\n    padding: 6px 13px;\n    border: 1px solid #ddd;\n  }\n\n  table th {\n    text-align: left;\n    font-weight: bold;\n  }\n\n  ", ";\n\n  ", "\n\n  ", ";\n"])), function (props) { return props.theme.typography.fontFamily; }, function (props) { return props.theme.typography.fontWeightRegular; }, function (props) { return props.theme.typography.lineHeight; }, function (_a) {
    var compact = _a.compact;
    return compact && "\n    p:first-child {\n      margin-top: 0;\n    }\n    p:last-child {\n      margin-bottom: 0;\n    }\n  ";
}, function (_a) {
    var inline = _a.inline;
    return inline && " p {\n    display: inline-block;\n  }";
}, headerCommonMixin(1), function (props) { return props.theme.colors.primary.main; }, headerCommonMixin(2), function (props) { return props.theme.colors.text.primary; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.color;
}, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.backgroundColor;
}, function (props) { return props.theme.typography.code.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit;
}, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.fontWeight;
}, function (props) { return props.theme.typography.code.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
}, function (props) { return props.theme.spacing.unit * 4; }, function (_a) {
    var theme = _a.theme;
    return theme.schema.nestedBackground;
}, linkifyMixin('.share-link'), linksCss, extensionsHook('Markdown'));
var styled_elements_templateObject_1, styled_elements_templateObject_2;

// CONCATENATED MODULE: ./src/components/Markdown/SanitizedMdBlock.tsx





var StyledMarkdownSpan = StyledMarkdownBlock.withComponent('span');
var sanitize = function (untrustedSpec, html) { return untrustedSpec ? external_dompurify_["sanitize"](html) : html; };
function SanitizedMarkdownHTML(props) {
    var Wrap = props.inline ? StyledMarkdownSpan : StyledMarkdownBlock;
    return external_react_["createElement"](OptionsConsumer, null, function (options) { return external_react_["createElement"](Wrap, Object(external_tslib_["__assign"])({ className: 'redoc-markdown ' + (props.className || ''), dangerouslySetInnerHTML: {
            __html: sanitize(options.untrustedSpec, props.html)
        }, "data-role": props['data-role'] }, props)); });
}

// CONCATENATED MODULE: ./src/components/Markdown/Markdown.tsx




var Markdown_Markdown = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Markdown, _super);
    function Markdown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Markdown.prototype.render = function () {
        var _a = this.props, source = _a.source, inline = _a.inline, compact = _a.compact, className = _a.className, dataRole = _a["data-role"];
        var renderer = new MarkdownRenderer_MarkdownRenderer();
        return external_react_["createElement"](SanitizedMarkdownHTML, { html: renderer.renderMd(source), inline: inline, compact: compact, className: className, "data-role": dataRole });
    };
    return Markdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/common-elements/Tooltip.tsx



var Tooltip_Wrapper = styled_components.div(Tooltip_templateObject_1 || (Tooltip_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var Tip = styled_components.div(Tooltip_templateObject_2 || (Tooltip_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  min-width: 80px;\n  max-width: 500px;\n  background: #fff;\n  bottom: 100%;\n  left: 50%;\n  margin-bottom: 10px;\n  transform: translateX(-50%);\n\n  border-radius: 4px;\n  padding: 0.3em 0.6em;\n  text-align: center;\n  box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);\n"], ["\n  position: absolute;\n  min-width: 80px;\n  max-width: 500px;\n  background: #fff;\n  bottom: 100%;\n  left: 50%;\n  margin-bottom: 10px;\n  transform: translateX(-50%);\n\n  border-radius: 4px;\n  padding: 0.3em 0.6em;\n  text-align: center;\n  box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);\n"])));
var Content = styled_components.div(Tooltip_templateObject_3 || (Tooltip_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  background: #fff;\n  color: #000;\n  display: inline;\n  font-size: 0.85em;\n  white-space: nowrap;\n"], ["\n  background: #fff;\n  color: #000;\n  display: inline;\n  font-size: 0.85em;\n  white-space: nowrap;\n"])));
var Arrow = styled_components.div(Tooltip_templateObject_4 || (Tooltip_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  width: 0;\n  height: 0;\n  bottom: -5px;\n  left: 50%;\n  margin-left: -5px;\n  border-left: solid transparent 5px;\n  border-right: solid transparent 5px;\n  border-top: solid #fff 5px;\n"], ["\n  position: absolute;\n  width: 0;\n  height: 0;\n  bottom: -5px;\n  left: 50%;\n  margin-left: -5px;\n  border-left: solid transparent 5px;\n  border-right: solid transparent 5px;\n  border-top: solid #fff 5px;\n"])));
var Gap = styled_components.div(Tooltip_templateObject_5 || (Tooltip_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  bottom: -20px;\n"], ["\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  bottom: -20px;\n"])));
var Tooltip_Tooltip = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Tooltip, _super);
    function Tooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tooltip.prototype.render = function () {
        var _a = this.props, open = _a.open, title = _a.title, children = _a.children;
        return external_react_["createElement"](Tooltip_Wrapper, null,
            children,
            open && external_react_["createElement"](Tip, null,
                external_react_["createElement"](Content, null, title),
                external_react_["createElement"](Arrow, null),
                external_react_["createElement"](Gap, null)));
    };
    return Tooltip;
}(external_react_["Component"]));

var Tooltip_templateObject_1, Tooltip_templateObject_2, Tooltip_templateObject_3, Tooltip_templateObject_4, Tooltip_templateObject_5;

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
            var selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
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


// CONCATENATED MODULE: ./src/common-elements/CopyButtonWrapper.tsx




var CopyButtonWrapper_CopyButtonWrapper = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(CopyButtonWrapper, _super);
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
function jsonToHTML(json, maxExpandLevel) {
    jsonToHtml_level = 1;
    var output = '';
    output += '<div class="redoc-json">';
    output += '<code>';
    output += valueToHTML(json, maxExpandLevel);
    output += '</code>';
    output += '</div>';
    return output;
}
function htmlEncode(t) {
    return t !== undefined ? t.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}
function stringifyStringLiteral(str) {
    return JSON.stringify(str).slice(1, -1);
}
function decorateWithSpan(value, className) {
    return '<span class="' + className + '">' + htmlEncode(value) + '</span>';
}
function punctuation(val) {
    return '<span class="token punctuation">' + val + '</span>';
}
function valueToHTML(value, maxExpandLevel) {
    var valueType = typeof value;
    var output = '';
    if (value === undefined || value === null) {
        output += decorateWithSpan('null', 'token keyword');
    }
    else if (value && value.constructor === Array) {
        jsonToHtml_level++;
        output += arrayToHTML(value, maxExpandLevel);
        jsonToHtml_level--;
    }
    else if (value && value.constructor === Date) {
        output += decorateWithSpan('"' + value.toISOString() + '"', 'token string');
    }
    else if (valueType === 'object') {
        jsonToHtml_level++;
        output += objectToHTML(value, maxExpandLevel);
        jsonToHtml_level--;
    }
    else if (valueType === 'number') {
        output += decorateWithSpan(value, 'token number');
    }
    else if (valueType === 'string') {
        if (/^(http|https):\/\/[^\s]+$/.test(value)) {
            output += decorateWithSpan('"', 'token string') + '<a href="' + value + '">' + htmlEncode(stringifyStringLiteral(value)) + '</a>' + decorateWithSpan('"', 'token string');
        }
        else {
            output += decorateWithSpan('"' + stringifyStringLiteral(value) + '"', 'token string');
        }
    }
    else if (valueType === 'boolean') {
        output += decorateWithSpan(value, 'token boolean');
    }
    return output;
}
function arrayToHTML(json, maxExpandLevel) {
    var collapsed = jsonToHtml_level > maxExpandLevel ? 'collapsed' : '';
    var output = "<div class=\"collapser\"></div>" + punctuation('[') + "<span class=\"ellipsis\"></span><ul class=\"array collapsible\">";
    var hasContents = false;
    var length = json.length;
    for (var i = 0; i < length; i++) {
        hasContents = true;
        output += '<li><div class="hoverable ' + collapsed + '">';
        output += valueToHTML(json[i], maxExpandLevel);
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
function objectToHTML(json, maxExpandLevel) {
    var collapsed = jsonToHtml_level > maxExpandLevel ? 'collapsed' : '';
    var keys = Object.keys(json);
    var length = keys.length;
    var output = "<div class=\"collapser\"></div>" + punctuation('{') + "<span class=\"ellipsis\"></span><ul class=\"obj collapsible\">";
    var hasContents = false;
    for (var i = 0; i < length; i++) {
        var key = keys[i];
        hasContents = true;
        output += '<li><div class="hoverable ' + collapsed + '">';
        output += '<span class="property token string">"' + htmlEncode(key) + '"</span>: ';
        output += valueToHTML(json[key], maxExpandLevel);
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


var jsonStyles = css(style_templateObject_1 || (style_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  .redoc-json > .collapser {\n    display: none;\n  }\n\n  font-family: ", ";\n  font-size: ", ";\n\n  white-space: ", ";\n  contain: content;\n  overflow-x: auto;\n\n  .callback-function {\n    color: gray;\n  }\n\n  .collapser:after {\n    content: '-';\n    cursor: pointer;\n  }\n\n  .collapsed > .collapser:after {\n    content: '+';\n    cursor: pointer;\n  }\n\n  .ellipsis:after {\n    content: ' \u2026 ';\n  }\n\n  .collapsible {\n    margin-left: 2em;\n  }\n\n  .hoverable {\n    padding-top: 1px;\n    padding-bottom: 1px;\n    padding-left: 2px;\n    padding-right: 2px;\n    border-radius: 2px;\n  }\n\n  .hovered {\n    background-color: rgba(235, 238, 249, 1);\n  }\n\n  .collapser {\n    padding-right: 6px;\n    padding-left: 6px;\n  }\n\n  ul {\n    list-style-type: none;\n    padding: 0px;\n    margin: 0px 0px 0px 26px;\n  }\n\n  li {\n    position: relative;\n    display: block;\n  }\n\n  .hoverable {\n    display: inline-block;\n  }\n\n  .selected {\n    outline-style: solid;\n    outline-width: 1px;\n    outline-style: dotted;\n  }\n\n  .collapsed > .collapsible {\n    display: none;\n  }\n\n  .ellipsis {\n    display: none;\n  }\n\n  .collapsed > .ellipsis {\n    display: inherit;\n  }\n\n  .collapser {\n    position: absolute;\n    top: 1px;\n    left: -1.5em;\n    cursor: default;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n"], ["\n  .redoc-json > .collapser {\n    display: none;\n  }\n\n  font-family: ", ";\n  font-size: ", ";\n\n  white-space: ",
    ";\n  contain: content;\n  overflow-x: auto;\n\n  .callback-function {\n    color: gray;\n  }\n\n  .collapser:after {\n    content: '-';\n    cursor: pointer;\n  }\n\n  .collapsed > .collapser:after {\n    content: '+';\n    cursor: pointer;\n  }\n\n  .ellipsis:after {\n    content: ' \u2026 ';\n  }\n\n  .collapsible {\n    margin-left: 2em;\n  }\n\n  .hoverable {\n    padding-top: 1px;\n    padding-bottom: 1px;\n    padding-left: 2px;\n    padding-right: 2px;\n    border-radius: 2px;\n  }\n\n  .hovered {\n    background-color: rgba(235, 238, 249, 1);\n  }\n\n  .collapser {\n    padding-right: 6px;\n    padding-left: 6px;\n  }\n\n  ul {\n    list-style-type: none;\n    padding: 0px;\n    margin: 0px 0px 0px 26px;\n  }\n\n  li {\n    position: relative;\n    display: block;\n  }\n\n  .hoverable {\n    display: inline-block;\n  }\n\n  .selected {\n    outline-style: solid;\n    outline-width: 1px;\n    outline-style: dotted;\n  }\n\n  .collapsed > .collapsible {\n    display: none;\n  }\n\n  .ellipsis {\n    display: none;\n  }\n\n  .collapsed > .ellipsis {\n    display: inherit;\n  }\n\n  .collapser {\n    position: absolute;\n    top: 1px;\n    left: -1.5em;\n    cursor: default;\n    user-select: none;\n    -webkit-user-select: none;\n  }\n"])), function (props) { return props.theme.typography.code.fontFamily; }, function (props) { return props.theme.typography.code.fontSize; }, function (_a) {
    var theme = _a.theme;
    return theme.typography.code.wrap ? 'pre-wrap' : 'pre';
});
var style_templateObject_1;

// CONCATENATED MODULE: ./src/components/JsonViewer/JsonViewer.tsx









var JsonViewerWrap = styled_components.div(JsonViewer_templateObject_1 || (JsonViewer_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  &:hover > ", " {\n    opacity: 1;\n  }\n"], ["\n  &:hover > ", " {\n    opacity: 1;\n  }\n"])), SampleControls);
var JsonViewer_Json = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Json, _super);
    function Json() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderInner = function (_a) {
            var renderCopyButton = _a.renderCopyButton;
            return external_react_["createElement"](JsonViewerWrap, null,
                external_react_["createElement"](SampleControls, null,
                    renderCopyButton(),
                    external_react_["createElement"]("span", { onClick: _this.expandAll }, " Expand all "),
                    external_react_["createElement"]("span", { onClick: _this.collapseAll }, " Collapse all ")),
                external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](PrismDiv, { className: _this.props.className, ref: function (node) { return _this.node = node; }, dangerouslySetInnerHTML: {
                        __html: jsonToHTML(_this.props.data, options.jsonSampleExpandLevel)
                    } }); }));
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
var JsonViewer = styled_components(JsonViewer_Json)(JsonViewer_templateObject_2 || (JsonViewer_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n"], ["\n  ", ";\n"])), jsonStyles);
var JsonViewer_templateObject_1, JsonViewer_templateObject_2;

// CONCATENATED MODULE: ./src/components/SourceCode/SourceCode.tsx





var SourceCode_SourceCode = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SourceCode, _super);
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
    Object(external_tslib_["__extends"])(SourceCodeWithCopy, _super);
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


// CONCATENATED MODULE: ./src/components/PayloadSamples/ExampleValue.tsx




function ExampleValue(_a) {
    var value = _a.value, mimeType = _a.mimeType;
    if (isJsonLike(mimeType)) {
        return external_react_["createElement"](JsonViewer, { data: value });
    }
    else {
        if (typeof value === 'object') {
            // just in case example was cached as json but used as non-json
            value = JSON.stringify(value, null, 2);
        }
        return external_react_["createElement"](SourceCode_SourceCodeWithCopy, { lang: langFromMime(mimeType), source: value });
    }
}

// CONCATENATED MODULE: ./src/components/PayloadSamples/exernalExampleHook.ts


function useExternalExample(example, mimeType) {
    var _this = this;
    var _a = Object(external_react_["useState"])(true), setIsLoading = _a[1]; // to trigger component reload
    var value = Object(external_react_["useRef"])(undefined);
    var prevRef = Object(external_react_["useRef"])(undefined);
    if (prevRef.current !== example) {
        value.current = undefined;
    }
    prevRef.current = example;
    Object(external_react_["useEffect"])(function () {
        var load = function () { return Object(external_tslib_["__awaiter"])(_this, void 0, void 0, function () {
            var _a, e_1;
            return Object(external_tslib_["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setIsLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = value;
                        return [4 /*yield*/, example.getExternalValue(mimeType)];
                    case 2:
                        _a.current = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        value.current = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        load();
    }, [example, mimeType]);
    return value.current;
}

// CONCATENATED MODULE: ./src/components/PayloadSamples/Example.tsx




function Example(_a) {
    var example = _a.example, mimeType = _a.mimeType;
    if (example.value === undefined && example.externalValueUrl) {
        return external_react_["createElement"](ExternalExample, { example: example, mimeType: mimeType });
    }
    else {
        return external_react_["createElement"](ExampleValue, { value: example.value, mimeType: mimeType });
    }
}
function ExternalExample(_a) {
    var example = _a.example, mimeType = _a.mimeType;
    var value = useExternalExample(example, mimeType);
    if (value === undefined) {
        return external_react_["createElement"]("span", null, "Loading...");
    }
    if (value instanceof Error) {
        return external_react_["createElement"](StyledPre, null,
            "Error loading external example: ",
            external_react_["createElement"]("br", null),
            external_react_["createElement"]("a", { className: 'token string', href: example.externalValueUrl, target: "_blank", rel: "noopener noreferrer" }, example.externalValueUrl));
    }
    return external_react_["createElement"](ExampleValue, { value: value, mimeType: mimeType });
}

// CONCATENATED MODULE: ./src/components/PayloadSamples/styled.elements.ts




var styled_elements_MimeLabel = styled_components.div(PayloadSamples_styled_elements_templateObject_1 || (PayloadSamples_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 12px;\n  background-color: ", ";\n  margin: 0 0 10px 0;\n  display: block;\n"], ["\n  padding: 12px;\n  background-color: ",
    ";\n  margin: 0 0 10px 0;\n  display: block;\n"])), function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["transparentize"])(0.6, theme.rightPanel.backgroundColor);
});
var DropdownLabel = styled_components.span(PayloadSamples_styled_elements_templateObject_2 || (PayloadSamples_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: ", ";\n  font-size: 12px;\n  position: absolute;\n  z-index: 1;\n  top: -11px;\n  left: 12px;\n  font-weight: ", ";\n  color: ", ";\n"], ["\n  font-family: ",
    ";\n  font-size: 12px;\n  position: absolute;\n  z-index: 1;\n  top: -11px;\n  left: 12px;\n  font-weight: ",
    ";\n  color: ",
    ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.typography.headings.fontFamily;
}, function (_a) {
    var theme = _a.theme;
    return theme.typography.fontWeightBold;
}, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["transparentize"])(0.6, theme.rightPanel.textColor);
});
var DropdownWrapper = styled_components.div(styled_elements_templateObject_3 || (styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var InvertedSimpleDropdown = styled_components(StyledDropdown)(styled_elements_templateObject_4 || (styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.929em;\n  margin: 0 0 10px 0;\n  display: block;\n  background-color: ", ";\n  .Dropdown-control {\n    margin-top: 0;\n  }\n  .Dropdown-control,\n  .Dropdown-control:hover {\n    font-size: 1em;\n    border: none;\n    padding: 0.9em 1.6em 0.9em 0.9em;\n    background: transparent;\n    color: ", ";\n    box-shadow: none;\n\n    .Dropdown-arrow {\n      border-top-color: ", ";\n    }\n  }\n  .Dropdown-menu {\n    margin: 0;\n    margin-top: 2px;\n  }\n"], ["\n  margin-left: 10px;\n  text-transform: none;\n  font-size: 0.929em;\n  margin: 0 0 10px 0;\n  display: block;\n  background-color: ",
    ";\n  .Dropdown-control {\n    margin-top: 0;\n  }\n  .Dropdown-control,\n  .Dropdown-control:hover {\n    font-size: 1em;\n    border: none;\n    padding: 0.9em 1.6em 0.9em 0.9em;\n    background: transparent;\n    color: ",
    ";\n    box-shadow: none;\n\n    .Dropdown-arrow {\n      border-top-color: ",
    ";\n    }\n  }\n  .Dropdown-menu {\n    margin: 0;\n    margin-top: 2px;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["transparentize"])(0.6, theme.rightPanel.backgroundColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
}, function (_a) {
    var theme = _a.theme;
    return theme.rightPanel.textColor;
});
var NoSampleLabel = styled_components.div(styled_elements_templateObject_5 || (styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: ", ";\n  font-size: 12px;\n  color: #ee807f;\n"], ["\n  font-family: ", ";\n  font-size: 12px;\n  color: #ee807f;\n"])), function (props) { return props.theme.typography.code.fontFamily; });
var PayloadSamples_styled_elements_templateObject_1, PayloadSamples_styled_elements_templateObject_2, styled_elements_templateObject_3, styled_elements_templateObject_4, styled_elements_templateObject_5;

// CONCATENATED MODULE: ./src/components/PayloadSamples/MediaTypeSamples.tsx






var MediaTypeSamples_MediaTypeSamples = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(MediaTypeSamples, _super);
    function MediaTypeSamples() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            activeIdx: 0
        };
        _this.switchMedia = function (_a) {
            var value = _a.value;
            _this.setState({
                activeIdx: parseInt(value, 10)
            });
        };
        return _this;
    }
    MediaTypeSamples.prototype.render = function () {
        var activeIdx = this.state.activeIdx;
        var examples = this.props.mediaType.examples || {};
        var mimeType = this.props.mediaType.name;
        var noSample = external_react_["createElement"](NoSampleLabel, null, "No sample");
        var examplesNames = Object.keys(examples);
        if (examplesNames.length === 0) {
            return noSample;
        }
        if (examplesNames.length > 1) {
            var options = examplesNames.map(function (name, idx) {
                return {
                    label: examples[name].summary || name,
                    value: idx.toString()
                };
            });
            var example = examples[examplesNames[activeIdx]];
            var description = example.description;
            return external_react_["createElement"](SamplesWrapper, null,
                external_react_["createElement"](DropdownWrapper, null,
                    external_react_["createElement"](DropdownLabel, null, "Example"),
                    this.props.renderDropdown({
                        value: options[activeIdx],
                        options: options,
                        onChange: this.switchMedia
                    })),
                external_react_["createElement"]("div", null,
                    description && external_react_["createElement"](Markdown_Markdown, { source: description }),
                    external_react_["createElement"](Example, { example: example, mimeType: mimeType })));
        }
        else {
            var example = examples[examplesNames[0]];
            return external_react_["createElement"](SamplesWrapper, null,
                example.description && external_react_["createElement"](Markdown_Markdown, { source: example.description }),
                external_react_["createElement"](Example, { example: example, mimeType: mimeType }));
        }
    };
    return MediaTypeSamples;
}(external_react_["Component"]));

var SamplesWrapper = styled_components.div(MediaTypeSamples_templateObject_1 || (MediaTypeSamples_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-top: 15px;\n"], ["\n  margin-top: 15px;\n"])));
var MediaTypeSamples_templateObject_1;

// EXTERNAL MODULE: external "mobx-react"
var external_mobx_react_ = __webpack_require__(3);

// CONCATENATED MODULE: ./src/common-elements/fields.ts





var ClickablePropertyNameCell = styled_components(PropertyNameCell)(fields_templateObject_1 || (fields_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  cursor: pointer;\n\n  ", " {\n    height: ", ";\n    width: ", ";\n    polygon {\n      fill: ", ";\n    }\n  }\n"], ["\n  cursor: pointer;\n\n  ", " {\n    height: ",
    ";\n    width: ",
    ";\n    polygon {\n      fill: ",
    ";\n    }\n  }\n"])), ShelfIcon, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.size;
}, function (_a) {
    var theme = _a.theme;
    return theme.schema.arrow.color;
});
var FieldLabel = styled_components.span(fields_templateObject_2 || (fields_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  vertical-align: middle;\n  font-size: ", ";\n  line-height: 20px;\n"], ["\n  vertical-align: middle;\n  font-size: ",
    ";\n  line-height: 20px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.typography.code.fontSize;
});
var TypePrefix = styled_components(FieldLabel)(fields_templateObject_3 || (fields_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return Object(external_polished_["transparentize"])(0.2, props.theme.schema.typeNameColor); });
var TypeName = styled_components(FieldLabel)(fields_templateObject_4 || (fields_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme.schema.typeNameColor; });
var TypeTitle = styled_components(FieldLabel)(fields_templateObject_5 || (fields_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n  word-break: break-word;\n"], ["\n  color: ", ";\n  word-break: break-word;\n"])), function (props) { return props.theme.schema.typeTitleColor; });
var TypeFormat = TypeName;
var RequiredLabel = styled_components(FieldLabel.withComponent('div'))(fields_templateObject_6 || (fields_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n  font-size: ", ";\n  font-weight: normal;\n  margin-left: 20px;\n  line-height: 1;\n"], ["\n  color: ", ";\n  font-size: ", ";\n  font-weight: normal;\n  margin-left: 20px;\n  line-height: 1;\n"])), function (props) { return props.theme.schema.requireLabelColor; }, function (props) { return props.theme.schema.labelsTextSize; });
var RecursiveLabel = styled_components(FieldLabel)(fields_templateObject_7 || (fields_templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: ", ";\n  font-size: 13px;\n"], ["\n  color: ",
    ";\n  font-size: 13px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.warning.main;
});
var NullableLabel = styled_components(FieldLabel)(fields_templateObject_8 || (fields_templateObject_8 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: #3195a6;\n  font-size: 13px;\n"], ["\n  color: #3195a6;\n  font-size: 13px;\n"])));
var PatternLabel = styled_components(FieldLabel)(fields_templateObject_9 || (fields_templateObject_9 = Object(external_tslib_["__makeTemplateObject"])(["\n  color: #3195a6;\n  &::before,\n  &::after {\n    font-weight: bold;\n  }\n"], ["\n  color: #3195a6;\n  &::before,\n  &::after {\n    font-weight: bold;\n  }\n"])));
var fields_ExampleValue = styled_components(FieldLabel)(templateObject_10 || (templateObject_10 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-radius: 2px;\n  ", ";\n  & + & {\n    margin-left: 0;\n  }\n  ", ";\n"], ["\n  border-radius: 2px;\n  ",
    ";\n  & + & {\n    margin-left: 0;\n  }\n  ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return "\n    background-color: " + Object(external_polished_["transparentize"])(0.95, theme.colors.text.primary) + ";\n    color: " + Object(external_polished_["transparentize"])(0.1, theme.colors.text.primary) + ";\n\n    padding: 0 " + theme.spacing.unit + "px;\n    border: 1px solid " + Object(external_polished_["transparentize"])(0.9, theme.colors.text.primary) + ";\n    font-family: " + theme.typography.code.fontFamily + ";\n}";
}, extensionsHook('ExampleValue'));
var ExtensionValue = styled_components(fields_ExampleValue)(templateObject_11 || (templateObject_11 = Object(external_tslib_["__makeTemplateObject"])([""], [""])));
var ConstraintItem = styled_components(FieldLabel)(templateObject_12 || (templateObject_12 = Object(external_tslib_["__makeTemplateObject"])(["\n  border-radius: 2px;\n  ", ";\n  & + & {\n    margin-left: 0;\n  }\n  ", ";\n"], ["\n  border-radius: 2px;\n  ",
    ";\n  & + & {\n    margin-left: 0;\n  }\n  ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return "\n    background-color: " + Object(external_polished_["transparentize"])(0.95, theme.colors.primary.light) + ";\n    color: " + Object(external_polished_["transparentize"])(0.1, theme.colors.primary.main) + ";\n\n    margin: 0 " + theme.spacing.unit + "px;\n    padding: 0 " + theme.spacing.unit + "px;\n    border: 1px solid " + Object(external_polished_["transparentize"])(0.9, theme.colors.primary.main) + ";\n    font-family: " + theme.typography.code.fontFamily + ";\n}";
}, extensionsHook('ConstraintItem'));
var fields_templateObject_1, fields_templateObject_2, fields_templateObject_3, fields_templateObject_4, fields_templateObject_5, fields_templateObject_6, fields_templateObject_7, fields_templateObject_8, fields_templateObject_9, templateObject_10, templateObject_11, templateObject_12;

// CONCATENATED MODULE: ./src/components/ExternalDocumentation/ExternalDocumentation.tsx





var LinkWrap = styled_components.div(ExternalDocumentation_templateObject_1 || (ExternalDocumentation_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n  ", "\n"], ["\n  ", ";\n  ",
    "\n"])), linksCss, function (_a) {
    var compact = _a.compact;
    return !compact ? 'margin: 1em 0' : '';
});
var ExternalDocumentation_ExternalDocumentation = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ExternalDocumentation, _super);
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
    ExternalDocumentation = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ExternalDocumentation);
    return ExternalDocumentation;
}(external_react_["Component"]));

var ExternalDocumentation_templateObject_1;

// CONCATENATED MODULE: ./src/components/Fields/EnumValues.tsx





var EnumValues_EnumValues = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(EnumValues, _super);
    function EnumValues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnumValues.prototype.render = function () {
        var _a = this.props, values = _a.values, type = _a.type;
        var enumSkipQuotes = this.context.enumSkipQuotes;
        if (!values.length) {
            return null;
        }
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](FieldLabel, null,
                type === 'array' ? l('enumArray') : '',
                ' ',
                values.length === 1 ? l('enumSingleValue') : l('enum'),
                ":"),
            ' ',
            values.map(function (value, idx) {
                var exampleValue = enumSkipQuotes ? value : JSON.stringify(value);
                return external_react_["createElement"](external_react_["Fragment"], { key: idx },
                    external_react_["createElement"](fields_ExampleValue, null, exampleValue),
                    ' ');
            }));
    };
    EnumValues.contextType = OptionsContext;
    return EnumValues;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/Extensions.tsx






var Extension = styled_components(StyledMarkdownBlock)(Extensions_templateObject_1 || (Extensions_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin: 2px 0;\n"], ["\n  margin: 2px 0;\n"])));
var Extensions_Extensions = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Extensions, _super);
    function Extensions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Extensions.prototype.render = function () {
        var exts = this.props.extensions;
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](external_react_["Fragment"], null, options.showExtensions && Object.keys(exts).map(function (key) { return external_react_["createElement"](Extension, { key: key },
            external_react_["createElement"](FieldLabel, null,
                " ",
                key.substring(2),
                ": "),
            ' ',
            external_react_["createElement"](ExtensionValue, null, typeof exts[key] === 'string' ? exts[key] : JSON.stringify(exts[key]))); })); });
    };
    return Extensions;
}(external_react_["PureComponent"]));

var Extensions_templateObject_1;

// CONCATENATED MODULE: ./src/components/Fields/FieldContstraints.tsx



var FieldContstraints_ConstraintsView = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ConstraintsView, _super);
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
    Object(external_tslib_["__extends"])(FieldDetail, _super);
    function FieldDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldDetail.prototype.render = function () {
        if (this.props.value === undefined) {
            return null;
        }
        var value = this.props.raw ? this.props.value : JSON.stringify(this.props.value);
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](FieldLabel, null,
                " ",
                this.props.label,
                " "),
            " ",
            external_react_["createElement"](fields_ExampleValue, null, value));
    };
    return FieldDetail;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Fields/FieldDetails.tsx













var FieldDetails_FieldDetails = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(FieldDetails, _super);
    function FieldDetails() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldDetails.prototype.render = function () {
        var _a = this.props, showExamples = _a.showExamples, field = _a.field, renderDiscriminatorSwitch = _a.renderDiscriminatorSwitch;
        var _b = this.context, enumSkipQuotes = _b.enumSkipQuotes, hideSchemaTitles = _b.hideSchemaTitles;
        var schema = field.schema, description = field.description, example = field.example, deprecated = field.deprecated;
        var rawDefault = !!enumSkipQuotes || field.in === 'header'; // having quotes around header field default values is confusing and inappropriate
        var exampleField = null;
        if (showExamples && example !== undefined) {
            var label = l('example') + ':';
            if (field.in && (field.style || field.serializationMime)) {
                // decode for better readability in examples: see https://github.com/Redocly/redoc/issues/1138
                var serializedValue = decodeURIComponent(serializeParameterValue(field, example));
                exampleField = external_react_["createElement"](FieldDetail_FieldDetail, { label: label, value: serializedValue, raw: true });
            }
            else {
                exampleField = external_react_["createElement"](FieldDetail_FieldDetail, { label: label, value: example });
            }
        }
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
                schema.title && !hideSchemaTitles && external_react_["createElement"](TypeTitle, null,
                    " (",
                    schema.title,
                    ") "),
                external_react_["createElement"](FieldContstraints_ConstraintsView, { constraints: schema.constraints }),
                schema.nullable && external_react_["createElement"](NullableLabel, null,
                    " ",
                    l('nullable'),
                    " "),
                schema.pattern && external_react_["createElement"](PatternLabel, null,
                    " ",
                    schema.pattern,
                    " "),
                schema.isCircular && external_react_["createElement"](RecursiveLabel, null,
                    " ",
                    l('recursive'),
                    " ")),
            deprecated && external_react_["createElement"]("div", null,
                external_react_["createElement"](Badge, { type: "warning" },
                    " ",
                    l('deprecated'),
                    " ")),
            external_react_["createElement"](FieldDetail_FieldDetail, { raw: rawDefault, label: l('default') + ':', value: schema.default }),
            !renderDiscriminatorSwitch && external_react_["createElement"](EnumValues_EnumValues, { type: schema.type, values: schema.enum }),
            ' ',
            exampleField,
            external_react_["createElement"](Extensions_Extensions, { extensions: Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, field.extensions), schema.extensions) }),
            external_react_["createElement"]("div", null,
                external_react_["createElement"](Markdown_Markdown, { compact: true, source: description })),
            schema.externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: schema.externalDocs, compact: true }),
            renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props) || null);
    };
    FieldDetails.contextType = OptionsContext;
    return FieldDetails;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Schema/ArraySchema.tsx





var PaddedSchema = styled_components.div(ArraySchema_templateObject_1 || (ArraySchema_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding-left: ", "px;\n"], ["\n  padding-left: ",
    "px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit * 2;
});
var ArraySchema_ArraySchema = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ArraySchema, _super);
    function ArraySchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArraySchema.prototype.render = function () {
        var itemsSchema = this.props.schema.items;
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](ArrayOpenningLabel, null, " Array "),
            external_react_["createElement"](PaddedSchema, null,
                external_react_["createElement"](Schema_Schema, Object(external_tslib_["__assign"])({}, this.props, { schema: itemsSchema }))),
            external_react_["createElement"](ArrayClosingLabel, null));
    };
    return ArraySchema;
}(external_react_["PureComponent"]));

var ArraySchema_templateObject_1;

// CONCATENATED MODULE: ./src/components/Fields/Field.tsx








var Field_Field = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Field, _super);
    function Field() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggle = function () {
            if (_this.props.field.expanded === undefined && _this.props.expandByDefault) {
                _this.props.field.expanded = false;
            }
            else {
                _this.props.field.toggle();
            }
        };
        return _this;
    }
    Field.prototype.render = function () {
        var _a = this.props, className = _a.className, field = _a.field, isLast = _a.isLast, expandByDefault = _a.expandByDefault;
        var name = field.name, deprecated = field.deprecated, required = field.required, kind = field.kind;
        var withSubSchema = !field.schema.isPrimitive && !field.schema.isCircular;
        var expanded = field.expanded === undefined ? expandByDefault : field.expanded;
        var paramName = withSubSchema ? external_react_["createElement"](ClickablePropertyNameCell, { onClick: this.toggle, className: deprecated ? 'deprecated' : '', kind: kind, title: name },
            external_react_["createElement"](PropertyBullet, null),
            name,
            external_react_["createElement"](ShelfIcon, { direction: expanded ? 'down' : 'right' }),
            required && external_react_["createElement"](RequiredLabel, null, " required ")) : external_react_["createElement"](PropertyNameCell, { className: deprecated ? 'deprecated' : undefined, kind: kind, title: name },
            external_react_["createElement"](PropertyBullet, null),
            name,
            required && external_react_["createElement"](RequiredLabel, null, " required "));
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"]("tr", { className: isLast ? 'last ' + className : className },
                paramName,
                external_react_["createElement"](PropertyDetailsCell, null,
                    external_react_["createElement"](FieldDetails_FieldDetails, Object(external_tslib_["__assign"])({}, this.props)))),
            expanded && withSubSchema && external_react_["createElement"]("tr", { key: field.name + 'inner' },
                external_react_["createElement"](PropertyCellWithInner, { colSpan: 2 },
                    external_react_["createElement"](InnerPropertiesWrap, null,
                        external_react_["createElement"](Schema_Schema, { schema: field.schema, skipReadOnly: this.props.skipReadOnly, skipWriteOnly: this.props.skipWriteOnly, showTitle: this.props.showTitle })))));
    };
    Field = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], Field);
    return Field;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/DiscriminatorDropdown.tsx




var DiscriminatorDropdown_DiscriminatorDropdown = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(DiscriminatorDropdown, _super);
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
    DiscriminatorDropdown = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], DiscriminatorDropdown);
    return DiscriminatorDropdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/ObjectSchema.tsx








var ObjectSchema_ObjectSchema = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ObjectSchema, _super);
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
            return !(_this.props.skipReadOnly && item.schema.readOnly || _this.props.skipWriteOnly && item.schema.writeOnly);
        }) : fields;
        var expandByDefault = this.context.expandSingleSchemaField && filteredFields.length === 1;
        return external_react_["createElement"](PropertiesTable, null,
            showTitle && external_react_["createElement"](PropertiesTableCaption, null, this.props.schema.title),
            external_react_["createElement"]("tbody", null, mapWithLast(filteredFields, function (field, isLast) {
                return external_react_["createElement"](Field_Field, { key: field.name, isLast: isLast, field: field, expandByDefault: expandByDefault, renderDiscriminatorSwitch: discriminator && discriminator.fieldName === field.name && (function () { return external_react_["createElement"](DiscriminatorDropdown_DiscriminatorDropdown, { parent: _this.parentSchema, enumValues: field.schema.enum }); }) || undefined, className: field.expanded ? 'expanded' : undefined, showExamples: false, skipReadOnly: _this.props.skipReadOnly, skipWriteOnly: _this.props.skipWriteOnly, showTitle: _this.props.showTitle });
            })));
    };
    ObjectSchema.contextType = OptionsContext;
    ObjectSchema = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ObjectSchema);
    return ObjectSchema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/OneOfSchema.tsx





var OneOfSchema_OneOfButton = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OneOfButton, _super);
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
    OneOfButton = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], OneOfButton);
    return OneOfButton;
}(external_react_["Component"]));

var OneOfSchema_OneOfSchema = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OneOfSchema, _super);
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
            external_react_["createElement"](Schema_Schema, Object(external_tslib_["__assign"])({}, this.props, { schema: oneOf[schema.activeOneOf] })));
    };
    OneOfSchema = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], OneOfSchema);
    return OneOfSchema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/Schema.tsx









var Schema_Schema = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Schema, _super);
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
                external_react_["createElement"](RecursiveLabel, null,
                    " ",
                    l('recursive'),
                    " "));
        }
        if (discriminatorProp !== undefined) {
            if (!oneOf || !oneOf.length) {
                throw new Error("Looks like you are using discriminator wrong: you don't have any definition inherited from the " + schema.title);
            }
            return external_react_["createElement"](ObjectSchema_ObjectSchema, Object(external_tslib_["__assign"])({}, Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, this.props), { schema: oneOf[schema.activeOneOf] }), { discriminator: {
                    fieldName: discriminatorProp,
                    parentSchema: schema
                } }));
        }
        if (oneOf !== undefined) {
            return external_react_["createElement"](OneOfSchema_OneOfSchema, Object(external_tslib_["__assign"])({ schema: schema }, this.props));
        }
        switch (type) {
            case 'object':
                return external_react_["createElement"](ObjectSchema_ObjectSchema, Object(external_tslib_["__assign"])({}, this.props));
            case 'array':
                return external_react_["createElement"](ArraySchema_ArraySchema, Object(external_tslib_["__assign"])({}, this.props));
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
    Schema = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], Schema);
    return Schema;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Schema/index.ts






// CONCATENATED MODULE: ./src/components/SchemaDefinition/SchemaDefinition.tsx









var SchemaDefinition_SchemaDefinition = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SchemaDefinition, _super);
    function SchemaDefinition() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDropdown = function (props) {
            return external_react_["createElement"](DropdownOrLabel, Object(external_tslib_["__assign"])({ Label: MimeLabel, Dropdown: InvertedSimpleDropdown }, props));
        };
        return _this;
    }
    SchemaDefinition.getMediaType = function (schemaRef, exampleRef) {
        if (!schemaRef) {
            return {};
        }
        var info = {
            schema: {
                $ref: schemaRef
            }
        };
        if (exampleRef) {
            info.examples = {
                example: {
                    $ref: exampleRef
                }
            };
        }
        return info;
    };
    Object.defineProperty(SchemaDefinition.prototype, "mediaModel", {
        get: function () {
            var _a = this.props, parser = _a.parser, schemaRef = _a.schemaRef, exampleRef = _a.exampleRef, options = _a.options;
            if (!this._mediaModel) {
                this._mediaModel = new MediaType_MediaTypeModel(parser, 'json', false, SchemaDefinition.getMediaType(schemaRef, exampleRef), options);
            }
            return this._mediaModel;
        },
        enumerable: true,
        configurable: true
    });
    SchemaDefinition.prototype.render = function () {
        var _a = this.props, _b = _a.showReadOnly, showReadOnly = _b === void 0 ? true : _b, _c = _a.showWriteOnly, showWriteOnly = _c === void 0 ? false : _c;
        return external_react_["createElement"](Section, null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"](Schema_Schema, { skipWriteOnly: !showWriteOnly, skipReadOnly: !showReadOnly, schema: this.mediaModel.schema })),
                external_react_["createElement"](DarkRightPanel, null,
                    external_react_["createElement"](MediaSamplesWrap, null,
                        external_react_["createElement"](MediaTypeSamples_MediaTypeSamples, { renderDropdown: this.renderDropdown, mediaType: this.mediaModel })))));
    };
    return SchemaDefinition;
}(external_react_["PureComponent"]));

var MediaSamplesWrap = styled_components.div(SchemaDefinition_templateObject_1 || (SchemaDefinition_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  background: ", ";\n  & > div,\n  & > pre {\n    padding: ", "px;\n    margin: 0;\n  }\n\n  & > div > pre {\n    padding: 0;\n  }\n"], ["\n  background: ",
    ";\n  & > div,\n  & > pre {\n    padding: ", "px;\n    margin: 0;\n  }\n\n  & > div > pre {\n    padding: 0;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.codeSample.backgroundColor;
}, function (props) { return props.theme.spacing.unit * 4; });
var SchemaDefinition_templateObject_1;

// CONCATENATED MODULE: ./src/components/SecuritySchemes/SecuritySchemes.tsx






var AUTH_TYPES = {
    oauth2: 'OAuth2',
    apiKey: 'API Key',
    http: 'HTTP',
    openIdConnect: 'Open ID Connect'
};
var SecuritySchemes_OAuthFlow = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OAuthFlow, _super);
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
                external_react_["createElement"]("ul", null, Object.keys(flow.scopes || {}).map(function (scope) { return external_react_["createElement"]("li", { key: scope },
                    external_react_["createElement"]("code", null, scope),
                    " - ",
                    external_react_["createElement"](Markdown_Markdown, { inline: true, source: flow.scopes[scope] || '' })); }))));
    };
    return OAuthFlow;
}(external_react_["PureComponent"]));

var SecuritySchemes_SecurityDefs = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SecurityDefs, _super);
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
                                    external_react_["createElement"]("th", null, " Security Scheme Type "),
                                    external_react_["createElement"]("td", null,
                                        " ",
                                        AUTH_TYPES[scheme.type] || scheme.type,
                                        " ")),
                                scheme.apiKey ? external_react_["createElement"]("tr", null,
                                    external_react_["createElement"]("th", null,
                                        " ",
                                        titleize(scheme.apiKey.in || ''),
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
                                        external_react_["createElement"]("a", { target: "_blank", rel: "noopener noreferrer", href: scheme.openId.connectUrl }, scheme.openId.connectUrl))) : scheme.flows ? Object.keys(scheme.flows).map(function (type) { return external_react_["createElement"](SecuritySchemes_OAuthFlow, { key: type, type: type, flow: scheme.flows[type] }); }) : null)))))); });
    };
    return SecurityDefs;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/services/AppStore.ts
var AppStore_a;














function createStore(spec, specUrl, options) {
    if (options === void 0) { options = {}; }
    return Object(external_tslib_["__awaiter"])(this, void 0, void 0, function () {
        var resolvedSpec;
        return Object(external_tslib_["__generator"])(this, function (_a) {
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
        var _this = this;
        if (options === void 0) { options = {}; }
        if (createSearchIndex === void 0) { createSearchIndex = true; }
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
        if (this.search) {
            this.search.dispose();
        }
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
        return Object(external_tslib_["__awaiter"])(this, void 0, void 0, function () {
            var _a, _b;
            return Object(external_tslib_["__generator"])(this, function (_c) {
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
            elements.push(elem);
        }
        if (idx === -1 && IS_BROWSER) {
            var $description = document.querySelector('[data-role="redoc-description"]');
            if ($description)
                elements.push($description);
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
        AppStore_a[SECURITY_DEFINITIONS_JSX_NAME] = {
            component: SecuritySchemes_SecurityDefs,
            propsSelector: function (store) { return ({
                securitySchemes: store.spec.securitySchemes
            }); }
        },
        AppStore_a[SCHEMA_DEFINITION_JSX_NAME] = {
            component: SchemaDefinition_SchemaDefinition,
            propsSelector: function (store) { return ({
                parser: store.spec.parser,
                options: store.options
            }); }
        },
        AppStore_a)
};

// CONCATENATED MODULE: ./src/services/index.ts














// CONCATENATED MODULE: ./src/components/ApiInfo/styled.elements.ts



var delimiterWidth = 15;
var ApiInfoWrap = MiddlePanel;
var ApiHeader = styled_components(H1)(ApiInfo_styled_elements_templateObject_1 || (ApiInfo_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-top: 0;\n  margin-bottom: 0.5em;\n\n  ", ";\n"], ["\n  margin-top: 0;\n  margin-bottom: 0.5em;\n\n  ", ";\n"])), extensionsHook('ApiHeader'));
var AdditionalDocLink = styled_components.a(ApiInfo_styled_elements_templateObject_2 || (ApiInfo_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding-left: 100px;\n  font-size: 16px;\n  color: #0084CE;\n"], ["\n  padding-left: 100px;\n  font-size: 16px;\n  color: #0084CE;\n"])));
var DownloadButton = styled_components.a(ApiInfo_styled_elements_templateObject_3 || (ApiInfo_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  border: 1px solid ", ";\n  color: ", ";\n  font-weight: normal;\n  margin-left: 0.5em;\n  padding: 4px 8px 4px;\n  display: inline-block;\n  text-decoration: none;\n  cursor: pointer;\n\n  ", ";\n"], ["\n  border: 1px solid ", ";\n  color: ", ";\n  font-weight: normal;\n  margin-left: 0.5em;\n  padding: 4px 8px 4px;\n  display: inline-block;\n  text-decoration: none;\n  cursor: pointer;\n\n  ", ";\n"])), function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.primary.main; }, extensionsHook('DownloadButton'));
var InfoSpan = styled_components.span(ApiInfo_styled_elements_templateObject_4 || (ApiInfo_styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  &::before {\n    content: '|';\n    display: inline-block;\n    opacity: 0.5;\n    width: ", "px;\n    text-align: center;\n  }\n\n  &:last-child::after {\n    display: none;\n  }\n"], ["\n  &::before {\n    content: '|';\n    display: inline-block;\n    opacity: 0.5;\n    width: ", "px;\n    text-align: center;\n  }\n\n  &:last-child::after {\n    display: none;\n  }\n"])), delimiterWidth);
var InfoSpanBoxWrap = styled_components.div(ApiInfo_styled_elements_templateObject_5 || (ApiInfo_styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  overflow: hidden;\n"], ["\n  overflow: hidden;\n"])));
var InfoSpanBox = styled_components.div(styled_elements_templateObject_6 || (styled_elements_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: flex;\n  flex-wrap: wrap;\n  // hide separator on new lines: idea from https://stackoverflow.com/a/31732902/1749888\n  margin-left: -", "px;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  // hide separator on new lines: idea from https://stackoverflow.com/a/31732902/1749888\n  margin-left: -", "px;\n"])), delimiterWidth);
var ApiInfo_styled_elements_templateObject_1, ApiInfo_styled_elements_templateObject_2, ApiInfo_styled_elements_templateObject_3, ApiInfo_styled_elements_templateObject_4, ApiInfo_styled_elements_templateObject_5, styled_elements_templateObject_6;

// CONCATENATED MODULE: ./src/components/ApiInfo/ApiInfo.tsx








var ApiInfo_ApiInfo = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ApiInfo, _super);
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
        var version = info.version && external_react_["createElement"]("span", null,
            "(",
            info.version,
            ")") || null;
        return external_react_["createElement"](Section, null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, { className: "api-info" },
                    external_react_["createElement"](ApiHeader, null,
                        info.title,
                        " ",
                        version,
                        external_react_["createElement"](AdditionalDocLink, { target: "_blank", href: store.options.additionalDocUrl },
                            external_react_["createElement"]("span", { style: {
                                    zoom: '1.3'
                                } },
                                external_react_["createElement"]("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                    external_react_["createElement"]("path", { opacity: "0.75", d: "M8 14C4.6912 14 2 11.3088 2 8C2 4.6912 4.6912 2 8 2C11.3088 2 14 4.6912 14 8C14 11.3088 11.3088 14 8 14Z", fill: "#0084CE" }),
                                    external_react_["createElement"]("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M0.799805 8.00005C0.799805 11.9716 4.02826 15.2 7.9998 15.2C11.9713 15.2 15.1998 11.9716 15.1998 8.00005C15.1998 4.02851 11.9713 0.800049 7.9998 0.800049C4.02826 0.800049 0.799805 4.02851 0.799805 8.00005ZM3.32386 11.7561C2.49585 10.7273 1.9998 9.42061 1.9998 8.00005C1.9998 4.69125 4.691 2.00005 7.9998 2.00005C11.3086 2.00005 13.9998 4.69125 13.9998 8.00005C13.9998 11.3088 11.3086 14 7.9998 14C6.58686 14 5.28654 13.5093 4.2603 12.6893L9.87799 7.0716L9.87799 10.0776C9.87799 10.4432 10.1734 10.7386 10.5389 10.7386C10.9044 10.7386 11.1998 10.4432 11.1998 10.0776L11.1998 4.80002L5.92218 4.80002C5.55714 4.79956 5.26127 5.09542 5.26127 5.46093C5.26127 5.82644 5.55667 6.12184 5.92218 6.12184L8.95767 6.12231L3.32386 11.7561Z", fill: "white" }))),
                            external_react_["createElement"]("span", { style: {
                                    paddingLeft: '5px',
                                    verticalAlign: 'top'
                                } }, "Additional Docs"))),
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
                    external_react_["createElement"](Markdown_Markdown, { source: store.spec.info.description, "data-role": "redoc-description" }),
                    externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs }))));
    };
    ApiInfo = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ApiInfo);
    return ApiInfo;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/ApiInfo/index.ts


// CONCATENATED MODULE: ./src/components/ApiLogo/styled.elements.tsx



var LogoImgEl = styled_components.img(ApiLogo_styled_elements_templateObject_1 || (ApiLogo_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  max-height: ", ";\n  max-width: ", ";\n  padding: ", ";\n  width: 100%;\n  display: block;\n"], ["\n  max-height: ", ";\n  max-width: ", ";\n  padding: ", ";\n  width: 100%;\n  display: block;\n"])), function (props) { return props.theme.logo.maxHeight; }, function (props) { return props.theme.logo.maxWidth; }, function (props) { return props.theme.logo.gutter; });
var LogoWrap = styled_components.div(ApiLogo_styled_elements_templateObject_2 || (ApiLogo_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  text-align: center;\n"], ["\n  text-align: center;\n"])));
var styled_elements_Link = styled_components.a(ApiLogo_styled_elements_templateObject_3 || (ApiLogo_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var styled_elements_LinkWrap = function (url) { return function (Component) { return external_react_["createElement"](styled_elements_Link, { href: url }, Component); }; };
var ApiLogo_styled_elements_templateObject_1, ApiLogo_styled_elements_templateObject_2, ApiLogo_styled_elements_templateObject_3;

// CONCATENATED MODULE: ./src/components/ApiLogo/ApiLogo.tsx




var ApiLogo_ApiLogo = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ApiLogo, _super);
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
        var logo = external_react_["createElement"](LogoImgEl, { src: logoInfo.url, alt: altText });
        return external_react_["createElement"](LogoWrap, { style: {
                backgroundColor: logoInfo.backgroundColor
            } }, logoHref ? styled_elements_LinkWrap(logoHref)(logo) : logo);
    };
    ApiLogo = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ApiLogo);
    return ApiLogo;
}(external_react_["Component"]));


// EXTERNAL MODULE: external "classnames"
var external_classnames_ = __webpack_require__(42);

// CONCATENATED MODULE: ./src/components/SideMenu/styled.elements.ts





var OperationBadge = styled_components.span.attrs(function (props) { return ({
    className: "operation-type " + props.type
}); })(SideMenu_styled_elements_templateObject_1 || (SideMenu_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: 32px;\n  display: inline-block;\n  height: ", ";\n  line-height: ", ";\n  background-color: #333;\n  border-radius: 3px;\n  background-repeat: no-repeat;\n  background-position: 6px 4px;\n  font-size: 7px;\n  font-family: Verdana; // web-safe\n  color: white;\n  text-transform: uppercase;\n  text-align: center;\n  font-weight: bold;\n  vertical-align: middle;\n  margin-right: 6px;\n  margin-top: 2px;\n\n  &.get {\n    background-color: ", ";\n  }\n\n  &.post {\n    background-color: ", ";\n  }\n\n  &.put {\n    background-color: ", ";\n  }\n\n  &.options {\n    background-color: ", ";\n  }\n\n  &.patch {\n    background-color: ", ";\n  }\n\n  &.delete {\n    background-color: ", ";\n  }\n\n  &.basic {\n    background-color: ", ";\n  }\n\n  &.link {\n    background-color: ", ";\n  }\n\n  &.head {\n    background-color: ", ";\n  }\n"], ["\n  width: 32px;\n  display: inline-block;\n  height: ", ";\n  line-height: ", ";\n  background-color: #333;\n  border-radius: 3px;\n  background-repeat: no-repeat;\n  background-position: 6px 4px;\n  font-size: 7px;\n  font-family: Verdana; // web-safe\n  color: white;\n  text-transform: uppercase;\n  text-align: center;\n  font-weight: bold;\n  vertical-align: middle;\n  margin-right: 6px;\n  margin-top: 2px;\n\n  &.get {\n    background-color: ", ";\n  }\n\n  &.post {\n    background-color: ", ";\n  }\n\n  &.put {\n    background-color: ", ";\n  }\n\n  &.options {\n    background-color: ", ";\n  }\n\n  &.patch {\n    background-color: ", ";\n  }\n\n  &.delete {\n    background-color: ", ";\n  }\n\n  &.basic {\n    background-color: ", ";\n  }\n\n  &.link {\n    background-color: ", ";\n  }\n\n  &.head {\n    background-color: ", ";\n  }\n"])), function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.colors.http.get; }, function (props) { return props.theme.colors.http.post; }, function (props) { return props.theme.colors.http.put; }, function (props) { return props.theme.colors.http.options; }, function (props) { return props.theme.colors.http.patch; }, function (props) { return props.theme.colors.http.delete; }, function (props) { return props.theme.colors.http.basic; }, function (props) { return props.theme.colors.http.link; }, function (props) { return props.theme.colors.http.head; });
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
var MenuItemUl = styled_components.ul(SideMenu_styled_elements_templateObject_2 || (SideMenu_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin: 0;\n  padding: 0;\n\n  & & {\n    font-size: 0.929em;\n  }\n\n  ", ";\n"], ["\n  margin: 0;\n  padding: 0;\n\n  & & {\n    font-size: 0.929em;\n  }\n\n  ", ";\n"])), function (props) { return props.expanded ? '' : 'display: none;'; });
var MenuItemLi = styled_components.li(SideMenu_styled_elements_templateObject_3 || (SideMenu_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  list-style: none inside none;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding: 0;\n  ", ";\n"], ["\n  list-style: none inside none;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding: 0;\n  ", ";\n"])), function (props) { return props.depth === 0 ? 'margin-top: 15px' : ''; });
var menuItemDepth = {
    0: css(SideMenu_styled_elements_templateObject_4 || (SideMenu_styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n    opacity: 0.7;\n    text-transform: ", ";\n    font-size: 0.8em;\n    padding-bottom: 0;\n    cursor: default;\n    color: ", ";\n  "], ["\n    opacity: 0.7;\n    text-transform: ",
        ";\n    font-size: 0.8em;\n    padding-bottom: 0;\n    cursor: default;\n    color: ", ";\n  "])), function (_a) {
        var theme = _a.theme;
        return theme.menu.groupItems.textTransform;
    }, function (props) { return props.theme.menu.textColor; }),
    1: css(SideMenu_styled_elements_templateObject_5 || (SideMenu_styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n    font-size: 0.929em;\n    text-transform: ", ";\n    &:hover {\n      color: ", ";\n    }\n  "], ["\n    font-size: 0.929em;\n    text-transform: ",
        ";\n    &:hover {\n      color: ", ";\n    }\n  "])), function (_a) {
        var theme = _a.theme;
        return theme.menu.level1Items.textTransform;
    }, function (props) { return props.theme.menu.activeTextColor; }),
    2: css(SideMenu_styled_elements_templateObject_6 || (SideMenu_styled_elements_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n    color: ", ";\n  "], ["\n    color: ", ";\n  "])), function (props) { return props.theme.menu.textColor; })
};
var MenuItemLabel = styled_components.label.attrs(function (props) { return ({
    role: 'menuitem',
    className: external_classnames_('-depth' + props.depth, {
        active: props.active
    })
}); })(styled_elements_templateObject_7 || (styled_elements_templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  cursor: pointer;\n  color: ", ";\n  margin: 0;\n  padding: 12.5px ", "px;\n  ", "\n  display: flex;\n  justify-content: space-between;\n  font-family: ", ";\n  ", ";\n  background-color: ", ";\n\n  ", ";\n\n  &:hover {\n    background-color: ", ";\n  }\n\n  ", " {\n    height: ", ";\n    width: ", ";\n    polygon {\n      fill: ", ";\n    }\n  }\n"], ["\n  cursor: pointer;\n  color: ", ";\n  margin: 0;\n  padding: 12.5px ", "px;\n  ",
    "\n  display: flex;\n  justify-content: space-between;\n  font-family: ", ";\n  ", ";\n  background-color: ", ";\n\n  ", ";\n\n  &:hover {\n    background-color: ", ";\n  }\n\n  ", " {\n    height: ",
    ";\n    width: ",
    ";\n    polygon {\n      fill: ",
    ";\n    }\n  }\n"])), function (props) { return props.active ? props.theme.menu.activeTextColor : props.theme.menu.textColor; }, function (props) { return props.theme.spacing.unit * 4; }, function (_a) {
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
var MenuItemTitle = styled_components.span(styled_elements_templateObject_8 || (styled_elements_templateObject_8 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: inline-block;\n  vertical-align: middle;\n  width: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  display: inline-block;\n  vertical-align: middle;\n  width: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])), function (props) { return props.width ? props.width : 'auto'; });
var RedocAttribution = styled_components.div(styled_elements_templateObject_9 || (styled_elements_templateObject_9 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n"], ["\n  ",
    ";\n"])), function (_a) {
    var theme = _a.theme;
    return "\n  font-size: 0.8em;\n  margin-top: " + theme.spacing.unit * 2 + "px;\n  padding: 0 " + theme.spacing.unit * 4 + "px;\n  text-align: left;\n\n  opacity: 0.7;\n\n  a,\n  a:visited,\n  a:hover {\n    color: " + theme.menu.textColor + " !important;\n    border-top: 1px solid " + Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor) + ";\n    padding: " + theme.spacing.unit + "px 0;\n    display: block;\n  }\n";
});
var SideMenu_styled_elements_templateObject_1, SideMenu_styled_elements_templateObject_2, SideMenu_styled_elements_templateObject_3, SideMenu_styled_elements_templateObject_4, SideMenu_styled_elements_templateObject_5, SideMenu_styled_elements_templateObject_6, styled_elements_templateObject_7, styled_elements_templateObject_8, styled_elements_templateObject_9;

// CONCATENATED MODULE: ./src/components/SideMenu/MenuItems.tsx





var MenuItems_MenuItems = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(MenuItems, _super);
    function MenuItems() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItems.prototype.render = function () {
        var _this = this;
        var _a = this.props, items = _a.items, root = _a.root, className = _a.className;
        var expanded = this.props.expanded == null ? true : this.props.expanded;
        return external_react_["createElement"](MenuItemUl, Object(external_tslib_["__assign"])({ className: className, style: this.props.style, expanded: expanded }, root ? {
            role: 'navigation'
        } : {}), items.map(function (item, idx) { return external_react_["createElement"](MenuItem_MenuItem, { key: idx, item: item, onActivate: _this.props.onActivate }); }));
    };
    MenuItems = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], MenuItems);
    return MenuItems;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SideMenu/MenuItem.tsx

// import { observe } from 'mobx';






var MenuItem_MenuItem = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(MenuItem, _super);
    function MenuItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = external_react_["createRef"]();
        _this.activate = function (evt) {
            _this.props.onActivate(_this.props.item);
            evt.stopPropagation();
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
        if (this.props.item.active && this.ref.current) {
            this.ref.current.scrollIntoViewIfNeeded();
        }
    };
    MenuItem.prototype.render = function () {
        var _a = this.props, item = _a.item, withoutChildren = _a.withoutChildren;
        return external_react_["createElement"](MenuItemLi, { onClick: this.activate, depth: item.depth, "data-item-id": item.id },
            item.type === 'operation' ? external_react_["createElement"](MenuItem_OperationMenuItemContent, Object(external_tslib_["__assign"])({}, this.props, { item: item })) : external_react_["createElement"](MenuItemLabel, { depth: item.depth, active: item.active, type: item.type, ref: this.ref },
                external_react_["createElement"](MenuItemTitle, { title: item.name },
                    item.name,
                    this.props.children),
                item.depth > 0 && item.items.length > 0 && external_react_["createElement"](ShelfIcon, { float: 'right', direction: item.expanded ? 'down' : 'right' }) || null),
            !withoutChildren && item.items && item.items.length > 0 && external_react_["createElement"](MenuItems_MenuItems, { expanded: item.expanded, items: item.items, onActivate: this.props.onActivate }));
    };
    MenuItem = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], MenuItem);
    return MenuItem;
}(external_react_["Component"]));

var MenuItem_OperationMenuItemContent = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OperationMenuItemContent, _super);
    function OperationMenuItemContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = external_react_["createRef"]();
        return _this;
    }
    OperationMenuItemContent.prototype.componentDidUpdate = function () {
        if (this.props.item.active && this.ref.current) {
            this.ref.current.scrollIntoViewIfNeeded();
        }
    };
    OperationMenuItemContent.prototype.render = function () {
        var item = this.props.item;
        return external_react_["createElement"](MenuItemLabel, { depth: item.depth, active: item.active, deprecated: item.deprecated, ref: this.ref },
            external_react_["createElement"](OperationBadge, { type: item.httpVerb }, shortenHTTPVerb(item.httpVerb)),
            external_react_["createElement"](MenuItemTitle, { width: "calc(100% - 38px)" },
                item.name,
                this.props.children));
    };
    OperationMenuItemContent = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], OperationMenuItemContent);
    return OperationMenuItemContent;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SearchBox/styled.elements.tsx





var SearchWrap = styled_components.div(SearchBox_styled_elements_templateObject_1 || (SearchBox_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 5px 0;\n"], ["\n  padding: 5px 0;\n"])));
var SearchInput = styled_components.input.attrs(function () { return ({
    className: 'search-input'
}); })(SearchBox_styled_elements_templateObject_2 || (SearchBox_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: calc(100% - ", "px);\n  box-sizing: border-box;\n  margin: 0 ", "px;\n  padding: 5px ", "px 5px\n    ", "px;\n  border: 0;\n  border-bottom: 1px solid\n    ", ";\n  font-family: ", ";\n  font-weight: bold;\n  font-size: 13px;\n  color: ", ";\n  background-color: transparent;\n  outline: none;\n"], ["\n  width: calc(100% - ", "px);\n  box-sizing: border-box;\n  margin: 0 ", "px;\n  padding: 5px ", "px 5px\n    ", "px;\n  border: 0;\n  border-bottom: 1px solid\n    ",
    ";\n  font-family: ",
    ";\n  font-weight: bold;\n  font-size: 13px;\n  color: ", ";\n  background-color: transparent;\n  outline: none;\n"])), function (props) { return props.theme.spacing.unit * 8; }, function (props) { return props.theme.spacing.unit * 4; }, function (props) { return props.theme.spacing.unit * 2; }, function (props) { return props.theme.spacing.unit * 4; }, function (_a) {
    var theme = _a.theme;
    return (Object(external_polished_["getLuminance"])(theme.menu.backgroundColor) > 0.5 ? external_polished_["darken"] : external_polished_["lighten"])(0.1, theme.menu.backgroundColor);
}, function (_a) {
    var theme = _a.theme;
    return theme.typography.fontFamily;
}, function (props) { return props.theme.menu.textColor; });
var SearchIcon = styled_components(function (props) { return external_react_["createElement"]("svg", { className: props.className, version: "1.1", viewBox: "0 0 1000 1000", x: "0px", xmlns: "http://www.w3.org/2000/svg", y: "0px" },
    external_react_["createElement"]("path", { d: "M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z" })); }).attrs({
    className: 'search-icon'
})(SearchBox_styled_elements_templateObject_3 || (SearchBox_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  left: ", "px;\n  height: 1.8em;\n  width: 0.9em;\n\n  path {\n    fill: ", ";\n  }\n"], ["\n  position: absolute;\n  left: ", "px;\n  height: 1.8em;\n  width: 0.9em;\n\n  path {\n    fill: ", ";\n  }\n"])), function (props) { return props.theme.spacing.unit * 4; }, function (props) { return props.theme.menu.textColor; });
var SearchResultsBox = styled_components.div(SearchBox_styled_elements_templateObject_4 || (SearchBox_styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: ", "px 0;\n  background-color: ", "};\n  color: ", ";\n  min-height: 150px;\n  max-height: 250px;\n  border-top: ", "};\n  border-bottom: ", "};\n  margin-top: 10px;\n  line-height: 1.4;\n  font-size: 0.9em;\n\n  ", " {\n    padding-top: 6px;\n    padding-bottom: 6px;\n\n    &:hover,\n    &.active {\n      background-color: ", ";\n    }\n\n    > svg {\n      display: none;\n    }\n  }\n"], ["\n  padding: ", "px 0;\n  background-color: ",
    "};\n  color: ", ";\n  min-height: 150px;\n  max-height: 250px;\n  border-top: ",
    "};\n  border-bottom: ",
    "};\n  margin-top: 10px;\n  line-height: 1.4;\n  font-size: 0.9em;\n\n  ", " {\n    padding-top: 6px;\n    padding-bottom: 6px;\n\n    &:hover,\n    &.active {\n      background-color: ",
    ";\n    }\n\n    > svg {\n      display: none;\n    }\n  }\n"])), function (props) { return props.theme.spacing.unit; }, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.05, theme.menu.backgroundColor);
}, function (props) { return props.theme.menu.textColor; }, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor);
}, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor);
}, MenuItemLabel, function (_a) {
    var theme = _a.theme;
    return Object(external_polished_["darken"])(0.1, theme.menu.backgroundColor);
});
var ClearIcon = styled_components.i(SearchBox_styled_elements_templateObject_5 || (SearchBox_styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  display: inline-block;\n  width: ", "px;\n  text-align: center;\n  right: ", "px;\n  line-height: 2em;\n  vertical-align: middle;\n  margin-right: 2px;\n  cursor: pointer;\n  font-style: normal;\n  color: '#666';\n"], ["\n  position: absolute;\n  display: inline-block;\n  width: ", "px;\n  text-align: center;\n  right: ", "px;\n  line-height: 2em;\n  vertical-align: middle;\n  margin-right: 2px;\n  cursor: pointer;\n  font-style: normal;\n  color: '#666';\n"])), function (props) { return props.theme.spacing.unit * 2; }, function (props) { return props.theme.spacing.unit * 4; });
var SearchBox_styled_elements_templateObject_1, SearchBox_styled_elements_templateObject_2, SearchBox_styled_elements_templateObject_3, SearchBox_styled_elements_templateObject_4, SearchBox_styled_elements_templateObject_5;

// CONCATENATED MODULE: ./src/components/SearchBox/SearchBox.tsx






var SearchBox_SearchBox = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SearchBox, _super);
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
            }, function () { return _this.searchCallback(_this.state.term); });
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
            results: results
        });
        this.props.marker.mark(term);
    };
    SearchBox.prototype.searchCallback = function (searchTerm) {
        var _this = this;
        this.props.search.search(searchTerm).then(function (res) {
            _this.setResults(res, searchTerm);
        });
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
    Object(external_tslib_["__decorate"])([
        external_decko_["bind"],
        Object(external_decko_["debounce"])(400)
    ], SearchBox.prototype, "searchCallback", null);
    return SearchBox;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/SideMenu/SideMenu.tsx







var SideMenu_SideMenu = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SideMenu, _super);
    function SideMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activate = function (item) {
            if (item && item.active && _this.context.menuToggle) {
                return item.expanded ? item.collapse() : item.expand();
            }
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
            external_react_["createElement"](MenuItems_MenuItems, { items: store.items, onActivate: this.activate, root: true }),
            external_react_["createElement"](RedocAttribution, null,
                external_react_["createElement"]("a", { target: "_blank", rel: "noopener noreferrer", href: "https://www.opentext.com/" }, "\u00A9 Copyright 2019 OpenText Corp")));
    };
    SideMenu.contextType = OptionsContext;
    SideMenu = Object(external_tslib_["__decorate"])([
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
var ChevronContainer = styled_components.div(ChevronSvg_templateObject_1 || (ChevronSvg_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  user-select: none;\n  width: 20px;\n  height: 20px;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  color: ", ";\n"], ["\n  user-select: none;\n  width: 20px;\n  height: 20px;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  color: ", ";\n"])), function (props) { return props.theme.colors.primary.main; });
var ChevronSvg_templateObject_1;

// CONCATENATED MODULE: ./src/components/StickySidebar/StickyResponsiveSidebar.tsx








var Stickyfill;
if (IS_BROWSER) {
    Stickyfill = __webpack_require__(81);
}
var stickyfill = Stickyfill && Stickyfill();
var StyledStickySidebar = styled_components.div(StickyResponsiveSidebar_templateObject_2 || (StickyResponsiveSidebar_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: ", ";\n  background-color: ", ";\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n\n  backface-visibility: hidden;\n  /* contain: strict; TODO: breaks layout since Chrome 80*/\n\n  height: 100vh;\n  position: sticky;\n  position: -webkit-sticky;\n  top: 0;\n\n  ", ";\n\n  @media print {\n    display: none;\n  }\n"], ["\n  width: ", ";\n  background-color: ", ";\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n\n  backface-visibility: hidden;\n  /* contain: strict; TODO: breaks layout since Chrome 80*/\n\n  height: 100vh;\n  position: sticky;\n  position: -webkit-sticky;\n  top: 0;\n\n  ",
    ";\n\n  @media print {\n    display: none;\n  }\n"])), function (props) { return props.theme.menu.width; }, function (props) { return props.theme.menu.backgroundColor; }, media.lessThan('small')(StickyResponsiveSidebar_templateObject_1 || (StickyResponsiveSidebar_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n    position: fixed;\n    z-index: 20;\n    width: 100%;\n    background: ", ";\n    display: ", ";\n  "], ["\n    position: fixed;\n    z-index: 20;\n    width: 100%;\n    background: ",
    ";\n    display: ", ";\n  "])), function (_a) {
    var theme = _a.theme;
    return theme.menu.backgroundColor;
}, function (props) { return props.open ? 'flex' : 'none'; }));
var FloatingButton = styled_components.div(StickyResponsiveSidebar_templateObject_4 || (StickyResponsiveSidebar_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  outline: none;\n  user-select: none;\n  background-color: #f2f2f2;\n  color: ", ";\n  display: none;\n  cursor: pointer;\n  position: fixed;\n  right: 20px;\n  z-index: 100;\n  border-radius: 50%;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);\n  ", ";\n\n  bottom: 44px;\n\n  width: 60px;\n  height: 60px;\n  padding: 0 20px;\n\n  @media print {\n    display: none;\n  }\n"], ["\n  outline: none;\n  user-select: none;\n  background-color: #f2f2f2;\n  color: ", ";\n  display: none;\n  cursor: pointer;\n  position: fixed;\n  right: 20px;\n  z-index: 100;\n  border-radius: 50%;\n  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);\n  ",
    ";\n\n  bottom: 44px;\n\n  width: 60px;\n  height: 60px;\n  padding: 0 20px;\n\n  @media print {\n    display: none;\n  }\n"])), function (props) { return props.theme.colors.primary.main; }, media.lessThan('small')(StickyResponsiveSidebar_templateObject_3 || (StickyResponsiveSidebar_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n    display: flex;\n  "], ["\n    display: flex;\n  "]))));
var StickyResponsiveSidebar_StickyResponsiveSidebar = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(StickyResponsiveSidebar, _super);
    function StickyResponsiveSidebar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            offsetTop: '0px'
        };
        _this.toggleNavMenu = function () {
            _this.props.menu.toggleSidebar();
        };
        return _this;
    }
    StickyResponsiveSidebar.prototype.componentDidMount = function () {
        if (stickyfill) {
            stickyfill.add(this.stickyElement);
        } // rerender when hydrating from SSR
        // see https://github.com/facebook/react/issues/8017#issuecomment-256351955
        this.setState({
            offsetTop: this.getScrollYOffset(this.context)
        });
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
        var top = this.state.offsetTop;
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](StyledStickySidebar, { open: open, className: this.props.className, style: {
                    top: top,
                    height: "calc(100vh - " + top + ")"
                }, ref: function (el) {
                    _this.stickyElement = el;
                } }, this.props.children),
            external_react_["createElement"](FloatingButton, { onClick: this.toggleNavMenu },
                external_react_["createElement"](AnimatedChevronButton, { open: open })));
    };
    StickyResponsiveSidebar.contextType = OptionsContext;
    StickyResponsiveSidebar = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], StickyResponsiveSidebar);
    return StickyResponsiveSidebar;
}(external_react_["Component"]));

var StickyResponsiveSidebar_templateObject_1, StickyResponsiveSidebar_templateObject_2, StickyResponsiveSidebar_templateObject_3, StickyResponsiveSidebar_templateObject_4;

// CONCATENATED MODULE: ./src/components/Redoc/styled.elements.tsx


var RedocWrap = styled_components.div(Redoc_styled_elements_templateObject_1 || (Redoc_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  ", ";\n"], ["\n  ",
    ";\n"])), function (_a) {
    var theme = _a.theme;
    return "\n  font-family: " + theme.typography.fontFamily + ";\n  font-size: " + theme.typography.fontSize + ";\n  font-weight: " + theme.typography.fontWeightRegular + ";\n  line-height: " + theme.typography.lineHeight + ";\n  color: " + theme.colors.text.primary + ";\n  display: flex;\n  position: relative;\n  text-align: left;\n\n  -webkit-font-smoothing: " + theme.typography.smoothing + ";\n  font-smoothing: " + theme.typography.smoothing + ";\n  " + (theme.typography.optimizeSpeed && 'text-rendering: optimizeSpeed !important' || '') + ";\n\n  tap-highlight-color: rgba(0, 0, 0, 0);\n  text-size-adjust: 100%;\n\n  * {\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\n  }\n";
});
var ApiContentWrap = styled_components.div(Redoc_styled_elements_templateObject_3 || (Redoc_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  z-index: 1;\n  position: relative;\n  overflow: hidden;\n  width: calc(100% - ", ");\n  ", ";\n\n  contain: layout;\n"], ["\n  z-index: 1;\n  position: relative;\n  overflow: hidden;\n  width: calc(100% - ", ");\n  ",
    ";\n\n  contain: layout;\n"])), function (props) { return props.theme.menu.width; }, media.lessThan('small', true)(Redoc_styled_elements_templateObject_2 || (Redoc_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n    width: 100%;\n  "], ["\n    width: 100%;\n  "]))));
var BackgroundStub = styled_components.div(Redoc_styled_elements_templateObject_5 || (Redoc_styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  background: ", ";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  width: ", ";\n  ", ";\n"], ["\n  background: ",
    ";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  width: ",
    ";\n  ",
    ";\n"])), function (_a) {
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
}, media.lessThan('medium', true)(Redoc_styled_elements_templateObject_4 || (Redoc_styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n    display: none;\n  "], ["\n    display: none;\n  "]))));
var Redoc_styled_elements_templateObject_1, Redoc_styled_elements_templateObject_2, Redoc_styled_elements_templateObject_3, Redoc_styled_elements_templateObject_4, Redoc_styled_elements_templateObject_5;

// CONCATENATED MODULE: ./src/components/Redoc/Redoc.tsx














var Redoc_Redoc = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Redoc, _super);
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
    Object(external_tslib_["__extends"])(RedocStandalone, _super);
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


// CONCATENATED MODULE: ./src/components/Markdown/AdvancedMarkdown.tsx






var AdvancedMarkdown_AdvancedMarkdown = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(AdvancedMarkdown, _super);
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
            throw new Error('When using components in markdown, store prop must be provided');
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
            return external_react_["createElement"](part.component, Object(external_tslib_["__assign"])({ key: idx }, Object(external_tslib_["__assign"])(Object(external_tslib_["__assign"])({}, part.props), part.propsSelector(store))));
        });
    };
    return AdvancedMarkdown;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/SelectOnClick/SelectOnClick.tsx



var SelectOnClick_SelectOnClick = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SelectOnClick, _super);
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


var OperationEndpointWrap = styled_components.div(Endpoint_styled_elements_templateObject_1 || (Endpoint_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  cursor: pointer;\n  position: relative;\n  margin-bottom: 5px;\n"], ["\n  cursor: pointer;\n  position: relative;\n  margin-bottom: 5px;\n"])));
var ServerRelativeURL = styled_components.span(Endpoint_styled_elements_templateObject_2 || (Endpoint_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-family: ", ";\n  margin-left: 10px;\n  flex: 1;\n  overflow-x: hidden;\n  text-overflow: ellipsis;\n"], ["\n  font-family: ", ";\n  margin-left: 10px;\n  flex: 1;\n  overflow-x: hidden;\n  text-overflow: ellipsis;\n"])), function (props) { return props.theme.typography.code.fontFamily; });
var EndpointInfo = styled_components.div(Endpoint_styled_elements_templateObject_3 || (Endpoint_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 10px 30px 10px ", ";\n  border-radius: ", ";\n  background-color: ", ";\n  display: flex;\n  white-space: nowrap;\n  align-items: center;\n  border: ", ";\n  border-bottom: ", ";\n  transition: border-color 0.25s ease;\n\n  ", "\n\n  .", " {\n    color: ", "\n  }\n"], ["\n  padding: 10px 30px 10px ", ";\n  border-radius: ", ";\n  background-color: ", ";\n  display: flex;\n  white-space: nowrap;\n  align-items: center;\n  border: ", ";\n  border-bottom: ", ";\n  transition: border-color 0.25s ease;\n\n  ", "\n\n  .", " {\n    color: ", "\n  }\n"])), function (props) { return props.inverted ? '10px' : '20px'; }, function (props) { return props.inverted ? '0' : '4px 4px 0 0'; }, function (props) { return props.inverted ? 'transparent' : props.theme.codeSample.backgroundColor; }, function (props) { return props.inverted ? '0' : '1px solid transparent'; }, function (props) { return props.inverted ? '1px solid #ccc' : '0'; }, function (props) { return props.expanded && !props.inverted && "border-color: " + props.theme.colors.border.dark + ";" || ''; }, ServerRelativeURL, function (props) { return props.inverted ? props.theme.colors.text.primary : '#ffffff'; });
var HttpVerb = styled_components.span.attrs(function (props) { return ({
    className: "http-verb " + props.type
}); })(Endpoint_styled_elements_templateObject_4 || (Endpoint_styled_elements_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: 0.929em;\n  line-height: 20px;\n  background-color: ", ";\n  color: #ffffff;\n  padding: 3px 10px;\n  text-transform: uppercase;\n  font-family: ", ";\n  margin: 0;\n"], ["\n  font-size: 0.929em;\n  line-height: 20px;\n  background-color: ", ";\n  color: #ffffff;\n  padding: 3px 10px;\n  text-transform: uppercase;\n  font-family: ", ";\n  margin: 0;\n"])), function (props) { return props.theme.colors.http[props.type] || '#999999'; }, function (props) { return props.theme.typography.headings.fontFamily; });
var ServersOverlay = styled_components.div(Endpoint_styled_elements_templateObject_5 || (Endpoint_styled_elements_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  position: absolute;\n  width: 100%;\n  z-index: 100;\n  background: #fafafa;\n  color: #263238;\n  box-sizing: border-box;\n  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.33);\n  overflow: hidden;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  transition: all 0s ease;\n\n  ", "\n"], ["\n  position: absolute;\n  width: 100%;\n  z-index: 100;\n  background: #fafafa;\n  color: #263238;\n  box-sizing: border-box;\n  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.33);\n  overflow: hidden;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n  transition: all 0s ease;\n\n  ", "\n"])), function (props) { return props.expanded ? '' : 'transform: translateY(-50%) scaleY(0);'; });
var ServerItem = styled_components.div(Endpoint_styled_elements_templateObject_6 || (Endpoint_styled_elements_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 10px;\n"], ["\n  padding: 10px;\n"])));
var ServerUrl = styled_components.div(Endpoint_styled_elements_templateObject_7 || (Endpoint_styled_elements_templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 5px;\n  border: 1px solid #ccc;\n  background: #fff;\n  word-break: break-all;\n  color: ", ";\n  > span {\n    color: ", ";\n  }\n"], ["\n  padding: 5px;\n  border: 1px solid #ccc;\n  background: #fff;\n  word-break: break-all;\n  color: ", ";\n  > span {\n    color: ", ";\n  }\n"])), function (props) { return props.theme.colors.primary.main; }, function (props) { return props.theme.colors.text.primary; });
var Endpoint_styled_elements_templateObject_1, Endpoint_styled_elements_templateObject_2, Endpoint_styled_elements_templateObject_3, Endpoint_styled_elements_templateObject_4, Endpoint_styled_elements_templateObject_5, Endpoint_styled_elements_templateObject_6, Endpoint_styled_elements_templateObject_7;

// CONCATENATED MODULE: ./src/components/Endpoint/Endpoint.tsx








var Endpoint_Endpoint = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Endpoint, _super);
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
            external_react_["createElement"](ServersOverlay, { expanded: expanded }, operation.servers.map(function (server) {
                var normalizedUrl = options.expandDefaultServerVariables ? expandDefaultServerVariables(server.url, server.variables) : server.url;
                return external_react_["createElement"](ServerItem, { key: normalizedUrl },
                    external_react_["createElement"](Markdown_Markdown, { source: server.description || '', compact: true }),
                    external_react_["createElement"](SelectOnClick_SelectOnClick, null,
                        external_react_["createElement"](ServerUrl, null,
                            external_react_["createElement"]("span", null, hideHostname || options.hideHostname ? getBasePath(normalizedUrl) : normalizedUrl),
                            operation.path)));
            }))); });
    };
    return Endpoint;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/MediaTypeSwitch/MediaTypesSwitch.tsx




var MediaTypesSwitch_MediaTypesSwitch = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(MediaTypesSwitch, _super);
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
        var _this = this;
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
        var Wrapper = function (_a) {
            var children = _a.children;
            return _this.props.withLabel ? external_react_["createElement"](DropdownWrapper, null,
                external_react_["createElement"](DropdownLabel, null, "Content type"),
                children) : children;
        };
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](Wrapper, null, this.props.renderDropdown({
                value: options[activeMimeIdx],
                options: options,
                onChange: this.switchMedia
            })),
            this.props.children(content.active));
    };
    MediaTypesSwitch = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], MediaTypesSwitch);
    return MediaTypesSwitch;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/PayloadSamples/PayloadSamples.tsx







var PayloadSamples_PayloadSamples = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(PayloadSamples, _super);
    function PayloadSamples() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDropdown = function (props) {
            return external_react_["createElement"](DropdownOrLabel, Object(external_tslib_["__assign"])({ Label: styled_elements_MimeLabel, Dropdown: InvertedSimpleDropdown }, props));
        };
        return _this;
    }
    PayloadSamples.prototype.render = function () {
        var _this = this;
        var mimeContent = this.props.content;
        if (mimeContent === undefined) {
            return null;
        }
        return external_react_["createElement"](MediaTypesSwitch_MediaTypesSwitch, { content: mimeContent, renderDropdown: this.renderDropdown, withLabel: true }, function (mediaType) { return external_react_["createElement"](MediaTypeSamples_MediaTypeSamples, { key: "samples", mediaType: mediaType, renderDropdown: _this.renderDropdown }); });
    };
    PayloadSamples = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], PayloadSamples);
    return PayloadSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/RequestSamples/RequestSamples.tsx








var RequestSamples_RequestSamples = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(RequestSamples, _super);
    function RequestSamples() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RequestSamples.prototype.render = function () {
        var operation = this.props.operation;
        var samples = operation.codeSamples;
        var hasSamples = samples.length > 0;
        var hideTabList = samples.length === 1 ? this.context.hideSingleRequestSampleTab : false;
        return hasSamples && external_react_["createElement"]("div", null,
            external_react_["createElement"](RightPanelHeader, null, " Request samples "),
            external_react_["createElement"](Tabs, { defaultIndex: 0 },
                external_react_["createElement"](external_react_tabs_["TabList"], { hidden: hideTabList }, samples.map(function (sample) { return external_react_["createElement"](external_react_tabs_["Tab"], { key: sample.lang + '_' + (sample.label || '') }, sample.label !== undefined ? sample.label : sample.lang); })),
                samples.map(function (sample) { return external_react_["createElement"](external_react_tabs_["TabPanel"], { key: sample.lang + '_' + (sample.label || '') }, isPayloadSample(sample) ? external_react_["createElement"]("div", null,
                    external_react_["createElement"](PayloadSamples_PayloadSamples, { content: sample.requestBodyContent })) : external_react_["createElement"](SourceCode_SourceCodeWithCopy, { lang: sample.lang, source: sample.source })); }))) || null;
    };
    RequestSamples.contextType = OptionsContext;
    RequestSamples = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], RequestSamples);
    return RequestSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/services/Constants.ts
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.OTX_EXTENSION_KEY = 'x-opentext-other';
    return Constants;
}());


// CONCATENATED MODULE: ./src/components/RightPanelContent/ContentPanel.tsx




var ContentPanel_ContentPanel = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ContentPanel, _super);
    function ContentPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentPanel.prototype.render = function () {
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"]("h3", null, this.props.content))));
    };
    ContentPanel = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ContentPanel);
    return ContentPanel;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/RightPanelContent/OperationPanel.tsx








var OperationPanel_OperationPanel = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OperationPanel, _super);
    function OperationPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationPanel.prototype.render = function () {
        if (this.shouldShowOtherInfoPanel()) {
            return external_react_["createElement"](ContentPanel_ContentPanel, { content: this.props.operation.extensions[Constants.OTX_EXTENSION_KEY] });
        }
        else {
            return external_react_["createElement"](external_react_["Fragment"], null,
                !this.props.options.pathInMiddlePanel && external_react_["createElement"](Endpoint_Endpoint, { operation: this.props.operation }),
                external_react_["createElement"](RequestSamples_RequestSamples, { operation: this.props.operation }),
                external_react_["createElement"](ResponseSamples_ResponseSamples, { operation: this.props.operation }));
        }
    };
    OperationPanel.prototype.shouldShowOtherInfoPanel = function () {
        return this.props.options.showExtensions && this.props.operation.extensions[Constants.OTX_EXTENSION_KEY];
    };
    OperationPanel = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], OperationPanel);
    return OperationPanel;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Parameters/ParametersGroup.tsx






var ParametersGroup_ParametersGroup = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ParametersGroup, _super);
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


// CONCATENATED MODULE: ./src/components/Parameters/Parameters.tsx








function safePush(obj, prop, item) {
    if (!obj[prop]) {
        obj[prop] = [];
    }
    obj[prop].push(item);
}
var PARAM_PLACES = ['path', 'query', 'cookie', 'header'];
var Parameters_Parameters = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Parameters, _super);
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
        var bodyDescription = body && body.description;
        return external_react_["createElement"](external_react_["Fragment"], null,
            paramsPlaces.map(function (place) { return external_react_["createElement"](ParametersGroup_ParametersGroup, { key: place, place: place, parameters: paramsMap[place] }); }),
            bodyContent && external_react_["createElement"](BodyContent, { content: bodyContent, description: bodyDescription }));
    };
    return Parameters;
}(external_react_["PureComponent"]));

function DropdownWithinHeader(props) {
    return external_react_["createElement"](UnderlinedHeader, { key: "header" },
        "Request Body schema: ",
        external_react_["createElement"](DropdownOrLabel, Object(external_tslib_["__assign"])({}, props)));
}
function BodyContent(props) {
    var content = props.content, description = props.description;
    return external_react_["createElement"](MediaTypesSwitch_MediaTypesSwitch, { content: content, renderDropdown: DropdownWithinHeader }, function (_a) {
        var schema = _a.schema;
        return external_react_["createElement"](external_react_["Fragment"], null,
            description !== undefined && external_react_["createElement"](Markdown_Markdown, { source: description }),
            external_react_["createElement"](Schema_Schema, { skipReadOnly: true, key: "schema", schema: schema }));
    });
}

// CONCATENATED MODULE: ./src/components/Responses/ResponseTitle.tsx




var ResponseTitle_ResponseTitle = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ResponseTitle, _super);
    function ResponseTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponseTitle.prototype.render = function () {
        var _a = this.props, title = _a.title, type = _a.type, empty = _a.empty, code = _a.code, opened = _a.opened, className = _a.className, onClick = _a.onClick;
        return external_react_["createElement"]("div", { className: className, onClick: !empty && onClick || undefined },
            !empty && external_react_["createElement"](ShelfIcon, { size: '1.5em', color: type, direction: opened ? 'down' : 'right', float: 'left' }),
            external_react_["createElement"]("strong", null,
                code,
                " "),
            external_react_["createElement"](Markdown_Markdown, { compact: true, inline: true, source: title }));
    };
    return ResponseTitle;
}(external_react_["PureComponent"]));


// CONCATENATED MODULE: ./src/components/Responses/styled.elements.ts

// import { transparentize } from 'polished';



var StyledResponseTitle = styled_components(ResponseTitle_ResponseTitle)(Responses_styled_elements_templateObject_1 || (Responses_styled_elements_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 10px;\n  border-radius: 6px;\n  margin-bottom: 4px;\n  line-height: 1.5em;\n  background-color: #f2f2f2;\n  cursor: pointer;\n\n  color: ", ";\n  background-color: ", ";\n\n  ", ";\n"], ["\n  padding: 10px;\n  border-radius: 6px;\n  margin-bottom: 4px;\n  line-height: 1.5em;\n  background-color: #f2f2f2;\n  cursor: pointer;\n\n  color: ", ";\n  background-color: ", ";\n\n  ",
    ";\n"])), function (props) { return props.theme.colors.responses[props.type].color; }, function (props) { return props.theme.colors.responses[props.type].backgroundColor; }, function (props) { return props.empty && "\ncursor: default;\n&::before {\n  content: \"\u2014\";\n  font-weight: bold;\n  width: 1.5em;\n  text-align: center;\n  display: inline-block;\n}\n" || ''; });
var ResponseDetailsWrap = styled_components.div(Responses_styled_elements_templateObject_2 || (Responses_styled_elements_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  padding: 10px;\n"], ["\n  padding: 10px;\n"])));
var HeadersCaption = styled_components(UnderlinedHeader.withComponent('caption'))(Responses_styled_elements_templateObject_3 || (Responses_styled_elements_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  text-align: left;\n  margin-top: 1em;\n  caption-side: top;\n"], ["\n  text-align: left;\n  margin-top: 1em;\n  caption-side: top;\n"])));
var Responses_styled_elements_templateObject_1, Responses_styled_elements_templateObject_2, Responses_styled_elements_templateObject_3;

// CONCATENATED MODULE: ./src/components/Responses/ResponseHeaders.tsx






var ResponseHeaders_ResponseHeaders = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ResponseHeaders, _super);
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
    Object(external_tslib_["__extends"])(ResponseDetails, _super);
    function ResponseDetails() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderDropdown = function (props) {
            return external_react_["createElement"](UnderlinedHeader, { key: "header" },
                "Response Schema: ",
                external_react_["createElement"](DropdownOrLabel, Object(external_tslib_["__assign"])({}, props)));
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
    Object(external_tslib_["__extends"])(ResponseView, _super);
    function ResponseView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.toggle = function () {
            _this.props.response.toggle();
        };
        return _this;
    }
    ResponseView.prototype.render = function () {
        var _a = this.props.response, headers = _a.headers, type = _a.type, summary = _a.summary, description = _a.description, code = _a.code, expanded = _a.expanded, content = _a.content;
        var mimes = content === undefined ? [] : content.mediaTypes.filter(function (mime) { return mime.schema !== undefined; });
        var empty = headers.length === 0 && mimes.length === 0 && !description;
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](StyledResponseTitle, { onClick: this.toggle, type: type, empty: empty, title: summary || '', code: code, opened: expanded }),
            expanded && !empty && external_react_["createElement"](ResponseDetailsWrap, null,
                external_react_["createElement"](ResponseDetails_ResponseDetails, { response: this.props.response })));
    };
    ResponseView = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ResponseView);
    return ResponseView;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/Responses/ResponsesList.tsx




var ResponsesHeader = styled_components.h3(ResponsesList_templateObject_1 || (ResponsesList_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: 18px;\n  padding: 0.2em 0;\n  margin: 3em 0 1.1em;\n  color: #253137;\n  font-weight: normal;\n"], ["\n  font-size: 18px;\n  padding: 0.2em 0;\n  margin: 3em 0 1.1em;\n  color: #253137;\n  font-weight: normal;\n"])));
var ResponsesList_ResponsesList = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ResponsesList, _super);
    function ResponsesList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResponsesList.prototype.render = function () {
        var responses = this.props.responses;
        if (!responses || responses.length === 0) {
            return null;
        }
        return external_react_["createElement"]("div", null,
            external_react_["createElement"](ResponsesHeader, null, " Responses "),
            responses.map(function (response) {
                return external_react_["createElement"](Response_ResponseView, { key: response.code, response: response });
            }));
    };
    return ResponsesList;
}(external_react_["PureComponent"]));

var ResponsesList_templateObject_1;

// CONCATENATED MODULE: ./src/components/SecurityRequirement/SecurityRequirement.tsx

// import { transparentize } from 'polished';




var ScopeName = styled_components.code(SecurityRequirement_templateObject_1 || (SecurityRequirement_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  font-size: ", ";\n  font-family: ", ";\n  border: 1px solid ", ";\n  margin: 0 3px;\n  padding: 0.2em;\n  display: inline-block;\n  line-height: 1;\n\n  &:after {\n    content: ',';\n  }\n  &:last-child:after {\n    content: none;\n  }\n"], ["\n  font-size: ", ";\n  font-family: ", ";\n  border: 1px solid ",
    ";\n  margin: 0 3px;\n  padding: 0.2em;\n  display: inline-block;\n  line-height: 1;\n\n  &:after {\n    content: ',';\n  }\n  &:last-child:after {\n    content: none;\n  }\n"])), function (props) { return props.theme.typography.code.fontSize; }, function (props) { return props.theme.typography.code.fontFamily; }, function (_a) {
    var theme = _a.theme;
    return theme.colors.border.dark;
});
var SecurityRequirementAndWrap = styled_components.span(SecurityRequirement_templateObject_2 || (SecurityRequirement_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  &:after {\n    content: ' AND ';\n    font-weight: bold;\n  }\n\n  &:last-child:after {\n    content: none;\n  }\n\n  ", ";\n"], ["\n  &:after {\n    content: ' AND ';\n    font-weight: bold;\n  }\n\n  &:last-child:after {\n    content: none;\n  }\n\n  ", ";\n"])), linksCss);
var SecurityRequirementOrWrap = styled_components.span(SecurityRequirement_templateObject_3 || (SecurityRequirement_templateObject_3 = Object(external_tslib_["__makeTemplateObject"])(["\n  &:before {\n    content: '( ';\n    font-weight: bold;\n  }\n  &:after {\n    content: ' ) OR ';\n    font-weight: bold;\n  }\n  &:last-child:after {\n    content: ' )';\n  }\n\n  &:only-child:before,\n  &:only-child:after {\n    content: none;\n  }\n\n  ", ";\n"], ["\n  &:before {\n    content: '( ';\n    font-weight: bold;\n  }\n  &:after {\n    content: ' ) OR ';\n    font-weight: bold;\n  }\n  &:last-child:after {\n    content: ' )';\n  }\n\n  &:only-child:before,\n  &:only-child:after {\n    content: none;\n  }\n\n  ", ";\n"])), linksCss);
var SecurityRequirement_SecurityRequirement = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SecurityRequirement, _super);
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

var AuthHeaderColumn = styled_components.div(SecurityRequirement_templateObject_4 || (SecurityRequirement_templateObject_4 = Object(external_tslib_["__makeTemplateObject"])(["\n  flex: 1;\n"], ["\n  flex: 1;\n"])));
var SecuritiesColumn = styled_components.div(SecurityRequirement_templateObject_5 || (SecurityRequirement_templateObject_5 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: ", ";\n"], ["\n  width: ", ";\n"])), function (props) { return props.theme.schema.defaultDetailsWidth; });
var AuthHeader = styled_components(UnderlinedHeader)(SecurityRequirement_templateObject_6 || (SecurityRequirement_templateObject_6 = Object(external_tslib_["__makeTemplateObject"])(["\n  display: inline-block;\n  margin: 0;\n"], ["\n  display: inline-block;\n  margin: 0;\n"])));
var SecurityRequirement_Wrap = styled_components.div(SecurityRequirement_templateObject_7 || (SecurityRequirement_templateObject_7 = Object(external_tslib_["__makeTemplateObject"])(["\n  width: 100%;\n  display: flex;\n  margin: 1em 0;\n"], ["\n  width: 100%;\n  display: flex;\n  margin: 1em 0;\n"])));
var SecurityRequirement_SecurityRequirements = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SecurityRequirements, _super);
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

var SecurityRequirement_templateObject_1, SecurityRequirement_templateObject_2, SecurityRequirement_templateObject_3, SecurityRequirement_templateObject_4, SecurityRequirement_templateObject_5, SecurityRequirement_templateObject_6, SecurityRequirement_templateObject_7;

// CONCATENATED MODULE: ./src/components/SideMenu/index.ts





// CONCATENATED MODULE: ./src/components/Operation/Operation.tsx
















var OperationRow = styled_components(Row)(Operation_templateObject_1 || (Operation_templateObject_1 = Object(external_tslib_["__makeTemplateObject"])(["\n  backface-visibility: hidden;\n  contain: content;\n\n  overflow: hidden;\n"], ["\n  backface-visibility: hidden;\n  contain: content;\n\n  overflow: hidden;\n"])));
var Description = styled_components.div(Operation_templateObject_2 || (Operation_templateObject_2 = Object(external_tslib_["__makeTemplateObject"])(["\n  margin-bottom: ", "px;\n"], ["\n  margin-bottom: ",
    "px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.spacing.unit * 6;
});
var Operation_Operation = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(Operation, _super);
    function Operation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Operation.prototype.render = function () {
        var operation = this.props.operation;
        var summary = operation.name, description = operation.description, deprecated = operation.deprecated, externalDocs = operation.externalDocs;
        var hasDescription = !!(description || externalDocs);
        return external_react_["createElement"](OptionsContext.Consumer, null, function (options) { return external_react_["createElement"](OperationRow, null,
            external_react_["createElement"](MiddlePanel, null,
                external_react_["createElement"]("div", { style: {
                        display: 'flex'
                    } },
                    external_react_["createElement"]("div", { style: {
                            zoom: '125%'
                        } },
                        external_react_["createElement"](OperationBadge, { type: operation.httpVerb }, shortenHTTPVerb(operation.httpVerb))),
                    external_react_["createElement"]("div", { style: {
                            margin: '-5px 0 0 7px'
                        } },
                        external_react_["createElement"]("div", { style: {
                                fontWeight: 'bolder'
                            } },
                            external_react_["createElement"](H2, null,
                                summary,
                                " ",
                                deprecated && external_react_["createElement"](Badge, { type: "warning" }, " Deprecated "))),
                        external_react_["createElement"]("div", null,
                            options.pathInMiddlePanel && external_react_["createElement"](Endpoint_Endpoint, { operation: operation, inverted: true }),
                            hasDescription && external_react_["createElement"](Description, null,
                                description !== undefined && external_react_["createElement"](Markdown_Markdown, { source: description }),
                                externalDocs && external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs }))))),
                external_react_["createElement"](Extensions_Extensions, { extensions: operation.extensions }),
                external_react_["createElement"](SecurityRequirement_SecurityRequirements, { securities: operation.security }),
                external_react_["createElement"](Parameters_Parameters, { parameters: operation.parameters, body: operation.requestBody }),
                external_react_["createElement"](ResponsesList_ResponsesList, { responses: operation.responses })),
            external_react_["createElement"](DarkRightPanel, null,
                external_react_["createElement"](OperationPanel_OperationPanel, { operation: operation, options: options }))); });
    };
    Operation = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], Operation);
    return Operation;
}(external_react_["Component"]));

var Operation_templateObject_1, Operation_templateObject_2;

// CONCATENATED MODULE: ./src/components/ContentItems/ContentItems.tsx







var ContentItems_ContentItems = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ContentItems, _super);
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
    ContentItems = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ContentItems);
    return ContentItems;
}(external_react_["Component"]));

var ContentItems_ContentItem = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ContentItem, _super);
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
                content = external_react_["createElement"](ContentItems_SectionItem, Object(external_tslib_["__assign"])({}, this.props));
                break;
            case 'operation':
                content = external_react_["createElement"](ContentItems_OperationItem, { item: item });
                break;
            default:
                content = external_react_["createElement"](ContentItems_SectionItem, Object(external_tslib_["__assign"])({}, this.props));
        }
        return external_react_["createElement"](external_react_["Fragment"], null,
            content && external_react_["createElement"](Section, { id: item.id, underlined: item.type === 'operation' }, content),
            item.items && external_react_["createElement"](ContentItems_ContentItems, { items: item.items }));
    };
    ContentItem = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ContentItem);
    return ContentItem;
}(external_react_["Component"]));

var middlePanelWrap = function (component) { return external_react_["createElement"](MiddlePanel, { compact: true }, component); };
var ContentItems_SectionItem = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(SectionItem, _super);
    function SectionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SectionItem.prototype.render = function () {
        var _a = this.props.item, name = _a.name, description = _a.description, externalDocs = _a.externalDocs, level = _a.level;
        var Header = level === 2 ? H2 : H1;
        return external_react_["createElement"](external_react_["Fragment"], null,
            external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, { compact: false },
                    external_react_["createElement"](Header, null,
                        external_react_["createElement"](ShareLink, { to: this.props.item.id }),
                        name))),
            external_react_["createElement"](AdvancedMarkdown_AdvancedMarkdown, { source: description || '', htmlWrap: middlePanelWrap }),
            externalDocs && external_react_["createElement"](Row, null,
                external_react_["createElement"](MiddlePanel, null,
                    external_react_["createElement"](ExternalDocumentation_ExternalDocumentation, { externalDocs: externalDocs }))));
    };
    SectionItem = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], SectionItem);
    return SectionItem;
}(external_react_["Component"]));

var ContentItems_OperationItem = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(OperationItem, _super);
    function OperationItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationItem.prototype.render = function () {
        return external_react_["createElement"](Operation_Operation, { operation: this.props.item });
    };
    OperationItem = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], OperationItem);
    return OperationItem;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/JsonViewer/index.tsx


// CONCATENATED MODULE: ./src/components/ResponseSamples/ResponseSamples.tsx





var ResponseSamples_ResponseSamples = /** @class */ (function (_super) {
    Object(external_tslib_["__extends"])(ResponseSamples, _super);
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
    ResponseSamples = Object(external_tslib_["__decorate"])([
        external_mobx_react_["observer"]
    ], ResponseSamples);
    return ResponseSamples;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/components/index.ts































// CONCATENATED MODULE: ./src/index.ts








/***/ })
/******/ ]);
});
//# sourceMappingURL=redoc.lib.js.map