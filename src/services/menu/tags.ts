import type { OpenAPIParser } from '../OpenAPIParser.js';
import type { ContentItemModel, GroupModel, OperationMenuItem } from '../../models/index.js';
import type { TagGroup, TagsInfoMap, TagInfo } from '../types.js';
import type { Options } from '../config-options/types.js';
import type {
  OpenAPISchema,
  OpenAPITag,
  OpenAPIPaths,
  OpenAPIDefinition,
  OpenAPIMcp,
} from '../../types/index.js';

import { getTagOrGroup } from '../../models/group.js';
import { DEFAULT_WEBHOOKS_TAG_NAME, GROUP_DEPTH } from '../../constants.js';
import {
  getValueFromMdParsedExtension,
  isOperationName,
  JsonPointer,
  safeSlugify,
} from '../../utils/index.js';
import { getOperationsItems } from './operation.js';
import { addMarkdownItems } from './markdown.js';
import { joinWithSeparator } from '../history/helpers.js';

const SUPPORTED_MCP_TYPES = ['tools', 'resources', 'prompts']; // TODO: implement resources and prompts

/**
 * Returns array of OperationsGroup items for the tags of the group or for all tags
 * @param parser
 * @param tagsMap tags info returned from `getTagsWithOperations`
 * @param parent parent item
 * @param group group which this tag belongs to. if not provided gets all tags
 * @param options - normalized options
 */
export function getTagsItems(
  parser: OpenAPIParser,
  tagsMap: TagsInfoMap,
  parent: GroupModel | undefined,
  group: TagGroup | undefined,
  options: Options,
): ContentItemModel[] {
  let tagNames;

  if (group === undefined) {
    tagNames = Object.keys(tagsMap);
  } else {
    tagNames = group.tags;
  }

  if (!Array.isArray(tagNames)) {
    console.warn('Unexpected values of tags. Check tags or x-tagGroups in your definition.');
    return [];
  }

  const tags = tagNames.map((tagName) => {
    if (!tagsMap[tagName]) {
      console.warn(`Non-existing tag "${tagName}" is added to the group "${group?.name}"`);
      return null;
    }
    tagsMap[tagName].used = true;
    return tagsMap[tagName];
  });

  const res: Array<GroupModel | OperationMenuItem> = [];
  for (const tag of tags) {
    if (!tag) continue;

    const item = getTagOrGroup('tag', tag, parent);
    item.depth = GROUP_DEPTH + 1;

    // don't put empty tag into content, instead put its operations
    if (tag.name === '') {
      const items = [
        ...addMarkdownItems(
          getValueFromMdParsedExtension(tag, 'description') || '',
          item,
          item.depth + 1,
        ),
        ...getOperationsItems(undefined, tag, item.depth + 1),
      ];
      res.push(...items);
      continue;
    }

    const relatedSchemas = getTagRelatedSchema({
      definition: parser.definition,
      tag,
      parent: item,
      schemaDefinitionsTagName: options.schemaDefinitionsTagName,
    });

    const relatedMcp = getTagRelatedMcp(parser.definition, tag, item);

    item.items = [
      ...relatedSchemas,
      ...relatedMcp,
      ...addMarkdownItems(
        getValueFromMdParsedExtension(tag, 'description') || '',
        item,
        item.depth + 1,
      ),
      ...getOperationsItems(item, tag, item.depth + 1),
    ];

    res.push(item);
  }

  return res.filter(({ name, items }) => name !== DEFAULT_WEBHOOKS_TAG_NAME || items.length > 0);
}

/**
 * Returns array of OperationsGroup items for the tag groups (x-tagGroups vendor extension)
 * @param parser
 * @param parent
 * @param groups
 * @param tags value of `x-tagGroups` vendor extension
 * @param options - normalized options
 */
export function getTagGroupsItems(
  parser: OpenAPIParser,
  parent: GroupModel | undefined,
  groups: TagGroup[],
  tags: TagsInfoMap,
  options: Options,
): GroupModel[] {
  const res: GroupModel[] = [];
  for (const group of groups) {
    const item = getTagOrGroup('group', group, parent);
    item.depth = GROUP_DEPTH;
    item.items = getTagsItems(parser, tags, item, group, options);
    res.push(item);
  }
  return res;
}

/**
 * Returns array of schemas with reference to tag, or schemas with reference to schemaDefinitionsTagName tag
 * @param tagsMap all tags
 * @param tag tag to find reference of schema
 * @param schemaDefinitionsTagName config
 */
function getTagRelatedSchema({
  definition,
  tag,
  parent,
  schemaDefinitionsTagName,
}: {
  definition: OpenAPIDefinition;
  tag: TagInfo;
  parent: GroupModel;
  schemaDefinitionsTagName?: string;
}): GroupModel[] {
  const defaultTags = schemaDefinitionsTagName ? [schemaDefinitionsTagName] : [];

  return Object.entries(definition.components?.schemas || {})
    .map(([schemaName, schema]) => {
      const schemaTags = schema['x-tags'] || defaultTags;
      if (!schemaTags.includes(tag.name)) return null;

      const item = getTagOrGroup(
        'schema',
        {
          name: schemaName,
          'x-displayName': `${(schema as OpenAPISchema).title || schemaName}`,
          description: `{% schemaDefinition showWriteOnly="true" schemaRef="#/components/schemas/${schemaName}" /%}`,
          isSchema: true,
          level: 2,
        } as OpenAPITag,
        parent,
      );
      item.depth = parent.depth + 1;
      return item;
    })
    .filter(Boolean) as GroupModel[];
}

