---
"redoc": patch
---

Fixed an issue where each `init()` call or remount of Redoc on the same page created a new telemetry client that stayed in memory with its page event listeners.
