import type { Node } from '@markdoc/markdoc';
import type { ContentNode, OverviewSectionWrapperNode } from '../../types/content.js';
import type { ApiItem } from '../../types/store.js';
import type { ApiDocsOptions } from '../../types/options.js';
import type { MarkdownHeading } from '../../types/openapi.js';

import { contentType, itemVariant, nodeTypes } from '../../types/common.js';
import { safeSlugify } from '../../utils/string.js';
import type { ParseMarkdownOptions } from './parseMarkdown.js';
import { parseMarkdown } from './parseMarkdown.js';
import { isPlainText } from './isPlainText.js';
import { joinWithSeparator } from '../../utils/url.js';
import { buildDeepLinkUrl } from '../../utils/deep-link.js';
import { getDOMPurify } from './dompurify.js';

export type { MarkdownHeading };
export type MarkdownSanitizeOptions = {
  sanitize?: ApiDocsOptions['sanitize'];
};

export type DescriptionSegment =
  | { kind: 'markdoc'; node: ContentNode }
  | { kind: 'schemaDefinition'; node: ContentNode };

type ExtractDescriptionSegmentsOptions = {
  sliceAtFirstHeading?: boolean;
};

function isSchemaDefinitionTag(node: Node): boolean {
  return node.type === 'tag' && node.tag === 'schemaDefinition';
}

const ATX_HEADING_RE = /^[ \t]{0,3}#{1,6}[ \t]/m;

// The raw source before the first ATX heading line. Only a heuristic for the plain-text fast
// path below: misses (setext headings, `#` inside a fence) leave markdown syntax in the prefix,
// which fails isPlainText and falls back to real parsing — never a wrong result.
function contentUntilFirstAtxHeading(source: string): string {
  const headingIndex = source.search(ATX_HEADING_RE);
  return headingIndex === -1 ? source : source.slice(0, headingIndex);
}

export function extractContentUntilFirstHeading(
  ast: Node | Node[] | string | undefined,
  options?: ParseMarkdownOptions,
): Node[] | string | undefined {
  if (typeof ast === 'string') {
    const prefix = contentUntilFirstAtxHeading(ast).trim();
    if (isPlainText(prefix)) {
      return prefix;
    }
  }

  const normalizedAst = parseMarkdown(ast, options);

  if (!normalizedAst) {
    return;
  }

  if (typeof normalizedAst === 'string') {
    return normalizedAst;
  }

  if (Array.isArray(normalizedAst)) {
    const headingIndex = normalizedAst.findIndex((node) => node.type === 'heading');
    return headingIndex === -1 ? normalizedAst : normalizedAst.slice(0, headingIndex);
  }

  if (!normalizedAst.children || !Array.isArray(normalizedAst.children)) {
    return;
  }

  const headingIndex = normalizedAst.children.findIndex((node) => node.type === 'heading');
  if (headingIndex === -1) {
    return [normalizedAst];
  }

  // Never truncate in place: the AST may be shared and section extraction reads it next.
  return normalizedAst.children.slice(0, headingIndex);
}

export function extractDescriptionSegments(
  ast: Node | Node[] | string | undefined,
  options?: ParseMarkdownOptions,
  { sliceAtFirstHeading = false }: ExtractDescriptionSegmentsOptions = {},
): DescriptionSegment[] {
  if (typeof ast === 'string' && sliceAtFirstHeading) {
    const prefix = contentUntilFirstAtxHeading(ast).trim();
    if (isPlainText(prefix)) {
      return [{ kind: 'markdoc', node: { nodeType: nodeTypes.MARKDOC, content: prefix } }];
    }
  }

  const normalizedAst = parseMarkdown(ast, options);
  if (!normalizedAst) return [];

  if (typeof normalizedAst === 'string') {
    return [{ kind: 'markdoc', node: { nodeType: nodeTypes.MARKDOC, content: normalizedAst } }];
  }

  let topLevel = Array.isArray(normalizedAst) ? normalizedAst : (normalizedAst.children ?? []);
  if (sliceAtFirstHeading) {
    const headingIndex = topLevel.findIndex((node) => node.type === 'heading');
    if (headingIndex !== -1) topLevel = topLevel.slice(0, headingIndex);
  }

  const segments: DescriptionSegment[] = [];
  let inlineBatch: Node[] = [];

  const flushInline = (): void => {
    if (inlineBatch.length > 0) {
      segments.push({
        kind: 'markdoc',
        node: { nodeType: nodeTypes.MARKDOC, content: inlineBatch },
      });
      inlineBatch = [];
    }
  };

  for (const node of topLevel) {
    if (isSchemaDefinitionTag(node)) {
      flushInline();
      segments.push({
        kind: 'schemaDefinition',
        node: { nodeType: nodeTypes.MARKDOC, content: [node] },
      });
    } else {
      inlineBatch.push(node);
    }
  }
  flushInline();
  return segments;
}

