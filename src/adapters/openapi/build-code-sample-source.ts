import type { OpenAPIExample, OpenAPIServer, OperationInfo } from '../../types/openapi.js';
import type { StoreContext } from '../../types/store.js';
import {
  type SecuritySchemeType,
  type securitySchemeType,
  panelKind,
  schemaKind,
} from '../../types/common.js';
import type {
  CodeSampleSource,
  ParameterEntry,
  SecurityRequirement,
  ServerEntry,
  CodeSampleRequestValues as CSRequestValues,
} from '../../services/code-samples/index.js';

import { isRbacKey, readRbacScope, rbacProp } from '../rbac.js';

import {
  registerExample,
  pickRenderableDescription,
  registerSchema,
  resolveContent,
  resolveRef,
} from '../helpers.js';
import { isStatusCode } from '../../utils/status-code.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { applyIgnoreNamedSchemasDeep } from './utils/applyIgnoreNamedSchemasDeep.js';
import { pickOperationServers } from './utils/merge-mock-server.js';
import { mergeSecurityIntoScheme } from './configure/merge-utils.js';
import {
  hasOpenApiExampleValue,
  resolveOpenApiExampleValue,
} from './resolve-openapi-example-value.js';

function resolveParamRef(
  param: Record<string, unknown>,
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): Record<string, unknown> {
  const top = resolveRef(doc, param, ignoreNamedSchemas) ?? param;
  return applyIgnoreNamedSchemasDeep(top, ignoreNamedSchemas) as Record<string, unknown>;
}

export function buildCodeSampleSource(
  operationInfo: OperationInfo,
  storeCtx: StoreContext,
  ignoreNamedSchemas?: Set<string>,
  isWebhook?: boolean,
  href?: string,
): CodeSampleSource {
  const doc = storeCtx?.document ?? {};
  const opServers = buildOperationServers(
    operationInfo,
    doc,
  );
  const paramsByLocation = buildParametersByLocation(
    operationInfo,
    doc,
    storeCtx,
    ignoreNamedSchemas,
  );
  const security = buildSecurityRequirements(operationInfo, storeCtx);
  const requestBodyMap = buildRequestBodyMap(operationInfo, doc, storeCtx, ignoreNamedSchemas);
  const requestValues = buildRequestValues(operationInfo);

  const responsesMap = (operationInfo as Record<string, unknown>).responses;
  const responseCodes = responsesMap ? Object.keys(responsesMap).filter(isStatusCode) : undefined;

  const securityGroupsRaw = operationInfo.security as Array<Record<string, string[]>> | undefined;

  return {
    kind: panelKind.CODE_SAMPLE,
    operationType: isWebhook ? 'webhook' : 'http',
    method: operationInfo.httpVerb?.toUpperCase() ?? 'GET',
    path: operationInfo.pathName ?? '/',
    servers: opServers,
    parameters: paramsByLocation,
    security,
    requestBody: requestBodyMap,
    responseCodes,
    requestValues,
    pointer: operationInfo.pathName,
    ...(href && { href }),
    ...(operationInfo.operationId && { openApiOperationId: operationInfo.operationId }),
    ...(operationInfo.summary && { summary: operationInfo.summary }),
    ...(securityGroupsRaw && securityGroupsRaw.length > 1 && { securityGroups: securityGroupsRaw }),
  };
}

function buildOperationServers(
  operationInfo: OperationInfo,
  doc: Record<string, unknown>,
): ServerEntry[] {
  const documentServers = (doc as { servers?: OpenAPIServer[] }).servers;
  let mergedServers = pickOperationServers(
    operationInfo.servers,
    documentServers,
  ) as OpenAPIServer[];


  const opServers: ServerEntry[] = mergedServers.map((s) => ({
    url: s.url ?? '',
    name: s.name,
    description: typeof s.description === 'string' ? s.description : undefined,
    ...(s.isMockServer && { isMockServer: true }),
    variables:
      s.variables && Object.keys(s.variables).length > 0
        ? Object.fromEntries(
            Object.entries(s.variables).map(([k, v]) => [k, { default: v.default, enum: v.enum }]),
          )
        : undefined,
  }));

  return opServers.length > 0 ? opServers : [{ url: '/' }];
}

