import { memo } from 'react';

import type { PropsWithChildren, ReactElement } from 'react';
import type { OpenAPISecurityScheme } from '../../types/index.js';

import { SecuritySchemeItem } from './SecuritySchemeItem.js';
import { StyledLink } from './styled.js';
import { useTranslate } from '../../hooks/index.js';

export interface OAuthFlowProps {
  flow: OpenAPISecurityScheme['flows'][keyof OpenAPISecurityScheme['flows']];
}

function OAuthFlowComponent({ flow }: PropsWithChildren<OAuthFlowProps>): ReactElement {
  const translate = useTranslate();

  return (
    <>
      <SecuritySchemeItem
        label={`${translate('openapi.authorizationUrl', 'Authorization URL')}:`}
        value={
          flow?.['authorizationUrl'] && (
            <StyledLink target="_blank" rel="noopener noreferrer" href={flow?.['authorizationUrl']}>
              {flow?.['authorizationUrl']}
            </StyledLink>
          )
        }
      />
      <SecuritySchemeItem
        label={`${translate('openapi.tokenUrl', 'Token URL')}:`}
        value={
          flow?.['tokenUrl'] && (
            <StyledLink target="_blank" rel="noopener noreferrer" href={flow?.['tokenUrl']}>
              {flow?.['tokenUrl']}
            </StyledLink>
          )
        }
      />
      <SecuritySchemeItem
        label={`${translate('openapi.refreshUrl', 'Refresh URL')}:`}
        value={
          flow?.refreshUrl && (
            <StyledLink target="_blank" rel="noopener noreferrer" href={flow?.refreshUrl}>
              {flow?.refreshUrl}
            </StyledLink>
          )
        }
      />
      <SecuritySchemeItem
        label={`${translate('openapi.deviceAuthorizationUrl', 'Device Authorization URL')}:`}
        value={
          flow?.['deviceAuthorizationUrl'] && (
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href={flow?.['deviceAuthorizationUrl']}
            >
              {flow?.['deviceAuthorizationUrl']}
            </StyledLink>
          )
        }
      />
    </>
  );
}

export const OAuthFlow = memo<PropsWithChildren<OAuthFlowProps>>(OAuthFlowComponent);
