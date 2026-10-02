import type { ProtocolVariant, AsyncApiDefinition, AsyncApiOperations } from '../../../types/asyncapi.js';

export function findFirstBinding(
  obj: unknown,
  visited: Set<unknown> = new Set(),
): ProtocolVariant | null {
  if (visited.has(obj)) {
    return null;
  }

  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  visited.add(obj);

  const record = obj as Record<string, Record<string, unknown> | undefined>;

  for (const key of Object.keys(record)) {
    const value = record[key];
    if (value && typeof value === 'object' && 'bindings' in value && value.bindings) {
      return Object.keys(value.bindings as Record<string, unknown>)[0] as ProtocolVariant;
    }

    const result = findFirstBinding(value, visited);

    if (result) {
      return result;
    }
  }

  return null;
}

export function mapChannelToOperations(
  rawAsyncApiDoc: AsyncApiDefinition,
): Record<string, string[]> {
  const operations: AsyncApiOperations = rawAsyncApiDoc.operations ?? {};
  const channels = rawAsyncApiDoc.channels ?? {};
  const channelIds = Object.keys(channels);
  const addressToChannelId: Record<string, string> = {};
  const channelToOperations: Record<string, string[]> = {};

  for (const [channelId, channel] of Object.entries(channels)) {
    channelToOperations[channelId] = [];
    if (channel.address) {
      addressToChannelId[channel.address] = channelId;
    }
  }

  for (const [operationId, operation] of Object.entries(operations)) {
    const channel = operation.channel as Record<string, unknown> | undefined;
    if (!channel) continue;

    let channelId: string | undefined;

    if (typeof channel.$ref === 'string') {
      channelId = channel.$ref.split('/').pop();
    } else if (typeof channel.address === 'string') {
      channelId = addressToChannelId[channel.address];
    }

    if (!channelId || !channelIds.includes(channelId)) {
      continue;
    }

    channelToOperations[channelId].push(operationId);
  }

  return channelToOperations;
}
