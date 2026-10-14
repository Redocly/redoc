import type { GraphQLDirective } from 'graphql';
import type { ApiItemContent, ContentNode, PanelNode } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { contentType, itemVariant, nodeTypes, panelKind } from '../../../../types/common.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';

export function buildDirectiveContent(
  directive: GraphQLDirective,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  const containerChildren: ContentNode[] = [
    { nodeType: nodeTypes.HEADER, level: 2, label: `@${directive.name}`, showPageActions: true },
  ];

  const descriptionContent = parseMarkdown(directive.description, markdownOptions);
  if (descriptionContent) {
    containerChildren.push({ nodeType: nodeTypes.MARKDOC, content: descriptionContent });
  }

  if (directive.args && directive.args.length > 0) {
    containerChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'graphql-args',
      label: 'Arguments',
      labelTranslationKey: 'arguments.label',
      graphqlTypeName: directive.name,
    });
  }

  const panels: PanelNode[] = [];

  if (directive.locations && directive.locations.length > 0) {
    panels.push({
      title: 'Locations',
      titleTranslationKey: 'locations',
      children: [{ kind: panelKind.LOCATIONS, locations: [...directive.locations] }],
    });
  }

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.DIRECTIVE,
    meta: { name: directive.name },
    children: [{ nodeType: nodeTypes.CONTAINER, children: containerChildren, panels }],
  };
}
