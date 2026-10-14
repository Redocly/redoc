# Redoc in Laravel

Two files added to a stock Laravel app: a route and a Blade view. The route serves the API
reference at `/`; the Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

Inside any Laravel 11+ app, copy `routes/web.php` and `resources/views/docs.blade.php` over the
defaults (or merge the route into yours), then:

```bash
php artisan serve
```

Then open http://localhost:8000.

## Use it in your app

- `routes/web.php` — the route renders the view with two values.
- `resources/views/docs.blade.php` — a `<redoc spec-url>` tag plus one script tag. That is all Redoc
  needs.
- `REDOC_URL` (environment variable) overrides where the bundle is loaded from, for self-hosting or
  pinning another version.
- `CAFE` is where your API description lives — any URL the browser can fetch, for example the
  OpenAPI document your API already serves.

## Docker

The image scaffolds a fresh Laravel app with Composer and copies the two files in (this is also
how CI tests the example):

```bash
docker build -f docker/Dockerfile -t redoc-laravel .
docker run --rm -p 8000:8000 redoc-laravel
```

It starts the app with `artisan serve --no-reload`. Without that flag `artisan serve` re-reads
`.env` on every request and drops the environment the container was given — `REDOC_URL` with it.
