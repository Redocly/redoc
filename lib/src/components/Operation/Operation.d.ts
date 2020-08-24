import * as React from 'react';
import { OperationModel as OperationType } from '../../services/models';
export interface OperationProps {
    operation: OperationType;
}
export declare class Operation extends React.Component<OperationProps> {
    render(): JSX.Element;
}
