---
seo:
  title: Use the Redoc HTML element
---

# Use Redoc in HTML

To render API documentation in an HTML page, start with the template below and
replace the `spec-url` value with the local file path or URL of your API
description.

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
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
  </body>
</html>
```

{% admonition type="success" name="URL or local file" %}
Set `spec-url` to a relative path if the file is local, e.g. `spec-url=my-api.yaml`. Use a full URL like the example above if it's hosted elsewhere.
{% /admonition %}

Open the HTML file in your browser to see the HTML documentation rendering. You may want to read the next section and add some configuration to make your documentation your own.

## Configure Redoc

Redoc is highly configurable, find a [full list of configuration options](../config.md) on the dedicated page.

To configure Redoc in HTML, add the property names to the HTML tag. Here's an example that makes all the required properties display first in the list:

```html
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json' required-props-first=true></redoc>
```

Any of the individual properties can be added to the tag, as many as you need to get your API docs set up as you like them.

### Theme configuration

The `theme` configuration setting is more complex since it represents many nested options, you can supply these as a JSON string to the `theme` attribute. For example, to change the sidebar color you would use a tag like this:

```html
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json'
       required-props-first=true
       theme='{
         "sidebar": {
           "backgroundColor": "lightblue"
         }
       }'
    ></redoc>
```

Check out the [list of options for theme configuration](../config.md#theme-settings) and build up the configuration that suits your API needs.

## Advanced options

### The Redoc object

As an alternative to the HTML tag, you can also initialise Redoc in a web page using the Redoc object and invoking it from JavaScript. This is useful for situations where you want to create dynamic content in a page, and also provides a simple way to attach the Redoc element to an existing container.

The Redoc object offers an `init` function:

```js
Redoc.init(specOrSpecUrl, options, element, callback)
```
- `specOrSpecUrl`: Either a JSON object with the OpenAPI definition or a file name/URL to the
  definition in JSON or YAML format.
- `options`: See the [configuration reference](../config.md).
- `element`: DOM element Redoc is inserted into.
- `callback`(optional): Callback to be called after Redoc has been fully rendered.
  It is also called on errors with `error` as the first argument.

Call `Redoc.init()` from the JavaScript on a web page to add the element to the named container. Below is an example of an HTML page with a `<div>` tag, and the JavaScript to add the Redoc object to it.

```html
<!DOCTYPE html>
<html>
  <head />
  <body>
    <H1>Redoc in action</H1>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
    <div id="redoc-container"></div>

    <script>
      Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
        "expandResponses": "200,400"
      }, document.getElementById('redoc-container'))
    </script>
  </body>
</html>
```

This example also sets the configuration for `expandResponses` so all 200 and 400 status responses are shown unfolded and with their details visible when the page loads.

### Self-host dependencies

You can reference the Redoc script using either a link to the files hosted on a CDN
or install to your `node-modules` folder. Using the CDN is the simplest option, but
if you need to host in a closed environment or have requirements around external
dependencies, it may be useful to self-host.

The main example shows using the CDN:

```html
<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
```

If you would instead prefer to host the depdencies yourself, first install `redoc` using `npm`:

```sh
npm install redoc
```

_(Yarn users can install the `redoc` package with `yarn`)_.

You can then reference the Redoc script with a node modules link:

```html
<script src="node_modules/redoc/bundles/redoc.standalone.js"> </script>
```

