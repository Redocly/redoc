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
  });
});
