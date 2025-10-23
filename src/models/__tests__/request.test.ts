import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';

import type { OpenAPIDefinition } from '../../types';
import type { OperationModel } from '../types';

import { getRequestBody } from '../request';
import { normalizeOptions, OpenAPIParser } from '../../services';

const opts = normalizeOptions({});
describe('request', () => {
  describe('getRequestBody', () => {
    let parser, props;

    beforeEach(() => {
      parser = new OpenAPIParser({ openapi: '3.0.0' } as OpenAPIDefinition, undefined, opts);
      props = {
        parser,
        infoOrRef: {},
        options: opts,
        isEvent: false,
      };
    });

    test('should work with default props', () => {
      const consoleError = jest.spyOn(global.console, 'error');
      const req = getRequestBody(props);
      expect(consoleError).not.toHaveBeenCalled();
      expect(req).toEqual({ description: '', required: undefined });
    });

    test('should work with set required', () => {
      const consoleError = jest.spyOn(global.console, 'error');
      props.infoOrRef.required = false;
      const req = getRequestBody(props);
      expect(consoleError).not.toHaveBeenCalled();
      expect(req).toEqual({ description: '', required: false });
    });

    test('should have correct field property when it includes allOf', () => {
      const spec = parseYaml(outdent`
          openapi: 3.0.0
          paths:
            /user:
              post:
                tags:
                  - user
                summary: Create user
                description: This can only be done by the logged in user.
                operationId: createUser
                requestBody:
                  content:
                    application/json:
                      schema:
                        $ref: '#/components/schemas/User'
                  description: Created user object
                  required: true
          components:
            schemas:
              User:
                allOf:
                  - type: object
                    properties:
                      name:
                        type: string
                        description: correct description name
                        readOnly: false
                        writeOnly: false
                        allOf:
                          - $ref: '#/components/schemas/NameField'
              NameField:
                description: name description
                readOnly: true
                writeOnly: true
          `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const req = getRequestBody({
        parser,
        infoOrRef: spec.paths['/user'].post.requestBody,
        options: opts,
        isEvent: false,
        operation: {} as OperationModel,
      });
      expect(req.content?.mediaTypes[0].schema?.fields?.[0].schema.readOnly).toBe(false);
      expect(req.content?.mediaTypes[0].schema?.fields?.[0].schema.writeOnly).toBe(false);
      expect(req.content?.mediaTypes[0].schema?.fields?.[0].description).toMatchInlineSnapshot(
        `"correct description name"`,
      );
    });
  });
});
