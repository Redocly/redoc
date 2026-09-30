# Redoc in plain HTML

One page, no build step, no npm. It loads Redoc from the jsDelivr CDN with one script tag and
renders the Cafe API from a URL.

## Run

Browsers refuse to run module scripts from `file://`, so serve the folder over HTTP:

```bash
npx http-server . -o
```

That opens http://localhost:8080. Any static server works (nginx, S3, GitHub Pages…).

## Use it in your page

```html
<redoc spec-url="https://example.com/your-api.yaml"></redoc>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"
></script>
```

The tag renders as soon as the module loads. Redoc works out whether the document is OpenAPI,
AsyncAPI or GraphQL from the document itself.
Any other attribute becomes an option too — `router="history"`, for instance. To decide yourself
when and where Redoc renders, import `init` from the same module instead:
`init(specUrl, options, element)`.

## Docker

`docker/` packages the page into an nginx image (this is also how CI tests the example):

```bash
docker build -f docker/Dockerfile -t redoc-javascript .
docker run --rm -p 8080:80 redoc-javascript
```
