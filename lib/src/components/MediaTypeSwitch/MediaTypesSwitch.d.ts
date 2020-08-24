import * as React from 'react';
import { DropdownProps } from '../../common-elements/dropdown';
import { MediaContentModel, MediaTypeModel, SchemaModel } from '../../services/models';
export interface MediaTypeChildProps {
    schema: SchemaModel;
    mime?: string;
}
export interface MediaTypesSwitchProps {
    content?: MediaContentModel;
    renderDropdown: (props: DropdownProps) => JSX.Element;
    children: (activeMime: MediaTypeModel) => JSX.Element;
}
export declare class MediaTypesSwitch extends React.Component<MediaTypesSwitchProps> {
    switchMedia: ({ value }: {
        value: any;
    }) => void;
    render(): JSX.Element | null;
}
