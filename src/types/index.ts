export * from './open-api';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EmptyObject = Record<string, unknown>;
