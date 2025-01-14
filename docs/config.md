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

### hideDownloadButton

Hides the 'Download' button for saving the API definition source file. **This setting does not make the API definition private**; it just hides the button.

### hideLoading

Hides the loading animation. Does not apply to CLI or Workflows-rendered docs.

### hideSchemaTitles

Hides the schema title next to to the type.

### htmlTemplate

Sets the path to the optional HTML file used to modify the layout of the reference docs page.

### jsonSampleExpandLevel

Sets the default expand level for JSON payload samples (response and request body). The default value is 2, and the maximum supported value is '+Infinity'. It can also be configured as a string with the special value `all` that expands all levels.

_Default: 2_

### maxDisplayedEnumValues

Displays only the specified number of enum values. The remaining values are hidden in an expandable area. If not set, all values are displayed.

### onlyRequiredInSamples

Shows only required fields in request samples.

### requiredPropsFirst

Shows required properties in schemas first, ordered in the same order as in the required array.

### schemaExpansionLevel

Specifies whether to automatically expand schemas in Reference docs. Set it to `all` to expand all schemas regardless of their level, or set it to a number to expand schemas up to the specified level. For example, `schemaExpansionLevel: 3` expands schemas up to three levels deep. The default value is `0`, meaning no schemas are expanded automatically.

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

## Theme settings

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


