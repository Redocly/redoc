
import type { OpenAPITag } from '../types/index.js';
import type { MarkdownHeading, MenuItemGroupType, TagInfo } from '../services/index.js';
import type { ContentItemModel, GroupModel } from './types.js';

import { joinWithSeparator } from '../services/index.js';
import { getValueFromMdParsedExtension, safeSlugify } from '../utils/index.js';
import { getHref } from '../services/menu/operation.js';
import { saveTextBeforeHeading } from '../utils/saveTextBeforeHeading.js';

export function getTagOrGroup(
  type: MenuItemGroupType,
  tagOrGroup: OpenAPITag | MarkdownHeading,
  parent?: GroupModel,
): GroupModel {
  let id: string;
  if (
    parent?.id &&
    (type === 'schema' || type === 'tool' || type === 'rsrc' || type === 'prompt')
  ) {
    // handle schemas ids similar to how it is done for operations
    id = joinWithSeparator(parent.id, safeSlugify(tagOrGroup.name));
  } else {
    id = (tagOrGroup as MarkdownHeading).id || safeSlugify(tagOrGroup.name);
  }
  const name = tagOrGroup['x-displayName'] || tagOrGroup.name;
  const level = (tagOrGroup as MarkdownHeading).level || 1;
  const isSchema = (tagOrGroup as TagInfo).isSchema;
  const ast = (tagOrGroup as MarkdownHeading).ast || undefined;
  const description = saveTextBeforeHeading(
    getValueFromMdParsedExtension(tagOrGroup, 'description') || '',
  );

  const items = (tagOrGroup as ContentItemModel).items || [];

  const externalDocs = (tagOrGroup as OpenAPITag).externalDocs;
  return {
    id: id.toLowerCase(),
    type,
    parent,
    name,
    level,
    depth: 0,
    isSchema,
    description,
    items,
    ast,
    externalDocs,
    href: getHref({ id }),
  };
}
