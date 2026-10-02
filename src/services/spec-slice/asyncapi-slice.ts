import { isRecord, resolveJsonPointer } from '../../adapters/helpers.js';
import { collectComponentClosure, buildComponentsFromClosure } from './component-closure.js';
import { cloneStrip } from './clone-strip.js';
import { parsePointerTokens } from './openapi-slice.js';

import type { SpecSliceScope } from './types.js';

function isAsyncApi3(document: Record<string, unknown>): boolean {
  return typeof document.asyncapi === 'string' && document.asyncapi.startsWith('3.');
}

const SLICE_ROOT_FIELDS = ['asyncapi', 'id', 'info', 'defaultContentType', 'servers'] as const;

export function scopeFromAsyncApiPointer(pointer: string): SpecSliceScope | undefined {
  const tokens = parsePointerTokens(pointer);

  if (tokens.length < 2) return undefined;
  if (tokens[0] === 'channels') return { kind: 'channel', channelId: tokens[1] };
  if (tokens[0] === 'operations') return { kind: 'async-operation', operationId: tokens[1] };

  return undefined;
}

export function extractAsyncApiSlice(
  document: Record<string, unknown>,
  scope: SpecSliceScope,
): { document: Record<string, unknown> } | undefined {
  if (!isAsyncApi3(document)) return undefined;

  if (scope.kind === 'document') {
    return {
      document: cloneStrip(document, new Map()) as Record<string, unknown>,
    };
  }

  const selection = selectChannelsAndOperations(document, scope);
  if (!selection) return undefined;
  const { keptChannels, keptOperations } = selection;

  const draft: Record<string, unknown> = {};
  for (const field of SLICE_ROOT_FIELDS) {
    if (document[field] !== undefined) draft[field] = document[field];
  }

  const channels = isRecord(document.channels) ? document.channels : {};
  const operations = isRecord(document.operations) ? document.operations : {};

  const draftChannels: Record<string, unknown> = {};
  for (const [channelId, channel] of Object.entries(channels)) {
    if (keptChannels.has(channelId)) draftChannels[channelId] = channel;
  }
  const draftOperations: Record<string, unknown> = {};
  for (const [operationId, operation] of Object.entries(operations)) {
    if (keptOperations.has(operationId)) draftOperations[operationId] = operation;
  }
  draft.channels = draftChannels;
  if (Object.keys(draftOperations).length) draft.operations = draftOperations;

  const retainRef = (ref: string): boolean => {
    if (ref.startsWith('#/servers/')) return document.servers !== undefined;
    const tokens = parsePointerTokens(ref);
    if (tokens[0] === 'channels') return keptChannels.has(tokens[1]);
    if (tokens[0] === 'operations') return keptOperations.has(tokens[1]);
    return false;
  };

  const closure = collectComponentClosure(document, [draft], retainRef);
  const components = buildComponentsFromClosure(document, closure.keep);
  if (components) draft.components = components;

  return {
    document: cloneStrip(draft, closure.inlineTargets) as Record<string, unknown>,
  };
}

type Selection = { keptChannels: Set<string>; keptOperations: Set<string> };

function channelRefTarget(operation: unknown): string | undefined {
  if (!isRecord(operation) || !isRecord(operation.channel)) return undefined;
  const ref = operation.channel.$ref;
  if (typeof ref !== 'string') return undefined;
  const tokens = parsePointerTokens(ref);
  return tokens[0] === 'channels' && tokens.length >= 2 ? tokens[1] : undefined;
}

function channelHasTag(channel: unknown, tagName: string): boolean {
  if (!isRecord(channel) || !Array.isArray(channel.tags)) return false;
  return channel.tags.some((tag) => isRecord(tag) && tag.name === tagName);
}

function selectChannelsAndOperations(
  document: Record<string, unknown>,
  scope: Exclude<SpecSliceScope, { kind: 'document' }>,
): Selection | undefined {
  const channels = isRecord(document.channels) ? document.channels : {};
  const operations = isRecord(document.operations) ? document.operations : {};

  const keptChannels = new Set<string>();
  const keptOperations = new Set<string>();

  const keepOperationsOfChannel = (channelId: string): void => {
    for (const [operationId, operation] of Object.entries(operations)) {
      if (channelRefTarget(operation) === channelId) keptOperations.add(operationId);
    }
  };

  switch (scope.kind) {
    case 'channel': {
      if (!(scope.channelId in channels)) return undefined;
      keptChannels.add(scope.channelId);
      keepOperationsOfChannel(scope.channelId);
      break;
    }
    case 'async-operation': {
      const operation = operations[scope.operationId];
      if (!isRecord(operation)) return undefined;
      keptOperations.add(scope.operationId);
      const channelId = channelRefTarget(operation);
      if (channelId && channelId in channels) keptChannels.add(channelId);
      break;
    }
    case 'tag': {
      for (const [channelId, channel] of Object.entries(channels)) {
        if (channelHasTag(channel, scope.tagName)) {
          keptChannels.add(channelId);
          keepOperationsOfChannel(channelId);
        }
      }
      if (keptChannels.size === 0) return undefined;
      break;
    }
    default:
      return undefined;
  }

  for (const operationId of keptOperations) {
    const operation = operations[operationId];
    if (!isRecord(operation)) continue;
    const reply = resolveReply(document, operation.reply);
    const replyChannel = isRecord(reply?.channel) ? reply.channel.$ref : undefined;
    if (typeof replyChannel !== 'string') continue;
    const tokens = parsePointerTokens(replyChannel);
    if (tokens[0] === 'channels' && tokens[1] && tokens[1] in channels) {
      keptChannels.add(tokens[1]);
    }
  }

  return { keptChannels, keptOperations };
}

function resolveReply(
  document: Record<string, unknown>,
  reply: unknown,
): Record<string, unknown> | undefined {
  if (!isRecord(reply)) return undefined;
  if (typeof reply.$ref === 'string' && reply.$ref.startsWith('#/')) {
    const resolved = resolveJsonPointer(document, reply.$ref);
    return isRecord(resolved) ? resolved : undefined;
  }
  return reply;
}
