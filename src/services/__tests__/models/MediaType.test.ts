import { MediaTypeModel } from '../../models/MediaType';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const DEFAULT_OPTS = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('MediaTypeModel', () => {
    let parser;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as any, undefined, DEFAULT_OPTS);
    });

    test('should generate a sample by default', () => {
      const mediaType = new MediaTypeModel(
        parser,
        'application/json',
        false,
        {
          schema: { type: 'object', properties: { name: { type: 'string' } } },
        } as any,
        DEFAULT_OPTS,
      );

      expect(mediaType.examples).toBeDefined();
      expect(mediaType.examples?.default?.value).toEqual({ name: 'string' });
    });

    test('should not generate a sample when hideGeneratedSamples is set', () => {
      const opts = new RedocNormalizedOptions({ hideGeneratedSamples: true });
      const mediaType = new MediaTypeModel(
        parser,
        'application/json',
        false,
        { schema: { type: 'object', properties: { name: { type: 'string' } } } } as any,
        opts,
      );

      expect(mediaType.examples).toBeUndefined();
    });

    test('should keep explicitly authored examples when hideGeneratedSamples is set', () => {
      const opts = new RedocNormalizedOptions({ hideGeneratedSamples: true });
      const mediaType = new MediaTypeModel(
        parser,
        'application/json',
        false,
        {
          schema: { type: 'object', properties: { name: { type: 'string' } } },
          examples: { default: { value: { name: 'real value' } } },
        } as any,
        opts,
      );

      expect(mediaType.examples).toBeDefined();
      expect(mediaType.examples?.default?.value).toEqual({ name: 'real value' });
    });

    test('should not generate a sample for oneOf when hideGeneratedSamples is set', () => {
      const opts = new RedocNormalizedOptions({ hideGeneratedSamples: true });
      const mediaType = new MediaTypeModel(
        parser,
        'application/json',
        false,
        {
          schema: {
            oneOf: [
              { title: 'First', type: 'object', properties: { a: { type: 'string' } } },
              { title: 'Second', type: 'object', properties: { b: { type: 'string' } } },
            ],
          },
        } as any,
        opts,
      );

      expect(mediaType.examples).toBeUndefined();
    });

    test('should still expose the schema when hideGeneratedSamples is set', () => {
      const opts = new RedocNormalizedOptions({ hideGeneratedSamples: true });
      const mediaType = new MediaTypeModel(
        parser,
        'application/json',
        false,
        { schema: { type: 'object', properties: { name: { type: 'string' } } } } as any,
        opts,
      );

      expect(mediaType.schema).toBeDefined();
    });
  });
});
