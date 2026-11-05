import type { MarkdownSanitizeOptions } from './adapters/utils/markdoc.js';
import type { MarkdownAdapter } from './contexts/markdownAdapter.js';

import { createMarkdocAdapter as createConfiguredMarkdocAdapter } from './components/markdoc/markdocAdapter.js';

export { RedocStandalone, prepareApiDocs } from './RedocStandalone.js';
export type { RedocStandaloneProps } from './RedocStandalone.js';
export { RedoclyApiDocsStandalone } from './RedoclyApiDocsStandalone.js';
export type { RedoclyApiDocsStandaloneProps } from './RedoclyApiDocsStandalone.js';
export { convertSwagger2OpenAPI } from './services/spec-convert/index.js';
export { logoFromSpec } from './utils/x-logo.js';
export { ServerStyleSheet } from 'styled-components';
export { Redoc } from './Redoc.js';
export type { RedoclyApiDocsProps as RedocProps } from './RedoclyApiDocs.js';
export type { MarkdownAdapter };

export function createMarkdocAdapter(options?: MarkdownSanitizeOptions): MarkdownAdapter {
  return createConfiguredMarkdocAdapter(undefined, options);
}
