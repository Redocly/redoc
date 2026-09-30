import type { Node } from '@markdoc/markdoc';
import type {
  ApiItemContent,
  ContentNode,
  ExamplesNode,
  ItemContentNode,
  MediaTypeContent,
  PanelNode,
  ParameterData,
  SecurityNode,
  SecuritySchemeDetail,
} from '../../../../types/content.js';
import type {
  NormalizedCallback,
  NormalizedCallbackOperation,
  OpenAPIExample,
  OpenAPIHeader,
  OpenAPIMediaType,
  OpenAPIRequestBody,
  OpenAPIResponse,
  OpenAPISchema,
  OpenAPIServer,
  OperationInfo,
} from '../../../../types/openapi.js';
import type { ExampleType } from '../../../../types/schema.js';
import {
  type Referenced,
  contentType,
  itemVariant,
  nodeTypes,
  panelKind,
  schemaKind,
} from '../../../../types/common.js';
import {
  type DescriptionSegment,
  extractDescriptionSegments,
  isMarkdocAst,
  resolveMarkdocHeadingIds,
} from '../../../utils/markdoc.js';
import { type ParseMarkdownOptions, parseMarkdown } from '../../../utils/parseMarkdown.js';
import type { CodeSampleSource } from '../../../../services/code-samples/index.js';

import { isRbacKey, readRbacScope, rbacProp } from '../../../rbac.js';

import {
  registerExample,
  pickRenderableDescription,
  registerSchema,
  resolveContent,
  resolveRef,
} from '../../../helpers.js';
import { applyIgnoreNamedSchemasDeep } from '../../utils/applyIgnoreNamedSchemasDeep.js';
import { isStatusCode } from '../../../../utils/status-code.js';
import { getExtensionsForDisplay } from '../../../../utils/extract-extensions.js';
import { openApiContext } from '../../buildContext.js';
import { buildCodeSampleSource } from '../../build-code-sample-source.js';
import { pickOperationServers } from '../../utils/merge-mock-server.js';
import { toRelativePath } from '../../../../utils/url.js';
import { encodeJsonPointerSegment } from '../../../../utils/refPointer.js';
import {
  hasOpenApiExampleValue,
  resolveOpenApiExampleValue,
} from '../../resolve-openapi-example-value.js';

const REQUEST_SECTION_DEEPLINK_SUFFIX = 'request';
const RESPONSES_SECTION_DEEPLINK_SUFFIX = 'responses';
const CALLBACKS_SECTION_DEEPLINK_SUFFIX = 'callbacks';

/**
 * Callback ids in the legacy openapi-docs shape, `<name>/<verb>`, so links shared from it
 * still resolve. One entry is emitted per url expression, so that pair can repeat within an
 * operation — later duplicates take a `~<n>` suffix, which legacy lacked and collided on.
 *
 * The separator is deliberately not `/`: an id must never be a path-segment prefix of a
 * sibling's, or hash matching would treat `<name>/<verb>` as also naming `<name>/<verb>~1`.
 */
export function createCallbackIdFactory(): (name: string, httpVerb: string) => string {
  const seenCounts = new Map<string, number>();

  return (name, httpVerb) => {
    const base = `${name}/${httpVerb}`;
    const seen = seenCounts.get(base) ?? 0;
    seenCounts.set(base, seen + 1);
    return seen === 0 ? base : `${base}~${seen}`;
  };
}

