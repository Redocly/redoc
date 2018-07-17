/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import * as React from 'react';

import { OneOfSchema, Schema } from '../';
import { OpenAPIParser, SchemaModel } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SchemaView', () => {
    describe('OneOf', () => {
      it('should pass down skipReadOnly/skipReadWrite to nested oneOf', () => {
        const parser = new OpenAPIParser(
          { openapi: '3.0', info: { title: 'test', version: '0' }, paths: {} },
          undefined,
          options,
        );

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
  });
});
