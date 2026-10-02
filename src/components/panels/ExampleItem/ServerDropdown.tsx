import { useCallback, useEffect, useMemo, type ReactElement, type MouseEvent } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { styled } from 'styled-components';

import { getOperationColor, breakpoints } from '@redocly/theme/core/openapi';
import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';

import { environmentAtom, savedEnvironmentNameAtom } from '../../../jotai/app.js';
import { resolveServerUrl } from '../../../services/code-samples/normalize-servers.js';
import { replaceServerVariables } from '../../../services/code-samples/server-variables.js';
import { getServerEnvName } from '../../../utils/environments.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { normalizeProtocol, RESOURCES, useTelemetry } from '../../../telemetry/index.js';
import { createTargetServerSwitchEvent } from '../../../events/serverSwitch.js';
import { PanelItem } from '../../common/PanelItem.js';
import { HttpVerb, PathLabel, PathWrapper, StaticPathWrapper } from './styled.js';

type ServerVariables = Record<string, { default?: string }>;

export type ServerEntry = {
  url: string;
  name?: string;
  description?: string;
  variables?: ServerVariables;
};

type ServerDropdownProps = {
  servers: ServerEntry[];
  method: string;
  path: string;
};

type ResolvedServer = ServerEntry & {
  resolvedUrl: string;
  envUrl: string;
  envName: string;
};

function joinWithSeparator(base = '', path = '', sep = '/'): string {
  if (base.endsWith(sep) && base !== sep) base = base.slice(0, -sep.length);
  if (path.startsWith(sep)) path = path.slice(sep.length);
  if (!base || !path || base === sep) return base + path;
  return base + sep + path;
}

const StyledDropdownMenuItem = styled(DropdownMenuItem)`
  padding: calc(var(--spacing-unit) * 1.5) var(--spacing-xs) calc(var(--spacing-unit) * 1.5)
    var(--spacing-lg);
  @media screen and (max-width: ${breakpoints.large}) {
    max-width: 280px;
  }
`;

const StyledCopyButton = styled(CopyButton)`
  :hover {
    background-color: var(--dropdown-menu-item-bg-color-hover);
  }
`;

export function ServerDropdown({ servers, method, path }: ServerDropdownProps): ReactElement {
  const [environment, setEnvironment] = useAtom(environmentAtom);
  const { events } = useAtomValue(globalOptionsAtom);
  const telemetry = useTelemetry();
  const activeEnv = environment[0];
  const savedEnvName = useAtomValue(savedEnvironmentNameAtom);
  const isAdditionalOperation = ![
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'head',
    'options',
    'trace',
    'query',
    'x-query',
  ].includes(method.toLowerCase());
  const httpColor = getOperationColor({
    httpVerb: method.toLowerCase(),
    isAdditionalOperation,
  });

  const resolvedServers = useMemo<ResolvedServer[]>(
    () =>
      servers.map((s) => {
        const envUrl = resolveServerUrl(s.url);
        return {
          ...s,
          resolvedUrl: replaceServerVariables(s),
          envUrl,
          envName: String(getServerEnvName({ ...s, url: envUrl })),
        };
      }),
    [servers],
  );

  const activeServerUrl = useMemo(() => {
    const match = resolvedServers.find(
      (s) =>
        s.url === activeEnv.server ||
        s.resolvedUrl === activeEnv.server ||
        s.envUrl === activeEnv.server,
    );
    if (match) return match.resolvedUrl;
    return resolvedServers[0]?.resolvedUrl ?? '';
  }, [activeEnv.server, resolvedServers]);

  useEffect(() => {
    if (!activeEnv.server && resolvedServers.length > 0) {
      const saved = savedEnvName
        ? resolvedServers.find((s) => s.envName === savedEnvName)
        : undefined;
      const target = saved ?? resolvedServers[0];
      setEnvironment({
        ...(!savedEnvName && { environment: target.envName }),
        environments: { [target.envName]: { server: target.envUrl } },
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onCopyClick = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  const handleSelect = useCallback(
    (server: ResolvedServer) => () => {
      if (servers.length <= 1) return;
      const envName = server.envName;
      telemetry.sendSwitchServersClickedMessage([
        {
          ...RESOURCES.switchServersButton,
          index: resolvedServers.indexOf(server),
          total: servers.length,
          protocol: normalizeProtocol(server.url),
        },
      ]);
      setEnvironment({
        environment: envName,
        environments: {
          [envName]: { server: server.envUrl },
        },
      });
      events?.targetServerSwitch?.(
        createTargetServerSwitchEvent({
          operation: {
            id: `${method}:${path}`,
            path,
            httpVerb: method,
            name: `${method.toUpperCase()} ${path}`,
          },
          serverUrl: server.url,
        }),
      );
    },
    [servers.length, setEnvironment, telemetry, events, method, path, resolvedServers],
  );

  // A callback runtime expression ({$request...}) can't resolve against a
  // server, so render it static (no switcher).
  const isRuntimeExpression = path.includes('{$');

  if (servers.length === 0 || isRuntimeExpression) {
    return (
      <StaticPathWrapper>
        <HttpVerb color={httpColor}>{method}</HttpVerb>
        <PathLabel>{path}</PathLabel>
      </StaticPathWrapper>
    );
  }

  const trigger = (
    <PathWrapper variant="ghost">
      <HttpVerb color={httpColor}>{method}</HttpVerb>
      <PathLabel>{path}</PathLabel>
    </PathWrapper>
  );

  const items = resolvedServers.map((server) => {
    const displayUrl = resolveServerUrl(server.resolvedUrl);
    const fullUrl = joinWithSeparator(displayUrl, path);
    return (
      <StyledDropdownMenuItem key={server.url} onAction={handleSelect(server)}>
        <PanelItem
          header={server.name || server.description || displayUrl}
          title={fullUrl}
          actions={[
            <StyledCopyButton
              data={fullUrl}
              key={fullUrl}
              toasterPlacement="left"
              onCopyClick={onCopyClick}
            />,
          ]}
          active={server.resolvedUrl === activeServerUrl}
          withCheckmark
        />
      </StyledDropdownMenuItem>
    );
  });

  return (
    <Dropdown trigger={trigger} withArrow alignment="start">
      <DropdownMenu>{items}</DropdownMenu>
    </Dropdown>
  );
}
