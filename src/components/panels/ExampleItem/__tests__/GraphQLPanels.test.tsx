import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { PanelItem, PanelNode } from '../../../../types/content.js';
import type { Fixture } from '../../../__tests__/harness.js';

import { findNodes, graphqlFixture, renderWithFixture } from '../../../__tests__/harness.js';
import { ContentWrapper } from '../../../common/ContentWrapper.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../../__tests__/themeHooksMock.js')).themeHooksMock({
    querySample: 'Query sample',
    mutationSample: 'Mutation sample',
    subscriptionSample: 'Subscription sample',
  }),
}));

const SDL = `
  type Query {
    user(id: ID!, active: Boolean): User
    ping(echo: String): String
  }

  type Mutation {
    createUser(name: String!): User
  }

  type User {
    id: ID
    nickname: String
  }

  input NewUser {
    displayName: String
  }
`;

let fixture: Fixture;

beforeAll(() => {
  fixture = graphqlFixture(SDL, { samplesMaxInlineArgs: 1 });
});

afterEach(() => {
  cleanup();
});

type OperationItem = PanelItem & {
  graphqlOperationData?: { operationName?: string; typeName?: string; operationType?: string };
};

function realItem(kind: string, name: string): OperationItem {
  const found = findNodes<OperationItem>(
    fixture.items,
    (n) =>
      n.kind === kind &&
      ((n.graphqlOperationData as { operationName?: string; typeName?: string } | undefined)
        ?.operationName === name ||
        (n.graphqlOperationData as { typeName?: string } | undefined)?.typeName === name),
  );
  if (!found[0]) throw new Error(`No ${kind} panel item for ${name}`);
  return found[0];
}

function renderItem(item: unknown) {
  const panel = { children: [item] } as unknown as PanelNode;
  renderWithFixture(<ContentWrapper panels={[panel]}>x</ContentWrapper>, fixture);
  return screen.getByTestId('right-panel');
}

describe('GraphQL query panel', () => {
  it('titles a mutation sample "Mutation sample"', () => {
    renderItem(realItem('graphql-query', 'createUser'));

    expect(screen.getByText('Mutation sample')).toBeInTheDocument();
  });

  it('titles a query sample "Query sample"', () => {
    renderItem(realItem('graphql-query', 'ping'));

    expect(screen.getByText('Query sample')).toBeInTheDocument();
  });

  it('renders arguments multiline above samplesMaxInlineArgs and inline at it', () => {
    const multiline = renderItem(realItem('graphql-query', 'user')).textContent ?? '';
    cleanup();
    const inline = renderItem(realItem('graphql-query', 'ping')).textContent ?? '';

    expect(multiline).toMatch(/user\(\s*\n/);
    expect(inline).toMatch(/ping\([^\n]*\)/);
  });

  it('reports an unknown operation', () => {
    const item = realItem('graphql-query', 'ping');
    renderItem({
      ...item,
      graphqlOperationData: { ...item.graphqlOperationData, operationName: 'x' },
    });

    expect(screen.getByText('# Operation "x" not found')).toBeInTheDocument();
  });

  it('reports a missing schema', () => {
    renderItem({ ...realItem('graphql-query', 'ping'), graphqlOperationData: undefined });

    expect(screen.getByText('# No schema available')).toBeInTheDocument();
  });
});

describe('GraphQL response panel', () => {
  it('renders a JSON sample for a known operation', () => {
    renderItem(realItem('graphql-response', 'user'));

    expect(screen.getByText('Response sample')).toBeInTheDocument();
    expect(screen.getByText(/nickname/)).toBeInTheDocument();
  });

  it('renders nothing for an unknown operation', () => {
    const item = realItem('graphql-response', 'user');
    renderItem({
      ...item,
      graphqlOperationData: { ...item.graphqlOperationData, operationName: 'x' },
    });

    expect(screen.getByTestId('right-panel')).toBeEmptyDOMElement();
  });
});

describe('GraphQL type sample panel', () => {
  it('titles an input type "Request sample"', () => {
    renderItem(realItem('graphql-type-sample', 'NewUser'));

    expect(screen.getByText('Request sample')).toBeInTheDocument();
  });

  it('titles an object type "Response sample"', () => {
    renderItem(realItem('graphql-type-sample', 'User'));

    expect(screen.getByText('Response sample')).toBeInTheDocument();
  });

  it('renders nothing for an unknown type', () => {
    const item = realItem('graphql-type-sample', 'User');
    renderItem({ ...item, graphqlOperationData: { typeName: 'Missing' } });

    expect(screen.getByTestId('right-panel')).toBeEmptyDOMElement();
  });
});
