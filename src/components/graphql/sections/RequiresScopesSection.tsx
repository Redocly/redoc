import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import {
  graphqlOperationAtom,
  graphqlOperationKey,
  graphqlTypeDataAtom,
} from '../../../jotai/graphql.js';
import { mergeRequiresScopes } from '../../../utils/graphql-scopes.js';
import { RequiresScopesButton } from '../RequiresScopesButton.js';

export function RequiresScopesSection({ node }: { node: ItemContentNode }): ReactElement {
  const operationField = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(node.graphqlOperationType, node.graphqlFieldName)),
  );
  const typeData = useAtomValue(graphqlTypeDataAtom(node.graphqlTypeName ?? ''));

  if (!node.graphqlTypeName) return <></>;

  const isOperationNode = !!(node.graphqlFieldName && node.graphqlOperationType);
  const requiresScopes = isOperationNode
    ? operationField?.requiresScopes
    : typeData?.requiresScopes;

  const directive = mergeRequiresScopes(requiresScopes, undefined);

  if (!directive) return <></>;

  return <RequiresScopesButton directive={directive} isItem />;
}