export function resolveMarkdocHeadingDeepSuffix(
  id: string,
  operationId: string,
  deepLinkSuffix?: string,
): string {
  const raw = id.toLowerCase();
  const resolvedSuffix = raw.startsWith('section/') ? raw.slice('section/'.length) : raw;

  const routeKey = operationId.toLowerCase();
  let deepSuffix = resolvedSuffix !== routeKey ? resolvedSuffix : '';
  if (deepLinkSuffix) {
    deepSuffix = joinWithSeparator(deepLinkSuffix, deepSuffix);
  }
  return deepSuffix;
}

// TODO: remove once the portal no longer re-runs buildItems twice
function stripBasePrefixes(id: string, ...bases: Array<string | undefined>): string {
  let result = id.toLowerCase();
  for (const base of bases) {
    const prefix = base ? `${base.toLowerCase()}/` : '';
    if (prefix && `${result}/`.startsWith(prefix)) {
      result = result.slice(prefix.length);
    }
  }
  return result;
}

export const HEADING_SCOPE_VARIABLE = '$$apiDocsHeadingScope';

export type HeadingScope = { operationId: string; deepLinkSuffix?: string };

/** Scope of a partial outside any `#` section of the overview: the ids inline headings get. */
export const OVERVIEW_ROOT_SCOPE: HeadingScope = { operationId: '', deepLinkSuffix: 'section' };

export function scopedHeadingAttributes(
  relativeId: string,
  { operationId, deepLinkSuffix }: HeadingScope,
): { id: string; deepLinkHash: string } {
  const deepSuffix = resolveMarkdocHeadingDeepSuffix(relativeId, operationId, deepLinkSuffix);
  return {
    id: joinWithSeparator(operationId, deepSuffix).toLowerCase(),
    deepLinkHash: buildDeepLinkUrl('', operationId, deepSuffix),
  };
}

function stampPartialScope(node: Node, scope: HeadingScope): void {
  if (node.type === 'tag' && node.tag === 'partial') {
    node.attributes.variables = { ...node.attributes.variables, [HEADING_SCOPE_VARIABLE]: scope };
  }
}

function scopePartialHeadings(node: Node, scope: HeadingScope): void {
  stampPartialScope(node, scope);
  for (const child of node.children ?? []) {
    scopePartialHeadings(child, scope);
  }
}

export function resolveMarkdocHeadingIds(
  ast: Node | Node[] | string,
  operationId: string,
  deepLinkSuffix?: string,
): void {
  if (typeof ast === 'string') {
    return;
  }

  const walk = (node: Node): void => {
    if (node.type === 'heading' && node.attributes?.level) {
      // Whole inline subtree, matching the render-time fallback in `getMarkdownHeaderId`;
      // taking only the first text node truncates `## Mixed \`code\` and **bold**` to `mixed`.
      const relativeId = node.attributes.id
        ? stripBasePrefixes(node.attributes.id, operationId, deepLinkSuffix)
        : safeSlugify(collectTextContent(node).trim()).toLowerCase();
      // Nothing to slug (a heading holding only an image): an empty relative id would
      // resolve to the section suffix itself and collide with that section's own anchor.
      if (relativeId) {
        Object.assign(
          node.attributes,
          scopedHeadingAttributes(relativeId, { operationId, deepLinkSuffix }),
        );
      }
    }
    stampPartialScope(node, { operationId, deepLinkSuffix });
    for (const child of node.children ?? []) {
      walk(child);
    }
  };

  if (Array.isArray(ast)) {
    for (const node of ast) {
      walk(node);
    }
  } else {
    walk(ast);
  }
}

