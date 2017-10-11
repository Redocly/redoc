import { MediaTypeSamples } from './MediaTypeSamples';
import * as React from 'react'
import { observer } from 'mobx-react';

import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';

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
    if (mimeContent === undefined) return null;

    return (
      <MediaTypesSwitch
        content={mimeContent}
        renderDropdown={props => <DropdownOrLabel Label={MimeLabel} Dropdown={InvertedSimpleDropdown} {...props} />}
      >
        {mediaType => <MediaTypeSamples key="samples" mediaType={mediaType} />}
      </MediaTypesSwitch>
    );
  }
}
