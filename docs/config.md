# Configure Redoc

Getting your documentation just right is important, and Redoc comes with many configuration options to help you succeed in that mission.

Each deployment type has documentation on how to options in its context. This page lists all the options you can use with Redoc.

**Versions: 2.x**

:::success Client-side configuration

Using Redoc as a standalone (HTML or React) tool, these options must be presented in [kebab case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case). 
For example, `scrollYOffset` becomes `scroll-y-offset`, and `expandResponses` becomes `expand-responses`.

:::

## Functional settings

* `disableSearch` - disable search indexing and search box.
* `minCharacterLengthToInitSearch` - set minimal characters length to init search, default `3`, minimal `1`.
* `expandDefaultServerVariables` - enable expanding default server variables, default `false`.
* `expandResponses` - specify which responses to expand by default by response codes. Values should be passed as comma-separated list without spaces e.g. `expandResponses="200,201"`. Special value `"all"` expands all responses by default. Be careful: this option can slow-down documentation rendering time.
* `generatedPayloadSamplesMaxDepth` - set the maximum render depth for JSON payload samples (responses and request body). The default value is `10`.
* `maxDisplayedEnumValues` - display only specified number of enum values. hide rest values under spoiler.
* `hideDownloadButton` - do not show "Download" spec button. **THIS DOESN'T MAKE YOUR SPEC PRIVATE**, it just hides the button.
* `downloadFileName` - set a custom file name for the downloaded API definition file.
* `downloadDefinitionUrl` - If the 'Download' button is visible in the API reference documentation (hideDownloadButton=false), the URL configured here opens when that button is selected. Provide it as an absolute URL with the full URI scheme.
* `hideHostname` - if set, the protocol and hostname is not shown in the operation definition.
* `hideLoading` - do not show loading animation. Useful for small docs.
* `hideFab` - do not show FAB in mobile view. Useful for implementing a custom floating action button.
* `hideSchemaPattern` - if set, the pattern is not shown in the schema.
* `hideSingleRequestSampleTab` - do not show the request sample tab for requests with only one sample.
* `showObjectSchemaExamples` - show object schema example in the properties, default `false`.
* `expandSingleSchemaField` - automatically expand single field in a schema
* `schemaExpansionLevel` - specifies whether to automatically expand schemas. Special value `"all"` expands all levels. The default value is `0`.
* `jsonSampleExpandLevel` - set the default expand level for JSON payload samples (responses and request body). Special value `"all"` expands all levels. The default value is `2`.
* `hideSchemaTitles` - do not display schema `title` next to to the type
* `simpleOneOfTypeLabel` - show only unique oneOf types in the label without titles
* `sortEnumValuesAlphabetically` - set to true, sorts all enum values in all schemas alphabetically
* `sortOperationsAlphabetically` - set to true, sorts operations in the navigation sidebar and in the middle panel alphabetically
* `sortTagsAlphabetically` - set to true, sorts tags in the navigation sidebar and in the middle panel alphabetically
* `menuToggle` - if true, clicking second time on expanded menu item collapses it, default `true`.
* `nativeScrollbars` - use native scrollbar for sidemenu instead of perfect-scroll (scrolling performance optimization for big specs).
* `onlyRequiredInSamples` - shows only required fields in request samples.
* `pathInMiddlePanel` - show path link and HTTP verb in the middle panel instead of the right one.
* `requiredPropsFirst` - show required properties first ordered in the same order as in `required` array.
* `scrollYOffset` - If set, specifies a vertical scroll-offset. This is often useful when there are fixed positioned elements at the top of the page, such as navbars, headers etc;
`scrollYOffset` can be specified in various ways:
  * **number**: A fixed number of pixels to be used as offset.
  * **selector**: selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom is used as offset.
  * **function**: A getter function. Must return a number representing the offset (in pixels).
