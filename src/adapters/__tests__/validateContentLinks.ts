import type { ApiItem, GroupItem } from '../../types/store.js';
import type {
  ApiItemContent,
  ContainerNode,
  ContentNode,
  FeedbackNode,
  GroupItemsPanelItem,
  MessageChannelReference,
  MessageLinksNode,
  MessageReferencesPanelItem,
  PanelNode,
} from '../../types/content.js';

import { nodeTypes, panelKind } from '../../types/common.js';

/**
 * Walk every `ApiItem.content` recursively and assert that every embedded link
 * is relative to `basePath` (no `basePath` prefix) and lowercase only.
 *
 * Validates the four link/slug fields adapters emit inside content:
 *  - `GroupItem.link`             (group panels)
 *  - `MessageChannelReference.link` (AsyncAPI message references panel)
 *  - `MessageLinksNode.channelLink` (AsyncAPI operation message-links node)
 *  - `FeedbackNode.pageSlug`        (feedback container)
 *
 * Top-level `ApiItem.link` / `ApiItem.routeSlug` are intentionally NOT validated
 * — those carry the absolute route and stay basePath-prefixed.
 *
 * @throws on the first violation it finds with a clear, source-aware message.
 */
export function validateContentLinks(items: ApiItem[], basePath: string): void {
  const normalizedBase = normalize(basePath);
  for (const item of items) {
    const trail = item.label ? String(item.label) : (item.link ?? '<unknown>');
    if (item.content) {
      validateApiItemContent(item.content, normalizedBase, trail);
    }
    if ('items' in item && Array.isArray(item.items)) {
      validateContentLinks(item.items as ApiItem[], basePath);
    }
  }
}

function validateApiItemContent(content: ApiItemContent, basePath: string, trail: string): void {
  for (const child of content.children) {
    walkContentNode(child, basePath, trail);
  }
}

function walkContentNode(node: ContentNode, basePath: string, trail: string): void {
  switch (node.nodeType) {
    case nodeTypes.CONTAINER: {
      const container = node as ContainerNode;
      for (const child of container.children) {
        walkContentNode(child, basePath, trail);
      }
      for (const panel of container.panels ?? []) {
        walkPanel(panel, basePath, trail);
      }
      break;
    }
    case nodeTypes.OVERVIEW_SECTION_WRAPPER: {
      for (const child of node.children) {
        walkContentNode(child, basePath, trail);
      }
      break;
    }
    case nodeTypes.MESSAGE_LINKS: {
      const linksNode = node as MessageLinksNode;
      assertContentLink(linksNode.channelLink, basePath, `${trail} → message-links.channelLink`);
      break;
    }
    case nodeTypes.FEEDBACK: {
      const feedback = node as FeedbackNode;
      if (feedback.pageSlug !== undefined) {
        assertContentLink(feedback.pageSlug, basePath, `${trail} → feedback.pageSlug`);
      }
      break;
    }
    default:
      break;
  }
}

function walkPanel(panel: PanelNode, basePath: string, trail: string): void {
  for (const child of panel.children as Array<{ kind: string }>) {
    if (child.kind === panelKind.GROUP_ITEMS) {
      const groupPanel = child as GroupItemsPanelItem;
      for (const groupItem of groupPanel.items ?? []) {
        assertGroupItemLink(groupItem, basePath, trail, groupPanel.title);
      }
    } else if (child.kind === panelKind.MESSAGE_REFERENCES) {
      const refPanel = child as MessageReferencesPanelItem;
      for (const [messageKey, groups] of Object.entries(refPanel.referencesByMessageKey ?? {})) {
        for (const exchange of groups.exchanges) {
          assertMessageReferenceLink(exchange, basePath, trail, messageKey, 'exchanges');
        }
        for (const queue of groups.queues) {
          assertMessageReferenceLink(queue, basePath, trail, messageKey, 'queues');
        }
      }
    }
  }
}

function assertGroupItemLink(
  item: GroupItem,
  basePath: string,
  trail: string,
  panelTitle: string | undefined,
): void {
  if (typeof item.link !== 'string') return;
  assertContentLink(
    item.link,
    basePath,
    `${trail} → panel "${panelTitle ?? '<untitled>'}" → group-item "${item.title ?? item.link}".link`,
  );
}

function assertMessageReferenceLink(
  reference: MessageChannelReference,
  basePath: string,
  trail: string,
  messageKey: string,
  group: 'exchanges' | 'queues',
): void {
  assertContentLink(
    reference.link,
    basePath,
    `${trail} → message-references["${messageKey}"].${group}["${reference.key}"].link`,
  );
}

function assertContentLink(link: string, basePath: string, where: string): void {
  if (typeof link !== 'string') {
    throw new Error(`Invalid content link at ${where}: expected string, got ${typeof link}`);
  }
  const normalizedLink = normalize(link);
  if (basePath && (normalizedLink === basePath || normalizedLink.startsWith(basePath + '/'))) {
    const stripped = normalizedLink.slice(basePath.length) || '/';
    throw new Error(
      `Invalid content link at ${where}: "${link}" must not include basePath "${basePath}". ` +
        `Suggested: "${stripped}".`,
    );
  }
  if (/[A-Z]/.test(link)) {
    throw new Error(
      `Invalid content link at ${where}: "${link}" must be lowercase. ` +
        `Suggested: "${normalize(link.toLowerCase())}".`,
    );
  }
}

function normalize(path: string): string {
  if (!path) return '';
  let p = path;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}
