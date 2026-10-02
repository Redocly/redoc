import type { RouteIndex } from './routing.js';

import { encodeBackSlashes, tryDecodeURIComponent } from './string.js';
import { joinWithSeparator, normalizePath, toElementId } from './url.js';
import { resolveRouteByPathname } from './routing.js';

// ── Low-level primitives ────────────────────────────────────────────────────

/**
 * Serialize key-value params into a query-string fragment.
 * Matches openapi-docs `constructFieldDeepFragment` output:
 * keys in insertion order, no encoding, undefined values omitted.
 */
export function serializeFieldParams(params: Record<string, string | undefined>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      parts.push(`${key}=${value}`);
    }
  }
  return parts.join('&');
}

/**
 * Build a deep-link path+hash string for a given operation slug and suffix.
 * Semantics match openapi-docs `makeDeepLink`:
 *   `/{operationId}#{operationId}/{suffix}`  (all lowercased, backslashes encoded).
 *
 * `operationId` must be a basePath-free slug (e.g. `cafe/placeorder`) — a
 * leading slash is stripped defensively so the output is well-formed even
 * if a caller hands in `/cafe/placeorder`.
 */
export function makeDeepLink(operationId: string, suffix: string): string {
  operationId = encodeBackSlashes(operationId).replace(/^\/+/, '');
  return (`/${operationId}#` + joinWithSeparator(operationId, suffix)).toLowerCase();
}

/**
 * Build a full deep-link URL by combining routing base, operation id, and suffix.
 */
export function buildDeepLinkUrl(
  routingBasePath: string,
  operationId: string,
  suffix: string,
): string {
  const deepLink = makeDeepLink(operationId, suffix);
  return normalizePath(joinWithSeparator(routingBasePath, deepLink));
}

/**
 * Extract element id from a URL hash (strip `#`, decode, lowercase).
 * The returned value can be passed to `document.getElementById`.
 */
export function hashToElementId(hash: string): string {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  return tryDecodeURIComponent(raw).toLowerCase();
}

/**
 * Extract the hash fragment from a deep link URL for use as an element id.
 * Given `/petstore/pet/getpetbyid#pet/getpetbyid/request`, returns `pet/getpetbyid/request`.
 * Returns empty string if no hash is present.
 */
export function deepLinkToId(deepLink: string): string {
  const raw = tryDecodeURIComponent(deepLink);
  const hashIndex = raw.indexOf('#');
  return hashIndex >= 0 ? raw.slice(hashIndex + 1) : '';
}

// ── OpenAPI suffix builders ─────────────────────────────────────────────────

interface OpenApiFieldParams {
  /** "request" | "response" */
  t?: string;
  /** "query" | "header" | "path" | "cookie" */
  in?: string;
  /** Response status code (responses only) */
  c?: string;
  /** Callback id (callbacks only) */
  cb?: string;
  /** Content-type name (when multiple media types) */
  ct?: string;
  /** Field deep path */
  path?: string;
}

/**
 * Build a suffix for an OpenAPI request/response/callback field.
 * Same shape as openapi-docs `constructFieldDeepFragment`.
 */
export function buildOpenApiFieldSuffix(params: OpenApiFieldParams): string {
  return serializeFieldParams({
    t: params.t,
    in: params.in,
    c: params.c,
    cb: params.cb,
    ct: params.ct,
    path: params.path,
  });
}

/**
 * Build section-level suffix for OpenAPI requests/responses.
 *
 * Examples:
 *   buildOpenApiSectionSuffix('request')                        -> "request"
 *   buildOpenApiSectionSuffix('request', 'query')                -> "request/query"
 *   buildOpenApiSectionSuffix('response', undefined, '200')      -> "response&c=200"
 *   buildOpenApiSectionSuffix('response', 'body', '200')         -> "response&c=200/body"
 *   buildOpenApiSectionSuffix('response', 'headers', '200')      -> "response&c=200/headers"
 *   buildOpenApiSectionSuffix('callbacks')                       -> "callbacks"
 *   buildOpenApiSectionSuffix('callbacks', 'myCallback')          -> "callbacks/myCallback"
 */
