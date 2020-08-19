# ReDoc

## Frequently Asked Questions

### Installation

**I'm trying to install redoc cli using `$ npx @redocly/redoc-cli`, but I'm getting `npm ERR! 404`.**

The correct command for installing redoc cli is:

    $ npx redoc-cli

**Is it possible to run two or more instances of ReDoc on one server?**

ReDoc is a purely client-side application, therefore it does not run on a server. However, if you would like to run two versions of the same OpenAPI definition, then you would set up two instances of ReDoc with each one pointing to a separate version of the OpenAPI definition.

### Deployment

**Are slow browser load times due to the size of my OpenAPI definition? If so, what can I do to speed things up?**

No. Slow load times are not due to file size but to the number of endpoints and methods used.

In order to speed up browser load times:

  1. Make sure you have updated to the latest version of ReDoc.
  2. Create separate OpenAPI definitions for each endpoint.
  3. Host each endpoint on a separate instance of ReDoc.

### OpenAPI Definitions

**How can I use ReDoc to automatically generate code samples?**

Unfortunately, ReDoc does not support automatically generating code samples. It can, however, render them. You can use a tool like Postman to generate the code samples. Additionally, you can store each sample in a separate file and use scripts to bundle them into the spec. Consider using [Yeoman Generator](https://github.com/Rebilly/generator-openapi-repo) for this task.

**I am seeing strange text such as `â€"204` in place of the `No Content` response icon.**

Please add the following to the head section of your HTML:

```html
<meta charset="UTF-8"/>
```

### Themes / Styling

**The width and height values of the logo appear to be mixed up.**

They aren't mixed up. It is likely that it appears this way because by default `maxHeight` is set to the value of the width of the sidebar. This can, however, be overridden.

**What command do I use to make the third panel visible?**

You can achieve this with the following `redoc-cli` command:

    redoc-cli serve --options.theme.breakpoints.medium=70rem <swagger.yaml>

### Extensions

**Using the `x-servers` vendor extension, I am getting the following error:**

    Cannot read property 'startsWith' of undefined

This is most likely the result of prefixing you internal fields with `x-`. If you are prefacing your internal fields with `x-` (as in `x-description` and `x-url`), you must remove remove the `x-` prefixes (making the fields `description` and `url`, instead).

**What is the purpose of the `x-extendedDiscriminator` extension?**

OpenAPI 3 introduced `mapping`. `x-extendedDiscriminator` was created to facilitate backward-compatibility with `mapping` in OpenAPI 2.

### Feature Requests

**Do you have any plans to include an `Add to Postman` button with ReDoc?**

Unfortunately, this feature is outside the scope of the ReDoc project. You can, however, add the button manually in either the navbar or the Markdown description.

**Has the ReDoc team considered adding the option to disable the side menu, thereby not rendering it to the DOM?**

Adding this feature is currently under consideration.

### Miscellaneous

**Do I need to have React installed in order to use ReDoc with Vue.js?**

Yes. ReDoc requires React to work. You do not, however, need to install any React components, just React and ReactDOM.
