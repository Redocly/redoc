# Redoc demo — React app over redoc.standalone.js

React (Vite) version of the interactive demo at https://redocly.github.io/redoc/:
the demo shell (spec picker, file upload, CORS toggle, loader) is a React app
that loads the standalone engine bundle at runtime and renders API docs with it.

`public/redoc.standalone.js` is a gitignored build input — build it from the
engine source at the repo root (see [Manual deploy](#manual-deploy)).

## Commands

Like the rest of the repo, this folder uses npm; it commits no lockfile:

```bash
npm install
npm run dev        # http://localhost:5173/redoc/
npm run build      # dist/ — html + hashed assets + 404.html + the engine bundle
npm run preview    # serve the production build at /redoc/
npm run ts:check
npm run lint
```

The app is served under `/redoc/` (see `base` in [vite.config.ts](vite.config.ts)),
matching its location on GitHub Pages.

The bundled example specs are not duplicated here — `dev` and `build` run
[scripts/sync-specs.mjs](scripts/sync-specs.mjs), which copies
`../playground/specs` into `public/specs/` (gitignored). The picker entries in
[src/specs.ts](src/specs.ts) point at that single source (plus a few remote
URLs).

## Release pipeline (→ gh-pages)

The `Deploy Demo` workflow (`.github/workflows/demo-deploy.yml`) builds the
standalone bundle and this app from the repo's own source and opens a PR
against `gh-pages`. Merging that PR deploys.

### Manual deploy

From the repo root:

```bash
npm install && npm run build:standalone && npm run minify
cp bundles/redoc.standalone.js demo/public/redoc.standalone.js
cd demo && npm install && npm run build
```

Then copy the contents of `dist/` over the root of the `gh-pages` branch,
including `dist/404.html` — the site-wide SPA fallback for the history router,
which must reference the current hashed assets. Merging to `gh-pages` deploys
automatically (branch-based GitHub Pages); allow ~10 minutes of CDN cache for
the old HTML to expire.

## How the standalone bundle is used

`public/redoc.standalone.js` is the minified CE engine build — a self-contained
ES module (it bundles its own React) exporting `init`, `hydrate`, and
`RedocStandalone`. This app cannot render the exported component with its own
React, so:

- [src/redoc.ts](src/redoc.ts) loads the bundle once via a runtime dynamic
  `import()`. Vite leaves it out of the app chunk, so app changes never
  invalidate the much larger engine file in browser caches.
- [src/RedocStandalone.tsx](src/RedocStandalone.tsx) mounts docs through
  `init(specOrUrl, options, element)` into a fresh container per spec and
  unmounts the returned React root on cleanup (older bundles whose `init`
  returns nothing are only detached). The options passed are
  `router: 'history'`, `basePath`, `sanitize: true` (uploaded and remote specs
  are untrusted), `hideLoading: true` (the demo shows its own loader until the
  docs actually commit), and a `scrollYOffset` function measuring the sticky
  nav.

Dark mode: the demo shell's own chrome themes off the `dark` class that the
standalone's color-mode switcher toggles on `<html>` (see the variables at the
top of [src/index.css](src/index.css)).

Analytics: set `GA_MEASUREMENT_ID` in [src/analytics.ts](src/analytics.ts) to
the GA4 web-stream ID; gtag loads only on `redocly.github.io`, so local dev and
forks never track.
