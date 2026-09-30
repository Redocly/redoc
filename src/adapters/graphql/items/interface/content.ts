import type { GraphQLInterfaceType } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import { graphqlContext } from '../../buildContext.js';

export function buildInterfaceContent(
  interfaceType: GraphQLInterfaceType,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const schemaId = `types/${interfaceType.name}`;
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: interfaceType.name, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(interfaceType.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  containerChildren.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: interfaceType.name,
  });

  const fields = interfaceType.getFields();
  const fieldNames = Object.keys(fields);
  if (fieldNames.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'graphql-fields',
      label: 'Fields',
      labelTranslationKey: 'fields',
      schemaId,
      graphqlTypeName: interfaceType.name,
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

  const implementedInterfaces = interfaceType.getInterfaces();
  if (implementedInterfaces.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'implements',
      label: 'Implements interfaces',
      labelTranslationKey: 'implementedInterfaces',
      graphqlInterfaceNames: implementedInterfaces.map((i) => i.name),
    });
  }

  const { schema } = graphqlContext.get();

  const { objects, interfaces } = schema.getImplementations(interfaceType);

  const implementingTypeNames = [...objects, ...interfaces].map((t) => t.name);

  if (implementingTypeNames.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'implemented-by',
      label: 'Implemented by',
      labelTranslationKey: 'implementedBy',
      graphqlTypeNames: implementingTypeNames,
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
            operationName: interfaceType.name,
            typeName: interfaceType.name,
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
          graphqlTypeName: interfaceType.name,
          references: [],
        },
      ],
    },
  ];

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.INTERFACE,
    meta: { name: interfaceType.name },
    seo: {
      title: interfaceType.name,
      description: interfaceType.description || undefined,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children: containerChildren, panels }],
  };
}
