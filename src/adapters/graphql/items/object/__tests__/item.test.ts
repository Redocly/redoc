import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildObjectItems } from '../item.js';

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
    enum Role { ADMIN USER }
  `),
);

describe('buildObjectItems', () => {
  it('calls createApiItem for object types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildObjectItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalled();
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['User', 'Post']));
    expect(items.map((i) => i.label)).not.toContain('Role');
    expect(items.map((i) => i.label)).not.toContain('Query');
  });
});
