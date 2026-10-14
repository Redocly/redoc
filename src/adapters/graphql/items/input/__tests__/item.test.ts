import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildInputItems } from '../item.js';

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
    input CreateUserInput { name: String!, email: String! }
    input UpdateUserInput { name: String }
    type User { id: ID! }
    enum Role { ADMIN USER }
  `),
);

describe('buildInputItems', () => {
  it('calls createApiItem for input types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildInputItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalledTimes(2);
    expect(items.map((i) => i.label)).toEqual(
      expect.arrayContaining(['CreateUserInput', 'UpdateUserInput']),
    );
    expect(items.map((i) => i.label)).not.toContain('User');
    expect(items.map((i) => i.label)).not.toContain('Role');
  });
});
