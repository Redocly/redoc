---
"redoc": patch
---

Fixed an issue where a `$ref` to a `false` schema, such as `$ref: '#/components/schemas/NoValue'` with `NoValue: false`, showed `any` instead of `no value allowed`.
