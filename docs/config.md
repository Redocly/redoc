# Configure Redoc

Getting your documentation just right is important, and Redoc comes with many configuration options to help you succeed in that mission.

Each deployment type has documentation on how to configure options for that type of Redoc project. This page lists all the options you can use with Redoc.

**Versions: 2.x**

{% admonition type="success" name="Client-side configuration" %}

Using Redoc as a standalone (HTML or React) tool, these options must be presented in [kebab case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case).
For example, `scrollYOffset` becomes `scroll-y-offset`, and `expandResponses` becomes `expand-responses`.

{% /admonition %}

## Functional settings


### disableSearch

Disables search indexing and hides the search box from the API documentation page.

### minCharacterLengthToInitSearch

Sets the minimum amount of characters that need to be typed into the search dialog to initiate the search.

_Default: 3_

### hideDownloadButtons

Hides the 'Download' button for saving the API definition source file. **This setting does not make the API definition private**; it just hides the button.

### hideLoading

Hides the loading animation. Does not apply to CLI or Workflows-rendered docs.

### hideSchemaTitles

Hides the schema title next to to the type.

### jsonSamplesExpandLevel

Sets the default expand level for JSON payload samples (response and request body). The default value is 2, and the maximum supported value is '+Infinity'. It can also be configured as a string with the special value `all` that expands all levels.

_Default: 2_

### maxDisplayedEnumValues

Displays only the specified number of enum values. The remaining values are hidden in an expandable area. If not set, all values are displayed.

### onlyRequiredInSamples

Shows only required fields in request samples.

### sortRequiredPropsFirst

Shows required properties in schemas first, ordered in the same order as in the required array.

### schemasExpansionLevel

Specifies whether to automatically expand schemas in Reference docs. Set it to `all` to expand all schemas regardless of their level, or set it to a number to expand schemas up to the specified level. For example, `schemasExpansionLevel: 3` expands schemas up to three levels deep. The default value is `0`, meaning no schemas are expanded automatically.

### scrollYOffset

Specifies a vertical scroll-offset.
This setting is useful when there are fixed positioned elements at the top of the page, such as navbars, headers, etc.

Note that you can specify the `scrollYOffset` value in any of the following ways:
- as a number - a fixed number of pixels to be used as the offset.
- as a CSS selector - the selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom is used as the offset.
- a function (advanced) - a getter function. Must return a number representing the offset (in pixels).

### showExtensions

Shows specification extensions ('x-' fields). Extensions used by Redoc are ignored. The value can be boolean or an array of strings with names of extensions to display. When used as boolean and set to `true`, all specification extensions are shown.

### sanitize

If set to `true`, the API definition is considered untrusted and all HTML/Markdown is sanitized to prevent XSS.

### downloadUrls

Set the URLs used to download the OpenAPI description or other documentation related files from the API documentation page.

### schemaDefinitionsTagName

If a value is set, all of the schemas are rendered with the designated tag name. The schemas then render and display in the sidebar navigation (with that associated tag name).

### generatedSamplesMaxDepth

The generatedSamplesMaxDepth option controls how many schema levels automatically generated for payload samples. The default is 8 which works well for most APIs, but you can adjust it if necessary for your use case.

### hidePropertiesPrefix

In complex data structures or object schemas where properties are nested within parent objects the hidePropertiesPrefix option enables the hiding of parent names for nested properties within the documentation.

_Default: true_

## Deprecated Functional settings

### hideDownloadButton

Hides the 'Download' button for saving the API definition source file. **This setting does not make the API definition private**; it just hides the button.

### downloadFileName

Sets the filename for the downloaded API definition source file.

### downloadDefinitionUrl

Sets the URL for the downloaded API definition source file.

### requiredPropsFirst

Shows required properties in schemas first, ordered in the same order as in the required array.

### jsonSampleExpandLevel

Sets the default expand level for JSON payload samples (response and request body). The default value is 2, and the maximum supported value is '+Infinity'. It can also be configured as a string with the special value `all` that expands all levels.

_Default: 2_

### schemaExpansionLevel

Specifies whether to automatically expand schemas in Reference docs. Set it to `all` to expand all schemas regardless of their level, or set it to a number to expand schemas up to the specified level. For example, `schemaExpansionLevel: 3` expands schemas up to three levels deep. The default value is `0`, meaning no schemas are expanded automatically.


