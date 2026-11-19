import type { ItemContentNode } from '../types/content.js';

import { contentNodeVariant } from '../types/common.js';

export type AccessFilter = { skipReadOnly: boolean; skipWriteOnly: boolean };

/**
 * readOnly / writeOnly filter for a `body`, `querystring-body` or `responses` node: what the client
 * sends hides readOnly fields, what the server sends hides writeOnly ones. Webhook and callback
 * (`isEvent`) bodies and responses travel the other way.
 */
export function accessFilterOf(node: Pick<ItemContentNode, 'variant' | 'isEvent'>): AccessFilter {
  const sentByClient =
    node.variant === contentNodeVariant.QUERYSTRING_BODY ||
    (node.variant === contentNodeVariant.RESPONSES) === Boolean(node.isEvent);
  return { skipReadOnly: sentByClient, skipWriteOnly: !sentByClient };
}
