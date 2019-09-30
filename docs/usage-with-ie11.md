# Usage With IE11


## Standalone package

IE11 is supported by default if you use ReDoc as a standalone package.

## Usage as a React component

If you use ReDoc as a React component you should include the following polyfills in your project:

```js
import 'core-js/es6/promise';
import 'core-js/fn/array/find';
import 'core-js/fn/object/assign';
import 'core-js/fn/string/ends-with';
import 'core-js/fn/string/starts-with';

import 'core-js/es6/map';
import 'core-js/es6/symbol';

import 'unfetch/polyfill/index'; // or any other fetch polyfill
import 'url-polyfill';
```
