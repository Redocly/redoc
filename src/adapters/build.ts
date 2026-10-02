import type { DocumentNode } from 'graphql';
import type { ApiDocAdapterProps, ApiItem, ApiStore } from '../types/store.js';
import type { OpenAPIDefinition } from '../types/openapi.js';
import type { AsyncApiDefinition } from '../types/asyncapi.js';
import type { ApiSpecType } from '../types/common.js';
import type { RawApiDocsOptions } from '../types/options.js';

import { normalizeOptions } from '../options/normalizeOptions.js';

import type { MarkdownParser } from './utils/parseMarkdown.js';

type ApiDocProps = Omit<ApiDocAdapterProps, 'options'> & {
  options: RawApiDocsOptions;
  markdownParser: MarkdownParser;
};

type BuildItemsResult = {
  items: ApiItem[];
  store: ApiStore;
  specType: ApiSpecType;
};

export async function buildItems(props: ApiDocProps): Promise<BuildItemsResult> {
  const specType = props.type;
  const options = { ...normalizeOptions(props.options), markdownParser: props.markdownParser };

  let result: { items: ApiItem[]; store: ApiStore } | undefined;
  if (isOpenApiDefinition(props)) {
    const { processOpenApiDocument } = await import('./openapi/index.js');
    result = await processOpenApiDocument({ ...props, options });
  } else if (isAsyncApiDefinition(props)) {
    const { processAsyncApiDocument } = await import('./asyncapi/index.js');
    result = processAsyncApiDocument({ ...props, options });
  } else if (isGraphqlDefinition(props)) {
    const { processGraphqlDocument } = await import('./graphql/index.js');
    result = processGraphqlDocument({ ...props, options });
  }

  if (!result) {
    return {
      items: [],
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {}, specType },
      specType,
    };
  }


  return { items: result.items, store: { ...result.store, specType }, specType };
}

export function isOpenApiDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'openapi'; document: OpenAPIDefinition } {
  return def.type === 'openapi';
}

export function isAsyncApiDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'asyncapi'; document: AsyncApiDefinition } {
  return def.type === 'asyncapi';
}

export function isGraphqlDefinition(
  def: ApiDocProps,
): def is ApiDocProps & { type: 'graphql'; document: DocumentNode } {
  return def.type === 'graphql';
}

export async function buildNavItems(props: ApiDocProps): Promise<Omit<BuildItemsResult, 'store'>> {
  const specType = props.type;
  const options = { ...normalizeOptions(props.options), markdownParser: props.markdownParser };

  if (isOpenApiDefinition(props)) {
    const { processOpenApiDocument } = await import('./openapi/index.js');
    const { items } = await processOpenApiDocument({
      ...props,
      options,
      processContent: false,
    });
    return { items, specType };
  } else if (isAsyncApiDefinition(props)) {
    const { processAsyncApiDocument } = await import('./asyncapi/index.js');
    const { items } = processAsyncApiDocument({ ...props, options, processContent: false });
    return { items, specType };
  } else if (isGraphqlDefinition(props)) {
    const { processGraphqlDocument } = await import('./graphql/index.js');
    const { items } = processGraphqlDocument({ ...props, options, processContent: false });
    return { items, specType };
  }
  return {
    items: [],
    specType,
  };
}
