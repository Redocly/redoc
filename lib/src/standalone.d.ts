import { StoreState } from './services/AppStore';
export { Redoc, AppStore } from '.';
export declare const version: string;
export declare const revision: string;
export declare function init(specOrSpecUrl: string | any, options?: any, element?: Element | null, callback?: (e?: Error) => void): void;
export declare function hydrate(state: StoreState, element?: Element | null, callback?: () => void): void;
