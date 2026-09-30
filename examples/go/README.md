# Redoc in Go

One file, no framework: `net/http` serves the docs page at `/`. The Redoc bundle comes from the
jsDelivr CDN and the API description from a URL.

## Run

```bash
go run .
```

Then open http://localhost:8080.

## Use it in your app

- `main.go` — the handler returns a `<redoc spec-url>` tag plus one script tag. That is all Redoc
  needs; in a real app the same HTML goes into whatever router you use.
- `defaultRedocURL` is where the bundle is loaded from; the `REDOC_URL` environment variable
  overrides it, for self-hosting or pinning another version.
- `cafe` is where your API description lives — any URL the browser can fetch.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-go .
docker run --rm -p 8080:8080 redoc-go
```
