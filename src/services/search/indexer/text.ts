import type {
  ContentNode,
  ContainerNode,
  MarkdocNode,
  OverviewSectionWrapperNode,
} from '../../../types/content.js';

import { nodeTypes } from '../../../types/common.js';
import { extractFullText } from '../../../adapters/utils/markdoc.js';

export function extractText(children: ContentNode[]): string {
  const parts: string[] = [];

  const visit = (nodes: ContentNode[]): void => {
    for (const node of nodes) {
      if (node.nodeType === nodeTypes.MARKDOC) {
        const markdocNode = node as MarkdocNode;
        if (isOnlyInlineCode(markdocNode.content)) continue;
        const text = extractFullText(markdocNode.content);
        if (text) parts.push(text);
      } else if (node.nodeType === nodeTypes.CONTAINER) {
        visit((node as ContainerNode).children);
      } else if (node.nodeType === nodeTypes.OVERVIEW_SECTION_WRAPPER) {
        visit((node as OverviewSectionWrapperNode).children);
      }
    }
  };

  visit(children);
  return parts.join(' ').trim();
}

function isOnlyInlineCode(ast: unknown): boolean {
  let hasCode = false;
  let hasText = false;

  const walk = (node: Record<string, unknown>): void => {
    if (node.type === 'code' && (node.attributes as Record<string, unknown>)?.content) {
      hasCode = true;
    } else if (node.type === 'text' && (node.attributes as Record<string, unknown>)?.content) {
      hasText = true;
    }
    for (const child of (node.children as Record<string, unknown>[]) ?? []) {
      walk(child);
    }
  };

  const nodes = Array.isArray(ast) ? ast : [ast];
  for (const node of nodes) {
    walk(node as Record<string, unknown>);
  }
  return hasCode && !hasText;
}
