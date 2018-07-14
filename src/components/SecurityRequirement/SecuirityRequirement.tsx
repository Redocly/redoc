import { transparentize } from 'polished';
import * as React from 'react';

import styled from '../../styled-components';

import { UnderlinedHeader } from '../../common-elements/headers';
import { SecurityRequirementModel } from '../../services/models/SecurityRequirement';
import { linksCss } from '../Markdown/styled.elements';

const ScopeName = styled.code`
  font-size: ${props => props.theme.code.fontSize};
  font-family: ${props => props.theme.code.fontFamily};
  border: 1px solid ${props => transparentize(0.85, props.theme.colors.text)};
  margin: 0 3px;
  padding: 0.2em;
  display: inline-block;
  line-height: 1;

  &:after {
    content: ',';
  }
  &:last-child:after {
    content: none;
  }
`;

const SecurityRequirementWrap = styled.span`
  &:after {
    content: ' OR ';
    font-weight: bold;
  }
  &:last-child:after {
    content: none;
  }

  ${linksCss};
`;

export interface SecurityRequirementProps {
  security: SecurityRequirementModel;
}

export class SecurityRequirement extends React.PureComponent<SecurityRequirementProps> {
  render() {
    const security = this.props.security;
    return security.schemes.map((scheme, idx) => {
      return (
        <SecurityRequirementWrap key={scheme.id}>
          <a href={'#' + scheme.sectionId}>{scheme.id}</a>
          {scheme.scopes.length > 0 && ' ('}
          {scheme.scopes.map(scope => <ScopeName key={scope}>{scope}</ScopeName>)}
          {scheme.scopes.length > 0 && ') '}
          {idx < security.schemes.length - 1 && ' & '}
        </SecurityRequirementWrap>
      );
    });
  }
}

const AuthHeaderColumn = styled.td``;

const SecuritiesColumn = styled.td`
  width: ${props => props.theme.schemaView.defaultDetailsWidth};
`;

const AuthHeader = UnderlinedHeader.extend`
  display: inline-block;
`;

const Table = styled.table`
  width: 100%;
`;

export interface SecurityRequirementsProps {
  securities: SecurityRequirementModel[];
}

export class SecurityRequirements extends React.PureComponent<SecurityRequirementsProps> {
  render() {
    const securities = this.props.securities;
    if (!securities.length) {
      return null;
    }
    return (
      <Table>
        <tbody>
          <tr>
            <AuthHeaderColumn>
              <AuthHeader>Authorizations: </AuthHeader>
            </AuthHeaderColumn>
            <SecuritiesColumn>
              {securities.map((security, idx) => (
                <SecurityRequirement key={idx} security={security} />
              ))}
            </SecuritiesColumn>
          </tr>
        </tbody>
      </Table>
    );
  }
}
