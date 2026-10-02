import type { GraphQLUnionType } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildUnionContent(
  union: GraphQLUnionType,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const possibleTypes = union.getTypes();
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: union.name, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(union.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  containerChildren.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: union.name,
  });

  if (possibleTypes.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'possible-types',
      label: 'Possible types',
      labelTranslationKey: 'possibleTypes',
      graphqlTypeNames: possibleTypes.map((t) => t.name),
    });
  }

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.UNION,
    meta: { name: union.name },
    seo: {
      title: union.name,
      description: union.description || undefined,
    },
    children: [
      {
        nodeType: nodeTypes.CONTAINER,
        children: containerChildren,
        panels: [
          {
            title: 'Referenced in',
            titleTranslationKey: 'referenced',
            children: [
              {
                kind: panelKind.REFERENCES,
                graphqlTypeName: union.name,
                references: [],
              },
            ],
          },
        ] as PanelNode[],
      },
    ],
  };
}
