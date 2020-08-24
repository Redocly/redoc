import { Component } from 'react';
import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
export interface StoreProviderProps {
    specUrl?: string;
    spec?: object;
    store?: AppStore;
    options?: RedocRawOptions;
    onLoaded?: (e?: Error) => void;
    children: (props: {
        loading: boolean;
        store?: AppStore;
    }) => any;
}
export interface StoreProviderState {
    error?: Error;
    loading: boolean;
    resolvedSpec?: any;
    prevSpec?: any;
    prevSpecUrl?: string;
}
export declare class StoreProvider extends Component<StoreProviderProps, StoreProviderState> {
    static getDerivedStateFromProps(nextProps: StoreProviderProps, prevState: StoreProviderState): {
        loading: boolean;
        resolvedSpec: null;
        prevSpec: object | undefined;
        prevSpecUrl: string | undefined;
    } | null;
    state: StoreProviderState;
    makeStore(spec: any, specUrl: any, options: any): AppStore | undefined;
    componentDidMount(): void;
    componentDidUpdate(): void;
    load(): Promise<void>;
    render(): any;
}
