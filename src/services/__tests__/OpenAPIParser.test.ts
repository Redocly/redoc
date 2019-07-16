import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('should hoist oneOfs when mergin allOf', () => {
      const spec = require('./fixtures/oneOfHoist.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(parser.mergeAllOf(spec.components.schemas.test)).toMatchSnapshot();
    });

    test('should not mark as circular when multiple schemas in allOf use the same ref', () => {
      const spec = require('./fixtures/allOfCircular.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(
        parser.mergeAllOf(spec.components.schemas.test).properties.object['x-circular-ref'],
      ).toEqual(undefined);
    });
  });
});
