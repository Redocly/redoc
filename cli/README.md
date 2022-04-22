# redoc-cli

**[ReDoc](https://github.com/Redocly/redoc)'s Command Line Interface**

## Installation

You can use `redoc-cli` by installing [the package](https://www.npmjs.com/package/redoc-cli) globally,
or using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

## Usage

The two following commands are available:

- `redoc-cli serve [spec]` - starts the server with `spec` rendered with ReDoc.
  Supports a server-side rendering mode (`--ssr`)
  and can watch the spec (`--watch`) to automatically reload the page whenever it changes.\
  Deprecated. Use `npx @redocly/openapi-cli preview-docs [spec]`
- `redoc-cli bundle [spec]` - bundles `spec` and Redoc into a **zero-dependency** HTML file.\
  Deprecated. Use Use "build" command instead.
- `redoc-cli build [spec]` - build `spec` and Redoc into a **zero-dependency** HTML file.

Some examples:

- Bundle with the main color changed to `orange`:<br/>
  `$ redoc-cli build [spec] --options.theme.colors.primary.main=orange`
- Serve with the `nativeScrollbars` option set to true:<br/>
  `$ redoc-cli serve [spec] --options.nativeScrollbars`
- Bundle using a custom [Handlebars](https://handlebarsjs.com/) template
  (check the [default template](https://github.com/Redocly/redoc/blob/master/cli/template.hbs) for an example):<br/>
  `$ redoc-cli build [spec] -t custom.hbs`
- Bundle using a custom template and add custom `templateOptions`:<br/>
  `$ redoc-cli build [spec] -t custom.hbs --templateOptions.metaDescription "Page meta description"`

For more details, run `redoc-cli --help`.
