import * as React from 'react';
import { FieldModel } from '../../services/models';
import { SchemaOptions } from '../Schema/Schema';
export interface FieldProps extends SchemaOptions {
    className?: string;
    isLast?: boolean;
    showExamples?: boolean;
    field: FieldModel;
    renderDiscriminatorSwitch?: (opts: FieldProps) => JSX.Element;
}
export declare class Field extends React.Component<FieldProps> {
    toggle: () => void;
    render(): JSX.Element;
}