export function extractMarkdownSections(
  description: Node | Node[] | string | undefined,
  options?: ParseMarkdownOptions,
  operationId?: string,
  isTagContext?: boolean,
): MarkdownHeading[] {
  const ast = parseMarkdown(description, options);

  if (!ast) return [];

  if (typeof ast === 'string') return [];

  const items: MarkdownHeading[] = [];
  let currentTopHeading: MarkdownHeading | undefined;

  const saveHeading = (
    name: string,
    level: number,
    container: MarkdownHeading[] = items,
    node: Node,
    parentId?: string,
  ): MarkdownHeading => {
    name = unescapeHTMLChars(name);
    const hasParent = parentId !== undefined;

    const base = hasParent ? parentId : operationId;

    let relativeFragment: string;
    if (node.attributes.id) {
      relativeFragment = stripBasePrefixes(node.attributes.id, base);
    } else if (hasParent || isTagContext) {
      relativeFragment = safeSlugify(name);
    } else {
      relativeFragment = `section/${safeSlugify(name)}`;
    }

    const id = joinWithSeparator(base, relativeFragment).toLowerCase();

    node.attributes.id = id;

    const item: MarkdownHeading = {
      id,
      name,
      level,
      items: [],
      ast: [node],
    };
    container.push(item);
    return item;
  };

  const getMarkdownContent = (node: Node | undefined): string | undefined => {
    if (typeof node?.attributes?.content === 'string') {
      return node.attributes.content;
    }
    if (node?.children) {
      return getMarkdownContent(node.children[0]);
    }
    return undefined;
  };

  const processAst = (node: Node): void => {
    const name = getMarkdownContent(node) || '';
    if (!node.attributes?.level) {
      const scopeId = currentTopHeading?.id ?? operationId;
      scopePartialHeadings(node, scopeId ? { operationId: scopeId } : OVERVIEW_ROOT_SCOPE);
    }
    if (node.type === 'heading' && node.attributes?.level === 1) {
      currentTopHeading = saveHeading(name, node.attributes.level, undefined, node);
    } else if (node.attributes?.level) {
      saveHeading(
        name,
        node.attributes.level,
        currentTopHeading?.items,
        node,
        currentTopHeading?.id,
      );
    } else if (currentTopHeading?.items?.length) {
      currentTopHeading.items[currentTopHeading.items.length - 1]?.ast?.push(node);
    } else if (items.length) {
      items[items.length - 1]?.ast?.push(node);
    }
  };

  if (Array.isArray(ast)) {
    for (const node of ast) {
      processAst(node);
    }
  } else if (ast.children) {
    for (const node of ast.children) {
      processAst(node);
    }
  }
  return items;
}

export function buildMarkdownSectionItem({
  heading,
  basePath,
}: {
  heading: MarkdownHeading;
  basePath: string;
}): ApiItem {
  const hasChildren = heading.items.length > 0;
  const slug = joinWithSeparator(basePath, heading.id).toLowerCase();

  const childItems: ApiItem[] = hasChildren
    ? heading.items.map((child) =>
        buildMarkdownSectionItem({
          heading: child,
          basePath,
        }),
      )
    : [];

  return {
    type: hasChildren ? 'group' : 'link',
    label: heading.name,
    link: slug,
    routeSlug: slug,
    items: hasChildren ? childItems : undefined,
    content: buildSectionContent(heading),
  };
}

export function collectMarkdownSections(
  description: Node | Node[] | string | undefined,
  basePath: string,
  options: ParseMarkdownOptions,
): { sectionItems: ApiItem[]; sectionChildren: ContentNode[] } {
  const sectionItems: ApiItem[] = [];
  const sectionChildren: ContentNode[] = [];

  for (const heading of extractMarkdownSections(description, options, '')) {
    const { item, children } = buildSectionItemWithChildren(heading, basePath);
    sectionItems.push(item);
    sectionChildren.push(...children);
  }

  return { sectionItems, sectionChildren };
}

function buildSectionItemWithChildren(
  heading: MarkdownHeading,
  basePath: string,
): { item: ApiItem; children: ContentNode[] } {
  const slug = joinWithSeparator(basePath, heading.id);
  const hasNestedItems = heading.items.length > 0;

  const collectedChildren: ContentNode[] = heading.ast?.length
    ? [toMarkdocNode(heading.ast, joinWithSeparator(basePath, heading.id))]
    : [];

  const nestedItems: ApiItem[] = [];
  for (const child of heading.items) {
    const { item: childItem, children: childMarkdoc } = buildSectionItemWithChildren(
      child,
      basePath,
    );
    nestedItems.push(childItem);
    const subsectionId = joinWithSeparator(basePath, child.id);
    collectedChildren.push({
      nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
      children: childMarkdoc,
      sectionId: subsectionId,
    });
  }

  const item: ApiItem = {
    type: hasNestedItems ? 'group' : 'link',
    label: heading.name,
    link: slug,
    routeSlug: slug,
    items: hasNestedItems ? nestedItems : undefined,
    content: null as unknown as ApiItem['content'],
  };

  return { item, children: collectedChildren };
}

