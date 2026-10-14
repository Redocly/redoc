import type { AsyncApiDefinition, AsyncApiServer } from '../../../types/asyncapi.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { type BrokersNode } from '../../../types/content.js';
import type { BrokerData } from '../../../types/asyncapi.js';
import { panelKind } from '../../../types/common.js';
import { componentLabelsByProtocol } from '../utils/get-protocol-labels.js';
import { resolveServerVariables } from '../utils/resolve-server-variables.js';
import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { readRbacScope, rbacProp, splitRbacSection } from '../../rbac.js';
import { buildSecurityRequirements } from '../utils/security.js';
import { asyncApiContext } from '../buildContext.js';
import { resolveInDoc } from '../utils/resolveInDoc.js';

export function buildBrokersPanelContent(
  servers: Record<string, AsyncApiServer>,
  protocol: string | null,
  markdownOptions: ParseMarkdownOptions,
  document: AsyncApiDefinition,
): BrokersNode {
  const panelLabel = componentLabelsByProtocol({ protocol }).servers;
  const { sectionRbac, entries } = splitRbacSection(servers);

  const content: BrokersNode = {
    title: panelLabel,
    children: [
      {
        kind: panelKind.BROKERS,
        panelLabel,
        brokers: entries.map(([name, entry]) =>
          toBrokerData(name, entry, document, markdownOptions, sectionRbac),
        ),
      },
    ],
  };

  return content;
}

/** Maps a `servers` entry, given inline or as a `$ref`, to the broker the servers panels render. */
export function toBrokerData(
  name: string,
  entry: AsyncApiServer,
  document: AsyncApiDefinition,
  markdownOptions: ParseMarkdownOptions,
  sectionRbac?: Record<string, string>,
): BrokerData {
  const server = resolveInDoc<AsyncApiServer>(document, entry) ?? entry;
  const security = server.security?.length
    ? buildSecurityRequirements(
        server.security,
        asyncApiContext.get().storeCtx,
        document,
        markdownOptions,
      )
    : [];
  return {
    name,
    url: server.host,
    description: parseMarkdown(server.description, markdownOptions) ?? [],
    variables: resolveServerVariables(document, server.variables),
    protocol: server.protocol,
    protocolVersion: server.protocolVersion,
    pathname: server.pathname,
    title: server.title,
    summary: server.summary,
    tags: server.tags,
    externalDocs: server.externalDocs,
    bindings: server.bindings,
    security: security.length > 0 ? security : undefined,
    ...rbacProp(readRbacScope(entry) ?? readRbacScope(server) ?? sectionRbac),
  };
}
