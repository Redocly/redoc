import { getCallback } from '../callback';
import { normalizeOptions, OpenAPIParser } from '../../services';

const opts = normalizeOptions({});

describe('Models', () => {
  describe('CallbackModel', () => {
    const spec = require('./fixtures/callback.json');
    const parser = new OpenAPIParser(spec, undefined, opts);

    test('basic callback details', () => {
      const callback = getCallback(
        parser,
        'Test.Callback',
        { $ref: '#/components/callbacks/Test' },
        '',
        opts,
        '',
      );
      expect(callback.name).toEqual('Test.Callback');
      expect(callback.operations.length).toEqual(0);
    });
  });
});
