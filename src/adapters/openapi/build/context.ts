import type {
  OpenAPIDefinition,
  OpenAPIParameter,
  OpenAPIPath,
  OpenAPIOperation,
  OpenAPIPaths,
  OpenAPITag,
  OpenAPICallback,
  OpenApiBuildContext as BuildContext,
  OperationInfo,
  OpenAPITagExtended,
  TagData,
  NormalizedCallback,
  NormalizedCallbackOperation,
} from '../../../types/openapi.js';
import type { Referenced, BadgeData } from '../../../types/common.js';
import type { AdapterBuildContextInput, StoreContext } from '../../../types/store.js';

import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { JsonPointer } from '../utils/JsonPointer.js';
import { DEFAULT_WEBHOOKS_TAG_NAME } from '../../../constants/openapi.js';
import { SUPPORTED_MCP_TYPES } from '../constants.js';
import { titleize } from '../utils/helpers.js';
import { resolveRef } from '../../helpers.js';
import { resolvePathItemRef } from '../utils/resolvePathItemRef.js';
import { HTTP_METHODS, isOperationName } from '../../../utils/http-methods.js';
import { isRbacKey, readRbacScope, rbacProp } from '../../rbac.js';

type BuildContextWithDocument = AdapterBuildContextInput & {
  document: OpenAPIDefinition;
  storeCtx: StoreContext;
  processContent?: boolean;
};

function isNonNavTag(tag: OpenAPITag): boolean {
  return tag.kind === 'badge' || tag.kind === 'audience';
}

export function createBuildContext({
  document,
  options,
  basePath,
  storeCtx,
  processContent = true,
}: BuildContextWithDocument): BuildContext {
  const tagsMap = new Map<string, TagData>();

  for (const tag of document.tags || []) {
    const extTag = tag as OpenAPITagExtended;
    tagsMap.set(tag.name, {
      tag: extTag,
      operations: [],
      description: tag.description,
      children: [],
    });
  }

  for (const tag of document.tags || []) {
    const extTag = tag as OpenAPITagExtended;
    if (extTag.parent && !isNonNavTag(tag)) {
      tagsMap.get(extTag.parent)?.children.push(tag.name);
    }
  }

  if (options?.schemaDefinitionsTagName) {
    ensureTagExists(tagsMap, options.schemaDefinitionsTagName);
  }

  const badgeTags = (document.tags || []).filter(isNonNavTag);

  const context: BuildContext = {
    document,
    options,
    basePath,
    tagsMap,
    collectedTagOrder: [],
    downloadUrls: options.downloadUrls,
    storeCtx,
    badgeTags,
    processContent,
  };

  collectAllOperations(document, context);
  collectMcpTags(document, context);

  return context;
}

function ensureTagExists(tagsMap: Map<string, TagData>, tagName: string): void {
  if (!tagsMap.has(tagName)) {
    tagsMap.set(tagName, {
      tag: { name: tagName },
      operations: [],
      children: [],
    });
  }
}

function collectAllOperations(document: OpenAPIDefinition, context: BuildContext): void {
  if (document.paths) {
    collectOperationsFromPaths(document.paths, false, context);
  }

  const webhooks = document['x-webhooks'] || document.webhooks;
  if (webhooks) {
    collectOperationsFromPaths(webhooks, true, context);
  }
}

function collectMcpTags(document: OpenAPIDefinition, context: BuildContext): void {
  const mcp = document['x-mcp'];

  if (!mcp) return;

  for (const collectionType of SUPPORTED_MCP_TYPES) {
    const entities = mcp[collectionType];
    
    if (!entities?.length) continue;

    for (const entity of entities) {
      const entityTags =
        entity.tags && entity.tags.length > 0 ? entity.tags : [titleize(collectionType)];

      for (const tagName of entityTags) {
        if (!context.tagsMap.has(tagName)) {
          context.tagsMap.set(tagName, {
            tag: { name: tagName },
            operations: [],
            children: [],
          });
          context.collectedTagOrder.push(tagName);
        }
      }
    }
  }
}


function operationWithPathItemDefaults(
  pathItem: OpenAPIPath,
  operation: OpenAPIOperation,
): OpenAPIOperation {
  return {
    ...operation,
    summary: operation.summary ?? pathItem.summary,
    description: (operation.description ?? pathItem.description) as OpenAPIOperation['description'],
    servers: operation.servers ?? pathItem.servers,
  };
}

