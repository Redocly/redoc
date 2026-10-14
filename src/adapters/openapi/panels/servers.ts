import type { ServerData } from '../../../types/common.js';
import type { ServersNode } from '../../../types/content.js';

import { panelKind } from '../../../types/common.js';

export function buildServersPanelContent(servers: ServerData[]): ServersNode | null {
  if (!servers || servers.length === 0) {
    return null;
  }

  return {
    title: 'Servers',
    titleTranslationKey: 'servers.title',
    children: [{ kind: panelKind.SERVERS, servers, mode: 'default' }],
  };
}
