import { memo } from 'react';
import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';

import { graphqlTypeDataAtom } from '../../jotai/graphql.js';
import { SchemaItemWrapper, Value, PanelAnnotation } from './styled.js';
import { renderDescription } from './renderDescription.js';

interface Props {
  name: string;
}

function GraphQLEnumEmbeddedComponent({ name }: Props) {
  const typeData = useAtomValue(graphqlTypeDataAtom(name));
  const values = typeData?.variant === 'enum' ? (typeData.enumValues ?? []) : [];

  if (values.length === 0) return null;

  return (
    <>
      {values.map((value) => (
        <SchemaItemWrapper key={value.name}>
          <StyledValue>{value.name}</StyledValue>
          {value.description && (
            <PanelAnnotation>{renderDescription(value.description)}</PanelAnnotation>
          )}
        </SchemaItemWrapper>
      ))}
    </>
  );
}

export const GraphQLEnumEmbedded = memo<Props>(GraphQLEnumEmbeddedComponent);

const StyledValue = styled(Value)`
  color: var(--text-color-primary);
`;