export function buildOpenApiSectionSuffix(
  section: string,
  subSection?: string,
  responseCode?: string,
): string {
  let result = section;
  if (responseCode) {
    result = `${result}&c=${responseCode}`;
  }
  if (subSection) {
    result = joinWithSeparator(result, subSection);
  }
  return result;
}

// ── AsyncAPI suffix builders ────────────────────────────────────────────────

export interface AsyncApiSuffixParams {
  /** "send" | "receive" | "parameters" | "messages" */
  section: string;
  /** Message key/name (when linking to a specific message) */
  messageKey?: string;
  /** Sub-section: "headers" | "payload" */
  subsection?: string;
}

/**
 * Build a suffix for AsyncAPI sections.
 *
 * Examples:
 *   { section: 'send' }                                    -> "send"
 *   { section: 'parameters' }                              -> "parameters"
 *   { section: 'messages', messageKey: 'userSignedUp' }    -> "messages&m=userSignedUp"
 *   { section: 'messages', messageKey: 'msg1', subsection: 'headers' }
 *       -> "messages&m=msg1&t=headers"
 *   { section: 'messages', messageKey: 'msg1', subsection: 'payload' }
 *       -> "messages&m=msg1&t=payload"
 */
export function buildAsyncApiSuffix(params: AsyncApiSuffixParams): string {
  const { section, messageKey, subsection } = params;
  if (!messageKey) {
    return section;
  }
  let result = `${section}&m=${messageKey}`;
  if (subsection) {
    result += `&t=${subsection}`;
  }
  return result;
}

// ── GraphQL suffix builders ─────────────────────────────────────────────────

export interface GraphqlSuffixParams {
  /** Section type: "field" | "argument" | "return-type" | "possible-types" |
   *  "implements" | "directive" | "enum-value" | "scalar" */
  t: string;
  /** Stable path: e.g. "Query.hero", "User.friends" */
  path?: string;
  /** Argument name (when t=argument or nested under a field) */
  arg?: string;
  /** Return-type anchor ("1" or nested path when expanded) */
  rt?: string;
}

/**
 * Build a suffix for GraphQL deep links.
 *
 * Examples:
 *   { t: 'field', path: 'Query.hero' }           -> "t=field&path=Query.hero"
 *   { t: 'argument', path: 'Query.hero', arg: 'id' }
 *       -> "t=argument&path=Query.hero&arg=id"
 *   { t: 'return-type', path: 'Query.hero', rt: '1' }
 *       -> "t=return-type&path=Query.hero&rt=1"
 */
export function buildGraphqlSuffix(params: GraphqlSuffixParams): string {
  return serializeFieldParams({
    t: params.t,
    path: params.path,
    arg: params.arg,
    rt: params.rt,
  });
}

export function isGraphqlDeepLinkAncestor(hash: string, path: string): boolean {
  if (!hash || !path) return false;
  const normalized = tryDecodeURIComponent(
    hash.startsWith('#') ? hash.slice(1) : hash,
  ).toLowerCase();
  return normalized.includes(`path=${path.toLowerCase()}.`);
}

/**
 * Convert a deep-link URL to an element id, returning `undefined` for empty/missing links.
 * Shorthand for the common pattern `id={url ? deepLinkToId(url) : undefined}`.
 */
export function getDeepLinkId(deepLink: string | undefined): string | undefined {
  if (!deepLink) return undefined;
  const id = deepLinkToId(deepLink);
  return id || undefined;
}

export function appendVariantSuffix(
  fieldParentsName: string[] | undefined,
  suffix: string,
): string[] {
  const parents = [...(fieldParentsName ?? [])];

  if (parents.length > 0) {
    parents[parents.length - 1] += suffix;
  } else {
    parents.push(suffix);
  }

  return parents;
}

export function appendArraySuffix(fieldParentsName: string[]): string[] {
  if (fieldParentsName.length === 0) return fieldParentsName;
  return [...fieldParentsName.slice(0, -1), fieldParentsName[fieldParentsName.length - 1] + '[]'];
}

