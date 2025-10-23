import { render } from '@testing-library/react';

import type { OpenAPIDefinition } from '../../../types';
import type { OperationModel } from '../../../models';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getMediaContent, getOperation } from '../../../models';
import { withTestProviders } from '../../../testProviders';
import { PayloadSamples } from '../PayloadSamples';
import testDefinition from './fixtures/mediaTypeUrlencoded.json';

describe('PayloadSamples', () => {
  let operation: OperationModel;
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(testDefinition as OpenAPIDefinition, undefined, options);

  test('should renders correctly without example to application/x-www-form-urlencoded', async () => {
    operation = getOperation(parser, testDefinition, undefined, options, 'tests');
    const props = {
      operation,
      content: getMediaContent({
        parser,
        info: testDefinition.paths['/test'].get.requestBody.content,
        isRequestType: true,
        options,
        data: { operation },
      }),
      onCopyClick: jest.fn(),
    };

    const { container } = render(
      withTestProviders(<PayloadSamples {...props} />, { definition: parser.definition }),
    );
    expect(container).toHaveTextContent(/name=string&status=string/);
  });
});
