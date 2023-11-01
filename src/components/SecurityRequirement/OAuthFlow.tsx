import * as React from 'react';
import { OpenAPISecurityScheme } from '../../types';
import { SecurityRow } from './styled.elements';
import { SeeMore } from '../SeeMore/SeeMore';
import { Markdown } from '../Markdown/Markdown';

export interface OAuthFlowProps {
  type: string;
  flow: OpenAPISecurityScheme['flows'][keyof OpenAPISecurityScheme['flows']];
  RequiredScopes?: JSX.Element;
}

export function OAuthFlowComponent(props: OAuthFlowProps) {
  const { type, flow, RequiredScopes } = props;
  const scopesNames = Object.keys(flow?.scopes || {});

  return (
    <>
      <SecurityRow>
        <b>Flow type: </b>
        <code>{type} </code>
      </SecurityRow>
      {(type === 'implicit' || type === 'authorizationCode') && (
        <SecurityRow>
          <strong> Authorization URL: </strong>
          <code>
            <a target="_blank" rel="noopener noreferrer" href={(flow as any).authorizationUrl}>
              {(flow as any).authorizationUrl}
            </a>
          </code>
        </SecurityRow>
      )}
      {(type === 'password' || type === 'clientCredentials' || type === 'authorizationCode') && (
        <SecurityRow>
          <b> Token URL: </b>
          <code>{(flow as any).tokenUrl}</code>
        </SecurityRow>
      )}
      {flow!.refreshUrl && (
        <SecurityRow>
          <strong> Refresh URL: </strong>
          <code>{flow!.refreshUrl}</code>
        </SecurityRow>
      )}
      {!!scopesNames.length && (
        <>
          {RequiredScopes || null}
          <SecurityRow>
            <b> Scopes: </b>
          </SecurityRow>
          <SeeMore height="4em">
            <ul>
              {scopesNames.map(scope => (
                <li key={scope}>
                  <code>{scope}</code> -{' '}
                  <Markdown
                    className={'redoc-markdown'}
                    inline={true}
                    source={flow!.scopes[scope] || ''}
                  />
                </li>
              ))}
            </ul>
          </SeeMore>
        </>
      )}
    </>
  );
}

export const OAuthFlow = React.memo<OAuthFlowProps>(OAuthFlowComponent);
