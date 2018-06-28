import * as React from 'react';

import { MiddlePanel, Row } from '../../common-elements/';

import { AppStore } from '../../services/AppStore';
import { Markdown } from '../Markdown/Markdown';
import { SecurityDefs } from '../SecuritySchemes/SecuritySchemes';

export interface ApiDescriptionProps {
  store: AppStore;
}

const ALLOWED_COMPONENTS = {
  'security-definitions': {
    component: SecurityDefs,
    propsSelector: _store => ({
      securitySchemes: _store!.spec.securitySchemes,
    }),
  },
};

export class ApiDescription extends React.PureComponent<ApiDescriptionProps> {
  render() {
    const { store } = this.props;
    const description = store.spec.info.description;
    return (
      <Row>
        <MiddlePanel>
          <Markdown
            source={description || ''}
            raw={false}
            allowedComponents={ALLOWED_COMPONENTS}
            store={store}
          />
        </MiddlePanel>
      </Row>
    );
  }
}
