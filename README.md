<div align="center">
  <img alt="ReDoc logo" src="https://raw.githubusercontent.com/Redocly/redoc/master/docs/images/redoc-logo.png" width="400px" /style="margin-bottom: 15px">

  <hr style="margin-bottom: 25px">

  <!-- **OpenAPI/Swagger-generated API Reference Documentation** -->

  **ReDoc transforms your OpenAPI definition into comprehensive and interactive documentation, fast.**

  [![Build Status](https://travis-ci.org/Redocly/redoc.svg?branch=master)](https://travis-ci.org/Redocly/redoc) [![Coverage Status](https://coveralls.io/repos/Redocly/redoc/badge.svg?branch=master&service=github)](https://coveralls.io/github/Redocly/redoc?branch=master) [![dependencies Status](https://david-dm.org/Redocly/redoc/status.svg)](https://david-dm.org/Redocly/redoc) [![devDependencies Status](https://david-dm.org/Redocly/redoc/dev-status.svg)](https://david-dm.org/Redocly/redoc#info=devDependencies) [![npm](http://img.shields.io/npm/v/redoc.svg)](https://www.npmjs.com/package/redoc) [![License](https://img.shields.io/npm/l/redoc.svg)](https://github.com/Redocly/redoc/blob/master/LICENSE) [![npm](https://img.shields.io/npm/dm/redoc.svg)](https://www.npmjs.com/package/redoc) [![](https://data.jsdelivr.com/v1/package/npm/redoc/badge)](https://www.jsdelivr.com/package/npm/redoc) [![Docker Build Status](https://img.shields.io/docker/build/redocly/redoc.svg)](https://hub.docker.com/r/redocly/redoc/)

  <!-- [![bundle size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js?compression=gzip&max=300000)](https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js)  -->




The current ReDoc version is `2.0`. For older version please see the [`v1.x`](https://github.com/Redocly/redoc/tree/v1.x) branch.



</div>


## What's In This Document

- [Demo](#demo)
- [Features](#features)
- [Premium Features](#premium-features)
- [Live Examples](#live-examples)
- [Roadmap](#roadmap)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Releases](#releases)
- [Version Guidance](#version-guidance)
- [Development](#development)


## Demo

[<img alt="ReDoc live demo" src="https://raw.githubusercontent.com/Redocly/redoc/master/demo/redoc-demo.png">](http://redocly.github.io/redoc/)



<!-- [<img alt="Deploy to Github" src="http://i.imgur.com/YZmaqk3.png" height="60px">](https://github.com/Rebilly/generator-openapi-repo#generator-openapi-repo--) [<img alt="ReDoc as a service" src="http://i.imgur.com/edqdCv6.png" height="60px">](https://redoc.ly) [<img alt="Customization services" src="http://i.imgur.com/c4sUF7M.png" height="60px">](https://redoc.ly/#services) -->

## Features

All of these features are available in our open source community edition.

- Deploy **extremely fast** via CDN, npm, CLI, or Docker.
- Bundle your docs into a **zero-dependency** HTML file (when using [`redoc-cli`](#redoc-cli)).
- Integrate with any React app, with client or server-side rendering.
- Take full advantage of OpenAPI 2.0/3.0 features, from `discriminator` to `allOf`.
 <br> <br>
![](docs/images/discriminator-demo.gif)
- Use **interactive** documentation for nested objects
 <br> <br>
![](docs/images/nested-demo.gif)
 <br> <br>
- Include **code samples** (via vendor extension)
 <br> <br>
![](docs/images/code-samples-demo.gif)
 <br> <br>
- Get a fully responsive, three-panel design out of the box (with menu/scrolling synchronization)
- Integrate your API Introduction into the side menu (with support for deep linking)
- Create high-level groupings in the side menu with the [`x-tagGroups`](docs/redoc-vendor-extensions.md#x-tagGroups) vendor extension
- Match your docs and your brand by using the [`theme` option](#redoc-options-object)

## Premium Features

These features are availale in our hosted or on-premise premium edition.

- SEO Friendly URLs
- 10x Page Load Speed
- 'Try It' API console
  - Multiple Servers
  - OAS3 security schemes
- Enhanced Search
- Additional Theming Control
- Embedded Markdown

## Live Examples
- [Rebilly](https://api-reference.rebilly.com)
- [Docker Engine](https://docs.docker.com/engine/api/v1.25/)
- [Zuora](https://www.zuora.com/developer/api-reference/)
- [Discourse](http://docs.discourse.org)
- [Commbox](https://www.commbox.io/api/)
- [APIs.guru](https://apis.guru/api-doc/)
- [FastAPI](https://github.com/tiangolo/fastapi)
- [Spoke Phone](https://developer.spokephone.com/)
- [SignRequest](https://signrequest.com/api/v1/docs/)

## Roadmap
  - [x] ~~OpenAPI v3.0 support~~
  - [x] ~~performance optimizations~~
  - [x] ~~better navigation (menu improvements + search)~~
  - [x] ~~React rewrite~~
  - [x] ~~docs pre-rendering (performance and SEO)~~
  - [x] add `x-webhooks` support
  - [ ] use `openapi-cli` under the hood
  - [ ] address accessibility issues
  - [ ] add support for links (OpenAPI v3)



## Getting Started

Do you need to create, contribute to, or split an OpenAPI definition? We created [`create-openapi-repo`](https://github.com/Redocly/create-openapi-repo) just for you.

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
That's all folks!

**IMPORTANT NOTE:** if you work with untrusted user spec, use `untrusted-spec` [option](#redoc-options-object) to prevent XSS security risks.

### 1. Install ReDoc (skip this step for CDN)
Install using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

    npm i redoc

or using [yarn](https://yarnpkg.com):

    yarn add redoc

### 2. Reference redoc script in HTML
For **CDN**:
```html
<script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"> </script>
```

For npm:
```html
<script src="node_modules/redoc/bundles/redoc.standalone.js"> </script>
```

### 3. Add `<redoc>` element to your page
```html
<redoc spec-url="url/to/your/spec"></redoc>
```

### 4. Enjoy :smile:


## Usage as a React component

Install peer dependencies required by ReDoc if you don't have them installed already:

    npm i react react-dom mobx@^4.2.0 styled-components core-js

Import `RedocStandalone` component from 'redoc' module:

```js
import { RedocStandalone } from 'redoc';
```

and use it somewhere in your component:

```js
<RedocStandalone specUrl="url/to/your/spec"/>
```

or

```js
<RedocStandalone spec={/* spec as an object */}/>
```

Also you can pass options:

```js
<RedocStandalone
  specUrl="http://rebilly.github.io/RebillyAPI/openapi.json"
  options={{
    nativeScrollbars: true,
    theme: { colors: { primary: { main: '#dd5522' } } },
  }}
/>
```

Here are detailed [options docs](#redoc-options-object).

You can also specify `onLoaded` callback which will be called each time Redoc has been fully rendered or when error occurs (with an error as the first argument). *NOTE*: It may be called multiply times if you change component properties

```js
<RedocStandalone
  specUrl="http://rebilly.github.io/RebillyAPI/openapi.json"
  onLoaded={error => {
    if (!error) {
      console.log('Yay!');
    }
  }}
/>
```

[**IE11 Support Notes**](docs/usage-with-ie11.md)

## The Docker way

ReDoc is available as pre-built Docker image in official [Docker Hub repository](https://hub.docker.com/r/redocly/redoc/). You may simply pull & run it:

    docker pull redocly/redoc
    docker run -p 8080:80 redocly/redoc

Also you may rewrite some predefined environment variables defined in [Dockerfile](./config/docker/Dockerfile). By default ReDoc starts with demo Petstore spec located at `http://petstore.swagger.io/v2/swagger.json`, but you may change this URL using environment variable `SPEC_URL`:

    docker run -p 8080:80 -e SPEC_URL=https://api.example.com/openapi.json redocly/redoc

## ReDoc CLI

[`redoc-cli`](https://github.com/Redocly/redoc/tree/master/cli) allows you to run a local server that renders your spec with ReDoc, and to  bundle ReDoc and your spec into a **zero-dependency** HTML file.

## Configuration

### Security Definition location
You can inject Security Definitions widget into any place of your specification `description`. Check out details [here](docs/security-definitions-injection.md).

### Swagger vendor extensions
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

### `<redoc>` options object
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

## Releases
**Important:** all the 2.x releases are deployed to npm and can be used via jsdeliver:
- particular release, e.g. `v2.0.0-alpha.15`: https://cdn.jsdelivr.net/npm/redoc@2.0.0-alpha.17/bundles/redoc.standalone.js
- `next` release: https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js

Additionally, all the 1.x releases are hosted on our GitHub Pages-based CDN **(deprecated)**:
- particular release, e.g. `v1.2.0`: https://rebilly.github.io/ReDoc/releases/v1.2.0/redoc.min.js
- `v1.x.x` release: https://rebilly.github.io/ReDoc/releases/v1.x.x/redoc.min.js
- `latest` release: https://rebilly.github.io/ReDoc/releases/latest/redoc.min.js - it will point to latest 1.x.x release since 2.x releases are not hosted on this CDN but on unpkg.

## Version Guidance
| ReDoc Release | OpenAPI Specification |
|:--------------|:----------------------|
| 2.0.0-alpha.x | 3.0, 2.0              |
| 1.19.x        | 2.0                   |
| 1.18.x        | 2.0                   |
| 1.17.x        | 2.0                   |

-----------
## Development
Want to help us build ReDoc? Awesome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) first.
