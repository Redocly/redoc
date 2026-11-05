---
"redoc": patch
---

Fixed an issue where an `allOf` that also contained a `false` schema, inline or through a `$ref`, showed its other parts instead of `no value allowed`.
