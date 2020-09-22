# ReDoc vendor extensions

You can use the following [vendor extensions](https://swagger.io/specification/#specificationExtensions) with Redoc.

- [Swagger Object](#swagger-object)
	- [x-servers](#x-servers)
	- [x-tagGroups](#x-taggroups)
	- [Tag Group Object](#a-nametaggroupobjectatag-group-object)
	- [x-ignoredHeaderParameters](#x-ignoredheaderparameters)
- [Info Object](#info-object)
	- [x-logo](#x-logo)
	- [Logo Object](#a-namelogoobjectalogo-object)
- [Tag Object](#tag-object)
	- [x-traitTag](#x-traittag)
	- [x-displayName](#x-displayname)
- [Operation Object](#operation-object-vendor-extensions)
	- [x-codeSamples](#x-codesamples)
	- [Code Sample Object](#a-namecodesampleobjectacode-sample-object)
- [Parameter Object](#parameter-object)
	- [x-examples](#x-examples)
- [Response Object vendor extensions](#response-object-vendor-extensions)
	- [x-summary](#x-summary)
- [Schema Object](#schema-object)
	- [x-nullable](#x-nullable)
	- [x-extendedDiscriminator](#x-extendeddiscriminator)
	- [x-additionalPropertiesName](#x-additionalpropertiesname)
	- [x-explicitMappingOnly](#x-explicitmappingonly)

### Swagger Object
Extends the OpenAPI root [OpenAPI Object](https://swagger.io/specification/#oasObject)

#### x-servers
Backported from OpenAPI 3.0 [`servers`](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#serverObject). Currently doesn't support templates.

#### x-tagGroups

| Field Name     |	Type	       | Description |
| :------------- | :-----------: | :---------- |
| x-tagGroups         | [ [Tag Group Object](#tagGroupObject) ] | A list of tag groups |

###### How to use with Redoc
`x-tagGroups` is used to group tags in the side menu.
Before you use `x-tagGroups`, make sure you **add all tags to a group**, since a tag that is not in a group, **will not be displayed** at all!

#### <a name="tagGroupObject"></a>Tag Group Object
Information about tags group
###### Fixed fields
| Field Name  |	Type	     | Description |
| :---------- | :--------: | :---------- |
| name        | string     | The group name |
| tags        | [ string ] | List of tags to include in this group

###### x-tagGroups example
json
```json
{
  "x-tagGroups": [
    {
      "name": "User Management",
      "tags": ["Users", "API keys", "Admin"]
    },
    {
      "name": "Statistics",
      "tags": ["Main Stats", "Secondary Stats"]
    }
  ]
}
```
yaml
```yaml
x-tagGroups:
  - name: User Management
    tags:
      - Users
      - API keys
      - Admin
  - name: Statistics
    tags:
      - Main Stats
      - Secondary Stats
```

#### x-ignoredHeaderParameters


| Field Name                  |	Type	        | Description |
| :-------------------------- | :-----------: | :---------- |
| x-ignoredHeaderParameters   | [ string ] | A list of ignored headers |


###### How to use with Redoc
Use `x-ignoredHeaderParameters` to specify header parameter names which are ignored by ReDoc.

###### x-ignoredHeaderParameters example
```yaml
swagger: '2.0'
info:
  ...
tags: [...]
x-ignoredHeaderParameters:
  - Accept
  - User-Agent
  - X-Test-Header
```

### Info Object
Extends the OpenAPI [Info Object](http://swagger.io/specification/#infoObject)
#### x-logo

| Field Name     |	Type	       | Description |
| :------------- | :-----------: | :---------- |
| x-logo         | [Logo Object](#logoObject)  | The information about API logo |

###### How to use with Redoc
`x-logo` is used to specify API logo. The corresponding image is displayed just above the side-menu.

#### <a name="logoObject"></a>Logo Object
The information about API logo

###### Fixed fields
| Field Name      |	Type	   | Description |
| :-------------- | :------: | :---------- |
| url             | string   | The URL pointing to the spec logo. MUST be in the format of a URL. It SHOULD be an absolute URL so your API definition is usable from any location
| backgroundColor | string   | background color to be used. MUST be RGB color in [hexadecimal format] (https://en.wikipedia.org/wiki/Web_colors#Hex_triplet)
| altText        | string   | Text to use for alt tag on the logo. Defaults to 'logo' if nothing is provided.
| href        | string   | The URL pointing to the contact page. Default to 'info.contact.url' field of the OAS.


###### x-logo example
json
```json
{
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "x-logo": {
      "url": "https://redocly.github.io/redoc/petstore-logo.png",
      "backgroundColor": "#FFFFFF",
      "altText": "Petstore logo"
    }
  }
}
```
yaml
```yaml
info:
  version: "1.0.0"
  title: "Swagger Petstore"
  x-logo:
    url: "https://redocly.github.io/redoc/petstore-logo.png"
    backgroundColor: "#FFFFFF"
    altText: "Petstore logo"
```

### Tag Object
Extends the OpenAPI [Tag Object](http://swagger.io/specification/#tagObject)

#### x-traitTag
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-traitTag     | boolean  | In Swagger two operations can have multiple tags. This property distinguishes between tags that are used to group operations (default) from tags that are used to mark operation with certain trait (`true` value) |

###### How to use with Redoc
Tags that have `x-traitTag` set to `true` are listed in the side-menu but don't have any subitems (operations). It also renders the `description` tag.
This is useful for handling out common things like Pagination, Rate-Limits, etc.

###### x-traitTag example
json
```json
{
    "name": "Pagination",
    "description": "Pagination description (can use markdown syntax)",
    "x-traitTag": true
}
```
yaml
```yaml
name: Pagination
description: Pagination description (can use markdown syntax)
x-traitTag: true
```

#### x-displayName

| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-displayName  | string   | Defines the text that is used for this tag in the menu and in section headings |

### Operation Object vendor extensions
Extends the OpenAPI [Operation Object](http://swagger.io/specification/#operationObject)

#### x-codeSamples
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-codeSamples | [ [Code Sample Object](#codeSampleObject) ]  | A list of code samples associated with operation |

###### How to use with ReDoc
`x-codeSamples` are rendered on the right panel in ReDoc.

#### <a name="codeSampleObject"></a>Code Sample Object
Operation code sample

###### Fixed fields
| Field Name  |	Type	   | Description  |
| :---------- | :------: | :----------- |
| lang        | string   | Code sample language. Value should be one of the following [list](https://github.com/github/linguist/blob/master/lib/linguist/popular.yml) |
| label       | string?   | Code sample label e.g. `Node` or `Python2.7`, _optional_, `lang` will be used by default |
| source      | string   | Code sample source code |


###### Code Sample Object example
json
```json
{
  "lang": "JavaScript",
  "source": "console.log('Hello World');"
}
```
yaml
```yaml
lang: JavaScript
source: console.log('Hello World');
```

### Parameter Object
Extends the OpenAPI [Parameter Object](http://swagger.io/specification/#parameterObject)

#### x-examples
| Field Name     |  Type    | Description |
| :------------- | :------: | :---------- |
| x-examples | [Example Object](http://swagger.io/specification/#exampleObject)  | Object that contains examples for the request. Applies when `in` is `body` and mime-type is `application/json` |

###### How to use with ReDoc
`x-examples` are rendered in the JSON tab on the right panel in ReDoc.

### Response Object vendor extensions
Extends the OpenAPI [Response Object](https://swagger.io/specification/#responseObject)

#### x-summary
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-summary      | string   | a short summary of the response |

###### How to use with ReDoc
If specified, you can use `x-summary` as the response button text, with description rendered under the button.

### Schema Object
Extends the OpenAPI [Schema Object](http://swagger.io/specification/#schemaObject)

#### x-nullable
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-nullable | boolean | marks schema as a nullable |

###### How to use with ReDoc
Schemas marked as `x-nullable` are marked in ReDoc with the label Nullable

#### x-extendedDiscriminator
**ATTENTION**: This is a ReDoc-specific vendor extension, and is not supported by other tools.

| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-extendedDiscriminator | string | specifies extended discriminator |

###### How to use with ReDoc
ReDoc uses this vendor extension to solve name-clash issues with the standard `discriminator`.
Value of this field specifies the field which will be used as a extended discriminator.
ReDoc displays definition with selectpicker using which user can select value of the `x-extendedDiscriminator`-marked field.
ReDoc displays the definition derived from the current (using `allOf`) and has `enum` with only one value which is the same as the selected value of the field specified as `x-extendedDiscriminator`.

###### x-extendedDiscriminator example

```yaml

Payment:
  x-extendedDiscriminator: type
  type: object
  required:
    - type
  properties:
    type:
      type: string
    name:
      type: string

CashPayment:
  allOf:
    - $ref: "#/definitions/Payment"
    - properties:
        type:
          type: string
          enum:
            - cash
        currency:
          type: string

PayPalPayment:
  allOf:
    - $ref: "#/definitions/Payment"
    - properties:
        type:
          type: string
          enum:
            - paypal
        userEmail:
          type: string
```

In the example above, the names of definitions (`PayPalPayment`) are named differently than names in the payload (`paypal`) which is not supported by default `discriminator`.

#### x-additionalPropertiesName
**ATTENTION**: This is a ReDoc-specific vendor extension, and is not supported by other tools.

Extends the `additionalProperties` property of the schema object.

| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-additionalPropertiesName | string | descriptive name of additional properties keys  |

###### How to use with ReDoc
ReDoc uses this extension to display a more descriptive property name in objects with `additionalProperties` when viewing the property list with an `object`.

###### x-additionalPropertiesName example

```yaml
Player:
  required:
  - name

  properties:
    name:
      type: string

  additionalProperties:
    x-additionalPropertiesName: attribute-name
    type: string
```

#### x-explicitMappingOnly
**ATTENTION**: This is ReDoc-specific vendor extension, and is not supported by other tools.

Extends the `discriminator` property of the schema object.

| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-explicitMappingOnly | boolean | limit the discriminator selectpicker to the explicit mappings only |

###### How to use with ReDoc
ReDoc uses this extension to filter the `discriminator` mappings shown in the selectpicker.
When set to `true`, the selectpicker will only list the the explicitly defined mappings. When `false`, the default behavior is kept, i.e. explicit and implicit mappings will be shown.

###### x-explicitMappingOnly example


```yaml
Pet:
  type: object
  required:
    - name
    - photoUrls
  discriminator:
    propertyName: petType
    x-explicitMappingOnly: true
    mapping:
      cat: "#/components/schemas/Cat"
      bee: "#/components/schemas/HoneyBee"
```

Will show in the selectpicker only the items `cat` and `bee`, even though the `Dog` class inherits from the `Pet` class.
