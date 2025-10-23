import { OpenAPIParser } from '../OpenAPIParser';
import { normalizeOptions } from '../config-options';

const opts = normalizeOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('should hoist oneOfs when mergin allOf', async () => {
      const spec = (await import('./fixtures/oneOfHoist.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(parser.mergeAllOf(spec.components.schemas.test)).toMatchSnapshot();
    });

    test('should not crash on self-referencing array in allOf', async () => {
      const spec = (await import('./fixtures/allOfSelfReferencingArray.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      expect(parser.mergeAllOf(spec.components.schemas.Test)).toMatchSnapshot();
    });

    test('should get schema name from named schema', async () => {
      const spec = (await import('./fixtures/mergeAllOf.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(spec.components.schemas.Case1, '#/components/schemas/Case1');
      expect(schema.title).toEqual('Case1');
    });

    test('should get schema name from first allOf', async () => {
      const spec = (await import('./fixtures/mergeAllOf.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(
        spec.components.schemas.Case2.properties.a,
        '#components/schemas/Case2/properties/a',
      );
      expect(schema.title).toEqual('Bar');
    });

    test('should get schema name from named schema in allOf', async () => {
      const spec = (await import('./fixtures/mergeAllOf.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(
        spec.components.schemas.Case3.schemas.Foo,
        '#components/schemas/Case3/schemas/Foo',
      );
      expect(schema.title).toEqual('Foo');
    });

    test('should merge oneOf to inside allOff', async () => {
      // TODO: should hoist

      const spec = (await import('./fixtures/mergeAllOf.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = parser.mergeAllOf(spec.components.schemas.Case4);
      expect(schema.title).toEqual('Foo');
      expect(schema['x-parentRefs']).toHaveLength(1);
      expect(schema['x-parentRefs'][0]).toEqual('#/components/schemas/Ref');
      expect(schema.oneOf).toEqual([{ title: 'Bar' }, { title: 'Baz' }]);
    });
  });
});