export function buildItemContent(operationInfo: OperationInfo, pageSlug: string): ApiItemContent {
  const { options, storeCtx, basePath } = openApiContext.get();
  const operationName =
    operationInfo.summary ||
    operationInfo.operationId ||
    operationInfo.pathName ||
    'Unknown Operation';
  const children: ContentNode[] = [];
  const isWebhook = operationInfo.isWebhook || false;

  const headerChildren: ContentNode[] = [
    {
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: operationName,
      badges: operationInfo['x-badges'],
      isWebhook,
      deprecated: operationInfo.deprecated,
      showPageActions: true,
    },
  ];

  const operationExtensions = getExtensionsForDisplay(operationInfo, options.showExtensions);
  if (Object.keys(operationExtensions).length > 0) {
    headerChildren.push({
      nodeType: nodeTypes.EXTENSIONS,
      extensions: operationExtensions,
    });
  }

  children.push({
    nodeType: nodeTypes.CONTAINER,
    children: headerChildren,
    panels: [],
  });

  const ignoreNamedSchemas = options.ignoreNamedSchemas;

  const definitionSamples = operationInfo['x-codeSamples']?.map(({ lang, label, source }) => ({
    lang,
    label,
    source,
  }));

  const rawServers = pickOperationServers(
    operationInfo.servers,
    storeCtx?.document?.servers as OpenAPIServer[] | undefined,
  ) as OpenAPIServer[];

  let mergedServers = rawServers.filter((s): s is OpenAPIServer => typeof s?.url === 'string');
  const opServers = mergedServers.map((s) => {
    const serverRbac = readRbacScope(s);
    return {
      url: s.url ?? '',
      name: s.name,
      description: typeof s.description === 'string' ? s.description : undefined,
      ...(s.isMockServer && { isMockServer: true }),
      variables:
        s.variables && Object.keys(s.variables).length > 0
          ? Object.fromEntries(
              Object.entries(s.variables).map(([k, v]) => [k, { default: v.default }]),
            )
          : undefined,
      ...rbacProp(serverRbac),
    };
  });

  const requestChildren = buildRequestChildren(operationInfo, ignoreNamedSchemas, isWebhook);
  const operationId = toRelativePath(pageSlug, basePath);

  let descriptionSegments: DescriptionSegment[] = [];
  if (operationInfo.description) {
    resolveMarkdocHeadingIds(
      operationInfo.description,
      operationId,
      REQUEST_SECTION_DEEPLINK_SUFFIX,
    );
    descriptionSegments = extractDescriptionSegments(operationInfo.description, options);
  }
  const hasSchemaDefinition = descriptionSegments.some((s) => s.kind === 'schemaDefinition');

  const bodyNode = requestChildren.find(
    (child) => child.nodeType === nodeTypes.ITEM && (child as ItemContentNode).variant === 'body',
  ) as ItemContentNode | undefined;

  const codeSampleSource = buildCodeSampleSourceFromContext(
    operationInfo,
    ignoreNamedSchemas,
    isWebhook,
    operationId || undefined,
  );
  const bodySchemaId = bodyNode?.schemaId;
  const bodyMediaTypes = bodyNode?.mediaTypes;
  const bodyMediaTypeSchemas = bodyNode?.mediaTypeSchemas as
    | Record<string, { schemaId?: string; exampleIds?: string[] }>
    | undefined;

  const bodyRbac = readRbacScope(bodyNode);

  const requestPanels: PanelNode[] = [
    {
      children: [
        {
          kind: panelKind.CODE_SAMPLE,
          source: codeSampleSource,
          definitionSamples: definitionSamples?.length ? definitionSamples : undefined,
          isWebhook,
          servers: opServers?.length ? opServers : undefined,
          schemaId: bodySchemaId,
          exampleIds: bodyNode?.exampleIds,
          mediaTypes: bodyMediaTypes,
          mediaTypeSchemas: bodyMediaTypeSchemas,
          examples: bodyNode?.exampleIds?.map(() => ({})) ?? [],
        },
      ],
      ...rbacProp(bodyRbac),
    },
  ];

  const hasRequestSection = requestChildren.length > 0 || descriptionSegments.length > 0;

  if (hasRequestSection) {
    if (hasSchemaDefinition) {
      children.push({
        nodeType: nodeTypes.CONTAINER,
        children: [
          {
            nodeType: nodeTypes.HEADER,
            level: 4,
            label: 'Request',
            labelTranslationKey: 'request',
            deepLinkSuffix: REQUEST_SECTION_DEEPLINK_SUFFIX,
          },
        ],
        panels: [],
      });

      for (const segment of descriptionSegments) {
        if (segment.kind === 'schemaDefinition') {
          children.push(segment.node);
        } else {
          children.push({
            nodeType: nodeTypes.CONTAINER,
            children: [segment.node],
            panels: [],
          });
        }
      }

      children.push({
        nodeType: nodeTypes.CONTAINER,
        children: [...requestChildren],
        panels: requestPanels,
      });
    } else {
      children.push({
        nodeType: nodeTypes.CONTAINER,
        children: [
          {
            nodeType: nodeTypes.HEADER,
            level: 4,
            label: 'Request',
            labelTranslationKey: 'request',
            deepLinkSuffix: REQUEST_SECTION_DEEPLINK_SUFFIX,
          },
          ...descriptionSegments.map((s) => s.node),
          ...requestChildren,
        ],
        panels: requestPanels,
      });
    }
  } else {
    children.push({
      nodeType: nodeTypes.CONTAINER,
      children: [
        {
          nodeType: nodeTypes.HEADER,
          level: 4,
          label: 'Request',
          labelTranslationKey: 'request',
          deepLinkSuffix: REQUEST_SECTION_DEEPLINK_SUFFIX,
        },
        {
          nodeType: nodeTypes.EMPTY_MESSAGE,
          label: 'No request data',
          labelTranslationKey: 'noRequestData',
        },
      ],
      panels: requestPanels,
    });
  }

  if (operationInfo.responses) {
    const responsesNode = buildResponsesSection(
      operationInfo,
      options,
      operationId,
      ignoreNamedSchemas,
    );
    if (responsesNode) {
      const hasAnyResponseSample = responsesNode.responses?.some(
        (response) => response.schemaId || (response.exampleIds?.length ?? 0) > 0,
      );
      const responseCodes = responsesNode?.responses?.map((response) => {
        const rbac = readRbacScope(response);
        return {
          code: response.code,
          schemaId: response.schemaId,
          exampleIds: response.exampleIds,
          mediaTypes: response.mediaTypes as string[] | undefined,
          mediaTypeContent: response.mediaTypeContent as
            | Record<string, { schemaId?: string; exampleIds?: string[] }>
            | undefined,
          ...rbacProp(rbac),
        };
      });

      const responsesPanels: PanelNode[] = [];
      if (hasAnyResponseSample) {
        responsesPanels.push({
          children: [
            {
              kind: panelKind.RESPONSE,
              // Node-level schemaId/exampleIds are reserved for codeless RESPONSE
              // panels; per-code sample data lives in responseCodes entries.
              responseCodes,
              ...(isWebhook && { isEvent: true }),
              examples: [],
            },
          ],
        } as ExamplesNode);
      }

      const responsesRbac = readRbacScope(operationInfo.responses);

      children.push({
        nodeType: nodeTypes.CONTAINER,
        children: [
          {
            nodeType: nodeTypes.HEADER,
            level: 4,
            label: 'Responses',
            labelTranslationKey: 'responses',
            deepLinkSuffix: 'responses',
          },
          responsesNode,
        ],
        panels: responsesPanels.length > 0 ? responsesPanels : [],
        ...rbacProp(responsesRbac),
      });
    }
  }

  if (Array.isArray(operationInfo.callbacks) && operationInfo.callbacks.length > 0) {
    children.push(...buildCallbackSections(operationInfo, operationId, ignoreNamedSchemas));
  }


  const hasBodyExamples = requestChildren.some((child) => {
    const item = child as ItemContentNode;
    return item.variant === 'body' && ((item.exampleIds?.length ?? 0) > 0 || !!item.schemaId);
  });
  const hasSamples = hasBodyExamples || (definitionSamples?.length ?? 0) > 0;

  return {
    contentType: contentType.ITEM,
    itemVariant: itemVariant.HTTP_ITEM,
    meta: {
      sourceId: operationInfo.operationId,
      name: operationName,
      deprecated: operationInfo.deprecated,
      isWebhook: operationInfo.isWebhook || false,
      pointer: operationInfo.pointer,
      hasSamples,
    },
    children,
  };
}

