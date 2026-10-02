import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildQueryItems } from '../item.js';

vi.mock('../../../utils/createApiItem.js', () => ({
  createApiItem: vi.fn(({ name, label }: { name: string; label?: string }) => ({
    type: 'link' as const,
    label: label ?? name,
    link: `/${name}`,
    routeSlug: `/${name}`,
    content: null,
  })),
}));

const schema = buildASTSchema(
  parseGraphQL(`
    type Query {
      getUser(id: ID!): User
      listUsers: [User]
    }
    type User { id: ID! }
  `),
);

describe('buildQueryItems', () => {
  it('calls createApiItem for each query field and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildQueryItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalledTimes(2);
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['getUser', 'listUsers']));
  });
});
