import type { ApiItemContent, ContentNode } from '../../../../types/content.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { contentType, itemVariant, nodeTypes } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildSchemaDefinitionContent(
  schemaName: string,
  title: string | undefined,
  options: ApiDocsOptions,
): ApiItemContent {
  const label = title ?? schemaName;
  // Synthesized markdoc tag — parsed with the host parser threaded onto `options` by buildItems.
  const schemaDefAst = parseMarkdown(
    `{% schemaDefinition showWriteOnly=true schemaRef="#/components/schemas/${schemaName}" /%}`,
    options,
  );

  const children: ContentNode[] = [
    {
      nodeType: nodeTypes.CONTAINER,
      children: [
        {
          nodeType: nodeTypes.HEADER,
          level: 2,
          label,
          showPageActions: true,
        },
      ],
      panels: [],
    },
  ];

  if (schemaDefAst) {
    children.push({ nodeType: nodeTypes.MARKDOC, content: schemaDefAst });
  }

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.SCHEMA,
    meta: { name: schemaName },
    seo: { title: label },
    children,
  };
}
