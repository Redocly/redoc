import type { AsyncApiDefinition } from '../../../../types/asyncapi.js';
import type {
  ApiItemContent,
  ContainerNode,
  ContentNode,
  OverviewSectionWrapperNode,
  PanelNode,
} from '../../../../types/content.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { extractContentUntilFirstHeading } from '../../../utils/markdoc.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import { contentType, nodeTypes } from '../../../../types/common.js';
import { buildDownloadPanelContent } from '../../panels/download.js';
import { buildOverviewPanelContent } from '../../panels/overview.js';
import { buildBrokersPanelContent } from '../../panels/brokers.js';

export function buildOverviewContent({
  document,
  options,
  protocol,
  sectionChildren,
}: {
  document: AsyncApiDefinition;
  options: ApiDocsOptions;
  protocol: string | null;
  sectionChildren: ContentNode[];
}): ApiItemContent {
  const info = document.info;
  const ast = extractContentUntilFirstHeading(info?.description, options);

  const panels: PanelNode[] = [
    ...(!options.hideDownloadButtons && options.downloadUrls?.length
      ? [buildDownloadPanelContent(options.downloadUrls)]
      : []),
    buildOverviewPanelContent(info),
    ...(document.servers
      ? [buildBrokersPanelContent(document.servers, protocol, options, document)]
      : []),
  ];

  const overviewSection: OverviewSectionWrapperNode = {
    nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
    children: [
      {
        nodeType: nodeTypes.HEADER,
        showPageActions: true,
        level: 1,
        label: `${info?.title ?? ''} ${info?.version ?? ''}`.trim(),
      },
    ],
    sectionId: '/',
  };

  if (ast?.length) {
    overviewSection.children.push({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      children: [{ nodeType: nodeTypes.MARKDOC, content: ast }],
      sectionId: '/',
    });
  }

  const extDocs = info?.externalDocs;
  if (extDocs?.url) {
    const externalDocsDescription = parseMarkdown(extDocs.description, options) ?? [];
    overviewSection.children.push({
      nodeType: nodeTypes.EXTERNAL_DOCS,
      url: extDocs.url,
      description: externalDocsDescription,
    });
  }

  const children: ContentNode[] = [overviewSection];
  children.push(...sectionChildren);

  const containerNode: ContainerNode = {
    nodeType: nodeTypes.CONTAINER,
    panels,
    children,
  };

  return {
    contentType: contentType.OVERVIEW,
    children: [containerNode],
  };
}
