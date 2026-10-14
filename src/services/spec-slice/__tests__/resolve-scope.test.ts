import { describe, expect, it } from 'vitest';

import { resolveSpecSliceScope } from '../resolve-scope.js';
import { contentType, itemVariant } from '../../../types/common.js';

import type { ApiItemContent } from '../../../types/store.js';

function content(partial: Partial<ApiItemContent>): ApiItemContent {
  return { contentType: contentType.ITEM, children: [], ...partial } as ApiItemContent;
}

describe('resolveSpecSliceScope', () => {
  it('maps overview pages to the whole document', () => {
    expect(
      resolveSpecSliceScope('openapi', content({ contentType: contentType.OVERVIEW }), 'API'),
    ).toEqual({ kind: 'document' });
  });

  it('maps OpenAPI groups by raw tag name, not the label', () => {
    const groupContent = content({
      contentType: contentType.GROUP,
      meta: { name: 'pet-store' },
    });
    expect(resolveSpecSliceScope('openapi', groupContent, 'Pet Store 🐾')).toEqual({
      kind: 'tag',
      tagName: 'pet-store',
    });
  });

  it('maps operations via pointer and re-roots webhooks', () => {
    const operationContent = content({
      itemVariant: itemVariant.HTTP_ITEM,
      meta: { pointer: '/paths/~1pets/get', isWebhook: false },
    });
    expect(resolveSpecSliceScope('openapi', operationContent, undefined)).toEqual({
      kind: 'operation',
      pathName: '/pets',
      httpVerb: 'get',
      source: 'paths',
    });

    const webhookContent = content({
      itemVariant: itemVariant.HTTP_ITEM,
      meta: { pointer: '/paths/newPet/post', isWebhook: true },
    });
    expect(resolveSpecSliceScope('openapi', webhookContent, undefined)).toEqual({
      kind: 'operation',
      pathName: 'newPet',
      httpVerb: 'post',
      source: 'webhooks',
    });
  });

  it('maps schema pages by name and excludes MCP pages (no itemVariant)', () => {
    expect(
      resolveSpecSliceScope(
        'openapi',
        content({ itemVariant: itemVariant.SCHEMA, meta: { name: 'Pet' } }),
        undefined,
      ),
    ).toEqual({ kind: 'schema', name: 'Pet' });

    expect(
      resolveSpecSliceScope('openapi', content({ meta: { name: 'createPet' } }), undefined),
    ).toBeUndefined();
  });

  it('maps AsyncAPI groups by label and channels/operations by pointer', () => {
    expect(
      resolveSpecSliceScope('asyncapi', content({ contentType: contentType.GROUP }), 'lights'),
    ).toEqual({ kind: 'tag', tagName: 'lights' });

    expect(
      resolveSpecSliceScope(
        'asyncapi',
        content({ itemVariant: itemVariant.CHANNEL, meta: { pointer: '/channels/lighting' } }),
        undefined,
      ),
    ).toEqual({ kind: 'channel', channelId: 'lighting' });

    expect(
      resolveSpecSliceScope(
        'asyncapi',
        content({
          itemVariant: itemVariant.CHANNEL_OPERATION,
          meta: { pointer: '/operations/receiveLight' },
        }),
        undefined,
      ),
    ).toEqual({ kind: 'async-operation', operationId: 'receiveLight' });
  });

  it('maps GraphQL operations by root field name and variant', () => {
    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.QUERY, meta: { name: 'menu' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-operation', operationType: 'query', name: 'menu' });

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.MUTATION, meta: { name: 'placeOrder' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-operation', operationType: 'mutation', name: 'placeOrder' });

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.SUBSCRIPTION, meta: { name: 'orderUpdated' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-operation', operationType: 'subscription', name: 'orderUpdated' });
  });

  it('maps GraphQL type and directive pages by name', () => {
    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.OBJECT, meta: { name: 'MenuItem' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-type', name: 'MenuItem' });

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.UNION, meta: { name: 'SearchResult' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-type', name: 'SearchResult' });

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.DIRECTIVE, meta: { name: 'auth' } }),
        undefined,
      ),
    ).toEqual({ kind: 'graphql-directive', name: 'auth' });
  });

  it('maps GraphQL groups to a member-scope list with dedupe and label', () => {
    const members = [
      content({ itemVariant: itemVariant.QUERY, meta: { name: 'menu' } }),
      content({ itemVariant: itemVariant.QUERY, meta: { name: 'menu' } }),
      content({ itemVariant: itemVariant.OBJECT, meta: { name: 'MenuItem' } }),
      content({ itemVariant: itemVariant.SCALAR, meta: { name: 'String' } }),
      content({ contentType: contentType.GROUP }),
    ];

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ contentType: contentType.GROUP }),
        'Queries',
        members,
      ),
    ).toEqual({
      kind: 'graphql-group',
      label: 'Queries',
      members: [
        { kind: 'graphql-operation', operationType: 'query', name: 'menu' },
        { kind: 'graphql-type', name: 'MenuItem' },
      ],
    });
  });

  it('hides GraphQL groups without resolvable members', () => {
    expect(
      resolveSpecSliceScope('graphql', content({ contentType: contentType.GROUP }), 'Queries', []),
    ).toBeUndefined();
    expect(
      resolveSpecSliceScope('graphql', content({ contentType: contentType.GROUP }), 'Scalars', [
        content({ itemVariant: itemVariant.SCALAR, meta: { name: 'String' } }),
      ]),
    ).toBeUndefined();
  });

  it('hides GraphQL built-ins, groups, and items without a name', () => {
    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.SCALAR, meta: { name: 'String' } }),
        undefined,
      ),
    ).toBeUndefined();

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.DIRECTIVE, meta: { name: 'deprecated' } }),
        undefined,
      ),
    ).toBeUndefined();

    expect(
      resolveSpecSliceScope('graphql', content({ contentType: contentType.GROUP }), 'Queries'),
    ).toBeUndefined();

    expect(
      resolveSpecSliceScope(
        'graphql',
        content({ itemVariant: itemVariant.QUERY, meta: { pointer: '/x' } }),
        undefined,
      ),
    ).toBeUndefined();
  });

  it('returns undefined for null content', () => {
    expect(resolveSpecSliceScope('openapi', null, undefined)).toBeUndefined();
  });
});
