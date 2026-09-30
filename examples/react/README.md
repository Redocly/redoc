# Redoc in React

Vite + React + TypeScript. One `<RedocStandalone>` component rendering the Cafe API from a URL.

## Run

```bash
npm install
npm run dev
```

That opens http://localhost:5173.

## Use it in your app

```bash
npm install redoc react react-dom styled-components
```

```tsx
import { RedocStandalone } from 'redoc';

<RedocStandalone specUrl="/your-api.yaml" />;
```

Put `your-api.yaml` in `public/` so Vite serves it at `/your-api.yaml`; a file elsewhere in the
project is not served, and the dev server answers with `index.html` instead.

The spec type (OpenAPI, AsyncAPI or GraphQL) is detected from the document; to mount the docs under
a sub-path pass `basePath`.

## Docker

`docker/` is the production recipe (and what CI tests): `npm run build`, then nginx serving
`dist/`. `npm run dev` does not use any of it — the Vite dev server has this built in. The nginx
config adds the one thing a static server lacks: a SPA fallback, because Redoc deep links such as
`/orders/listOrders` are client-side routes and a hard reload on one must still get `index.html`.

```bash
docker build -f docker/Dockerfile -t redoc-react .
docker run --rm -p 8080:80 redoc-react
```
