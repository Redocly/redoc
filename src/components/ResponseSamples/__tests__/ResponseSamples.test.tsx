import { render } from '@testing-library/react';

import type { OpenAPIDefinition } from '../../../types/index.js';
import type { OperationModel } from '../../../models/index.js';

import { ResponseSamples } from '../ResponseSamples.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getOperation } from '../../../models/index.js';
import { withTestProviders } from '../../../testProviders.js';
import museum from './fixtures/museum.json';
import type { ExtendedOpenAPIOperation } from '../../../services/index.js';

import definitionWithContent from './fixtures/operationDefinitionWithContent.json';
import definitionWithoutContent from './fixtures/operationDefinitionWithoutContent.json';

describe('ResponseSamples', () => {
  let operation: OperationModel;
  const options = normalizeOptions({});

  const parser = new OpenAPIParser(museum as unknown as OpenAPIDefinition, undefined, options);

  it('renders PayloadSamples when response has a sample', () => {
    operation = getOperation(
      parser,
      definitionWithContent as unknown as ExtendedOpenAPIOperation,
      undefined,
      options,
      '',
    );

    const { container } = render(
      withTestProviders(
        <ResponseSamples operation={operation} activeResponseTab="200" onTabChange={vi.fn()} />,
        {
          definition: parser.definition,
        },
      ),
    );

    expect(container).toHaveTextContent('2023-09-11');
  });

  it('renders StyledCodeBlock when response does not have a sample', () => {
    operation = getOperation(
      parser,
      definitionWithoutContent as unknown as ExtendedOpenAPIOperation,
      undefined,
      options,
      '',
    );

    const { container } = render(
      withTestProviders(
        <ResponseSamples operation={operation} activeResponseTab="200" onTabChange={vi.fn()} />,
        {
          definition: parser.definition,
        },
      ),
    );

    expect(container).toHaveTextContent('No content');
  });
});
