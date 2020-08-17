# Frequently Asked Questions

This document lists common questions and issues raised by ReDoc users. 
Before reporting a new issue, we recommend reading through this list. You might find a solution here, thus avoiding duplicate issues.

**Products covered in this FAQ**

[ReDoc Community Edition](https://redoc.ly/redoc)

  - [command-line interface (redoc-cli)](https://github.com/Redocly/redoc/blob/master/cli/README.md)
  - standalone ReDoc
  - React component


## Jump To:

### 1. [ReDoc Features and Capabilities](#1-redoc-features-and-capabilities-1)

### 2. [Deploying ReDoc](#2-deploying-redoc-1)

### 3. [Working with Spec Files](#3-working-with-spec-files-1)

### 4. [Troubleshooting ReDoc](#4-troubleshooting-redoc-1)


----


## 1. ReDoc Features and Capabilities


### Can ReDoc load a spec file from the local filesystem and build API documentation from it?

In standalone ReDoc, this is not supported due to browser security restrictions. 
However, you can use the redoc-cli tool to bundle a local spec file into a zero-dependency HTML file.
In this context, "zero-dependency" means that the bundled HTML file already contains all necessary scripts inside, and does not need to refer to any
external files to display the content properly.


### Can ReDoc autogenerate code examples from my spec file?

ReDoc currently does not support autogenerating code examples. To include code examples in your API documentation,
you can generate them with a third-party tool, and insert them manually into the spec using the 
[x-codeSamples vendor extension](https://github.com/Redocly/redoc/blob/master/docs/redoc-vendor-extensions.md#x-codeSamples). 

For more context and advice, refer to: [#15](https://github.com/Redocly/redoc/issues/15), [#309](https://github.com/Redocly/redoc/issues/309)


### Can I add a "Try It" feature to my ReDoc-generated API docs?

In ReDoc Community Edition, this feature is not supported. Consider upgrading to our premium API Reference Docs product, 
which [supports the API Console feature](https://redoc.ly/docs/api-reference-docs/console-overview/).


### Are there any ReDoc-only features that other tools do not support?

The following vendor extensions are ReDoc-specific and will be ignored by other tools:

- `x-additionalPropertiesName`
- `x-extendedDiscriminator`

Refer to [our documentation](https://github.com/Redocly/redoc/blob/master/docs/redoc-vendor-extensions.md) for usage details.


### Can I import my API data from Postman into ReDoc?

ReDoc does not integrate with Postman on this level. However, it may be possible to convert Postman Collections and schemas to OpenAPI with third-party tools,
and then use those OpenAPI spec files with ReDoc.


## 2. Deploying ReDoc


### Can I generate API docs with ReDoc from multiple spec files?

Yes, there are several ways to do this. On the spec level, you can use internal reference links ($ref) to connect multiple specs, and ReDoc will combine them
into a single HTML. Be careful with file paths when inserting reference links into the spec, especially if your spec files are in different locations.

Alternatively, you can create a separate HTML file for each spec file, and manually insert links into each HTML to connect them.

For more context and advice, refer to: [#187](https://github.com/Redocly/redoc/issues/187), [#226](https://github.com/Redocly/redoc/issues/226), 
[#1106](https://github.com/Redocly/redoc/issues/1106)


### How can I modify ReDoc options and theme if I'm using redoc-cli to generate HTML?

In ReDoc Community Edition, the same [set of options](https://github.com/Redocly/redoc#redoc-options-object) is supported for all ReDoc variants (redoc-cli,
standalone ReDoc, React component). 

If you want to modify a long list of options, it's more convenient to save them in a JSON file and pass it to redoc-cli:

`redoc bundle --options=options.json your-spec-file`


## 3. Working with Spec Files

### What are some best practices for writing OpenAPI specs?

[Our documentation](https://redoc.ly/docs/resources/openapi-decisions/) offers advice for common challenges with OpenAPI workflows, 
as well as links to resources where you can learn more about the OpenAPI specification.

### I'm trying to use Markdown in my spec files, but ReDoc is not generating it properly. What's wrong?

ReDoc follows the OpenAPI specification and supports CommonMark formatting in specification `description` fields. You may encounter issues with rendering
Markdown if you set the ReDoc option `untrustedSpec` to `true`, because it sanitizes all HTML/Markdown to prevent XSS (cross-site scripting).

A notable difference between OpenAPI specification and ReDoc is that ReDoc supports Markdown tables in `description` fields. A table must be formatted with a
newline before and after it, and must use the pipe symbol (`|`) as the multiline string indicator.


## 4. Troubleshooting ReDoc


### My ReDoc-generated documentation is showing weird symbols in place of some characters or icons. What's wrong?

This is likely an encoding issue. Make sure `<meta charset="UTF-8" />` is set in the `<head>` section of your ReDoc HTML.

For more context and advice, refer to: [#213](https://github.com/Redocly/redoc/issues/213)


### I'm trying to group endpoints using tags in my spec, but ReDoc is not showing them. What's wrong?

ReDoc supports the `x-tagGroups` vendor extension that allows you to organize the way your endpoints are presented in the ReDoc sidebar. 

If you are using this extension, and you forget to add a tag into a group, endpoints with this tag will not be displayed in the sidebar at all.
To ensure all your endpoints are always displayed in the sidebar, consider writing a linter rule that will enforce tags for all endpoints. 
You can also create a generic tag group to hold all your endpoints that don't belong anywhere else. 


### I'm having trouble using ReDoc in Internet Explorer. Is this browser supported?

Support for the Internet Explorer browser depends on the version. IE9 and prior are not supported by ReDoc.
IE10 and IE11 are supported by default if ReDoc is used as a standalone package. 
Refer to [our documentation](https://github.com/Redocly/redoc/blob/master/docs/usage-with-ie11.md) if you're using ReDoc as a React component with IE11. 


### How can I optimize ReDoc performance?

If ReDoc-generated documentation seems slow to load, consider reducing the amount of endpoints and code examples in your spec (if possible).
Setting the `hideLoading` option to `true` can also help in some cases.


### Search in ReDoc is not working the way I expect it to. Are there any known limitations of this feature?

There are a few things regarding ReDoc search to keep in mind:

- When using the search feature in ReDoc-generated API documentation, only the menu items are searched - not the entire content. 

- Because ReDoc relies on [Lunr](https://lunrjs.com/guides/language_support.html) for its search functionality, by default it only supports English. 
If your spec is written in any other language, ReDoc search will not return any results.
