import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ServersNode } from '../../../types/content.js';
import type { ServerData } from '../../../types/common.js';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { resolveText } from '../../../utils/resolveText.js';
import { PanelItemsList } from '../../common/PanelItem.js';
import { OverviewPanel } from '../styled.js';
import { ServerItem } from './ServerItem.js';

export function ServerPanelItem({ node }: { node: ServersNode }): ReactElement {
  const serverItem = node.children[0];
  const translate = useSpecTranslate();
  const servers = serverItem?.servers ?? [];

  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);

  return (
    <OverviewPanel header={panelHeader} className="panel-api-docs" isExpandable={false}>
      <PanelItemsList>
        {servers.map((server) => (
          <ServerRow key={server.url} server={server} />
        ))}
      </PanelItemsList>
    </OverviewPanel>
  );
}

const ServerRow = memo(function ServerRow({ server }: { server: ServerData }): ReactElement {
  return <ServerItem server={server} />;
});
