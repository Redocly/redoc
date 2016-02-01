# ReDoc vendor extensions
ReDoc makes use of the following [vendor extensions](http://swagger.io/specification/#vendorExtensions)

### <a name="infoObject"></a> [Info Object](http://swagger.io/specification/#infoObject) vendor extensions

#### <a name="x-logo"></a> x-logo

| Field Name     |	Type	       | Description |
| :------------- | :-----------: | :---------- |
| x-logo         | [Logo Object](#logoObject)  | The information about API logo |

##### Usage in Redoc
`x-logo` is used to specify API logo. The corresponding image are displayed just above side-menu.

#### <a name="logoObject"></a> Logo Object
The information about API logo
##### Fixed fields
| Field Name      |	Type	   | Description |
| :-------------- | :------: | :---------- |
| url             | string   | The URL pointing to the spec logo. MUST be in the format of a URL
| backgroundColor | string   | background color to be used. MUST be in [CSS color syntax](https://developer.mozilla.org/en/docs/Web/CSS/color) |


##### x-logo example
```yaml
{
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore",
    "x-logo": {
      "url": "https://rebilly.github.io/ReDoc/petstore-logo.png",
      "backgroundColor": "white"
    }
  }
}
```
```yaml
{
  info:
    version: "1.0.0"
    title: "Swagger Petstore"
    x-logo:
      url: "https://rebilly.github.io/ReDoc/petstore-logo.png"
      backgroundColor: "white"
}
```



### [Tag object](http://swagger.io/specification/#tagObject) vendor extensions

#### <a name="x-traitTag"></a> x-traitTag
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-traitTag     | boolean  | In Swagger two operations can have multiply tags. This property distinguish between tags that are used to group operations (default) from tags that are used to mark operation with certain trait (`true` value) |

##### Usage in Redoc
Tags that have `x-traitTag` set to `true` are listed in side-menu but don't have any subitems (operations). Tag `description` is rendered as well.
This is useful for handling out common things like Pagination, Rate-Limits, etc.

##### x-traitTag example
```json
{
    "name": "Pagination",
    "description": "Pagination description (can use markdown syntax)",
    "x-traitTag": true
}
```
```yaml
name: Pagination
description: Pagination description (can use markdown syntax)
x-traitTag: true
```

### [Operation Object](http://swagger.io/specification/#operationObject) vendor extensions

#### <a name="x-code-samples"></a> x-code-samples
| Field Name     |	Type	  | Description |
| :------------- | :------: | :---------- |
| x-code-samples | [[Code Sample Object](#codeSampleObject)]  | A list of code samples associated with operation |

##### Usage in ReDoc
x-code-samples are rendered on the right panel of ReDoc

#### <a name="codeSampleObject"></a> Code Sample Object
Operation code sample
##### Fixed fields
| Field Name  |	Type	   | Description  |
| :---------- | :------: | :----------- |
| lang        | string   | Code sample language. Value should be one of the following [list](https://github.com/github/linguist/blob/master/lib/linguist/popular.yml) |
| source      | string   | Code sample source code |


##### Code Sample Object example
```yaml
{
  "lang": "JavaScript",
  "source": "console.log('Hello World');"
}
```
```yaml
{
  lang: JavaScript
  source: console.log('Hello World');
}
```