* `showExtensions` - show vendor extensions ("x-" fields). Extensions used by Redoc are ignored. Can be boolean or an array of `string` with names of extensions to display.
* `sortPropsAlphabetically` - sort properties alphabetically.
* `payloadSampleIdx` - if set, payload sample is inserted at this index or last. Indexes start from 0.
* `theme` - Redoc theme. For details check [theme docs](#redoc-theme-object).
* `untrustedSpec` - if set, the spec is considered untrusted and all HTML/markdown is sanitized to prevent XSS. **Disabled by default** for performance reasons. **Enable this option if you work with untrusted user data!**
* `nonce` - if set, the provided value is injected in every injected HTML element in the `nonce` attribute. Useful when using CSP, see https://webpack.js.org/guides/csp/.
* `sideNavStyle` - can be specified in various ways:
  * **summary-only**: displays a summary in the sidebar navigation item. (**default**)
  * **path-only**: displays a path in the sidebar navigation item.
  * **id-only**: displays the operation id with a fallback to the path in the sidebar navigation item.
* `showWebhookVerb` - when set to `true`, shows the HTTP request method for webhooks in operations and in the sidebar.

## Theme object

* `spacing`
  * `unit`: 5 # main spacing unit used in autocomputed theme values later
  * `sectionHorizontal`: 40 # Horizontal section padding. COMPUTED: spacing.unit * 8
  * `sectionVertical`: 40 # Horizontal section padding. COMPUTED: spacing.unit * 8
* `breakpoints` # breakpoints for switching three/two and mobile view layouts
  * `small`: '50rem'
  * `medium`: '85rem'
  * `large`: '105rem'
* `colors`
  * `tonalOffset`: 0.3 # default tonal offset used in computations
* `typography`
  * `fontSize`: '14px'
  * `lineHeight`: '1.5em'
  * `fontWeightRegular`: '400'
  * `fontWeightBold`: '600'
  * `fontWeightLight`: '300'
  * `fontFamily`: 'Roboto, sans-serif'
  * `smoothing`: 'antialiased'
  * `optimizeSpeed`: true
  * `headings`
    * `fontFamily`: 'Montserrat, sans-serif'
    * `fontWeight`: '400'
    * `lineHeight`: '1.6em'
  * `code` # inline code styling
    * `fontSize`: '13px'
    * `fontFamily`: 'Courier, monospace'
    * `lineHeight`: # COMPUTED: typography.lineHeight
    * `fontWeight`: # COMPUTED: typography.fontWeightRegular
    * `color`: '#e53935'
    * `backgroundColor`: 'rgba(38, 50, 56, 0.05)'
    * `wrap`: false # whether to break word for inline blocks (otherwise they can overflow)
  * `links`
    * `color`: # COMPUTED: colors.primary.main
    * `visited`: # COMPUTED: typography.links.color
    * `hover`: # COMPUTED: lighten(0.2 typography.links.color)
    * `textDecoration`: 'auto'
    * `hoverTextDecoration`: 'auto'
* `sidebar`
  * `width`: '260px'
  * `backgroundColor`: '#fafafa'
  * `textColor`: '#333333'
  * `activeTextColor`: # COMPUTED: theme.sidebar.textColor (if set by user) or theme.colors.primary.main
  * `groupItems` # Group headings
    * `activeBackgroundColor`: # COMPUTED: theme.sidebar.backgroundColor
    * `activeTextColor`: # COMPUTED: theme.sidebar.activeTextColor
    * `textTransform`: 'uppercase'
  * `level1Items` # Level 1 items like tags or section 1st level items
    * `activeBackgroundColor`: # COMPUTED: theme.sidebar.backgroundColor
    * `activeTextColor`: # COMPUTED: theme.sidebar.activeTextColor
    * `textTransform`: 'none'
  * `arrow` # sidebar arrow
    * `size`: '1.5em'
    * `color`: # COMPUTED: theme.sidebar.textColor
* `logo`
  * `maxHeight`: # COMPUTED: sidebar.width
  * `maxWidth`: # COMPUTED: sidebar.width
  * `gutter`: '2px' # logo image padding
* `rightPanel`
  * `backgroundColor`: '#263238'
  * `width`: '40%'
  * `textColor`: '#ffffff'
  * `servers`
    * `overlay`
      * `backgroundColor`: '#fafafa'
      * `textColor`: '#263238'
    * `url`
      * `backgroundColor`: '#fff'
* `fab`
  * `backgroundColor`: '#263238'
  * `color`: '#ffffff'

## Additional customization

### Security Definition location

You can inject the Security Definitions widget into any place in your definition `description`.
For more information, refer to [Security definitions injection](./security-definitions-injection.md).

### OpenAPI specification extensions

Redoc uses the following [specification extensions](https://redocly.com/docs/api-reference-docs/spec-extensions/):
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
* [`x-summary`](docs/redoc-vendor-extensions.md#x-summary) - For Response object, use as the response button text, with description rendered under the button
* [`x-extendedDiscriminator`](docs/redoc-vendor-extensions.md#x-extendedDiscriminator) - In Schemas, uses this to solve name-clash issues with the standard discriminator
* [`x-explicitMappingOnly`](docs/redoc-vendor-extensions.md#x-explicitMappingOnly) - In Schemas, display a more descriptive property name in objects with additionalProperties when viewing the property list with an object