function buildParametersByLocation(
  operationInfo: OperationInfo,
  doc: Record<string, unknown>,
  storeCtx: StoreContext,
  ignoreNamedSchemas?: Set<string>,
): CodeSampleSource['parameters'] {
  const rawParams = operationInfo.parameters ?? [];
  const allParams = rawParams.map((p) => resolveParamRef(p, doc, ignoreNamedSchemas)) as {
    name?: string;
    in?: string;
    schema?: Record<string, unknown>;
    content?: Record<string, { schema?: unknown }>;
    example?: unknown;
    examples?: Record<string, unknown>;
    required?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
  }[];

  const paramsByLocation: CodeSampleSource['parameters'] = {
    path: [],
    query: [],
    querystring: [],
    header: [],
    cookie: [],
  };

  const serverRequestValues = operationInfo.requestValues?.serverRequestValues;

  for (const param of allParams) {
    const loc = param.in as ParameterEntry['in'] | undefined;
    if (!loc || !paramsByLocation[loc]) continue;

    const paramContent = param.content as Record<string, { schema?: unknown }> | undefined;
    const serializationMime = paramContent ? Object.keys(paramContent)[0] : undefined;
    const rawEffectiveSchema =
      serializationMime && paramContent
        ? (paramContent[serializationMime]?.schema as Record<string, unknown> | undefined)
        : (param.schema as Record<string, unknown> | undefined);

    const effectiveSchema =
      rawEffectiveSchema && typeof rawEffectiveSchema === 'object'
        ? ((resolveRef(doc, rawEffectiveSchema, ignoreNamedSchemas) ??
            rawEffectiveSchema) as Record<string, unknown>)
        : rawEffectiveSchema;

    let schemaId: string | undefined;
    if (effectiveSchema && storeCtx) {
      schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: effectiveSchema,
      });
    }

    const exampleFromSchema =
      effectiveSchema &&
      typeof effectiveSchema === 'object' &&
      'example' in (effectiveSchema as Record<string, unknown>)
        ? (effectiveSchema as Record<string, unknown>).example
        : undefined;

    let exampleFromNamedExamples: unknown;
    if (param.examples && typeof param.examples === 'object') {
      for (const rawNamedExample of Object.values(param.examples)) {
        if (!rawNamedExample || typeof rawNamedExample !== 'object') continue;
        const resolvedNamedExample =
          resolveRef<OpenAPIExample>(doc, rawNamedExample as OpenAPIExample, ignoreNamedSchemas) ??
          (rawNamedExample as OpenAPIExample);
        if (hasOpenApiExampleValue(resolvedNamedExample)) {
          exampleFromNamedExamples = resolveOpenApiExampleValue(resolvedNamedExample);
          break;
        }
      }
    }

    const serverValues: Record<string, { example?: unknown }> = {};
    if (serverRequestValues && param.name) {
      for (const [sUrl, vals] of Object.entries(serverRequestValues)) {
        const locKey =
          loc === 'querystring'
            ? 'queryString'
            : loc === 'header'
              ? 'headers'
              : loc === 'cookie'
                ? 'cookies'
                : loc;
        const override = (vals as Record<string, Record<string, unknown>>)?.[locKey]?.[param.name];
        if (override != null) {
          serverValues[sUrl] = { example: override };
        }
      }
    }

    paramsByLocation[loc].push({
      name: param.name ?? '',
      in: loc,
      required: param.required,
      example: param.example ?? exampleFromNamedExamples ?? exampleFromSchema,
      schemaId,
      serializationMime,
      style: param.style,
      explode: param.explode,
      allowReserved: param.allowReserved,
      ...(Object.keys(serverValues).length > 0 && { serverValues }),
    });
  }

  return paramsByLocation;
}

function buildSecurityRequirements(
  operationInfo: OperationInfo,
  storeCtx: StoreContext,
): SecurityRequirement[] {
  const configuredSecurity = operationInfo.requestValues?.security;
  const serverRequestValues = operationInfo.requestValues?.serverRequestValues;
  const securityArr = operationInfo.security as Array<Record<string, unknown>> | undefined;
  const security: SecurityRequirement[] = [];
  if (!securityArr || !storeCtx) return security;

  for (const req of securityArr) {
    const schemeNames = Object.keys(req);
    const schemes = schemeNames
      .map((name) => storeCtx.securitySchemeStore[name])
      .filter(Boolean)
      .map((scheme) => {
        let entry = {
          id: scheme.id,
          type: scheme.type as Exclude<SecuritySchemeType, typeof securitySchemeType.MUTUAL_TLS>,
          name: scheme.paramName,
          in: scheme.in,
          scheme: scheme.scheme,
          bearerFormat: scheme.bearerFormat,
          openIdConnectUrl: scheme.openIdConnectUrl,
          flows: scheme.flows,
          'x-defaultClientId': scheme['x-defaultClientId'],
          'x-defaultAccessToken': scheme['x-defaultAccessToken'],
          'x-defaultTokenType': scheme['x-defaultTokenType'],
          'x-defaultClientSecret': scheme['x-defaultClientSecret'],
          'x-defaultUsername': scheme['x-defaultUsername'],
          'x-defaultPassword': scheme['x-defaultPassword'],
          serverValues: scheme.serverValues ? { ...scheme.serverValues } : undefined,
        };
        if (configuredSecurity) {
          entry = mergeSecurityIntoScheme(entry, configuredSecurity);
        }
        if (serverRequestValues) {
          for (const [serverUrl, vals] of Object.entries(serverRequestValues)) {
            if (vals?.security) {
              entry = mergeSecurityIntoScheme(entry, vals.security, serverUrl);
            }
          }
        }
        return entry;
      });
    if (schemes.length > 0) {
      const scopes = schemeNames.flatMap((name) => (req[name] as string[]) ?? []);
      security.push({ schemes, scopes });
    }
  }

  return security;
}

