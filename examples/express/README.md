# Redoc in Express

An Express 5 app that serves its API reference at `/`. One route returns the page; the Redoc
bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Use it in your app

- `server.js` — the route returns a `<redoc spec-url>` tag plus one script tag. Mount it wherever
  you like (`app.get('/docs', …)`).
- `REDOC_URL` (environment variable) overrides where the bundle is loaded from, for self-hosting or
  pinning another version.
- `CAFE` is where your API description lives — any URL the browser can fetch, for example the
  OpenAPI document your API already serves.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-express .
docker run --rm -p 3000:3000 redoc-express
```
