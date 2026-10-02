import type { GraphQLSchema } from 'graphql';
import type { MenuConfig, MenuGroupConfig, ItemNameSpec } from '../../../types/graphql.js';

import { MENU_GROUP_FILTER_KEYS } from './constants.js';
import { MENU_SLASH_DELIMITED_REGEX } from './menuSlashRegex.js';
import { validateGraphqlMenuConfig } from './validateMenuConfig.js';

export function normalizeMenuConfig(
  menu?: MenuConfig,
  schema?: GraphQLSchema,
): MenuConfig | undefined {
  if (!menu) return undefined;

  if (schema) {
    validateGraphqlMenuConfig(schema, menu);
  }

  const normalized: MenuConfig = {
    requireExactGroups: menu.requireExactGroups,
    otherItemsGroupName: menu.otherItemsGroupName,
  };

  if (Array.isArray(menu.groups)) {
    normalized.groups = menu.groups.map((group) => {
      const normalizedGroup: MenuGroupConfig = {
        name: group.name,
      };

      for (const key of MENU_GROUP_FILTER_KEYS) {
        const filter = group[key];
        if (filter && typeof filter === 'object') {
          normalizedGroup[key] = {
            includeByName: normalizePatterns(filter.includeByName),
            excludeByName: normalizePatterns(filter.excludeByName),
          };
        }
      }

      return normalizedGroup;
    });
  }

  return normalized;
}

function normalizePatterns(patterns: ItemNameSpec[] | undefined): ItemNameSpec[] | undefined {
  if (!patterns || !Array.isArray(patterns)) {
    return undefined;
  }

  return patterns.map((pattern) => {
    if (typeof pattern === 'string') {
      return parseRegexPattern(pattern);
    }
    if (pattern instanceof RegExp) {
      return pattern;
    }
    if (typeof pattern === 'object' && pattern !== null && 'source' in pattern) {
      const regexLike = pattern as { source: string; flags?: string };
      return new RegExp(regexLike.source, regexLike.flags || '');
    }
    return String(pattern);
  });
}

function parseRegexPattern(pattern: string): RegExp | string {
  const regexMatch = pattern.match(MENU_SLASH_DELIMITED_REGEX);
  if (regexMatch) {
    return new RegExp(regexMatch[1], regexMatch[2]);
  }
  return pattern;
}
