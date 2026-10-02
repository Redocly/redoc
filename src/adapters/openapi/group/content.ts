import type { Node } from '@markdoc/markdoc';
import type { Badge } from '../../../types/common.js';
import type {
  ContainerNode,
  ContentNode,
  GroupItemNode,
  ApiItemContent,
} from '../../../types/content.js';
import type { BreadcrumbItem, GroupItem } from '../../../types/store.js';
import type { OpenAPITagExtended, OperationInfo } from '../../../types/openapi.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';
import type { McpGroupItems } from '../items/mcp/item.js';

import { WEBHOOKS_GROUP_TITLE } from '../../../constants/openapi.js';
import { contentType, nodeTypes, panelKind } from '../../../types/common.js';
import { normalizePath, toRelativePath } from '../../../utils/url.js';
import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { extractDescriptionSegments } from '../../utils/markdoc.js';
import { getOperationColor, getOperationData, getOperationSummary } from '../utils/operation.js';
import { readRbacScope, rbacProp } from '../../rbac.js';

export type ChildTagInfo = {
  displayName: string;
  summary?: string;
  slug: string;
};

const MCP_PANEL_TITLES: Record<keyof McpGroupItems, { title: string; translationKey: string }> = {
  tools: { title: 'MCP Tools', translationKey: 'openapi.mcp.tools' },
  resources: { title: 'MCP Resources', translationKey: 'openapi.mcp.resources' },
  prompts: { title: 'MCP Prompts', translationKey: 'openapi.mcp.prompts' },
};

export function buildGroupContent({
  tag,
  tagName,
  headerLabel,
  description,
  operations,
  schemasItems,
  mcpItems,
  tagSlug,
  basePath,
  breadcrumbs,
  childTags,
  markdownOptions,
}: {
  tag: OpenAPITagExtended;
  tagName: string;
  headerLabel?: string;
  description?: string | Node[] | Node;
  operations: OperationInfo[];
  schemasItems?: GroupItem[];
  mcpItems?: McpGroupItems;
  tagSlug: string;
  basePath: string;
  breadcrumbs?: BreadcrumbItem[];
  childTags?: ChildTagInfo[];
  markdownOptions: ParseMarkdownOptions;
}): ApiItemContent {
  const containerNode: ContainerNode = {
    nodeType: nodeTypes.CONTAINER,
    children: [
      {
        nodeType: nodeTypes.HEADER,
        level: 2,
        label: headerLabel ?? tagName,
        showPageActions: true,
      },
    ],
    panels: [],
  };
  // Deprecated operations sink below regular ones (separately for webhooks),
  // matching the left-nav order from `addOperationItems`.
  const regularOperations: GroupItem[] = [];
  const deprecatedOperations: GroupItem[] = [];
  const regularWebhooks: GroupItem[] = [];
  const deprecatedWebhooks: GroupItem[] = [];

  for (const operation of operations) {
    const { slug, badges, deprecated, httpVerb, isAdditionalOperation, isWebhook } =
      getOperationData(operation, tagSlug);
    const httpVerbBadge: Badge = {
      name: httpVerb,
      color: getOperationColor({ httpVerb, deprecated, isAdditionalOperation }),
    };
    const item: GroupItem = {
      title: operation.pathName,
      summary: getOperationSummary(operation, markdownOptions),
      prefix: httpVerbBadge,
      badges: badges ?? [],
      link: normalizePath(toRelativePath(slug, basePath)),
      deprecated,
      ...rbacProp(readRbacScope(operation)),
    };
    if (isWebhook) {
      (deprecated ? deprecatedWebhooks : regularWebhooks).push(item);
    } else {
      (deprecated ? deprecatedOperations : regularOperations).push(item);
    }
  }

  const operationsItems: GroupItem[] = [...regularOperations, ...deprecatedOperations];
  const webhooksItems: GroupItem[] = [...regularWebhooks, ...deprecatedWebhooks];

  const groupChildren: GroupItemNode['children'] = [];

  if (childTags && childTags.length > 0) {
    const childTagItems: GroupItem[] = childTags.map((child) => ({
      title: child.displayName,
      summary: child.summary,
      link: normalizePath(toRelativePath(child.slug, basePath)),
      deprecated: false,
      childTag: true,
    }));
    groupChildren.push({
      kind: panelKind.GROUP_ITEMS,
      title: '',
      items: childTagItems,
    });
  }

  if (schemasItems && schemasItems.length > 0) {
    groupChildren.push({
      kind: panelKind.GROUP_ITEMS,
      title: 'Schemas',
      titleTranslationKey: 'schemas',
      items: schemasItems,
    });
  }

  if (operationsItems.length > 0) {
    groupChildren.push({
      kind: panelKind.GROUP_ITEMS,
      title: 'Operations',
      titleTranslationKey: 'operations',
      items: operationsItems,
    });
  }

  if (webhooksItems.length > 0) {
    groupChildren.push({
      kind: panelKind.GROUP_ITEMS,
      title: WEBHOOKS_GROUP_TITLE,
      titleTranslationKey: 'webhooks',
      items: webhooksItems,
    });
  }

  if (mcpItems) {
    for (const [collectionType, items] of Object.entries(mcpItems)) {
      if (items.length > 0) {
        const { title, translationKey } = MCP_PANEL_TITLES[collectionType as keyof McpGroupItems];
        groupChildren.push({
          kind: panelKind.GROUP_ITEMS,
          title,
          titleTranslationKey: translationKey,
          items,
        });
      }
    }
  }

  if (groupChildren.length > 0) {
    const groupItemPanel: GroupItemNode = { children: groupChildren };
    containerNode.panels?.push(groupItemPanel);
  }

  const descriptionSegments = extractDescriptionSegments(description, markdownOptions, {
    sliceAtFirstHeading: true,
  });
  const hasSchemaDefinition = descriptionSegments.some((s) => s.kind === 'schemaDefinition');
  const siblings: ContentNode[] = [];
  for (const segment of descriptionSegments) {
    if (!hasSchemaDefinition) {
      containerNode.children?.push(segment.node);
      continue;
    }
    siblings.push(
      segment.kind === 'schemaDefinition'
        ? segment.node
        : { nodeType: nodeTypes.CONTAINER, children: [segment.node], panels: [] },
    );
  }

  if (tag.externalDocs) {
    const externalDocsDescription =
      parseMarkdown(tag.externalDocs.description, markdownOptions) ?? [];
    containerNode.children?.push({
      nodeType: nodeTypes.EXTERNAL_DOCS,
      url: tag.externalDocs.url,
      description: externalDocsDescription,
    });
  }

  const contentChildren: ContentNode[] = [containerNode, ...siblings];


  return {
    contentType: contentType.GROUP,
    meta: {
      name: tagName,
      breadcrumbs,
    },
    children: contentChildren,
  };
}
