"""A FastAPI app whose API reference at / is Redoc 3 instead of the bundled Redoc 2."""

import os

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

REDOC_URL = os.environ.get("REDOC_URL") or (
    "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"
)

CAFE = "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml"

app = FastAPI(title="Cafe", redoc_url=None, docs_url=None)

@app.get("/", include_in_schema=False)
def docs() -> HTMLResponse:
    return HTMLResponse(
        f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe API - Redoc</title>
    <style>body {{ margin: 0; }}</style>
  </head>
  <body>
    <redoc spec-url="{CAFE}"></redoc>
    <script type="module" src="{REDOC_URL}"></script>
  </body>
</html>
"""
    )
