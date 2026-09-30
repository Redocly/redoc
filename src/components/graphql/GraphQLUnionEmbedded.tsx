import { memo } from 'react';
import { useAtomValue } from 'jotai';

import { graphqlTypeDataAtom } from '../../jotai/graphql.js';
import { GraphQLGroupTypeList } from './GraphQLGroupTypeList.js';

interface Props {
  name: string;
}

function GraphQLUnionEmbeddedComponent({ name }: Props) {
  const typeData = useAtomValue(graphqlTypeDataAtom(name));
  const typeNames = typeData?.variant === 'union' ? (typeData.possibleTypes ?? []) : [];

  if (typeNames.length === 0) return null;

  return <GraphQLGroupTypeList typeNames={typeNames} />;
}

export const GraphQLUnionEmbedded = memo<Props>(GraphQLUnionEmbeddedComponent);
