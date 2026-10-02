import type { ApiItem } from '../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';

import {
  extractContentUntilFirstHeading,
  collectMarkdownSections,
} from '../../../utils/markdoc.js';
import { buildOverviewContent } from './content.js';
import { openApiContext } from '../../buildContext.js';
import { asString } from '../../../../utils/string.js';

export function buildOverviewItems(document: OpenAPIDefinition): ApiItem[] {
  const context = openApiContext.get();
  const { basePath } = context;

  const description = extractContentUntilFirstHeading(document.info?.description, context.options);
  const { sectionItems, sectionChildren } = collectMarkdownSections(
    document.info?.description,
    basePath,
    context.options,
  );

  const overviewContent = buildOverviewContent({
    document,
    description,
    sectionChildren,
    options: { ...context.options, basePath },
  });

  let overviewTitle = asString(document.info?.title);

  return [
    {
      type: 'link',
      label: overviewTitle || 'Overview',
      labelTranslationKey: overviewTitle ? undefined : 'openapi.info.title',
      link: basePath,
      routeSlug: basePath,
      content: overviewContent,
    },
    ...sectionItems,
  ];
}
