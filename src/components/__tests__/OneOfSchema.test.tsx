/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { OneOfSchema, Schema } from '../';
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

    describe('OneOf', () => {
      it('should pass down skipReadOnly/skipReadWrite to nested oneOf', () => {
        const schema = new SchemaModel(
          parser,
          { oneOf: [{ type: 'string' }, { type: 'integer' }] },
          '',
          options,
        );
        let schemaViewElement = shallow(
          <Schema schema={schema} skipWriteOnly={true} />,
        ).getElement();
        expect(schemaViewElement.type).toEqual(OneOfSchema);
        expect(schemaViewElement.props.skipWriteOnly).toBeTruthy();
        expect(schemaViewElement.props.skipReadOnly).toBeFalsy();

        schemaViewElement = shallow(<Schema schema={schema} skipReadOnly={true} />).getElement();

        expect(schemaViewElement.type).toEqual(OneOfSchema);
        expect(schemaViewElement.props.skipWriteOnly).toBeFalsy();
        expect(schemaViewElement.props.skipReadOnly).toBeTruthy();
      });
    });

    describe('OneOf deprecated', () => {
      const schema = new SchemaModel(
        parser,
        { oneOf: [{ type: 'string', deprecated: true }, { type: 'integer' }] },
        '',
        options,
      );

      it('should match snapshot', () => {
        const component = shallow(withTheme(<Schema schema={schema} />));
        expect(component.render()).toMatchSnapshot();
      });
    });

    describe('Show minProperties/maxProperties constraints oneOf', () => {
      const schema = new SchemaModel(
        parser,
        {
          oneOf: [
            {
              type: 'object',
              description: 'Test description',
              minProperties: 1,
              maxProperties: 1,
              additionalProperties: {
                type: 'string',
                description: 'The name and value o',
              },
            },
          ],
        },
        '',
        options,
      );

      const component = shallow(withTheme(<Schema schema={schema} />));
      expect(component.html().includes('= 1 properties')).toBe(true);
    });
  });
});
