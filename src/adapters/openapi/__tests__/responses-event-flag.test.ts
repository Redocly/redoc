import { describe, it, expect } from 'vitest';

import type { ContentNode, ItemContentNode } from '../../../types/content.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { collectAllItems } from '../../__tests__/utils.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { nodeTypes } from '../../../types/common.js';

const options = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  markdownParser: markdocParser,
};

function collectContentNodes(nodes: ContentNode[] = []): ContentNode[] {
  return nodes.flatMap((node) => [
    node,
    ...collectContentNodes((node as { children?: ContentNode[] }).children),
  ]);
}

describe('openapi adapter responses isEvent flag', () => {
  it('sets isEvent: true on callback and webhook responses nodes, but not regular operations', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/orders': {
          post: {
            operationId: 'createOrder',
            responses: { '201': { description: 'created' } },
            callbacks: {
              onOrderStatus: {
                '{$request.body#/callbackUrl}': {
                  post: {
                    summary: 'Order status callback',
                    responses: { '200': { description: 'ack' } },
                  },
                },
              },
            },
          },
        },
      },
      webhooks: {
        orderUpdated: {
          post: {
            operationId: 'notifyOrderUpdated',
            responses: { '200': { description: 'received' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const allItems = collectAllItems(items);
    const operationItem = allItems.find((item) => item.label === 'createOrder');
    const webhookItem = allItems.find((item) => item.label === 'notifyOrderUpdated');

    expect(operationItem).toBeDefined();
    expect(webhookItem).toBeDefined();

    const opNodes = collectContentNodes(operationItem?.content?.children);
    const regularResponses = opNodes.find(
      (node): node is ItemContentNode =>
        node.nodeType === nodeTypes.ITEM && node.variant === 'responses',
    );
    const callbackNode = opNodes.find(
      (node): node is ItemContentNode =>
        node.nodeType === nodeTypes.ITEM && node.variant === 'callback',
    );
    const callbackResponses = callbackNode?.callback?.contentChildren?.find(
      (node): node is ItemContentNode =>
        node.nodeType === nodeTypes.ITEM && node.variant === 'responses',
    );

    expect(regularResponses).toBeDefined();
    expect(regularResponses?.isEvent).toBeUndefined();

    expect(callbackResponses).toBeDefined();
    expect(callbackResponses?.isEvent).toBe(true);

    const webhookNodes = collectContentNodes(webhookItem?.content?.children);
    const webhookResponses = webhookNodes.find(
      (node): node is ItemContentNode =>
        node.nodeType === nodeTypes.ITEM && node.variant === 'responses',
    );

    expect(webhookResponses).toBeDefined();
    expect(webhookResponses?.isEvent).toBe(true);
  });
});
