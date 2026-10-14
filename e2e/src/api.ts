/**
 * Same surface, resolved from this package's own source. None of these are public exports — the
 * app builds its own item model rather than going through `RedocStandalone`.
 */
export { buildItems } from '../../src/adapters/build.js';
export { markdocParser } from '../../src/components/markdoc/markdocParser.js';
export { RedoclyApiDocsStandalone } from '../../src/RedoclyApiDocsStandalone.js';
export { loadAndBundleDefinition } from '../../src/utils/loadAndBundleSpec.js';

export type { ApiItem, ApiStore } from '../../src/types/store.js';
export type { ApiSpecType } from '../../src/types/common.js';
export type { OpenAPIDefinition } from '../../src/types/openapi.js';
export type { RawApiDocsOptions } from '../../src/types/options.js';
