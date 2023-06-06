import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';
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
      expect(req).toEqual({ description: '', required: undefined });
    });

    test('should work with set required', () => {
      const consoleError = jest.spyOn(global.console, 'error');
      props.infoOrRef.required = false;
      const req = new RequestBodyModel(props);
      expect(consoleError).not.toHaveBeenCalled();
      expect(req).toEqual({ description: '', required: false });
    });

    test('should have correct field data when it includes allOf', () => {
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
      const req = new RequestBodyModel({
        parser,
        infoOrRef: spec.paths['/user'].post.requestBody,
        options: opts,
        isEvent: false,
      });
      const nameField = req.content?.mediaTypes[0].schema?.fields?.[0];
      expect(nameField?.schema.readOnly).toBe(false);
      expect(nameField?.schema.writeOnly).toBe(false);
      expect(nameField?.description).toMatchInlineSnapshot(`"correct description name"`);
    });
  });
});