function collectOperationsFromPaths(
  paths: OpenAPIPaths,
  isWebhook: boolean,
  context: BuildContext,
): void {
  const doc = context.document as unknown as Record<string, unknown>;
  const openapi = context.document.openapi;

  for (const [pathName, rawPathItem] of Object.entries(paths)) {
    if (!rawPathItem) continue;

    let pathItem: OpenAPIPath | undefined;
    try {
      pathItem = resolvePathItemRef(doc, rawPathItem, openapi);
    } catch {
      console.warn(`[OpenAPI] Skipping path "${pathName}": failed to resolve path item $ref`);
      continue;
    }

    if (!pathItem) continue;

    const pathLevelParams: Referenced<OpenAPIParameter>[] = pathItem.parameters ?? [];

    for (const httpVerb of Object.keys(pathItem).filter(
      isOperationName,
    ) as (keyof OpenAPIPath)[]) {
      const operation = pathItem[httpVerb] as OpenAPIOperation;
      if (!operation || typeof operation !== 'object') continue;

      addOperationToTags(
        operationWithPathItemDefaults(pathItem, operation),
        pathName,
        httpVerb,
        isWebhook,
        false,
        context,
        pathLevelParams,
      );
    }

    const additionalOps = pathItem.additionalOperations;
    if (additionalOps) {
      for (const [httpVerb, operation] of Object.entries(additionalOps)) {
        addOperationToTags(
          operationWithPathItemDefaults(pathItem, operation),
          pathName,
          httpVerb,
          isWebhook,
          true,
          context,
          pathLevelParams,
        );
      }
    }
  }
}

type ParameterLike = { in?: string; name?: string; [key: string]: unknown };

function asParameter(p: unknown): ParameterLike {
  return (typeof p === 'object' && p !== null ? p : {}) as ParameterLike;
}

function mergeParameters(
  pathParams: Referenced<OpenAPIParameter>[],
  operationParams: Referenced<OpenAPIParameter>[] | undefined,
  document: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): Referenced<OpenAPIParameter>[] | undefined {
  if (!pathParams.length && !operationParams?.length) return operationParams;
  if (!pathParams.length) return operationParams;
  if (!operationParams?.length) return pathParams;

  const operationParamKeys = new Set(
    operationParams.map((p) => {
      const resolved = resolveRef(document, p, ignoreNamedSchemas) ?? p;
      const param = asParameter(resolved);
      return `${param.in}:${param.name}`;
    }),
  );

  const merged = [...operationParams];
  for (const p of pathParams) {
    const resolved = resolveRef(document, p, ignoreNamedSchemas) ?? p;
    const param = asParameter(resolved);
    const key = `${param.in}:${param.name}`;
    if (!operationParamKeys.has(key)) {
      merged.push(p);
    }
  }
  return merged;
}

function addOperationToTags(
  operation: OpenAPIOperation,
  pathName: string,
  httpVerb: string,
  isWebhook: boolean,
  isAdditionalOperation: boolean,
  context: BuildContext,
  pathLevelParams: Referenced<OpenAPIParameter>[] = [],
): void {
  const tags = operation.tags || (isWebhook ? [DEFAULT_WEBHOOKS_TAG_NAME] : ['']);
  const operationInfo = createOperationInfo(
    context.badgeTags,
    operation,
    pathName,
    httpVerb,
    isWebhook,
    isAdditionalOperation,
    tags,
    pathLevelParams,
    context,
  );

  for (const tagName of tags) {
    let tagData = context.tagsMap.get(tagName);

    if (!tagData) {
      tagData = { tag: { name: tagName }, operations: [], children: [] };
      context.tagsMap.set(tagName, tagData);
      context.collectedTagOrder.push(tagName);
    }

    if (isNonNavTag(tagData.tag)) {
      continue;
    }

    if (!tagData.tag['x-traitTag']) {
      tagData.operations.push(operationInfo);
    }
  }
}

function normalizeOperationHttpVerb(httpVerb: string): string {
  return httpVerb.toLowerCase() === 'x-query' ? 'query' : httpVerb;
}

