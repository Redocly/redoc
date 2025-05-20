---
seo:
  title: Use the Redoc CLI
---

# How to use the Redocly CLI

With Redocly CLI, you can bundle your OpenAPI definition and API documentation
(made with Redoc) into an HTML file and render it locally.

## Step 1 - Install Redocly CLI

First, you need to install the `@redocly/cli` package.

You can install it [globally](../../cli/installation#install-globally) using npm.

Or you can install it during [runtime](../../cli/installation#use-npx-at-runtime) using npx or Docker.

## Step 2 - Build the HTML file

The Redocly CLI `build-docs` command builds Redoc into an HTML file.

To build an HTML file using Redocly CLI, enter the following command,
replacing `apis/openapi.yaml` with your API definition file's name and path:

```bash
redocly build-docs apis/openapi.yaml
```

See the [build-docs](../../cli/commands/build-docs) documentation for more information
on the different options and ways you can use the command.

Also, check out [Redocly CLI commands](../../cli/commands), for more
information on the different things you can do with Redocly CLI including
linting, splitting, and bundling your API definition file.
