import * as React from 'react';
import { SchemaModel } from '../../services/models';
import { SchemaProps } from './Schema';
export interface OneOfButtonProps {
    subSchema: SchemaModel;
    idx: number;
    schema: SchemaModel;
}
export declare class OneOfButton extends React.Component<OneOfButtonProps> {
    render(): JSX.Element;
    activateOneOf: () => void;
}
export declare class OneOfSchema extends React.Component<SchemaProps> {
    render(): JSX.Element | null;
}
