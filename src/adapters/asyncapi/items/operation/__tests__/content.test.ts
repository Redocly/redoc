import { describe, it, expect } from 'vitest';

import type { ApiDocsOptions } from '../../../../../types/options.js';
import type {
  ContainerNode,
  ExternalDocsNode,
  HeaderNode,
  MessageLinksNode,
  OperationBindingNode,
  SecurityNode,
} from '../../../../../types/content.js';
import type {
  AsyncApiDefinition,
  AsyncApiOperation,
  AsyncApiBuildContext,
} from '../../../../../types/asyncapi.js';

import { nodeTypes } from '../../../../../types/common.js';
import { createStoreContext } from '../../../../helpers.js';
import { asyncApiContext } from '../../../buildContext.js';
import { buildOperationContent } from '../content.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

const minimalDocument: AsyncApiDefinition = {
  asyncapi: '3.0.0',
  info: { title: 'Test', version: '1.0' },
  channels: {},
} as AsyncApiDefinition;

const TEST_OPTIONS = { markdownParser: markdocParser } as ApiDocsOptions;

function makeOperation(overrides: Partial<AsyncApiOperation> = {}): AsyncApiOperation {
  return {
    action: 'send',
    channel: undefined,
    title: 'testOp',
    ...overrides,
  } as AsyncApiOperation;
}

function firstContainer(content: ReturnType<typeof buildOperationContent>): ContainerNode {
  return content.children[0] as ContainerNode;
}

function findMessageLinksNode(
  content: ReturnType<typeof buildOperationContent>,
): MessageLinksNode | undefined {
  const children = firstContainer(content).children;
  return children.find((n): n is MessageLinksNode => n.nodeType === nodeTypes.MESSAGE_LINKS);
}

function withBuildContext<T>(
  document: AsyncApiDefinition,
  fn: () => T,
  overrides: Partial<AsyncApiBuildContext> = {},
): T {
  const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);
  const ctx = {
    document,
    options: { markdownParser: markdocParser } as ApiDocsOptions,
    basePath: '/asyncapi',
    storeCtx,
    protocol: 'kafka' as const,
    channelToOperations: {},
    groups: {},
    items: [],
    descriptionItems: [],
    channelSummaries: new Map(),
    ...overrides,
  } as unknown as AsyncApiBuildContext;
  return asyncApiContext.run(ctx, fn);
}

