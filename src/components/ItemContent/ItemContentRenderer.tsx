import { memo, useMemo } from 'react';
import { styled, css } from 'styled-components';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../types/content.js';

import { ParametersSection } from './sections/ParametersSection.js';
import { BodySection } from './sections/BodySection.js';
import { ResponsesSection } from './sections/ResponsesSection.js';
import { FieldsSection } from './sections/FieldsSection.js';
import { ValuesSection } from './sections/ValuesSection.js';
import { MessagesSection } from './sections/MessagesSection.js';
import { CallbacksSection } from './sections/CallbacksSection.js';
import { GraphQLFieldsSection } from '../graphql/sections/GraphQLFieldsSection.js';
import { GraphQLArgsSection } from '../graphql/sections/GraphQLArgsSection.js';
import { ReturnTypeSection } from '../graphql/sections/ReturnTypeSection.js';
import { PossibleTypesSection } from '../graphql/sections/PossibleTypesSection.js';
import { ImplementsSection } from '../graphql/sections/ImplementsSection.js';
import { ImplementedBySection } from '../graphql/sections/ImplementedBySection.js';
import { RequiresScopesSection } from '../graphql/sections/RequiresScopesSection.js';
import { buildOpenApiSectionSuffix } from '../../utils/deep-link.js';
import { useDeepLinkUrl } from '../../hooks/useDeepLinkSection.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import { SectionHeader } from './SectionHeader.js';

export type ItemContentRendererProps = {
  node: ItemContentNode;
};

function ItemContentRendererComponent({ node }: ItemContentRendererProps): ReactElement {
  const translate = useSpecTranslate();
  const suffix = useMemo(() => getVariantSuffix(node.variant), [node.variant]);
  const hasMarginTop = useMemo(() => {
    return ['return-type', 'possible-types', 'graphql-fields', 'values'].includes(node.variant);
  }, [node.variant]);
  const deepLink = useDeepLinkUrl(suffix);

  if (node.variant === 'requires-scopes') {
    return <RequiresScopesSection node={node} />;
  }

  const translatedLabel = resolveText(translate, node.labelTranslationKey, node.label);

  return (
    <SectionWrapper $hasMarginTop={hasMarginTop}>
      {node.label && node.variant !== 'body' && node.variant !== 'responses' && (
        <SectionHeader label={translatedLabel} deepLink={deepLink} suffix={suffix} />
      )}
      <SectionContent itemNode={node} />
    </SectionWrapper>
  );
}

function SectionContent({ itemNode }: { itemNode: ItemContentNode }): ReactElement {
  switch (itemNode.variant) {
    case 'headers':
    case 'query':
    case 'querystring':
    case 'path':
    case 'parameters':
    case 'cookies':
      return <ParametersSection node={itemNode} />;
    case 'body':
    case 'querystring-body':
      return <BodySection node={itemNode} />;
    case 'responses':
      return <ResponsesSection node={itemNode} />;
    case 'fields':
    case 'properties':
      return <FieldsSection node={itemNode} />;
    case 'arguments':
      return <GraphQLArgsSection node={itemNode} />;
    case 'values':
      return <ValuesSection node={itemNode} />;
    case 'messages':
      return <MessagesSection node={itemNode} />;
    case 'callback':
      return <CallbacksSection node={itemNode} />;
    case 'graphql-fields':
      return <GraphQLFieldsSection node={itemNode} />;
    case 'graphql-args':
      return <GraphQLArgsSection node={itemNode} />;
    case 'return-type':
      return <ReturnTypeSection node={itemNode} />;
    case 'possible-types':
      return <PossibleTypesSection node={itemNode} />;
    case 'implements':
      return <ImplementsSection node={itemNode} />;
    case 'implemented-by':
      return <ImplementedBySection node={itemNode} />;
    default:
      return <></>;
  }
}

const SectionWrapper = styled.div<{ $hasMarginTop?: boolean }>`
  margin-bottom: var(--spacing-lg);

  &:last-child {
    margin-bottom: 0;
  }

  ${({ $hasMarginTop }) =>
    $hasMarginTop &&
    css`
      margin-top: var(--spacing-lg);
    `}
`;

export const ItemContentRenderer = memo(ItemContentRendererComponent);

const VARIANT_TO_PLACE: Record<string, string> = {
  path: 'path',
  query: 'query',
  querystring: 'querystring',
  'querystring-body': 'querystring',
  headers: 'header',
  cookies: 'cookie',
};

function getVariantSuffix(variant: string): string {
  const place = VARIANT_TO_PLACE[variant];
  if (place) {
    return buildOpenApiSectionSuffix('request', place);
  }
  return variant;
}
