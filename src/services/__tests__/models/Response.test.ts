import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';

import { ResponseModel } from '../../models/Response';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});
describe('Models', () => {
  describe('ResponseModel', () => {
    let parser, props;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as any, undefined, opts);
      props = {
        parser,
        defaultAsError: false,
        infoOrRef: {},
        options: opts,
        isEvent: false,
        code: 'default',
      };
    });

    test('should calculate response type based on code', () => {
      let resp = new ResponseModel({ ...props, code: '200' });
      expect(resp.type).toEqual('success');
      resp = new ResponseModel({ ...props, code: '120' });
      expect(resp.type).toEqual('info');
      resp = new ResponseModel({ ...props, code: '301' });
      expect(resp.type).toEqual('redirect');
      resp = new ResponseModel({ ...props, code: '400' });
      expect(resp.type).toEqual('error');
    });

    test('default should be successful by default', () => {
      const resp = new ResponseModel({ ...props, code: 'default' });
      expect(resp.type).toEqual('success');
    });

    test('default should be error if defaultAsError is true', () => {
      const resp = new ResponseModel({ ...props, code: 'default', defaultAsError: true });
      expect(resp.type).toEqual('error');
    });

    test('ensure extensions are shown if showExtensions is true', () => {
      const options = new RedocNormalizedOptions({ showExtensions: true });
      const resp = new ResponseModel({
        parser,
        code: 'default',
        defaultAsError: true,
        infoOrRef: { 'x-example': { a: 1 } },
        options,
        isEvent: true,
      });
      expect(Object.keys(resp.extensions).length).toEqual(1);
      expect(resp.extensions['x-example']).toEqual({ a: 1 });
    });

    test('should get correct sibling in responses for openapi 3.1', () => {
      const spec = parseYaml(outdent`
        openapi: 3.1.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  description: Overridden description
                  $ref: "#/components/responses/Successful"
        components:
          responses:
            Successful:
              description: successful operation
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      successful:
                        type: boolean
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const code = '200';
      const responseModel = new ResponseModel({
        parser: parser,
        code: code,
        defaultAsError: false,
        infoOrRef: spec.paths['/test'].get.responses[code],
        options: opts,
        isEvent: false,
      });

      expect(responseModel.summary).toBe('Overridden description');
    });

    test('should not override description in responses for openapi 3.0', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  description: Overridden description
                  $ref: "#/components/responses/Successful"
        components:
          responses:
            Successful:
              description: successful operation
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      successful:
                        type: boolean
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const code = '200';
      const responseModel = new ResponseModel({
        parser: parser,
        code: code,
        defaultAsError: false,
        infoOrRef: spec.paths['/test'].get.responses[code],
        options: opts,
        isEvent: false,
      });

      expect(responseModel.summary).toBe('successful operation');
    });
  });
});
