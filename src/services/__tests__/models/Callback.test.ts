import { CallbackModel } from '../../models/Callback';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('CallbackModel', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const spec = require('../fixtures/callback.json');
    const parser = new OpenAPIParser(spec, undefined, opts);

    test('basic callback details', () => {
      const callback = new CallbackModel(
        parser,
        'Test.Callback',
        { $ref: '#/components/callbacks/Test' },
        '',
        opts,
      );
      expect(callback.name).toEqual('Test.Callback');
      expect(callback.operations.length).toEqual(0);
      expect(callback.expanded).toBeFalsy();
    });
  });
});
