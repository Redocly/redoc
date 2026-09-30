import type { Node } from '@markdoc/markdoc';
import type { ExtractContext } from './context.js';

import { extractFullText } from '../../../../adapters/utils/markdoc.js';
import { safeSlugify } from '../../../../utils/string.js';
import { makeParam } from '../param.js';
import { DESCRIPTION_PLACE, scopedPlace } from '../places.js';
import { addRow } from './context.js';

export function extractHeadingSections(
  content: string | Node | Node[] | undefined,
  ctx: ExtractContext,
): void {
  if (!content || typeof content === 'string' || !ctx.slug) return;
  const topLevel = Array.isArray(content) ? content : (content.children ?? []);

  let heading: { id: string; name: string } | undefined;
  let textParts: string[] = [];

  const flush = (): void => {
    if (!heading) return;
    addRow(
      ctx,
      makeParam({
        name: heading.name,
        description: textParts.join(' ').trim(),
        place: scopedPlace(DESCRIPTION_PLACE, ctx.scope.callbackId),
        deepLink: `/${ctx.slug}#${heading.id}`.toLowerCase(),
      }),
    );
    heading = undefined;
    textParts = [];
  };

  for (const node of topLevel) {
    if (node.type === 'heading') {
      flush();
      const name = extractFullText(node);
      const id =
        typeof node.attributes?.id === 'string' && node.attributes.id
          ? node.attributes.id
          : name
            ? `section/${safeSlugify(name)}`
            : '';
      if (name && id) heading = { id, name };
      continue;
    }
    if (heading) {
      const text = extractFullText(node);
      if (text) textParts.push(text);
    }
  }
  flush();
}
