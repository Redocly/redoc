import type { ApiItem, GroupItem } from '../../../../types/store.js';

import { encodeBackSlashes, safeSlugify } from '../../../../utils/string.js';
import { type McpCollectionType } from '../../constants.js';
import { mcpEntities } from '../../utils/mcp.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../../../../utils/url.js';
import { buildMcpItemContent } from './content.js';
import { openApiContext } from '../../buildContext.js';

const MCP_ITEM_TYPE: Record<McpCollectionType, 'tool' | 'rsrc' | 'prompt'> = {
  tools: 'tool',
  resources: 'rsrc',
  prompts: 'prompt',
};

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
  const entities = mcpEntities(document).filter((entity) => entity.tags.includes(tagName));

  for (const entity of entities) {
    const mcpType = MCP_ITEM_TYPE[entity.collectionType];
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

    groupItems?.[entity.collectionType]?.push(groupItem);
  }
}

export type McpGroupItems = Record<McpCollectionType, GroupItem[]>;
