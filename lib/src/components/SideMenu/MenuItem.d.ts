import * as React from 'react';
import { IMenuItem, OperationModel } from '../../services';
export interface MenuItemProps {
    item: IMenuItem;
    onActivate?: (item: IMenuItem) => void;
    withoutChildren?: boolean;
}
export declare class MenuItem extends React.Component<MenuItemProps> {
    ref: Element | null;
    activate: (evt: React.MouseEvent<HTMLElement>) => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    scrollIntoViewIfActive(): void;
    saveRef: (ref: any) => void;
    render(): JSX.Element;
}
export interface OperationMenuItemContentProps {
    item: OperationModel;
    className?: string;
}
