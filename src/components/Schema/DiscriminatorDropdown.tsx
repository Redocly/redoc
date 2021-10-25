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
      return enumOrder[a.value] > enumOrder[b.value] ? 1 : -1;
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

    const activeValue = options[parent.activeOneOf];

    this.sortOptions(options, enumValues);

    return (
      <StyledDropdown
        value={activeValue}
        options={options}
        onChange={this.changeActiveChild}
        className={'react-dropdown-container'}
        classNamePrefix={'react-dropdown'}
        isSearchable={false}
        aria-label="Example"
      />
    );
  }

  changeActiveChild = ({ value }) => {
    const idx = parseInt(value, 10);
    this.props.parent.activateOneOf(idx);
  };
}
