import * as React from 'react';
import { FieldModel, RequestBodyModel } from '../../services/models';
export interface ParametersProps {
    parameters?: FieldModel[];
    body?: RequestBodyModel;
}
export declare class Parameters extends React.PureComponent<ParametersProps> {
    orderParams(params: FieldModel[]): Dict<FieldModel[]>;
    render(): JSX.Element | null;
}
