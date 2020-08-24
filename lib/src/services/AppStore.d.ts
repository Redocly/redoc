import { OpenAPISpec } from '../types';
import { MarkerService } from './MarkerService';
import { MenuStore } from './MenuStore';
import { SpecStore } from './models';
import { RedocNormalizedOptions, RedocRawOptions } from './RedocNormalizedOptions';
import { SearchStore } from './SearchStore';
export interface StoreState {
    menu: {
        activeItemIdx: number;
    };
    spec: {
        url?: string;
        data: any;
    };
    searchIndex: any;
    options: RedocRawOptions;
}
export declare function createStore(spec: object, specUrl: string | undefined, options?: RedocRawOptions): Promise<AppStore>;
export declare class AppStore {
    /**
     * deserialize store
     * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
     */
    static fromJS(state: StoreState): AppStore;
    menu: MenuStore;
    spec: SpecStore;
    rawOptions: RedocRawOptions;
    options: RedocNormalizedOptions;
    search?: SearchStore<string>;
    marker: MarkerService;
    private scroll;
    private disposer;
    constructor(spec: OpenAPISpec, specUrl?: string, options?: RedocRawOptions, createSearchIndex?: boolean);
    onDidMount(): void;
    dispose(): void;
    /**
     * serializes store
     * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
     */
    toJS(): Promise<StoreState>;
    private updateMarkOnMenu;
}
