# Redoc Contributing Guide

Hi! We're really excited that you are interested in contributing to Redoc. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

- [Redoc Contributing Guide](#redoc-contributing-guide)
  - [Issue Reporting Guidelines](#issue-reporting-guidelines)
  - [Pull Request Guidelines](#pull-request-guidelines)
  - [Development Setup](#development-setup)
    - [Commonly used NPM scripts](#commonly-used-npm-scripts)
  - [Project Structure](#project-structure)

## Issue Reporting Guidelines
- Before filing a new issue, try to make sure your problem doesn’t already exist.
- The best way to get your bug fixed is to provide a reduced test case.
- Follow the issue template and include a reproducible example.

## Pull Request Guidelines
Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from main.
2. Run `npm install` in the repository root.
3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`npm test`). Tip: `npm run unit:watch` is helpful in development.
5. Lint your code with [oxlint](https://oxc.rs/docs/guide/usage/linter) (`npm run lint`).

## Development Setup

You need [Node.js](http://nodejs.org) `>=22` and npm `>=10`.

After cloning the repo, run:

```bash
$ npm install # or npm
```

### Commonly used NPM scripts

``` bash
# dev-server, watch and auto reload playground
$ npm start

# run oxlint
$ npm run lint

# try autofix oxlint issues
$ npm run lint:fix

# run unit tests
$ npm run unit

# run e2e tests (builds the library, standalone bundle, and e2e hosts first)
$ npm run e2e

# open Playwright UI to debug e2e tests (requires a prior `npm run e2e` build)
$ npm run e2e:ui

# build and smoke-test every project in examples/ against the local build (needs Docker)
$ npm run test:examples

# run the full check suite (lint, typecheck, unit, e2e tests)
$ npm test

# prepare bundles
$ npm run build

```

There are some other scripts available in the `scripts` section of the `package.json` file.

## Project Structure

- **`examples`**: runnable projects embedding Redoc in different stacks, each smoke-tested in CI (see its README)

- **`playground`**: HMR Playground used in development

- **`e2e`**: contains e2e tests, written and run with [Playwright](https://playwright.dev/)

- **`src`**: contains the source code. The codebase is written in Typescript. CSS styles are managed with [Styled components](https://www.styled-components.com/). State is managed by [Jotai](https://github.com/pmndrs/jotai)

  - **`src/components`**: contains main visual components
  - **`src/adapters`**: builds the rendered docs tree from OpenAPI, AsyncAPI, and GraphQL definitions
  - **`src/services`**: contains different services used by Redoc
  - **`src/types`**: contains extra typescript typings including OpenAPI doc typings
  - **`src/utils`**: utility functions
  - **`src/jotai`**: contains Jotai store files
  - **`src/hooks`**: contains global react hooks for application