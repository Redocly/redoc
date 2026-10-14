import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildDirectiveItems } from '../item.js';

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
    directive @auth(role: String!) on FIELD_DEFINITION
    directive @format(format: String!) on FIELD_DEFINITION
  `),
);

describe('buildDirectiveItems', () => {
  it('calls createApiItem for each directive and returns results with @ prefix', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildDirectiveItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalled();
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['@auth', '@format']));
  });

  it('omits spec built-in directives unless showBuiltInDirectives is true', () => {
    const hidden = graphqlContext.run(
      graphqlTestContext(schema, '/api', { showBuiltInDirectives: false }),
      () => buildDirectiveItems(),
    );
    expect(hidden.map((i) => i.label)).toEqual(expect.arrayContaining(['@auth', '@format']));
    expect(hidden.map((i) => i.label)).not.toContain('@skip');
    expect(hidden.map((i) => i.label)).not.toContain('@deprecated');
    expect(hidden.map((i) => i.label)).not.toContain('@oneOf');

    const shown = graphqlContext.run(
      graphqlTestContext(schema, '/api', { showBuiltInDirectives: true }),
      () => buildDirectiveItems(),
    );
    expect(shown.map((i) => i.label)).toEqual(
      expect.arrayContaining(['@skip', '@deprecated', '@oneOf', '@auth', '@format']),
    );
  });
});
