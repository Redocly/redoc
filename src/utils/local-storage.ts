import { IS_BROWSER } from './dom.js';

export function toLocalStorage(key: string, value: string): void {
  if (IS_BROWSER) {
    window.localStorage.setItem('redoc.' + key, value);
  }
}

export function fromLocalStorage<T extends string>(key: string): T {
  if (!IS_BROWSER) return '' as T;
  return <T>(window.localStorage.getItem('redoc.' + key) || '');
}
