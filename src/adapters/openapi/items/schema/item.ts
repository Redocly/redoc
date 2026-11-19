import { readRbacScope, rbacProp } from '../../../rbac.js';

import type { ApiItem, GroupItem } from '../../../../types/store.js';

import { isRecord } from '../../../../utils/is-record.js';
import { encodeBackSlashes, safeSlugify } from '../../../../utils/string.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../../../../utils/url.js';
import { buildSchemaDefinitionContent } from './content.js';
import { openApiContext } from '../../buildContext.js';
import { getSchemaNamesForTags } from '../../utils/schema-tags.js';

export function addSchemaDefinitionItems({
  tagName,
  tagSlug,
  result,
  groupItems,
}: {
  tagName: string;
  tagSlug: string;
  result: ApiItem[];
  groupItems?: GroupItem[];
}): void {
  const { document, options, processContent, basePath } = openApiContext.get();
  const schemaNames = getSchemaNamesForTags(
    new Set([tagName]),
    document,
    options.schemaDefinitionsTagName,
  );
  const sectionRbac = readRbacScope(document.components?.schemas);

  for (const schemaName of schemaNames) {
    const rawSchema: unknown = document.components?.schemas?.[schemaName];
    const title =
      isRecord(rawSchema) && typeof rawSchema.title === 'string' ? rawSchema.title : schemaName;
    const segment = encodeBackSlashes(
      safeSlugify(schemaName).toLowerCase() || schemaName.toLowerCase(),
    );
    const slug = normalizePath(joinWithSeparator(tagSlug, segment));

    const rbac = readRbacScope(rawSchema) ?? sectionRbac;
    const item: ApiItem = {
      type: 'link',
      label: title,
      link: slug,
      routeSlug: slug,
      httpVerb: 'schema',
      content: processContent ? buildSchemaDefinitionContent(schemaName, title, options) : null,
      ...rbacProp(rbac),
    };
    result.push(item);
    groupItems?.push({
      title,
      link: normalizePath(toRelativePath(slug, basePath)),
      deprecated: false,
      ...rbacProp(rbac),
    });
  }
}
