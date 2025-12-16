
import type { GroupModel, OperationMenuItem, ContentItemModel } from '../../models/index.js';
import type { TagInfo } from '../types.js';

import { encodeBackSlashes, getOperationId, getOperationName } from '../../utils/index.js';

/**
 * Returns array of Operation items for the tag
 * @param parent parent OperationsGroup
 * @param tag tag info returned from `getTagsWithOperations`
 * @param depth items depth
 */
export function getOperationsItems(
  parent: GroupModel | undefined,
  tag: TagInfo,
  depth: number,
): OperationMenuItem[] {
  if (tag.operations.length === 0) {
    return [];
  }

  const operations: OperationMenuItem[] = [];
  const webhooks: OperationMenuItem[] = [];
  for (const operationDefinition of tag.operations) {
    const id = getOperationId(operationDefinition, parent);
    const type = 'operation' as const;
    const item = {
      id,
      type,
      parent,
      operationDefinition,
      depth,
      name: getOperationName(operationDefinition),
      httpVerb: operationDefinition.httpVerb,
      path: operationDefinition.pathName,
      items: [],
      isAdditionalOperation: operationDefinition.isAdditionalOperation,
      isWebhook: operationDefinition.isWebhook,
      operationId: operationDefinition.operationId,
      badges: operationDefinition['x-badges'] || [],
      href: getHref({ id }),
      deprecated: !!operationDefinition.deprecated,
    };

    if (operationDefinition.isWebhook) {
      webhooks.push(item);
    } else {
      operations.push(item);
    }
  }

  return [
    ...operations.sort(
      (a, b) =>
        Number(a.deprecated) - Number(b.deprecated) ||
        Number(a.isAdditionalOperation) - Number(b.isAdditionalOperation),
    ),
    ...webhooks.sort((a, b) => Number(a.deprecated) - Number(b.deprecated)), // webhooks must be in the end for adding separator
  ];
}

export function getHref({ id }: Pick<ContentItemModel, 'id'>): string {
  return encodeBackSlashes(`/${id}`.toLowerCase());
}
