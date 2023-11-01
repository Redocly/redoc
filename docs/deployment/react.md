---
seo:
  title: Use the Redoc React component
redirects:
  '/docs/redoc/quickstart/react/':
    to: '/docs/redoc/deployment/react/'
---

# How to use the Redoc React component

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
[Configuration options for Reference docs](https://redocly.com/docs/api-reference-docs/configuration/functionality/)
section of the documentation. Options available for Redoc are noted,
"Supported in Redoc CE".

## Optional - Specify `onLoaded` callback

You can also specify the `onLoaded` callback, which is called each time Redoc
is fully rendered or when an error occurs (with an error as the first argument).

```js
<RedocStandalone
  specUrl="http://petstore.swagger.io/v2/swagger.json"
  onLoaded={(error) => {
    if (!error) {
      console.log('Yay!');
    }
  }}
/>
```
