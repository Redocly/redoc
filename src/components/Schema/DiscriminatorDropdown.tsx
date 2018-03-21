import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownOption, StyledDropdown } from '../../common-elements/dropdown';
import { SchemaModel } from '../../services/models';

@observer
export class DiscriminatorDropdown extends React.Component<{
  parent: SchemaModel;
  enumValues: string[];
}> {
  sortOptions(options: DropdownOption[], enumValues: string[]): void {
    if (enumValues.length === 0) {
      return;
    }

    const enumOrder = {};

    enumValues.forEach((enumItem, idx) => {
      enumOrder[enumItem] = idx;
    });

    options.sort((a, b) => {
      return enumOrder[a.label] > enumOrder[b.label] ? 1 : -1;
    });
  }

  render() {
    const { parent, enumValues } = this.props;
    if (parent.oneOf === undefined) {
      return null;
    }

    const options = parent.oneOf.map((subSchema, idx) => {
      return {
        value: idx.toString(),
        label: subSchema.title,
      };
    });

    const activeItem = options[parent.activeOneOf];
    this.sortOptions(options, enumValues);

    return (
      <StyledDropdown value={activeItem} options={options} onChange={this.changeActiveChild} />
    );
  }

  changeActiveChild = ({ value }) => {
    const idx = parseInt(value, 10);
    this.props.parent.activateOneOf(idx);
  };
}
