import type { Node } from '@markdoc/markdoc';
import type { ContentNode, PanelNode, ApiItemContent } from '../../../../types/content.js';
import type {
  AsyncApiChannel,
  AsyncApiDefinition,
  AsyncApiMessage,
  AsyncApiOperation,
  ProtocolVariant,
} from '../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import {
  contentType,
  itemVariant,
  nodeTypes,
  panelKind,
  schemaKind,
} from '../../../../types/common.js';
import { registerSchema } from '../../../helpers.js';
import { parseMarkdown } from '../../../utils/parseMarkdown.js';
import { asString, safeSlugify } from '../../../../utils/string.js';
import { normalizePath, toRelativePath } from '../../../../utils/url.js';
import { JsonPointer } from '../../../openapi/utils/JsonPointer.js';
import { componentLabelsByProtocol } from '../../utils/get-protocol-labels.js';
import { resolveInDoc } from '../../utils/resolveInDoc.js';
import { resolveAsyncApiSchema } from '../../utils/resolve-schema.js';
import { asyncApiContext } from '../../buildContext.js';

export function buildOperationContent(
  operationId: string,
  operation: AsyncApiOperation,
  document: AsyncApiDefinition,
  pageSlug: string,
  options: ApiDocsOptions,
  protocol?: ProtocolVariant | null,
  groupHeaderLabel?: string,
  showDivider?: boolean,
): ApiItemContent {
  const { basePath } = asyncApiContext.get();
  const operationTitle = asString(operation.title) ?? asString(operation.summary) ?? operationId;
  const labels = componentLabelsByProtocol({ protocol: protocol ?? null });

  const actionLabel = operation.action === 'send' ? labels.sendLabel : labels.receiveLabel;
  const actionTag = operation.action === 'send' ? labels.send : labels.receive;

  const containerChildren: ContentNode[] = [];

  if (groupHeaderLabel) {
    containerChildren.push({
      nodeType: nodeTypes.HEADER,
      level: 4,
      label: groupHeaderLabel,
    });
  }

  containerChildren.push({
    nodeType: nodeTypes.HEADER,
    level: 5,
    label: operationTitle,
    badges: operation['x-badges'] || [],
    showPageActions: true,
    protocolTag: {
      label: actionTag,
      color: operation.action,
    },
  });

  const summary = parseMarkdown(
    typeof operation.summary === 'string' ? operation.summary : undefined,
    options,
  );

  if (summary) {
    containerChildren.push({
      nodeType: nodeTypes.MARKDOC,
      content: summary,
    });
  }

  const description = parseMarkdown(operation.description, options);

  if (description) {
    containerChildren.push({
      nodeType: nodeTypes.MARKDOC,
      content: description,
    });
  }

  const extDocs = operation.externalDocs;
  if (extDocs?.url) {
    containerChildren.push({
      nodeType: nodeTypes.EXTERNAL_DOCS,
      url: extDocs.url,
      description: parseMarkdown(extDocs.description, options) ?? [],
    });
  }

  const resolvedChannel = operation.channel
    ? resolveInDoc<AsyncApiChannel>(document, operation.channel)
    : undefined;
  const channelBindings = resolvedChannel?.bindings as Record<string, unknown> | undefined;

  if (operation.messages && operation.messages.length > 0) {
    const absoluteChannelLink = pageSlug.split('/operations/')[0].toLowerCase();
    const channelLink = normalizePath(toRelativePath(absoluteChannelLink, basePath));
    const channelMessages = resolvedChannel?.messages ?? {};
    const messageLinks = operation.messages
      .map((message) => {
        const ref = (message as { $ref?: string }).$ref;
        const refTail = typeof ref === 'string' ? ref.split('/messages/').pop() : undefined;
        let messageKey =
          Object.keys(channelMessages).find((key) => {
            const channelRefTail = (channelMessages[key] as { $ref?: string }).$ref
              ?.split('/messages/')
              .pop();
            return channelRefTail !== undefined && channelRefTail === refTail;
          }) ?? refTail;
        let current: AsyncApiMessage | undefined = message as AsyncApiMessage;
        for (let depth = 0; depth < 4 && (current as { $ref?: string })?.$ref; depth++) {
          current = resolveInDoc<AsyncApiMessage>(document, current);
        }
        const resolved = current ?? (message as AsyncApiMessage);

        if (!messageKey) {
          const inlinePayloadRef = (resolved.payload as { $ref?: string } | undefined)?.$ref;
          for (const [key, channelMessage] of Object.entries(channelMessages)) {
            const resolvedChannelMessage =
              resolveInDoc<AsyncApiMessage>(document, channelMessage) ?? channelMessage;
            const chPayloadRef = (resolvedChannelMessage.payload as { $ref?: string } | undefined)
              ?.$ref;
            if (
              (inlinePayloadRef && chPayloadRef && inlinePayloadRef === chPayloadRef) ||
              (resolved.title && resolvedChannelMessage.title === resolved.title)
            ) {
              messageKey = key;
              break;
            }
          }
        }

        const label = resolved.title || resolved.name || messageKey || 'Message';

        if (!messageKey) {
          const title = asString(resolved.title);
          messageKey = resolved.name || (title ? safeSlugify(title) : undefined);
        }

        return messageKey ? { name: messageKey, label } : undefined;
      })
      .filter((entry): entry is { name: string; label: string } => Boolean(entry));

    if (messageLinks.length > 0) {
      containerChildren.push({
        nodeType: nodeTypes.MESSAGE_LINKS,
        channelLink,
        messages: messageLinks,
      });
    }
  }

  if (operation.reply) {
    const replyParts: string[] = [];
    if (operation.reply.address?.location) {
      replyParts.push(`Address: \`${operation.reply.address.location}\``);
    }
    const replyChannel = resolveInDoc<AsyncApiChannel>(document, operation.reply.channel);
    if (replyChannel?.address) {
      replyParts.push(`${labels.channel}: \`${replyChannel.address}\``);
    }
    if (operation.reply.messages?.length) {
      const replyMessageNames = operation.reply.messages
        .map((message) => {
          const resolved = resolveInDoc<AsyncApiMessage>(document, message);
          return (
            resolved?.title ||
            resolved?.name ||
            (message as AsyncApiMessage).title ||
            (message as AsyncApiMessage).name ||
            'Message'
          );
        })
        .join(', ');
      replyParts.push(`Messages: ${replyMessageNames}`);
    }
    if (replyParts.length > 0) {
      containerChildren.push(
        {
          nodeType: nodeTypes.HEADER,
          level: 4,
          label: 'Reply',
          labelTranslationKey: 'reply',
          deepLinkSuffix: 'reply',
        },
        {
          nodeType: nodeTypes.MARKDOC,
          content: parseMarkdown(replyParts.join('\n\n'), options) ?? ([] as Node[]),
        },
      );
    }
  }

  const operationPanels: PanelNode[] = [];

  if (operation.bindings) {
    const bindingEntries = Object.entries(operation.bindings);
    if (bindingEntries.length > 0) {
      const [bindingKey, bindingValue] = bindingEntries[0];
      let groupIdSchemaId: string | undefined;
      let clientIdSchemaId: string | undefined;
      const storeCtx = asyncApiContext.get().storeCtx;

      if (storeCtx && bindingKey === 'kafka' && bindingValue && typeof bindingValue === 'object') {
        const kafkaBinding = bindingValue as { groupId?: unknown; clientId?: unknown };
        if (kafkaBinding.groupId && typeof kafkaBinding.groupId === 'object') {
          const groupId = resolveAsyncApiSchema(kafkaBinding.groupId);
          groupIdSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: {
              type: 'object',
              properties: { groupId },
            },
          });
        }
        if (kafkaBinding.clientId && typeof kafkaBinding.clientId === 'object') {
          const clientId = resolveAsyncApiSchema(kafkaBinding.clientId);
          clientIdSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: {
              type: 'object',
              properties: { clientId },
            },
          });
        }
      }

      operationPanels.push({
        title: 'Operation configuration',
        children: [
          {
            kind: panelKind.OPERATION_BINDING,
            bindingKey,
            bindingValue: bindingValue as Record<string, unknown>,
            groupIdSchemaId,
            clientIdSchemaId,
          },
        ],
      });
    }
  }

  const children: ContentNode[] = [
    {
      nodeType: nodeTypes.CONTAINER,
      children: containerChildren,
      panels: operationPanels.length > 0 ? operationPanels : undefined,
    },
  ];


  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.CHANNEL_OPERATION,
    meta: {
      name: operationTitle,
      pointer: JsonPointer.compile(['operations', operationId]), // JSON pointer for WYSIWYG cursor sync.
      protocolTag: {
        label: actionTag,
        color: operation.action,
      },
      action: operation.action,
      actionLabel,
      channelBindings,
    },
    seo: {
      title: operationTitle,
      description: asString(operation.description),
    },
    children,
    showDivider,
  };
}
