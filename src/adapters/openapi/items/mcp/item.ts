import type { ApiItem, GroupItem } from '../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';

import { encodeBackSlashes, safeSlugify } from '../../../../utils/string.js';
import { SUPPORTED_MCP_TYPES, type McpCollectionType } from '../../constants.js';
import { titleize } from '../../utils/helpers.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../../../../utils/url.js';
import { buildMcpItemContent } from './content.js';
import { openApiContext } from '../../buildContext.js';

type McpEntity = {
  name: string;
  title?: string;
  description?: string;
  tags?: string[];
};

const MCP_ITEM_TYPE: Record<McpCollectionType, 'tool' | 'rsrc' | 'prompt'> = {
  tools: 'tool',
  resources: 'rsrc',
  prompts: 'prompt',
};

function getMcpEntitiesForTag(
  tagName: string,
  document: OpenAPIDefinition,
): Array<{ entity: McpEntity; collectionType: McpCollectionType }> {
  const mcp = document['x-mcp'];

  if (!mcp) return [];

  const result: Array<{ entity: McpEntity; collectionType: McpCollectionType }> = [];

  for (const collectionType of SUPPORTED_MCP_TYPES) {
    const entities = mcp[collectionType] as McpEntity[] | undefined;

    if (!entities) continue;

    const defaultTag = titleize(collectionType);
    for (const entity of entities) {
      const entityTags = entity.tags?.length ? entity.tags : [defaultTag];
      if (entityTags.includes(tagName)) {
        result.push({ entity, collectionType });
      }
    }
  }

  return result;
}

export function addMcpItems({
  tagName,
  tagSlug,
  result,
  groupItems,
}: {
  tagName: string;
  tagSlug: string;
  result: ApiItem[];
  groupItems?: McpGroupItems;
}): void {
  const { document, options, processContent, basePath } = openApiContext.get();
  const mcpEntities = getMcpEntitiesForTag(tagName, document);

  for (const { entity, collectionType } of mcpEntities) {
    const mcpType = MCP_ITEM_TYPE[collectionType];
    const displayName = entity.title || entity.name;
    const segment = encodeBackSlashes(
      safeSlugify(entity.name).toLowerCase() || entity.name.toLowerCase(),
    );
    const slug = normalizePath(joinWithSeparator(tagSlug, segment));
    const id = joinWithSeparator(tagSlug, safeSlugify(entity.name));

    const item: ApiItem = {
      type: 'link',
      label: displayName,
      link: slug,
      routeSlug: slug,
      httpVerb: mcpType,
      content: processContent
        ? buildMcpItemContent(mcpType, entity.name, id, displayName, options)
        : null,
    };
    result.push(item);

    const groupItem: GroupItem = {
      title: displayName,
      prefix: { name: mcpType, color: mcpType },
      link: normalizePath(toRelativePath(slug, basePath)),
      deprecated: false,
    };

    groupItems?.[collectionType]?.push(groupItem);
  }
}

export type McpGroupItems = Record<McpCollectionType, GroupItem[]>;
