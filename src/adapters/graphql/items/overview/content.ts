import type { Node } from '@markdoc/markdoc';
import type {
  ApiItemContent,
  ContainerNode,
  ContentNode,
  OverviewSectionWrapperNode,
  PanelNode,
} from '../../../../types/content.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { contentType, nodeTypes } from '../../../../types/common.js';
import { buildDownloadPanelContent } from '../../panels/download.js';
import { buildOverviewPanelContent } from '../../panels/overview.js';
import { buildGraphqlConfigMetadataRows } from '../../utils/configMetadataRows.js';

type OverviewOptions = {
  options: ApiDocsOptions;
  markdoc?: string | Node[];
  sectionChildren: ContentNode[];
  basePath: string;
};

export function buildOverviewContent(overviewOptions: OverviewOptions): ApiItemContent {
  const {
    options: { info, downloadUrls, metadata },
    markdoc,
    sectionChildren,
    basePath,
  } = overviewOptions;

  const panels: PanelNode[] = [];

  const downloadPanel = buildDownloadPanelContent(downloadUrls ?? []);

  if (downloadPanel) {
    panels.push(downloadPanel);
  }

  const overviewPanel = buildOverviewPanelContent(info);

  if (overviewPanel) {
    panels.push(overviewPanel);
  }

  const overviewTitle = info?.title ?? 'Overview';

  const overviewSection: OverviewSectionWrapperNode = {
    nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
    children: [
      {
        nodeType: nodeTypes.HEADER,
        level: 1,
        showPageActions: true,
        label: info?.version ? `${overviewTitle} (${info.version})` : overviewTitle,
        labelTranslationKey: info?.title || info?.version ? undefined : 'overview',
      },
    ],
    sectionId: basePath,
  };

  if (markdoc?.length) {
    overviewSection.children.push({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      children: [{ nodeType: nodeTypes.MARKDOC, content: markdoc }],
      sectionId: basePath,
    });
  }

  const configMetadataRows = buildGraphqlConfigMetadataRows(metadata);
  if (configMetadataRows.length > 0) {
    overviewSection.children.push({
      nodeType: nodeTypes.INFO_METADATA,
      rows: configMetadataRows,
    });
  }

  const containerNode: ContainerNode = {
    nodeType: nodeTypes.CONTAINER,
    panels,
    children: [overviewSection, ...sectionChildren],
  };

  return {
    contentType: contentType.OVERVIEW,
    seo: { title: info?.title, description: info?.description },
    children: [containerNode],
  };
}
