import type { ApiItem } from '../../../../types/store.js';
import type { ContentNode } from '../../../../types/content.js';
import type { GraphqlBuildContext as BuildContext } from '../../../../types/graphql.js';

import { extractContentUntilFirstHeading } from '../../../utils/markdoc.js';
import { buildOverviewContent } from './content.js';

export function buildOverviewItem(context: BuildContext, sectionChildren: ContentNode[]): ApiItem {
  const { info } = context.options;

  if (!context.processContent) {
    return {
      type: 'link',
      label: info?.title || 'Overview',
      labelTranslationKey: info?.title ? undefined : 'graphql.info.title',
      link: context.basePath,
      routeSlug: context.basePath,
      content: null,
    };
  }

  const description = info?.description || '';
  const markdoc = extractContentUntilFirstHeading(description, context.options);

  return {
    type: 'link',
    label: info?.title || 'Overview',
    labelTranslationKey: info?.title ? undefined : 'graphql.info.title',
    link: context.basePath,
    routeSlug: context.basePath,
    content: buildOverviewContent({
      options: context.options,
      markdoc: markdoc?.length ? markdoc : undefined,
      sectionChildren,
      basePath: context.basePath,
    }),
  };
}
