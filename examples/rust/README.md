# Redoc in Rust

One file, no crates: a `TcpListener` from the standard library answers every request with the docs
page. The Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
cargo run
```

Then open http://localhost:8080.

## Use it in your app

- `src/main.rs` — the response is a `<redoc spec-url>` tag plus one script tag. That is all Redoc
  needs; in a real app the same HTML goes into whatever web framework you use.
- `DEFAULT_REDOC_URL` is where the bundle is loaded from; the `REDOC_URL` environment variable
  overrides it, for self-hosting or pinning another version.
- `CAFE` is where your API description lives — any URL the browser can fetch.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-rust .
docker run --rm -p 8080:8080 redoc-rust
```