function buildCallbackSections(
  operationInfo: OperationInfo,
  operationId: string,
  ignoreNamedSchemas?: Set<string>,
): ContentNode[] {
  const sections: ContentNode[] = [
    {
      nodeType: nodeTypes.CONTAINER,
      children: [
        {
          nodeType: nodeTypes.HEADER,
          level: 4,
          label: 'Callbacks',
          labelTranslationKey: 'callbacks',
          deepLinkSuffix: CALLBACKS_SECTION_DEEPLINK_SUFFIX,
        },
      ],
      panels: [],
    },
  ];

  const nextCallbackId = createCallbackIdFactory();
  for (const cb of operationInfo.callbacks ?? []) {
    if (!cb.operations) continue;

    for (const callback of cb.operations) {
      const httpVerb = callback.httpVerb ?? 'post';
      const callbackId = nextCallbackId(cb.name, httpVerb);
      sections.push(
        buildCallbackOperationSection(
          operationInfo,
          cb,
          callback,
          callbackId,
          operationId,
          ignoreNamedSchemas,
        ),
      );
    }
  }

  return sections;
}

function buildCallbackOperationSection(
  operationInfo: OperationInfo,
  cb: NormalizedCallback,
  callback: NormalizedCallbackOperation,
  callbackId: string,
  operationId: string,
  ignoreNamedSchemas?: Set<string>,
): ContentNode {
  const { options } = openApiContext.get();
  const httpVerb = callback.httpVerb ?? 'post';

  const cbOpInfo: OperationInfo = {
    pointer: operationInfo.pointer + '/callbacks/' + cb.name + '/' + httpVerb,
    pathName: callback.pathName ?? cb.url ?? '',
    httpVerb,
    summary: callback.summary,
    deprecated: callback.deprecated,
    isWebhook: false,
    isAdditionalOperation: false,
    tags: [],
    parameters: callback.parameters,
    requestBody: callback.requestBody,
    responses: callback.responses,
    servers: callback.servers,
    security: callback.security,
  };

  const cbRequestChildren = buildRequestChildren(cbOpInfo, ignoreNamedSchemas, true);
  const cbResponsesSection = buildResponsesSection(
    cbOpInfo,
    options,
    `${operationId}/callbacks/${callbackId}`,
    ignoreNamedSchemas,
  );
  const contentChildren: ContentNode[] = [...cbRequestChildren];
  if (cbResponsesSection) {
    contentChildren.push(cbResponsesSection);
  }

  const cbExternalDocs = callback.externalDocs as { url: string; description?: string } | undefined;
  const cbExtensions = getExtensionsForDisplay(
    callback as Record<string, unknown>,
    options.showExtensions,
  );

  let cbDescription;
  if (callback.description) {
    cbDescription = parseMarkdown(callback.description, options);
    resolveMarkdocHeadingIds(
      cbDescription ?? [],
      operationId,
      `${CALLBACKS_SECTION_DEEPLINK_SUFFIX}/${callbackId}`,
    );
  }

  const callbackItem = {
    httpVerb,
    pathName: cbOpInfo.pathName,
    summary: cbOpInfo.summary,
    operationId: typeof callback.operationId === 'string' ? callback.operationId : undefined,
    description: cbDescription,
    deprecated: cbOpInfo.deprecated,
    callbackName: cb.name,
    callbackId,
    externalDocs: cbExternalDocs
      ? {
          url: cbExternalDocs.url,
          description: cbExternalDocs.description,
        }
      : undefined,
    extensions: Object.keys(cbExtensions).length > 0 ? cbExtensions : undefined,
    contentChildren: contentChildren.length > 0 ? contentChildren : undefined,
  };

  const opPanels = buildCallbackPayloadPanels(callback, cbOpInfo, callbackId, ignoreNamedSchemas);

  const cbRbac = readRbacScope(cb);
  return {
    nodeType: nodeTypes.CONTAINER,
    children: [
      {
        nodeType: nodeTypes.ITEM,
        variant: 'callback',
        callback: callbackItem,
        pointer: operationInfo.pointer + '/callbacks',
      } as ItemContentNode,
    ],
    panels: opPanels,
    ...rbacProp(cbRbac),
  };
}

