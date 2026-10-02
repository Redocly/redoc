import { type RbacScope, readRbacScope, rbacProp } from '../../rbac.js';
import type { ApiItem, BreadcrumbItem, GroupItem } from '../../../types/store.js';
import type { OpenAPIDefinition, TagData } from '../../../types/openapi.js';

import {
  DEFAULT_WEBHOOKS_TAG_NAME,
  GROUP_DEPTH,
  MAX_NESTING_TAGS_LEVEL,
} from '../../../constants/openapi.js';
import { encodeBackSlashes, safeSlugify } from '../../../utils/string.js';
import { joinWithSeparator, toRelativePath } from '../../../utils/url.js';
import { extractMarkdownSections, buildMarkdownSectionItem } from '../../utils/markdoc.js';
import { buildGroupContent } from './content.js';
import { addOperationItems } from '../items/operation/item.js';
import { addSchemaDefinitionItems } from '../items/schema/item.js';
import { addMcpItems, type McpGroupItems } from '../items/mcp/item.js';
import { openApiContext } from '../buildContext.js';

export function addTagItems(document: OpenAPIDefinition, result: ApiItem[]): void {
  const context = openApiContext.get();
  const childTagNames = getChildTagNames(context.tagsMap);
  const tagOrder = getTagOrder(document);
  const xTagGroups = document['x-tagGroups'];

  const hasNestedTags = childTagNames.size > 0;

  if (hasNestedTags) {
    processRootTags(tagOrder, childTagNames, result);
  } else if (xTagGroups?.length) {
    processTagGroups(xTagGroups, result);
  } else {
    processRootTags(tagOrder, childTagNames, result);
  }
}

export function processTagGroups(
  xTagGroups: Array<{ name: string; tags: string[] }>,
  result: ApiItem[],
): void {
  const context = openApiContext.get();

  for (const group of xTagGroups) {
    result.push({
      type: 'separator',
      label: group.name,
      ...rbacProp(readRbacScope(group)),
      content: null,
    });

    for (const tagName of group.tags || []) {
      const tagData = context.tagsMap.get(tagName);
      if (tagData) {
        addSingleTagItem(tagName, tagData, result, [], undefined, readRbacScope(group));
      }
    }
  }
}

export function processRootTags(
  tagOrder: string[],
  childTagNames: Set<string>,
  result: ApiItem[],
): void {
  const context = openApiContext.get();
  const processedTags = new Set<string>();

  for (const tagName of tagOrder) {
    if (!childTagNames.has(tagName)) {
      const tagData = context.tagsMap.get(tagName);
      if (tagData) {
        addTagWithChildren(tagName, tagData, result, processedTags);
      }
    }
  }
}

function isNonNavTag(tag: { kind?: string }): boolean {
  return tag.kind === 'badge' || tag.kind === 'audience';
}

function buildTagSlug(basePath: string, tagName: string): string {
  return joinWithSeparator(basePath, encodeBackSlashes(safeSlugify(tagName).toLowerCase()));
}

function getChildTagNames(tagsMap: Map<string, TagData>): Set<string> {
  const childNames = new Set<string>();
  for (const tagData of tagsMap.values()) {
    const { tag } = tagData;
    if (tag.parent && !isNonNavTag(tag)) {
      childNames.add(tag.name);
    }
  }
  return childNames;
}

function getTagOrder(document: OpenAPIDefinition): string[] {
  const context = openApiContext.get();
  const result = (document.tags || []).map((t) => t.name);

  if (!result.includes(DEFAULT_WEBHOOKS_TAG_NAME)) {
    result.push(DEFAULT_WEBHOOKS_TAG_NAME);
  }

  const schemaTag = context.options.schemaDefinitionsTagName;
  if (schemaTag && !result.includes(schemaTag)) {
    result.push(schemaTag);
  }

  for (const tagName of context.collectedTagOrder) {
    if (!result.includes(tagName)) {
      result.push(tagName);
    }
  }

  return result;
}

