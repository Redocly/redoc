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

export type { OpenApiBuildContext as BuildContext, TagData } from '../../types/openapi.js';

function yieldToMainThread(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Global servers (document-level) that seed the environment store on the
 * client — same source list `openapi-docs` seeds in its `Providers`.
 * Descriptions already parsed to markdown AST are dropped, like everywhere
 * else server display names are derived.
 */
function buildGlobalServers(
  document: OpenAPIDefinition,
): ServerData[] {
  const rawServers = (document.servers ?? []) as OpenAPIServer[];
  let merged = rawServers.filter((s): s is OpenAPIServer => typeof s?.url === 'string');
  return merged.map((s) => ({
    url: s.url,
    ...(s.name && { name: s.name }),
    ...(s.isMockServer && { isMockServer: true }),
    ...(typeof s.description === 'string' && s.description && { description: s.description }),
    ...(s.variables &&
      Object.keys(s.variables).length > 0 && {
        variables: s.variables as ServerData['variables'],
      }),
  }));
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
      ...(globalServers.length > 0 && { servers: globalServers }),
      ...(logo && { logo }),
    },
  }));
}

export function buildOpenApiItems(): ApiItem[] {
  const context = openApiContext.get();
  const result: ApiItem[] = [...buildOverviewItems(context.document)];
  addTagItems(context.document, result);
  return result;
}
