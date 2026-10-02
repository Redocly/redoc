# Redoc from the Redocly CLI

`redocly build-docs` turns an API description into one self-contained, server-rendered HTML file.
No project, no build step, nothing to host but the file — which is why this example is a README
rather than a folder to copy, and why CI does not smoke-test it: the CLI brings its own Redoc, so
a test here would exercise the published CLI rather than this checkout
(see [../README.md](../README.md)).

## Run

```bash
npx @redocly/cli@latest build-docs openapi.yaml
```

The docs land in `redoc-static.html`. Open it straight from disk — routing is hash-based by
default, so deep links work over `file://` with no server at all. Commit the file, drop it in a
bucket, attach it to a release: there is nothing else to deploy.

## Options

| Option                | Default             | What it does                                                        |
| --------------------- | ------------------- | ------------------------------------------------------------------- |
| `-o`, `--output`      | `redoc-static.html` | output file                                                         |
| `--title`             | the API's title     | page title                                                          |
| `-t`, `--template`    | built-in            | path to a handlebars page template                                  |
| `--templateOptions`   | —                   | values for your template, dot notation (`templateOptions.metaDescription`) |
| `--theme`             | —                   | `theme.openapi` configuration, dot notation (`theme.openapi.nativeScrollbars`) |
| `--disableGoogleFont` | `false`             | skip the Google Fonts stylesheet                                    |
| `--config`            | `redocly.yaml`      | config file to read                                                 |
| `--lint-config`       | `warn`              | severity for linting that config: `warn`, `error`, `off`            |

`--theme` must reach `theme.openapi` or the command refuses the argument — `--theme.openapi.…`,
not `--theme.…`.

## How the page works

Worth knowing if you write your own `--template`:

- The page is **server-rendered first**, then hydrated in the browser, so it shows the docs
  before any script runs.
- `hydrate(definition, options?, element?)` attaches to that markup instead of replacing it. It
  takes the same arguments as `init` and returns a promise, and **the definition must be the same
  pre-bundled document the page was rendered from** — hydrating against a freshly fetched
  description will not match. On an empty element it client-renders instead.
- Pages built this way report `typeOfUsage: 'cli'` in telemetry, which is how CLI output is
  distinguished from the script-tag, React and Docker surfaces.