function buildCallbackPayloadPanels(
  callback: NormalizedCallbackOperation,
  cbOpInfo: OperationInfo,
  callbackId: string,
  ignoreNamedSchemas?: Set<string>,
): PanelNode[] {
  const { storeCtx } = openApiContext.get();
  const opPanels: PanelNode[] = [];
  if (!callback.requestBody || !('content' in callback.requestBody)) return opPanels;

  const cbDoc = storeCtx?.document ?? {};
  const resolvedCbBody =
    resolveRef<OpenAPIRequestBody>(cbDoc, callback.requestBody, ignoreNamedSchemas) ??
    callback.requestBody;
  const cbBodyContent = resolveContent(cbDoc, resolvedCbBody, ignoreNamedSchemas);

  if (!cbBodyContent) return opPanels;

  const cbMediaTypes = Object.keys(cbBodyContent);
  let cbHasExamples = false;
  const cbMediaTypeSchemas: Record<string, { schemaId?: string; exampleIds?: string[] }> = {};

  for (const [mt, mtContent] of Object.entries(cbBodyContent)) {
    let schemaId: string | undefined;
    if (mtContent.schema) {
      const resolvedSchema = mtContent.schema as Record<string, unknown>;
      schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: resolvedSchema,
      });
    }
    // Same pointer-derived ids as the body content walk (collectExampleIds)
    // so the code-sample panel and the body share one store entry per example.
    const mediaPointerBase =
      `${cbOpInfo.pointer}/requestBody/content/${encodeJsonPointerSegment(mt)}`.replace(/^\//, '');
    const exIds: string[] = [];
    if (mtContent.example !== undefined) {
      const eid = registerExample(storeCtx.exampleStore, {
        value: mtContent.example,
        id: `${mediaPointerBase}/example`,
      });
      exIds.push(eid);
      cbHasExamples = true;
    }
    if (mtContent.examples) {
      for (const [exName, exValue] of Object.entries(mtContent.examples)) {
        const exObj = resolveRef<OpenAPIExample>(cbDoc, exValue, ignoreNamedSchemas);
        if (exObj && hasOpenApiExampleValue(exObj)) {
          const eid = registerExample(storeCtx.exampleStore, {
            value: resolveOpenApiExampleValue(exObj),
            summary: exObj.summary ?? exName,
            description: pickRenderableDescription(exObj.description),
            id: `${mediaPointerBase}/examples/${encodeJsonPointerSegment(exName)}`,
          });
          exIds.push(eid);
          cbHasExamples = true;
        }
      }
    }
    cbMediaTypeSchemas[mt] = {
      schemaId,
      exampleIds: exIds.length > 0 ? exIds : undefined,
    };
    if (schemaId) cbHasExamples = true;
  }

  const cbDefSamples = callback['x-codeSamples'] as
    | { lang: string; label?: string; source: string }[]
    | undefined;
  const cbHasSamples = cbHasExamples || (cbDefSamples?.length ?? 0) > 0;

  if (!cbHasSamples) return opPanels;

  const cbServers = (
    callback.servers as
      | {
          url?: string;
          name?: string;
          description?: string;
          variables?: Record<string, { default?: string }>;
        }[]
      | undefined
  )
    ?.filter((s) => s.url)
    .map(({ url, name, description, variables }) => ({
      url: url as string,
      name,
      description,
      variables,
    }));

  opPanels.push({
    children: [
      {
        kind: panelKind.CALLBACK_PAYLOAD,
        callbackName: callbackId,
        path: cbOpInfo.pathName,
        httpVerb: cbOpInfo.httpVerb,
        servers: cbServers?.length ? cbServers : undefined,
        definitionSamples: cbDefSamples,
        mediaTypes: cbMediaTypes.length > 0 ? cbMediaTypes : undefined,
        mediaTypeSchemas:
          Object.keys(cbMediaTypeSchemas).length > 0 ? cbMediaTypeSchemas : undefined,
        examples: [],
      },
    ],
  });

  return opPanels;
}

function resolveParamRef(
  param: Record<string, unknown>,
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): Record<string, unknown> {
  const resolved = resolveRef<Record<string, unknown>>(doc, param, ignoreNamedSchemas) ?? param;
  const { $ref, ...siblings } = param;
  const top = typeof $ref === 'string' ? { ...resolved, ...siblings } : resolved;
  return applyIgnoreNamedSchemasDeep(top, ignoreNamedSchemas) as Record<string, unknown>;
}

function resolveSchemaRef(
  schema: unknown,
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): Record<string, unknown> | undefined {
  if (!schema || typeof schema !== 'object') return undefined;
  const record = schema as Record<string, unknown>;
  const top = resolveRef(doc, record, ignoreNamedSchemas) ?? record;
  return applyIgnoreNamedSchemasDeep(top, ignoreNamedSchemas) as Record<string, unknown>;
}

