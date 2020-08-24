export declare class HistoryService {
    private _emiter;
    constructor();
    readonly currentId: string;
    linkForId(id: string): string;
    subscribe(cb: any): () => void;
    emit: () => void;
    bind(): void;
    dispose(): void;
    replace(id: string | null, rewriteHistory?: boolean): void;
}
export declare const history: HistoryService;
