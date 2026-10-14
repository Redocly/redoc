import type { DownloadNode } from '../../../types/content.js';
import type { NormalizedDownloadUrl } from '../../../types/options.js';

import { panelKind } from '../../../types/common.js';

export function buildDownloadPanelContent(downloadUrls: NormalizedDownloadUrl[]): DownloadNode {
  const content: DownloadNode = {
    title: 'Download AsyncAPI description',
    titleTranslationKey: 'download.description.title',
    children: downloadUrls.map((downloadUrl) => ({
      kind: panelKind.DOWNLOAD,
      label: downloadUrl.title,
      url: downloadUrl.url,
    })),
  };

  return content;
}