function buildResponseHeadersSchema(
  headers: OpenAPIResponse['headers'],
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): OpenAPISchema | undefined {
  if (!headers || typeof headers !== 'object') return undefined;

  const sectionRbac = readRbacScope(headers);
  const properties: Record<string, OpenAPISchema> = {};
  const required: string[] = [];

  for (const [name, rawHeader] of Object.entries(headers)) {
    if (isRbacKey(name)) continue;
    const resolvedHeader =
      resolveRef<OpenAPIHeader>(doc, rawHeader, ignoreNamedSchemas) ?? (rawHeader as OpenAPIHeader);

    const headerContent = resolvedHeader.content;
    const firstContentEntry = headerContent
      ? headerContent[Object.keys(headerContent)[0]]
      : undefined;
    const headerSchemaSource =
      resolvedHeader.schema ?? firstContentEntry?.schema ?? firstContentEntry?.itemSchema;

    const resolvedSchema = resolveSchemaRef(headerSchemaSource, doc, ignoreNamedSchemas) as
      | OpenAPISchema
      | undefined;
    if (!resolvedSchema) continue;

    const headerExamples = resolveOpenApiExamplesMap(
      resolvedHeader.examples,
      doc,
      ignoreNamedSchemas,
    );

    const headerRbac = readRbacScope(rawHeader) ?? readRbacScope(resolvedHeader) ?? sectionRbac;

    properties[name] = {
      ...resolvedSchema,
      ...(resolvedHeader.description !== undefined && {
        description: resolvedHeader.description,
      }),
      ...(resolvedHeader.example !== undefined && { example: resolvedHeader.example }),
      ...(headerExamples && { examples: headerExamples }),
      ...rbacProp(headerRbac),
    };

    if (resolvedHeader.required) {
      required.push(name);
    }
  }

  if (Object.keys(properties).length === 0) return undefined;

  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

function normalizeOpenApiDescription(value: unknown): string | Node | Node[] | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return isMarkdocAst(value) ? value : undefined;
}

function toParameterData(
  params: Array<Record<string, unknown>>,
  ignoreNamedSchemas?: Set<string>,
): ParameterData[] {
  const { storeCtx, options } = openApiContext.get();
  const doc = storeCtx.document;
  return params.map((param) => {
    const rawSchema = param.schema;
    let data: Record<string, unknown> = {};
    if (rawSchema && typeof rawSchema === 'object') {
      data = rawSchema as Record<string, unknown>;
    } else if (param.content && typeof param.content === 'object') {
      const contentMap = param.content as Record<string, { schema?: unknown }>;
      const firstMime = Object.keys(contentMap)[0];
      const inner = firstMime ? contentMap[firstMime]?.schema : undefined;
      if (inner && typeof inner === 'object') {
        data = inner as Record<string, unknown>;
      }
    }
    const schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
      kind: schemaKind.JSON_SCHEMA,
      data,
    });
    const paramBadges = param['x-badges'];
    const schemaBadges = (data as { 'x-badges'?: unknown })['x-badges'];
    const badges = Array.isArray(paramBadges)
      ? (paramBadges as ParameterData['badges'])
      : Array.isArray(schemaBadges)
        ? (schemaBadges as ParameterData['badges'])
        : undefined;
    const extensions = getExtensionsForDisplay(param, options.showExtensions);
    return {
      name: String(param.name ?? ''),
      in: typeof param.in === 'string' ? param.in : undefined,
      schemaId,
      description: normalizeOpenApiDescription(param.description),
      required: param.required === true ? true : undefined,
      deprecated: param.deprecated === true ? true : undefined,
      example: param.example,
      examples: resolveOpenApiExamplesMap(param.examples, doc, ignoreNamedSchemas),
      ...(badges?.length ? { badges } : {}),
      ...(Object.keys(extensions).length ? { extensions } : {}),
      ...rbacProp(readRbacScope(param)),
    };
  });
}

