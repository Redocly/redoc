---
title: Redoc HTML element
---

# ReDoc HTML element

## TL;DR Final code example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
  </body>
</html>

```

:::attention Running Redoc locally requires an HTTP server
Loading local OpenAPI specifications is impossible without running a web-server because of issues with
[same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) and
other security reasons. 
:::

### Running ReDoc locally

If you want to view your ReDoc output locally, you can simulate an HTTP server.

#### Using Python

If you have [Python3](https://www.python.org/downloads/) installed, `cd` into your
project directory and run the following command:

```python
python3 -m http.server
```

#### Using Node.js

If you have [Node.js](https://nodejs.org/en/download/) installed, install `http-server`
using the following npm command:

```bash
npm install -g http-server
```

Then, `cd` into your project directory and run the following command:

```node
http-server
```

## Step 1 - Install ReDoc

You can install ReDoc using one of the following package managers,
[npm](https://docs.npmjs.com/about-npm) or [yarn](https://classic.yarnpkg.com/en/docs/getting-started). 

:::attention Initialize your package manager
If you do not have a `package.json` file in your project directory,
you need to add one by initializing npm or yarn in your project. Use the command `npm init` for npm,
or `yarn init` for yarn. These initialization commands will lead you through the process
of creating a `package.json` file in your project. 

For more information, see 
[Creating a package.json file](https://docs.npmjs.com/creating-a-package-json-file)
in the npm documentation or [Yarn init](https://classic.yarnpkg.com/en/docs/cli/init/)
in the yarn documentation.
:::

### Install with yarn

To install ReDoc using yarn, after navigating to your project directory in your terminal,
use the following command: 

```sh
yarn add redoc
```

### Install with npm

To install ReDoc using npm, after navigating to your project directory in your terminal,
use the following command: 

```sh
npm i redoc
```

## Step 2 - Reference the ReDoc script

You can reference the ReDoc script using either a link to the files hosted on a CDN
or the files located in your node modules folder.

### CDN link

To reference the ReDoc script with a CDN link:

```html
<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
```

### Node modules link

To reference the ReDoc script with a node modules link:

```html
<script src="node_modules/redoc/bundles/redoc.standalone.js"> </script>
```

## Step 3 - Add the <redoc> element

You can add the <redoc> element to your html page and reference your OpenAPI
specification using a `spec-url` attribute, or you can initialize ReDoc using
a globally exposed ReDoc object.

### Using a `spec-url` attribute

To add the <redoc> element with a `spec-url` attribute:

```html
<redoc spec-url="url/to/your/spec"></redoc>
```

#### Examples

```html
<redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc>
```

You can also use a local file (JSON or YAML) in your project, for instance:

```html
<redoc spec-url="dist.json"></redoc>
```

### Using a ReDoc object

To add the <redoc> element with a globally exposed ReDoc object:

```js
Redoc.init(specOrSpecUrl, options, element, callback)
```
- `specOrSpecUrl`: Either a JSON object with OpenAPI specification or a URL to the
  specification in JSON or YAML format.
- `options`: See [options object](https://redoc.ly/docs/api-reference-docs/configuration/) reference.
- `element`: DOM element ReDoc will be inserted into.
- `callback`(optional): Callback to be called after ReDoc has been fully rendered.
  It is also called on errors with error as the first argument.

#### Examples

```html
<script>
Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
  scrollYOffset: 50
}, document.getElementById('redoc-container'))
</script>
```

You can also use a local file (JSON or YAML) in your project, for instance:

```html
<script>
Redoc.init('dist.yaml', {
  scrollYOffset: 50
}, document.getElementById('redoc-container'))
</script>
```