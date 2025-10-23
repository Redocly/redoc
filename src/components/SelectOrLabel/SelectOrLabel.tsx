import type { FC, PropsWithChildren, ReactElement } from 'react';
import type { SelectProps } from '../common/Select/index.js';

import { SimpleSelect } from '../common/Select/index.js';
import { styled } from '../../styled-components.js';

export interface SelectOrLabelProps extends SelectProps {
  Label?: FC<PropsWithChildren>;
  Select?: FC<SelectProps>;
}

const MimeLabel = styled.span`
  margin-left: 4px;
  font-size: 14px;
  text-transform: none;
  font-weight: 400;
  color: var(--text-color-primary);
`;

export function SelectOrLabel({
  Label = MimeLabel,
  Select = SimpleSelect,
  ...selectProps
}: SelectOrLabelProps): ReactElement {
  if (selectProps.options.length === 1) {
    return <Label>{selectProps.options[0].value}</Label>;
  }
  return <Select {...selectProps} />;
}
