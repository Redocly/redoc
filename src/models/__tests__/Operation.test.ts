import type { MediaContentModel, OperationModel, RequestBodyModel } from '../types';
import type { XPayloadSample } from '../operation';

import { normalizeOptions, OpenAPIParser } from '../../services';
import { getOperation } from '../operation';
import { getRequestBody } from '../request';
import spec from './fixtures/operation/petstore.json';
import definition from './fixtures/operation/operationDefinition.json';
import noRequestDefinition from './fixtures/operation/noRequestOperationDefinition.json';
import { replaceCircularJson } from './helpers';
const options = normalizeOptions({});

// Add mock at the top with other imports
jest.mock('@redocly/theme', () => ({
  ...jest.requireActual('@redocly/theme'),
}));

describe('Models', () => {
  describe('Operation', () => {
    const parser = new OpenAPIParser(spec, undefined, options);
    let operation: OperationModel;
    let requestBody: RequestBodyModel;
    let payload: XPayloadSample;

    describe('Operation with request body', () => {
      beforeEach(() => {
        operation = getOperation(parser, definition, undefined, options, 'test');
        requestBody = getRequestBody({
          parser,
          infoOrRef: definition.requestBody,
          options,
          operation,
          isEvent: false,
        });

        payload = {
          lang: 'payload',
          label: 'Payload',
          source: '',
          requestBodyContent: requestBody.content as MediaContentModel,
        };
      });

      test('should create Operation Model', () => {
        expect(operation).toBeDefined();
        expect(operation.operationId).toBe(definition.operationId);
      });

      test('should return request body', () => {
        expect(operation.requestBody?.description).toEqual(requestBody.description);
        expect(operation.requestBody?.required).toEqual(requestBody.required);
        expect(JSON.stringify(operation.requestBody?.content, replaceCircularJson)).toEqual(
          JSON.stringify(requestBody.content, replaceCircularJson),
        );
      });

      test('should return payload', () => {
        expect(JSON.stringify(operation.payload, replaceCircularJson)).toEqual(
          JSON.stringify(payload, replaceCircularJson),
        );
      });

      test('should return hasSamples: true', () => {
        expect(operation.hasSamples).toBe(true);
      });

      test('should return definitionSamples', () => {
        expect(operation.definitionSamples).toEqual(definition['x-codeSamples']);
      });
    });

    describe('Operation without request body', () => {
      beforeEach(() => {
        operation = getOperation(parser, noRequestDefinition, undefined, options, '');
      });

      test('should return requestBody undefined', () => {
        expect(operation.requestBody).toBe(undefined);
      });

      test('should return payload undefined', () => {
        expect(operation.payload).toEqual({
          lang: 'Payload',
          source: '',
          requestBodyContent: undefined,
        });
      });

      test('should return hasSamples: false', () => {
        expect(operation.hasSamples).toBe(false);
      });
    });
  });
});
