import * as React from 'react';
import { SecuritySchemeModel } from '../../services';
import { titleize } from '../../utils';
import { StyledMarkdownBlock } from '../Markdown/styled.elements';
import { SecurityRow } from './styled.elements';
import { OAuthFlow } from './OAuthFlow';

interface SecuritySchemaProps {
  RequiredScopes?: JSX.Element;
  scheme: SecuritySchemeModel;
}
export function SecurityDetails(props: SecuritySchemaProps) {
  const { RequiredScopes, scheme } = props;

  return (
    <StyledMarkdownBlock>
      {scheme.apiKey ? (
        <>
          <SecurityRow>
            <b>{titleize(scheme.apiKey.in || '')} parameter name: </b>
            <code>{scheme.apiKey.name}</code>
          </SecurityRow>
          {RequiredScopes}
        </>
      ) : scheme.http ? (
        <>
          <SecurityRow>
            <b>HTTP Authorization Scheme: </b>
            <code>{scheme.http.scheme}</code>
          </SecurityRow>
          <SecurityRow>
            {scheme.http.scheme === 'bearer' && scheme.http.bearerFormat && (
              <>
                <b>Bearer format: </b>
                <code>{scheme.http.bearerFormat}</code>
              </>
            )}
          </SecurityRow>
          {RequiredScopes}
        </>
      ) : scheme.openId ? (
        <>
          <SecurityRow>
            <b>Connect URL: </b>
            <code>
              <a target="_blank" rel="noopener noreferrer" href={scheme.openId.connectUrl}>
                {scheme.openId.connectUrl}
              </a>
            </code>
          </SecurityRow>
          {RequiredScopes}
        </>
      ) : scheme.flows ? (
        Object.keys(scheme.flows).map(type => (
          <OAuthFlow
            key={type}
            type={type}
            RequiredScopes={RequiredScopes}
            flow={scheme.flows[type]}
          />
        ))
      ) : null}
    </StyledMarkdownBlock>
  );
}
