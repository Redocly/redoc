---
"redoc": patch
---

Fixed an issue where the schema panel did not show the `Recursive` label for a schema that referenced itself through array items, for example `children: Node[]`.
