import type { ApiItem } from '../../../../types/store.js';
import type { ContentNode } from '../../../../types/content.js';
import type { AsyncApiDefinition } from '../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { buildOverviewContent } from './content.js';

type Options = {
  basePath: string;
  document: AsyncApiDefinition;
  options: ApiDocsOptions;
  protocol: string | null;
  sectionChildren: ContentNode[];
  processContent?: boolean;
};

export function buildOverviewItem(info: { title?: string }, options: Options): ApiItem {
  const {
    basePath,
    document,
    options: docsOptions,
    protocol,
    sectionChildren,
    processContent = true,
  } = options;

  return {
    type: 'link',
    label: info.title ?? 'Overview',
    labelTranslationKey: info.title ? undefined : 'asyncapi.info.title',
    link: basePath,
    routeSlug: basePath,
    content: processContent
      ? buildOverviewContent({
          document,
          options: docsOptions,
          protocol,
          sectionChildren,
          basePath,
        })
      : null,
  };
}
