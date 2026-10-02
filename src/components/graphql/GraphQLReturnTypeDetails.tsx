import { memo } from 'react';
import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';
import { Link } from 'react-router';

import type { GraphqlTypeRef } from '../../types/graphql-store.js';

import { graphqlTypeSlugMapAtom } from '../../jotai/graphql.js';
import { NonNullLabel, MessageBadge } from './styled.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';

interface Props {
  typeRef: GraphqlTypeRef;
  inline?: boolean;
  size?: 'base' | 'lg';
  deprecated?: boolean;
  required?: boolean;
  className?: string;
}

function ReturnTypeView({ typeRef }: { typeRef: GraphqlTypeRef }) {
  if (typeRef.isList) {
    return (
      <>
        [{typeRef.name}
        {typeRef.isNonNull ? '!' : ''}]{typeRef.isListNonNull ? '!' : ''}
      </>
    );
  }
  return (
    <>
      {typeRef.name}
      {typeRef.isNonNull ? '!' : ''}
    </>
  );
}

function GraphQLReturnTypeDetailsComponent({
  typeRef,
  inline = false,
  size = 'base',
  deprecated = false,
  required = false,
  className,
}: Props) {
  const slugMap = useAtomValue(graphqlTypeSlugMapAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  const translate = useSpecTranslate();
  const showNonNullLabel = typeRef.isListNonNull || typeRef.isNonNull;
  const typeSlug = slugMap[typeRef.name];
  return (
    <Wrapper className={className} data-testid="return-type" $inline={inline} $size={size}>
      {typeSlug ? (
        <StyledTypeLink to={normalizeUrl(typeSlug)}>
          <ReturnTypeView typeRef={typeRef} />
        </StyledTypeLink>
      ) : (
        <ReturnTypeView typeRef={typeRef} />
      )}
      {showNonNullLabel && (
        <>
          <Comma>,</Comma>
          <NonNullLabel>{translate('nonNull', 'non-null')}</NonNullLabel>
        </>
      )}
      {deprecated && (
        <MessageBadge data-testid="deprecated" $type="warning">
          {translate('badges.deprecated', 'deprecated')}
        </MessageBadge>
      )}
      {required && (
        <MessageBadge data-testid="required-arg" $type="error">
          {translate('required', 'required')}
        </MessageBadge>
      )}
    </Wrapper>
  );
}

export const GraphQLReturnTypeDetails = memo<Props>(GraphQLReturnTypeDetailsComponent);

const Wrapper = styled.div<{ $inline: boolean; $size: 'base' | 'lg' }>`
  display: ${({ $inline }) => ($inline ? 'inline-block' : 'block')};
  min-width: 0;
  font-size: ${({ $size }) => `var(--font-size-${$size})`};
  line-height: ${({ $size }) => `var(--line-height-${$size})`};
  font-family: var(--font-family-base);
  overflow-wrap: anywhere;
`;

const StyledTypeLink = styled(Link)`
  color: var(--link-color-primary, var(--text-color-secondary));
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Comma = styled.span`
  margin-right: var(--spacing-xxs, 4px);
`;
