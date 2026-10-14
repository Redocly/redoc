# Redoc in ASP.NET Core

A .NET 10 minimal API that serves its API reference at `/`. One endpoint returns the page; the
Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

Needs the .NET 10 SDK:

```bash
dotnet run
```

Then open http://localhost:8080.

## Use it in your app

- `Program.cs` — `MapGet("/")` returns a `<redoc spec-url>` tag plus one script tag. That is all
  Redoc needs; map it wherever you like.
- `REDOC_URL` (environment variable) overrides where the bundle is loaded from, for self-hosting or
  pinning another version.
- `cafe` is where your API description lives — any URL the browser can fetch, for example the
  OpenAPI document your API already serves at `/openapi/v1.json`.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-aspnet .
docker run --rm -p 8080:8080 redoc-aspnet
```
