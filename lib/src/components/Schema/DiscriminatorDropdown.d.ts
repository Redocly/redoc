import * as React from 'react';
import { DropdownOption } from '../../common-elements/dropdown';
import { SchemaModel } from '../../services/models';
export declare class DiscriminatorDropdown extends React.Component<{
    parent: SchemaModel;
    enumValues: string[];
}> {
    sortOptions(options: DropdownOption[], enumValues: string[]): void;
    render(): JSX.Element | null;
    changeActiveChild: ({ value }: {
        value: any;
    }) => void;
}