function resolveOpenApiExamplesMap(
  rawExamples: unknown,
  doc: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): Record<string, ExampleType> | undefined {
  if (!rawExamples || typeof rawExamples !== 'object') return undefined;

  const result: Record<string, ExampleType> = {};
  for (const [name, rawExample] of Object.entries(rawExamples as Record<string, unknown>)) {
    if (!rawExample || typeof rawExample !== 'object') continue;
    const example = (resolveRef(doc, rawExample, ignoreNamedSchemas) ??
      rawExample) as OpenAPIExample;
    if (!hasOpenApiExampleValue(example)) continue;
    const value = resolveOpenApiExampleValue(example);
    result[name] = {
      ...(typeof example.summary === 'string' && { summary: example.summary }),
      ...(typeof example.description === 'string' && { description: example.description }),
      ...(value !== undefined && {
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }),
    };
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function buildRequestChildren(
  operationInfo: OperationInfo,
  ignoreNamedSchemas?: Set<string>,
  isEvent?: boolean,
): ContentNode[] {
  const { storeCtx, options } = openApiContext.get();
  const children: ContentNode[] = [];
  const doc = storeCtx.document;

  const securitySection = buildOperationSecuritySection(operationInfo);
  if (securitySection) {
    children.push(securitySection);
  }

  if (operationInfo.parameters && Array.isArray(operationInfo.parameters)) {
    const rawParams = operationInfo.parameters as Array<Record<string, unknown>>;
    const params = rawParams.map((param) => resolveParamRef(param, doc, ignoreNamedSchemas));
    const headerParams = params.filter((param) => param.in === 'header');
    const queryParams = params.filter((param) => param.in === 'query');
    const pathParams = params.filter((param) => param.in === 'path');
    const cookieParams = params.filter((param) => param.in === 'cookie');
    const querystringParams = params.filter((param) => param.in === 'querystring');
    const querystringRegular = querystringParams.filter(
      (param) => !param.content || typeof param.content !== 'object',
    );
    const querystringWithContent = querystringParams.filter(
      (param) => param.content && typeof param.content === 'object',
    );
    const hasQuerystringParams = querystringParams.length > 0;

    if (pathParams.length > 0) {
      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'path',
        label: 'Path',
        labelTranslationKey: 'path',
        parameters: toParameterData(pathParams, ignoreNamedSchemas),
        pointer: operationInfo.pointer + '/parameters',
      } as ItemContentNode);
    }

    if (queryParams.length > 0 && !hasQuerystringParams) {
      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'query',
        label: 'Query',
        labelTranslationKey: 'query',
        parameters: toParameterData(queryParams, ignoreNamedSchemas),
        pointer: operationInfo.pointer + '/parameters',
      } as ItemContentNode);
    }

    if (querystringRegular.length > 0) {
      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'querystring',
        label: 'Query String',
        labelTranslationKey: 'querystring',
        parameters: toParameterData(querystringRegular, ignoreNamedSchemas),
        pointer: operationInfo.pointer + '/parameters',
      } as ItemContentNode);
    }

    for (const param of querystringWithContent) {
      const contentMap = param.content as Record<string, OpenAPIMediaType>;
      const mediaTypes = Object.keys(contentMap);
      const mediaTypeSchemas: Record<string, MediaTypeContent> = {};

      for (const mediaType of mediaTypes) {
        const entry = contentMap[mediaType];
        if (!entry) continue;

        let mediaTypeSchemaId: string | undefined;
        const itemSchemaRaw = (entry as { itemSchema?: unknown }).itemSchema;
        const schemaSource = entry.schema ?? itemSchemaRaw;
        const resolvedSchema = resolveSchemaRef(schemaSource, doc, ignoreNamedSchemas);
        if (resolvedSchema) {
          mediaTypeSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: resolvedSchema,
          });
        }
        const mediaTypeExampleIds = collectExampleIds(
          entry as Record<string, unknown>,
          ignoreNamedSchemas,
        );
        mediaTypeSchemas[mediaType] = {
          schemaId: mediaTypeSchemaId,
          exampleIds: mediaTypeExampleIds,
          ...rbacProp(readRbacScope(schemaSource)),
        };
      }

      const firstMediaType = mediaTypes[0];
      const firstEntry = firstMediaType ? mediaTypeSchemas[firstMediaType] : undefined;
      const description = parseMarkdown(
        param.description as string | Node | Node[] | undefined,
        options,
      );

      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'querystring-body',
        label: String(param.name ?? ''),
        required: param.required === true ? true : undefined,
        mediaTypes: mediaTypes.length > 0 ? mediaTypes : undefined,
        mediaTypeSchemas: Object.keys(mediaTypeSchemas).length > 0 ? mediaTypeSchemas : undefined,
        schemaId: firstEntry?.schemaId,
        exampleIds: firstEntry?.exampleIds,
        pointer: operationInfo.pointer + '/parameters',
        ...(description !== undefined ? { description } : {}),
        ...rbacProp(readRbacScope(param)),
      } as ItemContentNode);
    }

    if (cookieParams.length > 0) {
      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'cookies',
        label: 'Cookies',
        labelTranslationKey: 'cookie',
        parameters: toParameterData(cookieParams, ignoreNamedSchemas),
        pointer: operationInfo.pointer + '/parameters',
      } as ItemContentNode);
    }

    if (headerParams.length > 0) {
      children.push({
        nodeType: nodeTypes.ITEM,
        variant: 'headers',
        label: 'Headers',
        labelTranslationKey: 'header',
        parameters: toParameterData(headerParams, ignoreNamedSchemas),
        pointer: operationInfo.pointer + '/parameters',
      } as ItemContentNode);
    }
  }

  if (operationInfo.requestBody) {
    const requestBody =
      resolveRef<OpenAPIRequestBody>(doc, operationInfo.requestBody, ignoreNamedSchemas) ??
      (operationInfo.requestBody as OpenAPIRequestBody);
    const bodyContent = resolveContent(doc, requestBody, ignoreNamedSchemas);
    const mediaTypes = bodyContent ? Object.keys(bodyContent) : undefined;

    let schemaId: string | undefined;
    let exampleIds: string[] | undefined;
    let mediaTypeSchemas: Record<string, MediaTypeContent> | undefined;

    if (bodyContent && mediaTypes) {
      mediaTypeSchemas = {};
      for (const mediaType of mediaTypes) {
        const entry = bodyContent[mediaType];
        if (!entry) continue;

        let mediaTypeSchemaId: string | undefined;
        const itemSchemaRaw = (entry as { itemSchema?: unknown }).itemSchema;
        const schemaSource = entry.schema ?? itemSchemaRaw;
        const resolvedSchema = resolveSchemaRef(schemaSource, doc, ignoreNamedSchemas);
        if (resolvedSchema) {
          mediaTypeSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: resolvedSchema,
          });
        }
        const mediaTypeExampleIds = collectExampleIds(
          entry,
          ignoreNamedSchemas,
          `${operationInfo.pointer}/requestBody/content/${encodeJsonPointerSegment(mediaType)}`,
        );
        mediaTypeSchemas[mediaType] = {
          schemaId: mediaTypeSchemaId,
          exampleIds: mediaTypeExampleIds,
          ...rbacProp(readRbacScope(schemaSource)),
        };
      }

      const firstMediaType = mediaTypes[0];
      const firstEntry = firstMediaType ? mediaTypeSchemas[firstMediaType] : undefined;
      schemaId = firstEntry?.schemaId;
      exampleIds = firstEntry?.exampleIds;
    }

    const bodyDescription = parseMarkdown(requestBody.description, options);

    const bodyRbac = readRbacScope(operationInfo.requestBody) ?? readRbacScope(requestBody);

    children.push({
      nodeType: nodeTypes.ITEM,
      variant: 'body',
      label: 'Request Body',
      labelTranslationKey: 'body',
      required: requestBody.required,
      ...(isEvent && { isEvent: true }),
      mediaTypes,
      mediaTypeSchemas,
      schemaId,
      exampleIds,
      pointer: operationInfo.pointer + '/requestBody',
      ...(bodyDescription !== undefined ? { description: bodyDescription } : {}),
      ...rbacProp(bodyRbac),
    } as ItemContentNode);
  }

  return children;
}

