import markdoc from '@markdoc/markdoc';

import type { Node } from '@markdoc/markdoc';
import type { ContentItemModel, GroupModel } from '../../models/index.js';
import type { MarkdownHeading } from '../types.js';

import { isString } from '@redocly/theme/core/openapi';

import { getTagOrGroup } from '../../models/index.js';
import { safeSlugify, unescapeHTMLChars } from '../../utils/index.js';
import { simplifyAstStructure } from '../../utils/simplifyAstStructure.js';

/**
 * extracts items from markdown description
 * @param description - markdown source
 * @param parent
 * @param initialDepth - number of items depth
 */
export function addMarkdownItems(
  description: string | GenericObject,
  parent: GroupModel | undefined,
  initialDepth: number,
): ContentItemModel[] {
  const ast = isString(description)
    ? simplifyAstStructure(markdoc.parse(description))
    : markdoc.Ast.fromJSON(JSON.stringify(description?.result));
  const items: MarkdownHeading[] = [];
  let currentTopHeading: MarkdownHeading | undefined;

  const saveHeading = (
    name: string,
    level: number,
    container = items,
    node: Node,
    parentId?: string,
  ): MarkdownHeading => {
    name = unescapeHTMLChars(name);

    // use custom id or generate id
    let id;
    if (node.attributes.id) {
      id = node.attributes.id;
    } else {
      id = parentId ? `${parentId}/${safeSlugify(name)}` : `section/${safeSlugify(name)}`;
      node.attributes.id = id;
    }

    const item = {
      id: id.toLowerCase(),
      name,
      level,
      items: [],
      ast: [node],
    };

    container.push(item);
    return item;
  };

  const saveContent = (container: MarkdownHeading[], node: Node) => {
    container[container.length - 1]?.ast?.push(node);
  };

  const processAst = (node: Node) => {
    const name = getMarkdownContent(node) || '';

    // use tag id as prefix instead of just "section" to avoid identical header ids in different tags
    const isTagContext = parent && parent.type === 'tag';
    const parentId = isTagContext ? parent.id : undefined;

    if (node.type === 'heading' && node.attributes.level === 1) {
      // h1
      currentTopHeading = saveHeading(name, node.attributes.level, undefined, node, parentId);
    } else if (node.attributes.level) {
      // h2, h3, h4 etc
      saveHeading(
        name,
        node.attributes.level,
        currentTopHeading?.items,
        node,
        currentTopHeading?.id ?? parentId,
      );
    } else {
      // text, p, etc
      if (currentTopHeading?.items?.length) {
        saveContent(currentTopHeading?.items, node);
      } else if (items?.length) {
        saveContent(items, node);
      }
    }
  };

  if (Array.isArray(ast)) {
    for (const node of ast) {
      processAst(node);
    }
  } else {
    processAst(ast);
  }

  return mapHeadingsDeep(parent, items, initialDepth);
}

function mapHeadingsDeep(parent: GroupModel | undefined, items: MarkdownHeading[], depth = 1) {
  return items.map((heading) => {
    const group = getTagOrGroup('section', heading, parent);
    group.depth = depth;
    if (heading.items) {
      group.items = mapHeadingsDeep(group, heading.items, depth + 1);
    }

    return group;
  });
}

function getMarkdownContent(node: Node | undefined): string | undefined {
  if (typeof node?.attributes?.content === 'string') {
    return node.attributes?.content;
  }

  if (node?.children) {
    return getMarkdownContent(node.children[0]);
  }
}
