import type {
  ContentNode,
  PanelNode,
  ApiItemContent,
  ItemContentNode,
  ParameterData,
  MessageBindingData,
  MessageReferencesGroups,
  MessageChannelReference,
} from '../../../../types/content.js';
import type {
  AsyncApiChannel,
  AsyncApiDefinition,
  AsyncApiMessage,
  AsyncApiParameter,
  AsyncApiServer,
  ProtocolVariant,
} from '../../../../types/asyncapi.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { combineUrls } from '@redocly/theme/core/openapi';

import { asString, safeSlugify } from '../../../../utils/string.js';
import { normalizePath } from '../../../../utils/url.js';
import { JsonPointer } from '../../../openapi/utils/JsonPointer.js';
import {
  contentType,
  itemVariant,
  nodeTypes,
  panelKind,
  schemaKind,
} from '../../../../types/common.js';
import { registerSchema, registerExample } from '../../../helpers.js';
import {
  readRbacScope,
  rbacProp,
  hasRbacScope,
  splitRbacSection,
  type RbacProp,
} from '../../../rbac.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import {
  componentLabelsByProtocol,
  itemLabelsByProtocol,
} from '../../utils/get-protocol-labels.js';
import { resolveInDoc } from '../../utils/resolveInDoc.js';
import { getServerHost } from '../../utils/get-server-host.js';
import { resolveAsyncApiSchema } from '../../utils/resolve-schema.js';
import { getChannelLabel } from '../../utils/get-channel-label.js';
import { asyncApiContext } from '../../buildContext.js';

export function buildMessageReferencesGroups(
  document: AsyncApiDefinition,
  messageKey: string,
  protocol: ProtocolVariant | null | undefined,
): MessageReferencesGroups {
  const groups: MessageReferencesGroups = { exchanges: [], queues: [] };
  if (!document.channels) return groups;

  for (const [channelKey, refChannel] of Object.entries(document.channels)) {
    if (!refChannel?.messages?.[messageKey]) continue;

    const refLabels = itemLabelsByProtocol(protocol ?? null, refChannel.bindings);
    const protocolSlug = `${refLabels.channel}s`;
    const tagName = refChannel.tags?.map((tag) => asString(tag?.name)).find(Boolean);
    const tagSlug = tagName ? safeSlugify(tagName).toLowerCase() : undefined;
    const link = normalizePath(
      tagSlug
        ? combineUrls(tagSlug, protocolSlug, channelKey).toLowerCase()
        : combineUrls(protocolSlug, channelKey).toLowerCase(),
    );

    const reference: MessageChannelReference = {
      key: channelKey,
      label: getChannelLabel(refChannel, channelKey),
      link,
    };

    if (refChannel.bindings?.amqp?.is === 'routingKey') {
      groups.exchanges.push(reference);
    } else {
      groups.queues.push(reference);
    }
  }

  return groups;
}

