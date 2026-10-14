import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildUnionItems } from '../item.js';

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
    type Query { _empty: Boolean }
    type User { id: ID! }
    type Post { id: ID! }
    union SearchResult = User | Post
    enum Role { ADMIN USER }
  `),
);

describe('buildUnionItems', () => {
  it('calls createApiItem for union types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildUnionItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalledTimes(1);
    expect(items.map((i) => i.label)).toEqual(['SearchResult']);
    expect(items.map((i) => i.label)).not.toContain('User');
    expect(items.map((i) => i.label)).not.toContain('Role');
  });
});
