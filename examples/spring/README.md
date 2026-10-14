# Redoc in Spring Boot

A Spring Boot 4 (Java 21) app that serves its API reference at `/`. One controller returns the
page; the Redoc bundle comes from the jsDelivr CDN and the API description from a URL.

## Run

```bash
mvn spring-boot:run
```

Then open http://localhost:8080.

## Use it in your app

- `RedocController.java` — returns the page: a `<redoc spec-url>` tag plus one script tag.
- `application.properties` — `redoc.url` is where the bundle is loaded from. Override it with the
  `REDOC_URL` environment variable to self-host the bundle or pin another version.
- The `<redoc spec-url>` in that page is where your API description lives — any URL the browser
  can fetch, for example the OpenAPI document springdoc already serves at `/v3/api-docs`.

## Docker

```bash
docker build -f docker/Dockerfile -t redoc-spring .
docker run --rm -p 8080:8080 redoc-spring
```
