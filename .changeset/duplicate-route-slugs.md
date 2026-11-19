---
"redoc": patch
---

Fixed an issue in API docs where tags, groups, or items whose names differ only in letter case or in characters that URLs leave out, such as `demo数据` and `demo数据备份`, shared one URL and showed the wrong content. Old links to the pages that moved to a new URL still work.