export function buildChannelContent(
  channelId: string,
  channel: AsyncApiChannel,
  document: AsyncApiDefinition,
  markdownOptions: ParseMarkdownOptions,
  protocol?: ProtocolVariant | null,
): ApiItemContent {
  const { storeCtx } = asyncApiContext.get();
  const children: ContentNode[] = [];
  const channelTitle = getChannelLabel(channel, channelId);
  const labels = componentLabelsByProtocol({
    protocol: protocol ?? null,
    channelBindings: channel.bindings,
  });

  const channelChildren: ContentNode[] = [
    {
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: channelTitle,
      badges: channel['x-badges'],
      showPageActions: true,
      protocolTag: {
        label: labels.channel,
        color: labels.channel.toLowerCase(),
      },
    },
  ];

  const address = asString(channel.address);
  if (address) {
    channelChildren.push({
      nodeType: nodeTypes.CHANNEL_ADDRESS,
      address,
    });
  }

  const summaryAst = parseMarkdown(channel.summary, markdownOptions);
  if (summaryAst) {
    channelChildren.push({ nodeType: nodeTypes.MARKDOC, content: summaryAst });
  }

  const description = parseMarkdown(channel.description, markdownOptions);
  if (description) {
    channelChildren.push({ nodeType: nodeTypes.MARKDOC, content: description });
  }

  const extDocs = channel.externalDocs;
  if (extDocs?.url) {
    channelChildren.push({
      nodeType: nodeTypes.EXTERNAL_DOCS,
      url: extDocs.url,
      description: parseMarkdown(extDocs.description, markdownOptions) ?? [],
    });
  }

  if (channel.parameters && Object.keys(channel.parameters).length > 0) {
    const { sectionRbac, entries: paramEntries } = splitRbacSection(channel.parameters);

    const params: ParameterData[] = paramEntries.map(([name, param]) => {
      const resolved = resolveInDoc<AsyncApiParameter>(document, param) ?? param;

      const paramSchema: Record<string, unknown> = { type: resolved.location || 'string' };
      if (resolved.enum) paramSchema.enum = resolved.enum;
      if (resolved.default !== undefined) paramSchema.default = resolved.default;
      if (resolved.description) paramSchema.description = resolved.description;
      if (resolved.examples?.length) paramSchema.examples = resolved.examples;

      const schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: paramSchema,
      });

      return {
        name,
        in: 'path' as const,
        schemaId,
        description: resolved.description,
        ...rbacProp(readRbacScope(resolved)),
      };
    });

    channelChildren.push(
      {
        nodeType: nodeTypes.HEADER,
        level: 4,
        label: 'Parameters',
        labelTranslationKey: 'parameters',
        deepLinkSuffix: 'parameters',
        ...rbacProp(sectionRbac),
      },
      {
        nodeType: nodeTypes.ITEM,
        variant: 'parameters',
        parameters: params,
        pointer: `channels/${channelId}/parameters`,
        ...rbacProp(sectionRbac),
      } as ItemContentNode,
    );
  }

  const channelPanels: PanelNode[] = [];

  if (document.servers && channel.servers) {
    const resolvedChannelServers = channel.servers
      .map((server) => resolveInDoc<AsyncApiServer>(document, server))
      .filter((server): server is AsyncApiServer => !!server && !!getServerHost(server));

    const { sectionRbac: serversSectionRbac, entries: serverEntries } = splitRbacSection(
      document.servers,
    );
    const filteredServers = serverEntries.filter(([, server]) =>
      resolvedChannelServers.some(
        (channelServer) => getServerHost(channelServer) === getServerHost(server),
      ),
    );

    if (filteredServers.length > 0) {
      channelPanels.push({
        children: [
          {
            kind: panelKind.BROKERS,
            panelLabel: labels.servers,
            brokers: filteredServers.map(([name, server]) => ({
              name,
              url: getServerHost(server),
              description: parseMarkdown(server.description, markdownOptions) ?? [],
              protocol: server.protocol,
              protocolVersion: server.protocolVersion,
              pathname: server.pathname,
              title: server.title,
              summary: server.summary,
              tags: server.tags,
              externalDocs: server.externalDocs,
              bindings: server.bindings,
              variables: server.variables,
              ...rbacProp(readRbacScope(server) ?? serversSectionRbac),
            })),
          },
        ],
      });
    }
  }

  if (channel.bindings) {
    const bindingEntries = Object.entries(channel.bindings);
    if (bindingEntries.length > 0) {
      const [bindingKey, bindingValue] = bindingEntries[0];
      channelPanels.push({
        title: labels.channelBinding,
        children: [
          {
            kind: panelKind.CHANNEL_BINDING,
            panelLabel: labels.channelBinding,
            bindingKey,
            bindingValue: bindingValue as Record<string, unknown>,
          },
        ],
      } as PanelNode);
    }
  }

  children.push({
    nodeType: nodeTypes.CONTAINER,
    children: channelChildren,
    panels: channelPanels.length > 0 ? channelPanels : undefined,
  });

  if (channel.messages && Object.keys(channel.messages).length > 0) {
    const { sectionRbac, entries: messageEntries } = splitRbacSection(channel.messages);

    const messageChildren: ContentNode[] = [
      {
        nodeType: nodeTypes.HEADER,
        level: 4,
        label: 'Messages',
        labelTranslationKey: 'messages',
        deepLinkSuffix: 'messages',
      },
    ];

    const bindingsByMessageKey: Record<string, MessageBindingData> = {};

    const messages = messageEntries.map(([name, rawMessage]) => {
      const message =
        resolveInDoc<AsyncApiMessage>(document, rawMessage) ?? (rawMessage as AsyncApiMessage);
      let schemaId: string | undefined;
      let headerSchemaId: string | undefined;
      const exampleIds: string[] = [];
      const rbac = readRbacScope(rawMessage) ?? readRbacScope(message);

      if (storeCtx && message.payload && typeof message.payload === 'object') {
        const resolvedPayload = resolveAsyncApiSchema(message.payload);
        if (resolvedPayload) {
          schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: resolvedPayload,
          });
        }
      }

      if (storeCtx && message.headers && typeof message.headers === 'object') {
        const resolvedHeaders = resolveAsyncApiSchema(message.headers);
        if (resolvedHeaders) {
          headerSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: resolvedHeaders,
          });
        }
      }

      if (storeCtx && message.examples && Array.isArray(message.examples)) {
        for (const example of message.examples) {
          if (example.payload) {
            const id = registerExample(storeCtx.exampleStore, {
              value: example.payload,
              summary: example.summary || example.name,
            });
            exampleIds.push(id);
          }
        }
      }

      if (storeCtx && message.bindings) {
        const bindingEntries = Object.entries(message.bindings);
        for (const [bindingKey, bindingValue] of bindingEntries) {
          if (!bindingValue || typeof bindingValue !== 'object') continue;

          let keySchemaId: string | undefined;
          if (bindingKey === 'kafka') {
            const kafkaKey = (bindingValue as { key?: unknown }).key;
            if (kafkaKey && typeof kafkaKey === 'object') {
              const key = resolveAsyncApiSchema(kafkaKey);
              keySchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
                kind: schemaKind.JSON_SCHEMA,
                data: {
                  type: 'object',
                  properties: { key },
                },
              });
            }
          }

          bindingsByMessageKey[name] = {
            bindingKey,
            bindingValue: bindingValue as Record<string, unknown>,
            keySchemaId,
            ...rbacProp(rbac),
          };
          break;
        }
      }

      const ext = message.externalDocs;
      const externalDocs = ext?.url
        ? {
            url: ext.url,
            description: parseMarkdown(ext.description, markdownOptions) ?? [],
          }
        : undefined;

      return {
        name,
        label: message.title || message.name || name,
        summary: typeof message.summary === 'string' ? message.summary : undefined,
        description: parseMarkdown(message.description, markdownOptions),
        contentType: message.contentType,
        schemaId,
        headerSchemaId,
        exampleIds: exampleIds.length > 0 ? exampleIds : undefined,
        payload: message.payload,
        payloadLabel: labels.payload,
        headers: message.headers,
        externalDocs,
        ...rbacProp(rbac),
      };
    });

    messageChildren.push({
      nodeType: nodeTypes.ITEM,
      variant: 'messages',
      messages,
      pointer: `channels/${channelId}/messages`,
    } as ItemContentNode);

    const visibleMessages = messages.filter((message) => !hasRbacScope(message));
    const allExampleIds = visibleMessages.flatMap((message) => message.exampleIds ?? []);
    const firstSchemaId = visibleMessages.find((message) => message.schemaId)?.schemaId;
    const hasAnyMessageSample = messages.some(
      (message) => message.schemaId || (message.exampleIds?.length ?? 0) > 0,
    );
    const messagesByKey: Record<string, { schemaId?: string; exampleIds?: string[] } & RbacProp> =
      {};
    for (const message of messages) {
      const rbac = readRbacScope(message);
      messagesByKey[message.name] = {
        schemaId: message.schemaId,
        exampleIds: message.exampleIds,
        ...rbacProp(rbac),
      };
    }
    const messagePanels: PanelNode[] = [];
    if (hasAnyMessageSample) {
      messagePanels.push({
        children: [
          {
            kind: panelKind.PAYLOAD,
            panelLabel: labels.payload,
            exampleIds: allExampleIds.length > 0 ? allExampleIds : undefined,
            schemaId: firstSchemaId,
            examples: allExampleIds.map(() => ({})),
            messagesByKey,
          },
        ],
      });
    }

    if (Object.keys(bindingsByMessageKey).length > 0) {
      messagePanels.push({
        title: 'Message configuration',
        children: [
          {
            kind: panelKind.MESSAGE_BINDING,
            bindingsByMessageKey,
          },
        ],
      });
    }

    if (protocol === 'amqp') {
      const referencesByMessageKey: Record<string, MessageReferencesGroups> = {};
      let hasAnyReference = false;
      for (const message of messages) {
        const groups = buildMessageReferencesGroups(document, message.name, protocol);
        if (groups.exchanges.length > 0 || groups.queues.length > 0) {
          referencesByMessageKey[message.name] = groups;
          hasAnyReference = true;
        }
      }
      if (hasAnyReference) {
        messagePanels.push({
          children: [
            {
              kind: panelKind.MESSAGE_REFERENCES,
              referencesByMessageKey,
            },
          ],
        });
      }
    }

    children.push({
      nodeType: nodeTypes.CONTAINER,
      children: messageChildren,
      panels: messagePanels.length > 0 ? messagePanels : undefined,
      ...rbacProp(sectionRbac),
    });
  }

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.CHANNEL,
    meta: {
      name: channelTitle,
      pointer: JsonPointer.compile(['channels', channelId]), // Source JSON pointer for WYSIWYG cursor sync.
      protocolTag: {
        label: labels.channel,
        color: labels.channel.toLowerCase(),
      },
    },
    seo: {
      title: channelTitle,
      description: asString(channel.description),
    },
    children,
  };
}
