import { buildASTSchema } from 'graphql';

import type { DocumentNode } from 'graphql';
import type { ApiDocAdapterProps, ApiItem, ApiStore } from '../../types/store.js';

import { createBuildContext } from './build/context.js';
import { populateGraphqlStore } from './store.js';
import { collectMarkdownSections } from '../utils/markdoc.js';
import { groupByDefault } from './group/default.js';
import { groupByCustomMenu } from './group/custom.js';
import { buildOverviewItem } from './items/overview/item.js';
import { graphqlContext } from './buildContext.js';

export function processGraphqlDocument({
  document,
  options,
  basePath,
  processContent = true,
}: ApiDocAdapterProps & { document: DocumentNode; processContent?: boolean }): {
  items: ApiItem[];
  store: ApiStore;
} {
  const schema = buildASTSchema(document);
  const store: ApiStore = processContent
    ? populateGraphqlStore(schema)
    : { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };
  const context = createBuildContext({
    document,
    options,
    basePath,
    prebuiltSchema: schema,
    processContent,
  });

  return graphqlContext.run(context, () => ({
    items: buildGraphqlItems(),
    store,
  }));
}

export function buildGraphqlItems(): ApiItem[] {
  const context = graphqlContext.get();
  const { sectionItems, sectionChildren } = context.processContent
    ? collectMarkdownSections(
        context.options.info?.description || '',
        context.basePath,
        context.options,
      )
    : { sectionItems: [], sectionChildren: [] };

  const overviewItem = buildOverviewItem(context, sectionChildren);

  const result: ApiItem[] = [overviewItem, ...sectionItems];

  if (context.menuConfig?.groups) {
    result.push(...groupByCustomMenu());
  } else {
    result.push(...groupByDefault());
  }

  return result;
}
