import type { ComponentType } from 'react';

import { SchemaDefinition } from './SchemaDefinition.js';
import { Heading } from './Heading.js';
import { McpTool } from '../Mcp/McpTool.js';
import { McpResource } from '../Mcp/McpResource.js';
import { McpPrompt } from '../Mcp/McpPrompt.js';

/**
 * api-docs markdown render components, keyed by their markdoc `render` names. Pair with
 * {@link apiDocsMarkdocTags}/{@link apiDocsMarkdocNodes} when wiring a host markdown adapter.
 */
export const apiDocsMarkdocComponents = {
  SchemaDefinition,
  McpTool,
  McpResource,
  McpPrompt,
  Heading,
} as unknown as Record<string, ComponentType>;
