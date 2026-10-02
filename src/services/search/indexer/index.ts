import { hasRbacScope, rbacProp, readRbacScope } from '../../../adapters/rbac.js';

import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { ApiItem, ExampleEntry, SchemaEntry } from '../../../types/store.js';
import type {
  ContentNode,
  ItemContentNode,
  MarkdocNode,
  ContainerNode,
  InfoMetadataNode,
  OverviewSectionWrapperNode,
  SecurityNode,
} from '../../../types/content.js';
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
  formatDescription?: DescriptionFormatter;
  /** Enables example rows (the example selector labels); without it they are skipped. */
  exampleStore?: Record<string, ExampleEntry>;
};

export class ApiDocsSearchIndexer {
  #documents: SearchDocument[] = [];
  #basePath: string;
  #schemaStore: Record<string, SchemaEntry> | undefined;
  #document: Record<string, unknown> | undefined;
  #formatDescription: DescriptionFormatter;
  #exampleStore: Record<string, ExampleEntry> | undefined;
  #walker: SchemaWalker;

  constructor(
    basePath: string,
    schemaStore?: Record<string, SchemaEntry>,
    document?: Record<string, unknown>,
    options: SearchIndexerOptions = {},
  ) {
    this.#basePath = basePath;
    this.#schemaStore = schemaStore;
    this.#document = document;
    this.#formatDescription = options.formatDescription ?? extractFullText;
    this.#exampleStore = options.exampleStore;
    this.#walker = new SchemaWalker({
      schemaStore,
      document,
      formatDescription: this.#formatDescription,
    });
  }

  addItem(item: ApiItem, ancestors: string[] = []): void {
    if (!item.link || !item.content) return;

    try {
      switch (item.content.contentType) {
        case contentType.OVERVIEW:
          this.#addDocument(item, this.#basePath, ancestors);
          break;
        case contentType.GROUP:
        case contentType.ITEM:
          this.#addDocument(item, item.link, ancestors);
          break;
      }
    } catch (e) {
      console.error(
        `Cannot add item to api-docs search indexer [${item.label}, ${item.link}]:`,
        (e as Error).message,
      );
    }
  }

  getResult(): SearchDocument[] {
    return this.#documents;
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
      isOverview,
    };
  }

  #addDocument(item: ApiItem, url: string, ancestors: string[] = []): void {
    if (!item.content) return;

    const slug = toElementId(url, this.#basePath) ?? '';

    const children = item.content.children;
    const ctx = this.#context(slug, item.content.contentType === contentType.OVERVIEW);
    let text = extractText(children);
    let parameters = this.#extractParameters(children, ctx);

    const schemaName = item.content.meta?.name;
    const isSchemaDefinition =
      item.content.itemVariant === itemVariant.SCHEMA && typeof schemaName === 'string';
    if (isSchemaDefinition) {
      const page = extractSchemaPageFields(schemaName as string, this.#schemaStore, ctx);
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
      ...('httpVerb' in item && item.httpVerb ? { httpMethod: item.httpVerb as string } : {}),
      ...(httpPath ? { httpPath: httpPath as string } : {}),
      ...('badges' in item && Array.isArray(item.badges) && item.badges.length
        ? { badges: item.badges as SearchDocument['badges'] }
        : {}),
      ...('isAdditionalOperation' in item && item.isAdditionalOperation
        ? { isAdditionalOperation: true }
        : {}),
      ...(isSchemaDefinition ? { isSchemaDefinition: true } : {}),
      ...rbacProp(readRbacScope(itemData)),
      ...(parameters.length && { parameters }),
    };

    this.#documents.push(doc);
  }

  #extractParameters(children: ContentNode[], ctx: ExtractContext): OperationParameter[] {
    const visit = (nodes: ContentNode[], scoped: ExtractContext): void => {
      for (const node of nodes) {
        if (node.nodeType === nodeTypes.ITEM) {
          const itemNode = node as ItemContentNode;
          if (hasRbacScope(itemNode)) continue;
          if (itemNode.variant === 'callback' && itemNode.callback) {
            extractCallback(itemNode.callback, scoped, visit);
            continue;
          }
          for (const extractor of extractorsFor(itemNode)) extractor.extract(itemNode, scoped);
        } else if (node.nodeType === nodeTypes.MARKDOC) {
          extractHeadingSections((node as MarkdocNode).content, scoped);
        } else if (node.nodeType === nodeTypes.SECURITY) {
          extractSecurityRows(node as SecurityNode, scoped);
        } else if (node.nodeType === nodeTypes.INFO_METADATA) {
          extractInfoMetadataRows(node as InfoMetadataNode, scoped);
        } else if (node.nodeType === nodeTypes.CONTAINER) {
          const container = node as ContainerNode;
          if (hasRbacScope(container)) continue;
          extractMessageBindingFields(container, scoped);
          visit(container.children, scoped);
          // Panel rows go after the field rows: engines that pick the first matching row prefer fields.
          extractServerFields(container, scoped);
          extractPanelRows(container, scoped);
        } else if (node.nodeType === nodeTypes.OVERVIEW_SECTION_WRAPPER) {
          visit((node as OverviewSectionWrapperNode).children, scoped);
        }
      }
    };

    visit(children, ctx);
    return Object.values(ctx.paramsMap);
  }
}
