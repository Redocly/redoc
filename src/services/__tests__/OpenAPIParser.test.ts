import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('should hoist oneOfs when mergin allOf', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const spec = require('./fixtures/oneOfHoist.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(parser.mergeAllOf(spec.components.schemas.test)).toMatchSnapshot();
    });
  });
});
