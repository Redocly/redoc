import type { ApiDocAdapterProps, ApiItem, ApiStore, StoreContext } from '../../types/store.js';
import type { AsyncApiDefinition } from '../../types/asyncapi.js';

import { populateAsyncApiStore } from './store.js';
import { createStoreContext, toRecord } from '../helpers.js';
import { collectMarkdownSections } from '../utils/markdoc.js';
import { buildOverviewItem } from './items/overview/item.js';
import { createBuildContext } from './build/context.js';
import { buildNavigationItems } from './build/navigation.js';
import { asyncApiContext } from './buildContext.js';

export function processAsyncApiDocument(
  props: ApiDocAdapterProps & { document: AsyncApiDefinition; processContent?: boolean },
): { items: ApiItem[]; store: ApiStore } {
  const processContent = props.processContent ?? true;
  const storeCtx = createStoreContext(toRecord(props.document));

  if (processContent) {
    populateAsyncApiStore(props.document, storeCtx);
  }

  return {
    items: buildAsyncApiItems({ ...props, processContent }, storeCtx),
    store: {
      schemaStore: storeCtx.schemaStore,
      exampleStore: storeCtx.exampleStore,
      securitySchemeStore: storeCtx.securitySchemeStore,
    },
  };
}

export function buildAsyncApiItems(
  {
    document,
    options,
    basePath,
    processContent = true,
  }: ApiDocAdapterProps & { document: AsyncApiDefinition; processContent?: boolean },
  storeCtx: StoreContext,
): ApiItem[] {
  const context = createBuildContext({
    document,
    options,
    basePath,
    storeCtx,
    processContent,
  });

  return asyncApiContext.run(context, () => {
    const { sectionItems, sectionChildren } = processContent
      ? collectMarkdownSections(document.info?.description, context.basePath, context.options)
      : { sectionItems: [], sectionChildren: [] };

    const overviewItem = buildOverviewItem(document.info ?? {}, {
      basePath,
      document,
      options,
      protocol: context.protocol,
      sectionChildren,
      processContent,
    });

    context.descriptionItems.push(...sectionItems);
    const navItems = buildNavigationItems();

    return [overviewItem, ...context.descriptionItems, ...navItems];
  });
}
