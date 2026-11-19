---
"redoc": patch
---

Fixed anonymous telemetry for API descriptions that fail to load: a YAML syntax error is reported as a parse failure whatever the description URL, and the event includes the first line of the error message with quoted text, URLs and file paths removed.
