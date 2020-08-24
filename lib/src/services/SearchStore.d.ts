import { IMenuItem } from './MenuStore';
import { OperationModel } from './models';
import Worker from './SearchWorker.worker';
export declare class SearchStore<T> {
    searchWorker: Worker;
    indexItems(groups: Array<IMenuItem | OperationModel>): void;
    add(title: string, body: string, meta?: T): void;
    search(q: string): Promise<import("./SearchWorker.worker").SearchResult<T>[]>;
    toJS(): Promise<{
        store: any[];
        index: object;
    }>;
    load(state: any): void;
}
