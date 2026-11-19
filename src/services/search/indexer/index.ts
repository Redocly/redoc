import { hasRbacScope, rbacProp, readRbacScope } from '../../../adapters/rbac.js';

import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { ApiItem, ApiStore, ExampleEntry, SchemaEntry } from '../../../types/store.js';
import type { GraphqlStoreMeta } from '../../../types/graphql-store.js';
import type { ContentNode } from '../../../types/content.js';
import type { SearchDocument } from '../types.js';
import type { DescriptionFormatter } from './context.js';
import type { ExtractContext } from './extractors/index.js';

import { nodeTypes, contentType, itemVariant } from '../../../types/common.js';
import { kindOfContent } from '../../../utils/routeKind.js';
import { extractFullText } from '../../../adapters/utils/markdoc.js';
import { toElementId } from '../../../utils/url.js';
import { SchemaWalker } from './schema-walker.js';
import { extractText } from './text.js';
import {
  extractorsFor,
  extractCallback,
  extractChannelAddress,
  extractInfoMetadataRows,
  extractHeadingSections,
  extractMessageBindingFields,
  extractMcpFields,
  extractPanelRows,
  extractSecurityRows,
  extractServerFields,
  extractSchemaPageFields,
} from './extractors/index.js';

export type SearchIndexerOptions = {
  basePath: string;
  /**
   * Schema rows need `schemaStore` and `document`; example rows (the example selector labels)
   * need `exampleStore`; GraphQL operation arguments resolve through the root types
   * `graphqlMeta` names. Rows whose input is missing are skipped.
   */
  store?: Partial<Pick<ApiStore, 'schemaStore' | 'exampleStore' | 'graphqlMeta'>>;
  /** The bundled description. */
  document?: Record<string, unknown>;
  formatDescription?: DescriptionFormatter;
};

export class ApiDocsSearchIndexer {
  #basePath: string;
  #schemaStore: Record<string, SchemaEntry> | undefined;
  #document: Record<string, unknown> | undefined;
  #formatDescription: DescriptionFormatter;
  #exampleStore: Record<string, ExampleEntry> | undefined;
  #graphqlMeta: GraphqlStoreMeta | undefined;
  #walker: SchemaWalker;

