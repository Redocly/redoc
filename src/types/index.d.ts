export * from './open-api';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
declare global {
  type Dict<T> = {
    [key: string]: T;
  };
}
