# Redoc-cli

Redoc CLI is an open source tool that provides linting against a customizable ruleset, as well as bundling of the OpenAPI files into a single file. You can also preview the output of your docs with the Redocly API References through this tool.

## Installation
You can use redoc cli by installing `redoc-cli` globally or using [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

## Usage

Two following commands are available:

- `redoc-cli serve [spec]` - starts the server with `spec` rendered with ReDoc. Supports SSR mode (`--ssr`) and can watch the spec (`--watch`)
- `redoc-cli bundle [spec]` - bundles spec and ReDoc into **zero-dependency** HTML file.

Some examples:

- Bundle with main color changed to `orange`: <br> `$ redoc-cli bundle [spec] --options.theme.colors.primary.main=orange`
- Serve with `nativeScrollbars` option set to true: <br> `$ redoc-cli serve [spec] --options.nativeScrollbars`
- Bundle using custom template (check [default template](https://github.com/Redocly/redoc/blob/master/cli/template.hbs) for reference): <br> `$ redoc-cli bundle [spec] -t custom.hbs`
- Bundle using custom template and add custom `templateOptions`: <br> `$ redoc-cli bundle [spec] -t custom.hbs --templateOptions.metaDescription "Page meta description"`

For more details run `redoc-cli --help`.
