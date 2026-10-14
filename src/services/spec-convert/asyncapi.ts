import type { AsyncApiDefinition } from '../../types/asyncapi.js';

import { isRecord } from '../../utils/is-record.js';
import { JsonPointer } from '../../adapters/openapi/utils/JsonPointer.js';
import { resolveInDoc } from '../../adapters/asyncapi/utils/resolveInDoc.js';

type Obj = Record<string, unknown>;

/** Old JSON pointer (with `#`) → the pointer of the object after conversion. */
type MovedRefs = Map<string, string>;

type TraitPrecedence = 'trait' | 'own';

const OPERATION_KINDS = ['publish', 'subscribe'] as const;

/**
 * Converts the definition in place to AsyncAPI 3.x and returns it, with operation and message
 * traits merged into the objects that declare them. A 2.x document becomes 3.0.0 from the
 * application's point of view (`publish` → `receive`, `subscribe` → `send`); its traits keep 2.x
 * precedence (trait values win), 3.x traits lose to the object's own values. Objects that hold a
 * `description` keep their identity unless they are inlined into a second location.
 */
export function normalizeAsyncApiDefinition(definition: Obj): AsyncApiDefinition {
  if (String(definition.asyncapi).startsWith('2.')) {
    convertV2(definition);
  } else {
    inlineRootRefs(definition, 'channels');
    inlineRootRefs(definition, 'operations');
    applyTraits(definition);
  }
  return definition as AsyncApiDefinition;
}

function convertV2(doc: Obj): void {
  const moved: MovedRefs = new Map();
  const components = asObj(doc.components);
  const rootChannels = asObj(doc.channels);

  // Each channel is converted once, so a copy of a root channel drops the operationIds that
  // belong to the original.
  inlineRootRefs(doc, 'channels', (channel) => withoutOperationIds(structuredClone(channel)));
  for (const channel of [
    ...Object.values(rootChannels),
    ...Object.values(asObj(components.channels)),
  ]) {
    applyV2OperationTraits(doc, channel);
  }
  for (const message of Object.values(asObj(components.messages))) {
    applyV2MessageTraits(doc, message);
  }

  doc.asyncapi = '3.0.0';
  const info = isRecord(doc.info) ? doc.info : (doc.info = {});
  for (const key of ['tags', 'externalDocs'] as const) {
    if (doc[key] !== undefined) {
      info[key] ??= doc[key];
      delete doc[key];
      moved.set(pointer([key]), pointer(['info', key]));
    }
  }

  for (const scheme of Object.values(asObj(components.securitySchemes))) {
    convertSecurityScheme(scheme);
  }
  for (const server of [
    ...Object.values(asObj(doc.servers)),
    ...Object.values(asObj(components.servers)),
  ]) {
    convertServer(server);
  }
  convertParameters(doc, components.parameters);

  if (isRecord(components.channels)) {
    const operations = asObj(components.operations);
    for (const [channelId, channel] of Object.entries(components.channels)) {
      if (isRecord(channel) && !isRef(channel)) {
        convertChannel(doc, ['components', 'channels', channelId], channel, operations, moved);
      }
    }
    if (Object.keys(operations).length > 0) components.operations = operations;
  }

  const operations: Obj = {};
  for (const [channelId, channel] of Object.entries(rootChannels)) {
    convertChannel(doc, ['channels', channelId], asObj(channel), operations, moved);
  }
  doc.operations = operations;

  for (const message of Object.values(asObj(components.messages))) {
    convertMessage(message);
  }
  rewriteRefs(doc, moved);
}

/**
 * Replaces each root `channels` / `operations` entry that is a `$ref` with the object it points
 * to: the root is where the adapter reads them and where Markdoc is written into the nodes. A
 * component that moves keeps a copy; a ref to an object already at the root gets `copy` of it.
 * Keys next to the `$ref` (such as access markers) are kept on the inlined object, not on the
 * component copy. A ref that does not resolve stays as it is.
 */
