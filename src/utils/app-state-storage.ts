import { getWebStorage, writeWebStorage } from './web-storage.js';

export function readAppState(key: string): string | undefined {
  return getWebStorage('localStorage')?.getItem(key) ?? undefined;
}

/** Removes the value when `value` is null. Never throws. */
export function writeAppState(key: string, value: string | null): void {
  writeWebStorage('localStorage', key, value);
}
