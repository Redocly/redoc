import type { GraphQLInputObjectType } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildInputContent(
  input: GraphQLInputObjectType,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const schemaId = `types/${input.name}`;
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: input.name, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(input.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  containerChildren.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: input.name,
  });

  const fields = input.getFields();
  const fieldNames = Object.keys(fields);
  if (fieldNames.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'graphql-fields',
      label: 'Input Fields',
      labelTranslationKey: 'inputFields',
      schemaId,
      graphqlTypeName: input.name,
      graphqlSchema: fieldNames.map((fieldName) => {
        const field = fields[fieldName];
        return {
          name: fieldName,
          type: field.type.toString(),
          description: parseMarkdown(field.description, markdownOptions) ?? [],
          defaultValue: field.defaultValue,
        };
      }),
    });
  }

  const panels: PanelNode[] = [
    {
      children: [
        {
          kind: panelKind.GRAPHQL_TYPE_SAMPLE,
          schemaId,
          graphqlOperationData: {
            operationType: 'query',
            operationName: input.name,
            typeName: input.name,
          },
          examples: [],
        },
      ],
    },
    {
      title: 'Referenced in',
      titleTranslationKey: 'referenced',
      children: [
        {
          kind: panelKind.REFERENCES,
          graphqlTypeName: input.name,
          references: [],
        },
      ],
    },
  ];

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.INPUT,
    meta: { name: input.name },
    seo: {
      title: input.name,
      description: input.description || undefined,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children: containerChildren, panels }],
  };
}
