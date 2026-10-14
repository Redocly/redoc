/**
 * Maximum number of characters of a single string value rendered inline in
 * payload/response sample panels. Longer strings (e.g. multi-KB base64 blobs
 * used as schema examples) are truncated at render time with a "Show more"
 * toggle to avoid huge SSR/DOM output and layout of monster text lines.
 * Copy controls always receive the full, untruncated value.
 */
export const MAX_DISPLAYED_STRING_LENGTH = 1000;
