import { observer } from 'mobx-react';
import * as React from 'react';
import { MediaTypeSamples } from './MediaTypeSamples';

import { MediaContentModel } from '../../services/models';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
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
          <MediaTypeSamples
            key="samples"
            mediaType={mediaType}
            renderDropdown={this.renderDropdown}
          />
        )}
      </MediaTypesSwitch>
    );
  }

  private renderDropdown = props => {
    return (
      <DropdownOrLabel
        Label={MimeLabel}
        Dropdown={InvertedSimpleDropdown}
        {...props}
        variant="dark"
      />
    );
  };
}
