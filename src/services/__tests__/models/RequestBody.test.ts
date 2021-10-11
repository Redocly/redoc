import { RequestBodyModel } from '../../models/RequestBody';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});
describe('Models', () => {
  describe('RequestBodyModel', () => {
    let parser, props;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as any, undefined, opts);
      props = {
        parser,
        infoOrRef: {},
        options: opts,
        isEvent: false,
      };
    });

    test('should work with default props', () => {
      const consoleError = jest.spyOn(global.console, 'error');
      const req = new RequestBodyModel(props);
      expect(consoleError).not.toHaveBeenCalled();
      expect(req).toEqual({ description: '', required: false });
    });
  });
});
