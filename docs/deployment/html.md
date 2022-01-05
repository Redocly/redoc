---
title: Using the Redoc HTML element
redirectFrom:
  - /docs/quickstart/html/
---

# Using the Redoc HTML element

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