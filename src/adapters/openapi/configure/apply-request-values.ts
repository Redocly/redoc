import type {
  ConfigureRequestValues,
  ConfigureServerRequestValues,
} from '@redocly/theme/ext/configure';
import type {
  OperationInfo,
  OperationRequestValues,
  OpenAPIExample,
  OpenAPIParameter,
  OpenAPIParameterLocation,
  OpenAPIRequestBody,
  OpenAPIServer,
} from '../../../types/openapi.js';

import { isRecord, resolveRef, isOpenAPIRef } from '../../helpers.js';
import { openApiContext } from '../buildContext.js';
import {
  getEffectiveRequestValues,
  getParamValueMap,
  isDirectRequestValues,
  mergeBodyValue,
  updateObjectProperties,
  withServerVariableDefaults,
} from './merge-utils.js';
import { hasOpenApiExampleValue } from '../resolve-openapi-example-value.js';
import { excludeMockServers } from '../utils/merge-mock-server.js';

type SpecDocument = Record<string, unknown>;

function applyParameters(
  operationInfo: OperationInfo,
  document: SpecDocument,
  ignoreNamedSchemas: Set<string> | undefined,
  requestValues: ConfigureRequestValues,
): void {
  const parameters = operationInfo.parameters;
  if (!parameters?.length) return;

  // Copy-on-write: the array and its entries can be the document's own, which other renders
  // read and which arrives frozen from the Try it definition fetch. Only replace on a change.
  let next: typeof parameters | undefined;

  for (let i = 0; i < parameters.length; i++) {
    const rawParam = parameters[i];
    const resolved = isOpenAPIRef(rawParam)
      ? resolveRef<OpenAPIParameter>(document, rawParam, ignoreNamedSchemas)
      : (rawParam as OpenAPIParameter);
    if (!resolved?.in || !resolved.name) continue;

    const source = getParamValueMap(resolved.in as OpenAPIParameterLocation, requestValues);
    const value = source?.[resolved.name];
    if (value === undefined) continue;

    next ??= [...parameters];
    next[i] = { ...resolved, example: value };
  }

  if (next) {
    operationInfo.parameters = next;
  }
}

/** Returns a copy with `body` merged into the effective value field, or undefined when unchanged. */
function withMergedEffectiveExampleField(
  example: OpenAPIExample,
  body: unknown,
): OpenAPIExample | undefined {
  if (!hasOpenApiExampleValue(example)) return undefined;

  const targetKey: 'dataValue' | 'serializedValue' | 'value' =
    example.dataValue !== undefined
      ? 'dataValue'
      : example.serializedValue !== undefined
        ? 'serializedValue'
        : 'value';

  const current = (example as Record<string, unknown>)[targetKey];
  const merged = isRecord(current) && isRecord(body) ? updateObjectProperties(current, body) : body;
  if (merged === undefined) return undefined;
  return { ...example, [targetKey]: merged };
}

function applyRequestBody(
  operationInfo: OperationInfo,
  document: SpecDocument,
  ignoreNamedSchemas: Set<string> | undefined,
  requestValues: ConfigureRequestValues,
): void {
  if (requestValues.body === undefined) return;

  const rawRequestBody = operationInfo.requestBody;
  if (!rawRequestBody) return;

  const requestBody =
    resolveRef<OpenAPIRequestBody>(document, rawRequestBody, ignoreNamedSchemas) ?? rawRequestBody;
  if (isOpenAPIRef(requestBody) || !requestBody.content) return;

  // Copy-on-write throughout: content entries and their examples can be the document's own
  // (shared with the rendered docs, and frozen on the Try it fetch path).
  let nextContent: Record<string, Record<string, unknown>> | undefined;

  for (const [mediaType, entry] of Object.entries(requestBody.content)) {
    if (!entry) continue;
    let nextEntry: Record<string, unknown> | undefined;

    if (entry.example !== undefined) {
      const merged = mergeBodyValue(entry.example, requestValues.body);
      if (merged !== undefined) {
        nextEntry = { ...entry, example: merged };
      }
    }

    for (const bucket of ['examples', 'formExamples'] as const) {
      const examples = (entry as Record<string, unknown>)[bucket] as
        | Record<string, unknown>
        | undefined;
      if (!examples || typeof examples !== 'object') continue;

      let nextExamples: Record<string, unknown> | undefined;
      for (const [name, rawExample] of Object.entries(examples)) {
        if (!rawExample || typeof rawExample !== 'object') continue;
        const example =
          resolveRef<OpenAPIExample>(document, rawExample as OpenAPIExample, ignoreNamedSchemas) ??
          (rawExample as OpenAPIExample);
        if (isOpenAPIRef(example)) continue;
        const mergedExample = withMergedEffectiveExampleField(example, requestValues.body);
        if (!mergedExample) continue;
        nextExamples ??= { ...examples };
        nextExamples[name] = mergedExample;
      }

      if (nextExamples) {
        nextEntry = { ...(nextEntry ?? entry), [bucket]: nextExamples };
      }
    }

    if (nextEntry) {
      nextContent ??= { ...(requestBody.content as Record<string, Record<string, unknown>>) };
      nextContent[mediaType] = nextEntry;
    }
  }

  if (nextContent) {
    operationInfo.requestBody = { ...requestBody, content: nextContent } as OpenAPIRequestBody;
  }
}

