import * as React from 'react';
import { MenuStore } from '../../services/MenuStore';
import { RedocRawOptions } from '../../services/RedocNormalizedOptions';
export interface StickySidebarProps {
    className?: string;
    scrollYOffset?: RedocRawOptions['scrollYOffset'];
    menu: MenuStore;
}
export declare class StickyResponsiveSidebar extends React.Component<StickySidebarProps> {
    stickyElement: Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getScrollYOffset(options: any): string;
    render(): JSX.Element;
    private toggleNavMenu;
}
