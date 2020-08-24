import * as React from 'react';
import { ContentItemModel } from '../../services/MenuBuilder';
import { OperationModel } from '../../services/models';
export declare class ContentItems extends React.Component<{
    items: ContentItemModel[];
}> {
    render(): JSX.Element[] | null;
}
export interface ContentItemProps {
    item: ContentItemModel;
}
export declare class ContentItem extends React.Component<ContentItemProps> {
    render(): JSX.Element;
}
export declare class SectionItem extends React.Component<ContentItemProps> {
    render(): JSX.Element;
}
export declare class OperationItem extends React.Component<{
    item: OperationModel;
}> {
    render(): JSX.Element;
}