function inlineRootRefs(
  doc: Obj,
  key: 'channels' | 'operations',
  copy: (value: Obj) => Obj = structuredClone,
): void {
  const root = asObj(doc[key]);
  const inlined = new Set<Obj>(
    Object.values(root).filter((value): value is Obj => isRecord(value) && !isRef(value)),
  );
  const siblings: Array<[Obj, Obj]> = [];
  for (const [id, value] of Object.entries(root)) {
    if (id === '__proto__' || !isRef(value)) continue;
    const target = resolveInDoc<Obj>(doc, value);
    if (!target) continue;
    const rootValue = inlined.has(target) ? copy(target) : target;
    root[id] = rootValue;
    inlined.add(rootValue);
    const rest = Object.fromEntries(
      Object.entries(value).filter(([name]) => name !== '$ref' && name !== '__proto__'),
    );
    if (Object.keys(rest).length > 0) siblings.push([rootValue, rest]);
  }
  const fromComponents = asObj(asObj(doc.components)[key]);
  for (const [name, value] of Object.entries(fromComponents)) {
    if (isRecord(value) && inlined.has(value)) fromComponents[name] = structuredClone(value);
  }
  for (const [target, rest] of siblings) Object.assign(target, rest);
}

function withoutOperationIds(channel: Obj): Obj {
  for (const kind of OPERATION_KINDS) delete asObj(channel[kind]).operationId;
  return channel;
}

function applyV2OperationTraits(doc: Obj, channel: unknown): void {
  if (!isRecord(channel) || isRef(channel)) return;
  for (const kind of OPERATION_KINDS) {
    const operation = channel[kind];
    if (!isRecord(operation)) continue;
    mergeTraitsInto(doc, operation, 'trait');
    for (const entry of operationMessages(doc, operation.message).list) {
      applyV2MessageTraits(doc, entry);
    }
  }
}

function applyV2MessageTraits(doc: Obj, message: unknown): void {
  if (isRecord(message) && !isRef(message)) {
    mergeTraitsInto(doc, message, 'trait');
  }
}

function convertChannel(
  doc: Obj,
  path: string[],
  channel: Obj,
  operations: Obj,
  moved: MovedRefs,
): void {
  const channelId = path[path.length - 1];
  channel.address ??= channelId;

  if (Array.isArray(channel.servers)) {
    channel.servers = channel.servers.map((name) => ({ $ref: pointer(['servers', String(name)]) }));
  }
  convertParameters(doc, channel.parameters);

  const operationsPath = path.slice(0, -2).concat('operations');
  const messages: Obj = {};
  for (const kind of OPERATION_KINDS) {
    const operation = channel[kind];
    delete channel[kind];
    if (!isRecord(operation)) continue;

    const id =
      typeof operation.operationId === 'string' ? operation.operationId : `${channelId}.${kind}`;
    const { list, oneOf } = operationMessages(doc, operation.message);

    const messageRefs = list.map((entry, index) => {
      const messageId =
        messageKey(doc, entry) ?? (oneOf ? `${id}.message.${index}` : `${id}.message`);
      messages[messageId] = isRef(entry) ? entry : convertMessage(entry);
      const messagePointer = pointer([...path, 'messages', messageId]);
      moved.set(
        pointer(
          oneOf ? [...path, kind, 'message', 'oneOf', String(index)] : [...path, kind, 'message'],
        ),
        messagePointer,
      );
      return { $ref: messagePointer };
    });

    delete operation.operationId;
    delete operation.message;
    operation.action = kind === 'publish' ? 'receive' : 'send';
    operation.channel = { $ref: pointer(path) };
    if (messageRefs.length > 0) operation.messages = messageRefs;
    operations[id] = operation;
    moved.set(pointer([...path, kind]), pointer([...operationsPath, id]));
  }

  if (Object.keys(messages).length > 0) {
    channel.messages = messages;
  }
}

/** The messages of a 2.x operation: the `oneOf` entries of the message, or of the message it references. */
function operationMessages(doc: Obj, message: unknown): { list: unknown[]; oneOf: boolean } {
  const target = isRef(message) ? resolveInDoc<Obj>(doc, message) : message;
  if (isRecord(target) && Array.isArray(target.oneOf)) return { list: target.oneOf, oneOf: true };
  return { list: message ? [message] : [], oneOf: false };
}

/** `messageId`, else the component name of a `#/components/messages/<name>` ref. */
function messageKey(doc: Obj, message: unknown): string | undefined {
  const resolved = resolve(doc, message);
  if (typeof resolved.messageId === 'string') return resolved.messageId;
  if (!isRef(message) || !message.$ref.startsWith('#/components/messages/')) return undefined;
  const tokens = JsonPointer.parse(message.$ref);
  return tokens.length === 3 ? tokens[2] : undefined;
}

function convertServer(server: unknown): void {
  if (!isRecord(server)) return;
  if (typeof server.url !== 'string') return;
  const schemeEnd = server.url.indexOf('://');
  const url = schemeEnd === -1 ? server.url : server.url.slice(schemeEnd + 3);
  const slash = url.indexOf('/');
  server.host = slash === -1 ? url : url.slice(0, slash);
  if (slash !== -1 && slash < url.length - 1) server.pathname = url.slice(slash);
  delete server.url;
}

