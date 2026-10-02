# Redoc in Docker

The official `redocly/redoc` image is nginx serving one page with the Redoc bundle already in it.
No build step, no npm, no files of your own — you point it at an API description with an
environment variable and it serves the docs.

This example is a README rather than a project: the image *is* the deliverable, so there is
nothing to copy. It is also one of two examples CI does not smoke-test — the image carries its
own bundle and has no hook to swap it, so a test here would exercise the published image instead
of this checkout (see [../README.md](../README.md)).

## Run

Serve a remote API description:

```bash
docker run --rm -p 8080:80 \
  -e SPEC_URL='https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml' \
  redocly/redoc
```

Open http://localhost:8080. That URL is the same Cafe API every other example renders.

Serve a file from your machine — mount it into the web root, then name it relative to that root:

```bash
docker run --rm -p 8080:80 \
  -v "$(pwd)/openapi.yaml:/usr/share/nginx/html/openapi.yaml" \
  -e SPEC_URL=openapi.yaml \
  redocly/redoc
```

Mount a whole directory when your description is split across `$ref`ed files. Edits show up on
reload, so this doubles as a preview loop:

```bash
docker run --rm -p 8080:80 \
  -v "$(pwd)/specs:/usr/share/nginx/html/specs" \
  -e SPEC_URL=specs/openapi.yaml \
  redocly/redoc
```

AsyncAPI and GraphQL work the same way — Redoc detects the type from the document:

```bash
docker run --rm -p 8080:80 \
  -e SPEC_URL='https://example.com/asyncapi.yaml' \
  redocly/redoc
```

A remote `SPEC_URL` must be served with CORS, since the browser fetches it, not nginx. For a
local file the mount above avoids the problem entirely; to serve one from your host instead:

```bash
npx http-server . --cors -p 8000
```

Pin a version with a tag (`redocly/redoc:<version>`) for anything you deploy — `latest` moves.

## Configuration

Every option is an environment variable. `config/docker/README.md` in this repository is the
canonical reference; these are the ones you need to run it:

| Variable        | Default                                          | What it does                                                              |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `SPEC_URL`      | `https://cdn.redocly.com/redoc/museum-api.yaml`  | the API description to render — absolute URL, or a path inside the web root |
| `PAGE_TITLE`    | `ReDoc`                                          | browser tab title                                                          |
| `PAGE_FAVICON`  | `favicon.png`                                    | favicon URL                                                               |
| `BASE_PATH`     | —                                                | path prefix, e.g. `docs` serves the page at `/docs`                        |
| `PORT`          | `80`                                             | nginx port                                                                 |
| `HOST`          | `localhost`                                      | nginx `server_name`                                                        |
| `REDOC_OPTIONS` | —                                                | extra `<redoc>` tag attributes, e.g. `router="history"`                    |

`REDOC_OPTIONS` is where anything Redoc-specific goes, verbatim as tag attributes:

```bash
docker run --rm -p 8080:80 \
  -e SPEC_URL=openapi.yaml \
  -e REDOC_OPTIONS='router="history"' \
  redocly/redoc
```

Two notes on the ones that trip people up:

- **`BASE_PATH`** — routing is hash-based by default, so deep links need nothing special. They
  also survive `router="history"`: the image's nginx serves `index.html` for any path that is not
  a file, and under a prefix it passes `base-path` to Redoc for you. When the description is mounted as a file *and* `BASE_PATH`
  is set, `SPEC_URL` must carry the prefix too, e.g. `/v1/openapi.yaml`.
- **`PORT`** — port `80` is restricted on OpenShift, so set `PORT=8080` there and match it in
  the container spec. The image already runs as an arbitrary UID; `config/docker/README.md`
  explains which directories are group-writable and why.

## Build the image yourself

From the repository root, to get an image from this checkout rather than Docker Hub:

```bash
docker build -t redocly/redoc -f config/docker/Dockerfile .
```

The build compiles `bundles/redoc.standalone.js` from source and copies it into the nginx image,
so what you get matches the code you have, not the last release.
