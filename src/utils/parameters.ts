import { fromSessionStorage, toSessionStorage } from './session-storage.js';

export function getParameterValue(_in: string, name: string): string | null {
  try {
    return JSON.parse(fromSessionStorage(`${_in}.${name}`));
  } catch {
    return null;
  }
}

export function setParameterValue(_in: string, name: string, value: GenericObject): void {
  toSessionStorage(`${_in}.${name}`, JSON.stringify(value));
}