describe('buildOperationContent (AsyncAPI operation)', () => {
  describe('messageLinks resolution', () => {
    it('uses inline message.title as label and slugifies title into messageKey when no name is present', () => {
      const op = makeOperation({
        messages: [{ title: 'Request Ride' } as never],
      });

      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          op,
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)).toEqual({
        nodeType: nodeTypes.MESSAGE_LINKS,
        channelLink: '/topics/rides',
        messages: [{ name: 'Request-Ride', label: 'Request Ride' }],
      });
    });

    it('decodes escaped channel and message names in message refs', () => {
      const messageRef = '#/channels/user~1signedup/messages/user~1signedup.send.message';
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {
          'user/signedup': {
            address: 'user/signedup',
            messages: { 'user/signedup.send.message': { payload: { type: 'string' } } },
          },
        },
      } as unknown as AsyncApiDefinition;
      const op = makeOperation({
        channel: { $ref: '#/channels/user~1signedup' } as never,
        messages: [{ $ref: messageRef } as never],
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'user/signedup.send',
          op,
          document,
          '/asyncapi/channels/user-signedup/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)?.messages).toEqual([
        { name: 'user/signedup.send.message', label: 'user/signedup.send.message' },
      ]);
    });

    it('links the channel message the operation ref names, not one whose ref ends the same', () => {
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {
          c: {
            address: 'c',
            messages: {
              a: { $ref: '#/components/messages/X' },
              b: { $ref: '#/components/messages/a' },
            },
          },
        },
        components: { messages: { X: { title: 'X' }, a: { title: 'A' } } },
      } as unknown as AsyncApiDefinition;
      const op = makeOperation({
        channel: { $ref: '#/channels/c' } as never,
        messages: [{ $ref: '#/channels/c/messages/a' } as never],
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op',
          op,
          document,
          '/asyncapi/channels/c/operations/op',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)?.messages?.map((m) => m.name)).toEqual(['a']);
    });

    it('chases nested $ref chains (4 hops)', () => {
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {},
        components: {
          messages: {
            target: { title: 'Resolved', name: 'target' },
            hop3: { $ref: '#/components/messages/target' },
            hop2: { $ref: '#/components/messages/hop3' },
            hop1: { $ref: '#/components/messages/hop2' },
          },
        },
      } as unknown as AsyncApiDefinition;

      const op = makeOperation({
        messages: [{ $ref: '#/components/messages/hop1' } as never],
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)?.messages).toEqual([
        { name: 'hop1', label: 'Resolved' },
      ]);
    });

    it('matches an inline message back to a channel message by shared payload $ref', () => {
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {
          rides: {
            address: '/rides',
            messages: {
              channelRequestRide: {
                title: 'Channel Request Ride',
                payload: { $ref: '#/components/schemas/RideRequest' },
              },
            },
          },
        },
        components: {
          schemas: {
            RideRequest: { type: 'object' },
          },
        },
      } as unknown as AsyncApiDefinition;

      const op = makeOperation({
        channel: { $ref: '#/channels/rides' } as never,
        messages: [{ payload: { $ref: '#/components/schemas/RideRequest' } } as never],
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)?.messages).toEqual([
        { name: 'channelRequestRide', label: 'channelRequestRide' },
      ]);
    });

    it('resolves a dereferenced message to the correct channel key by title, not the first message', () => {
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {
          analytics: {
            address: 'analytics',
            messages: {
              apiKeyCreatedMessage: { title: 'API Key Created Message' },
              aiSearchCompletedMessage: { title: 'AI search completed message' },
            },
          },
        },
      } as unknown as AsyncApiDefinition;

      const op = makeOperation({
        channel: { $ref: '#/channels/analytics' } as never,
        messages: [{ title: 'AI search completed message' } as never],
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/exchs/analytics/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)?.messages).toEqual([
        { name: 'aiSearchCompletedMessage', label: 'AI search completed message' },
      ]);
    });

    it('omits a message entry when no key can be resolved (no $ref, no name, no title, no payload match)', () => {
      const op = makeOperation({
        messages: [{ description: 'no key, no name' } as never],
      });

      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          op,
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findMessageLinksNode(content)).toBeUndefined();
    });

    it('emits channelLink relative to the spec basePath (everything before /operations/, basePath stripped)', () => {
      const op = makeOperation({
        messages: [{ name: 'requestRide' } as never],
      });

      const content = withBuildContext(
        minimalDocument,
        () =>
          buildOperationContent(
            'op1',
            op,
            minimalDocument,
            '/docs/asyncapi/rides/topics/ride-requests/operations/op1',
            TEST_OPTIONS,
          ),
        { basePath: '/docs/asyncapi' },
      );

      expect(findMessageLinksNode(content)?.channelLink).toBe('/rides/topics/ride-requests');
    });

    it('normalizes channelLink to lowercase for camelCase channel slugs', () => {
      const op = makeOperation({
        messages: [{ name: 'paymentRequested' } as never],
      });

      const content = withBuildContext(
        minimalDocument,
        () =>
          buildOperationContent(
            'op1',
            op,
            minimalDocument,
            '/asyncapi/schema/payments/topics/paymentsProcessing/operations/publishPayment',
            TEST_OPTIONS,
          ),
        { basePath: '/asyncapi/schema' },
      );

      expect(findMessageLinksNode(content)?.channelLink).toBe(
        '/payments/topics/paymentsprocessing',
      );
    });
  });

  describe('operation bindings (Kafka groupId/clientId schema registration)', () => {
    it('registers groupId and clientId schemas independently, each wrapped under its own property name', () => {
      const document = { ...minimalDocument } as AsyncApiDefinition;
      const op = makeOperation({
        bindings: {
          kafka: {
            groupId: { type: 'string', enum: ['ride-request-producer'] },
            clientId: { type: 'string', enum: ['passenger-app'] },
          },
        } as never,
      });

      const { content, storeCtx } = withBuildContext(document, () => {
        const storeCtx = asyncApiContext.get().storeCtx;
        const content = buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        );
        return { content, storeCtx };
      });

      const [panel] = firstContainer(content).panels as OperationBindingNode[];
      const item = panel.children[0];
      expect(item.kind).toBe('operation-binding');
      expect(item.groupIdSchemaId).toBeDefined();
      expect(item.clientIdSchemaId).toBeDefined();
      expect(storeCtx.schemaStore[item.groupIdSchemaId as string].data).toEqual({
        type: 'object',
        properties: { groupId: { type: 'string', enum: ['ride-request-producer'] } },
      });
      expect(storeCtx.schemaStore[item.clientIdSchemaId as string].data).toEqual({
        type: 'object',
        properties: { clientId: { type: 'string', enum: ['passenger-app'] } },
      });
    });

    it('emits the binding panel but no group/clientId schemas for non-kafka bindings', () => {
      const document = { ...minimalDocument } as AsyncApiDefinition;
      const op = makeOperation({
        bindings: { http: { method: 'POST' } } as never,
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      const [panel] = firstContainer(content).panels as OperationBindingNode[];
      const item = panel.children[0];
      expect(item.bindingKey).toBe('http');
      expect(item.bindingValue).toEqual({ method: 'POST' });
      expect(item.groupIdSchemaId).toBeUndefined();
      expect(item.clientIdSchemaId).toBeUndefined();
    });

    it('skips schema registration when kafka.groupId is a scalar rather than an object', () => {
      const document = { ...minimalDocument } as AsyncApiDefinition;
      const op = makeOperation({
        bindings: {
          kafka: {
            groupId: 'static-group' as unknown as object,
          },
        } as never,
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      const [panel] = firstContainer(content).panels as OperationBindingNode[];
      const item = panel.children[0];
      expect(item.groupIdSchemaId).toBeUndefined();
      expect(item.bindingValue).toEqual({ groupId: 'static-group' });
    });

    it('unwraps a multi-format groupId schema ({ schemaFormat, schema }) instead of storing the wrapper', () => {
      const document = { ...minimalDocument } as AsyncApiDefinition;
      const op = makeOperation({
        bindings: {
          kafka: {
            groupId: {
              schemaFormat: 'application/vnd.aai.asyncapi+json;version=3.0.0',
              schema: { type: 'string', enum: ['ride-request-producer'] },
            },
          },
        } as never,
      });

      const { content, storeCtx } = withBuildContext(document, () => {
        const storeCtx = asyncApiContext.get().storeCtx;
        const content = buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        );
        return { content, storeCtx };
      });

      const [panel] = firstContainer(content).panels as OperationBindingNode[];
      const item = panel.children[0];
      expect(storeCtx.schemaStore[item.groupIdSchemaId as string].data).toEqual({
        type: 'object',
        properties: { groupId: { type: 'string', enum: ['ride-request-producer'] } },
      });
    });

    it('converts clientId schema to JSON Schema', () => {
      const document = { ...minimalDocument } as AsyncApiDefinition;
      const op = makeOperation({
        bindings: {
          kafka: {
            clientId: {
              schemaFormat: 'application/vnd.apache.avro',
              schema: {
                type: 'record',
                name: 'ClientId',
                fields: [{ name: 'id', type: 'string' }],
              },
            },
          },
        } as never,
      });

      const { content, storeCtx } = withBuildContext(document, () => {
        const storeCtx = asyncApiContext.get().storeCtx;
        const content = buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        );
        return { content, storeCtx };
      });

      const [panel] = firstContainer(content).panels as OperationBindingNode[];
      const item = panel.children[0];
      expect(storeCtx.schemaStore[item.clientIdSchemaId as string].data).toEqual({
        type: 'object',
        properties: {
          clientId: {
            type: 'object',
            title: 'ClientId',
            properties: { id: { type: 'string' } },
            required: ['id'],
            additionalProperties: false,
          },
        },
      });
    });
  });

  describe('reply', () => {
    it('labels reply messages referenced through a channel message $ref with their title', () => {
      const document = {
        asyncapi: '3.0.0',
        info: { title: 'T', version: '1.0' },
        channels: {
          orderReplies: {
            address: 'orders/replies',
            messages: { orderAccepted: { $ref: '#/components/messages/OrderAccepted' } },
          },
        },
        components: {
          messages: { OrderAccepted: { name: 'OrderAccepted', title: 'Order accepted' } },
        },
      } as unknown as AsyncApiDefinition;

      const op = makeOperation({
        reply: {
          channel: { $ref: '#/channels/orderReplies' },
          messages: [{ $ref: '#/channels/orderReplies/messages/orderAccepted' }],
        } as never,
      });

      const content = withBuildContext(document, () =>
        buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/orders/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(JSON.stringify(firstContainer(content).children)).toContain(
        'Messages: Order accepted',
      );
    });
  });

  describe('security', () => {
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'T', version: '1.0' },
      channels: {},
      components: {
        securitySchemes: {
          userPass: { type: 'userPassword', description: 'Broker user name and password.' },
        },
      },
    } as unknown as AsyncApiDefinition;

    function securityNode(op: AsyncApiOperation): {
      node?: SecurityNode;
      children: ReturnType<typeof firstContainer>['children'];
    } {
      const content = withBuildContext(document, () => {
        const { storeCtx } = asyncApiContext.get();
        storeCtx.securitySchemeStore.userPass = {
          id: 'userPass',
          type: 'userPassword',
          description: 'Broker user name and password.',
        };
        return buildOperationContent(
          'op1',
          op,
          document,
          '/asyncapi/topics/orders/operations/op1',
          TEST_OPTIONS,
        );
      });
      const children = firstContainer(content).children;
      return {
        node: children.find((n): n is SecurityNode => n.nodeType === nodeTypes.SECURITY),
        children,
      };
    }

    it('emits a security node with one requirement per scheme, after the external docs', () => {
      const { node, children } = securityNode(
        makeOperation({
          externalDocs: { url: 'https://docs.example.com' },
          security: [{ $ref: '#/components/securitySchemes/userPass' }],
        }),
      );

      expect(node?.requirements).toEqual([
        {
          schemes: [
            {
              name: 'userPass',
              type: 'userPassword',
              description: 'Broker user name and password.',
            },
          ],
        },
      ]);
      expect(children.findIndex((n) => n.nodeType === nodeTypes.SECURITY)).toBe(
        children.findIndex((n) => n.nodeType === nodeTypes.EXTERNAL_DOCS) + 1,
      );
    });

    it('emits one requirement per requirement object, keeping each scheme and its scopes', () => {
      const { node } = securityNode(
        makeOperation({ security: [{ userPass: ['read'], certs: [] }, { userPass: [] }] }),
      );

      expect(node?.requirements.map(({ schemes }) => schemes.map((s) => s.scopes))).toEqual([
        [['read']],
        [undefined],
      ]);
    });

    it('omits the security node when the operation has no security', () => {
      expect(securityNode(makeOperation()).node).toBeUndefined();
    });
  });

  describe('externalDocs', () => {
    function findExternalDocsNode(
      content: ReturnType<typeof buildOperationContent>,
    ): ExternalDocsNode | undefined {
      const children = firstContainer(content).children;
      return children.find((n): n is ExternalDocsNode => n.nodeType === nodeTypes.EXTERNAL_DOCS);
    }

    it('emits an external-docs node after the description when operation.externalDocs is set', () => {
      const op = makeOperation({
        description: 'Op description',
        externalDocs: { url: 'https://docs.example.com', description: 'Read the guide' },
      });

      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          op,
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      const children = firstContainer(content).children;
      const externalDocs = findExternalDocsNode(content);
      expect(externalDocs?.url).toBe('https://docs.example.com');
      expect(externalDocs?.description).toBeDefined();
      expect(children.findIndex((n) => n.nodeType === nodeTypes.EXTERNAL_DOCS)).toBeGreaterThan(
        children.findIndex((n) => n.nodeType === nodeTypes.MARKDOC),
      );
    });

    it('omits the external-docs node when operation has no externalDocs', () => {
      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          makeOperation(),
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findExternalDocsNode(content)).toBeUndefined();
    });

    it('omits the external-docs node when externalDocs has no url', () => {
      const op = makeOperation({
        externalDocs: { description: 'No url' } as never,
      });

      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          op,
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      expect(findExternalDocsNode(content)).toBeUndefined();
    });
  });

  describe('page actions', () => {
    it('sets showPageActions on the operation header', () => {
      const content = withBuildContext(minimalDocument, () =>
        buildOperationContent(
          'op1',
          makeOperation(),
          minimalDocument,
          '/asyncapi/topics/rides/operations/op1',
          TEST_OPTIONS,
        ),
      );

      const header = firstContainer(content).children.find(
        (n): n is HeaderNode => n.nodeType === nodeTypes.HEADER && n.level === 5,
      );
      expect(header?.label).toBe('testOp');
      expect(header?.showPageActions).toBe(true);
    });
  });
});
