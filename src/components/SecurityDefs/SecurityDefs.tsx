import * as React from 'react';

import { SecuritySchemesModel } from '../../services/models/';

import styled from '../../styled-components';
import { H2 } from '../../common-elements';
import { Markdown } from '../Markdown/Markdown';
import { OpenAPISecurityScheme } from '../../types';

const AUTH_TYPES = {
  oauth2: 'OAuth2',
  apiKey: 'API Key',
  basic: 'Basic Authorization',
  openIdConnect: 'Open ID Connect',
};

export interface OAuthFlowProps {
  type: string;
  flow: OpenAPISecurityScheme['flows'][keyof OpenAPISecurityScheme['flows']];
}

const AuthTable = styled.table`
  ul > li {
    margin: 0.5em 0 !important;
  }
`;

export class OAuthFlow extends React.PureComponent<OAuthFlowProps> {
  render() {
    const { type, flow } = this.props;
    return (
      <tr>
        <th> {type} OAuth Flow </th>
        <td>
          {type === 'implicit' || type === 'authorizationCode' ? (
            <div>
              <strong> Authorization URL: </strong>
              {(flow as any).authorizationUrl}
            </div>
          ) : null}
          {type === 'password' || type === 'clientCredentials' || type === 'authorizationCode' ? (
            <div>
              <strong> Token URL: </strong>
              {(flow as any).tokenUrl}
            </div>
          ) : null}
          {flow!.refreshUrl && (
            <div>
              <strong> Refresh URL: </strong>
              {flow!.refreshUrl}
            </div>
          )}
          <div>
            <strong> Scopes: </strong>
          </div>
          <ul>
            {Object.keys(flow!.scopes).map(scope => (
              <li>
                <code>{scope}</code> - {flow!.scopes[scope]}
              </li>
            ))}
          </ul>
        </td>
      </tr>
    );
  }
}

export interface SecurityDefsProps {
  securitySchemes?: SecuritySchemesModel;
}

export class SecurityDefs extends React.PureComponent<SecurityDefsProps> {
  render() {
    if (!this.props.securitySchemes) return null;

    return (
      <div>
        {this.props.securitySchemes.schemes.map(scheme => (
          <div key={scheme.id}>
            <H2>{scheme.id}</H2>
            <Markdown source={scheme.description || ''} />
            <AuthTable className="security-details">
              <tbody>
                <tr>
                  <th> Security scheme type: </th>
                  <td> {AUTH_TYPES[scheme.type]} </td>
                </tr>
                {scheme.apiKey ? (
                  <tr>
                    <th> {scheme.apiKey.in} parameter name:</th>
                    <td> {scheme.apiKey.name} </td>
                  </tr>
                ) : scheme.http ? (
                  [
                    <tr>
                      <th> HTTP Authorization Scheme </th>
                      <th> {scheme.http.scheme} </th>
                    </tr>,
                    <tr>
                      <th> Bearer format </th>
                      <th> "{scheme.http.bearerFormat}" </th>
                    </tr>,
                  ]
                ) : scheme.openId ? (
                  <tr>
                    <th> Connect URL </th>
                    <td>
                      <a target="_blank" href={scheme.openId.connectUrl}>
                        {scheme.openId.connectUrl}
                      </a>
                    </td>
                  </tr>
                ) : scheme.flows ? (
                  Object.keys(scheme.flows).map(type => (
                    <OAuthFlow key={type} type={type} flow={scheme.flows[type]} />
                  ))
                ) : null}
              </tbody>
            </AuthTable>
          </div>
        ))}
      </div>
    );
  }
}