function setOperationRequestValues(
  operationInfo: OperationInfo,
  requestValues: ConfigureRequestValues,
): void {
  if (requestValues.security || requestValues.envVariables || requestValues.body !== undefined) {
    operationInfo.requestValues = {
      ...operationInfo.requestValues,
      ...(requestValues.security && { security: requestValues.security }),
      ...(requestValues.envVariables && { envVariables: requestValues.envVariables }),
      ...(requestValues.body !== undefined && { body: requestValues.body }),
    };
  }
}

function buildServerRequestValues(
  servers: OpenAPIServer[],
  serverMap: ConfigureServerRequestValues,
): {
  serverRequestValues: NonNullable<OperationRequestValues['serverRequestValues']>;
  servers: OpenAPIServer[];
} {
  const serverRequestValues: NonNullable<OperationRequestValues['serverRequestValues']> = {};
  let nextServers = servers;
  for (const server of servers) {
    const sv = serverMap[server.url];
    if (!sv) continue;

    if (sv.serverVariables) {
      nextServers = withServerVariableDefaults(nextServers, sv.serverVariables, server.url);
    }
    serverRequestValues[server.url] = {
      headers: sv.headers,
      queryString: sv.query,
      cookies: sv.cookie,
      security: sv.security,
      ...(sv.envVariables && { envVariables: sv.envVariables }),
      ...(sv.body !== undefined && { body: sv.body }),
    };
  }
  return { serverRequestValues, servers: nextServers };
}

function withoutMockBuckets(
  requestValues: ConfigureRequestValues | ConfigureServerRequestValues,
  servers: OpenAPIServer[],
): ConfigureRequestValues | ConfigureServerRequestValues {
  if (isDirectRequestValues(requestValues)) return requestValues;
  const mockUrls = new Set(
    servers.filter((server) => server.isMockServer).map((server) => server.url),
  );
  if (mockUrls.size === 0) return requestValues;
  return Object.fromEntries(
    Object.entries(requestValues).filter(([url]) => !mockUrls.has(url)),
  ) as ConfigureServerRequestValues;
}

/** Server variables are merged copy-on-write, so the operation carries the resolved servers. */
function applyResolvedServers(
  operationInfo: OperationInfo,
  servers: OpenAPIServer[],
  nextServers: OpenAPIServer[],
): void {
  if (nextServers !== servers) {
    operationInfo.servers = nextServers;
  }
}

export function applyRequestValuesToOperationInfo(
  operationInfo: OperationInfo,
  requestValues: ConfigureRequestValues | ConfigureServerRequestValues,
  mergedServers?: OpenAPIServer[],
): void {
  if (!requestValues || Object.keys(requestValues).length === 0) return;

  const { options, storeCtx, document } = openApiContext.get();
  const { ignoreNamedSchemas } = options;
  const docServers: OpenAPIServer[] = document.servers ?? [];
  const operationServers = operationInfo.servers;
  const servers =
    mergedServers && mergedServers.length > 0
      ? mergedServers
      : operationServers && operationServers.length > 0
        ? operationServers
        : docServers;

  const nonMockServers = excludeMockServers(servers);
  const effective =
    nonMockServers.length > 0
      ? getEffectiveRequestValues(withoutMockBuckets(requestValues, servers), nonMockServers)
      : getEffectiveRequestValues(requestValues, servers);
  if (effective) {
    applyParameters(operationInfo, storeCtx.document, ignoreNamedSchemas, effective);
    applyRequestBody(operationInfo, storeCtx.document, ignoreNamedSchemas, effective);
    setOperationRequestValues(operationInfo, effective);
  }

  if (isDirectRequestValues(requestValues)) {
    applyResolvedServers(
      operationInfo,
      servers,
      withServerVariableDefaults(servers, requestValues.serverVariables),
    );
    return;
  }

  const { serverRequestValues, servers: nextServers } = buildServerRequestValues(
    servers,
    requestValues,
  );
  applyResolvedServers(operationInfo, servers, nextServers);
  if (Object.keys(serverRequestValues).length > 0) {
    operationInfo.requestValues = {
      ...operationInfo.requestValues,
      serverRequestValues,
    };
  }
}
