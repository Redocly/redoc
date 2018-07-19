import { OperationModel } from '../../models/Operation';
import { ExtendedOpenAPIOperation } from '../../MenuBuilder';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Operation', () => {
    let parser;
    let operation = {
        responses: {},
        pathParameters: [],
        httpVerb: 'get',
        _$ref: ''
    }

    test('should expand server url variables', () => {
      const spec = require('../fixtures/servers.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new OperationModel(parser, operation, '', opts);
      expect(schema.servers[0].url).toEqual('http://127.0.0.1/path/to/endpoint');
      expect(schema.servers[1].url).toEqual('http://127.0.0.2');
      expect(schema.servers[2].url).toEqual('http://127.0.0.3');
    });
  });
});
