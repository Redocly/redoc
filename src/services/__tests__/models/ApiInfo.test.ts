import { ApiInfoModel } from '../../models/ApiInfo';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});
describe('Models', () => {
  describe('ResponseModel', () => {
    let parser: OpenAPIParser;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as any, undefined, opts);
    });

    test('should correctly populate description field without md headings', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'Test description',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.description).toEqual('Test description');
    });

    test('should correctly populate description up to the first md heading', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'Test description\nsome text\n## Heading\n test',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.description).toEqual('Test description\nsome text\n');
    });

    test('should correctly populate summary up to the first md heading', () => {
      parser.spec = {
        openapi: '3.1.0',
        info: {
          summary: 'Test summary\nsome text\n## Heading\n test',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.summary).toEqual('Test summary\nsome text\n## Heading\n test');
    });

    test('should correctly populate description when 2nd line is started by white space', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'text before\n  # Test',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.description).toEqual('text before\n');
    });

    test('should correctly populate description when 2nd line is only white space', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'text before\n \n # Test',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.description).toEqual('text before\n');
    });

    test('should correctly populate license identifier', () => {
      parser.spec = {
        openapi: '3.1.0',
        info: {
          license: {
            name: 'MIT',
            identifier: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
      } as any;

      const { license = { identifier: null } } = new ApiInfoModel(parser);
      expect(license.identifier).toEqual('MIT');
    });

    test('should correctly populate default download file name', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'Test description',
        },
      } as any;

      const info = new ApiInfoModel(parser);
      expect(info.downloadFileName).toEqual('openapi.json');
    });

    test('should correctly populate default download file is undefined when using specUrl', () => {
      parser = new OpenAPIParser(
        {
          openapi: '3.0.0',
          info: {
            description: 'Test description',
          },
        } as any,
        '/demo/openapi.yaml',
        opts,
      );

      const info = new ApiInfoModel(parser);
      expect(info.downloadFileName).toEqual(undefined);
    });

    test('should correctly populate download file name', () => {
      parser.spec = {
        info: {
          description: 'Test description',
        },
      } as any;

      const opts = new RedocNormalizedOptions({
        downloadFileName: 'test.yaml',
      });

      const info = new ApiInfoModel(parser, opts);
      expect(info.downloadFileName).toEqual('test.yaml');
    });

    test('should correctly populate download link', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'Test description',
        },
      } as any;

      const opts = new RedocNormalizedOptions({
        downloadDefinitionUrl: 'https:test.com/filename.yaml',
      });
      const info = new ApiInfoModel(parser, opts);
      expect(info.downloadLink).toEqual('https:test.com/filename.yaml');
    });

    test('should correctly populate download link and download file name', () => {
      parser.spec = {
        openapi: '3.0.0',
        info: {
          description: 'Test description',
        },
      } as any;

      const opts = new RedocNormalizedOptions({
        downloadDefinitionUrl: 'https:test.com/filename.yaml',
        downloadFileName: 'test.yaml',
      });
      const info = new ApiInfoModel(parser, opts);
      expect(info.downloadLink).toEqual('https:test.com/filename.yaml');
      expect(info.downloadFileName).toEqual('test.yaml');
    });
  });
});
