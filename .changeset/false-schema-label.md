---
"redoc": patch
---

Fixed an issue where API docs displayed a `false` schema as `any`.
A property, tuple item, or `oneOf`/`anyOf` option with a `false` schema displays as **no value allowed**, and the parent type label leaves it out.
