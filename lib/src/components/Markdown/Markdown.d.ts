import * as React from 'react';
export interface StylingMarkdownProps {
    compact?: boolean;
    inline?: boolean;
}
export interface BaseMarkdownProps {
    sanitize?: boolean;
    source: string;
}
export declare type MarkdownProps = BaseMarkdownProps & StylingMarkdownProps & {
    source: string;
    className?: string;
};
export declare class Markdown extends React.Component<MarkdownProps> {
    render(): JSX.Element;
}
