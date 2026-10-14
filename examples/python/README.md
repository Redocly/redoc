# Redoc in Python

One file, no framework: `http.server` from the standard library answers every request with the
docs page. The Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
python3 server.py
```

Then open http://localhost:8080.

## Use it in your app

- `server.py` — the response is a `<redoc spec-url>` tag plus one script tag. That is all Redoc
  needs; in a real app the same HTML goes into whatever framework you use (Flask, Django, FastAPI).
- `REDOC_URL` (environment variable) overrides where the bundle is loaded from, for self-hosting or
  pinning another version.
- `CAFE` is where your API description lives — any URL the browser can fetch.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-python .
docker run --rm -p 8080:8080 redoc-python
```
