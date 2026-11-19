---
"redoc": patch
---

Fixed an issue where links in the list of operations on a tag page led to a page that doesn't exist when the tag had the same name as `basePath`, for example a `Payments` tag with `basePath` set to `/payments`.
