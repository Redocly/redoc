import { IS_BROWSER } from './environments.js';

export function toSessionStorage(key: string, value: string): void {
  if (IS_BROWSER) {
    window.sessionStorage.setItem('redoc.' + key, value);
  }
}

export function fromSessionStorage<T extends string>(key: string): T {
  if (!IS_BROWSER) return '' as T;
  return (window.sessionStorage.getItem('redoc.' + key) || '') as T;
}
