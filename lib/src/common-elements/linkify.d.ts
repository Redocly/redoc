import * as React from 'react';
import { HistoryService } from '../services';
export declare const linkifyMixin: (className: any) => import("styled-components").InterpolationValue[];
export declare class Link extends React.Component<{
    to: string;
    className?: string;
    children?: any;
}> {
    navigate: (history: HistoryService, event: any) => void;
    render(): JSX.Element;
}
export declare function ShareLink(props: {
    to: string;
}): JSX.Element;
