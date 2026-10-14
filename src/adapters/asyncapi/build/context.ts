import type { AsyncApiDefinition, AsyncApiBuildContext as BuildContext } from '../../../types/asyncapi.js';
import type { AdapterBuildContextInput, StoreContext } from '../../../types/store.js';

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
    items: [],
    descriptionItems: [],
    channelSummaries: new Map(),
    processContent,
  };
}