### expandDefaultServerVariables

Enables or disables expanding default server variables.

### expandResponses

Controls which responses to expand by default. Specify one or more responses by providing their response codes as a comma-separated list without spaces, for example `expandResponses='200,201'`. Special value 'all' expands all responses by default. Be careful: this option can slow down documentation rendering time.

### expandSingleSchemaField

Automatically expands the single field in a schema.

### hideHostname

If set to `true`, the protocol and hostname are not shown in the operation definition.

### hideRequestPayloadSample

Hides request payload examples.

### hideOneOfDescription

If set to `true`, the description for `oneOf`/`anyOf` object is not shown in the schema.

### hideSchemaPattern

If set to `true`, the pattern is not shown in the schema.

### hideSecuritySection

Hides the Security panel section.

### hideSingleRequestSampleTab

Hides the request sample tab for requests with only one sample.

### menuToggle

If set to `true`, selecting an expanded item in the sidebar twice collapses it.

_Default: true_

### nativeScrollbars

If set to `true`, the sidebar uses the native scrollbar instead of perfect-scroll. This setting is a scrolling performance optimization for big API definitions.

### pathInMiddlePanel

Shows the path link and HTTP verb in the middle panel instead of the right panel.

### payloadSampleIdx

If set, the payload sample is inserted at the specified index. If there are `N` payload samples and the value configured here is bigger than `N`, the payload sample is inserted last. Indexes start from 0.

### showObjectSchemaExamples

Shows object schema example in the properties; default `false`.

### showWebhookVerb

When set to `true`, shows the HTTP request method for webhooks in operations and in the sidebar.

### simpleOneOfTypeLabel

Shows only unique `oneOf` types in the label without titles.

### sortEnumValuesAlphabetically

When set to `true`, sorts all enum values in all schemas alphabetically.

### sortOperationsAlphabetically

When set to `true`, sorts operations in the navigation sidebar and in the middle panel alphabetically.

### sortPropsAlphabetically

When set to `true`, sorts properties in all schemas alphabetically.

### sortTagsAlphabetically

When set to true, sorts tags in the navigation sidebar and in the middle panel alphabetically. Note that only tags are sorted alphabetically in the middle panel, not the operations associated with each tag. To sort operations alphabetically as well, you must set the `sortOperationsAlphabetically` setting to `true`.

_Default: false_

### untrustedSpec

If set to `true`, the API definition is considered untrusted and all HTML/Markdown is sanitized to prevent XSS.

## Theme settings
Change styles for the API documentation page. **Supported in Redoc CE 2.x**.
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

Redoc uses the following [specification extensions](https://redocly.com/docs-legacy/api-reference-docs/spec-extensions/):
* [`x-logo`](./redoc-vendor-extensions.md#x-logo) - is used to specify API logo
* [`x-traitTag`](./redoc-vendor-extensions.md#x-traittag) - useful for handling out common things like Pagination, Rate-Limits, etc
* [`x-codeSamples`](./redoc-vendor-extensions.md#x-codesamples) - specify operation code samples
* [`x-examples`](./redoc-vendor-extensions.md#x-examples) - specify JSON example for requests
* [`x-nullable`](./redoc-vendor-extensions.md#x-nullable) - mark schema param as a nullable
* [`x-displayName`](./redoc-vendor-extensions.md#x-displayname) - specify human-friendly names for the menu categories
* [`x-tagGroups`](./redoc-vendor-extensions.md#x-taggroups) - group tags by categories in the side menu
* [`x-servers`](./redoc-vendor-extensions.md#x-servers) - ability to specify different servers for API (backported from OpenAPI 3.0)
* [`x-additionalPropertiesName`](./redoc-vendor-extensions.md#x-additionalpropertiesname) - ability to supply a descriptive name for the additional property keys
* [`x-summary`](./redoc-vendor-extensions.md#x-summary) - For Response object, use as the response button text, with description rendered under the button
* [`x-explicitMappingOnly`](./redoc-vendor-extensions.md#x-explicitmappingonly) - In Schemas, display a more descriptive property name in objects with additionalProperties when viewing the property list with an object