function convertSecurityScheme(scheme: unknown): void {
  for (const flow of Object.values(asObj(asObj(scheme).flows))) {
    if (isRecord(flow) && flow.scopes !== undefined) {
      flow.availableScopes = flow.scopes;
      delete flow.scopes;
    }
  }
}

function convertMessage(message: unknown): unknown {
  if (!isRecord(message) || isRef(message)) return message;
  delete message.messageId;
  if (message.schemaFormat !== undefined && message.payload !== undefined) {
    message.payload = { schemaFormat: message.schemaFormat, schema: message.payload };
  }
  delete message.schemaFormat;
  return message;
}

/** 3.0 parameters are strings: only `enum` (or `const`), `default`, `examples` and `description` survive. */
function convertParameters(doc: Obj, parameters: unknown): void {
  if (!isRecord(parameters)) return;
  for (const parameter of Object.values(parameters)) {
    if (!isRecord(parameter) || isRef(parameter)) continue;
    const resolved = resolve(doc, parameter.schema);
    delete parameter.schema;
    if (Array.isArray(resolved.enum)) parameter.enum = resolved.enum;
    else if (resolved.const !== undefined) parameter.enum = [resolved.const];
    if (resolved.default !== undefined) parameter.default = resolved.default;
    if (Array.isArray(resolved.examples)) parameter.examples = resolved.examples;
    if (parameter.description === undefined && resolved.description !== undefined) {
      parameter.description = resolved.description;
    }
  }
}

/** Points every local `$ref` into a moved object at its new location (longest prefix wins). */
function rewriteRefs(value: unknown, moved: MovedRefs): void {
  if (Array.isArray(value)) {
    for (const item of value) rewriteRefs(item, moved);
    return;
  }
  if (!isRecord(value)) return;
  if (typeof value.$ref === 'string') {
    const ref = value.$ref;
    for (let end = ref.length; end > 0; end = ref.lastIndexOf('/', end - 1)) {
      const to = moved.get(ref.slice(0, end));
      if (to !== undefined) {
        value.$ref = `${to}${ref.slice(end)}`;
        break;
      }
    }
  }
  for (const child of Object.values(value)) rewriteRefs(child, moved);
}

function applyTraits(doc: Obj): void {
  const components = asObj(doc.components);
  const channels = [
    ...Object.values(asObj(doc.channels)),
    ...Object.values(asObj(components.channels)),
  ];
  const targets = [
    ...Object.values(asObj(doc.operations)),
    ...Object.values(asObj(components.operations)),
    ...Object.values(asObj(components.messages)),
    ...channels.flatMap((channel) => Object.values(asObj(asObj(channel).messages))),
  ];

  for (const target of targets) {
    if (isRecord(target)) mergeTraitsInto(doc, target, 'own');
  }
}

/** Merges `target`'s traits into it in place (later traits win over earlier ones) and drops `traits`. */
function mergeTraitsInto(doc: Obj, target: Obj, winner: TraitPrecedence): void {
  if (!Array.isArray(target.traits)) return;
  const fromTraits: Obj = {};
  for (const trait of target.traits) mergeInto(fromTraits, resolve(doc, trait), 'source');
  delete target.traits;
  mergeInto(target, fromTraits, winner === 'trait' ? 'source' : 'target');
}

/**
 * Deep-merges `source` into `target` in place: `target`'s nested objects keep their identity and
 * objects taken from `source` are copied, so shared traits are never mutated.
 */
function mergeInto(target: Obj, source: Obj, winner: 'source' | 'target'): void {
  for (const [key, value] of Object.entries(source)) {
    if (key === '__proto__') continue;
    const current = target[key];
    if (isRecord(current) && isRecord(value) && !isRef(current) && !isRef(value)) {
      mergeInto(current, value, winner);
    } else if (winner === 'source' || current === undefined) {
      target[key] = isRecord(value) || Array.isArray(value) ? structuredClone(value) : value;
    }
  }
}

function resolve(doc: Obj, value: unknown): Obj {
  return resolveInDoc<Obj>(doc, value) ?? {};
}

function pointer(tokens: string[]): string {
  return `#${JsonPointer.compile(tokens)}`;
}

function isRef(value: unknown): value is { $ref: string } {
  return isRecord(value) && typeof value.$ref === 'string';
}

function asObj(value: unknown): Obj {
  return isRecord(value) ? value : {};
}
