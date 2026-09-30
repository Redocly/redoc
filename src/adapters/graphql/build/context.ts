import { buildASTSchema } from 'graphql';

import type { DocumentNode, GraphQLSchema } from 'graphql';
import type { AdapterBuildContextInput } from '../../../types/store.js';
import type { GraphqlBuildContext as BuildContext } from '../../../types/graphql.js';

import { normalizeMenuConfig } from '../utils/normalizeMenu.js';
import { extractInfoFromDirectives } from '../../../utils/graphql-directive-utils.js';

export type CreateBuildContextInputWithDocumentAndSchema = AdapterBuildContextInput & {
  document: DocumentNode;
  prebuiltSchema?: GraphQLSchema;
  processContent?: boolean;
};

export function createBuildContext({
  document,
  options,
  basePath,
  prebuiltSchema,
  processContent = true,
}: CreateBuildContextInputWithDocumentAndSchema): BuildContext {
  const schema = prebuiltSchema ?? buildASTSchema(document);
  const schemaInfo = extractInfoFromDirectives(schema);

  return {
    basePath,
    schema,
    menuConfig: normalizeMenuConfig(options?.menu, schema),
    options: schemaInfo
      ? {
          ...options,
          info: {
            ...schemaInfo,
            ...options?.info,
            contact: { ...schemaInfo.contact, ...options?.info?.contact },
            license: { ...schemaInfo.license, ...options?.info?.license },
          },
        }
      : options,
    processContent,
  };
}
