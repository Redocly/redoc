import * as React from 'react';
import { DropdownProps } from '../../common-elements/dropdown';
export interface DropdownOrLabelProps extends DropdownProps {
    Label?: React.ComponentClass;
    Dropdown?: React.ComponentClass;
}
export declare function DropdownOrLabel(props: DropdownOrLabelProps): JSX.Element;
