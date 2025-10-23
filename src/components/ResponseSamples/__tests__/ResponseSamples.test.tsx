import { render } from '@testing-library/react';

import type { OpenAPIDefinition } from '../../../types';
import type { OperationModel } from '../../../models';

import { ResponseSamples } from '../ResponseSamples';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getOperation } from '../../../models';
import { withTestProviders } from '../../../testProviders';
import museum from './fixtures/museum.json';
import definitionWithContent from './fixtures/operationDefinitionWithContent.json';
import definitionWithoutContent from './fixtures/operationDefinitionWithoutContent.json';

describe('ResponseSamples', () => {
  let operation: OperationModel;
  const options = normalizeOptions({});

  const parser = new OpenAPIParser(museum as OpenAPIDefinition, undefined, options);

  it('renders PayloadSamples when response has a sample', () => {
    operation = getOperation(parser, definitionWithContent, undefined, options, '');

    const { container } = render(
      withTestProviders(
        <ResponseSamples operation={operation} activeResponseTab="200" onTabChange={jest.fn()} />,
        {
          definition: parser.definition,
        },
      ),
    );

    expect(container).toHaveTextContent('2023-09-11');
  });

  it('renders StyledCodeBlock when response does not have a sample', () => {
    operation = getOperation(parser, definitionWithoutContent, undefined, options, '');

    const { container } = render(
      withTestProviders(
        <ResponseSamples operation={operation} activeResponseTab="200" onTabChange={jest.fn()} />,
        {
          definition: parser.definition,
        },
      ),
    );

    expect(container).toHaveTextContent('No content');
  });
});
