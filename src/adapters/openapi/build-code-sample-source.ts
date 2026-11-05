import type {
  OpenAPIExample,
  OpenAPIMediaType,
  OpenAPISecurityRequirement,
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
  isRecord,
  pickRenderableDescription,
  registerSchema,
  resolveContent,
  resolveRef,
} from '../helpers.js';
import { isStatusCode } from '../../utils/status-code.js';
import { securityRequirements } from './utils/security.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { applyIgnoreNamedSchemasDeep } from './utils/applyIgnoreNamedSchemasDeep.js';
import { pickFormFieldEncoding } from './utils/form-encoding.js';
import { parameterList, pickOperationServers } from './utils/operation.js';
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

function pickNamedExampleValue(
  examples: Record<string, unknown> | undefined,
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): unknown {
  for (const rawNamedExample of Object.values(examples ?? {})) {
    if (!rawNamedExample || typeof rawNamedExample !== 'object') continue;
    const resolvedNamedExample =
      resolveRef<OpenAPIExample>(doc, rawNamedExample, ignoreNamedSchemas) ?? rawNamedExample;
    if (hasOpenApiExampleValue(resolvedNamedExample)) {
      return resolveOpenApiExampleValue(resolvedNamedExample);
    }
  }
  return undefined;
}

export function buildCodeSampleSource(
  operationInfo: OperationInfo,
  storeCtx: StoreContext,
  ignoreNamedSchemas?: Set<string>,
  isWebhook?: boolean,
  href?: string,
): CodeSampleSource {
  const doc = storeCtx?.document ?? {};
  const requirements = securityRequirements(operationInfo.security);
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
  const security = buildSecurityRequirements(requirements, storeCtx);
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
  let mergedServers: OpenAPIServer[] = pickOperationServers(operationInfo.servers, documentServers);

  const opServers: ServerEntry[] = mergedServers.map((s) => {
    const entry: ServerEntry = {
      url: s.url,
      name: s.name,
      description: typeof s.description === 'string' ? s.description : undefined,
      variables:
        s.variables && Object.keys(s.variables).length > 0
          ? Object.fromEntries(
              Object.entries(s.variables).map(([k, v]) => [
                k,
                { default: v.default, enum: v.enum },
              ]),
            )
          : undefined,
    };
    return entry;
  });

  return opServers.length > 0 ? opServers : [{ url: '/' }];
}

/**
 * The parameter's documented example, or `undefined` when nothing is documented. Picks the first
 * non-null of the parameter `example`, the first named `examples` value and the schema `example`.
 * In a query, a `null` with nothing else documented is an empty value; the schema's `const`,
 * `examples`, `enum` or `default` outranks it. In other locations `null` documents nothing.
 */
function pickParameterExample(
  loc: ParameterEntry['in'],
  paramExample: unknown,
  namedExample: unknown,
  schema: Record<string, unknown> | undefined,
): unknown {
  const schemaExample = schema && 'example' in schema ? schema.example : undefined;
  const candidates = [paramExample, namedExample, schemaExample];
  const value = candidates.find((candidate) => candidate != null);
  if (value !== undefined || loc !== 'query' || !candidates.includes(null)) return value;
  return schema && declaresSchemaValue(schema) ? undefined : null;
}

function declaresSchemaValue(schema: Record<string, unknown>): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.examples) && schema.examples.length > 0) ||
    (Array.isArray(schema.enum) && schema.enum.length > 0) ||
    schema.default !== undefined
  );
}

function buildParametersByLocation(
  operationInfo: OperationInfo,
  doc: Record<string, unknown>,
  storeCtx: StoreContext,
  ignoreNamedSchemas?: Set<string>,
): CodeSampleSource['parameters'] {
  const rawParams = parameterList(operationInfo.parameters) ?? [];
  const allParams = rawParams.map((p) => resolveParamRef(p, doc, ignoreNamedSchemas)) as {
    name?: string;
    in?: string;
    schema?: Record<string, unknown>;
    content?: Record<string, Referenced<OpenAPIMediaType>>;
    example?: unknown;
    examples?: Record<string, unknown>;
    required?: boolean;
    allowEmptyValue?: boolean;
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
        : param.schema;

    const effectiveSchema =
      rawEffectiveSchema && typeof rawEffectiveSchema === 'object'
        ? (resolveRef(doc, rawEffectiveSchema, ignoreNamedSchemas) ?? rawEffectiveSchema)
        : rawEffectiveSchema;

    let schemaId: string | undefined;
    if (effectiveSchema && storeCtx) {
      schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: effectiveSchema,
      });
    }

    const exampleFromNamedExamples = pickNamedExampleValue(param.examples, doc, ignoreNamedSchemas);

    const mediaType = serializationMime ? paramContent?.[serializationMime] : undefined;
    const exampleFromMediaType =
      mediaType?.example !== undefined
        ? mediaType.example
        : pickNamedExampleValue(mediaType?.examples, doc, ignoreNamedSchemas);

    paramsByLocation[loc].push({
      name: param.name ?? '',
      in: loc,
      required: param.required,
      example: pickParameterExample(
        loc,
        param.example,
        exampleFromNamedExamples !== undefined ? exampleFromNamedExamples : exampleFromMediaType,
        isRecord(effectiveSchema) ? effectiveSchema : undefined,
      ),
      // `allowEmptyValue` applies to query parameters only.
      ...(loc === 'query' && param.allowEmptyValue && { allowEmptyValue: true }),
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
  securityArr: OpenAPISecurityRequirement[] | undefined,
  storeCtx: StoreContext,
): SecurityRequirement[] {
  const security: SecurityRequirement[] = [];
  if (!securityArr || !storeCtx) return security;

  for (const req of securityArr) {
    const schemeNames = Object.keys(req);
    const schemes = schemeNames
      .map((name) => storeCtx.securitySchemeStore[name])
      .filter(Boolean)
      .map((scheme) => ({
        id: scheme.id,
        type: scheme.type as Exclude<SecuritySchemeType, typeof securitySchemeType.MUTUAL_TLS>,
        name: scheme.paramName,
        in: scheme.in as Exclude<typeof scheme.in, 'user' | 'password'>,
        scheme: scheme.scheme,
        bearerFormat: scheme.bearerFormat,
        openIdConnectUrl: scheme.openIdConnectUrl,
        flows: scheme.flows,
      }));
    if (schemes.length > 0) {
      const scopes = schemeNames.flatMap((name) => req[name] ?? []);
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
      const resolvedBodySchema = resolveRef(doc, schemaSource, ignoreNamedSchemas) ?? schemaSource;
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
