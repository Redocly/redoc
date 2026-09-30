import type { DownloadNode } from '../../../types/content.js';
import type { NormalizedDownloadUrl } from '../../../types/options.js';

import { panelKind } from '../../../types/common.js';

export function buildDownloadPanelContent(downloadUrls: NormalizedDownloadUrl[]): DownloadNode {
  return {
    title: 'Download OpenAPI description',
    titleTranslationKey: 'download.description.title',
    children: downloadUrls.map((downloadUrl) => ({
      kind: panelKind.DOWNLOAD,
      label: downloadUrl.title || downloadUrl.url,
      url: downloadUrl.url,
    })),
  };
}
