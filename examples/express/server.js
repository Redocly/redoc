import express from 'express';

const REDOC_URL =
  process.env.REDOC_URL ?? 'https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js';

const CAFE =
  'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';

const app = express();

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe API — Redoc</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="${CAFE}"></redoc>
    <script type="module" src="${REDOC_URL}"></script>
  </body>
</html>`);
});

app.listen(3000, () => console.log('Redoc at http://localhost:3000'));
