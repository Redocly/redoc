# Redoc in PHP

One file, no framework: `index.php` prints the docs page, served here by PHP's built-in server.
The Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
php -S localhost:8080
```

Then open http://localhost:8080.

## Use it in your app

- `index.php` — the page is a `<redoc spec-url>` tag plus one script tag. That is all Redoc needs;
  drop the same HTML into any template or framework.
- The `REDOC_URL` environment variable overrides where the bundle is loaded from, for self-hosting
  or pinning another version.
- `$cafe` is where your API description lives — any URL the browser can fetch.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-php .
docker run --rm -p 8080:8080 redoc-php
```
