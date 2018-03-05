import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { filterPropsDeep } from '../../../utils/test-utils';

import { RedocNormalizedOptions } from '../../../services/RedocNormalizedOptions';
import { OpenAPIParser, SchemaModel } from '../../../services';
import { Schema } from '../Schema';
import { OneOfSchema } from '../OneOfSchema';

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
