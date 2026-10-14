# Redoc in NestJS

A NestJS app that serves its API reference at `/`. One controller returns the page; the Redoc
bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Use it in your app

- `src/docs.controller.ts` — returns the page: a `<redoc spec-url>` tag plus one script tag.
  `REDOC_URL` (environment variable) overrides where the bundle is loaded from, for self-hosting
  or pinning another version.
- The `<redoc spec-url>` in that page is where your API description lives — any URL your
  browser can fetch, for example the OpenAPI document your Nest app already generates.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-nestjs .
docker run --rm -p 3000:3000 redoc-nestjs
```
