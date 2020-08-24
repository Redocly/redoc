import * as React from 'react';
export interface CopyButtonWrapperProps {
    data: any;
    children: (props: {
        renderCopyButton: (() => React.ReactNode);
    }) => React.ReactNode;
}
export declare class CopyButtonWrapper extends React.PureComponent<CopyButtonWrapperProps, {
    tooltipShown: boolean;
}> {
    constructor(props: any);
    render(): React.ReactNode;
    copy: () => void;
    renderCopyButton: () => JSX.Element;
    showTooltip(): void;
}
