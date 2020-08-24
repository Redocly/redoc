import * as React from 'react';
import PerfectScrollbarType from 'perfect-scrollbar';
export interface PerfectScrollbarProps {
    options?: PerfectScrollbarType.Options;
    className?: string;
    updateFn?: (fn: any) => void;
}
export declare class PerfectScrollbar extends React.Component<PerfectScrollbarProps> {
    private _container;
    private inst;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    handleRef: (ref: any) => void;
    render(): JSX.Element;
}
export declare function PerfectScrollbarWrap(props: PerfectScrollbarProps & {
    children: JSX.Element[] | JSX.Element;
}): JSX.Element;
