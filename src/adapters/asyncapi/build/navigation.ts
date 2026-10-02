import { combineUrls } from '@redocly/theme/core/openapi';

import type { ApiItem } from '../../../types/store.js';

import { contentType, nodeTypes } from '../../../types/common.js';
import { asString, safeSlugify } from '../../../utils/string.js';
import {
  buildMarkdownSectionItem,
  extractMarkdownSections,
  extractContentUntilFirstHeading,
  extractSummaryText,
} from '../../utils/markdoc.js';
import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { readRbacScope, rbacProp } from '../../rbac.js';
import { itemLabelsByProtocol } from '../utils/get-protocol-labels.js';
import { buildTaggedChannelItem, buildUntaggedChannelItem } from '../items/channel/item.js';
import { asyncApiContext } from '../buildContext.js';
import { buildGroupItemsPanel } from '../panels/group.js';

export function buildNavigationItems(): ApiItem[] {
  const context = asyncApiContext.get();
  const { document, basePath, channelToOperations, protocol, processContent } = context;
  const channels = document.channels || {};
  const tagsComponents = document.components?.tags || {};
  const channelByLink = new Map<string, (typeof channels)[string]>();

  for (const [channelId, operationIds] of Object.entries(channelToOperations)) {
    const channel = channels[channelId];
    if (!channel) continue;

    const tagNames: string[] = [];
    for (const tag of channel.tags ?? []) {
      const tagName = asString(tag?.name);
      if (tagName) tagNames.push(tagName);
    }
    const labels = itemLabelsByProtocol(protocol, channel.bindings);
    const protocolSlug = `${labels.channel}s`;

    for (const tagName of tagNames) {
      const tagSlug = safeSlugify(tagName).toLowerCase();

      if (!context.groups[tagName]) {
        context.groups[tagName] = [];
      }

      const channelLink = combineUrls(basePath, tagSlug, protocolSlug, channelId).toLowerCase();
      const summary =
        asString(channel.summary) ?? extractSummaryText(channel.description, context.options);
      if (summary) {
        context.channelSummaries.set(channelLink, summary);
      }
      channelByLink.set(channelLink, channel);
      context.groups[tagName].push(
        buildTaggedChannelItem({
          channelId,
          channel,
          operationIds,
          tagName,
        }),
      );
    }

    if (!tagNames.length) {
      context.items.push(
        buildUntaggedChannelItem({
          channelId,
          channel,
          operationIds,
        }),
      );
    }
  }

  if (processContent) {
    for (const group of Object.keys(context.groups)) {
      const tag = tagsComponents[group];
      for (const section of extractMarkdownSections(
        tag?.description,
        context.options,
        safeSlugify(group).toLowerCase(),
      )) {
        context.groups[group].push(
          buildMarkdownSectionItem({
            heading: section,
            basePath,
          }),
        );
      }
    }
  }

  const navItems = [
    ...Object.keys(context.groups).map((tagName) => {
      const group = context.groups[tagName];
      const tagLink = combineUrls(basePath, safeSlugify(tagName)).toLowerCase();
      const tagComponent = tagsComponents[tagName];
      const markdownSanitize = context.options;
      const externalDocs = tagComponent?.externalDocs;
      const tagDescriptionAst = extractContentUntilFirstHeading(
        tagComponent?.description,
        markdownSanitize,
      );
      const groupItem: ApiItem = {
        label: tagName,
        type: 'group',
        link: tagLink,
        routeSlug: tagLink,
        items: group,
        content: processContent
          ? {
              contentType: contentType.GROUP,
              children: [
                {
                  nodeType: nodeTypes.CONTAINER,
                  children: [
                    {
                      nodeType: nodeTypes.HEADER,
                      level: 2,
                      label: tagName,
                      showPageActions: true,
                    },
                    ...(tagDescriptionAst
                      ? [
                          {
                            nodeType: nodeTypes.MARKDOC,
                            content: tagDescriptionAst,
                          },
                        ]
                      : []),
                    ...(externalDocs?.url
                      ? [
                          {
                            nodeType: nodeTypes.EXTERNAL_DOCS,
                            url: externalDocs.url,
                            description:
                              parseMarkdown(externalDocs.description, markdownSanitize) ?? [],
                          },
                        ]
                      : []),
                  ],
                  panels: [
                    {
                      children: [
                        buildGroupItemsPanel({
                          group,
                          protocol,
                          channelByLink,
                          context,
                        }),
                      ],
                    },
                  ],
                },
              ],
            }
          : null,
      };
      return groupItem;
    }),
    ...context.items,
  ];

  if (document['x-tagGroups'] && document['x-tagGroups'].length > 0) {
    const groupedNavItems: ApiItem[] = [];

    const navItemsMap = new Map<string, ApiItem>();
    navItems.forEach((item) => {
      if (item.label) {
        navItemsMap.set(item.label, item);
      }
    });

    document['x-tagGroups'].forEach((tagGroup) => {
      groupedNavItems.push({
        label: tagGroup.name,
        type: 'separator',
        ...rbacProp(readRbacScope(tagGroup)),
        content: null,
      });

      tagGroup.tags.forEach((tagName) => {
        const tagItem = navItemsMap.get(tagName);
        if (tagItem) {
          groupedNavItems.push(tagItem);
        }
      });
    });

    return groupedNavItems;
  }

  return navItems;
}
