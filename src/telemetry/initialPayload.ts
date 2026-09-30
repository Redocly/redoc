import type { EventPayload } from '@redocly/redoc-opentelemetry';
import type { LayoutVariant } from '@redocly/config';

import type { ApiItem, ApiStore } from '../types/store.js';
import type { ItemVariant } from '../types/common.js';
import type { RouteKind } from '../utils/routeKind.js';
import type { TypeOfUsage } from './RedocTelemetry.js';

import { contentType, itemVariant } from '../types/common.js';
import { isRecord } from '../utils/is-record.js';
import { normalizeProtocol } from './fields.js';
import { countSchemes } from './security.js';

type InitialItem = EventPayload<'com.redocly.redoc.initialized'>[0];
type Shape = NonNullable<InitialItem['shape']>;
type RedocExtensions = NonNullable<InitialItem['redocExtensions']>;
type ProtocolFlags = NonNullable<Shape['protocols']>;

export type BuildTimings = { resolveSpecMs: number; buildItemsMs: number };

export type TelemetryOptionValue = string | number | boolean;

export type InitialTelemetryContext = {
  buildTimings?: BuildTimings;
  options?: Record<string, TelemetryOptionValue>;
};

const OPERATION_VARIANTS: ReadonlySet<ItemVariant> = new Set<ItemVariant>([
  itemVariant.HTTP_ITEM,
  itemVariant.CHANNEL_OPERATION,
  itemVariant.QUERY,
  itemVariant.MUTATION,
  itemVariant.SUBSCRIPTION,
]);

export function countItems(items: ApiItem[]): {
  byVariant: Partial<Record<ItemVariant, number>>;
  operations: number;
  groups: number;
  webhooks: number;
  deprecated: number;
} {
  const byVariant: Partial<Record<ItemVariant, number>> = {};
  let groups = 0;
  let webhooks = 0;
  let deprecated = 0;

  function walk(list: ApiItem[]): void {
    for (const item of list) {
      const content = item.content;
      if (content) {
        if (content.contentType === contentType.GROUP) groups += 1;
        const variant = content.itemVariant;
        if (variant) {
          byVariant[variant] = (byVariant[variant] ?? 0) + 1;
        }
        if (content.meta?.isWebhook) webhooks += 1;
        if (content.meta?.deprecated) deprecated += 1;
      }
      if ('items' in item && Array.isArray(item.items)) walk(item.items as ApiItem[]);
    }
  }

  walk(items);
  const operations = [...OPERATION_VARIANTS].reduce((sum, v) => sum + (byVariant[v] ?? 0), 0);
  return { byVariant, operations, groups, webhooks, deprecated };
}

export function securityShape(
  securitySchemeStore: ApiStore['securitySchemeStore'],
): Pick<Shape, 'securitySchemes' | 'schemeTypes' | 'oauth2Flows'> {
  const entries = Object.values(securitySchemeStore ?? {});
  const { schemeTypes, oauth2Flows } = countSchemes(entries);
  delete schemeTypes.unknown;
  return {
    securitySchemes: entries.length,
    ...(Object.keys(schemeTypes).length ? { schemeTypes } : {}),
    ...(Object.keys(oauth2Flows).length ? { oauth2Flows } : {}),
  };
}

const REDOC_EXTENSIONS: Readonly<Record<string, keyof RedocExtensions>> = {
  'x-logo': 'logo',
  'x-tagGroups': 'tagGroups',
  'x-displayName': 'displayName',
  'x-traitTag': 'traitTag',
  'x-badges': 'badges',
  'x-enumDescriptions': 'enumDescriptions',
  'x-additionalPropertiesName': 'additionalPropertiesName',
  'x-explicitMappingOnly': 'explicitMappingOnly',
  'x-extendedDiscriminator': 'extendedDiscriminator',
  'x-ignoredHeaderParameters': 'ignoredHeaderParameters',
  'x-nullable': 'nullable',
  'x-summary': 'summary',
  'x-servers': 'servers',
  'x-webhooks': 'webhooks',
  'x-examples': 'examples',
  'x-mcp': 'mcp',
};

const CODE_SAMPLE_EXTENSIONS: ReadonlySet<string> = new Set(['x-codeSamples', 'x-code-samples']);

const SCAN_BUDGET = 50_000;

export type DocumentScan = {
  specVersion?: string;
  extensionsCount: number;
  redocExtensions: RedocExtensions;
  hasCodeSamples: boolean;
  callbacks: number;
  servers: number;
  hasBindings: boolean;
  hasReply: boolean;
  protocols?: ProtocolFlags;
};

