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

## Pull Request Guidelines
Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from main.
2. Run `npm install` in the repository root.
3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`npm test`). Tip: `npm test -- --watch TestName` is helpful in development.
5. Lint your code with eslint (`npm run lint`).

## Development Setup

You need [Node.js](http://nodejs.org) at `Node LTS+`.

After cloning the repo, run:

```bash
$ npm install # or npm
```

### Commonly used NPM scripts

``` bash
# dev-server, watch and auto reload playground
$ npm start

# run tslint
$ npm run lint

# try autofix tslint issues
$ npm run lint:fix

# run unit tests
$ npm run unit

# run e2e tests
$ npm run e2e
# Make sure you have created bundle before running e2e test
# E.g. run `npm run build` and wait for the finishing process.

# open Playwright UI to debug e2e test
$ npm run e2e:ui

# run the unit tests (includes linting and license checks)
$ npm test

# prepare bundles
$ npm run build

```

There are some other scripts available in the `scripts` section of the `package.json` file.

## Project Structure

- **`examples`**: contains project demos

- **`playground`**: HMR Playground used in development

- **`docs`**: contains extra docs (linked from README.md)

- **`playwright`**: contains e2e tests. The e2e tests are written and run with [Playwright](https://playwright.dev/).

- **`src`**: contains the source code. The codebase is written in Typescript. CSS styles are managed with [Styled components](https://www.styled-components.com/). State is managed by [Jotai](https://github.com/pmndrs/jotai)

  - **`src/components`**: contains main visual components
  - **`src/services`**: contains different services used by Redoc including Jotai stores
  - **`src/models`**: contains classes for OpenAPI entities (e.g. Response, Operations, etc)
  - **`src/types`**: contains extra typescript typings including OpenAPI doc typings
  - **`src/utils`**: utility functions
  - **`src/jotai`**: - contains Jotai store files
  - **`src/hooks`**: - contains global react hooks for application