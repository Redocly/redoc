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
  });
});
