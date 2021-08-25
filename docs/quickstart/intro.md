---
title: Redoc quickstart guide
---

# Redoc quickstart guide

This guide includes step-by-step instructions for how to get started using
Redoc to render your OpenAPI definition.

Redoc offers multiple options for rendering your OpenAPI definition.
You should select the option that best fits your needs.

The following options are supported:

- **[Live demo](https://redocly.github.io/redoc/):**
  The live demo offers a fast way to see how your OpenAPI will render with Redoc.
- **[HTML element](./html.md):**
  Using the HTML element works well for typical website deployments.
- **[React component](./react.md):**
  Using the React component is an option for users with a React-based application.
- **[Docker image](./docker.md):**
  Using the Docker image works in a container-based deployment.
- **[CLI](./cli.md):**
  Using the CLI is an option for users who prefer to use a command-line interface.

## Before you start

You will need an OpenAPI definition. For testing purposes, you can use one of the following sample OpenAPI definitions: 
- OpenAPI 3.0
    - [Rebilly Users OpenAPI Definition](https://raw.githubusercontent.com/Rebilly/api-definitions/main/openapi/users.yaml)
    - [Swagger Petstore Sample OpenAPI Definition](https://petstore3.swagger.io/api/v3/openapi.json)
- OpenAPI 2.0
    - [Thingful OpenAPI Definition](https://raw.githubusercontent.com/thingful/openapi-spec/master/spec/swagger.yaml)
    - [Fitbit Plus OpenAPI Definition](https://raw.githubusercontent.com/TwineHealth/TwineDeveloperDocs/master/spec/swagger.yaml)

For more information on the OpenAPI specification, refer to the [Learning OpenAPI 3](https://redoc.ly/docs/resources/learning-openapi/)
section in the documentation.

## Live demo online

If you want to see how ReDoc will render your OpenAPI definition, you can try it out online at https://redocly.github.io/redoc/.

A version of the Swagger Petstore API is displayed by default.  To test it with your own OpenAPI definition, enter the URL for your
definition and select the **TRY IT** button.
