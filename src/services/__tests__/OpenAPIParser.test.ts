import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { OpenAPIParameter, Referenced } from '../../types';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('should hoist oneOfs when mergin allOf', () => {
      const spec = require('./fixtures/oneOfHoist.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(parser.mergeAllOf(spec.components.schemas.test)).toMatchSnapshot();
    });

    test('should get schema name from named schema', () => {
      const spec = require('./fixtures/mergeAllOf.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(spec.components.schemas.Case1, '#/components/schemas/Case1');
      expect(schema.title).toEqual('Case1');
    });

    test('should get schema name from first allOf', () => {
      const spec = require('./fixtures/mergeAllOf.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(
        spec.components.schemas.Case2.properties.a,
        '#components/schemas/Case2/properties/a',
      );
      expect(schema.title).toEqual('Bar');
    });

    test('should get schema name from named schema', () => {
      const spec = require('./fixtures/mergeAllOf.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(
        spec.components.schemas.Case3.schemas.Foo,
        '#components/schemas/Case3/schemas/Foo',
      );
      expect(schema.title).toEqual('Foo');
    });

    test('should merge oneOf to inside allOff', () => {
      // TODO: should hoist
      const spec = require('./fixtures/mergeAllOf.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(spec.components.schemas.Case4);
      expect(schema.title).toEqual('Foo');
      expect(schema['x-parentRefs']).toHaveLength(1);
      expect(schema['x-parentRefs'][0]).toEqual('#/components/schemas/Ref');
      expect(schema.oneOf).toEqual([{ title: 'Bar' }, { title: 'Baz' }]);
    });

    test('should override description from $ref of the referenced component, when sibling description exists ', () => {
      const spec = require('./fixtures/siblingRefDescription.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schemaOrRef: Referenced<OpenAPIParameter> = {
        $ref: '#/components/schemas/Test',
        description: 'Overriden description',
      };

      expect(parser.deref(schemaOrRef)).toMatchSnapshot();
    });

    test('should correct resolve double $ref if no need sibling', () => {
      const spec = require('./fixtures/3.1/schemaDefinition.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schemaOrRef: Referenced<OpenAPIParameter> = {
        $ref: '#/components/schemas/Parent',
      };

      expect(parser.deref(schemaOrRef, [], true)).toMatchSnapshot();
    });
  });
});
