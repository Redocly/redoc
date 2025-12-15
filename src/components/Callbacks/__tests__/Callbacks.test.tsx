import { render } from '@testing-library/react';

import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getCallback } from '../../../models/index.js';
import { CallbackOperation } from '../CallbackOperation.js';
import { CallbacksList } from '../CallbacksList.js';
import { CallbackSummary } from '../CallbackSummary.js';
import * as simpleCallbackFixture from './fixtures/simple-callback.json';
import type { OpenAPIDefinition } from '../../../types/index.js';
import { TestBrowserRouter } from '../../../testProviders.js';

const options = normalizeOptions({});

describe('Components', () => {
  describe('Callbacks', () => {
    const parser = new OpenAPIParser(
      simpleCallbackFixture as unknown as OpenAPIDefinition,
      undefined,
      options,
    );
    const callback = getCallback(
      parser,
      'Test.Callback',
      { $ref: '#/components/callbacks/Test' },
      '',
      options,
      '',
    );

    it('should correctly render CallbackView', () => {
      const { getByText } = render(
        <CallbackOperation
          operation={callback.operations[0]}
          onExpand={() => {}}
          selectedCallback={null}
        />,
        {
          wrapper: TestBrowserRouter,
        },
      );

      expect(getByText('testCallback')).toBeInTheDocument();
    });

    it('should correctly render CallbackTitle', () => {
      const { getByText } = render(
        <CallbackSummary
          toggle={() => {}}
          callback={callback.operations[0]}
          translate={() => ''}
        />,
        {
          wrapper: TestBrowserRouter,
        },
      );

      expect(getByText('testCallback')).toBeInTheDocument();
    });

    it('should correctly render CallbacksList', () => {
      const { getByText } = render(
        <CallbacksList callbacks={[callback]} onExpand={() => {}} selectedCallback={null} />,
        {
          wrapper: TestBrowserRouter,
        },
      );

      expect(getByText('testCallback')).toBeInTheDocument();
    });
  });
});