const VARIANT_MARKER_RE = /&(?:oneof|d)=\d+/g;

/**
 * Remove variant deep-link markers (`&oneof=N`, `&d=N`) from a field-parent path
 * piece, leaving the human-readable name(s). The markers can sit mid-path
 * (e.g. `_embedded.quote&d=0.order` -> `_embedded.quote.order`), so they must be
 * stripped in place rather than split off. Returns `''` when the piece was only a
 * marker (e.g. `&d=0`), so callers can skip it in the breadcrumb.
 */
export function stripVariantMarkers(name: string): string {
  return name.replace(VARIANT_MARKER_RE, '');
}

/**
 * Remove `[]` array-item markers from a deep-link path piece.
 * Legacy (openapi-docs) support.
 */
export function stripArrayMarkers(value: string): string {
  return value.replace(/\[\]/g, '');
}

/**
 * Keep only the variant markers (`&oneof=N` / `&d=N`) from each parent path piece,
 * dropping plain field-name bases. Used at shallow render levels where breadcrumbs are
 * suppressed, so a switched tab stays reload-reachable without showing a field prefix.
 */
export function variantMarkersOnly(fieldParentsName: string[] | undefined): string[] {
  return (fieldParentsName ?? [])
    .filter((part) => part.includes('&'))
    .map((part) => part.slice(part.indexOf('&')));
}

/**
 * Extract a deep-link parameter value from a URL hash.
 * The search is case-insensitive and values are returned lowercased.
 */
export function extractDeepLinkParamFromHash(
  hash: string,
  key: 'c' | 'm' | 'ct' | 'ex',
): string | undefined {
  if (!hash) return undefined;
  const raw = tryDecodeURIComponent(hash.startsWith('#') ? hash.slice(1) : hash).toLowerCase();
  // Media types contain `/` (`ct=application/json`), so `ct` values stop only at `&`.
  const match = raw.match(new RegExp(`(?:^|[&/])${key}=(${key === 'ct' ? '[^&]+' : '[^/&]+'})`));
  return match?.[1];
}

// Callback deep-link scoping and legacy back-compat: see
// `brain/legacy-deep-link-back-compat.md` § Callbacks.

/** Section name owning a callback's suffixes: `callbacks/<callbackId>[/…]`. */
export const CALLBACKS_SECTION = 'callbacks';
const CALLBACKS_SEGMENT = `${CALLBACKS_SECTION}/`;

/** Sub-section anchors a callback owns. Emitted by `CallbacksSection` and matched here, so
 *  the spelling is a contract — legacy openapi-docs links use these exact names. */
export const CALLBACK_REQUEST_SECTION = 'callback-request';
export const CALLBACK_RESPONSE_SECTION = 'callback-response';

/** Each proves a hash points inside some callback. */
const CALLBACK_SECTION_TOKENS = [`/${CALLBACK_REQUEST_SECTION}`, `/${CALLBACK_RESPONSE_SECTION}`];

function hashStructure(hashId: string): string {
  const pathIndex = hashId.indexOf('path=');
  return pathIndex === -1 ? hashId : hashId.slice(0, pathIndex);
}

export function stripCallbacksSegment(id: string): string {
  return id.replace(`/${CALLBACKS_SEGMENT}`, '/');
}

/** `cb=<id>` — how field suffixes name their callback, canonically and in legacy links. */
function hashNamesCallbackAsField(hashId: string, id: string): boolean {
  const param = `cb=${id}`;
  return hashId.endsWith(param) || hashId.includes(`${param}&`);
}

/** `<id>` as a whole path segment. Covers the canonical `callbacks/<id>[/…]` shapes and the
 *  legacy bare `<id>/…` section prefix in one check, since both contain `/<id>`. */
function hashNamesCallbackAsPath(hashId: string, id: string): boolean {
  const segment = `/${id}`;
  return hashId.endsWith(segment) || hashId.includes(`${segment}/`);
}