function buildRequestBodyMap(
  operationInfo: OperationInfo,
  doc: Record<string, unknown>,
  storeCtx: StoreContext,
  ignoreNamedSchemas?: Set<string>,
): Record<string, { schemaId?: string; exampleIds?: string[] }> | undefined {
  const rawRequestBody = operationInfo.requestBody as Record<string, unknown> | undefined;
  const requestBody = rawRequestBody
    ? (resolveRef(doc, rawRequestBody, ignoreNamedSchemas) ?? rawRequestBody)
    : undefined;
  const rbContent = resolveContent(doc, requestBody, ignoreNamedSchemas);

  if (!rbContent || !storeCtx) return undefined;

  const requestBodyMap: Record<string, { schemaId?: string; exampleIds?: string[] }> = {};
  for (const [mediaType, content] of Object.entries(rbContent)) {
    let bodySchemaId: string | undefined;
    const itemSchemaRaw = (content as { itemSchema?: unknown }).itemSchema;
    const schemaSource = (content.schema ?? itemSchemaRaw) as Record<string, unknown> | undefined;
    if (schemaSource) {
      const resolvedBodySchema =
        (resolveRef(doc, schemaSource, ignoreNamedSchemas) as
          | Record<string, unknown>
          | undefined) ?? schemaSource;
      bodySchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: resolvedBodySchema,
      });
    }
    // Register under the same pointer-derived ids as the panel content walk
    // (collectExampleIds) so both sides point at one shared store entry.
    const mediaPointerBase = operationInfo.pointer
      ? `${operationInfo.pointer}/requestBody/content/${encodeJsonPointerSegment(
          mediaType,
        )}`.replace(/^\//, '')
      : undefined;
    const exampleIds: string[] = [];
    if (content.example !== undefined) {
      exampleIds.push(
        registerExample(storeCtx.exampleStore, {
          value: content.example,
          ...(mediaPointerBase && { id: `${mediaPointerBase}/example` }),
        }),
      );
    }
    if (content.examples) {
      const sectionRbac = readRbacScope(content.examples);
      for (const [exampleName, exVal] of Object.entries(content.examples)) {
        if (isRbacKey(exampleName)) continue;
        const resolved = resolveRef<OpenAPIExample>(doc, exVal, ignoreNamedSchemas);
        if (resolved) {
          const exampleRbac = readRbacScope(exVal) ?? readRbacScope(resolved) ?? sectionRbac;
          const id = registerExample(storeCtx.exampleStore, {
            value: resolveOpenApiExampleValue(resolved),
            key: exampleName,
            summary: typeof resolved.summary === 'string' ? resolved.summary : exampleName,
            description: pickRenderableDescription(resolved.description),
            externalValue:
              typeof resolved.externalValue === 'string' ? resolved.externalValue : undefined,
            ...rbacProp(exampleRbac),
            ...(mediaPointerBase && {
              id: `${mediaPointerBase}/examples/${encodeJsonPointerSegment(exampleName)}`,
            }),
          });
          exampleIds.push(id);
        }
      }
    }
    requestBodyMap[mediaType] = {
      schemaId: bodySchemaId,
      ...(exampleIds.length > 0 && { exampleIds }),
    };
  }

  return requestBodyMap;
}

function buildRequestValues(operationInfo: OperationInfo): CSRequestValues | undefined {
  const serverRequestValues = operationInfo.requestValues?.serverRequestValues;

  const rawEnvVars = operationInfo.requestValues?.envVariables as unknown;
  let envVariables: Record<string, string> | undefined;
  let serverEnvVariables: Record<string, Record<string, string>> | undefined;
  if (rawEnvVars && typeof rawEnvVars === 'object') {
    if ('values' in (rawEnvVars as Record<string, unknown>)) {
      const structured = rawEnvVars as {
        values?: Record<string, string>;
        serverValues?: Record<string, Record<string, string>>;
      };
      envVariables = structured.values;
      serverEnvVariables = structured.serverValues;
    } else {
      envVariables = rawEnvVars as Record<string, string>;
    }
  }

  const configuredBody = operationInfo.requestValues?.body;
  let serverBody: Record<string, unknown> | undefined;
  if (serverRequestValues) {
    for (const [serverUrl, vals] of Object.entries(serverRequestValues)) {
      if (vals?.body !== undefined) {
        serverBody = serverBody ?? {};
        serverBody[serverUrl] = vals.body;
      }
      if (vals?.envVariables) {
        serverEnvVariables = serverEnvVariables ?? {};
        serverEnvVariables[serverUrl] = {
          ...serverEnvVariables[serverUrl],
          ...vals.envVariables,
        };
      }
    }
  }

  const hasRequestValues =
    envVariables ||
    serverEnvVariables ||
    operationInfo.requestValues?.security ||
    configuredBody !== undefined ||
    serverBody;

  return hasRequestValues
    ? {
        ...(operationInfo.requestValues?.security && {
          security: operationInfo.requestValues.security as Record<string, unknown>,
        }),
        ...(envVariables && { envVariables }),
        ...(serverEnvVariables && { serverEnvVariables }),
        ...(configuredBody !== undefined && { body: configuredBody }),
        ...(serverBody && { serverBody }),
      }
    : undefined;
}