function getTagRelatedMcp(
  definition: OpenAPIDefinition,
  tag: TagInfo,
  parent: GroupModel,
): GroupModel[] {
  const res: GroupModel[] = [];
  for (const type of SUPPORTED_MCP_TYPES) {
    if (definition['x-mcp']?.[type]) {
      const typeName = capitalize(type);
      const defaultTags = [typeName];
      for (const tool of definition['x-mcp']?.[type] || []) {
        const toolTags = tool.tags?.length ? tool.tags : defaultTags;
        if (toolTags.includes(tag.name)) {
          const id = joinWithSeparator(parent.id, safeSlugify(tool.name));
          const prefix = type === 'tools' ? `Tool name: \`${tool.name}\`\n\n` : '';
          const customType = type === 'tools' ? 'tool' : type === 'resources' ? 'rsrc' : 'prompt';
          const item = getTagOrGroup(
            customType,
            {
              name: tool.name,
              'x-displayName': tool.title || tool.name,
              description: `${prefix}${tool.description || ''}\n{% mcp${typeName.slice(0, -1)} name="${tool.name}" id="${id}" /%}`,
              isSchema: true,
              level: 2,
            } as OpenAPITag,
            parent,
          );
          item.depth = parent.depth + 1;
          res.push(item);
        }
      }
    }
  }
  return res;
}

/**
 * collects tags and maps each tag to list of operations belonging to this tag
 */
export function getTagsWithOperations(
  parser: OpenAPIParser,
  explicitTags: OpenAPITag[],
): TagsInfoMap {
  const { definition } = parser;
  const tags: TagsInfoMap = {};
  const webhooks = definition['x-webhooks'] || definition.webhooks;
  const mcp = definition['x-mcp'];

  for (const tag of explicitTags || []) {
    tags[tag.name] = { ...tag, operations: [] };
  }

  if (definition.paths) {
    getTags(parser, definition.paths, tags);
  }

  if (webhooks) {
    getTags(parser, webhooks, tags, true);
  }

  if (mcp) {
    getMcpTags(mcp, tags);
  }

  return tags;
}

function getMcpTags(mcp: OpenAPIMcp, tags: TagsInfoMap) {
  for (const type of SUPPORTED_MCP_TYPES) {
    if (mcp[type]) {
      for (const tool of mcp[type]) {
        const toolTags = tool.tags && tool.tags.length ? tool.tags : [capitalize(type)];
        for (const tagName of toolTags) {
          let tag = tags[tagName];
          if (tag === undefined) {
            tag = { name: tagName, operations: [], used: true };
            tags[tagName] = tag;
          }
        }
      }
    }
  }
}

export function processOperation(
  parser: OpenAPIParser,
  operationName: string,
  operationInfo: any,
  pathName: string,
  path: any,
  tags: TagsInfoMap,
  isWebhook?: boolean,
  isAdditionalOperation?: boolean,
) {
  if (path.$ref) {
    const { resolved: resolvedPaths } = parser.deref<OpenAPIPaths>(path as OpenAPIPaths);
    getTags(parser, { [pathName]: resolvedPaths }, tags, isWebhook);
    return;
  }

  let operationTags = operationInfo?.tags;

  if (!operationTags || !operationTags.length) {
    // empty tag for operations and default tag for webhooks
    operationTags = isWebhook ? [DEFAULT_WEBHOOKS_TAG_NAME] : [''];
  }

  for (const tagName of operationTags) {
    let tag = tags[tagName];
    if (tag === undefined) {
      tag = {
        name: tagName,
        operations: [],
      };
      tags[tagName] = tag;
    }
    if (tag['x-traitTag']) {
      continue;
    }
    tag.operations.push({
      ...operationInfo,
      pathName,
      pointer: JsonPointer.compile(['paths', pathName, operationName]),
      httpVerb: operationName,
      pathParameters: path.parameters || [],
      pathServers: path.servers,
      isWebhook: !!isWebhook,
      isAdditionalOperation: !!isAdditionalOperation,
    });
  }
}

function getTags(
  parser: OpenAPIParser,
  paths: OpenAPIPaths,
  tags: TagsInfoMap,
  isWebhook?: boolean,
) {
  for (const pathName of Object.keys(paths || {})) {
    const path = paths[pathName];
    const operations = Object.keys(path).filter(isOperationName);

    for (const operationName of operations) {
      const operationInfo = path[operationName];
      processOperation(parser, operationName, operationInfo, pathName, path, tags, isWebhook);
    }

    if (path.additionalOperations) {
      for (const [operationName, operationInfo] of Object.entries(path.additionalOperations)) {
        processOperation(
          parser,
          operationName,
          operationInfo,
          pathName,
          path,
          tags,
          isWebhook,
          true,
        );
      }
    }
  }
}

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
