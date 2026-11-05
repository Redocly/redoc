import type { ProtocolVariant, AsyncApiDefinition, AsyncApiOperations } from '../../../types/asyncapi.js';

import { JsonPointer } from '../../openapi/utils/JsonPointer.js';
import { isRecord } from '../../../utils/is-record.js';
import { reportError } from '../../../telemetry/reportError.js';
import { resolveInDoc } from '../utils/resolveInDoc.js';

/** The bindings of `owner` whose value is an object, from a bindings object given inline or as a
 *  `$ref`. Extensions (`x-…`) are skipped; any other value is skipped and reported. */
export function objectBindings(
  bindings: unknown,
  owner: string,
  document: AsyncApiDefinition,
): [string, Record<string, unknown>][] {
  const resolved = resolveInDoc<Record<string, unknown>>(document, bindings);
  if (!resolved) return [];
  const entries: [string, Record<string, unknown>][] = [];
  for (const [protocol, value] of Object.entries(resolved)) {
    if (protocol.startsWith('x-')) continue;
    if (isRecord(value)) {
      entries.push([protocol, value]);
    } else {
      reportError(
        'buildItem',
        new TypeError(`"${protocol}" binding must be an object`),
        `Could not build the "${protocol}" binding of "${owner}" from the API description`,
      );
    }
  }
  return entries;
}

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
      return Object.keys(value.bindings)[0] as ProtocolVariant;
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
    if (isRecord(channel) && typeof channel.address === 'string' && channel.address) {
      addressToChannelId[channel.address] = channelId;
    }
  }

  for (const [operationId, operation] of Object.entries(operations)) {
    if (!isRecord(operation)) continue;
    const channel: unknown = operation.channel;
    if (!isRecord(channel)) continue;

    let channelId: string | undefined;

    if (typeof channel.$ref === 'string') {
      channelId = JsonPointer.baseName(channel.$ref);
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
