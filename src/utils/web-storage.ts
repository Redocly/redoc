import { IS_BROWSER } from './environments.js';

type WebStorageName = 'localStorage' | 'sessionStorage';

/** The storage, or undefined on the server and where the browser denies site data access. */
export function getWebStorage(name: WebStorageName): Storage | undefined {
  if (!IS_BROWSER) return undefined;
  try {
    return window[name];
  } catch {
    return undefined;
  }
}

/** Writes `value` under `key`, or removes it when `value` is null. Never throws. */
export function writeWebStorage(name: WebStorageName, key: string, value: string | null): void {
  try {
    const storage = getWebStorage(name);
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // A full storage keeps the value in memory only.
  }
}
