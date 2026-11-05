---
"redoc": patch
---

Improved error messages for an incomplete `markdownAdapter` passed to the low-level `Redoc` component.
Errors name the missing `parse` or `render` function, or explain that `render` returned a Markdoc tree instead of React elements.
