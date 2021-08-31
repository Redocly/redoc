---
title: Using the Redoc CLI
---

# Using the Redoc CLI

With Redoc's command-line interface you can bundle your OpenAPI definition and API documentation
(made with Redoc) into a zero-dependency HTML file and locally render your
OpenAPI definition with Redoc.

## Step 1 - Install Redoc CLI

You can install the `redoc-cli` package globally using one of the following package managers:

- [npm](https://docs.npmjs.com/about-npm)
- [yarn](https://classic.yarnpkg.com/en/docs/getting-started)

Or you can install `redoc-cli` using [npx](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/).

### Install Redoc CLI with yarn

To install the `redoc-cli` package globally with yarn: 

```bash
yarn global add redoc-cli
```

### Install Redoc with npm

To install the `redoc-cli` package globally with npm: 

```bash
npm i -g redoc-cli
```

### Install with `npx`

To install the `redoc-cli` package locally with `npx`, navigate to your project
directory in your terminal, then use the following command:

```bash
npx redoc-cli
```

## Step 2 - Use the CLI

### Redoc CLI commands

The CLI includes the following commands:

- **`redoc-cli serve [spec]`:** Starts a local server with Redoc. You must include the required parameter, spec, which is
  a reference to an OpenAPI definition. Options include:
    - `--ssr`: Implements a server-side rendering model. 
    - `--watch`: Automatically reloads the server while you edit your OpenAPI definition.
    - `--options`: Customizes your output using [Redoc options](https://redoc.ly/docs/api-reference-docs/configuration/).
      To add nested options, use dot notation.
- **`redoc-cli bundle [spec]`:** Bundles `spec` and Redoc into a zero-dependency HTML file. Options include:
    - `-t` or `--template`: Uses custom [Handlebars](https://handlebarsjs.com/) templates to render your OpenAPI definition.
    - `--templateOptions`: Adds template options you want to pass to your
      custom Handlebars template. To add options, use dot notation.
- **`--help`:** Prints help text for the Redoc CLI commands and options.
- **`--version`:** Prints the version of the `redoc-cli` package you have installed.

### Redoc CLI examples

#### Bundle

Bundle with the main color changed to `orange`:

```bash
redoc-cli bundle openapi.yaml --options.theme.colors.primary.main=orange
```

Bundle using a custom Handlebars template and add custom `templateOptions`:

```bash
redoc-cli bundle http://petstore.swagger.io/v2/swagger.json -t custom.hbs --templateOptions.metaDescription "Page meta description"
```

Sample Handlebars template:

```handlebars
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8" />
        <title>{{title}}</title>
        <!-- needed for adaptive design -->
        <meta description="{{{templateOptions.metaDescription}}}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
            padding: 0;
            margin: 0;
            }
        </style>
        {{{redocHead}}}
        {{#unless disableGoogleFont}}<link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">{{/unless}}
    </head>
    <body>
      {{{redocHTML}}}
    </body>
</html>
```

#### Serve

Serve with the `nativeScrollbars` option set to `true`:

```bash
redoc-cli serve  openapi/dist.yaml --options.nativeScrollbars
```
