export function areArraysEqual(arr1: unknown[], arr2: unknown[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}
