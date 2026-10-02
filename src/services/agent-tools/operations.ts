import { itemVariant } from '../../types/common.js';
import { parsePointerTokens } from '../spec-slice/openapi-slice.js';

import type { ApiItem } from '../../types/store.js';
import type { ItemVariant } from '../../types/common.js';
import type { ApiOperationSummary } from './types.js';

/** GraphQL operations carry no `httpVerb`; their variant names the operation type. */
const GRAPHQL_OPERATION_METHODS: Partial<Record<ItemVariant, string>> = {
  [itemVariant.QUERY]: 'QUERY',
  [itemVariant.MUTATION]: 'MUTATION',
  [itemVariant.SUBSCRIPTION]: 'SUBSCRIPTION',
};

/**
 * Request path of an OpenAPI operation, from its pointer: `/paths/~1museum-hours/get` is
 * `GET /museum-hours`. AsyncAPI channel pointers hold an identifier rather than an address,
 * so they are left without a path.
 */
export function pathFromPointer(pointer: string | undefined): string | undefined {
  if (!pointer) return undefined;

  const tokens = parsePointerTokens(pointer);
  const rootIndex = tokens.findIndex((token) => token === 'paths' || token === 'webhooks');

  return rootIndex >= 0 ? tokens[rootIndex + 1] : undefined;
}

/** The method an agent should see for one item, or nothing when the item is not callable. */
function methodOf(item: ApiItem): string | undefined {
  if (item.httpVerb) return item.httpVerb.toUpperCase();

  const variant = item.content?.itemVariant;
  return variant ? GRAPHQL_OPERATION_METHODS[variant] : undefined;
}

/**
 * Flattens the navigation tree into the operations it documents: HTTP operations, webhooks,
 * AsyncAPI channel operations, `x-mcp` entities, and GraphQL queries, mutations and subscriptions.
 */
export function collectOperations(
  items: ApiItem[],
  resolveDocUrl: (link: string) => string = (link) => link,
): ApiOperationSummary[] {
  const operations: ApiOperationSummary[] = [];

  const walk = (list: ApiItem[], section?: string): void => {
    for (const item of list) {
      const method = methodOf(item);

      if (method && item.link) {
        const meta = item.content?.meta;
        const path = pathFromPointer(meta?.pointer);

        operations.push({
          method,
          title: item.label ?? '',
          url: resolveDocUrl(item.link),
          ...(path ? { path } : {}),
          ...(section ? { section } : {}),
          ...(meta?.deprecated === true ? { deprecated: true } : {}),
        });
      }

      if (item.items) {
        walk(item.items as ApiItem[], item.label || section);
      }
    }
  };

  walk(items);

  return operations;
}

/** Matches on a documentation URL when given one, otherwise on method and path or title. */
export function findOperation(
  operations: ApiOperationSummary[],
  criteria: { url?: string; method?: string; path?: string },
): ApiOperationSummary | undefined {
  const url = criteria.url?.trim() ?? '';
  const method = criteria.method?.trim().toLowerCase() ?? '';
  const path = criteria.path?.trim() ?? '';

  if (url) {
    return operations.find((operation) => operation.url === url || operation.url.endsWith(url));
  }

  if (!method && !path) return undefined;

  return operations.find(
    (operation) =>
      (!method || operation.method.toLowerCase() === method) &&
      (!path || operation.path === path || operation.title === path),
  );
}

export function filterOperations(
  operations: ApiOperationSummary[],
  query: string,
): ApiOperationSummary[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return operations;

  return operations.filter((operation) =>
    [operation.method, operation.path, operation.title, operation.section]
      .filter((field): field is string => Boolean(field))
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
}
