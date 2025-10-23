import * as React from 'react';

import type { OpenAPIMcp, OpenAPIServer } from '../../types/open-api.js';

import { NewTabButton } from '@redocly/theme/components/Buttons/NewTabButton';
import { PageActions } from '@redocly/theme/components/PageActions/PageActions';
import { Tag } from '@redocly/theme/components/Tag/Tag';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

import {
  MCP_SERVER_CAPABILITIES,
  MCP_SERVER_EXPERIMENTAL_CAPABILITIES,
  PAGE_ACTIONS_MCP,
} from '../../utils/mcp.js';
import { PanelItem } from '../PanelItem/PanelItem.js';
import { PanelItemsList } from '../PanelItem/styled.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

export function McpOverview({
  mcpInfo,
  mcpServers,
}: {
  mcpInfo: OpenAPIMcp;
  mcpServers: OpenAPIServer[];
}) {
  const translate = useTranslate();
  function hasListChanged(type: string) {
    return (
      typeof mcpInfo?.capabilities[type] === 'object' && mcpInfo?.capabilities[type]?.listChanged
    );
  }
  function hasSubscribe(type: string) {
    return (
      typeof mcpInfo?.capabilities[type] === 'object' && mcpInfo?.capabilities[type]?.subscribe
    );
  }

  return (
    <PanelItemsList>
      {mcpInfo?.protocolVersion && (
        <PanelItem
          header={translate('openapi.mcp.protocolVersion', 'Protocol version')}
          title={mcpInfo.protocolVersion}
        />
      )}
      {mcpInfo?.capabilities && (
        <PanelItem
          header={translate('openapi.mcp.capabilities', 'Capabilities')}
          title={
            <>
              {MCP_SERVER_CAPABILITIES.map((type) =>
                mcpInfo?.capabilities[type] ? (
                  <Tag key={type} size="small" icon={<CheckmarkIcon />}>
                    {type}
                    {hasListChanged(type) ? ' (list changed)' : ''}
                    {hasSubscribe(type) ? ' (subscribe)' : ''}
                  </Tag>
                ) : null,
              )}
            </>
          }
        />
      )}
      {mcpInfo?.capabilities[MCP_SERVER_EXPERIMENTAL_CAPABILITIES] && (
        <PanelItem
          header={translate('openapi.mcp.experimentalCapabilities', 'Experimental capabilities')}
          title={
            <Grid>
              {Object.entries(mcpInfo?.capabilities.experimental || {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <span>{key}:</span>
                  <Tag>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</Tag>
                </React.Fragment>
              ))}
            </Grid>
          }
        />
      )}
      <PanelItem
        header={translate('openapi.mcp.endpoint', 'Endpoint')}
        title={<>{mcpServers[0]?.url}</>}
        actions={[<NewTabButton data={mcpServers[0]?.url} key="NewTabButton" />]}
      />

      <PanelItem
        title={
          <PageActionsWrapper>
            <PageActions actions={PAGE_ACTIONS_MCP} mcpUrl={mcpServers[0]?.url} />
          </PageActionsWrapper>
        }
      />
    </PanelItemsList>
  );
}

const PageActionsWrapper = styled.div`
  & button {
    width: 100%;
  }
  > div {
    padding: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;

  > * {
    justify-self: start;
  }
`;
