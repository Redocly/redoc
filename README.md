<div align="center">
  <img alt="ReDoc logo" src="https://raw.githubusercontent.com/Redocly/redoc/master/docs/images/redoc-logo.png" width="400px" />

  <h2>Generate interactive API documentation from OpenAPI definitions</h2>
  
 </div>
 
 ![ReDoc demo](https://raw.githubusercontent.com/Redocly/redoc/master/demo/redoc-demo.png)
 
 **This README is for the `2.0` version of ReDoc (React-based). README for the `1.x` version is on the [v1.x](https://github.com/Redocly/redoc/tree/v1.x) branch.**
 
 # About ReDoc
 
TODO: Two-sentence introduction: what it does, who makes it, who it's for.
 
[Try the live demo](http://redocly.github.io/redoc/)

[Get started with ReDoc](link to Quick Start section/document)
 
 ## More from Redoc.ly
 
 [<img alt="Deploy to Github" src="http://i.imgur.com/YZmaqk3.png" height="60px">](https://github.com/Rebilly/generator-openapi-repo#generator-openapi-repo--) [<img alt="ReDoc as a service" src="http://i.imgur.com/edqdCv6.png" height="60px">](https://redoc.ly) [<img alt="Customization services" src="http://i.imgur.com/c4sUF7M.png" height="60px">](https://redoc.ly/#services)
 
 **What's the difference between ReDoc and other Redoc.ly products?**
 
TODO: Describe the difference, insert link to detailed feature comparison.
 
 ## Project Status
 
  [![Build Status](https://travis-ci.org/Redocly/redoc.svg?branch=master)](https://travis-ci.org/Redocly/redoc) [![Coverage Status](https://coveralls.io/repos/Redocly/redoc/badge.svg?branch=master&service=github)](https://coveralls.io/github/Redocly/redoc?branch=master) [![npm](http://img.shields.io/npm/v/redoc.svg)](https://www.npmjs.com/package/redoc) 

  [![bundle size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js?compression=gzip&max=300000)](https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js) [![npm](https://img.shields.io/npm/dm/redoc.svg)](https://www.npmjs.com/package/redoc) [![](https://data.jsdelivr.com/v1/package/npm/redoc/badge)](https://www.jsdelivr.com/package/npm/redoc) [![Docker Build Status](https://img.shields.io/docker/build/redocly/redoc.svg)](https://hub.docker.com/r/redocly/redoc/)
  
  **Project License** 
  
[![License](https://img.shields.io/npm/l/redoc.svg)](https://github.com/Redocly/redoc/blob/master/LICENSE)
  
TODO: Link to contributing guidelines


# Table of Contents

TODO: add links

- Feature Guide
- Quick Start Guide
  - Support
- Installation and Usage
  - Standalone
  - React component
  - redoc-cli
  - Docker
- Configuration
  - Advanced Options
- Who is using ReDoc?
- Project Development
  - Roadmap
  - Contributing
  - Releases
  - OpenAPI Version Support


# Feature Guide

TODO:

Insert a table that compares ReDoc Community Edition features and premium features.

Clean up the old list of features with animated GIFs.

Mention how ReDoc can integrate into a workflow with other tools like create-openapi-repo.


# Quick Start Guide

TODO:

- Provide steps for the fastest way to build something
- Clarify that OpenAPI specs must be edited in another tool - redoc only builds them!


## Support

TODO:

Links to

- **FAQ**
- **Documentation**
- **How to report an issue**


# Installation and Usage

TODO:

- List all supported ways to install and deploy
- For each, include **Dependencies and Prerequisites**


# Configuration

TODO: Clean up and reorganize this section

## Security Definition location
You can inject Security Definitions widget into any place of your specification `description`. Check out details [here](docs/security-definitions-injection.md).

## Swagger vendor extensions
ReDoc makes use of the following [vendor extensions](https://swagger.io/specification/#specificationExtensions):
* [`x-logo`](docs/redoc-vendor-extensions.md#x-logo) - is used to specify API logo
* [`x-traitTag`](docs/redoc-vendor-extensions.md#x-traitTag) - useful for handling out common things like Pagination, Rate-Limits, etc
* [`x-codeSamples`](docs/redoc-vendor-extensions.md#x-codeSamples) - specify operation code samples
* [`x-examples`](docs/redoc-vendor-extensions.md#x-examples) - specify JSON example for requests
* [`x-nullable`](docs/redoc-vendor-extensions.md#x-nullable) - mark schema param as a nullable
* [`x-displayName`](docs/redoc-vendor-extensions.md#x-displayname) - specify human-friendly names for the menu categories
* [`x-tagGroups`](docs/redoc-vendor-extensions.md#x-tagGroups) - group tags by categories in the side menu
* [`x-servers`](docs/redoc-vendor-extensions.md#x-servers) - ability to specify different servers for API (backported from OpenAPI 3.0)
* [`x-ignoredHeaderParameters`](docs/redoc-vendor-extensions.md#x-ignoredHeaderParameters) - ability to specify header parameter names to ignore
* [`x-additionalPropertiesName`](docs/redoc-vendor-extensions.md#x-additionalPropertiesName) - ability to supply a descriptive name for the additional property keys

## `<redoc>` options object
You can use all of the following options with standalone version on <redoc> tag by kebab-casing them, e.g. `scrollYOffset` becomes `scroll-y-offset` and `expandResponses` becomes `expand-responses`.

* `disableSearch` - disable search indexing and search box.
* `expandDefaultServerVariables` - enable expanding default server variables, default `false`.
* `expandResponses` - specify which responses to expand by default by response codes. Values should be passed as comma-separated list without spaces e.g. `expandResponses="200,201"`. Special value `"all"` expands all responses by default. Be careful: this option can slow-down documentation rendering time.
* `hideDownloadButton` - do not show "Download" spec button. **THIS DOESN'T MAKE YOUR SPEC PRIVATE**, it just hides the button.
* `hideHostname` - if set, the protocol and hostname is not shown in the operation definition.
* `hideLoading` - do not show loading animation. Useful for small docs.
* `hideSingleRequestSampleTab` - do not show the request sample tab for requests with only one sample.
* `expandSingleSchemaField` - automatically expand single field in a schema
* `jsonSampleExpandLevel` - set the default expand level for JSON payload samples (responses and request body). Special value 'all' expands all levels. The default value is `2`.
* `hideSchemaTitles` - do not display schema `title` next to to the type
* `simpleOneOfTypeLabel` - show only unique oneOf types in the label without titles
* `lazyRendering` - _Not implemented yet_ ~~if set, enables lazy rendering mode in ReDoc. This mode is useful for APIs with big number of operations (e.g. > 50). In this mode ReDoc shows initial screen ASAP and then renders the rest operations asynchronously while showing progress bar on the top. Check out the [demo](\\redocly.github.io/redoc) for the example.~~
* `menuToggle` - if true clicking second time on expanded menu item will collapse it, default `false`.
* `nativeScrollbars` - use native scrollbar for sidemenu instead of perfect-scroll (scrolling performance optimization for big specs).
* `noAutoAuth` - do not inject Authentication section automatically.
* `onlyRequiredInSamples` - shows only required fields in request samples.
* `pathInMiddlePanel` - show path link and HTTP verb in the middle panel instead of the right one.
* `requiredPropsFirst` - show required properties first ordered in the same order as in `required` array.
* `scrollYOffset` - If set, specifies a vertical scroll-offset. This is often useful when there are fixed positioned elements at the top of the page, such as navbars, headers etc;
`scrollYOffset` can be specified in various ways:
  * **number**: A fixed number of pixels to be used as offset.
  * **selector**: selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom will be used as offset.
  * **function**: A getter function. Must return a number representing the offset (in pixels).
* `showExtensions` - show vendor extensions ("x-" fields). Extensions used by ReDoc are ignored. Can be boolean or an array of `string` with names of extensions to display.
* `sortPropsAlphabetically` - sort properties alphabetically.
* `suppressWarnings` - if set, warnings are not rendered at the top of documentation (they still are logged to the console).
* `payloadSampleIdx` - if set, payload sample will be inserted at this index or last. Indexes start from 0.
* `theme` - ReDoc theme. Not documented yet. For details check source code: [theme.ts](https://github.com/Redocly/redoc/blob/master/src/theme.ts).
* `untrustedSpec` - if set, the spec is considered untrusted and all HTML/markdown is sanitized to prevent XSS. **Disabled by default** for performance reasons. **Enable this option if you work with untrusted user data!**

## Advanced usage of standalone version
Instead of adding `spec-url` attribute to the `<redoc>` element you can initialize ReDoc via globally exposed `Redoc` object:
```js
Redoc.init(specOrSpecUrl, options, element, callback?)
```

- `specOrSpecUrl` is either JSON object with specification or an URL to the spec in `JSON` or `YAML` format
- `options` [options object](#redoc-options-object)
- `element` DOM element to put ReDoc into
- `callback` (optional) - callback to be called after Redoc has been fully rendered. It is also called also on errors with error as the first argument

```js
Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
  scrollYOffset: 50
}, document.getElementById('redoc-container'))
```


# Who is using ReDoc?

- [Rebilly](https://rebilly-api.redoc.ly/)
- [Docker Engine](https://docs.docker.com/engine/api/v1.25/)
- [Zuora](https://www.zuora.com/developer/api-reference/)
- [Discourse](http://docs.discourse.org)
- [Commbox](https://www.commbox.io/api/)
- [APIs.guru](https://apis.guru/api-doc/)
- [FastAPI](https://github.com/tiangolo/fastapi)


# Project Development


## Roadmap

TODO: update this

  - [x] ~~[OpenAPI v3.0 support](https://github.com/Redocly/redoc/issues/312)~~
  - [x] ~~performance optimizations~~
  - [x] ~~better navigation (menu improvements + search)~~
  - [x] ~~React rewrite~~
  - [x] ~~docs pre-rendering (performance and SEO)~~
  - [ ] ability to simple branding/styling
  - [ ] built-in API Console


## Contributing

TODO:

[CONTRIBUTING.md](.github/CONTRIBUTING.md)

mention career options


## Releases

**Important:** all the 2.x releases are deployed to npm and can be used via jsdeliver:
- particular release, e.g. `v2.0.0-alpha.15`: https://cdn.jsdelivr.net/npm/redoc@2.0.0-alpha.17/bundles/redoc.standalone.js
- `next` release: https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js

Additionally, all the 1.x releases are hosted on our GitHub Pages-based CDN **(deprecated)**:
- particular release, e.g. `v1.2.0`: https://rebilly.github.io/ReDoc/releases/v1.2.0/redoc.min.js
- `v1.x.x` release: https://rebilly.github.io/ReDoc/releases/v1.x.x/redoc.min.js
- `latest` release: https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js - it will point to latest 1.x.x release since 2.x releases are not hosted on this CDN but on unpkg.

## OpenAPI Version Support

| ReDoc Release | OpenAPI Specification |
|:--------------|:----------------------|
| 2.0.0-alpha.x | 3.0, 2.0              |
| 1.19.x        | 2.0                   |
| 1.18.x        | 2.0                   |
| 1.17.x        | 2.0                   |


