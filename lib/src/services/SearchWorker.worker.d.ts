export default class Worker {
    add: typeof add;
    done: typeof done;
    search: typeof search;
    toJS: typeof toJS;
    load: typeof load;
}
export interface SearchDocument {
    title: string;
    description: string;
    id: string;
}
export interface SearchResult<T = string> {
    meta: T;
    score: number;
}
export declare function add<T>(title: string, description: string, meta?: T): void;
export declare function done(): Promise<void>;
export declare function toJS(): Promise<{
    store: any[];
    index: object;
}>;
export declare function load(state: any): Promise<void>;
export declare function search<Meta = string>(q: string, limit?: number): Promise<Array<SearchResult<Meta>>>;
