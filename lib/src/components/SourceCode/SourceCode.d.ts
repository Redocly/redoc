import * as React from 'react';
export interface SourceCodeProps {
    source: string;
    lang: string;
}
export declare class SourceCode extends React.PureComponent<SourceCodeProps> {
    render(): JSX.Element;
}
export declare class SourceCodeWithCopy extends React.PureComponent<SourceCodeProps> {
    render(): JSX.Element;
}
