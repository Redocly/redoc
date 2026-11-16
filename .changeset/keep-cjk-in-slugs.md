---
"redoc": patch
---

Fix tags and headings that differ only in CJK characters, such as `demo数据` and `demo数据备份`, getting the same anchor id. The slug now keeps the characters that `slugify` cannot transliterate.
