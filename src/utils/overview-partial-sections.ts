import type { Node } from '@markdoc/markdoc';
import type { HeadingScope } from '../adapters/utils/markdoc.js';

import {
  HEADING_SCOPE_VARIABLE,
  OVERVIEW_ROOT_SCOPE,
  collectTextContent,
  scopedHeadingAttributes,
} from '../adapters/utils/markdoc.js';
import { isRecord } from './is-record.js';
import { safeSlugify } from './string.js';

type Partials = Record<string, unknown>;

/**
 * Ids of the headings the overview renders from its `{% partial %}` tags, nested partials
 * included. Partials are keyed by the resolved `file` attribute, as Markdoc looks them up.
 */
export function collectOverviewPartialSectionIds(
  overviewContent: unknown,
  partials: Partials | undefined,
): Set<string> {
  const ids = new Set<string>();
  if (!partials) return ids;
  const visited = new Set<string>();
  for (const file of findOverviewPartialFiles(overviewContent)) {
    collectPartialHeadingIds(file, partials, visited, ids);
  }
  return ids;
}

function findOverviewPartialFiles(content: unknown, files: string[] = []): string[] {
  if (Array.isArray(content)) {
    for (const child of content) findOverviewPartialFiles(child, files);
  } else if (isRecord(content)) {
    const file = overviewPartialFile(content);
    if (file) files.push(file);
    for (const value of Object.values(content)) findOverviewPartialFiles(value, files);
  }
  return files;
}

function collectPartialHeadingIds(
  file: string,
  partials: Partials,
  visited: Set<string>,
  ids: Set<string>,
): void {
  if (visited.has(file)) return;
  visited.add(file);

  const visit = (node: Node): void => {
    if (node.type === 'heading') {
      const id = headingId(node);
      if (id) ids.add(id);
    } else if (isPartialTag(node) && typeof node.attributes.file === 'string') {
      collectPartialHeadingIds(node.attributes.file, partials, visited, ids);
    }
    for (const child of node.children ?? []) visit(child);
  };

  const partial = partials[file] as Node | Node[] | undefined;
  for (const node of [partial ?? []].flat()) visit(node);
}

/** The id the `heading` node transform gives a heading rendered under {@link OVERVIEW_ROOT_SCOPE}. */
function headingId(heading: Node): string | undefined {
  if (typeof heading.attributes.id === 'string') return heading.attributes.id.toLowerCase();
  const slug = safeSlugify(collectTextContent(heading).trim());
  return slug ? scopedHeadingAttributes(slug, OVERVIEW_ROOT_SCOPE).id : undefined;
}

function overviewPartialFile(node: Record<string, unknown>): string | undefined {
  if (!isPartialTag(node) || !isRecord(node.attributes)) return undefined;
  const { file, variables } = node.attributes;
  const scope = isRecord(variables) ? variables[HEADING_SCOPE_VARIABLE] : undefined;
  return typeof file === 'string' && isOverviewRootScope(scope) ? file : undefined;
}

function isPartialTag(node: { type?: unknown; tag?: unknown }): boolean {
  return node.type === 'tag' && node.tag === 'partial';
}

function isOverviewRootScope(scope: unknown): scope is HeadingScope {
  return (
    isRecord(scope) &&
    scope.operationId === OVERVIEW_ROOT_SCOPE.operationId &&
    scope.deepLinkSuffix === OVERVIEW_ROOT_SCOPE.deepLinkSuffix
  );
}
