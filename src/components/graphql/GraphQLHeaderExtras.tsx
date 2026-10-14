import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { graphqlOperationAtom, graphqlOperationKey } from '../../jotai/graphql.js';
import { ArrowIcon } from './ArrowIcon.js';
import { GraphQLReturnTypeDetails } from './GraphQLReturnTypeDetails.js';
import { ReturnTypeDetailsWithArrowWrapper } from './styled.js';

interface GraphQLHeaderExtrasProps {
  returnType?: string;
  operationName?: string;
  operationType?: 'query' | 'mutation' | 'subscription';
}

function GraphQLHeaderExtrasComponent({
  returnType,
  operationName,
  operationType,
}: GraphQLHeaderExtrasProps) {
  const operationField = useAtomValue(
    graphqlOperationAtom(graphqlOperationKey(operationType, operationName)),
  );

  if (!returnType) {
    return null;
  }

  return (
    <>
      {operationField && (
        <ReturnTypeDetailsWithArrowWrapper data-gql-return-type-details>
          <ArrowIcon />
          <GraphQLReturnTypeDetails typeRef={operationField.type} size="lg" />
        </ReturnTypeDetailsWithArrowWrapper>
      )}
    </>
  );
}

export const GraphQLHeaderExtras = memo<GraphQLHeaderExtrasProps>(GraphQLHeaderExtrasComponent);
