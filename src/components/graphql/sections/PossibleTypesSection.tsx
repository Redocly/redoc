import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import { GraphQLGroupTypeList } from '../GraphQLGroupTypeList.js';

export function PossibleTypesSection({ node }: { node: ItemContentNode }): ReactElement {
  const typeNames = node.graphqlTypeNames;

  if (!typeNames || typeNames.length === 0) return <></>;

  return <GraphQLGroupTypeList typeNames={typeNames} />;
}
