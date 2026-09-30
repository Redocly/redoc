import type { AsyncApiServer } from '../../../types/asyncapi.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { type BrokersNode } from '../../../types/content.js';
import { panelKind } from '../../../types/common.js';
import { componentLabelsByProtocol } from '../utils/get-protocol-labels.js';
import { getServerHost } from '../utils/get-server-host.js';
import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { readRbacScope, rbacProp, splitRbacSection } from '../../rbac.js';

export function buildBrokersPanelContent(
  servers: Record<string, AsyncApiServer>,
  protocol: string | null,
  markdownOptions: ParseMarkdownOptions,
): BrokersNode {
  const panelLabel = componentLabelsByProtocol({ protocol }).servers;
  const { sectionRbac, entries } = splitRbacSection(servers);

  const content: BrokersNode = {
    title: panelLabel,
    children: [
      {
        kind: panelKind.BROKERS,
        panelLabel,
        brokers: entries.map(([name, server]) => ({
          name,
          url: getServerHost(server),
          description: parseMarkdown(server.description, markdownOptions) ?? [],
          variables: server.variables,
          protocol: server.protocol,
          protocolVersion: server.protocolVersion,
          pathname: server.pathname,
          title: server.title,
          summary: server.summary,
          tags: server.tags,
          externalDocs: server.externalDocs,
          bindings: server.bindings,
          ...rbacProp(readRbacScope(server) ?? sectionRbac),
        })),
      },
    ],
  };

  return content;
}
