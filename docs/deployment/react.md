---
title: Using the Redoc React component
---

# Using the Redoc React component

## Before you start

Install the following dependencies required by Redoc if you do not already have them installed:

- `react`
- `react-dom`
- `mobx`
- `styled-components`
- `core-js`

If you have npm installed, you can install these dependencies using the following command:

```js
npm i react react-dom mobx styled-components core-js
```

## Step 1 - Import the `RedocStandalone` component

```js
import { RedocStandalone } from 'redoc';
```

### IE polyfills

If you use Redoc as a React component and you want your OpenAPI definition to render with
IE browsers, include the following polyfills in your project:

```
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

## Step 2 - Use the component

You can either link to your OpenAPI definition with a URL, using the following format:

```react
<RedocStandalone specUrl="url/to/your/spec"/>
```

Or you can pass your OpenAPI definition as an object, using the following format:

```js
<RedocStandalone spec={/* spec as an object */}/>
```

## Optional - Pass options

Options can be passed into the RedocStandalone component to alter how it renders. 

For example:

```js
<RedocStandalone
  specUrl="http://petstore.swagger.io/v2/swagger.json"
  options={{
    nativeScrollbars: true,
    theme: { colors: { primary: { main: '#dd5522' } } },
  }}
/>
```

For more information on configuration options, refer to the 
[Configuration options for Reference docs](https://redoc.ly/docs/api-reference-docs/configuration/)
section of the documentation. Options available for Redoc are noted,
"Supported in Redoc CE".

## Optional - Specify `onLoaded` callback

You can also specify the `onLoaded` callback, which is called each time Redoc
is fully rendered or when an error occurs (with an error as the first argument).

```js
<RedocStandalone
  specUrl="http://petstore.swagger.io/v2/swagger.json"
  onLoaded={error => {
    if (!error) {
      console.log('Yay!');
    }
  }}
/>
```
