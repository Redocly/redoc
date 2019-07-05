import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownProps } from '../../common-elements/dropdown';
import { MediaContentModel, MediaTypeModel, SchemaModel } from '../../services/models';
import { DropdownLabel, DropdownWrapper } from '../PayloadSamples/styled.elements';

export interface MediaTypeChildProps {
  schema: SchemaModel;
  mime?: string;
}

export interface MediaTypesSwitchProps {
  content?: MediaContentModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
  children: (activeMime: MediaTypeModel) => JSX.Element;
}

@observer
export class MediaTypesSwitch extends React.Component<MediaTypesSwitchProps> {
  switchMedia = ({ value }) => {
    if (this.props.content) {
      this.props.content.activate(parseInt(value, 10));
    }
  };

  render() {
    const { content } = this.props;
    if (!content || !content.mediaTypes || !content.mediaTypes.length) {
      return null;
    }
    const activeMimeIdx = content.activeMimeIdx;

    const options = content.mediaTypes.map((mime, idx) => {
      return {
        label: mime.name,
        value: idx.toString(),
      };
    });

    return (
      <>
        <DropdownWrapper>
          <DropdownLabel>Content type</DropdownLabel>
          {this.props.renderDropdown({
            value: options[activeMimeIdx],
            options,
            onChange: this.switchMedia,
          })}
        </DropdownWrapper>
        {this.props.children(content.active)}
      </>
    );
  }
}
