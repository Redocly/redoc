import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { isRecord } from '../../../utils/is-record.js';
import { asString } from '../../../utils/string.js';
import { titleize } from './helpers.js';
import { SUPPORTED_MCP_TYPES, type McpCollectionType } from '../constants.js';

export type McpEntity = {
  name: string;
  title?: string;
  /** The entity's string tags, or the collection's default tag when it has none. */
  tags: string[];
  collectionType: McpCollectionType;
};

/** The `x-mcp` tools, resources and prompts that are objects with a string `name`; others are skipped. */
export function mcpEntities(document: OpenAPIDefinition): McpEntity[] {
  const mcp: unknown = document['x-mcp'];
  if (!isRecord(mcp)) return [];
  return SUPPORTED_MCP_TYPES.flatMap((collectionType) => {
    const entities = mcp[collectionType];
    if (!Array.isArray(entities)) return [];
    return entities.flatMap((entity: unknown) => {
      if (!isRecord(entity) || typeof entity.name !== 'string') return [];
      const tags = Array.isArray(entity.tags)
        ? entity.tags.filter((tag): tag is string => typeof tag === 'string')
        : [];
      return [
        {
          name: entity.name,
          title: asString(entity.title),
          tags: tags.length > 0 ? tags : [titleize(collectionType)],
          collectionType,
        },
      ];
    });
  });
}
