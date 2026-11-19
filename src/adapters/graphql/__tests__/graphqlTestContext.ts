import type { GraphQLSchema } from 'graphql';
import type { GraphqlBuildContext as BuildContext } from '../../../types/graphql.js';
import type { RawApiDocsOptions } from '../../../types/options.js';

import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { createUniqueSlugger } from '../../../utils/unique-slugger.js';

export function graphqlTestContext(
  schema: GraphQLSchema,
  basePath = '/api',
  optionOverrides?: Partial<RawApiDocsOptions>,
): BuildContext {
  return {
    basePath,
    schema,
    options: normalizeOptions({
      specType: 'graphql',
      downloadUrls: [{ url: 'https://example.com/schema.graphql' }],
      metadata: {},
      ...optionOverrides,
    }),
    processContent: true,
    slugger: createUniqueSlugger(),
  };
}