function buildResponsesSection(
  operationInfo: OperationInfo,
  markdownOptions: ParseMarkdownOptions,
  operationId: string,
  ignoreNamedSchemas?: Set<string>,
): ItemContentNode | undefined {
  if (!operationInfo.responses) return undefined;

  const { storeCtx } = openApiContext.get();
  const doc = storeCtx?.document ?? {};
  const responses = operationInfo.responses as Record<string, unknown>;
  const responseEntries = Object.entries(responses).filter(([code]) => isStatusCode(code));
  const responsesList = responseEntries.map(([code, rawResponse]) => {
    const response =
      resolveRef<OpenAPIResponse>(
        doc,
        rawResponse as Referenced<OpenAPIResponse>,
        ignoreNamedSchemas,
      ) ?? (rawResponse as OpenAPIResponse);
    let responseRbac = readRbacScope(rawResponse) ?? readRbacScope(response);
    const responseContent = resolveContent(doc, response, ignoreNamedSchemas);
    const allMediaTypes = responseContent ? Object.keys(responseContent) : [];
    const firstMediaType = allMediaTypes[0];
    const firstEntry =
      firstMediaType && responseContent ? responseContent[firstMediaType] : undefined;

    let schemaId: string | undefined;
    let exampleIds: string[] | undefined;
    let headerSchemaId: string | undefined;
    let mediaTypeContent: Record<string, MediaTypeContent> | undefined;

    if (responseContent && allMediaTypes.length > 0) {
      mediaTypeContent = {};
      for (const mediaType of allMediaTypes) {
        const entry = responseContent[mediaType];
        if (!entry) continue;
        let mediaTypeSchemaId: string | undefined;
        const itemSchemaRaw = (entry as { itemSchema?: unknown }).itemSchema;
        const schemaSource = entry.schema ?? itemSchemaRaw;
        const resolvedSchema = resolveSchemaRef(schemaSource, doc, ignoreNamedSchemas);
        if (resolvedSchema) {
          mediaTypeSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
            kind: schemaKind.JSON_SCHEMA,
            data: resolvedSchema,
          });
        }
        const mediaTypeExampleIds = collectExampleIds(
          entry,
          ignoreNamedSchemas,
          `${operationInfo.pointer}/responses/${encodeJsonPointerSegment(code)}/content/${encodeJsonPointerSegment(mediaType)}`,
        );
        mediaTypeContent[mediaType] = {
          schemaId: mediaTypeSchemaId,
          exampleIds: mediaTypeExampleIds,
          ...rbacProp(readRbacScope(schemaSource)),
        };
      }

      const firstMediaTypeContent = firstMediaType ? mediaTypeContent[firstMediaType] : undefined;
      schemaId = firstMediaTypeContent?.schemaId;
      exampleIds = firstMediaTypeContent?.exampleIds;
    } else if (firstEntry) {
      const itemSchemaRaw = (firstEntry as { itemSchema?: unknown }).itemSchema;
      const schemaSource = firstEntry.schema ?? itemSchemaRaw;
      const resolvedSchema = resolveSchemaRef(schemaSource, doc, ignoreNamedSchemas);
      if (resolvedSchema) {
        responseRbac = responseRbac ?? readRbacScope(schemaSource);
        schemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
          kind: schemaKind.JSON_SCHEMA,
          data: resolvedSchema,
        });
      }
      exampleIds = collectExampleIds(
        firstEntry,
        ignoreNamedSchemas,
        firstMediaType
          ? `${operationInfo.pointer}/responses/${encodeJsonPointerSegment(code)}/content/${encodeJsonPointerSegment(firstMediaType)}`
          : undefined,
      );
    }

    const responseHeadersSchema = buildResponseHeadersSchema(
      response.headers,
      doc,
      ignoreNamedSchemas,
    );
    if (responseHeadersSchema) {
      headerSchemaId = registerSchema(storeCtx.schemaStore, storeCtx.hashIndex, {
        kind: schemaKind.JSON_SCHEMA,
        data: responseHeadersSchema,
      });
    }

    let description;
    if (response.description) {
      description = parseMarkdown(response.description, markdownOptions);
      resolveMarkdocHeadingIds(
        description ?? [],
        operationId,
        `${RESPONSES_SECTION_DEEPLINK_SUFFIX}/${code}`,
      );
    }
    // Response `x-summary` renders above the description (parity with legacy
    // openapi-docs `models/response.ts`). Emit `undefined` when absent to keep the node lean.
    const summary = response['x-summary']
      ? parseMarkdown(response['x-summary'], markdownOptions)
      : undefined;
    if (summary) {
      resolveMarkdocHeadingIds(
        summary,
        operationId,
        `${RESPONSES_SECTION_DEEPLINK_SUFFIX}/${code}/summary`,
      );
    }
    return {
      code,
      summary,
      description,
      mediaType: firstMediaType,
      mediaTypes: allMediaTypes.length > 0 ? allMediaTypes : undefined,
      mediaTypeContent,
      schemaId,
      exampleIds,
      headers: response.headers,
      headerSchemaId,
      ...rbacProp(responseRbac),
    };
  });

  return {
    nodeType: nodeTypes.ITEM,
    variant: 'responses',
    responses: responsesList,
    pointer: operationInfo.pointer + '/responses',
  };
}

