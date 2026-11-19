import type { AsyncApiDefinition, AsyncApiBuildContext as BuildContext } from '../../../types/asyncapi.js';
import type { AdapterBuildContextInput, StoreContext } from '../../../types/store.js';

import { createUniqueSlugger, type UniqueSlugger } from '../../../utils/unique-slugger.js';
import { asString } from '../../../utils/string.js';
import { findFirstBinding, mapChannelToOperations } from './utils.js';

type CreateBuildContextInputWithDocument = AdapterBuildContextInput & {
  document: AsyncApiDefinition;
  storeCtx: StoreContext;
  processContent?: boolean;
};

export function createBuildContext({
  document,
  options,
  basePath,
  storeCtx,
  processContent = true,
}: CreateBuildContextInputWithDocument): BuildContext {

  return {
    document,
    options,
    basePath,
    storeCtx,
    protocol: findFirstBinding(document),
    channelToOperations: mapChannelToOperations(document),
    groups: {},
    tagSlugger: createChannelTagSlugger(document),
    items: [],
    descriptionItems: [],
    channelSummaries: new Map(),
    processContent,
  };
}

function createChannelTagSlugger(document: AsyncApiDefinition): UniqueSlugger {
  const tagSlugger = createUniqueSlugger();
  for (const channel of Object.values(document.channels ?? {})) {
    for (const tag of channel?.tags ?? []) {
      const tagName = asString(tag?.name);
      if (tagName) tagSlugger(tagName);
    }
  }
  return tagSlugger;
}
