# ReDoc vendor extensions
ReDoc makes use of the following [vendor extensions](http://swagger.io/specification/#vendorExtensions)

### Info Object vendor extensions
Extends OpenAPI [Info Object](http://swagger.io/specification/#infoObject)
#### x-logo

| Field Name     |	Type	       | Description |
| :------------- | :-----------: | :---------- |
| x-logo         | [Logo Object](#logoObject)  | The information about API logo |

###### Usage in Redoc
`x-logo` is used to specify API logo. The corresponding image are displayed just above side-menu.

#### <a name="logoObject"></a>Logo Object
The information about API logo
###### Fixed fields
| Field Name      |	Type	   | Description |
| :-------------- | :------: | :---------- |
| url             | string   | The URL pointing to the spec logo. MUST be in the format of a URL
| backgroundColor | string   | background color to be used. MUST be RGB color in [hexadecimal format] (https://en.wikipedia.org/wiki/Web_colors#Hex_triplet)


###### x-logo example
json
```json
{
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "x-logo": {
      "url": "https://rebilly.github.io/ReDoc/petstore-logo.png",
      "backgroundColor": "#FFFFFF"
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
    url: "https://rebilly.github.io/ReDoc/petstore-logo.png"
    backgroundColor: "#FFFFFF"
```



### Tag Object vendor extensions
Extends OpenAPI [Tag Object](http://swagger.io/specification/#tagObject)
#### x-traitTag [DEPRECATED]
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-traitTag     | boolean  | In Swagger two operations can have multiply tags. This property distinguish between tags that are used to group operations (default) from tags that are used to mark operation with certain trait (`true` value) |

###### Usage in Redoc
Tags that have `x-traitTag` set to `true` are listed in side-menu but don't have any subitems (operations). Tag `description` is rendered as well.
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

### Operation Object vendor extensions
Extends OpenAPI [Operation Object](http://swagger.io/specification/#operationObject)
#### x-code-samples
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-code-samples | [ [Code Sample Object](#codeSampleObject) ]  | A list of code samples associated with operation |

###### Usage in ReDoc
`x-code-samples` are rendered on the right panel of ReDoc

#### <a name="codeSampleObject"></a>Code Sample Object
Operation code sample
###### Fixed fields
| Field Name  |	Type	   | Description  |
| :---------- | :------: | :----------- |
| lang        | string   | Code sample language. Value should be one of the following [list](https://github.com/github/linguist/blob/master/lib/linguist/popular.yml) |
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

### Schema Object vendor extensions
Extends OpenAPI [Schema Object](http://swagger.io/specification/#schemaObject)
#### x-code-samples
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-nullable | boolean | marks schema as a nullable |

###### Usage in ReDoc
Schemas marked as `x-nullable` are marked in ReDoc with the label Nullable
