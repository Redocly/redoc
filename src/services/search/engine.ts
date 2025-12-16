import FlexSearch, {
  type DocumentOptions,
  type Document,
  type Id,
  type DocumentData,
} from 'flexsearch';

import type { SearchDocument, SearchItemData, OperationParameter } from './types.js';

import {
  SEARCH_INDEX_FIELDS,
  DISABLE_DEEP_LINK_IF_FIELDS_EXIST,
  SEARCH_LIMIT,
  HIGHLIGHTED_TEXT_MAX_LENGTH,
} from '../../constants.js';

const indexSchema = {
  document: {
    id: 'id',
    index: SEARCH_INDEX_FIELDS,
  },
  worker: false,
  tokenize: 'forward',
  context: {
    depth: 2,
    resolution: 9,
  },
} as DocumentOptions;

export class SearchEngine {
  private _index: Document;
  private _documents = new Map<string, SearchDocument>();

  constructor() {
    this._index = new FlexSearch.Document(indexSchema);
  }

  addDocument(document: SearchDocument) {
    this._documents.set(document.id, document);
    this._index.add(document.id, document as DocumentData);
  }

  search(query: string) {
    let transformedSearchResults = new Map<Id, { fields: string[] }>();
    const searchData: SearchItemData[] = [];
    const searchResults = this._index.search(query);

    for (const searchResult of searchResults) {
      for (const searchDocumentId of searchResult.result) {
        const fields = transformedSearchResults.get(searchDocumentId)?.fields || [];
        transformedSearchResults.set(searchDocumentId, {
          fields: searchResult.field ? [...fields, searchResult.field] : [...fields],
        });
      }
    }

    let searchLimitCounter = 0;
    for (const [id, value] of transformedSearchResults.entries()) {
      if (searchLimitCounter >= SEARCH_LIMIT) {
        break;
      }
      const document = this._documents.get(id as string);
      if (document) {
        searchData.push({
          document: this.resolveDeepLink(document, query, value.fields),
          highlight: this.prepareHighlight(document, query, value.fields),
        });
        searchLimitCounter++;
      }
    }

    return searchData;
  }

  private resolveDeepLink(
    document: SearchDocument,
    query: string,
    fields: string[],
  ): SearchDocument {
    for (const FIELD of DISABLE_DEEP_LINK_IF_FIELDS_EXIST) {
      //We don't resolve deep links if search result contains certain fields
      if (fields.some((field) => field === FIELD)) {
        return document;
      }
    }

    let deepLink;
    for (const field of fields) {
      if (field.includes('parameters')) {
        const parameterField = field.split(':')[1];
        const documentParameter = document.parameters?.find((param) => {
          const value = param[parameterField as keyof OperationParameter];

          return this.someMatchesPredicate(
            query,
            typeof value === 'boolean' ? value.toString() : value,
          );
        });
        if (documentParameter) {
          deepLink = documentParameter.deepLink;
          break;
        }
      }
    }

    if (deepLink) {
      const section = deepLink.split('#')[1];
      return { ...document, url: `${document.url}#${section}` };
    }
    return document;
  }

  private someMatchesPredicate = (query: string, text?: string | string[]) => {
    if (text) {
      const words = query.split(/\s+/g);
      if (Array.isArray(text)) {
        return text.some((textItem) =>
          words.some((word) => textItem.toLowerCase().includes(word.toLowerCase())),
        );
      } else {
        return words.some((word) => text.toLowerCase().includes(word.toLowerCase()));
      }
    } else return false;
  };

  private prepareHighlight(
    document: SearchDocument,
    query: string,
    fields: string[],
  ): SearchItemData['highlight'] {
    const highlightedFields: SearchItemData['highlight'] = {};
    let isParametersHighlighted = false;
    for (const field of fields) {
      if (field === 'path') {
        highlightedFields.path = document.path
          ? document.path.map((pathItem) => this.highlight(query, pathItem))
          : [];
      } else if (field.includes('parameters')) {
        if (!isParametersHighlighted) {
          const parameterField = field.split(':')[1];
          const documentParameter = document.parameters?.find((param) => {
            const value = param[parameterField as keyof OperationParameter];

            return this.someMatchesPredicate(
              query,
              typeof value === 'boolean' ? value.toString() : value,
            );
          });
          if (documentParameter) {
            highlightedFields.parameters = [
              {
                name: this.highlight(query, documentParameter.name as string),
                description: this.highlight(query, documentParameter.description as string),
                place: this.highlight(query, documentParameter.place as string),
                path: documentParameter.path
                  ? documentParameter.path.map((pathItem) => this.highlight(query, pathItem))
                  : [],
              },
            ];
            isParametersHighlighted = true;
          }
        }
      } else {
        highlightedFields[field] = this.highlight(
          query,
          document[field as keyof SearchDocument] as string,
        );
      }
    }
    return highlightedFields;
  }

  private highlight(query: string, text: string): string {
    const words = query.split(/\s+/g);

    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const highlightedText = words.reduce((acc, word) => {
      return word
        ? acc?.replace?.(
            new RegExp(`(^|\\s)${escapeRegExp(word)}`, 'i'),
            (match) => `<mark>${match}</mark>`,
          )
        : acc;
    }, text);

    if (!highlightedText) {
      return text || '';
    }

    if (highlightedText.length < HIGHLIGHTED_TEXT_MAX_LENGTH) {
      return highlightedText;
    } else {
      const firstOpenTagIndex = highlightedText.indexOf('<mark>');
      const firstCloseTagIndex = highlightedText.indexOf('</mark>') + 7;
      const middleOfHighlighted = HIGHLIGHTED_TEXT_MAX_LENGTH / 2 + query.length / 2;
      const trimmedAtStart = firstOpenTagIndex < middleOfHighlighted;
      const trimmedAtEnd = firstCloseTagIndex + middleOfHighlighted < highlightedText.length;
      const trimmedString = highlightedText.substring(
        trimmedAtStart ? 0 : firstOpenTagIndex - middleOfHighlighted,
        trimmedAtEnd ? firstCloseTagIndex + middleOfHighlighted : highlightedText.length,
      );
      return `${trimmedAtStart ? '' : '...'}${trimmedString}${trimmedAtEnd ? '...' : ''}`;
    }
  }
}