  constructor({ basePath, store, document, formatDescription }: SearchIndexerOptions) {
    this.#basePath = basePath;
    this.#schemaStore = store?.schemaStore;
    this.#document = document;
    this.#formatDescription = formatDescription ?? extractFullText;
    this.#exampleStore = store?.exampleStore;
    this.#graphqlMeta = store?.graphqlMeta;
    this.#walker = new SchemaWalker({
      schemaStore: this.#schemaStore,
      document,
      formatDescription: this.#formatDescription,
    });
  }

  /**
   * One document per overview, group and operation of the tree, depth first; its `path` holds
   * the labels of its ancestors. An item that fails to index is logged and skipped.
   */
  *documents(items: readonly ApiItem[]): Generator<SearchDocument> {
    yield* this.#walk(items, []);
  }

  *#walk(items: readonly ApiItem[], ancestors: string[]): Generator<SearchDocument> {
    for (const item of items) {
      const doc = this.#toDocument(item, ancestors);
      if (doc) yield doc;
      if (item.items?.length) {
        // Nav children are typed as plain nav items; one without `content` yields no document.
        yield* this.#walk(
          item.items as ApiItem[],
          item.label ? [...ancestors, item.label] : ancestors,
        );
      }
    }
  }

  #toDocument(item: ApiItem, ancestors: string[]): SearchDocument | undefined {
    if (!item.link || !item.content) return undefined;

    try {
      switch (item.content.contentType) {
        case contentType.OVERVIEW:
          return this.#buildDocument(item, this.#basePath, ancestors);
        case contentType.GROUP:
        case contentType.ITEM:
          return this.#buildDocument(item, item.link, ancestors);
        default:
          return undefined;
      }
    } catch (e) {
      console.error(
        `Cannot add item to api-docs search indexer [${item.label}, ${item.link}]:`,
        (e as Error).message,
      );
      return undefined;
    }
  }

  #context(slug: string, isOverview: boolean): ExtractContext {
    return {
      slug,
      scope: {},
      paramsMap: {},
      visited: new Set<string>(),
      walker: this.#walker,
      formatDescription: this.#formatDescription,
      hasSchemas: !!this.#schemaStore && !!this.#document,
      exampleStore: this.#exampleStore,
      schemaStore: this.#schemaStore,
      graphqlMeta: this.#graphqlMeta,
      isOverview,
    };
  }

  #buildDocument(item: ApiItem, url: string, ancestors: string[]): SearchDocument | undefined {
    if (!item.content) return undefined;

    const slug = toElementId(url, this.#basePath) ?? '';

    const children = item.content.children;
    const ctx = this.#context(slug, item.content.contentType === contentType.OVERVIEW);
    let text = extractText(children);
    let parameters = this.#extractParameters(children, ctx);

    const schemaName = item.content.meta?.name;
    const isSchemaDefinition =
      item.content.itemVariant === itemVariant.SCHEMA && typeof schemaName === 'string';
    if (isSchemaDefinition) {
      const page = extractSchemaPageFields(schemaName, this.#schemaStore, ctx);
      parameters = [...parameters, ...page.parameters];
      if (page.description) {
        text = [text, page.description].filter(Boolean).join(' ');
      }
    }

    const mcp = extractMcpFields(item, this.#document, ctx);
    if (mcp) {
      parameters = [...parameters, ...mcp.parameters];
      text = [text, mcp.text].filter(Boolean).join(' ');
    }

    const itemData = item as { [key: string]: unknown };
    const httpPath =
      'httpPath' in item && item.httpPath ? item.httpPath : extractChannelAddress(children);

    const doc: SearchDocument = {
      id: url,
      url,
      title: item.label ?? '',
      text,
      path: ancestors,
      kind: kindOfContent(item.content),
      deprecated: item.content.meta?.deprecated,
      ...('httpVerb' in item && item.httpVerb ? { httpMethod: item.httpVerb } : {}),
      ...(httpPath ? { httpPath: httpPath as string } : {}),
      ...('badges' in item && Array.isArray(item.badges) && item.badges.length
        ? { badges: item.badges }
        : {}),
      ...('isAdditionalOperation' in item && item.isAdditionalOperation
        ? { isAdditionalOperation: true }
        : {}),
      ...(isSchemaDefinition ? { isSchemaDefinition: true } : {}),
      ...rbacProp(readRbacScope(itemData)),
      ...(parameters.length && { parameters }),
    };

    return doc;
  }

  #extractParameters(children: ContentNode[], ctx: ExtractContext): OperationParameter[] {
    const visit = (nodes: ContentNode[], scoped: ExtractContext): void => {
      for (const node of nodes) {
        if (node.nodeType === nodeTypes.ITEM) {
          const itemNode = node;
          if (hasRbacScope(itemNode)) continue;
          if (itemNode.variant === 'callback' && itemNode.callback) {
            extractCallback(itemNode.callback, scoped, visit);
            continue;
          }
          for (const extractor of extractorsFor(itemNode)) extractor.extract(itemNode, scoped);
        } else if (node.nodeType === nodeTypes.MARKDOC) {
          extractHeadingSections(node.content, scoped);
        } else if (node.nodeType === nodeTypes.SECURITY) {
          extractSecurityRows(node, scoped);
        } else if (node.nodeType === nodeTypes.INFO_METADATA) {
          extractInfoMetadataRows(node, scoped);
        } else if (node.nodeType === nodeTypes.CONTAINER) {
          const container = node;
          if (hasRbacScope(container)) continue;
          extractMessageBindingFields(container, scoped);
          visit(container.children, scoped);
          // Panel rows go after the field rows: engines that pick the first matching row prefer fields.
          extractServerFields(container, scoped);
          extractPanelRows(container, scoped);
        } else if (node.nodeType === nodeTypes.OVERVIEW_SECTION_WRAPPER) {
          visit(node.children, scoped);
        }
      }
    };

    visit(children, ctx);
    return Object.values(ctx.paramsMap);
  }
}
