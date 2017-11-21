import { observer } from 'mobx-react';
import * as React from 'react';

import { MediaContentModel, SchemaModel, MediaTypeModel } from '../../services/models';
import { DropdownProps } from '../../common-elements/dropdown';

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
    this.props.content && this.props.content.activate(parseInt(value));
  };

  render() {
    const { content } = this.props;
    if (!content || !content.mediaTypes || !content.mediaTypes.length) return null;
    const activeMimeIdx = content.activeMimeIdx;

    let options = content.mediaTypes.map((mime, idx) => {
      return {
        label: mime.name,
        value: idx.toString(),
      };
    });

    return (
      <div>
        {this.props.renderDropdown({
          value: options[activeMimeIdx],
          options,
          onChange: this.switchMedia,
        })}
        {this.props.children(content.active)}
      </div>
    );
  }
}
