import type {
  OperationParameter,
  ParameterHighlight,
  SearchDocument,
  SearchItemData,
} from '../types.js';
import type { LowerDocument } from './lowered.js';
import type { DocumentMatch, ParsedQuery } from './types.js';

import { isExamplesPlace } from '../indexer/places.js';
import { highlightTextForSearch as highlight, markMatchedValue } from '../highlight.js';
import { coversQuery } from './query.js';
import { lowerText, toText } from './text.js';

export function resolveDeepLink(
  page: LowerDocument,
  document: SearchDocument,
  match: DocumentMatch,
  query: ParsedQuery,
): SearchDocument {
  if (coversQuery(query, page.title)) return document;
  if (coversQuery(query, page.text) && !parameterCoversQuery(query, match.parameter)) {
    return document;
  }
  return withSection(document, match.parameter?.deepLink);
}

function parameterCoversQuery(
  query: ParsedQuery,
  parameter: OperationParameter | undefined,
): boolean {
  if (!parameter || isExamplesPlace(parameter.place)) return false;

  return (
    coversQuery(query, lowerText(parameter.description)) ||
    coversQuery(query, lowerText(parameter.name))
  );
}

function withSection(document: SearchDocument, deepLink: string | undefined): SearchDocument {
  const section = deepLink?.split('#')[1];
  return section ? { ...document, url: `${document.url}#${section}` } : document;
}

export function prepareHighlight(
  document: SearchDocument,
  query: string,
  match: DocumentMatch,
): SearchItemData['highlight'] {
  const highlightedFields: SearchItemData['highlight'] = {};

  for (const field of match.fields) {
    if (field === 'title') {
      highlightedFields.title = highlight(query, toText(document.title));
    } else if (field === 'httpPath') {
      highlightedFields.httpPath = highlight(query, toText(document.httpPath));
    } else if (field === 'text') {
      highlightedFields.text = highlight(query, toText(document.text));
    } else if (field === 'path') {
      highlightedFields.path = (document.path ?? []).map((pathItem) => highlight(query, pathItem));
    } else if (field === 'parameters' && match.parameter) {
      highlightedFields.parameters = [
        {
          name: highlight(query, toText(match.parameter.name)),
          description: highlight(query, toText(match.parameter.description)),
          place: highlight(query, match.parameter.place),
          path: (match.parameter.path ?? []).map((pathItem) => highlight(query, pathItem)),
          ...matchedValues(query, match.parameter),
        },
      ];
    }
  }

  return highlightedFields;
}

function matchedValues(query: string, parameter: OperationParameter): Partial<ParameterHighlight> {
  return {
    enum: markMatchedValue(query, (parameter.enum ?? []).join(', ')),
    example: markMatchedValue(query, toText(parameter.example)),
  };
}
