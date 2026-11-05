---
"redoc": patch
---

Fixed an issue where an invalid value in an OpenAPI or AsyncAPI description, such as a server without `url` or an empty `required:` in an `allOf` part, crashed the page, including pages built with `redocly build-docs`. The invalid part is skipped, the rest of the page renders, and the error is reported to telemetry.
