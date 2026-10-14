import { hasRbacScope } from '../../../../adapters/rbac.js';

import type { MediaTypeContent } from '../../../../types/content.js';
import type { ExtractContext, Extractor } from './context.js';

import {
  buildAsyncApiSuffix,
  buildOpenApiSectionSuffix,
  CALLBACKS_SECTION,
  makeDeepLink,
} from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import {
  MESSAGE_EXAMPLES_PLACE,
  REQUEST_EXAMPLES_PLACE,
  responseExamplesPlace,
  scopedPlace,
} from '../places.js';
import { addRow, describe } from './context.js';

type ExampleSource = { exampleIds?: string[]; mediaTypeContent?: Record<string, MediaTypeContent> };

/** Rows for the example selector labels of a request body, each response, and each message. */
export const examplesExtractor: Extractor = {
  matches: (node) =>
    (node.variant === 'body' &&
      hasExamples({ exampleIds: node.exampleIds, mediaTypeContent: node.mediaTypeSchemas })) ||
    !!node.responses?.some((response) => hasExamples(response)) ||
    !!node.messages?.some((message) => message.exampleIds?.length),
  extract(node, ctx) {
    if (!ctx.exampleStore) return;
    if (node.variant === 'body') {
      addSourceExampleRows(
        ctx,
        { exampleIds: node.exampleIds, mediaTypeContent: node.mediaTypeSchemas },
        { place: REQUEST_EXAMPLES_PLACE, suffix: buildOpenApiSectionSuffix('request', 'body') },
      );
    }
    for (const response of node.responses ?? []) {
      if (hasRbacScope(response)) continue;
      addSourceExampleRows(ctx, response, {
        place: responseExamplesPlace(response.code),
        suffix: buildOpenApiSectionSuffix('response', undefined, response.code),
      });
    }
    for (const message of node.messages ?? []) {
      if (hasRbacScope(message)) continue;
      addExampleRows(ctx, message.exampleIds ?? [], {
        place: MESSAGE_EXAMPLES_PLACE,
        suffix: buildAsyncApiSuffix({ section: 'messages', messageKey: message.name }),
        callbackScoped: false,
        // Message panels keep a local selection, so a landing cannot select the example.
        selectable: false,
      });
    }
  },
};

function hasExamples(source: ExampleSource): boolean {
  return exampleIdsOf(source).length > 0;
}

/**
 * Rows for one request or response: node-level ids first, then each media type's ids. An
 * example present under several media types is one row without `ct=` (landing keeps the
 * reader's media type and selects it by key); one unique to a media type links with `ct=`
 * so landing switches there first.
 */
function addSourceExampleRows(
  ctx: ExtractContext,
  source: ExampleSource,
  target: { place: string; suffix: string },
): void {
  addExampleRows(ctx, source.exampleIds ?? [], target);
  const mediaTypes = Object.entries(source.mediaTypeContent ?? {}).filter(
    ([, content]) => !hasRbacScope(content),
  );
  const labelOf = (id: string): string | undefined => {
    const example = ctx.exampleStore?.[id];
    return example?.summary ?? example?.key;
  };
  // Restricted copies play no part in sharing: a public copy under another media type must still get its row.
  const visibleIds = (content: MediaTypeContent): string[] =>
    (content.exampleIds ?? []).filter((id) => {
      const example = ctx.exampleStore?.[id];
      return !!example && !hasRbacScope(example);
    });
  const mediaTypesPerLabel = new Map<string, number>();
  for (const [, content] of mediaTypes) {
    for (const label of new Set(visibleIds(content).map(labelOf))) {
      if (label) mediaTypesPerLabel.set(label, (mediaTypesPerLabel.get(label) ?? 0) + 1);
    }
  }
  const emitted = new Set<string>();
  for (const [mediaType, content] of mediaTypes) {
    for (const id of visibleIds(content)) {
      const label = labelOf(id);
      if (!label || emitted.has(label)) continue;
      const shared = (mediaTypesPerLabel.get(label) ?? 0) > 1;
      if (shared) emitted.add(label);
      const suffix =
        mediaTypes.length > 1 && !shared ? `${target.suffix}&ct=${mediaType}` : target.suffix;
      addExampleRows(ctx, [id], { ...target, suffix });
    }
  }
}

function exampleIdsOf(source: ExampleSource): string[] {
  const ids = new Set<string>(source.exampleIds ?? []);
  for (const mediaType of Object.values(source.mediaTypeContent ?? {})) {
    for (const id of mediaType.exampleIds ?? []) ids.add(id);
  }
  return [...ids];
}

function addExampleRows(
  ctx: ExtractContext,
  ids: string[],
  target: { place: string; suffix: string; callbackScoped?: boolean; selectable?: boolean },
): void {
  const { callbackId } = ctx.scope;
  const suffix =
    target.callbackScoped === false || !callbackId
      ? target.suffix
      : `${buildOpenApiSectionSuffix(CALLBACKS_SECTION, callbackId)}/${target.suffix}`;
  for (const id of ids) {
    const example = ctx.exampleStore?.[id];
    if (!example || hasRbacScope(example)) continue;
    const name = example.summary ?? example.key;
    if (!name) continue;
    // `ex=<key>` makes the page select the example on landing; keys with `/` or `&` cannot travel in the hash.
    const marker =
      target.selectable !== false && example.key && !/[/&]/.test(example.key)
        ? `&ex=${example.key}`
        : '';
    addRow(
      ctx,
      makeParam({
        name,
        description: describe(ctx, example.description),
        place: scopedPlace(target.place, callbackId),
        type: 'unknown',
        deepLink: ctx.slug ? makeDeepLink(ctx.slug, `${suffix}${marker}`) : undefined,
      }),
    );
  }
}
