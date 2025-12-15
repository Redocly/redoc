import { getCallback } from '../callback.js';
import { normalizeOptions, OpenAPIParser } from '../../services/index.js';
import spec from './fixtures/callback.json';

const opts = normalizeOptions({});

describe('Models', () => {
  describe('CallbackModel', () => {
    const parser = new OpenAPIParser(
      spec as unknown as ConstructorParameters<typeof OpenAPIParser>[0],
      undefined,
      opts,
    );

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
