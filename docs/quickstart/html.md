---
title: Using the Redoc HTML element
---

# Using the Redoc HTML element

## TL;DR final code example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Redoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    Redoc doesn't change outer page styles
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
    <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"> </script>
  </body>
</html>

```

:::attention Running Redoc locally requires an HTTP server
Loading local OpenAPI definitions is impossible without running a web server because of issues with
[same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) and
other security reasons. 
:::

### Running Redoc locally

If you want to view your Redoc output locally, you can simulate an HTTP server.

#### Using Redocly OpenAPI CLI

Redocly OpenAPI CLI is an open source command-line tool that includes a command
for simulating an HTTP server to provide a preview of your OpenAPI definition locally.

If you have [OpenAPI CLI](https://redoc.ly/docs/cli/#installation-and-usage) installed, `cd` into your
project directory and run the following command:

```bash
openapi preview-docs openapi.yaml
```

By default, without providing a port, the preview starts on port 8080, and can be accessed at `http://localhost:8080`.
To exit the preview, use `control+C`.

#### Using Python

If you have [Python 3](https://www.python.org/downloads/) installed, `cd` into your
project directory and run the following command:

```python
python3 -m http.server
```

If you have [Python 2](https://www.python.org/downloads/) installed, `cd` into your
project directory and run the following command:

```python
python -m SimpleHTTPServer 8000
```

The output after entering the command provides the local URL where the preview can be accessed.
To exit the preview, use `control-C`.

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

The output after entering the command provides the local URL where the preview can be accessed.
To exit the preview, use `control-C`.

## Step 1 - Install Redoc

You can install Redoc using one of the following package managers:

- [npm](https://docs.npmjs.com/about-npm)
- [yarn](https://classic.yarnpkg.com/en/docs/getting-started)

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

### Install Redoc with yarn

After navigating to your project directory in your terminal, use the following command: 

```bash
yarn add redoc
```

### Install Redoc with npm

After navigating to your project directory in your terminal, use the following command: 

```bash
npm i redoc
```

## Step 2 - Reference the Redoc script

You can reference the Redoc script using either a link to the files hosted on a CDN
or the files located in your `node modules` folder.

### CDN link

To reference the Redoc script with a CDN link:

```html
<script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"> </script>
```

### Node modules link

To reference the Redoc script with a node modules link:

```html
<script src="node_modules/redoc/bundles/redoc.standalone.js"> </script>
```

## Step 3 - Add the <redoc> element

You can add the <redoc> element to your HTML page and reference your OpenAPI
definition using the `spec-url` attribute, or you can initialize Redoc using
a globally exposed Redoc object.

### Using the `spec-url` attribute

To add the <redoc> element with the `spec-url` attribute:

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

### Using a Redoc object

To add the <redoc> element with a globally exposed Redoc object:

```js
Redoc.init(specOrSpecUrl, options, element, callback)
```
- `specOrSpecUrl`: Either a JSON object with the OpenAPI definition or a URL to the
  definition in JSON or YAML format.
- `options`: See [options object](https://redoc.ly/docs/api-reference-docs/configuration/) reference.
- `element`: DOM element Redoc will be inserted into.
- `callback`(optional): Callback to be called after Redoc has been fully rendered.
  It is also called on errors with `error` as the first argument.

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