const HTML_TAG =
  /<\/?(?:a|b|i|em|strong|code|pre|br|hr|p|span|div|small|sup|sub|img|ul|ol|li|dl|dt|dd|table|thead|tbody|tr|td|th|blockquote|h[1-6])(?:\s[^>]*)?\/?>/gi;

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[^\n]*(?:\n([\s\S]*?))?```/g, '$1')
    .replace(HTML_TAG, '')
    .replace(/!?\[(?<!\[[^\]()]*?\[)([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, '')
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*>[ \t]?/gm, '')
    .replace(/^[ \t]*(?:[-*][ \t]*){3,}$/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(?=\S)(.*?\S)\*/g, '$1')
    .replace(/`+([^`]*)`+/g, '$1')
    .replace(/\\([\\`*_{}[\]()#+\-.!>])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFullText(ast: Node | Node[] | string): string {
  if (typeof ast === 'string') {
    return stripMarkdown(ast);
  }
  if (Array.isArray(ast)) {
    return ast
      .map((n) => collectTextContent(n))
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  return collectTextContent(ast).trim();
}

export function extractFirstParagraphText(
  ast: Node | Node[] | string,
  maxLength = 50,
): string | undefined {
  if (typeof ast === 'string') {
    const text = ast
      .split(/\n[ \t]*\n/)[0]
      .replace(/\s+/g, ' ')
      .trim();
    return text ? text.substring(0, maxLength) : undefined;
  }

  const topLevelNodes = Array.isArray(ast) ? ast : (ast.children ?? [ast]);
  const firstNode = topLevelNodes[0];

  if (!firstNode) return undefined;

  const text = collectTextContent(firstNode);
  return text ? text.substring(0, maxLength) : undefined;
}

export function extractSummaryText(
  description: string | Node | Node[] | undefined | null,
  options?: ParseMarkdownOptions,
): string | undefined {
  if (!description) {
    return;
  }

  const ast = parseMarkdown(description, options);
  if (!ast) {
    return;
  }

  const text = extractFirstParagraphText(ast);
  return text ? (text.length === 50 ? text + '…' : text) : undefined;
}

export function extractSeoDescriptionText(
  description: string | Node | Node[] | undefined | null,
  options?: ParseMarkdownOptions,
): string | undefined {
  if (!description) {
    return;
  }

  const ast = parseMarkdown(description, options);
  if (!ast) {
    return;
  }

  return extractFirstParagraphText(ast, Number.POSITIVE_INFINITY);
}

function isMarkdocNode(value: unknown): value is Node {
  return !!value && typeof value === 'object' && '$$mdtype' in value;
}

/** One Markdoc node, or a non-empty list of them. */
export function isMarkdocAst(value: unknown): value is Node | Node[] {
  return Array.isArray(value)
    ? value.length > 0 && value.every(isMarkdocNode)
    : isMarkdocNode(value);
}

export function collectTextContent(node: Node): string {
  const parts: string[] = [];

  function walk(current: Node): void {
    if (typeof current.attributes?.content === 'string') {
      parts.push(current.attributes.content);
    }

    for (const child of current.children ?? []) {
      walk(child);
    }
  }

  walk(node);
  return parts.join('');
}

export function collectMarkdownPlainText(ast: Node | Node[] | string): string {
  if (typeof ast === 'string') {
    return stripMarkdown(ast);
  }
  const roots = Array.isArray(ast) ? ast : [ast];
  return roots
    .map((node) => collectTextContent(node))
    .join('')
    .trim();
}

export function unescapeHTMLChars(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

export function sanitizeMarkdownSource(source: string, options?: MarkdownSanitizeOptions): string {
  const { sanitize } = options ?? {};

  if (sanitize) {
    return getDOMPurify().sanitize(source);
  }
  return source;
}

function buildSectionContent(heading: MarkdownHeading) {
  const children: ContentNode[] = [];

  if (heading.ast && heading.ast.length > 0) {
    children.push({
      nodeType: nodeTypes.MARKDOC,
      content: heading.ast,
    });
  }

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.MARKDOWN,
    meta: {
      name: heading.name,
    },
    children: [{ nodeType: nodeTypes.CONTAINER, children, panels: [] }],
  };
}

function toMarkdocNode(ast: Node[], sectionId: string): OverviewSectionWrapperNode {
  return {
    nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER,
    children: [{ nodeType: nodeTypes.MARKDOC, content: ast }],
    sectionId,
  };
}
