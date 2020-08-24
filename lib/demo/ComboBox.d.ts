/**
 * Could not find ready-to-use component with required behaviour so
 * I quickly hacked my own. Will refactor into separate npm package later
 */
import * as React from 'react';
export interface ComboBoxProps {
    onChange?: (val: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
    placeholder?: string;
    value?: string;
}
export interface ComboBoxState {
    open: boolean;
    value: string;
    activeItemIdx: number;
}
export default class ComboBox extends React.Component<ComboBoxProps, ComboBoxState> {
    state: {
        open: boolean;
        value: string;
        activeItemIdx: number;
    };
    open: () => void;
    close: () => void;
    handleChange: (e: any) => void;
    updateValue(value: any): void;
    handleSelect(value: string): void;
    handleTryItClick: () => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleBlur: () => void;
    handleItemClick: (val: any, idx: any) => void;
    renderOption: (option: {
        value: string;
        label: string;
    }, idx: number) => JSX.Element;
    render(): JSX.Element;
}
