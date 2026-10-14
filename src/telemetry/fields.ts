import type { EventPayload } from '@redocly/redoc-opentelemetry';

import { getGeneratorKey } from '../utils/languages.js';

export type StatusClass = NonNullable<
  EventPayload<'com.redocly.responseCodeTab.clicked'>[0]['statusClass']
>;

export type Protocol = NonNullable<
  EventPayload<'com.redocly.switchServers.clicked'>[0]['protocol']
>;

// Typed against the SDK union: a protocol added to the schema fails here until listed.
const PROTOCOL_FLAGS: Record<Exclude<Protocol, 'other'>, true> = {
  amqp: true,
  amqps: true,
  anypointmq: true,
  googlepubsub: true,
  http: true,
  https: true,
  ibmmq: true,
  jms: true,
  kafka: true,
  'kafka-secure': true,
  mercure: true,
  mqtt: true,
  mqtt5: true,
  'secure-mqtt': true,
  nats: true,
  pulsar: true,
  redis: true,
  sns: true,
  solace: true,
  sqs: true,
  stomp: true,
  stomps: true,
  ws: true,
  wss: true,
};

// Built-in sample languages and their grammars, plus the body grammars copy buttons pass.
const LANGUAGES: ReadonlySet<string> = new Set([
  'bash',
  'clike',
  'csharp',
  'csharpnewtonsoft',
  'curl',
  'go',
  'graphql',
  'java',
  'java8',
  'javascript',
  'json',
  'json-seq',
  'jsonl',
  'multipart-mixed',
  'node',
  'payload',
  'php',
  'python',
  'r',
  'ruby',
  'text',
  'xml',
  'yaml',
]);

/** A built-in language key, or `other` for a site-authored name (`x-codeSamples` lang or label, `codeSamples.languages` label). */
export function languageOf(value: string): string {
  const key = getGeneratorKey({ lang: value });
  return LANGUAGES.has(key) ? key : 'other';
}

export function statusClassOf(code: string): StatusClass {
  return /^[1-5]/.test(code) ? (`${code[0]}xx` as StatusClass) : 'default';
}

export function normalizeProtocol(value: string | undefined): Protocol {
  if (!value) return 'other';
  const scheme = value.toLowerCase().split('://')[0].replace(/:$/, '').trim();
  return Object.hasOwn(PROTOCOL_FLAGS, scheme) ? (scheme as Protocol) : 'other';
}
