import type { AsyncMessageSubsection, WalkScope } from './context.js';

import {
  buildOpenApiFieldSuffix,
  makeDeepLink,
  serializeFieldParams,
} from '../../../utils/deep-link.js';

export type FieldDeepLink = {
  slug: string;
  type: string;
  in?: string;
  contentType?: string;
  responseCode?: string;
  fieldPath: string[];
  scope: WalkScope;
};

export function buildFieldDeepLink({
  slug,
  type,
  in: inValue,
  contentType,
  responseCode,
  fieldPath,
  scope,
}: FieldDeepLink): string {
  if (!slug) return '';
  const path = fieldPath.join('/') || undefined;

  // Schema pages render fields with `pathOnly` section context — anchors are
  // `<itemId>/path=<fieldPath>` with no `t=`.
  if (scope.pathOnly) {
    return path ? makeDeepLink(slug, serializeFieldParams({ path })) : '';
  }

  return makeDeepLink(
    slug,
    buildOpenApiFieldSuffix({
      t: type,
      in: inValue,
      c: responseCode,
      cb: scope.callbackId,
      ct: contentType,
      path,
    }),
  );
}

export function buildAsyncMessageDeepLink(
  slug: string,
  messageKey: string | undefined,
  subsection: AsyncMessageSubsection,
  fieldPath: string[],
): string {
  if (!slug) return '';
  const params = serializeFieldParams({
    m: messageKey,
    t: subsection,
    path: fieldPath.join('/') || undefined,
  });
  return makeDeepLink(slug, params ? `messages&${params}` : 'messages');
}
