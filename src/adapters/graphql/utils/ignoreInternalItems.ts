export function ignoreInternalItems<T extends { name: string }>(items: T[]): T[] {
  return items.filter((item) => !item.name.startsWith('__'));
}
