import type { Node } from '@markdoc/markdoc';
import type {
  ContentNode,
  PanelNode,
  ContainerNode,
  OverviewSectionWrapperNode,
  ApiItemContent,
} from '../../../../types/content.js';
import type { ItemMeta } from '../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';
import type { ApiDocsOptions, NormalizedDownloadUrl } from '../../../../types/options.js';

import { contentType, nodeTypes } from '../../../../types/common.js';
import { asString } from '../../../../utils/string.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import { buildDownloadPanelContent } from '../../panels/download.js';
import { buildOverviewPanelContent } from '../../panels/overview.js';
import { buildMcpPanelContent } from '../../panels/mcp.js';
import { buildServersPanelContent } from '../../panels/servers.js';

type OverviewContentOptions = {
  downloadUrls?: NormalizedDownloadUrl[];
  basePath: string;
  sanitize: ApiDocsOptions['sanitize'];
  markdownParser: ApiDocsOptions['markdownParser'];
} & Partial<ApiDocsOptions>;

export function buildOverviewContent({
  document,
  description,
  sectionChildren,
  options,
}: {
  document: OpenAPIDefinition;
  description: string | Node[] | undefined;
  sectionChildren: ContentNode[];
  options: OverviewContentOptions;
}): ApiItemContent {
  const { downloadUrls, hideDownloadButtons, basePath } = options;
  const info = document.info;
  let label = asString(info?.title) ?? 'API Documentation';
  const headerLabel = info?.version ? `${label} (${info.version})` : label;

  const panels: PanelNode[] = [];
  if (!hideDownloadButtons && downloadUrls?.length) {
    panels.push(buildDownloadPanelContent(downloadUrls));
  }
  panels.push(buildOverviewPanelContent(info));

  const mcpPanel = buildMcpPanelContent(document);
  if (mcpPanel) {
    panels.push(mcpPanel);
  }

  let mergedServers = document.servers ?? [];
  const normalizedServers = mergedServers.map((server) => ({
    ...server,
    description: typeof server.description === 'string' ? server.description : undefined,
  }));

  const serversPanel = buildServersPanelContent(normalizedServers);

  if (serversPanel) {
    panels.push(serversPanel);
  }

  const overviewSection: OverviewSectionWrapperNode = {
    nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
    children: [
      {
        nodeType: nodeTypes.HEADER,
        level: 1,
        label: headerLabel,
        showPageActions: true,
      },
    ],
    sectionId: basePath,
  };

  const summary = parseMarkdown(info.summary, options);
  if (summary) {
    overviewSection.children.push({
      nodeType: nodeTypes.MARKDOC,
      content: summary,
    });
  }

  const descriptionContent = parseMarkdown(description, options);
  if (descriptionContent) {
    overviewSection.children.push({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      children: [
        {
          nodeType: nodeTypes.MARKDOC,
          content: descriptionContent,
        },
      ],
      sectionId: basePath,
    });
  }

  const markdownOptions = options;
  const extDocsSource = document.externalDocs || info?.externalDocs;
  if (extDocsSource?.url) {
    const externalDocsDescription = parseMarkdown(extDocsSource.description, markdownOptions) ?? [];
    overviewSection.children.push({
      nodeType: nodeTypes.EXTERNAL_DOCS,
      url: extDocsSource.url,
      description: externalDocsDescription,
    });
  }

  const containerChildren: ContentNode[] = [overviewSection];
  containerChildren.push(...sectionChildren);

  const containerNode: ContainerNode = {
    nodeType: nodeTypes.CONTAINER,
    panels,
    children: containerChildren,
  };

  const meta: ItemMeta = {
    name: label,
  };

  return {
    contentType: contentType.OVERVIEW,
    meta,
    children: [containerNode],
  };
}
