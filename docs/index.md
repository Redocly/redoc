---
seo:
  title: Redoc
---

# Redoc: Open source API documentation tool

Redoc is a clean and easy way to produce web-ready documentation from an OpenAPI description (Swagger is also still supported). With one command, create your documentation, and customize it to meet the needs of your users.

Redoc is based around a three panel layout, with clear sections for navigation, detailed documentation, and request/response examples.

## Headline features

* Modern layout with extensive customization options.
* Support for OpenAPI 3.1, 3.0 and older 2.0 and Swagger formats.
* Embed or build standalone HTML documentation.
* CLI tool for easy automation and local development.

## Demo

[Try the live demo](https://redocly.github.io/redoc/) and upload your own API specification there to try.

## Usage

Redoc is provided as a CLI tool (also distributed as a Docker image), HTML tag, and React component.

### Generate documentation from the CLI

If you have Node installed, quickly generate documentation using `npx`:

```sh
npx @redocly/cli build-docs openapi.yaml
```

The tool outputs by default to a file named `redoc-static.html` that you can open in your browser.

> [Redocly CLI](https://github.com/Redocly/redocly-cli/) does more than docs, check it out and add linting, bundling and more to your API workflow.

### Add an HTML element to the page

Create an HTML page, or edit an existing one, and add the following:

```html
    <redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
```

Open the HTML file in your browser, and your API documentation is shown on the page.

Add your own `spec-url` to the `<redoc>` tag; this attribute can also be a local file. The JavaScript library can also be installed locally using `npm` and served from your own server, see the [HTML deployment documentation](https://redocly.com/docs/redoc/deployment/html/) for more details.

### More usage options

Check out the [deployment documentation](./deployment/intro.md) for more options, and detailed documentation for each.

## Configure Redoc

Redoc is highly configurable. Each deployment option accepts configuration in a way that's appropriate to that platform, but the options are the same for each. For example:

* Using [Redocly CLI](../cli), configuration goes in the `redocly.yaml` file, or can be supplied as command line parameters, such as `--theme.openapi.disableSearch`.
* Using HTML or React, configure by setting `option` in the tag.

Here's a sample `redocly.yaml` configuration file, showing a few common settings and tweaking some of the visual theme settings:

```yaml
theme:
  openapi:
    disableSearch: true
    expandResponses: 200,202
    jsonSamplesExpandLevel: 1

    theme:
      sidebar:
        backgroundColor: '#eae0cc'
        textColor: '#3d005b'
      colors:
        primary:
          main: '#660099'
      typography:
        fontSize: 14pt
        headings:
          fontWeight: bold
```

Redocly CLI detects a file named `redocly.yaml` in the same directory as you run the command and uses it. See the documentation with a command like this:

```sh
redocly build-docs openapi.yaml
```

There are many, many more options available. Visit the [configuration reference](./config.md) for a complete list.

## Next steps

* If you are new to OpenAPI, try the [OpenAPI starter project](../cli/openapi-starter) for a great introduction.
* Ready to build documentation from an existing OpenAPI file? Go to the [Redoc quickstart](./quickstart.md) and get started.
* Learn more about the project by visiting [Redoc on GitHub](https://github.com/Redocly/redoc).
