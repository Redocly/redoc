import type { ComponentType } from 'react';
import type { MarkdocOptions } from '../../types/options.js';

import { apiDocsMarkdocComponents } from './apiDocsMarkdocComponents.js';
import { apiDocsMarkdocNodes, apiDocsMarkdocTags } from './defaultMarkdocConfig.js';

const DEFAULT_MARKDOC_OPTIONS = {
  tags: apiDocsMarkdocTags,
  nodes: apiDocsMarkdocNodes,
  components: apiDocsMarkdocComponents,
};

/**
 * Merge a host's markdoc options with api-docs' built-in tags/nodes/components (schemaDefinition,
 * heading, MCP). This pulls in the Markdoc runtime (via `defaultMarkdocConfig`), so it lives here —
 * out of `withStoreProvider`/the shared component tree — and is reached only by the standalone
 * Markdoc adapter. That keeps the Markdoc runtime out of embedder client bundles that supply their
 * own renderer (e.g. realm).
 */
export function buildMarkdocOptions(propsMarkdocOptions?: Partial<MarkdocOptions>): MarkdocOptions {
  return {
    ...propsMarkdocOptions,
    ...DEFAULT_MARKDOC_OPTIONS,
    // Markdoc injects attributes as props at render time, so component prop
    // signatures intentionally don't align with React's ComponentType<{}>.
    components: {
      ...propsMarkdocOptions?.components,
      ...DEFAULT_MARKDOC_OPTIONS.components,
    } as unknown as Record<string, ComponentType>,
    tags: {
      ...DEFAULT_MARKDOC_OPTIONS.tags,
      ...propsMarkdocOptions?.tags,
    },
    nodes: {
      ...DEFAULT_MARKDOC_OPTIONS.nodes,
      ...propsMarkdocOptions?.nodes,
      // api-docs always owns the heading transform (anchor ids); keep it after the host spread.
      heading: DEFAULT_MARKDOC_OPTIONS.nodes.heading,
    },
  };
}
