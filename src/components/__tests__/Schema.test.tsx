/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { Schema } from '../';
import { OpenAPIParser, SchemaModel } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import { withTheme } from '../testProviders';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SchemaView', () => {
    const parser = new OpenAPIParser(
      { openapi: '3.0', info: { title: 'test', version: '0' }, paths: {} },
      undefined,
      options,
    );

    describe('Show minProperties/maxProperties constraints', () => {
      const schema = new SchemaModel(
        parser,
        {
          properties: {
            name: {
              type: 'object',
              minProperties: 1,
              properties: {
                address: {
                  type: 'string',
                },
              },
            },
          },
        },
        '',
        options,
      );
      const component = shallow(withTheme(<Schema schema={schema} />));
      expect(component.html().includes('non-empty')).toBe(true);
    });

    describe('Show range minProperties/maxProperties constraints', () => {
      const schema = new SchemaModel(
        parser,
        {
          properties: {
            name: {
              type: 'object',
              minProperties: 2,
              maxProperties: 10,
              additionalProperties: {
                type: 'string',
              },
            },
          },
        },
        '',
        options,
      );
      it('should includes [ 2 .. 10 ] properties', () => {
        const component = shallow(withTheme(<Schema schema={schema} />));
        expect(component.html().includes('[ 2 .. 10 ] properties')).toBe(true);
      });
    });
  });
});
