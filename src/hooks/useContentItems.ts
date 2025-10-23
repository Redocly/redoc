import { useMemo } from 'react';

import type { ContentItemModel } from '../models/index.js';
import type { OpenAPIParser, Options } from '../services/index.js';

import { buildContentItems } from '../services/index.js';

type UseContentItemsInput = {
  parser: OpenAPIParser;
  options: Options;
};

type UseContentItemsReturnType = {
  contentItems: ContentItemModel[];
  flatItems: ContentItemModel[];
};

export const useContentItems = ({
  options,
  parser,
}: UseContentItemsInput): UseContentItemsReturnType => {
  const { contentItems, flatItems } = useMemo(
    () => buildContentItems(parser, options),
    [options, parser],
  );

  return {
    flatItems,
    contentItems,
  };
};
