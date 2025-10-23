import type { FieldModel } from '../../models/index.js';

import { encodeBackSlashes, queryString } from '../../utils/index.js';
import { getActiveMediaType } from '../../models/mediaContent.js';

export function isSameHash(a: string, b: string): boolean {
  return a === b || '#' + a === b || a === '#' + b;
}

// TODO: Add tests
function getContentTypeName(field: FieldModel, activeMimeName?: string) {
  // param in "query" | "header" | "path" | "cookie" - no need for content type in link
  if (field.in) {
    return;
  }

  // Use content type from requestBody
  if (field.deps.type === 'request') {
    if (field.deps.operation?.requestBody?.content?.mediaTypes) {
      return field.deps.operation?.requestBody?.content?.mediaTypes.length > 1
        ? field.deps.operation?.requestBody?.content &&
            getActiveMediaType(field.deps.operation.requestBody.content, activeMimeName).name
        : undefined; // if only one content type present - also no need for content type in link
    }
  }

  // Use content type from response
  if (field.deps.type === 'response') {
    if (field.deps.response?.content?.mediaTypes) {
      return field.deps.response?.content?.mediaTypes.length > 1
        ? field.deps.response?.content &&
            getActiveMediaType(field.deps.response.content, activeMimeName).name
        : undefined; // if only one content type present - also no need for content type in link
    }
  }

  return;
}

// TODO: Add tests
export function constructFieldDeepFragment(field: FieldModel, activeMimeName?: string): string {
  if (!field) {
    return '';
  }

  const linkParams = {
    t: field.deps.type, // "request" | "response"
    in: field.in || field.deps.in, // "query" | "header" | "path" | "cookie" // TODO: remove 'in' from deps
    c: field.deps.type === 'response' ? field.deps.response?.code : undefined, // response code: 200 | 201 | 400 | etc
    cb: field.deps.operation?.isCallback ? field.deps.operation.callbackId : undefined, // Callback
    ct: getContentTypeName(field, activeMimeName),
    path: field.fieldFullPath, // Field deep path
  };

  return queryString.stringify(linkParams, { encode: false, sort: false });
}

export function joinWithSeparator(base = '', path = '', sep = '/'): string {
  if (base.endsWith(sep) && base !== sep) {
    base = base.slice(0, -sep.length);
  }

  if (path.startsWith(sep)) {
    path = path.slice(sep.length);
  }

  if (!base || !path || base === sep) {
    return base + path;
  }

  return base + sep + path;
}

export function makeDeepLink(operationId: string, suffix: string) {
  operationId = encodeBackSlashes(operationId);
  return (`/${operationId}#` + joinWithSeparator(operationId, suffix)).toLowerCase();
}
