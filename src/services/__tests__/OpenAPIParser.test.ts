import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { OpenAPIParameter, Referenced } from '../../types';

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

    test('should override description from $ref of the referenced component, when sibling description exists ', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const spec = require('./fixtures/siblingRefDescription.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schemaOrRef: Referenced<OpenAPIParameter> = {
        $ref: '#/components/schemas/Test',
        description: 'Overriden description',
      };

      expect(parser.shallowDeref(schemaOrRef)).toMatchSnapshot();
    });
  });
});
