---
"redoc": patch
---

Fixed an issue where the page crashed when an OpenAPI or AsyncAPI description used a boolean schema (`true` or `false`) inside an `allOf` or as a top-level schema, such as `payload: true` in an AsyncAPI message.
