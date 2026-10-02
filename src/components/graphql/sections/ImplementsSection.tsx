import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import { GraphQLGroupTypeList } from '../GraphQLGroupTypeList.js';

export function ImplementsSection({ node }: { node: ItemContentNode }): ReactElement {
  const interfaceNames = node.graphqlInterfaceNames;

  if (!interfaceNames || interfaceNames.length === 0) return <></>;

  return <GraphQLGroupTypeList typeNames={interfaceNames} />;
}
