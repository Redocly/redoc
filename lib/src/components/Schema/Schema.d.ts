import * as React from 'react';
import { SchemaModel } from '../../services/models';
export interface SchemaOptions {
    showTitle?: boolean;
    skipReadOnly?: boolean;
    skipWriteOnly?: boolean;
}
export interface SchemaProps extends SchemaOptions {
    schema: SchemaModel;
}
export declare class Schema extends React.Component<Partial<SchemaProps>> {
    render(): JSX.Element;
}
