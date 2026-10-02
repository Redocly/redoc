import type { GraphQLObjectType } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildObjectContent(
  object: GraphQLObjectType,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const schemaId = `types/${object.name}`;
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: object.name, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(object.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  containerChildren.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: object.name,
  });

  const fields = object.getFields();
  const fieldNames = Object.keys(fields);
  if (fieldNames.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'graphql-fields',
      label: 'Fields',
      labelTranslationKey: 'fields',
      schemaId,
      graphqlTypeName: object.name,
      graphqlSchema: fieldNames.map((fieldName) => {
        const field = fields[fieldName];
        return {
          name: fieldName,
          type: field.type.toString(),
          description: parseMarkdown(field.description, markdownOptions) ?? [],
          deprecated: !!field.deprecationReason,
          deprecationReason: field.deprecationReason || undefined,
          args: field.args?.map((arg) => ({
            name: arg.name,
            type: arg.type.toString(),
            description: parseMarkdown(arg.description, markdownOptions) ?? [],
            deprecationReason: arg.deprecationReason || undefined,
            defaultValue: arg.defaultValue,
          })),
        };
      }),
    });
  }

  const interfaces = object.getInterfaces();
  if (interfaces.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'implements',
      label: 'Implements interfaces',
      labelTranslationKey: 'implementedInterfaces',
      graphqlInterfaceNames: interfaces.map((i) => i.name),
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
            operationName: object.name,
            typeName: object.name,
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
          graphqlTypeName: object.name,
          references: [],
        },
      ],
    },
  ];

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.OBJECT,
    meta: { name: object.name },
    seo: {
      title: object.name,
      description: object.description || undefined,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children: containerChildren, panels }],
  };
}
