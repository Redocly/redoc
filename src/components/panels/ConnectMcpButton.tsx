import type { ReactElement } from 'react';
import type { EventPayload } from '@redocly/redoc-opentelemetry';
import type { MCPClientType, PageAction } from '@redocly/theme/core/types';

import { Button } from '@redocly/theme/components/Button/Button';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { PageActionsMenuItem } from '@redocly/theme/components/PageActions/PageActionsMenuItem';
import { SplitButton } from '@redocly/theme/components/SplitButton/SplitButton';
import { DEFAULT_MCP_SERVER_NAME } from '@redocly/theme/core/constants';
import { generateMCPDeepLink } from '@redocly/theme/core/utils';
import { CursorIcon } from '@redocly/theme/icons/CursorIcon/CursorIcon';
import { VSCodeIcon } from '@redocly/theme/icons/VSCodeIcon/VSCodeIcon';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';

type McpOption = EventPayload<'com.redocly.connectMcp.clicked'>[0]['option'];

type McpClient = {
  option: MCPClientType & McpOption;
  titleKey: string;
  title: string;
  descriptionKey: string;
  description: string;
  Icon: typeof CursorIcon;
};

const CLIENT_BY_ACTION: Partial<Record<string, McpClient>> = {
  'mcp-cursor': {
    option: 'cursor',
    titleKey: 'page.actions.connectMcp.cursor',
    title: 'Connect to Cursor',
    descriptionKey: 'page.actions.connectMcp.cursorDescription',
    description: 'Install MCP server on Cursor',
    Icon: CursorIcon,
  },
  'mcp-vscode': {
    option: 'vscode',
    titleKey: 'page.actions.connectMcp.vscode',
    title: 'Connect to VS Code',
    descriptionKey: 'page.actions.connectMcp.vscodeDescription',
    description: 'Install MCP server on VS Code',
    Icon: VSCodeIcon,
  },
};

export function ConnectMcpButton({
  actions,
  mcpUrl,
}: {
  actions: string[];
  mcpUrl: string;
}): ReactElement | null {
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();

  const pageActions: PageAction[] = actions
    .map((action) => CLIENT_BY_ACTION[action])
    .filter((client) => client !== undefined)
    .map((client) => ({
      buttonText: translate(client.titleKey, client.title),
      title: translate(client.titleKey, client.title),
      description: translate(client.descriptionKey, client.description),
      iconComponent: client.Icon,
      onClick: () => {
        telemetry.sendConnectMcpClickedMessage([
          { ...RESOURCES.connectMcp, option: client.option },
        ]);
        window.open(
          generateMCPDeepLink(client.option, { serverName: DEFAULT_MCP_SERVER_NAME, url: mcpUrl }),
          '_blank',
        );
      },
    }));
  const [main, ...rest] = pageActions;
  if (!main || !('onClick' in main)) return null;

  return (
    <SplitButton
      portalled
      variant="outlined"
      size="medium"
      toggleAriaLabel={translate('page.actions.moreActions', 'More actions')}
      button={
        <Button variant="outlined" icon={<main.iconComponent />} onClick={main.onClick}>
          {main.buttonText}
        </Button>
      }
    >
      {rest.length ? (
        <DropdownMenu>
          {rest.map((action) => (
            <DropdownMenuItem
              key={action.title}
              onAction={() => 'onClick' in action && action.onClick()}
            >
              <PageActionsMenuItem pageAction={action} />
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      ) : null}
    </SplitButton>
  );
}
