import { getNamedType, isInterfaceType, isObjectType } from 'graphql';

import type { GraphQLField } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ItemVariant } from '../../../../types/common.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

type OperationType = 'query' | 'mutation' | 'subscription';

export function buildOperationContent(
  operation: GraphQLField<unknown, unknown>,
  rootTypeName: string,
  operationType: OperationType,
  variant: ItemVariant,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const returnType = getNamedType(operation.type);
  const returnSchemaId = `types/${returnType.name}`;

  const children: ContentNode[] = [
    {
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: operation.name,
      showPageActions: true,
      graphqlReturnType: operation.type.toString(),
      graphqlArgs: operation.args?.map((a) => ({ name: a.name })),
      graphqlDeprecated: !!operation.deprecationReason,
      graphqlOperationType: operationType,
    },
  ];

  if (operation.deprecationReason) {
    children.push({
      nodeType: nodeTypes.ADMONITION,
      admonitionType: 'warning',
      name: 'Deprecation reason',
      nameTranslationKey: 'deprecationReason',
      content: parseMarkdown(operation.deprecationReason, markdownOptions),
    });
  }

  const descriptionContent = parseMarkdown(operation.description, markdownOptions);
  if (descriptionContent) {
    children.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  children.push({
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    graphqlTypeName: rootTypeName,
    graphqlFieldName: operation.name,
    graphqlOperationType: operationType,
  });

  if (operation.args && operation.args.length > 0) {
    children.push({
      nodeType: nodeTypes.ITEM,
      variant: 'graphql-args',
      label: 'Arguments',
      labelTranslationKey: 'arguments.label',
      graphqlTypeName: rootTypeName,
      graphqlFieldName: operation.name,
      graphqlOperationType: operationType,
      graphqlSchema: operation.args.map((arg) => ({
        name: arg.name,
        type: arg.type.toString(),
        description: parseMarkdown(arg.description, markdownOptions) ?? [],
        deprecationReason: arg.deprecationReason || undefined,
        defaultValue: arg.defaultValue,
      })),
    });
  }

  const returnTypeFields =
    isObjectType(returnType) || isInterfaceType(returnType)
      ? Object.values(returnType.getFields()).map((field) => ({
          name: field.name,
          type: field.type.toString(),
          description: parseMarkdown(field.description ?? undefined, markdownOptions) ?? [],
        }))
      : undefined;

  children.push({
    nodeType: nodeTypes.ITEM,
    variant: 'return-type',
    label: 'Return type',
    labelTranslationKey: 'returnTypes.label',
    schemaId: returnSchemaId,
    graphqlTypeName: returnType.name,
    graphqlOperationType: operationType,
    graphqlFieldName: operation.name,
    graphqlSchema: {
      type: operation.type.toString(),
      description: parseMarkdown(returnType.description, markdownOptions) ?? [],
      ...(returnTypeFields && returnTypeFields.length > 0 ? { fields: returnTypeFields } : {}),
    },
  });

  const panels: PanelNode[] = [
    {
      children: [
        {
          kind: panelKind.GRAPHQL_QUERY,
          graphqlOperationData: {
            operationType,
            operationName: operation.name,
            typeName: returnType.name,
          },
          schemaId: returnSchemaId,
          examples: [],
        },
      ],
    },
    {
      children: [
        {
          kind: panelKind.GRAPHQL_RESPONSE,
          graphqlOperationData: {
            operationType,
            operationName: operation.name,
            typeName: returnType.name,
          },
          schemaId: returnSchemaId,
          examples: [],
        },
      ],
    },
  ];

  return {
    contentType: contentType.ITEM,
    itemVariant: variant,
    meta: {
      name: rootTypeName,
      returnType: operation.type.toString(),
      deprecated: !!operation.deprecationReason,
    },
    seo: {
      title: rootTypeName,
      description: operation.description || undefined,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children, panels }],
  };
}
