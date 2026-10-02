import type { ItemContentNode } from '../../../../types/content.js';
import type { Extractor } from './context.js';

import { parametersExtractor } from './parameters.js';
import { graphqlExtractor } from './graphql.js';
import { namedRowsExtractor } from './named-rows.js';
import { bodyExtractor } from './body.js';
import { responsesExtractor } from './responses.js';
import { messagesExtractor } from './asyncapi.js';
import { examplesExtractor } from './examples.js';

export const extractors: readonly Extractor[] = [
  parametersExtractor,
  graphqlExtractor,
  namedRowsExtractor,
  bodyExtractor,
  responsesExtractor,
  messagesExtractor,
  examplesExtractor,
];

export function extractorsFor(node: ItemContentNode): Extractor[] {
  return extractors.filter((extractor) => extractor.matches(node));
}

export type { ExtractContext, Extractor } from './context.js';
export { extractCallback } from './callbacks.js';
export { extractHeadingSections } from './heading-sections.js';
export {
  extractChannelAddress,
  extractMessageBindingFields,
  extractServerFields,
} from './asyncapi.js';
export { extractMcpFields } from './mcp.js';
export { extractInfoMetadataRows, extractPanelRows } from './panels.js';
export { extractSecurityRows } from './security.js';
export { extractSchemaPageFields } from './schema-page.js';
