import { isRbacKey, readRbacScope, rbacProp } from '../../../rbac.js';

import type { ApiItem, GroupItem } from '../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';

import { encodeBackSlashes, safeSlugify } from '../../../../utils/string.js';
import { joinWithSeparator, normalizePath, toRelativePath } from '../../../../utils/url.js';
import { buildSchemaDefinitionContent } from './content.js';
import { openApiContext } from '../../buildContext.js';

export function getSchemaNamesForTag(
  tagName: string,
  document: OpenAPIDefinition,
  schemaDefinitionsTagName: string | undefined,
): string[] {
  const schemas = document.components?.schemas;
  if (!schemas) return [];

  const defaultTags = schemaDefinitionsTagName ? [schemaDefinitionsTagName] : [];
  const names: string[] = [];

  for (const [schemaName, rawSchema] of Object.entries(schemas)) {
    if (isRbacKey(schemaName)) continue;
    const schema = rawSchema as Record<string, unknown>;
    const xTags = schema['x-tags'] as string[] | undefined;
    const schemaTags = xTags?.length ? xTags : defaultTags;
    if (schemaTags.includes(tagName)) {
      names.push(schemaName);
    }
  }

  return names;
}

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
  const schemaNames = getSchemaNamesForTag(tagName, document, options.schemaDefinitionsTagName);
  const sectionRbac = readRbacScope(document.components?.schemas);

  for (const schemaName of schemaNames) {
    const rawSchema = document.components?.schemas?.[schemaName] as
      | Record<string, unknown>
      | undefined;
    const title = (rawSchema?.title as string | undefined) ?? schemaName;
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