/** Whether a hash id addresses the given item at all — it, or anything beneath it. */
export function hashIsForItem(hashId: string, itemId: string): boolean {
  return hashId === itemId || hashId.startsWith(`${itemId}/`);
}

/** `itemId` must be in hash shape (basePath-free, lowercased); two operations can hold a
 *  callback with the same id, so the item has to match before the callback does. Any missing
 *  argument answers `false`, so callers needn't pre-check. */
export function hashTargetsCallback(
  hash: string,
  itemId: string,
  callbackId: string | undefined,
): boolean {
  if (!hash || !itemId || !callbackId) return false;
  const hashId = hashToElementId(hash);
  if (!hashIsForItem(hashId, itemId)) return false;
  const structure = hashStructure(hashId);
  const id = callbackId.toLowerCase();
  return hashNamesCallbackAsField(structure, id) || hashNamesCallbackAsPath(structure, id);
}

/** Whether a hash id addresses something inside the given callback.
 *  `hashId` and `itemId` are expected lowercased, as `hashToElementId` returns them. */
export function hashIsInsideCallback(hashId: string, itemId: string, callbackId: string): boolean {
  const structure = hashStructure(hashId);
  const id = callbackId.toLowerCase();
  return (
    structure.startsWith(joinWithSeparator(itemId, `${CALLBACKS_SEGMENT}${id}/`)) ||
    structure.startsWith(joinWithSeparator(itemId, `${id}/`)) ||
    hashNamesCallbackAsField(structure, id)
  );
}

/**
 * Whether a hash id addresses the operation level, outside every callback. Only the part of
 * the hash *after* the item id is examined, so an operation or tag whose own slug contains a
 * marker (`/callback-response`) can't be mistaken for one either.
 */
export function hashIsOutsideCallbacks(hashId: string, itemId: string): boolean {
  const suffix = hashStructure(hashId).slice(itemId.length);
  const insideSomeCallback =
    suffix.startsWith(`/${CALLBACKS_SEGMENT}`) ||
    suffix.includes('cb=') ||
    CALLBACK_SECTION_TOKENS.some((token) => suffix.includes(token));
  return !insideSomeCallback;
}

// ── Legacy hash helpers (for scroll) ────────────────────────────────────────

/**
 * Detect legacy openapi hash patterns and return normalized suffix.
 * Matches: #tag/..., #operation/..., #paths/...
 */
export function getLegacyHash(hash: string): string {
  const patterns = ['#tag', '#operation', '#paths'];
  for (const pattern of patterns) {
    if (hash.includes(pattern)) {
      return hash.replace(pattern, '').toLowerCase();
    }
  }
  return '';
}

/** Map a legacy single-page hash (`#section/…`, `#tag/…`, `#operation/…`) to its route URL in
 *  the multi-page engine; `undefined` for a genuine in-page anchor (e.g. a field deep link).
 *  A sub-section tail past the route (`#operation/<id>/callbacks`) becomes the element-id hash. */
export function resolveLegacyHashToRoute(
  hash: string,
  basePath: string,
  routeIndex: RouteIndex,
): string | undefined {
  const id = hashToElementId(hash);
  if (!id) return undefined;

  const direct = normalizePath(joinWithSeparator(basePath, id));
  if (resolveRouteByPathname(routeIndex, direct)) return direct;

  if (routeIndex.overviewPartialSectionIds?.has(id)) return `${normalizePath(basePath)}#${id}`;

  const legacyHash = getLegacyHash(hash);
  if (!legacyHash) return undefined;

  const segments = legacyHash.split('/').filter(Boolean);
  for (let end = segments.length; end > 0; end--) {
    const candidate = '/' + segments.slice(0, end).join('/');
    const match = routeIndex.allRoutes.find((route) => route.path.endsWith(candidate));
    if (!match) continue;

    const suffix = segments.slice(end).join('/');
    if (!suffix) return match.path;
    return `${match.path}#${joinWithSeparator(toElementId(match.path, basePath), suffix)}`;
  }

  return undefined;
}
