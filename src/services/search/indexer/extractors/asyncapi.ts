import { hasRbacScope } from '../../../../adapters/rbac.js';

import type {
  BrokersPanelItem,
  ChannelAddressNode,
  ContainerNode,
  ContentNode,
  ItemContentNode,
  MessageBindingPanelItem,
} from '../../../../types/content.js';
import type { ExtractContext, Extractor } from './context.js';

import { nodeTypes, panelKind } from '../../../../types/common.js';
import { buildAsyncApiSuffix, makeDeepLink } from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import {
  MESSAGE_BINDINGS_PLACE,
  MESSAGE_HEADERS_PLACE,
  MESSAGE_PAYLOAD_PLACE,
  MESSAGE_PLACE,
  SERVER_PLACE,
} from '../places.js';
import { addRow, describe } from './context.js';
import { extractServerVariableRows } from './panels.js';

type Message = NonNullable<ItemContentNode['messages']>[number];

export const messagesExtractor: Extractor = {
  matches: (node) => !!node.messages?.length,
  extract(node, ctx) {
    if (!ctx.hasSchemas) return;
    for (const message of node.messages ?? []) {
      if (hasRbacScope(message)) continue;
      extractMessageFields(message, ctx);
    }
  },
};

function extractMessageFields(message: Message, ctx: ExtractContext): void {
  addRow(
    ctx,
    makeParam({
      name: message.name,
      description: [describe(ctx, message.description), message.summary].filter(Boolean).join(' '),
      place: MESSAGE_PLACE,
      type: 'unknown',
      deepLink: ctx.slug
        ? makeDeepLink(
            ctx.slug,
            buildAsyncApiSuffix({ section: 'messages', messageKey: message.name }),
          )
        : undefined,
    }),
  );

  const scope = { ...ctx.scope, messageKey: message.name };
  const msgVisited = new Set<string>();
  if (message.schemaId) {
    ctx.walker.extractSchemaFields(
      {
        schemaId: message.schemaId,
        place: MESSAGE_PAYLOAD_PLACE,
        paramsMap: ctx.paramsMap,
        slug: ctx.slug,
        mediaType: message.contentType,
        visited: msgVisited,
      },
      scope,
    );
  }
  if (message.headerSchemaId) {
    ctx.walker.extractSchemaFields(
      {
        schemaId: message.headerSchemaId,
        place: MESSAGE_HEADERS_PLACE,
        paramsMap: ctx.paramsMap,
        slug: ctx.slug,
        visited: msgVisited,
      },
      scope,
    );
  }
}

export function extractMessageBindingFields(container: ContainerNode, ctx: ExtractContext): void {
  if (!ctx.hasSchemas) return;
  for (const panel of container.panels ?? []) {
    for (const child of panel.children ?? []) {
      if (child.kind !== panelKind.MESSAGE_BINDING) continue;
      const bindings = (child as MessageBindingPanelItem).bindingsByMessageKey ?? {};
      for (const [messageKey, binding] of Object.entries(bindings)) {
        if (!binding?.keySchemaId) continue;
        ctx.walker.extractSchemaFields(
          {
            schemaId: binding.keySchemaId,
            place: MESSAGE_BINDINGS_PLACE,
            paramsMap: ctx.paramsMap,
            slug: ctx.slug,
            visited: new Set<string>(),
          },
          { ...ctx.scope, messageKey },
        );
      }
    }
  }
}

/** The channel address, rendered under the channel title; sits inside the page container. */
export function extractChannelAddress(children: ContentNode[]): string | undefined {
  for (const node of children) {
    if (node.nodeType === nodeTypes.CHANNEL_ADDRESS) return (node as ChannelAddressNode).address;
    if (node.nodeType === nodeTypes.CONTAINER) {
      const address = extractChannelAddress((node as ContainerNode).children);
      if (address) return address;
    }
  }
  return undefined;
}

/** One row per server (broker) the page lists: name, host, title, summary and description. */
export function extractServerFields(container: ContainerNode, ctx: ExtractContext): void {
  for (const panel of container.panels ?? []) {
    for (const child of panel.children ?? []) {
      if (child.kind !== panelKind.BROKERS) continue;
      for (const broker of (child as BrokersPanelItem).brokers) {
        if (hasRbacScope(broker) || !broker.name) continue;
        addRow(
          ctx,
          makeParam({
            name: broker.name,
            description: [
              broker.url,
              broker.title,
              broker.summary,
              describe(ctx, broker.description),
            ]
              .filter(Boolean)
              .join(' '),
            place: SERVER_PLACE,
            type: 'unknown',
          }),
        );
        extractServerVariableRows(broker.variables, ctx);
      }
    }
  }
}
