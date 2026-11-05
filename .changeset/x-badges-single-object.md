---
"redoc": patch
---

Fixed an issue where OpenAPI and AsyncAPI pages crashed when an API description set `x-badges` to a single object instead of a list.
The invalid value is ignored and reported in the console.
