import * as React from 'react';
export interface ResponseTitleProps {
    code: string;
    title: string;
    type: string;
    empty?: boolean;
    opened?: boolean;
    className?: string;
    onClick?: () => void;
}
export declare class ResponseTitle extends React.PureComponent<ResponseTitleProps> {
    render(): JSX.Element;
}
