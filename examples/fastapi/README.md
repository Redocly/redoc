# Redoc in FastAPI

A FastAPI app that serves its API reference at `/` with **Redoc 3**. The bundle comes from the
jsDelivr CDN and the API description from a URL.

## Run

```bash
pip install -r requirements.txt
fastapi dev main.py
```

Then open http://localhost:8000.

## Use it in your app

FastAPI already ships Redoc — version 2, at `/redoc`, rendered by `get_redoc_html()`. That helper
writes a classic `<script>` tag, and the Redoc 3 bundle is an ES module, so it cannot be swapped in
with `redoc_js_url` alone. `main.py` shows the replacement:

- `FastAPI(redoc_url=None)` turns the built-in page off,
- one route returns a `<redoc spec-url>` tag plus `<script type="module" src="…">`.

Point `spec-url` at your own API description — in a real app that is `app.openapi_url`
(`/openapi.json`). `REDOC_URL` (environment variable) overrides where the bundle is loaded from,
for self-hosting or pinning another version.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-fastapi .
docker run --rm -p 8000:8000 redoc-fastapi
```
