<p align="center">
    <img alt="ReDoc logo" src="/docs/images/redoc-logo.png" width="300px" />
</p>
<p align="center">
    <b>OpenAPI/Swagger-generated API Reference Documentation</b>
</p>

[![Build Status](https://travis-ci.org/Rebilly/ReDoc.svg?branch=master)](https://travis-ci.org/Rebilly/ReDoc) [![Coverage Status](https://coveralls.io/repos/Rebilly/ReDoc/badge.svg?branch=master&service=github)](https://coveralls.io/github/Rebilly/ReDoc?branch=master) [![Tested on APIs.guru](http://api.apis.guru/badges/tested_on.svg)](https://APIs.guru) [![dependencies Status](https://david-dm.org/Rebilly/ReDoc/status.svg)](https://david-dm.org/Rebilly/ReDoc) [![devDependencies Status](https://david-dm.org/Rebilly/ReDoc/dev-status.svg)](https://david-dm.org/Rebilly/ReDoc#info=devDependencies) [![Stories in Ready](https://badge.waffle.io/Rebilly/ReDoc.png?label=ready&title=Ready)](https://waffle.io/Rebilly/ReDoc)

[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/Rebilly/redoc.svg)](http://isitmaintained.com/project/Rebilly/redoc "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/REBILLY/REDOC.svg)](http://isitmaintained.com/project/REBILLY/REDOC "Percentage of issues still open")

[![npm](http://img.shields.io/npm/v/redoc.svg)](https://www.npmjs.com/package/redoc) [![License](https://img.shields.io/npm/l/redoc.svg)](https://github.com/Rebilly/ReDoc/blob/master/LICENSE)

[![Browser Compatibility](https://saucelabs.com/browser-matrix/redoc.svg)](https://saucelabs.com/u/redoc)

![ReDoc demo](demo/redoc-demo.png)

## [Live demo](http://rebilly.github.io/ReDoc/)

[<img alt="Deploy to Github" src="http://i.imgur.com/YZmaqk3.png" height="60px">](https://github.com/Rebilly/generator-openapi-repo#generator-openapi-repo--) [<img alt="ReDoc as a service" src="http://i.imgur.com/edqdCv6.png" height="60px">](https://redoc.ly) [<img alt="Customization services" src="http://i.imgur.com/c4sUF7M.png" height="60px">](https://redoc.ly/#services)

## Features
- Extremely easy deployment
- The widest OpenAPI v2.0 features support (yes, it supports even `discriminator`) <br>
![](docs/images/discriminator-demo.gif)
- Neat **interactive** documentation for nested objects <br>
![](docs/images/nested-demo.gif)
- Code samples support (via vendor extension) <br>
![](docs/images/code-samples-demo.gif)
- Progressive loading with `lazy-rendering` options <br>
![](docs/images/progressive-loading-demo.gif)
- Responsive three-panel design with menu/scrolling synchronization
- Integrate API Introduction into side menu - ReDoc takes advantage of markdown headings from OpenAPI description field. It pulls them into side menu and also supports deep linking.
- High-level grouping in side-menu via [`x-tagGroups`](docs/redoc-vendor-extensions.md#x-tagGroups) vendor extension
- Multiple ReDoc instances on single page ([example](demo/examples/multiple-apis/index.html))

## Roadmap
  - [ ] [OpenAPI v3.0 support](https://github.com/Rebilly/ReDoc/issues/312)
  - [x] ~~performance optimizations~~
  - [x] ~~better navigation (menu improvements + search)~~
  - [ ] ability to simple branding/styling
  - [ ] built-in API Console
  - [ ] docs pre-rendering (performance and SEO)

## Releases
We host the latest and all the previous ReDoc releases on GitHub Pages-based **CDN**:
- particular release, e.g. `v1.2.0`: https://rebilly.github.io/ReDoc/releases/v1.2.0/redoc.min.js
- `v1.x.x` release: https://rebilly.github.io/ReDoc/releases/v1.x.x/redoc.min.js
- `latest` release: https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js this file is updated with each release of ReDoc and may introduce breaking changes. **Not recommended to use in production.** Use particular release or `v1.x.x`.

## Version Guidance
| ReDoc Release | OpenAPI Specification |
|:--------------|:----------------------|
| 1.19.x        | 2.0                   |
| 1.18.x        | 2.0                   |
| 1.17.x        | 2.0                   |

## Some Real-life usages
- [Rebilly](https://rebilly.github.io/RebillyAPI)
- [Docker Engine](https://docs.docker.com/engine/api/v1.25/)
- [Zuora](https://www.zuora.com/developer/api-reference/)
- [Shopify Draft Orders](https://help.shopify.com/api/draft-orders)
- [Discourse](http://docs.discourse.org)
- [APIs.guru](https://apis.guru/api-doc/)

## Deployment

### TL;DR

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
    <script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
  </body>
</html>
```
That's all folks!

**IMPORTANT NOTE:** if you work with untrusted user spec, use `untrusted-spec` [option](#redoc-tag-attributes) to prevent XSS security risks.

### 1. Install ReDoc (skip this step for CDN)
Install using [yarn](https://yarnpkg.com):

    yarn add redoc

or using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

    npm install redoc --save

### 2. Reference redoc script in HTML
For **CDN**:
```html
<script src="https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js"> </script>
```

For npm:
```html
<script src="node_modules/redoc/dist/redoc.min.js"> </script>
```

### 3. Add `<redoc>` element to your page
```html
<redoc spec-url="url/to/your/spec"></redoc>
```

### 4. Enjoy :smile:

## Configuration

### Security Definition location
You can inject Security Definitions widget into any place of your specification `description`. Check out details [here](docs/security-definitions-injection.md).

### Swagger vendor extensions
ReDoc makes use of the following [vendor extensions](http://swagger.io/specification/#vendorExtensions):
* [`x-logo`](docs/redoc-vendor-extensions.md#x-logo) - is used to specify API logo
* [`x-traitTag`](docs/redoc-vendor-extensions.md#x-traitTag) - useful for handling out common things like Pagination, Rate-Limits, etc
* [`x-code-samples`](docs/redoc-vendor-extensions.md#x-code-samples) - specify operation code samples
* [`x-examples`](docs/redoc-vendor-extensions.md#x-examples) - specify JSON example for requests
* [`x-nullable`](docs/redoc-vendor-extensions.md#nullable) - mark schema param as a nullable
* [`x-displayName`](docs/redoc-vendor-extensions.md#x-displayname) - specify human-friendly names for the menu categories
* [`x-tagGroups`](docs/redoc-vendor-extensions.md#x-tagGroups) - group tags by categories in the side menu
* [`x-servers`](docs/redoc-vendor-extensions.md#x-servers) - ability to specify different servers for API (backported from OpenAPI 3.0)
* [`x-ignoredHeaderParameters`](docs/redoc-vendor-extensions.md#x-ignoredHeaderParameters) - ability to specify header parameter names to ignore

### `<redoc>` tag attributes
* `spec-url` - relative or absolute url to your spec file;
* `untrusted-spec` - if set, the spec is considered untrusted and all HTML/markdown is sanitized to prevent XSS. **Disabled by default** for performance reasons. **Enable this option if you work with untrusted user data!**
* `scroll-y-offset` - If set, specifies a vertical scroll-offset. This is often useful when there are fixed positioned elements at the top of the page, such as navbars, headers etc;
`scroll-y-offset` can be specified in various ways:
  * **number**: A fixed number of pixels to be used as offset;
  * **selector**: selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom will be used as offset;
  * **function**: A getter function. Must return a number representing the offset (in pixels);
* `suppress-warnings` - if set, warnings are not rendered at the top of documentation (they still are logged to the console).
* `lazy-rendering` - if set, enables lazy rendering mode in ReDoc. This mode is useful for APIs with big number of operations (e.g. > 50). In this mode ReDoc shows initial screen ASAP and then renders the rest operations asynchronously while showing progress bar on the top. Check out the [demo](https://rebilly.github.io/ReDoc) for the example.
* `hide-hostname` - if set, the protocol and hostname is not shown in the operation definition.
* `hide-download-button` - do not show "Download" spec button. **THIS DOESN'T MAKE YOUR SPEC PRIVATE**, it just hides the button.
* `expand-responses` - specify which responses to expand by default by response codes. Values should be passed as comma-separated list without spaces e.g. `expand-responses="200,201"`. Special value `"all"` expands all responses by default. Be careful: this option can slow-down documentation rendering time.
* `required-props-first` - show required properties first ordered in the same order as in `required` array.
* `no-auto-auth` - do not inject Authentication section automatically
* `path-in-middle-panel` - show path link and HTTP verb in the middle panel instead of the right one
* `hide-loading` - do not show loading animation. Useful for small docs
* `native-scrollbars` - use native scrollbar for sidemenu instead of perfect-scroll (scrolling performance optimization for big specs)

## Advanced usage
Instead of adding `spec-url` attribute to the `<redoc>` element you can initialize ReDoc via globally exposed `Redoc` object:
```js
Redoc.init(specOrSpecUrl, options)
```
`specOrSpecUrl` is either JSON object with specification or an URL to the spec in `JSON` or `YAML` format.
`options` is javascript object with camel-cased version of `<redoc>` tag attribute names as the keys, e.g.:
```js
Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
  scrollYOffset: 50
})
```

-----------
## Development
#### Running local dev-server
- Clone repository
`git clone https://github.com/Rebilly/ReDoc.git`
- Go to the project folder
`cd ReDoc`
- Install dependencies
`npm install`
- _(optional)_ Replace `demo/swagger.yaml` with your own schema
- Start the server
`npm start`
- Open `http://localhost:9000`

Alternatively, Docker can be used by just running `docker-compose up`.
