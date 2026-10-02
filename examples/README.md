# Examples

Self-contained projects showing how to embed Redoc. Copy one, point it at your own API
description, done. Every example renders the same Cafe API, loaded from a pinned copy in the
public Redoc repository:

```
https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml
```

| Example                      | Stack                       | Redoc from | Shows                                    |
| ---------------------------- | --------------------------- | ---------- | ---------------------------------------- |
| [`javascript`](./javascript) | plain HTML, no build step   | CDN        | the `<redoc spec-url>` tag               |
| [`react`](./react)           | Vite + React + TypeScript   | npm        | `<RedocStandalone>`                      |
| [`vue`](./vue)               | Vite + Vue 3 + TypeScript   | npm        | `init()` inside a Vue component          |
| [`svelte`](./svelte)         | Vite + Svelte 5 + TypeScript | npm       | `init()` inside a Svelte component       |
| [`angular`](./angular)       | Angular 22 (zoneless)       | npm        | `init()` inside an Angular component     |
| [`nextjs`](./nextjs)         | Next.js (App Router)        | npm        | `<RedocStandalone>` via `next/dynamic`   |
| [`nestjs`](./nestjs)         | NestJS (Node backend)       | CDN        | a controller returning the docs page     |
| [`spring`](./spring)         | Spring Boot 4 (Java 21)     | CDN        | a controller returning the docs page     |
| [`express`](./express)       | Express 5 (Node backend)    | CDN        | a route returning the docs page          |
| [`fastapi`](./fastapi)       | FastAPI (Python)            | CDN        | replacing the built-in Redoc 2 page      |
| [`aspnet`](./aspnet)         | ASP.NET Core (.NET 10)      | CDN        | a minimal-API endpoint returning the page|
| [`laravel`](./laravel)       | Laravel 12 (PHP)            | CDN        | a route + Blade view                     |
| [`java`](./java)             | Java 21, JDK `HttpServer`   | CDN        | one file, no framework                   |
| [`go`](./go)                 | Go, `net/http`              | CDN        | one file, no framework                   |
| [`rust`](./rust)             | Rust, `std::net`            | CDN        | one file, no crates                      |
| [`php`](./php)               | PHP 8, built-in server      | CDN        | one file, no framework                   |
| [`python`](./python)         | Python 3, `http.server`     | CDN        | one file, no framework                   |
| [`docker`](./docker)         | official `redocly/redoc` image | image   | `SPEC_URL` and env config, nothing to copy |
| [`cli`](./cli)               | `redocly build-docs`        | CLI        | one self-contained HTML file                |

Each README says how to run it. Each project also has a `docker/` folder that packages it into an
image. [`docker`](./docker) and [`cli`](./cli) are the exceptions — they document a delivery that
produces the page for you, so there is no project to package and nothing to copy.

## How examples are tested

Every example with a `docker/Dockerfile` is built, started and smoke-tested on each pull request
— against the Redoc build from this checkout, not the published package, so a change to the
library cannot break an example unnoticed. [`docker`](./docker) and [`cli`](./cli) are not
covered: each brings its own Redoc — baked into the image, shipped with the CLI — so a test on
either would exercise the published build rather than this checkout.

```bash
npm run build                          # produce bundles/ first
npm run test:examples                  # all examples
EXAMPLES=react npm run test:examples   # one or more, comma-separated
```

Requires Docker. The harness lives with the other end-to-end tests, in
`e2e/playwright/ce/examples/` (config: `e2e/playwright.examples.config.ts`): `npm pack`,
`docker build`, `docker run`, wait for the port, run `smoke.spec.ts`, remove the containers.
Nothing in this directory is test code.

The smoke opens the page, clicks through the sidebar to a known Cafe item, checks the heading,
reopens the deep link in a fresh tab, and fails on any page or console error.

## Adding an example

A *tested* example is any directory here with a `docker/Dockerfile`. There is no manifest — the
harness reads what it needs from the example itself:

1. Create `examples/<name>/` as a normal project for its ecosystem, plus `docker/Dockerfile`
   (built from the example root) whose image exposes **one** port — an `EXPOSE` line, or the one
   inherited from the base image (`nginx` exposes 80).
2. Render the Cafe URL above, so the shared smoke applies.
3. Honor the local-build contract, which depends on how the example gets Redoc:
   - **`redoc` listed in `package.json` `dependencies`** — the Dockerfile's install stage is named
     `build` and runs `if [ -f redoc.tgz ]; then npm install ./redoc.tgz; fi` before installing the
     rest. The harness drops the tarball into the example root and verifies the image resolved
     `redoc` from it.
   - **otherwise (bundle from the CDN)** — reference
     `https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js` literally in your
     page and replace it with the `REDOC_URL` environment variable when set (see
     `javascript/docker/set-redoc-url.sh` or the backends' controllers). The smoke checks the
     bundle came from the harness, not the CDN.
4. `EXAMPLES=<name> npm run test:examples`.


