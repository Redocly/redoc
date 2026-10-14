import { memo } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';
import { Link } from 'react-router';

import { graphqlTypeLookupAtom, graphqlTypeSlugMapAtom } from '../../jotai/graphql.js';
import { SchemaItemWrapper, PanelAnnotation } from './styled.js';
import { renderDescription } from './renderDescription.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';

interface Props {
  typeNames: string[];
}

function GraphQLGroupTypeListComponent({ typeNames }: Props) {
  const lookup = useAtomValue(graphqlTypeLookupAtom);
  const slugMap = useAtomValue(graphqlTypeSlugMapAtom);
  const normalizeUrl = useNavigationUrlNormalizer();

  return (
    <>
      {typeNames.map((name) => {
        const typeData = lookup(name);
        const slug = slugMap[name];
        return (
          <SchemaItemWrapper key={name}>
            <StyledTypeLink to={slug ? normalizeUrl(slug) : '#'}>{name}</StyledTypeLink>
            {typeData?.description && (
              <PanelAnnotation>{renderDescription(typeData.description)}</PanelAnnotation>
            )}
          </SchemaItemWrapper>
        );
      })}
    </>
  );
}

export const GraphQLGroupTypeList = memo<Props>(GraphQLGroupTypeListComponent);

const StyledTypeLink = styled(Link)`
  color: var(--link-color-primary, var(--text-color-secondary));
  text-decoration: none;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);

  &:hover {
    text-decoration: underline;
  }
`;
