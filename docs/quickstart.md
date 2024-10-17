---
seo:
  title: Redoc quickstart guide
---

# Redoc quickstart guide

To render your OpenAPI definition using Redoc, use the following HTML code sample and
replace the `spec-url` attribute with the URL or local file address to your definition.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Redoc</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <!--
    Redoc element with link to your OpenAPI definition
    -->
    <redoc spec-url="http://petstore.swagger.io/v2/swagger.json"></redoc>
    <!--
    Link to Redoc JavaScript on CDN for rendering standalone element
    -->
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
```

{% admonition type="info" name="Redoc requires an HTTP server to run locally" %}
Loading local OpenAPI definitions is impossible without running a web server because of issues with
[same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) and
other security reasons. Refer to [Running Redoc locally](./deployment/intro.md#how-to-run-redoc-locally) for more information.
{% /admonition %}

For a more detailed explanation with step-by-step instructions and additional options for using Redoc, refer to the [Redoc deployment guide](./deployment/intro.md).
