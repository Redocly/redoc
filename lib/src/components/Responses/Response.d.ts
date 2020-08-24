import * as React from 'react';
import { ResponseModel } from '../../services/models';
export declare class ResponseView extends React.Component<{
    response: ResponseModel;
}> {
    toggle: () => void;
    render(): JSX.Element;
}
