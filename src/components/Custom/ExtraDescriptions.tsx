import * as React from 'react';

import { ExtensionValue, FieldLabel } from '../../common-elements/fields';
import styled from '../../styled-components';

const Div = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;

  &:last-child {
    padding-top: 2px;
    padding-bottom: 4px;
  }
`;

export interface ExtraDescriptionProps {
  extraDescriptions: Record<string, boolean>;
}

export class ExtraDescription extends React.PureComponent<ExtraDescriptionProps> {
  render() {
    const desc = this.props.extraDescriptions;

    return (
      <div>
        {Object.keys(desc).map(key => (
          <Div key={key}>
            <FieldLabel>{key}:</FieldLabel> <ExtensionValue>{desc[key]}</ExtensionValue>
          </Div>
        ))}
      </div>
    );
  }
}
