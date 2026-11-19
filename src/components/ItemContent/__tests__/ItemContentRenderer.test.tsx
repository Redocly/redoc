import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../types/content.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';
import type { Fixture } from '../../__tests__/harness.js';

import { nodeTypes } from '../../../types/common.js';
import {
  findNodes,
  graphqlFixture,
  openApiFixture,
  renderWithFixture,
} from '../../__tests__/harness.js';
import { ItemContentRenderer } from '../ItemContentRenderer.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

const document = {
  openapi: '3.0.3',
  info: { title: 'Users API', version: '1.0.0' },
  paths: {
    '/users/{userId}': {
      post: {
        operationId: 'updateUser',
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'limitParam', in: 'query', schema: { type: 'integer' } },
          { name: 'X-Trace-Id', in: 'header', schema: { type: 'string' } },
          { name: 'sessionToken', in: 'cookie', schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { nickname: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Updated' },
          '404': { description: 'Missing' },
        },
      },
    },
  },
} as unknown as OpenAPIDefinition;

const SDL = `
  directive @requiresScopes(scopes: [[String!]!]!) on OBJECT | FIELD_DEFINITION | ENUM_VALUE

  type Query {
    user(id: ID!): User @requiresScopes(scopes: [["read:user"]])
  }

  interface Node {
    nodeId: ID
  }

  type User implements Node {
    nodeId: ID
    fullName: String
  }
`;

let openApi: Fixture;
let gql: Fixture;

beforeAll(async () => {
  openApi = await openApiFixture(document);
  gql = graphqlFixture(SDL);
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  vi.restoreAllMocks();
});

function itemNode(fixture: Fixture, variant: string): ItemContentNode {
  const [node] = findNodes<ItemContentNode>(
    fixture.items,
    (n) => n.nodeType === nodeTypes.ITEM && n.variant === variant,
  );
  if (!node) throw new Error(`No ${variant} item node in the adapter output`);
  return node;
}

function renderNode(node: ItemContentNode, fixture: Fixture) {
  return renderWithFixture(<ItemContentRenderer node={node} />, fixture);
}

describe('ItemContentRenderer — OpenAPI sections', () => {
  it.each([
    ['path', 'userId'],
    ['query', 'limitParam'],
    ['headers', 'X-Trace-Id'],
    ['cookies', 'sessionToken'],
  ])('renders %s parameter rows', (variant, name) => {
    renderNode(itemNode(openApi, variant), openApi);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders the body schema', () => {
    renderNode(itemNode(openApi, 'body'), openApi);

    expect(screen.getByText('nickname')).toBeInTheDocument();
  });

  it('renders the body schema for querystring-body', () => {
    const node = { ...itemNode(openApi, 'body'), variant: 'querystring-body' } as ItemContentNode;
    renderNode(node, openApi);

    expect(screen.getByText('nickname')).toBeInTheDocument();
  });

  it('renders the first response', () => {
    renderNode(itemNode(openApi, 'responses'), openApi);

    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.queryByText('Missing')).not.toBeInTheDocument();
  });

  it('renders a section header for a labelled query but none for body or responses', () => {
    const query = itemNode(openApi, 'query');
    renderNode(query, openApi);
    expect(screen.getByRole('heading', { level: 5, name: query.label })).toBeInTheDocument();
    cleanup();

    for (const variant of ['body', 'responses']) {
      const { container } = renderNode(itemNode(openApi, variant), openApi);
      expect(container.querySelector('h5')).toBeNull();
      cleanup();
    }
  });

  it.each([
    ['cookies', 'request/cookie'],
    ['querystring-body', 'request/querystring'],
  ])('links the %s section header to a URL ending in %s', (variant, suffix) => {
    const base = itemNode(openApi, variant === 'cookies' ? 'cookies' : 'body');
    const node = { ...base, variant, label: 'Section label' } as ItemContentNode;
    const { container } = renderNode(node, openApi);

    const anchor = container.querySelector('[data-deep-link-anchor] a');
    expect(anchor?.getAttribute('href')).toMatch(new RegExp(`${suffix}$`));
  });

  it('renders the messages section', () => {
    const node = {
      nodeType: nodeTypes.ITEM,
      variant: 'messages',
      messages: [{ name: 'userSignedUp', label: 'UserSignedUp' }],
    } as ItemContentNode;
    renderNode(node, openApi);

    expect(screen.getByText('Accepts the following message:')).toBeInTheDocument();
  });

  it('renders the values section', () => {
    const node = {
      nodeType: nodeTypes.ITEM,
      variant: 'values',
      values: [{ name: 'ACTIVE' }, { name: 'BLOCKED' }],
    } as ItemContentNode;
    renderNode(node, openApi);

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
  });

  it('renders the callback section', () => {
    const node = {
      nodeType: nodeTypes.ITEM,
      variant: 'callback',
      callback: {
        httpVerb: 'post',
        pathName: '{$request.body#/callbackUrl}',
        summary: 'Job completed callback',
        callbackName: 'jobCompleted',
        callbackId: 'jobCompleted/post',
        contentChildren: [],
      },
    } as unknown as ItemContentNode;
    renderNode(node, openApi);

    expect(screen.getByText('Job completed callback')).toBeInTheDocument();
  });

  it('renders nothing for an unknown variant', () => {
    const node = { nodeType: nodeTypes.ITEM, variant: 'mystery' } as unknown as ItemContentNode;
    const { container } = renderNode(node, openApi);

    expect(container.querySelector('h5')).toBeNull();
    expect(container.textContent).toBe('');
  });
});

describe('ItemContentRenderer — GraphQL sections', () => {
  const graphqlNode = (variant: string, extra: Partial<ItemContentNode> = {}) =>
    ({ nodeType: nodeTypes.ITEM, variant, ...extra }) as ItemContentNode;

  it('renders graphql-fields', () => {
    renderNode(graphqlNode('graphql-fields', { graphqlTypeName: 'User' }), gql);

    expect(screen.getByText('fullName')).toBeInTheDocument();
  });

  it('renders graphql-args', () => {
    renderNode(
      graphqlNode('graphql-args', {
        graphqlTypeName: 'Query',
        graphqlFieldName: 'user',
        graphqlOperationType: 'query',
      }),
      gql,
    );

    expect(screen.getByText('id')).toBeInTheDocument();
  });

  it('renders return-type', () => {
    renderNode(
      graphqlNode('return-type', {
        graphqlTypeName: 'User',
        graphqlFieldName: 'user',
        graphqlOperationType: 'query',
      }),
      gql,
    );

    expect(screen.getByText('fullName')).toBeInTheDocument();
  });

  it.each(['possible-types', 'implemented-by'])('renders %s', (variant) => {
    renderNode(graphqlNode(variant, { graphqlTypeNames: ['User'] }), gql);

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders implements', () => {
    renderNode(graphqlNode('implements', { graphqlInterfaceNames: ['Node'] }), gql);

    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('renders only the scopes button for requires-scopes', () => {
    const { container } = renderNode(
      graphqlNode('requires-scopes', {
        label: 'Scopes',
        graphqlTypeName: 'Query',
        graphqlFieldName: 'user',
        graphqlOperationType: 'query',
      }),
      gql,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(container.querySelector('h5')).toBeNull();
  });
});
