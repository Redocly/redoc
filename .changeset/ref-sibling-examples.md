---
"redoc": patch
---

Fixed generated samples ignoring an `example` or `examples` value set next to a schema `$ref`: the sample now uses that value, as the schema view already does.
