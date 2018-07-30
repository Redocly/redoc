import * as React from 'react';

import { MiddlePanel, Row } from '../../common-elements/';

import { Markdown } from '../Markdown/Markdown';

export interface ApiDescriptionProps {
  description: string;
}

export class ApiDescription extends React.PureComponent<ApiDescriptionProps> {
  render() {
    const { description } = this.props;
    return (
      <Row>
        <MiddlePanel>
          <Markdown source={description} />
        </MiddlePanel>
      </Row>
    );
  }
}