function majorMinor(version: unknown): string | undefined {
  if (typeof version !== 'string') return undefined;
  const match = /^(\d+)\.(\d+)/.exec(version.trim());
  return match ? `${match[1]}.${match[2]}` : undefined;
}

function protocolFlagKey(protocol: string): keyof ProtocolFlags {
  return protocol.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) as keyof ProtocolFlags;
}

export function scanDocument(document: Record<string, unknown>): DocumentScan {
  const extensionKeys = new Set<string>();
  const redocExtensions: RedocExtensions = {};
  let hasCodeSamples = false;
  let callbacks = 0;
  let hasBindings = false;

  const stack: unknown[] = [document];
  let visited = 0;
  while (stack.length && visited < SCAN_BUDGET) {
    const node = stack.pop();
    visited += 1;
    if (Array.isArray(node)) {
      for (const child of node) if (child && typeof child === 'object') stack.push(child);
      continue;
    }
    if (!isRecord(node)) continue;
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('x-')) {
        extensionKeys.add(key);
        const flag = REDOC_EXTENSIONS[key];
        if (flag) redocExtensions[flag] = true;
        if (CODE_SAMPLE_EXTENSIONS.has(key)) hasCodeSamples = true;
      } else if (key === 'callbacks' && isRecord(value)) {
        callbacks += Object.keys(value).length;
      } else if (key === 'bindings') {
        hasBindings = true;
      }
      if (value && typeof value === 'object') stack.push(value);
    }
  }

  const servers = document.servers;
  const serverList = Array.isArray(servers)
    ? servers
    : isRecord(servers)
      ? Object.values(servers)
      : [];
  const protocols: ProtocolFlags = {};
  for (const server of serverList) {
    if (isRecord(server) && typeof server.protocol === 'string') {
      protocols[protocolFlagKey(normalizeProtocol(server.protocol))] = true;
    }
  }
  const operations = document.operations;
  const hasReply =
    isRecord(operations) &&
    Object.values(operations).some((operation) => isRecord(operation) && 'reply' in operation);

  return {
    specVersion: majorMinor(document.openapi ?? document.asyncapi ?? document.swagger),
    extensionsCount: extensionKeys.size,
    redocExtensions,
    hasCodeSamples,
    callbacks,
    servers: serverList.length,
    hasBindings,
    hasReply,
    ...(Object.keys(protocols).length ? { protocols } : {}),
  };
}

const HTTP_METHODS: ReadonlySet<string> = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
  'query',
]);

export function openApiSecurityShape(
  document: Record<string, unknown>,
): Pick<
  Shape,
  | 'hasGlobalSecurity'
  | 'securedOperations'
  | 'optionalSecurityOperations'
  | 'combinedSecurityOperations'
  | 'alternativeSecurityOperations'
> {
  const global = Array.isArray(document.security) ? document.security : undefined;
  let secured = 0;
  let optional = 0;
  let combined = 0;
  let alternative = 0;

  for (const root of [document.paths, document.webhooks]) {
    if (!isRecord(root)) continue;
    for (const pathItem of Object.values(root)) {
      if (!isRecord(pathItem)) continue;
      for (const [method, operation] of Object.entries(pathItem)) {
        if (!HTTP_METHODS.has(method) || !isRecord(operation)) continue;
        const effective = Array.isArray(operation.security) ? operation.security : global;
        if (!effective) continue;
        const requirements = effective.filter(isRecord);
        if (requirements.some((requirement) => Object.keys(requirement).length > 0)) secured += 1;
        if (requirements.some((requirement) => Object.keys(requirement).length === 0))
          optional += 1;
        if (requirements.some((requirement) => Object.keys(requirement).length > 1)) combined += 1;
        if (requirements.length > 1) alternative += 1;
      }
    }
  }

  return {
    hasGlobalSecurity: global !== undefined,
    securedOperations: secured,
    optionalSecurityOperations: optional,
    combinedSecurityOperations: combined,
    alternativeSecurityOperations: alternative,
  };
}

