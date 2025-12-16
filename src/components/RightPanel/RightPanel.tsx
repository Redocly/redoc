import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { GroupModel } from '../../models/index.js';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { DownloadSpecification } from '../Download/index.js';
import { Overview } from '../Overview/index.js';
import { ServerList } from '../ServerList/index.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { normalizeServers } from '../../utils/index.js';
import { useTranslate } from '../../hooks/index.js';
import { useDownloadInfo } from '../Download/useDownloadInfo.js';
import { McpOverview } from '../McpOverview/McpOverview.js';

export const RightPanel = ({
  item: { infoDefinition: info },
}: {
  item: GroupModel;
}): ReactElement | null => {
  const translate = useTranslate();
  const {
    options: {
      hideDownloadButtons,
      downloadUrls,
    },
    parser: { definition, definitionUrl },
  } = useAtomValue(globalStoreAtom);

  const downloadObjects = useDownloadInfo({
    downloadUrls,
  });

  const servers = normalizeServers(
    definitionUrl,
      definition.servers || [],
  );

  const mcpInfo = definition?.['x-mcp'];
  const mcpServers = normalizeServers(definitionUrl, mcpInfo?.servers || definition.servers || []);

  const hasPathItems = Object.keys(definition.paths || {}).length > 0;
  const onlyMcp = !hasPathItems && mcpInfo;

  return (
    <>
      {!hideDownloadButtons && downloadObjects && (
        <Panel
          className="panel-download"
          header={translate('openapi.download.description.title', 'Download OpenAPI description')}
          isExpandable={false}
        >
          <DownloadSpecification downloadObjects={downloadObjects} />
        </Panel>
      )}

      {!!mcpInfo && (
        <Panel
          className="panel-download"
          header={translate('openapi.mcp.title', 'MCP server')}
          isExpandable={false}
        >
          <McpOverview mcpInfo={mcpInfo} mcpServers={mcpServers} />
        </Panel>
      )}

      {(info?.license || info?.contact || info?.termsOfService) && (
        <Panel
          className="panel-mcp-overview"
          header={translate('openapi.info.title', 'Overview')}
          isExpandable={false}
        >
          <MarkdownWrapper>
            <Overview info={info} translate={translate} />
          </MarkdownWrapper>
        </Panel>
      )}
      {!!servers.length && !onlyMcp && (
        <Panel
          className="panel-servers-list"
          header={translate('openapi.servers.title', 'Servers')}
          isExpandable={false}
        >
          <ServerList servers={servers} path="/" translate={translate} />
        </Panel>
      )}
    </>
  );
};
