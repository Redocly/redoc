import * as React from 'react';

import { SecuritySchemesModel } from '../../services';
import { H2, Row, ShareLink, MiddlePanel, Section } from '../../common-elements';
import { Markdown } from '../Markdown/Markdown';
import { SecurityDetails } from '../SecurityRequirement/SecurityDetails';
import { SecurityDetailsStyle } from '../SecurityRequirement/styled.elements';

export const AUTH_TYPES = {
  oauth2: 'OAuth2',
  apiKey: 'API Key',
  http: 'HTTP',
  openIdConnect: 'OpenID Connect',
};

export interface SecurityDefsProps {
  securitySchemes: SecuritySchemesModel;
}

export class SecurityDefs extends React.PureComponent<SecurityDefsProps> {
  render() {
    return this.props.securitySchemes.schemes.map(scheme => (
      <Section id={scheme.sectionId} key={scheme.id}>
        <Row>
          <MiddlePanel>
            <H2>
              <ShareLink to={scheme.sectionId} />
              {scheme.displayName}
            </H2>
            <Markdown source={scheme.description || ''} />
            <SecurityDetailsStyle>
              <SecurityDetails scheme={scheme} />
            </SecurityDetailsStyle>
          </MiddlePanel>
        </Row>
      </Section>
    ));
  }
}
