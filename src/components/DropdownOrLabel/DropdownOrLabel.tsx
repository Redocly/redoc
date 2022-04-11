import * as React from 'react';

import { DropdownProps, MimeLabel, SimpleDropdown } from '../../common-elements/dropdown';

export interface DropdownOrLabelProps extends DropdownProps {
  Label?: React.ComponentClass;
  Dropdown?: React.ComponentClass;
}

export function DropdownOrLabel(props: DropdownOrLabelProps): JSX.Element {
  const { Label = MimeLabel, Dropdown = SimpleDropdown } = props;
  if (props.options.length === 1) {
    return <Label>{props.options[0].value}</Label>;
  }
  return <Dropdown {...props} searchable={false} />;
}
