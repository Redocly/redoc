# Redoc in Next.js

Next.js (App Router) with `<RedocStandalone>` in a client component, rendering the Cafe API from
a URL.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Use it in your app

```bash
npm install redoc styled-components
```

`components/redoc.tsx` loads `RedocStandalone` with `next/dynamic` and `ssr: false`: Redoc fetches
and renders the API description in the browser, so there is nothing to render on the server.

Redoc's deep links (`/orders/listOrders`) are client-side routes. The page lives in an optional
catch-all segment (`app/[[...slug]]/page.tsx`) so a hard reload on a deep link still resolves to
it. The spec type is detected from the document; to mount the docs under a sub-path pass `basePath`
and move the segment accordingly.

## Docker

`docker/` builds the app with `output: 'standalone'` and runs Next's own server (this is also how
CI tests the example):

```bash
docker build -f docker/Dockerfile -t redoc-nextjs .
docker run --rm -p 3000:3000 redoc-nextjs
```
