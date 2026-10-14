import type {
  OpenAPIExample,
  OpenAPIMediaType,
  OpenAPIServer,
  OperationInfo,
} from '../../types/openapi.js';
import type { StoreContext } from '../../types/store.js';
import {
  type Referenced,
  type SecuritySchemeType,
  type securitySchemeType,
  panelKind,
  schemaKind,
} from '../../types/common.js';
import type {
  CodeSampleSource,
  MediaTypeEntry,
  ParameterEntry,
  SecurityRequirement,
  ServerEntry,
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
import { pickFormFieldEncoding } from './utils/form-encoding.js';
import { pickOperationServers } from './utils/operation.js';
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

  const responsesMap = (operationInfo as Record<string, unknown>).responses;
  const responseCodes = responsesMap ? Object.keys(responsesMap).filter(isStatusCode) : undefined;


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
    pointer: operationInfo.pathName,
    ...(href && { href }),
    ...(operationInfo.operationId && { openApiOperationId: operationInfo.operationId }),
    ...(operationInfo.summary && { summary: operationInfo.summary }),
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
    content?: Record<string, Referenced<OpenAPIMediaType>>;
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


  for (const param of allParams) {
    const loc = param.in as ParameterEntry['in'] | undefined;
    if (!loc || !paramsByLocation[loc]) continue;

    const paramContent = resolveContent(doc, param);
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
    });
  }

  return paramsByLocation;
}

function buildSecurityRequirements(
  operationInfo: OperationInfo,
  storeCtx: StoreContext,
): SecurityRequirement[] {
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
          in: scheme.in as Exclude<typeof scheme.in, 'user' | 'password'>,
          scheme: scheme.scheme,
          bearerFormat: scheme.bearerFormat,
          openIdConnectUrl: scheme.openIdConnectUrl,
          flows: scheme.flows,
        };
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
): Record<string, MediaTypeEntry> | undefined {
  const rawRequestBody = operationInfo.requestBody as Record<string, unknown> | undefined;
  const requestBody = rawRequestBody
    ? (resolveRef(doc, rawRequestBody, ignoreNamedSchemas) ?? rawRequestBody)
    : undefined;
  const rbContent = resolveContent(doc, requestBody);

  if (!rbContent || !storeCtx) return undefined;

  const requestBodyMap: Record<string, MediaTypeEntry> = {};
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
    const encoding = pickFormFieldEncoding(mediaType, content.encoding, doc, content.schema);
    requestBodyMap[mediaType] = {
      schemaId: bodySchemaId,
      ...(exampleIds.length > 0 && { exampleIds }),
      ...(encoding && { encoding }),
    };
  }

  return requestBodyMap;
}

