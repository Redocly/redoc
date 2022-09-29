import * as React from 'react';
import { StyledComponent } from 'styled-components';

import { DropdownProps, MimeLabel, SimpleDropdown } from '../../common-elements/Dropdown';

export interface DropdownOrLabelProps extends DropdownProps {
  Label?: StyledComponent<any, any, Record<string, any>, never>;
  Dropdown?: StyledComponent<
    React.NamedExoticComponent<DropdownProps>,
    any,
    {
      fullWidth?: boolean | undefined;
    },
    never
  >;
}

export function DropdownOrLabel(props: DropdownOrLabelProps): JSX.Element {
  const { Label = MimeLabel, Dropdown = SimpleDropdown } = props;
  if (props.options.length === 1) {
    return <Label>{props.options[0].value}</Label>;
  }
  return <Dropdown {...props} />;
}
