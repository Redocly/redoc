"""Serves the Redoc page on http://localhost:8080 with nothing but the standard library."""

import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

REDOC_URL = os.environ.get("REDOC_URL") or (
    "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"
)

CAFE = "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml"

PAGE = f"""<!doctype html>
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
""".encode()

class Docs(BaseHTTPRequestHandler):
    """Every path gets the page; Redoc keeps its deep links in the URL hash."""

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(PAGE)))
        self.end_headers()
        self.wfile.write(PAGE)

if __name__ == "__main__":
    print("Redoc at http://localhost:8080", flush=True)
    ThreadingHTTPServer(("0.0.0.0", 8080), Docs).serve_forever()
