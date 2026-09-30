import type { ApiItemContent } from '../../../../types/content.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { contentType, nodeTypes } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import { escapeHTMLAttrChars } from '../../utils/helpers.js';

type McpItemType = 'tool' | 'rsrc' | 'prompt';

const MARKDOC_TAG_BY_TYPE: Record<McpItemType, string> = {
  tool: 'mcpTool',
  rsrc: 'mcpResource',
  prompt: 'mcpPrompt',
};

export function buildMcpItemContent(
  mcpType: McpItemType,
  name: string,
  id: string,
  title: string,
  options: ApiDocsOptions,
): ApiItemContent {
  const markdocTag = MARKDOC_TAG_BY_TYPE[mcpType];
  const safeName = escapeHTMLAttrChars(name);
  const safeId = escapeHTMLAttrChars(id);
  // A synthesized, always-Markdoc tag — fall back to the bundled parser so it works even when the
  // host supplies none (the tag is api-docs-internal, never embedder-specific).
  // Synthesized markdoc tag — parsed with the host parser threaded onto `options` by buildItems.
  const markdocSource = `{% ${markdocTag} name="${safeName}" id="${safeId}" /%}`;

  return {
    contentType: contentType.ITEM,
    seo: { title },
    meta: { name },
    children: [
      {
        nodeType: nodeTypes.CONTAINER,
        children: [
          {
            nodeType: nodeTypes.HEADER,
            level: 2,
            label: title,
            showPageActions: true,
          },
        ],
        panels: [],
      },
      {
        nodeType: nodeTypes.MARKDOC,
        content: parseMarkdown(markdocSource, options) ?? [],
      },
    ],
  };
}
