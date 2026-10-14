# Redoc in Java

One file, no framework, no build tool: the JDK's built-in `HttpServer` serves the docs page at
`/`. The Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

Needs JDK 21+:

```bash
java Main.java
```

Then open http://localhost:8080.

## Use it in your app

- `Main.java` — the handler returns a `<redoc spec-url>` tag plus one script tag. That is all Redoc
  needs; in a real app the same HTML goes into whatever framework you use.
- `DEFAULT_REDOC_URL` is where the bundle is loaded from; the `REDOC_URL` environment variable
  overrides it, for self-hosting or pinning another version.
- `CAFE` is where your API description lives — any URL the browser can fetch.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-java .
docker run --rm -p 8080:8080 redoc-java
```
