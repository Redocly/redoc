import * as React from 'react';
import { IMenuItem } from '../../services/MenuStore';
import { SearchStore } from '../../services/SearchStore';
import { MenuItem } from '../SideMenu/MenuItem';
import { MarkerService } from '../../services/MarkerService';
import { SearchResult } from '../../services/SearchWorker.worker';
export interface SearchBoxProps {
    search: SearchStore<string>;
    marker: MarkerService;
    getItemById: (id: string) => IMenuItem | undefined;
    onActivate: (item: IMenuItem) => void;
    className?: string;
}
export interface SearchBoxState {
    results: SearchResult[];
    term: string;
    activeItemIdx: number;
}
export declare class SearchBox extends React.PureComponent<SearchBoxProps, SearchBoxState> {
    activeItemRef: MenuItem | null;
    constructor(props: any);
    clearResults(term: string): void;
    clear: () => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    setResults(results: SearchResult[], term: string): void;
    search: (event: React.ChangeEvent<HTMLInputElement>) => void;
    render(): JSX.Element;
}
