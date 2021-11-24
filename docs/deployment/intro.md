---
title: Redoc deployment guide
redirectFrom:
  - /docs/quickstart/intro/
---

# Redoc deployment guide

Redoc offers multiple options for rendering your OpenAPI definition.
You should select the option that best fits your needs.

The following options are supported:

- **[Live demo](https://redocly.github.io/redoc/):**
  The live demo offers a fast way to see how your OpenAPI will render with Redoc.
  A version of the Swagger Petstore API is displayed by default. To test it with your own OpenAPI definition, enter the URL for your
  definition and select **TRY IT**.
- **[HTML element](./html.md):**
  Using the HTML element works well for typical website deployments.
- **[React component](./react.md):**
  Using the React component is an option for users with a React-based application.
- **[Docker image](./docker.md):**
  Using the Docker image works in a container-based deployment.
- **[CLI](./cli.md):**
  Using the CLI is an option for users who prefer to use a command-line interface.

## Before you start

### OpenAPI definition

You will need an OpenAPI definition. For testing purposes, you can use one of the following sample OpenAPI definitions:

- OpenAPI 3.0
  - [Rebilly Users OpenAPI Definition](https://raw.githubusercontent.com/Rebilly/api-definitions/main/openapi/users.yaml)
  - [Swagger Petstore Sample OpenAPI Definition](https://petstore3.swagger.io/api/v3/openapi.json)
- OpenAPI 2.0
  - [Thingful OpenAPI Definition](https://raw.githubusercontent.com/thingful/openapi-spec/master/spec/swagger.yaml)
  - [Fitbit Plus OpenAPI Definition](https://raw.githubusercontent.com/TwineHealth/TwineDeveloperDocs/master/spec/swagger.yaml)

:::info OpenAPI specification
For more information on the OpenAPI specification, refer to the [Learning OpenAPI 3](https://redoc.ly/docs/resources/learning-openapi/)
section in the documentation.
:::

### Running Redoc locally

If you want to view your Redoc output locally, you can simulate an HTTP server.

#### Using Redocly OpenAPI CLI

Redocly OpenAPI CLI is an open source command-line tool that includes a command
for simulating an HTTP server to provide a preview of your OpenAPI definition locally.

If you have [OpenAPI CLI](https://redoc.ly/docs/cli/#installation-and-usage) installed, `cd` into your
project directory and run the following command:

```bash
openapi preview-docs openapi.yaml
```

Replace `openapi.yaml` in the example command with the file path to your OpenAPI definition.

By default, without providing a port, the preview starts on port 8080, and can be accessed at `http://localhost:8080`.
To exit the preview, use `control+C`.

You can alter the port if you are using 8080 already, for example:

```bash
openapi preview-docs -p 8888 openapi.yaml
```

Replace `openapi.yaml` in the example command with the file path to your OpenAPI definition.

For more information about the `preview-docs` command, refer to
[OpenAPI CLI commands](https://redoc.ly/docs/cli/commands/preview-docs/#preview-docs) in the OpenAPI CLI documentation.

#### Using Python

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

#### Using Node.js

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
