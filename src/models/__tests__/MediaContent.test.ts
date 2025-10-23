import type { OpenAPIDefinition } from '../../types';
import type { OperationModel } from '..';

import { getMediaContent } from '../mediaContent';
import { normalizeOptions, OpenAPIParser } from '../../services';
import { MediaTypes } from '../../constants';

const options = normalizeOptions({});
const data = { operation: { pointer: 'testMediaContent' } as OperationModel };
describe('Models', () => {
  describe('mediaContent', () => {
    let parser;
    const info = {
      [MediaTypes.JSON]: {
        schema: {
          additionalProperties: {
            format: 'int32',
          },
        },
      },
    };

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as OpenAPIDefinition, undefined, options);
    });

    test('should work with default arguments', () => {
      const consoleError = jest.spyOn(global.console, 'error');
      const mediaContentModel = getMediaContent({
        parser,
        info: {},
        isRequestType: true,
        options,
        data,
      });
      expect(consoleError).not.toHaveBeenCalled();
      expect(mediaContentModel).toEqual({
        hasSample: false,
        isRequestType: true,
        mediaTypes: [],
        ...data,
      });
    });

    test('should handle isRequestType argument', () => {
      const mediaContentModelWithRequestTypeTrue = getMediaContent({
        parser,
        info: {},
        isRequestType: true,
        options,
        data,
      });
      const mediaContentModelWithRequestTypeFalse = getMediaContent({
        parser,
        info: {},
        isRequestType: false,
        options,
        data,
      });

      expect(mediaContentModelWithRequestTypeTrue.isRequestType).toEqual(true);
      expect(mediaContentModelWithRequestTypeFalse.isRequestType).toEqual(false);
    });

    test('should return mediaType', () => {
      const mediaContentModel = getMediaContent({
        parser,
        info,
        isRequestType: true,
        options,
        data,
      });
      const firstMediaType = mediaContentModel.mediaTypes[0];

      expect(mediaContentModel.mediaTypes.length).toEqual(1);
      expect(firstMediaType.name).toEqual(MediaTypes.JSON);
    });
  });
});