function collectExampleIds(
  mediaEntry: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
  mediaPointer?: string,
): string[] | undefined {
  const { storeCtx } = openApiContext.get();
  const ids: string[] = [];
  const doc = storeCtx.document;
  const indexKeyBase = mediaPointer?.replace(/^\//, '');

  if (mediaEntry.example !== undefined) {
    const id = registerExample(storeCtx.exampleStore, {
      value: mediaEntry.example,
      ...(indexKeyBase && { id: `${indexKeyBase}/example` }),
    });
    ids.push(id);
  }

  if (mediaEntry.examples && typeof mediaEntry.examples === 'object') {
    const sectionRbac = readRbacScope(mediaEntry.examples);
    for (const [name, rawExample] of Object.entries(mediaEntry.examples)) {
      if (isRbacKey(name)) continue;
      if (!rawExample || typeof rawExample !== 'object') continue;
      const example = (resolveRef(doc, rawExample, ignoreNamedSchemas) ??
        rawExample) as OpenAPIExample;
      const exampleRbac = readRbacScope(rawExample) ?? readRbacScope(example) ?? sectionRbac;
      const id = registerExample(storeCtx.exampleStore, {
        value: resolveOpenApiExampleValue(example),
        key: name,
        summary: typeof example.summary === 'string' ? example.summary : name,
        description: pickRenderableDescription(example.description),
        externalValue:
          typeof example.externalValue === 'string' ? example.externalValue : undefined,
        ...rbacProp(exampleRbac),
        ...(indexKeyBase && {
          id: `${indexKeyBase}/examples/${encodeJsonPointerSegment(name)}`,
        }),
      });
      ids.push(id);
    }
  }

  return ids.length > 0 ? ids : undefined;
}

function buildOperationSecuritySection(operationInfo: OperationInfo): SecurityNode | undefined {
  const { storeCtx, options } = openApiContext.get();
  if (
    !operationInfo.security ||
    !Array.isArray(operationInfo.security) ||
    operationInfo.security.length === 0
  ) {
    return undefined;
  }

  const securityRequirements: { schemes: SecuritySchemeDetail[] }[] = operationInfo.security
    .map((securityRequirement) => {
      const entries = Object.entries(securityRequirement);
      if (entries.length === 0) return null;

      const rawSchemes = (storeCtx?.document?.components as Record<string, unknown> | undefined)
        ?.securitySchemes as Record<string, unknown> | undefined;
      const schemes = entries
        .map(([name, scopes]) => {
          const resolvedScheme = storeCtx?.securitySchemeStore[name];
          const schemeRbac = readRbacScope(rawSchemes?.[name]) ?? readRbacScope(resolvedScheme);
          return {
            name,
            scopes: Array.isArray(scopes) ? scopes : undefined,
            type: resolvedScheme?.type,
            scheme: resolvedScheme?.scheme,
            bearerFormat: resolvedScheme?.bearerFormat,
            in: resolvedScheme?.in,
            paramName: resolvedScheme?.paramName,
            description: resolvedScheme?.description
              ? parseMarkdown(resolvedScheme.description, options)
              : resolvedScheme?.description,
            openIdConnectUrl: resolvedScheme?.openIdConnectUrl,
            oauth2MetadataUrl: resolvedScheme?.oauth2MetadataUrl,
            deprecated: resolvedScheme?.deprecated,
            flows: resolvedScheme?.flows,
            ...rbacProp(schemeRbac),
          };
        })
        .filter((scheme) => scheme.name);

      return schemes.length > 0 ? { schemes } : null;
    })
    .filter((requirement): requirement is NonNullable<typeof requirement> => requirement !== null);

  if (securityRequirements.length === 0) return undefined;

  return {
    nodeType: nodeTypes.SECURITY,
    requirements: securityRequirements,
  };
}

function buildCodeSampleSourceFromContext(
  operationInfo: OperationInfo,
  ignoreNamedSchemas?: Set<string>,
  isWebhook?: boolean,
  href?: string,
): CodeSampleSource {
  const { storeCtx } = openApiContext.get();
  if (!storeCtx) {
    throw new Error('OpenAPI store context is not initialized');
  }
  return buildCodeSampleSource(
    operationInfo,
    storeCtx,
    ignoreNamedSchemas,
    isWebhook,
    href,
  );
}
