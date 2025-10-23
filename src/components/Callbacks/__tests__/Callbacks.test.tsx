import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getCallback } from '../../../models';
import { CallbackOperation } from '../CallbackOperation';
import { CallbacksList } from '../CallbacksList';
import { CallbackSummary } from '../CallbackSummary';
import * as simpleCallbackFixture from './fixtures/simple-callback.json';

const options = normalizeOptions({});

describe('Components', () => {
  describe('Callbacks', () => {
    const parser = new OpenAPIParser(simpleCallbackFixture, undefined, options);
    const callback = getCallback(
      parser,
      'Test.Callback',
      { $ref: '#/components/callbacks/Test' },
      '',
      options,
      '',
    );

    it('should correctly render CallbackView', () => {
      const { getByText } = render(<CallbackOperation operation={callback.operations[0]} />, {
        wrapper: BrowserRouter,
      });

      expect(getByText('testCallback')).toBeInTheDocument();
    });

    it('should correctly render CallbackTitle', () => {
      const { getByText } = render(
        <CallbackSummary toggle={() => {}} callback={callback.operations[0]} />,
        {
          wrapper: BrowserRouter,
        },
      );

      expect(getByText('testCallback')).toBeInTheDocument();
    });

    it('should correctly render CallbacksList', () => {
      const { getByText } = render(<CallbacksList callbacks={[callback]} />, {
        wrapper: BrowserRouter,
      });

      expect(getByText('testCallback')).toBeInTheDocument();
    });
  });
});
