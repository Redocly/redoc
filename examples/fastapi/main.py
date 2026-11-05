"""A FastAPI app whose API reference at / is Redoc 3 instead of the bundled Redoc 2."""

import os

from fastapi import FastAPI
from fastapi.openapi.docs import get_redoc_html
from fastapi.responses import HTMLResponse

REDOC_URL = os.environ.get("REDOC_URL") or (
    "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"
)

CAFE = "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml"

app = FastAPI(title="Cafe", redoc_url=None, docs_url=None)

@app.get("/", include_in_schema=False)
def docs() -> HTMLResponse:
    page = get_redoc_html(
        openapi_url=CAFE,
        title="Cafe API - Redoc",
        redoc_js_url=REDOC_URL,
        with_google_fonts=False,
    )
    # get_redoc_html() writes a classic <script> tag; the Redoc 3 bundle loads only as a module.
    html = page.body.decode("utf-8").replace("<script src=", '<script type="module" src=', 1)
    return HTMLResponse(html)
