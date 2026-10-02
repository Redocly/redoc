import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import type { RawApiDocsOptions } from '../../../../../types/options.js';

import type { GraphqlBuildContext as BuildContext } from '../../../../../types/graphql.js';

import { buildOverviewContent } from '../content.js';
import { buildOverviewItem } from '../item.js';
import { graphqlContext } from '../../../buildContext.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';

const mockedContent = { contentType: 'overview' as const, children: [] };

vi.mock('../content.js', () => ({
  buildOverviewContent: vi.fn(() => mockedContent),
}));

const schema = buildASTSchema(parseGraphQL(`type Query { _: Boolean }`));

const baseOptions: RawApiDocsOptions = {
  specType: 'graphql',
  downloadUrls: [],
  metadata: {},
};

describe('buildOverviewItem', () => {
  it('calls buildOverviewContent and returns an item with the correct link', () => {
    const options = normalizeOptions({ ...baseOptions, info: { title: 'My API' } });
    const context: BuildContext = { basePath: '/api', schema, options, processContent: true };
    const item = graphqlContext.run(context, () => buildOverviewItem(context, []));

    expect(vi.mocked(buildOverviewContent)).toHaveBeenCalledOnce();
    expect(vi.mocked(buildOverviewContent).mock.calls[0][0]).toMatchObject({
      basePath: '/api',
    });
    expect(item.type).toBe('link');
    expect(item.link).toBe('/api');
    expect(item.label).toBe('My API');
    expect(item.content).toBe(mockedContent);
  });
});
