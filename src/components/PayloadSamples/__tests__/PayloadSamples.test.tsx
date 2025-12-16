import { render } from '@testing-library/react';

import type { OpenAPIDefinition } from '../../../types/index.js';
import type { OperationModel } from '../../../models/index.js';

import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getMediaContent, getOperation } from '../../../models/index.js';
import { withTestProviders } from '../../../testProviders.js';
import { PayloadSamples } from '../PayloadSamples.js';
import testDefinition from './fixtures/mediaTypeUrlencoded.json';

describe('PayloadSamples', () => {
  let operation: OperationModel;
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(testDefinition as OpenAPIDefinition, undefined, options);

  test('should renders correctly without example to application/x-www-form-urlencoded', async () => {
    operation = getOperation(
      parser,
      {
        pointer: '#/paths/~1test/get',
        pathName: '/test',
        httpVerb: 'GET',
        pathParameters: [],
        pathServers: [],
        isWebhook: false,
        isAdditionalOperation: false,
        ...testDefinition.paths['/test'].get,
      },
      undefined,
      options,
      'tests',
    );
    const props = {
      operation,
      content: getMediaContent({
        parser,
        info: testDefinition.paths['/test'].get.requestBody.content,
        isRequestType: true,
        options,
        data: { operation },
      }),
      onCopyClick: vi.fn(),
    };

    const { container } = render(
      withTestProviders(<PayloadSamples {...props} />, { definition: parser.definition }),
    );
    expect(container).toHaveTextContent(/name=string&status=string/);
  });
});
