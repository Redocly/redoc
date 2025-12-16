import type { ReactElement } from 'react';
import type { SecurityRequirement, ExtendedOpenAPISecurityScheme } from '../../models/index.js';

import { Badge } from '@redocly/theme/components/Badge/Badge';

import { SecuritySchemeItem } from './SecuritySchemeItem.js';
import { titleize } from '../../utils/index.js';
import { OAuthFlow } from './OAuthFlow.js';
import { StyledLink } from './styled.js';
import { Markdown } from '../Markdown/index.js';
import { useTranslate } from '../../hooks/index.js';
import { OAuthScopes } from './OAuthScopes.js';
import { styled } from '../../styled-components.js';

export function SecurityFlow({
  type,
  bearerFormat,
  name,
  flows,
  openIdConnectUrl,
  description,
  id,
  securities,
  in: apiKeyIn,
  deprecated = false,
  oauth2MetadataUrl,
}: Partial<ExtendedOpenAPISecurityScheme> & {
  securities: SecurityRequirement[];
}): ReactElement | null {
  const translate = useTranslate();
  if (!type || !id) return null;

  const schemaType = {
    http: (
      <>
        <SecuritySchemeItem
          label={translate('openapi.httpAuthorizationScheme', 'HTTP Authorization Scheme')}
          value={type}
        />
        <SecuritySchemeItem
          label={translate('openapi.bearerFormat', 'Bearer Format')}
          value={bearerFormat}
        />
      </>
    ),
    apiKey: (
      <SecuritySchemeItem
        label={`${titleize(apiKeyIn || '')} ${translate(
          'openapi.parameterName',
          'parameter name',
        )}:`}
        value={name}
      />
    ),
    oauth2: (
      <>
        <SecuritySchemeItem label={translate('openapi.flowType', 'Flow type')} value={type} />
        {flows && Object.keys(flows).map((type) => <OAuthFlow flow={flows[type]} key={type} />)}
      </>
    ),
    openIdConnect: (
      <SecuritySchemeItem
        label={translate('openapi.connectUrl', 'Connect URL')}
        value={
          openIdConnectUrl && (
            <StyledLink target="_blank" rel="noopener noreferrer" href={openIdConnectUrl}>
              {openIdConnectUrl}
            </StyledLink>
          )
        }
      />
    ),
  };

  return (
    <Wrapper>
      <TitleSchemaWrapper>
        <TitleSchema>{id}</TitleSchema>
        {deprecated && (
          <Badge deprecated={true}>{translate('openapi.badges.deprecated', 'Deprecated')}</Badge>
        )}
      </TitleSchemaWrapper>
      <Markdown source={description} />
      {oauth2MetadataUrl && (
        <SecuritySchemeItem
          label={translate('openapi.oauth2MetadataUrl', 'OAuth2 Metadata URL')}
          value={
            <StyledLink target="_blank" rel="noopener noreferrer" href={oauth2MetadataUrl}>
              {oauth2MetadataUrl}
            </StyledLink>
          }
        />
      )}
      <List>
        {schemaType[type] || null}
        <OAuthScopes id={id} securities={securities} flows={flows} />
      </List>
    </Wrapper>
  );
}

const TitleSchemaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  margin: 0 0 var(--spacing-xs);
`;

const Wrapper = styled.div`
  background: var(--layer-color);
  padding: var(--spacing-base);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color-secondary);
  width: 100%;
  margin-top: var(--spacing-base);
`;

const List = styled.div`
  width: 100%;
  margin-top: var(--spacing-md);
`;

const TitleSchema = styled.p`
  font-size: var(--font-size-base);
  margin: 0;
  text-transform: capitalize;
  font-weight: var(--font-weight-semibold);
`;
