import * as React from 'react';
import styled from '../../styled-components';
import { transparentizeHex } from '../../utils/styled';

import { UnderlinedHeader } from '../../common-elements/headers';
import { SecurityRequirementModel } from '../../services/models/SecurityRequirement';

const ScopeName = styled.code`
  font-size: ${props => props.theme.code.fontSize};
  font-family: ${props => props.theme.code.fontFamily};
  border: 1px solid ${props => transparentizeHex(props.theme.colors.text, 0.15)};
  margin: 0 3px;
  padding: 0.2em;
  display: inline-block;
  line-height: 1;
`;

export interface SecurityRequirementProps {
  security: SecurityRequirementModel;
}

export class SecurityRequirement extends React.PureComponent<SecurityRequirementProps> {
  render() {
    const security = this.props.security;
    return security.schemes.map((scheme, idx) => {
      return (
        <div key={scheme.id}>
          <a href={'#' + scheme.sectionId}>{scheme.id}</a>
          {scheme.scopes.length > 0 && ' ('}
          {scheme.scopes.map(scope => <ScopeName key={scope}>{scope}</ScopeName>)}
          {scheme.scopes.length > 0 && ') '}
          {idx < security.schemes.length - 1 && ' and '}
        </div>
      );
    });
  }
}

const AuthHeaderColumn = styled.div`
  display: inline-block;
  width: calc(100% - ${props => props.theme.schemaView.defaultDetailsWidth});
`;

const SecuritiesColumn = styled.div`
  width: ${props => props.theme.schemaView.defaultDetailsWidth};
  display: inline-block;
`;

const AuthHeader = styled(UnderlinedHeader)`
  display: inline-block;
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
      <div>
        <AuthHeaderColumn>
          <AuthHeader>Authorizations: </AuthHeader>
        </AuthHeaderColumn>
        <SecuritiesColumn>
          {securities.map((security, idx) => <SecurityRequirement key={idx} security={security} />)}
        </SecuritiesColumn>
      </div>
    );
  }
}
