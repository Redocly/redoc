import * as React from 'react';
import { OperationModel } from '../../services/models';
export interface RequestSamplesProps {
    operation: OperationModel;
}
export declare class RequestSamples extends React.Component<RequestSamplesProps> {
    operation: OperationModel;
    render(): JSX.Element | null;
}
