# ReDoc
[![Build Status](https://travis-ci.org/Rebilly/ReDoc.svg?branch=master)](https://travis-ci.org/Rebilly/ReDoc) [![Coverage Status](https://coveralls.io/repos/Rebilly/ReDoc/badge.svg?branch=master&service=github)](https://coveralls.io/github/Rebilly/ReDoc?branch=master) [![Code Climate](https://codeclimate.com/github/Rebilly/ReDoc/badges/gpa.svg)](https://codeclimate.com/github/Rebilly/ReDoc) [![David](https://david-dm.org/Rebilly/ReDoc/dev-status.svg)](https://david-dm.org/Rebilly/ReDoc#info=devDependencies)

[![npm](http://img.shields.io/npm/v/redoc.svg)](https://www.npmjs.com/package/swagger-parser) [![Bower](http://img.shields.io/bower/v/redoc.svg)](http://bower.io/) [![License](https://img.shields.io/npm/l/redoc.svg)](https://github.com/Rebilly/ReDoc/blob/master/LICENSE)

[![Browser Compatibility](https://saucelabs.com/browser-matrix/redoc.svg)](https://saucelabs.com/u/redoc)

Swagger-generated API Reference Documentation

[Live demo](http://rebilly.github.io/ReDoc/)

## Deployment

#### tl;dr
```html
<!DOCTYPE html>
<html>
  <head>
    <title>ReDoc</title>
    <!-- needed for adaptive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--
    ReDoc uses font options from the parent element
    So override default browser styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Verdana, Geneva, sans-serif;
        font-size: 14px;
        color: #333;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='http://petstore.swagger.io/v2/swagger.json'>
    </redoc>
    <script src="bower_components/redoc/dist/redoc.min.js"> </script>
  </body>
</html>
```

#### 1. Install redoc
Install using [bower](bower.io):

    bower install redoc

or using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

    npm install redoc --save

Alternatively you can just download [`redoc.min.js`](https://raw.githubusercontent.com/Rebilly/ReDoc/releases/dist/redoc.min.js).

#### 2. Reference redoc script in HTML
Then reference [`redoc.min.js`](https://raw.githubusercontent.com/Rebilly/ReDoc/releases/dist/redoc.min.js) in your HTML page:
```html
<script src="bower_components/redoc/dist/redoc.min.js"> </script>
```
For npm:
```html
<script src="node_modules/redoc/dist/redoc.min.js"> </script>
```

#### 3. Add `<redoc>` element to your page
```html
<redoc spec-url="<url to your spec>"></redoc>
```

#### 4. Enjoy :smile:

## Configuration

* `spec-url` - relative or absolute url to your spec file
* `scroll-y-offset` - If set, specifies a vertical scroll-offset. This is often useful when there are fixed positioned elements at the top of the page, such as navbars, headers etc.
`scroll-y-offset` can be specified in various ways:
  * **number**: A fixed number of pixels to be used as offset
  * **selector**: selector of the element to be used for specifying the offset. The distance from the top of the page to the element's bottom will be used as offset.
  * **function**: A getter function. Must return a number representing the offset (in pixels).

## Advanced usage
Instead of adding `spec-url` attribute to the `<redoc>` element you can initialize ReDoc via globally exposed `Redoc` object:
```js
Redoc.init(specUrl, options)
```

`options` is javascript object with camel-cased version of options names as the keys. For example:
```js
Redoc.init('http://petstore.swagger.io/v2/swagger.json', {
  scrollYOffset: 50
})
```
-----------
## Running locally
1. Clone repository
`git clone https://github.com/Rebilly/ReDoc.git`
2. Go to the project folder
`cd ReDoc`
3. Install node modules
`npm install`
4. _(optional)_ Replace `demo/swagger.json` with your own schema
5. Start the server
`npm start`
6. Open `http://localhost:9000`