function createOperationInfo(
  badgeTags: OpenAPITag[],
  operation: OpenAPIOperation,
  pathName: string,
  httpVerb: string,
  isWebhook: boolean,
  isAdditionalOperation: boolean,
  tags: string[],
  pathLevelParams: Referenced<OpenAPIParameter>[] = [],
  context: BuildContext,
): OperationInfo {
  const { options, storeCtx } = context;
  const opExtDocs = operation.externalDocs;
  const xBadges = operation['x-badges'];

  const operationBadges: BadgeData[] =
    xBadges?.map((b) => ({
      name: b.name,
      color: b.color,
      position: b.position,
    })) ?? [];

  if (operation.tags && badgeTags.length > 0) {
    for (const operationTagName of operation.tags) {
      const badgeTag = badgeTags.find((t) => t.name === operationTagName);
      if (badgeTag) {
        operationBadges.push({
          name: badgeTag.summary ?? badgeTag.name,
          color: badgeTag.kind === 'audience' ? 'grey' : 'blue',
          icon: badgeTag.kind === 'audience' ? 'user-group' : undefined,
          position: 'after',
          description:
            typeof badgeTag.description === 'string' ? badgeTag.description : undefined,
        });
      }
    }
  }

  return {
    ...operation,
    pointer: JsonPointer.compile(['paths', pathName, httpVerb]),
    pathName,
    httpVerb: normalizeOperationHttpVerb(httpVerb),
    operationId: operation.operationId,
    summary: operation.summary,
    description: parseMarkdown(operation.description, options),
    deprecated: operation.deprecated,
    isWebhook,
    isAdditionalOperation,
    tags,
    parameters: mergeParameters(
      pathLevelParams,
      operation.parameters,
      storeCtx.document,
      options.ignoreNamedSchemas,
    ),
    requestBody: operation.requestBody,
    responses: operation.responses,
    servers: operation.servers,
    security: operation.security ?? context.document.security,
    callbacks: normalizeCallbacks(
      operation.callbacks,
      storeCtx?.document ?? {},
      options.ignoreNamedSchemas,
    ),
    externalDocs: opExtDocs
      ? { url: opExtDocs.url, description: opExtDocs.description }
      : undefined,
    'x-badges': operationBadges.length > 0 ? operationBadges : undefined,
  };
}

export function normalizeCallbacks(
  callbacks: { [name: string]: Referenced<OpenAPICallback> } | undefined,
  document: Record<string, unknown>,
  ignoreNamedSchemas?: Set<string>,
): NormalizedCallback[] | undefined {
  if (!callbacks || typeof callbacks !== 'object') return undefined;

  const result: NormalizedCallback[] = [];

  for (const [callbackName, callbackOrRef] of Object.entries(callbacks)) {
    const resolved = resolveRef(document, callbackOrRef, ignoreNamedSchemas) ?? callbackOrRef;
    if (!resolved || typeof resolved !== 'object') continue;

    const callbackRbac = readRbacScope(resolved);
    const paths = resolved as OpenAPICallback;

    for (const [urlExpression, pathItem] of Object.entries(paths)) {
      if (isRbacKey(urlExpression)) continue;
      if (!pathItem || typeof pathItem !== 'object') continue;

      const pathServers = pathItem.servers;
      const pathParams = pathItem.parameters;
      const operations: NormalizedCallbackOperation[] = [];

      for (const [method, opValue] of Object.entries(pathItem)) {
        if (!HTTP_METHODS.has(method.toLowerCase())) continue;
        if (!opValue || typeof opValue !== 'object') continue;

        const op = opValue as OpenAPIOperation;
        const cbOp: NormalizedCallbackOperation = {
          httpVerb: normalizeOperationHttpVerb(method.toLowerCase()),
          pathName: urlExpression,
          summary: op.summary,
          operationId: op.operationId,
          description: op.description,
          deprecated: op.deprecated,
          requestBody: op.requestBody,
          responses: op.responses,
          security: op.security,
          servers: op.servers ?? pathServers,
          parameters: op.parameters ?? pathParams,
          externalDocs: op.externalDocs,
        };
        for (const [k, v] of Object.entries(op)) {
          if (k.startsWith('x-') && !(k in cbOp)) {
            cbOp[k] = v;
          }
        }
        operations.push(cbOp);
      }

      if (operations.length > 0) {
        result.push({
          name: callbackName,
          url: urlExpression,
          operations,
          ...rbacProp(callbackRbac),
        });
      } else {
        result.push({
          name: callbackName,
          url: urlExpression,
          ...rbacProp(callbackRbac),
        });
      }
    }
  }

  return result.length > 0 ? result : undefined;
}

