import * as React from 'react';
export interface TooltipProps {
    open: boolean;
    title: string;
}
export declare class Tooltip extends React.Component<TooltipProps> {
    render(): JSX.Element;
}
