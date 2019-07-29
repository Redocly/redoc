import { observer } from 'mobx-react';
import * as React from 'react';
import { MediaTypeSamples } from './MediaTypeSamples';

import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';

import styled from '../../../src/styled-components';
import { MediaContentModel } from '../../services/models';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { InvertedSimpleDropdown, MimeLabel } from './styled.elements';

export interface PayloadSamplesProps {
  content: MediaContentModel;
}

@observer
export class PayloadSamples extends React.Component<PayloadSamplesProps> {
  render() {
    const mimeContent = this.props.content;
    if (mimeContent === undefined) {
      return null;
    }

    return (
      <MediaTypesSwitch content={mimeContent} renderDropdown={this.renderDropdown} withLabel={true}>
        {mediaType => (
          <SamplesWrapper>
            <MediaTypeSamples
              key="samples"
              mediaType={mediaType}
              renderDropdown={this.renderDropdown}
            />
          </SamplesWrapper>
        )}
      </MediaTypesSwitch>
    );
  }

  private renderDropdown = props => {
    return <DropdownOrLabel Label={MimeLabel} Dropdown={InvertedSimpleDropdown} {...props} />;
  };
}

const SamplesWrapper = styled.div`
  margin-top: 15px;
`;
