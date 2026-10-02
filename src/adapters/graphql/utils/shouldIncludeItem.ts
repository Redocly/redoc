import type { TypeGroupFilter, ItemNameSpec } from '../../../types/graphql.js';

export function shouldIncludeItem(
  itemName: string,
  specific?: TypeGroupFilter,
  common?: TypeGroupFilter,
): boolean {
  if (
    matchesPatterns(itemName, specific?.excludeByName) ||
    matchesPatterns(itemName, common?.excludeByName)
  ) {
    return false;
  }

  const specificIncludes = specific?.includeByName;
  const commonIncludes = common?.includeByName;

  if (!specificIncludes?.length && !commonIncludes?.length) return false;

  return matchesPatterns(itemName, specificIncludes) || matchesPatterns(itemName, commonIncludes);
}

function matchesPatterns(name: string, patterns?: ItemNameSpec[]): boolean {
  if (!patterns?.length) return false;
  return patterns.some((pattern) => matchesNamePattern(name, pattern));
}

function matchesNamePattern(name: string, pattern: ItemNameSpec): boolean {
  if (typeof pattern === 'string') return name === pattern;
  if (pattern instanceof RegExp) return pattern.test(name);

  // Handle regex-like objects (e.g., from JSON deserialization)
  if (typeof pattern === 'object' && pattern !== null && 'source' in pattern) {
    const regexLike = pattern as { source: string; flags?: string };
    const regex = new RegExp(regexLike.source, regexLike.flags || '');
    return regex.test(name);
  }

  return false;
}
