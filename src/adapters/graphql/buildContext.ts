import type { GraphqlBuildContext as BuildContext } from '../../types/graphql.js';

import { createScopedContext } from '../scopedContext.js';

export const graphqlContext = createScopedContext<BuildContext>('GraphQL');