function addTagWithChildren(
  tagName: string,
  tagData: TagData,
  result: ApiItem[],
  processedTags: Set<string>,
  depth: number = GROUP_DEPTH,
  parentSlug?: string,
  parentRbac?: RbacScope,
): void {
  const context = openApiContext.get();
  if (processedTags.has(tagName)) return;
  if (isNonNavTag(tagData.tag)) return;
  if (depth > MAX_NESTING_TAGS_LEVEL) {
    console.warn('Tags exceed the maximum nesting level.');
    return;
  }
  processedTags.add(tagName);

  const tagSlug = buildTagSlug(parentSlug ?? context.basePath, tagName);
  const effectiveTagRbac = readRbacScope(tagData.tag) ?? parentRbac;

  const childItems: ApiItem[] = [];
  for (const childName of tagData.children) {
    const childData = context.tagsMap.get(childName);
    if (childData) {
      addTagWithChildren(
        childName,
        childData,
        childItems,
        processedTags,
        depth + 1,
        tagSlug,
        effectiveTagRbac,
      );
    }
  }

  addSingleTagItem(tagName, tagData, result, childItems, tagSlug, parentRbac);
}

function computeBreadcrumbs(tagName: string): BreadcrumbItem[] {
  const context = openApiContext.get();
  const crumbs: BreadcrumbItem[] = [];
  let currentTag = context.tagsMap.get(tagName)?.tag;

  while (currentTag?.parent) {
    const parentData = context.tagsMap.get(currentTag.parent);
    if (!parentData) break;
    crumbs.unshift({
      label: parentData.tag.summary || parentData.tag['x-displayName'] || parentData.tag.name,
    });
    currentTag = parentData.tag;
  }

  return crumbs;
}

function addSingleTagItem(
  tagName: string,
  tagData: TagData,
  result: ApiItem[],
  childItems: ApiItem[],
  tagSlug?: string,
  parentRbac?: RbacScope,
): void {
  const context = openApiContext.get();
  const { tag, operations, description } = tagData;
  const effectiveTagRbac = readRbacScope(tag) ?? parentRbac;

  if (tagName === '') {
    addOperationItems({ operations, result });
    return;
  }

  if (!tagSlug) {
    tagSlug = buildTagSlug(context.basePath, tagName);
  }
  const displayName = tag.summary || tag['x-displayName'] || tagName;
  const tagItems: ApiItem[] = [];

  const schemasGroupItems: GroupItem[] = [];
  addSchemaDefinitionItems({
    tagName,
    tagSlug,
    result: tagItems,
    groupItems: schemasGroupItems,
  });

  const mcpGroupItems: McpGroupItems = { tools: [], resources: [], prompts: [] };
  addMcpItems({ tagName, tagSlug, result: tagItems, groupItems: mcpGroupItems });

  if (description && context.processContent) {
    const operationId = toRelativePath(tagSlug, context.basePath);
    for (const section of extractMarkdownSections(
      description,
      context.options,
      operationId,
      !!tagName,
    )) {
      tagItems.push(
        buildMarkdownSectionItem({
          heading: section,
          basePath: context.basePath,
        }),
      );
    }
  }

  addOperationItems({
    operations,
    result: tagItems,
    basePath: tagSlug,
    parentRbac: effectiveTagRbac,
  });

  tagItems.push(...childItems);

  if (tagName === DEFAULT_WEBHOOKS_TAG_NAME && tagItems.length === 0) {
    return;
  }

  const breadcrumbs = computeBreadcrumbs(tagName);

  const childTagInfo = tagData.children.map((childName) => {
    const childData = context.tagsMap.get(childName);
    const childTag = childData?.tag;
    return {
      displayName: childTag?.summary || childTag?.['x-displayName'] || childName,
      summary: childTag?.summary,
      slug: buildTagSlug(tagSlug, childName),
    };
  });

  result.push({
    type: 'group',
    label: displayName,
    link: tagSlug,
    routeSlug: tagSlug,
    items: tagItems,
    ...rbacProp(effectiveTagRbac),
    content: context.processContent
      ? buildGroupContent({
          tag,
          tagName,
          headerLabel: displayName,
          description,
          operations,
          schemasItems: schemasGroupItems.length > 0 ? schemasGroupItems : undefined,
          mcpItems: mcpGroupItems,
          tagSlug: tagSlug,
          basePath: context.basePath,
          breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs : undefined,
          childTags: childTagInfo.length > 0 ? childTagInfo : undefined,
          markdownOptions: context.options,
        })
      : null,
  });
}