const LOCAL_HOST_PATTERN =
  /^(localhost|.*\.local|0\.0\.0\.0|\[?::1\]?|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/i;

export function isLocalhost(hostname: string): boolean {
  return hostname === '' || LOCAL_HOST_PATTERN.test(hostname);
}

/** Options injected by the loader or carrying API description content. */
const SKIPPED_OPTION_KEYS: ReadonlySet<string> = new Set([
  'specType',
  'metadata',
  'markdownParser',
  'basePath',
  'downloadUrls',
  'disableTelemetry',
  'info',
  'markdown',
  'apiLogo',
  'menu',
  'events',
  'dynamicRequestValues',
  'schemaDefinitionsTagName',
  'licenseKey',
  'userClaims',
  'corsProxyUrl',
]);

/** Options whose string values are enums worth reporting verbatim. */
const STRING_OPTION_KEYS: ReadonlySet<string> = new Set(['layout', 'protocol']);

export function nonDefaultOptions(
  raw: Record<string, unknown> | undefined,
): Record<string, TelemetryOptionValue> | undefined {
  if (!raw) return undefined;
  const result: Record<string, TelemetryOptionValue> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === null || SKIPPED_OPTION_KEYS.has(key)) continue;
    if (typeof value === 'boolean' || typeof value === 'number') {
      result[key] = value;
    } else if (typeof value === 'string') {
      if (value === 'true' || value === 'false') result[key] = value === 'true';
      else if (/^-?\d+(\.\d+)?$/.test(value)) result[key] = Number(value);
      else result[key] = STRING_OPTION_KEYS.has(key) ? value : true;
    } else {
      result[key] = true;
    }
  }
  return Object.keys(result).length ? result : undefined;
}

export type InitialPayloadInput = {
  uri: string;
  layout: LayoutVariant;
  typeOfUsage?: TypeOfUsage;
  items: ApiItem[];
  apiStore: ApiStore;
  definition?: Record<string, unknown> | string;
  hostname: string;
  landedOn: RouteKind;
  buildTimings?: BuildTimings;
  options?: Record<string, TelemetryOptionValue>;
};

export function buildInitialPayload(input: InitialPayloadInput): InitialItem {
  const { items, apiStore, definition } = input;
  const specType = apiStore.specType;
  const counts = countItems(items);
  const document = isRecord(definition) ? definition : undefined;
  const scan = document ? scanDocument(document) : undefined;
  const variant = counts.byVariant;

  const shape: Shape = {
    ...(specType === 'openapi'
      ? {
          tags: counts.groups,
          webhooks: counts.webhooks,
          callbacks: scan?.callbacks ?? 0,
          ...(document ? openApiSecurityShape(document) : {}),
        }
      : {}),
    ...(specType === 'asyncapi'
      ? {
          channels: variant.channel ?? 0,
          messages: variant.message ?? 0,
          hasReply: scan?.hasReply ?? false,
          hasBindings: scan?.hasBindings ?? false,
          ...(scan?.protocols ? { protocols: scan.protocols } : {}),
        }
      : {}),
    ...(specType === 'graphql'
      ? {
          queries: variant.query ?? 0,
          mutations: variant.mutation ?? 0,
          subscriptions: variant.subscription ?? 0,
          objects: variant.object ?? 0,
          inputs: variant.input ?? 0,
          enums: variant.enum ?? 0,
          unions: variant.union ?? 0,
          interfaces: variant.interface ?? 0,
          scalars: variant.scalar ?? 0,
          directives: variant.directive ?? 0,
          requiresScopes:
            typeof definition === 'string'
              ? (definition.match(/@requiresScopes\b/g) ?? []).length
              : 0,
        }
      : {}),
    servers: scan?.servers ?? apiStore.servers?.length ?? 0,
    deprecated: counts.deprecated,
    ...securityShape(apiStore.securitySchemeStore),
  };

  return {
    id: 'redocInitial',
    object: 'initial',
    uri: input.uri,
    layout: input.layout,
    ...(input.typeOfUsage ? { typeOfUsage: input.typeOfUsage } : {}),
    operationsCount: counts.operations,
    schemasCount: Object.keys(apiStore.schemaStore ?? {}).length,
    ...(scan?.specVersion ? { specVersion: scan.specVersion } : {}),
    extensionsCount: scan?.extensionsCount ?? 0,
    ...(scan && Object.keys(scan.redocExtensions).length
      ? { redocExtensions: scan.redocExtensions }
      : {}),
    hasCodeSamples: scan?.hasCodeSamples ?? false,
    ...(input.buildTimings ?? {}),
    isLocalhost: isLocalhost(input.hostname),
    landedOn: input.landedOn,
    ...(input.options ? { options: input.options } : {}),
    shape,
  };
}
