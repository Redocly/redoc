import { Component } from 'react';
import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
export interface StoreBuilderProps {
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
export interface StoreBuilderState {
    error?: Error;
    loading: boolean;
    resolvedSpec?: any;
    prevSpec?: any;
    prevSpecUrl?: string;
}
declare const Provider: import("react").ComponentType<import("react").ProviderProps<AppStore | undefined>>, Consumer: import("react").ComponentType<import("react").ConsumerProps<AppStore | undefined>>;
export { Provider as StoreProvider, Consumer as StoreConsumer };
export declare class StoreBuilder extends Component<StoreBuilderProps, StoreBuilderState> {
    static getDerivedStateFromProps(nextProps: StoreBuilderProps, prevState: StoreBuilderState): {
        loading: boolean;
        resolvedSpec: null;
        prevSpec: object | undefined;
        prevSpecUrl: string | undefined;
    } | null;
    state: StoreBuilderState;
    makeStore(spec: any, specUrl: any, options: any): AppStore | undefined;
    componentDidMount(): void;
    componentDidUpdate(): void;
    load(): Promise<void>;
    render(): any;
}
