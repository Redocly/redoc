export * from './open-api';
export * from './miles.constants';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
