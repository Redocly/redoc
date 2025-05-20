---
seo:
  title: Redoc deployment guide
---

# Redoc deployment guide

Redoc offers multiple options for rendering your OpenAPI definition.
You should select the option that best fits your needs.

The following options are supported:

- **[Live demo](https://redocly.github.io/redoc/):**
  The live demo offers a fast way to see how your OpenAPI renders with Redoc.
  A version of the Swagger Petstore API is displayed by default. To test it with your own OpenAPI definition, enter the URL for your
  definition and select **TRY IT**.
- **[HTML element](./html.md):**
  Using the HTML element works well for typical website deployments.
- **[React component](./react.md):**
  Using the React component is an option for users with a React-based application.
- **[Docker image](./docker.md):**
  Using the Docker image works in a container-based deployment.
- **[Redocly CLI](./cli.md):**
  Using the Redocly CLI is an option for users who prefer to use a command-line interface.

## Before you start

### OpenAPI definition

You need an OpenAPI definition. For testing purposes, you can use one of the following sample OpenAPI definitions:

- OpenAPI 3.0
  - [Museum Example API](https://github.com/Redocly/museum-openapi-example/blob/main/openapi.yaml)
  - [Petstore Sample OpenAPI Definition](https://petstore3.swagger.io/api/v3/openapi.json)
- OpenAPI 2.0
  - [Thingful OpenAPI Definition](https://raw.githubusercontent.com/thingful/openapi-spec/master/spec/swagger.yaml)
  - [Fitbit Plus OpenAPI Definition](https://raw.githubusercontent.com/TwineHealth/TwineDeveloperDocs/master/spec/swagger.yaml)

{% admonition type="info" name="OpenAPI specification" %}
For more information on the OpenAPI specification, refer to the [Learning OpenAPI 3](https://redocly.com/docs/resources/learning-openapi/)
section in the documentation.
{% /admonition %}

### How to run Redoc locally

If you want to view your Redoc output locally, you can simulate an HTTP server.

#### Python

If you have [Python 3](https://www.python.org/downloads/) installed, `cd` into your
project directory and run the following command:

```python
python3 -m http.server
```

If you have [Python 2](https://www.python.org/downloads/) installed, `cd` into your
project directory and run the following command:

```python
python -m SimpleHTTPServer 8000
```

The output after entering the command provides the local URL where the preview can be accessed.
To exit the preview, use `control-C`.

#### Node.js

If you have [Node.js](https://nodejs.org/en/download/) installed, install `http-server`
using the following npm command:

```bash
npm install -g http-server
```

Then, `cd` into your project directory and run the following command:

```node
http-server
```

The output after entering the command provides the local URL where the preview can be accessed.
To exit the preview, use `control-C`.
