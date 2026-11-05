import type { ApiDocAdapterProps, ApiItem, ApiStore } from '../../types/store.js';
import type { OpenAPIDefinition, OpenAPIServer } from '../../types/openapi.js';
import type { ApiDocsOptions } from '../../types/options.js';
import type { ServerData } from '../../types/common.js';

import { createStoreContext, toRecord } from '../helpers.js';
import { populateOpenApiStore } from './store.js';
import { createBuildContext } from './build/context.js';
import { buildOverviewItems } from './items/overview/item.js';
import { addTagItems } from './group/item.js';
import { openApiContext } from './buildContext.js';
import { toSidebarLogo } from '../../utils/logo.js';
import { serversWithUrl } from './utils/operation.js';

function yieldToMainThread(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Global servers (document-level) that seed the environment store on the
 * client. Descriptions already parsed to markdown AST are dropped, like everywhere
 * else server display names are derived.
 */
function buildGlobalServers(
  document: OpenAPIDefinition,
): ServerData[] {
  let merged: OpenAPIServer[] = serversWithUrl(document.servers);
  return merged.map((s) => {
    const server: ServerData = { url: s.url };
    if (s.name) server.name = s.name;
    if (typeof s.description === 'string' && s.description) server.description = s.description;
    if (s.variables && Object.keys(s.variables).length > 0) server.variables = s.variables;
    return server;
  });
}

export async function processOpenApiDocument({
  document,
  basePath = '/',
  options,
  processContent = true,
}: ApiDocAdapterProps & {
  document: OpenAPIDefinition;
  options: ApiDocsOptions;
  processContent?: boolean;
}): Promise<{ items: ApiItem[]; store: ApiStore }> {
  const storeCtx = createStoreContext(toRecord(document));

  if (processContent) {
    populateOpenApiStore(document, storeCtx, options);
    await yieldToMainThread();
  }

  const context = createBuildContext({ document, options, basePath, storeCtx, processContent });

  const globalServers = buildGlobalServers(
    document,
  );
  const logo = toSidebarLogo(document.info?.['x-logo'], document.info?.contact?.url);

  return openApiContext.run(context, () => ({
    items: buildOpenApiItems(),
    store: {
      schemaStore: storeCtx.schemaStore,
      exampleStore: storeCtx.exampleStore,
      securitySchemeStore: storeCtx.securitySchemeStore,
      mcp: storeCtx.document['x-mcp'] as ApiStore['mcp'],
      specVersion: document.openapi,
      ...(globalServers.length > 0 && { servers: globalServers }),
      ...(logo && { logo }),
    },
  }));
}

function buildOpenApiItems(): ApiItem[] {
  const context = openApiContext.get();
  const result: ApiItem[] = [...buildOverviewItems(context.document)];
  addTagItems(context.document, result);
  return result;
}
