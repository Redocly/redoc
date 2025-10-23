import type { OpenAPIExample, Referenced } from '../types/index.js';
import type { OpenAPIParser } from '../services/index.js';
import type { ExampleModel } from './types.js';

import { getValueFromMdParsedExtension } from '../utils/index.js';

type GetExamplesInput = Pick<ExampleModel, 'mime' | 'encoding'> & {
  parser: OpenAPIParser;
  infoOrRef: Referenced<OpenAPIExample>;
};

export function getExamples({ parser, infoOrRef, mime, encoding }: GetExamplesInput): ExampleModel {
  const { resolved: example } = parser.deref(infoOrRef);
  const rawValue = example.value;
  const value = example.value;
  const summary = getValueFromMdParsedExtension(example, 'summary');
  const description = getValueFromMdParsedExtension(example, 'description');

  return {
    value,
    rawValue,
    summary,
    description,
    mime,
    encoding,
  };
}
