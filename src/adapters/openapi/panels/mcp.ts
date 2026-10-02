import type { McpNode } from '../../../types/content.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { panelKind } from '../../../types/common.js';
import { MCP_SERVER_EXPERIMENTAL_CAPABILITIES, PAGE_ACTIONS_MCP } from '../constants.js';

export function buildMcpPanelContent(document: OpenAPIDefinition): McpNode | null {
  const mcpInfo = document?.['x-mcp'];
  if (!mcpInfo) {
    return null;
  }

  const mcpServers = mcpInfo?.servers ?? document.servers ?? [];
  const mcpEndpoint = mcpServers[0]?.url ?? '';
  const mcpItems: McpNode['children'] = [];

  if (mcpInfo?.protocolVersion) {
    mcpItems.push({
      kind: panelKind.ATTRIBUTE,
      label: 'Protocol version',
      labelTranslationKey: 'mcp.protocolVersion',
      value: mcpInfo?.protocolVersion ?? '',
      withCopyButton: true,
      copyContent: mcpInfo?.protocolVersion ?? '',
    });
  }

  if (mcpInfo?.capabilities && typeof mcpInfo.capabilities === 'object') {
    const tags = Object.keys(mcpInfo.capabilities)
      .filter((name) => name !== MCP_SERVER_EXPERIMENTAL_CAPABILITIES)
      .map((name) => ({ text: name, color: 'green', icon: 'checkmark' }));
    if (tags.length > 0) {
      mcpItems.push({
        kind: panelKind.TAGS,
        title: 'Capabilities',
        titleTranslationKey: 'mcp.capabilities',
        tags,
      });
    }
  }

  if (mcpInfo?.capabilities?.[MCP_SERVER_EXPERIMENTAL_CAPABILITIES]) {
    mcpItems.push({
      kind: panelKind.ATTRIBUTE,
      title: 'Experimental capabilities',
      titleTranslationKey: 'mcp.experimentalCapabilities',
      label: 'Value',
      labelTranslationKey: 'value',
      value: JSON.stringify((mcpInfo.capabilities as Record<string, unknown>).experimental),
      withCopyButton: true,
      copyContent: JSON.stringify((mcpInfo.capabilities as Record<string, unknown>).experimental),
    });
  }

  mcpItems.push({
    kind: panelKind.EXTERNAL_LINK,
    title: 'Endpoint',
    titleTranslationKey: 'mcp.endpoint',
    label: mcpEndpoint,
    url: mcpEndpoint,
    withCopyButton: true,
    copyContent: mcpEndpoint,
  });

  mcpItems.push({
    kind: panelKind.CONNECT_MCP_BUTTON,
    title: 'Connect',
    actions: PAGE_ACTIONS_MCP,
    mcpUrl: mcpEndpoint,
  });

  return {
    title: 'MCP server',
    titleTranslationKey: 'mcp.title',
    children: mcpItems,
  };
}
