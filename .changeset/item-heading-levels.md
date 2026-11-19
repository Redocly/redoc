---
"redoc": patch
---

Fixed skipped heading levels on API item pages. Operation, schema, channel, and GraphQL type titles use `h3` headings beneath the `h2` page or group heading, so custom CSS that targeted these titles as `h2` must target `h3` instead.
