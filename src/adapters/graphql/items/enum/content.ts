import type { GraphQLEnumType } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildEnumContent(
  enumType: GraphQLEnumType,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const values = enumType.getValues();
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: enumType.name, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(enumType.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  containerChildren.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: enumType.name,
  });

  if (values.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'values',
      label: 'Values',
      labelTranslationKey: 'values',
      schemaId: `types/${enumType.name}`,
      values: values.map((value) => ({
        name: value.name,
        description: parseMarkdown(value.description, markdownOptions) ?? [],
        deprecated: !!value.deprecationReason,
      })),
    });
  }

  const panels: PanelNode[] = [
    {
      title: 'Referenced in',
      titleTranslationKey: 'referenced',
      children: [
        {
          kind: panelKind.REFERENCES,
          graphqlTypeName: enumType.name,
          references: [],
        },
      ],
    },
  ];

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.ENUM,
    meta: { name: enumType.name },
    seo: {
      title: enumType.name,
      description: enumType.description || undefined,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children: containerChildren, panels }],
  };
}
