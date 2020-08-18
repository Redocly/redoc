# Frequently Asked Questions

This document lists common questions and issues raised by Redoc users. 
Before reporting a new issue, we recommend reading through this list. You might find a solution here, thus avoiding duplicate issues.

**Products covered in this FAQ**

[Redoc Community Edition](https://redoc.ly/redoc), which you can use as:

  - a local or CDN-hosted JS script in your HTML
  - a React component
  - [a command-line interface tool (redoc-cli)](https://github.com/Redocly/redoc/blob/master/cli/README.md)


## Jump To:

### 1. [Understanding Redoc Features](#1-understanding-redoc-features-1)

### 2. [Deploying Redoc](#2-deploying-redoc-1)

### 3. [Working with OpenAPI Definition Files](#3-working-with-openapi-definition-files-1)

### 4. [Troubleshooting Redoc](#4-troubleshooting-redoc-1)


----


## 1. Understanding Redoc Features


### Can Redoc load an API definition file from the local filesystem and build documentation from it?

When using Redoc as a JS script, this is not supported due to browser security restrictions. 
However, you can use the redoc-cli tool to bundle a local API definition file into a zero-dependency, static HTML file.
In this context, "zero-dependency" means that the HTML file already contains all the necessary resources inside, and does not need to refer to any
external scripts to display the content properly.


### Can Redoc autogenerate code examples from my API definition?

Redoc currently does not support autogenerating code examples. To include code examples in your API documentation,
you can generate them with a third-party tool, and insert them manually into your API definition using the 
[x-codeSamples vendor extension](https://github.com/Redocly/redoc/blob/master/docs/redoc-vendor-extensions.md#x-codeSamples). 

For more context and advice, refer to: [#15](https://github.com/Redocly/redoc/issues/15), [#309](https://github.com/Redocly/redoc/issues/309)


### Can I add a "Try It" feature to my Redoc-generated API docs?

In Redoc Community Edition, this feature is not supported. Consider upgrading to our premium API Reference Docs product, 
which [supports the API Console feature](https://redoc.ly/docs/api-reference-docs/console-overview/).


### Are there any Redoc-only features that other tools do not support?

Redoc supports advanced OpenAPI v3 declarations like nested objects, the discriminator, “one of”, “any of”, “all of”, nullable, and callbacks, which are not properly supported by other API documentation tools. Redoc also supports multiple response and request examples per path.


### Can I import my API data from Postman into Redoc?

Redoc does not integrate with Postman on this level. However, it may be possible to convert Postman Collections and schemas to OpenAPI definitions with third-party tools, and then use those OpenAPI definition files with Redoc.


## 2. Deploying Redoc


### Can I generate docs with Redoc from multiple API definition files?

Yes, there are several ways to do this. On the API definition level, you can use internal reference links ($ref) to bring in content from multiple files. Redoc automatically resolves the references and combines multiple API definition files into a single HTML. Be careful with file paths when inserting reference links into the API definition, especially if your files are in different locations.

Alternatively, you can create a separate HTML file for each API definition file, and manually insert links into each HTML to connect them.

For more context and advice, refer to: [#187](https://github.com/Redocly/redoc/issues/187), [#226](https://github.com/Redocly/redoc/issues/226), 
[#1106](https://github.com/Redocly/redoc/issues/1106)


### How can I modify Redoc options and theme if I'm using redoc-cli?

In Redoc Community Edition, the same [set of options](https://github.com/Redocly/redoc#redoc-options-object) is supported regardless of how you're deploying Redoc (redoc-cli, linked JS script, React component).

When using redoc-cli, you should provide the `--options` argument after the `bundle` or `serve` command, followed by the list of configuration parameters and their values. You can format the list in either of the following ways:

`redoc-cli command --options='{"theme":{"colors":{"primary":{"main":"black"}}}}' your-api-definition.yaml`

`redoc-cli command --options.theme.colors.primary.main=black your-api-definition.yaml`

If you want to modify a long list of options, it's more convenient to save them in a JSON file and pass it to redoc-cli:

`redoc-cli command --options=options.json your-api-definition.yaml`


## 3. Working with OpenAPI Definition Files

### What are some best practices for writing API definitions?

[Our documentation](https://redoc.ly/docs/resources/openapi-decisions/) offers advice for common challenges with OpenAPI workflows, 
as well as links to resources where you can learn more about the OpenAPI specification.

### I'm trying to use Markdown in my OpenAPI definition files, but Redoc is not generating it properly. What's wrong?

Redoc follows the OpenAPI specification and supports CommonMark formatting in specification `description` fields. You may encounter issues with rendering
Markdown if you set the Redoc option `untrustedSpec` to `true`, because it sanitizes all HTML/Markdown to prevent XSS (cross-site scripting).

A notable difference between the OpenAPI specification and Redoc is that Redoc supports Markdown tables in `description` fields. A table must be formatted with a
newline before and after it, and must use the pipe symbol (`|`) as the multiline string indicator.


## 4. Troubleshooting Redoc


### My Redoc-generated documentation is showing weird symbols in place of some characters or icons. What's wrong?

This is likely an encoding issue. Make sure `<meta charset="UTF-8" />` is set in the `<head>` section of your Redoc HTML.

For more context and advice, refer to: [#213](https://github.com/Redocly/redoc/issues/213)


### I'm trying to group paths by using tags in my API definition, but Redoc is not showing them. What's wrong?

Redoc supports the `x-tagGroups` vendor extension that allows you to organize the paths in your API definition. This also affects the presentation of 
your paths in the sidebar of the Redoc-generated API documentation. 

If you are using this vendor extension, and you forget to add a tag into a group, paths with that tag are not displayed in the sidebar at all.

To ensure all your paths are always displayed in the sidebar, consider writing a linter rule that will enforce tags for all paths. 
You can use our [openapi-cli](https://github.com/Redocly/openapi-cli) tool and write custom rules to validate your API definitions before generating API documentation. You can also create a generic tag group to hold all your paths that don't belong anywhere else. 


### I'm having trouble using Redoc in Internet Explorer. Is this browser supported?

Support for the Internet Explorer browser depends on the version. IE9 and prior are not supported by Redoc.

IE10 and IE11 are supported by default if Redoc is used as a JS script linked directly in the HTML. 
Refer to [our documentation](https://github.com/Redocly/redoc/blob/master/docs/usage-with-ie11.md) if you're using Redoc as a React component with IE11. 


### How can I optimize Redoc performance?

If Redoc-generated documentation seems slow to load, consider reducing the amount of paths, methods, and code examples in your API definition (if possible).
Setting the `hideLoading` option to `true` can also help in some cases.


### Search in Redoc is not working the way I expect it to. Are there any known limitations of this feature?

There are a few things regarding Redoc search to keep in mind:

- When using the search feature in Redoc-generated API documentation, only the menu items are searched - not the entire content. 

- Because Redoc relies on [Lunr](https://lunrjs.com/guides/language_support.html) for its search functionality, by default it only supports English. 
If your API definition is written in any other language, Redoc search does not return any results.
