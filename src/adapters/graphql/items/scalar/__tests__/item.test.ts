import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildScalarItems } from '../item.js';

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
    scalar Date
    scalar JSON
    type User { id: ID! }
    enum Role { ADMIN USER }
  `),
);

describe('buildScalarItems', () => {
  it('calls createApiItem for scalar types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildScalarItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalled();
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['Date', 'JSON']));
    expect(items.map((i) => i.label)).not.toContain('User');
    expect(items.map((i) => i.label)).not.toContain('Role');
  });

  it('omits spec built-in scalars unless showBuiltInScalars is true', () => {
    const hidden = graphqlContext.run(
      graphqlTestContext(schema, '/api', { showBuiltInScalars: false }),
      () => buildScalarItems(),
    );
    expect(hidden.map((i) => i.label)).toEqual(expect.arrayContaining(['Date', 'JSON']));
    expect(hidden.map((i) => i.label)).not.toContain('String');
    expect(hidden.map((i) => i.label)).not.toContain('Int');

    const shown = graphqlContext.run(
      graphqlTestContext(schema, '/api', { showBuiltInScalars: true }),
      () => buildScalarItems(),
    );
    expect(shown.map((i) => i.label)).toEqual(expect.arrayContaining(['String', 'Date', 'JSON']));
  });
});
