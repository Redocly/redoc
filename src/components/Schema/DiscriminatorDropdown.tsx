import { observer } from 'mobx-react';
import * as React from 'react';

import { DropdownOption, Dropdown } from '../../common-elements/Dropdown';
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
        value: subSchema.title,
        idx,
      };
    });

    const activeValue = options[parent.activeOneOf].value;

    this.sortOptions(options, enumValues);

    return (
      <Dropdown
        value={activeValue}
        options={options}
        onChange={this.changeActiveChild}
        ariaLabel="Example"
      />
    );
  }

  changeActiveChild = (option: DropdownOption) => {
    if (option.idx !== undefined) {
      this.props.parent.activateOneOf(option.idx);
    }
  };
}
